# Blender (4.x) — your buildings of the island, as you arranged them in Assets/modelos/isla_edificios.glb:
#   blender -b -P scripts/edificios-layout.py -- <isla_edificios.glb> <out.glb> <out.json>
#
# out.glb: the same buildings, lighter for the page (corners welded, no normals: the page makes them).
# out.json: each object of yours (each building, place, landmark, route house) — its transform and its
# box on the island, in the page's coordinates (y up): where it stands, which way, how big.
import bpy, sys, json, bmesh, math, mathutils

argv = sys.argv[sys.argv.index("--") + 1:]
src, out_glb, out_json = argv[0], argv[1], argv[2]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)

# Blender (z up) → the page (y up): x, z, -y
B = mathutils.Matrix(((1, 0, 0, 0), (0, 0, 1, 0), (0, -1, 0, 0), (0, 0, 0, 1)))
Bi = B.inverted()


def three(m):
    t = B @ m @ Bi
    return [t[r][c] for c in range(4) for r in range(4)]  # column-major, like THREE.Matrix4


if not any(o.type == 'MESH' for o in bpy.context.scene.objects):
    # (only the empties came: the file was saved without its meshes — the page keeps the last ones)
    print("edificios: the file has no meshes")
    sys.exit(3)
def roofs_of(meshes, base):
    """
    The roofs of a building, as they really are: its flat tops (faces looking up), each as a rectangle
    turned like its walls, at the height of its edge (the top of its parapet). The main ones only —
    not the little boxes on top (water tanks, stair houses), nor a lower step under a higher one; a
    group of buildings (the Tertulia) has one per building.
    """
    faces = []
    for o in meshes:
        mw = o.matrix_world
        n3 = mw.to_3x3()
        for p in o.data.polygons:
            n = (n3 @ p.normal).normalized()
            if n.z < 0.9:
                continue
            vs = [mw @ o.data.vertices[i].co for i in p.vertices]
            z = sum(v.z for v in vs) / len(vs)
            if z < base + 0.12:
                continue  # (the ground of the place: its plazas, its gardens)
            area = p.area * abs(n3.determinant()) ** (2 / 3)
            faces.append({"z": z, "a": area, "v": [(v.x, v.y) for v in vs]})
    if not faces:
        return []
    # (the flat tops: faces at one height that touch each other)
    key = lambda q: (round(q[0], 3), round(q[1], 3))
    groups = {}
    for f in faces:
        groups.setdefault(round(f["z"] / 0.015), []).append(f)
    regions = []
    for fs in groups.values():
        parent = list(range(len(fs)))
        def find(i):
            while parent[i] != i:
                parent[i] = parent[parent[i]]
                i = parent[i]
            return i
        owner = {}
        for i, f in enumerate(fs):
            for v in f["v"]:
                k = key(v)
                if k in owner:
                    parent[find(i)] = find(owner[k])
                else:
                    owner[k] = i
        comp = {}
        for i in range(len(fs)):
            comp.setdefault(find(i), []).append(fs[i])
        for c in comp.values():
            regions.append({"z": max(f["z"] for f in c), "a": sum(f["a"] for f in c), "faces": c})

    def rect(fs):
        # (which way its walls run: the longest edges, folded into a quarter turn)
        # (only its outline: the edges of one face alone — the diagonals inside, of its triangles,
        # turned it askew)
        count = {}
        for f in fs:
            v = f["v"]
            for i in range(len(v)):
                e = tuple(sorted((key(v[i]), key(v[(i + 1) % len(v)]))))
                count[e] = count.get(e, 0) + 1
        sx = sy = 0
        for (p, q), k in count.items():
            if k != 1:
                continue
            dx, dy = q[0] - p[0], q[1] - p[1]
            L = (dx * dx + dy * dy) ** 0.5
            a = 4 * math.atan2(dy, dx)
            sx += L * math.cos(a); sy += L * math.sin(a)
        th = math.atan2(sy, sx) / 4
        c, s = math.cos(th), math.sin(th)
        pts = [(x * c + y * s, -x * s + y * c) for f in fs for (x, y) in f["v"]]
        u0, u1 = min(p[0] for p in pts), max(p[0] for p in pts)
        w0, w1 = min(p[1] for p in pts), max(p[1] for p in pts)
        return th, c, s, u0, u1, w0, w1

    for r in regions:
        th, c, s, u0, u1, w0, w1 = rect(r["faces"])
        cu, cw = (u0 + u1) / 2, (w0 + w1) / 2
        r["rect"] = (th, c, s, u0, u1, w0, w1, cu * c - cw * s, cu * s + cw * c)

    def over(r, q):
        # (is r's middle over q's roof?)
        th, c, s, u0, u1, w0, w1, cx, cy = r["rect"]
        _, qc, qs, qu0, qu1, qw0, qw1, _, _ = q["rect"]
        u, w = cx * qc + cy * qs, -cx * qs + cy * qc
        return qu0 < u < qu1 and qw0 < w < qw1

    out = []
    for r in sorted(regions, key=lambda r: -r["z"]):
        if r["a"] < 0.04:
            continue
        # (the little boxes on a roof — stair houses, water tanks —: over a bigger roof, lower down)
        if any(q is not r and q["a"] > r["a"] * 1.6 and q["z"] < r["z"] and over(r, q) for q in regions):
            continue
        th, c, s, u0, u1, w0, w1, cx, cy = r["rect"]
        # (a lower step that runs into a higher roof — its lights went through the walls above —: no)
        pts = [(u, w) for u in (u0, (u0 + u1) / 2, u1) for w in (w0, (w0 + w1) / 2, w1)]
        pts = [(u * c - w * s, u * s + w * c) for (u, w) in pts]
        def inside(px, py, q, pad=0.03):
            return abs((px - q["bx"]) * q["c"] + (py - q["by"]) * q["s"]) < q["hw"] + pad and abs(-(px - q["bx"]) * q["s"] + (py - q["by"]) * q["c"]) < q["hd"] + pad
        def corners(q):
            return [(q["bx"] + a * q["hw"] * q["c"] - b * q["hd"] * q["s"], q["by"] + a * q["hw"] * q["s"] + b * q["hd"] * q["c"]) for a in (-1, 1) for b in (-1, 1)]
        mine = {"bx": cx, "by": cy, "c": c, "s": s, "hw": (u1 - u0) / 2, "hd": (w1 - w0) / 2}
        if any(any(inside(px, py, q) for (px, py) in pts) or any(inside(px, py, mine) for (px, py) in corners(q)) for q in out):
            continue
        # (its edge: the top of the parapet round it, if it has one — the faces near its border)
        z = r["z"]
        for f in faces:
            uw = [(x * c + y * s, -x * s + y * c) for (x, y) in f["v"]]
            # (the top of a parapet is a narrow strip — not a box standing on the edge of the roof)
            if min(max(p[0] for p in uw) - min(p[0] for p in uw), max(p[1] for p in uw) - min(p[1] for p in uw)) > 0.12:
                continue
            for (u, w) in uw:
                inside = u0 - 0.1 < u < u1 + 0.1 and w0 - 0.1 < w < w1 + 0.1
                border = min(u - u0, u1 - u, w - w0, w1 - w) < 0.1
                if inside and border and r["z"] <= f["z"] < r["z"] + 0.8:  # (its parapet, however tall)
                    z = max(z, f["z"])
                    u0, u1, w0, w1 = min(u0, u), max(u1, u), min(w0, w), max(w1, w)
        cu, cw = (u0 + u1) / 2, (w0 + w1) / 2
        cx, cy = cu * c - cw * s, cu * s + cw * c
        if min(u1 - u0, w1 - w0) < 0.3:
            continue  # (a ledge, a cornice: not a roof)
        out.append({"bx": cx, "by": cy, "c": c, "s": s, "hw": (u1 - u0) / 2, "hd": (w1 - w0) / 2, "z": z, "th": th})
    # page coordinates: x, z = -y; its turn as three.js rotation.y (the walls along x turned by th)
    return [{"x": round(q["bx"], 4), "z": round(-q["by"], 4), "yaw": round(q["th"], 4), "w": round(2 * q["hw"], 4), "d": round(2 * q["hd"], 4), "y": round(q["z"], 4)} for q in out]


roots = [o for o in bpy.context.scene.objects if o.parent is None]
items = []
for r in roots:
    meshes = [o for o in [r, *r.children_recursive] if o.type == 'MESH']
    if not meshes:
        continue
    mw = r.matrix_world
    rot = mw.to_quaternion()
    inv = rot.inverted()
    lo = mathutils.Vector((1e9,) * 3); hi = -lo
    for o in meshes:
        for v in o.data.vertices:
            p = inv @ ((o.matrix_world @ v.co) - mw.translation)  # in its own frame (turned with it, its scale kept)
            lo = mathutils.Vector(map(min, lo, p)); hi = mathutils.Vector(map(max, hi, p))
    c = mw.translation + rot @ ((lo + hi) / 2)
    roofs = roofs_of(meshes, mw.translation.z + lo.z)
    # (the top of its roof — the point of the kiosk — and how far its eaves reach round it)
    allv = [o.matrix_world @ v.co for o in meshes for v in o.data.vertices]
    apex = max(allv, key=lambda p: p.z)
    zb, zt = min(p.z for p in allv), apex.z
    rim = max((p for p in allv if p.z > zb + (zt - zb) * 0.6), key=lambda p: (p.x - apex.x) ** 2 + (p.y - apex.y) ** 2)
    eave = ((rim.x - apex.x) ** 2 + (rim.y - apex.y) ** 2) ** 0.5
    items.append({
        "apex": [round(apex.x, 4), round(apex.z, 4), round(-apex.y, 4)], "eave": round(eave, 4), "eaveY": round(rim.z, 4),
        # (its roofs: where the lights of the Alumbrado go, along their edges — page coordinates)
        "roofs": roofs,
        "name": r.name,
        "matrix": three(mw),
        # (its box: centre on the island x / z, which way it turns, how wide / deep / tall, its foot)
        "box": {"x": round(c.x, 4), "z": round(-c.y, 4), "yaw": round(rot.to_euler().z, 4),
                "w": round(hi.x - lo.x, 4), "d": round(hi.y - lo.y, 4), "h": round(hi.z - lo.z, 4),
                "y": round(mw.translation.z + lo.z, 4)},
    })

# lighter: corners welded (a shape stays closed) and no normals
for o in bpy.context.scene.objects:
    if o.type != 'MESH':
        continue
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(o.data); bm.free()
    textured = any(n.type == 'TEX_IMAGE' for m in o.data.materials if m and m.use_nodes for n in m.node_tree.nodes)
    if not textured:
        for uv in list(o.data.uv_layers):
            o.data.uv_layers.remove(uv)
bpy.ops.export_scene.gltf(filepath=out_glb, export_format='GLB', export_yup=True, export_normals=False)
json.dump({"_info": "Escrito por scripts/edificios-layout.py desde Assets/modelos/isla_edificios.glb (tus edificios acomodados): cada objeto con su transformación y su caja en la isla.", "items": items}, open(out_json, "w", encoding="utf-8"), indent=1)
print("edificios: %d objects" % len(items))
