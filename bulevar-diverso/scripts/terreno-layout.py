# Blender (4.x) — your terrain of the island, as you made it in Assets/modelos/isla_terreno.glb:
#   blender -b -P scripts/terreno-layout.py -- <isla_terreno.glb> <out.glb> <out.json>
#
# out.glb: its GROUND (cliff, lawn, streets, walks, zebras, the Bulevar, the ciclorruta, the tunnel,
# the walls of the river, the bridges…), lighter for the page (corners welded, no normals). What the
# page draws itself — because it moves or lights up: the water of the river and its stones, the
# trees, the lamps, the traffic lights, the benches and furniture, the kiosk — is left out, and so is
# what lies far from the island (a piece left floating in the air). The Puente Ortiz (your model, the
# objects with no colour where it stands) is painted like the photo: white, the feet of its piers in
# red brick. Where your lawn sank (a hole in the top of the island) it is filled at the top: relleno_cesped.
# out.json: the names of what is in it.
import bpy, sys, json, bmesh, re, mathutils, math

argv = sys.argv[sys.argv.index("--") + 1:]
src, out_glb, out_json = argv[0], argv[1], argv[2]
# --tal-cual: your whole island as you arranged it (scripts/isla-acomodada.py): everything stays as you
# left it — the trees, the lamps, the benches, the stones of the river — and nothing is added
TAL_CUAL = "--tal-cual" in argv
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)

PAGE = re.compile(r"^(rio_agua)" if TAL_CUAL else r"^(arboles|palmeras|postes_de_luz|semaforos|bancas|bulevar_asientos|bulevar_sillas|bulevar_bancas|hito_kiosko|rio_agua|rio_piedras|flores|jardineras)", re.I)
PUENTE = (17.6, 19.2)  # x where the Puente Ortiz stands (Blender: x along, y across, z up)


def world_box(o):
    pts = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
    return [min(p[i] for p in pts) for i in range(3)], [max(p[i] for p in pts) for i in range(3)]


def mat(name, hexcol):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    c = [int(hexcol[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = [(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4) for v in c] + [1]
    return m


removed, kept = [], []
for o in list(bpy.context.scene.objects):
    if o.type != 'MESH':
        continue
    lo, hi = world_box(o)
    far = lo[2] > 5 or hi[2] < -40 or abs((lo[0] + hi[0]) / 2) > 40 or abs((lo[1] + hi[1]) / 2) > 30
    if PAGE.match(o.name) or far:
        removed.append(o.name)
        bpy.data.objects.remove(o)
        continue
    kept.append(o.name)

# the Puente Ortiz (your model, at the bridge: its pieces with no colour, or the pieces of it of your
# island — Cubo…, Plano… —) painted like the photo: white all of it — its body, its arches, its deck,
# its railing —, the feet of its piers down by the water in red, and the rings of the railing — the
# little faces round its holes — in red, like the medallions along it
white, brick, rings = mat("puente_blanco_F4F3EE", "#F4F3EE"), mat("puente_pies_rojos_C0392B", "#C0392B"), mat("puente_medallones_A0322B", "#A0322B")
for o in bpy.context.scene.objects:
    if o.type != 'MESH':
        continue
    mine = re.match(r"^(Cubo|Plano)\d", o.name)
    if not mine and any(s.material for s in o.material_slots):
        continue
    lo, hi = world_box(o)
    if not (PUENTE[0] - 1.5 < (lo[0] + hi[0]) / 2 < PUENTE[1] + 1.5):
        continue
    me = o.data
    me.materials.clear()
    for m in (white, brick, rings):
        me.materials.append(m)
    mw = o.matrix_world
    n3 = mw.to_3x3()
    top = hi[2]
    # (its deck: the flat top it has most of)
    decks = {}
    for p in me.polygons:
        n = (n3 @ p.normal).normalized()
        if n.z > 0.9:
            z = round((mw @ p.center).z, 2)
            decks[z] = decks.get(z, 0) + p.area
    deck = max(decks, key=decks.get) if decks else lo[2] + (top - lo[2]) * 0.7
    for p in me.polygons:
        c = mw @ p.center
        vs = [mw @ me.vertices[i].co for i in p.vertices]
        n = (n3 @ p.normal).normalized()
        area = p.area * abs(n3.determinant()) ** (2 / 3)
        zspan = max(v.z for v in vs) - min(v.z for v in vs)
        wide = max(max(v.x for v in vs) - min(v.x for v in vs), max(v.y for v in vs) - min(v.y for v in vs))
        p.material_index = 0
        # (up to a little above the water — it runs at 0.1 —, the faces of the piers that look along the
        # river: their pointed feet; not the undersides of the arches)
        if c.z < 0.17 and area < 0.06 and abs(n.z) < 0.5 and abs(n.x) > 0.3 and abs(n.y) > 0.3:  # (slanted: the points)
            p.material_index = 1  # (the feet of the piers, down by the water, and their cutwaters)
        elif deck + 0.02 < c.z < top - 0.012 and area < 0.0015 and (abs(n.z) > 0.9 or (wide <= 0.026 and zspan <= 0.036)):
            p.material_index = 2  # (round its holes: the rings)
    print("puente pintado:", o.name)
    # (and in each hole of its railing a round red medallion, like the photo: the faces round each
    # hole, together, tell where it is, which way it goes through and how big it is)
    ring = [p for p in me.polygons if p.material_index == 2]
    cs = [mw @ p.center for p in ring]
    parent = list(range(len(ring)))
    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]; i = parent[i]
        return i
    cells = {}
    for i, c in enumerate(cs):
        cells.setdefault((round(c.x / 0.02), round(c.y / 0.02), round(c.z / 0.02)), []).append(i)
    for (cx, cy, cz), idx in cells.items():
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for dz in (-1, 0, 1):
                    for j in cells.get((cx + dx, cy + dy, cz + dz), []):
                        for i in idx:
                            if (cs[i] - cs[j]).length < 0.022:
                                parent[find(i)] = find(j)
    holes = {}
    for i in range(len(ring)):
        holes.setdefault(find(i), []).append(i)
    # (the faces of the railing itself: big, upright, above the deck)
    faces_out = []
    for p in me.polygons:
        n = (n3 @ p.normal).normalized()
        if p.material_index == 2 or abs(n.z) > 0.3:
            continue
        cc = mw @ p.center
        if cc.z > deck + 0.01 and p.area * abs(n3.determinant()) ** (2 / 3) > 0.0004:
            faces_out.append((cc, n))
    bm = bmesh.new()
    made = 0
    for ids in holes.values():
        if len(ids) < 2:
            continue
        hv = [mw @ me.vertices[vi].co for i in ids for vi in ring[i].vertices]
        c = mathutils.Vector([(min(v[k] for v in hv) + max(v[k] for v in hv)) / 2 for k in range(3)])  # (the middle of the hole)
        # (through the hole, across the railing: the way the face of the railing nearest to it looks —
        # on its curves too)
        near = min(faces_out, key=lambda q: (q[0] - c).length) if faces_out else None
        if near is None:
            continue
        axis = mathutils.Vector((near[1].x, near[1].y, 0))
        if axis.length < 1e-6:
            continue
        axis.normalize()
        up = mathutils.Vector((0, 0, 1)); along = up.cross(axis).normalized()
        r_in = max(0.005, min(0.0095, (max(v.z for v in hv) - min(v.z for v in hv)) / 2))  # (all the size of those on the straight railing)
        r_out = r_in * 1.9
        # (the railing's thickness: the corners of the walls of the hole, across it)
        half = max(0.004, max(abs(((mw @ me.vertices[vi].co) - c).dot(axis)) for i in ids for vi in ring[i].vertices)) + 0.0015
        for s in (1, -1):
            o_c = c + axis * (half * s)
            inner, outer = [], []
            N = 16
            for k in range(N):
                ang = 2 * math.pi * k / N
                d = along * math.cos(ang) + up * math.sin(ang)
                inner.append(bm.verts.new(o_c + d * r_in))
                outer.append(bm.verts.new(o_c + d * r_out))
            for k in range(N):
                q = [inner[k], inner[(k + 1) % N], outer[(k + 1) % N], outer[k]]
                f = bm.faces.new(q if s > 0 else q[::-1])
        made += 1
    # (the hole itself stays white, like the railing)
    for p in ring:
        p.material_index = 0
    if made:
        dm = bpy.data.meshes.new("puente_medallones")
        bm.to_mesh(dm)
        dm.materials.append(rings)
        disc = bpy.data.objects.new("puente_medallones_" + o.name, dm)
        bpy.context.scene.collection.objects.link(disc)
        kept.append(disc.name)
        print("medallones:", made)
    bm.free()
# (the flat streets and walks: the same shape, its triangles laid again — evenly, not in long
# slivers: those opened hair-thin cracks and came out in stripes)
FLAT = re.compile(r"^(calle|Plane|anden|cuadras|bulevar_peatonal|bulevar_corredor|ciclorruta_\d|retreta|suelo_gato)", re.I)
for o in bpy.context.scene.objects:
    if o.type != 'MESH' or not FLAT.match(o.name):
        continue
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(1), verts=bm.verts, edges=bm.edges, delimit={'MATERIAL'})
    bmesh.ops.triangulate(bm, faces=bm.faces, quad_method='BEAUTY', ngon_method='BEAUTY')
    bm.to_mesh(o.data); bm.free()

# lighter: corners welded (a shape stays closed), no normals, texture coordinates only where there is a texture
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

# where your terrain has street, and where walk / path (a map of cells, in the page's coordinates:
# x along, z across — Blender -y): the page puts its lamps, trees and cars where they belong on it
import base64
CELL, X0, Z0, NX, NZ = 0.1, -24.0, -9.0, 480, 180
STREET = re.compile(r"^(calle|Plane($|[._]))", re.I)
WALK = re.compile(r"^(anden|bulevar_peatonal|bulevar_corredor|ciclorruta(_\d|$)|retreta_caminos|suelo_gato|pasarela)", re.I)
PATH = re.compile(r"^(retreta_caminos)", re.I)
LAND = re.compile(r"^(isla_cesped)", re.I)  # (the top of the island: where its edge is)
layers = {"street": bytearray(NX * NZ), "walk": bytearray(NX * NZ), "path": bytearray(NX * NZ), "land": bytearray(NX * NZ)}


def raster(o, grid):
    mw = o.matrix_world
    me = o.data
    me.calc_loop_triangles()
    vs = [mw @ v.co for v in me.vertices]
    for tri in me.loop_triangles:
        a, b, c = (vs[i] for i in tri.vertices)
        # page coordinates: x, z = -y
        pts = [(p.x, -p.y) for p in (a, b, c)]
        xs, zs = [p[0] for p in pts], [p[1] for p in pts]
        i0, i1 = max(0, int((min(xs) - X0) / CELL)), min(NX - 1, int((max(xs) - X0) / CELL))
        j0, j1 = max(0, int((min(zs) - Z0) / CELL)), min(NZ - 1, int((max(zs) - Z0) / CELL))
        (ax, az), (bx, bz), (cx, cz) = pts
        d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz)
        if abs(d) < 1e-12:
            continue
        for i in range(i0, i1 + 1):
            x = X0 + (i + 0.5) * CELL
            for j in range(j0, j1 + 1):
                z = Z0 + (j + 0.5) * CELL
                l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d
                l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d
                if l1 >= -0.02 and l2 >= -0.02 and 1 - l1 - l2 >= -0.02:
                    grid[i * NZ + j] = 1


# the holes in the top of your island: where your lawn sank below the top (a step, a dent left
# where a street was taken out), a patch of the same lawn closes it, at the top
TOP = 0.3
height = [-99.0] * (NX * NZ)
owner = [None] * (NX * NZ)
for o in bpy.context.scene.objects:
    if o.type != 'MESH' or TAL_CUAL:  # (your island as you left it: nothing is added)
        continue
    mw = o.matrix_world
    me = o.data
    me.calc_loop_triangles()
    vs = [mw @ v.co for v in me.vertices]
    for tri in me.loop_triangles:
        a, b, c = (vs[i] for i in tri.vertices)
        pts = [(p.x, -p.y, p.z) for p in (a, b, c)]
        xs, zs = [p[0] for p in pts], [p[1] for p in pts]
        i0, i1 = max(0, int((min(xs) - X0) / CELL)), min(NX - 1, int((max(xs) - X0) / CELL))
        j0, j1 = max(0, int((min(zs) - Z0) / CELL)), min(NZ - 1, int((max(zs) - Z0) / CELL))
        (ax, az, ay), (bx, bz, by), (cx, cz, cy) = pts
        d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz)
        if abs(d) < 1e-12:
            continue
        for i in range(i0, i1 + 1):
            x = X0 + (i + 0.5) * CELL
            for j in range(j0, j1 + 1):
                z = Z0 + (j + 0.5) * CELL
                l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d
                l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d
                l3 = 1 - l1 - l2
                if l1 >= -0.01 and l2 >= -0.01 and l3 >= -0.01:
                    y = l1 * ay + l2 * by + l3 * cy
                    k = i * NZ + j
                    if y > height[k]:
                        height[k], owner[k] = y, o
holes = [k for k in range(NX * NZ) if owner[k] is not None and LAND.match(owner[k].name) and TOP - 0.8 < height[k] < TOP - 0.03]
if holes:
    lawn = next((o for o in bpy.context.scene.objects if o.type == 'MESH' and LAND.match(o.name)), None)
    bm = bmesh.new()
    verts = {}
    def vert(i, j):
        if (i, j) not in verts:
            verts[(i, j)] = bm.verts.new((X0 + i * CELL, -(Z0 + j * CELL), TOP))
        return verts[(i, j)]
    for k in holes:
        i, j = divmod(k, NZ)
        # (counter-clockwise seen from above, in Blender: x, -z)
        bm.faces.new((vert(i, j), vert(i, j + 1), vert(i + 1, j + 1), vert(i + 1, j)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for f in bm.faces:
        if f.normal.z < 0:
            f.normal_flip()
    me = bpy.data.meshes.new("relleno_cesped")
    bm.to_mesh(me); bm.free()
    if lawn and lawn.data.materials:
        me.materials.append(lawn.data.materials[0])
    patch = bpy.data.objects.new("isla_cesped_relleno", me)
    bpy.context.scene.collection.objects.link(patch)
    kept.append(patch.name)
    print("huecos cerrados: %d celdas" % len(holes))
    for k in holes:
        height[k] = TOP



for o in bpy.context.scene.objects:
    if o.type != 'MESH':
        continue
    if LAND.match(o.name):
        raster(o, layers["land"])
    if STREET.match(o.name):
        raster(o, layers["street"])
    elif WALK.match(o.name):
        raster(o, layers["walk"])
        if PATH.match(o.name):
            raster(o, layers["path"])


def pack(grid):
    bits = bytearray((len(grid) + 7) // 8)
    for k, v in enumerate(grid):
        if v:
            bits[k >> 3] |= 1 << (k & 7)
    return base64.b64encode(bytes(bits)).decode()


# (your island as you left it: a tree standing in the air — over a dip of the lawn, or past the edge —
# goes down onto the ground under it, or a little in, onto the lawn next to it; the rest stays)
if TAL_CUAL:
    GROUND = re.compile(r"^(isla_cesped|calle|anden|bulevar_peatonal|bulevar_corredor|ciclorruta|cuadras|Plane|retreta|suelo_gato|pasarela|rio_muros|tunel)", re.I)
    gh = {}
    for o in bpy.context.scene.objects:
        if o.type != 'MESH' or not GROUND.match(o.name):
            continue
        mw = o.matrix_world
        me = o.data
        me.calc_loop_triangles()
        vs = [mw @ v.co for v in me.vertices]
        for tri in me.loop_triangles:
            a, b, c = (vs[i] for i in tri.vertices)
            if abs(((b - a).cross(c - a)).normalized().z) < 0.5:
                continue  # (walls: not ground to stand on)
            pts = [(p.x, -p.y, p.z) for p in (a, b, c)]
            xs, zs = [p[0] for p in pts], [p[1] for p in pts]
            i0, i1 = max(0, int((min(xs) - X0) / CELL)), min(NX - 1, int((max(xs) - X0) / CELL))
            j0, j1 = max(0, int((min(zs) - Z0) / CELL)), min(NZ - 1, int((max(zs) - Z0) / CELL))
            (ax, az, ay), (bx, bz, by), (cx, cz, cy) = pts
            d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz)
            if abs(d) < 1e-12:
                continue
            for i in range(i0, i1 + 1):
                x = X0 + (i + 0.5) * CELL
                for j in range(j0, j1 + 1):
                    z = Z0 + (j + 0.5) * CELL
                    l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d
                    l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d
                    if l1 >= -0.01 and l2 >= -0.01 and 1 - l1 - l2 >= -0.01:
                        y = l1 * ay + l2 * by + (1 - l1 - l2) * cy
                        if y > gh.get((i, j), -99):
                            gh[(i, j)] = y
    settled = 0
    for o in list(bpy.context.scene.objects):
        if o.parent is not None or not re.match(r"^(arboles|palmeras)", o.name):
            continue
        ms = [c for c in [o] + list(o.children_recursive) if c.type == 'MESH']
        pts = [c.matrix_world @ v.co for c in ms for v in c.data.vertices]
        if not pts:
            continue
        base = min(p.z for p in pts)
        fx, fz = sum(p.x for p in pts) / len(pts), -sum(p.y for p in pts) / len(pts)
        ci, cj = int((fx - X0) / CELL), int((fz - Z0) / CELL)
        g = gh.get((ci, cj), -99)
        if base - g < 0.03:
            continue  # (on the ground)
        # (the nearest ground at its height, within a few steps: it goes there)
        best = None
        for r in range(1, 9):
            for di in range(-r, r + 1):
                for dj in range(-r, r + 1):
                    if max(abs(di), abs(dj)) != r:
                        continue
                    h = gh.get((ci + di, cj + dj), -99)
                    if abs(h - base) < 0.03 and (best is None or di * di + dj * dj < best[0]):
                        best = (di * di + dj * dj, di, dj)
            if best:
                break
        if best:
            o.location.x += best[1] * CELL
            o.location.y -= best[2] * CELL
        elif g > -50:
            o.location.z += g - base
        else:
            continue
        settled += 1
    bpy.context.view_layer.update()
    print("arboles asentados: %d" % settled)

# (your island as you left it: where its lamps and trees stand — the page lights the lamps at night
# and the Alumbrado hangs its little lights in the crowns of the trees)
lamps, trees, furniture = [], [], []
if TAL_CUAL:
    for o in bpy.context.scene.objects:
        if o.parent is not None or o.type != 'EMPTY':
            continue
        pts = [c.matrix_world @ mathutils.Vector(v) for c in o.children_recursive if c.type == 'MESH' for v in c.bound_box]
        if not pts:
            continue
        x, z = o.matrix_world.translation.x, -o.matrix_world.translation.y
        h = max(p.z for p in pts) - min(p.z for p in pts)
        w = max(max(p.x for p in pts) - min(p.x for p in pts), max(p.y for p in pts) - min(p.y for p in pts))
        if re.match(r"^postes_de_luz", o.name):
            lamps.append({"x": round(x, 3), "z": round(z, 3), "h": round(h, 3)})
        elif re.match(r"^(arboles|palmeras)", o.name) and not re.match(r"^arboles_(copas|troncos)", o.name):
            trees.append({"x": round(x, 3), "z": round(z, 3), "y": round(min(p.z for p in pts), 3), "h": round(h, 3), "w": round(w, 3), "palm": o.name.startswith("palmeras")})
    # (where its benches and furniture are, seen from above: the tents of the Feria keep off them —
    # each loose part of a piece on its own: one piece of colour holds many benches)
    FURNITURE = re.compile(r"^(bancas|bulevar_bancas|bulevar_asientos|bulevar_sillas|bulevar_jardineras|jardineras)", re.I)
    boxes = []
    for o in bpy.context.scene.objects:
        if o.type != 'MESH':
            continue
        top = o
        while top.parent is not None:
            top = top.parent
        if not FURNITURE.match(top.name) and not FURNITURE.match(o.name):
            continue
        bm = bmesh.new(); bm.from_mesh(o.data)
        seen = set()
        for v0 in bm.verts:
            if v0.index in seen:
                continue
            stack, part = [v0], []
            seen.add(v0.index)
            while stack:
                v = stack.pop()
                part.append(o.matrix_world @ v.co)
                for e in v.link_edges:
                    u = e.other_vert(v)
                    if u.index not in seen:
                        seen.add(u.index); stack.append(u)
            xs, zs = [p.x for p in part], [-p.y for p in part]
            boxes.append([min(xs), min(zs), max(xs), max(zs)])
        bm.free()
    furniture = [[round(v, 3) for v in b] for b in boxes]
ground = {"cell": CELL, "x0": X0, "z0": Z0, "nx": NX, "nz": NZ, **{k: pack(g) for k, g in layers.items()}}
json.dump({"_info": "Escrito por scripts/terreno-layout.py desde Assets/modelos/isla_terreno.glb (tu terreno): lo que la página dibuja de él, y dónde tiene calle, andén y caminos (ground: celdas de 0.1).", "items": kept, "left_out": removed, "ground": ground, **({"arranged": True, "lamps": lamps, "trees": trees, "furniture": furniture} if TAL_CUAL else {})}, open(out_json, "w", encoding="utf-8"), indent=1)
print("terreno: %d pieces, %d left out" % (len(kept), len(removed)))
try:
    bpy.ops.export_scene.gltf(filepath=out_glb, export_format='GLB', export_yup=True, export_normals=False, export_vertex_color='ACTIVE')
except TypeError:
    bpy.ops.export_scene.gltf(filepath=out_glb, export_format='GLB', export_yup=True, export_normals=False)
