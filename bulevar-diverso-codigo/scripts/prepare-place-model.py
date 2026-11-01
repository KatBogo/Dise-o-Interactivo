# Blender (4.x) — prepares a model of Assets/modelos for the page.
#   blender -b -P scripts/prepare-place-model.py -- <Assets/modelos/x.glb> <public/models/x.glb> [--preview x.png] [--force]
#
# The FIRST time a model is prepared (a model you just made or replaced):
#   1. only the over-detailed pieces are simplified (a wall subdivided into 110 000 triangles, a
#      tiny SketchUp detail with 112 000): flat faces merged first (the shape stays the same), then,
#      if still heavy, collapsed down to MAX_TRIS;
#   2. every face is turned outwards;
#   3. its real colours / textures are applied (scripts/place-colors.json);
#   4. an event (evento_*.glb) is laid out on the island (its pavilions along the walkway, with
#      strings of pennants) — scripts/feria-layout.json;
#   5. your original goes to Assets/modelos/originales/ and the PREPARED model replaces it in
#      Assets/modelos (that is the one to open and edit in Blender), and goes to public/models.
# After that (a model already prepared: it has the "_bulevar_preparado" mark) nothing of yours is
# changed again: it is only copied to the page. --force applies the colours again (used when the
# colours in place-colors.json change).
import bpy, bmesh, sys, os, re, json, math, shutil, random
import mathutils

argv = sys.argv[sys.argv.index("--") + 1:]
src, out = argv[0], argv[1]
png = argv[argv.index("--preview") + 1] if "--preview" in argv else None
FORCE = "--force" in argv
MAX_TRIS = 3000  # per piece
MARK = "_bulevar_preparado"
HERE = os.path.dirname(os.path.abspath(__file__))
NAME = os.path.splitext(os.path.basename(src))[0]

# RULE (from the author): the geometry of HER models is never changed — no simplifying, no pieces
# removed, rebuilt, subdivided or added, no faces turned. Only what is not geometry is prepared:
# colours, the material of each face and the texture coordinates.
KEEP_SHAPES = True

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
prepared = MARK in bpy.data.objects
recipes = json.load(open(os.path.join(HERE, "place-colors.json"), encoding="utf-8"))
recipe = recipes.get(NAME) if (not prepared or FORCE) else None


def meshes():
    return [o for o in bpy.context.scene.objects if o.type == 'MESH']


def tris(o):
    return sum(len(p.vertices) - 2 for p in o.data.polygons)


def apply(o, mod):
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier=mod.name)


# ── 1. light ─────────────────────────────────────────────────────────────────────
if not prepared and not KEEP_SHAPES:
    # stray pieces the recipe says to leave out (test curves floating off the plaza…)
    for name in (recipe or {}).get("remove", []):
        o = bpy.data.objects.get(name)
        if o:
            bpy.data.objects.remove(o)
            print("removed", name)
    if recipe and recipe.get("maxTris"):
        MAX_TRIS = recipe["maxTris"]  # (a model with fine detail, e.g. the gatas, keeps more)
    before = after = 0
    detail = (recipe or {}).get("detail", {})  # pieces that keep more triangles (the gatas)
    closed = (recipe or {}).get("closed", False)  # round pieces (the crowns of the trees): no holes
    for o in meshes():
        n = tris(o)
        before += n
        limit = detail.get(o.name, MAX_TRIS)
        if n > limit and closed:
            # (its corners welded first: a crown in loose pieces opens up when it is collapsed)
            bm = bmesh.new(); bm.from_mesh(o.data)
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
            bm.to_mesh(o.data); bm.free()
        if n > limit:
            # (curved, organic pieces — the gatas, the crowns — only collapse evenly: merging their
            # "flat" faces left long slivers, and the paint on them came out smeared)
            if o.name not in detail and not closed:
                d = o.modifiers.new("planar", 'DECIMATE')
                d.decimate_type = 'DISSOLVE'
                d.angle_limit = math.radians(2)
                apply(o, d)
            if tris(o) > limit:
                c = o.modifiers.new("collapse", 'DECIMATE')
                c.ratio = limit / tris(o)
                apply(o, c)
                bpy.context.view_layer.objects.active = o
                bpy.ops.object.shade_smooth()
            if closed:
                # (made light, a crown came out with holes: its corners welded and its holes closed)
                bm = bmesh.new(); bm.from_mesh(o.data)
                bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
                bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if e.is_boundary], sides=0)
                bmesh.ops.triangulate(bm, faces=bm.faces)
                bm.to_mesh(o.data); bm.free()
            print("simplified %-24s %7d -> %6d" % (o.name, n, tris(o)))
        after += tris(o)
    print("TOTAL %d -> %d triangles" % (before, after))

    # ── 2. faces outwards ────────────────────────────────────────────────────────
    seen = set()
    for o in meshes():
        if o.data.name in seen:
            continue
        seen.add(o.data.name)
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode='OBJECT')
        o.select_set(False)


# ── 3. colours ───────────────────────────────────────────────────────────────────
def objects_of(spec):
    m = re.fullmatch(r"(.+?)\.(\d+)\.\.(.+?)\.(\d+)", spec)  # "Cube.003..Cube.015"
    if m:
        names = {"%s.%0*d" % (m.group(1), len(m.group(2)), i) for i in range(int(m.group(2)), int(m.group(4)) + 1)}
        return [o for o in bpy.data.objects if o.name in names and o.type == 'MESH']
    o = bpy.data.objects.get(spec)
    return [o] if o and o.type == 'MESH' else []


def linear(hexcol):
    c = [int(hexcol[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return [(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4) for v in c] + [1]


made = {}


def material_for(rule):
    key = rule.get("image") or rule["color"]
    if key in made:
        return made[key]
    mat = bpy.data.materials.new(rule.get("name", "color") + "_" + key.strip("#").split(".")[0])
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = 0.8
    bsdf.inputs["Metallic"].default_value = 0
    if rule.get("image"):
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = bpy.data.images.load(os.path.join(HERE, "textures", rule["image"]))
        nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        if rule.get("normal"):
            ntex = nt.nodes.new("ShaderNodeTexImage")
            ntex.image = bpy.data.images.load(os.path.join(HERE, "textures", rule["normal"]))
            ntex.image.colorspace_settings.name = 'Non-Color'
            nmap = nt.nodes.new("ShaderNodeNormalMap")
            nt.links.new(ntex.outputs["Color"], nmap.inputs["Color"])
            nt.links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])
    else:
        bsdf.inputs["Base Color"].default_value = linear(rule["color"])
    made[key] = mat
    return mat


def matches(slot_mat, rule):
    """The rule's original material, or (already prepared) the material the rule itself made."""
    if rule["material"] is None:
        return True
    if not slot_mat:
        return False
    return slot_mat.name == rule["material"] or slot_mat.name.startswith(rule.get("name", "\0") + "_")


bounds = {}  # image → the area it was projected on


def project_uvs(o, slot_index, axis, image=None):
    """Flat projection of the faces of one material onto the image (seen from outside, upright)."""
    bm = bmesh.new()
    bm.from_mesh(o.data)
    uv = bm.loops.layers.uv.verify()
    mw = o.matrix_world
    faces = [f for f in bm.faces if f.material_index == slot_index]
    pts = [mw @ l.vert.co for f in faces for l in f.loops]
    if pts:
        a, b = (1, 2) if axis == "x" else (0, 2)
        if image in bounds:
            lo, hi = bounds[image]
        else:
            lo = [min(p[a] for p in pts), min(p[b] for p in pts)]
            hi = [max(p[a] for p in pts), max(p[b] for p in pts)]
            if image:
                bounds[image] = (lo, hi)
        for f in faces:
            for l in f.loops:
                p = mw @ l.vert.co
                l[uv].uv = ((hi[0] - p[a]) / ((hi[0] - lo[0]) or 1), (p[b] - lo[1]) / ((hi[1] - lo[1]) or 1))
    bm.to_mesh(o.data)
    bm.free()


def project_slope(o, slot_index, tile):
    """Roof tiles: on every face, u runs ACROSS its slope and v UP it (rows of tiles going down
    each side of the roof, whatever way it faces), in world metres / `tile` (the texture repeats)."""
    bm = bmesh.new()
    bm.from_mesh(o.data)
    uv = bm.loops.layers.uv.verify()
    mw = o.matrix_world
    rot = mw.to_3x3()
    for f in bm.faces:
        if f.material_index != slot_index:
            continue
        n = (rot @ f.normal).normalized()
        if n.z < 0:
            n = -n
        up = mathutils.Vector((0, 0, 1))
        if abs(n.z) > 0.985:  # (flat: any direction)
            across, upslope = mathutils.Vector((1, 0, 0)), mathutils.Vector((0, 1, 0))
        else:
            upslope = (up - n * up.dot(n)).normalized()  # up the slope, in the face
            across = upslope.cross(n).normalized()
        for l in f.loops:
            p = mw @ l.vert.co
            l[uv].uv = (p.dot(across) / tile[0], p.dot(upslope) / tile[1])
    bm.to_mesh(o.data)
    bm.free()


def project_box(o, slot_index, tile):
    """Cladding: every face gets the picture flat from its own side (the two axes across its
    normal), in world units / `tile` — the plates keep their size on every wall, any orientation."""
    bm = bmesh.new()
    bm.from_mesh(o.data)
    uv = bm.loops.layers.uv.verify()
    mw = o.matrix_world
    rot = mw.to_3x3()
    for f in bm.faces:
        if f.material_index != slot_index:
            continue
        n = rot @ f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        a, b = [(1, 2), (0, 2), (0, 1)][ax]
        for l in f.loops:
            p = mw @ l.vert.co
            l[uv].uv = (p[a] / tile, p[b] / tile)
    bm.to_mesh(o.data)
    bm.free()


def paint_floor(spec):
    """The ground of a place as zones: a fine grid laid on top of its floor, each cell coloured
    as path (stone tiles) or grass. Grass = the rectangles in `grass` and, with `lawnAround`, the
    ground a flood reaches from each object in `seeds` without crossing the `walls` (the bushes
    that line the paths), up to `radius`; `paths` rectangles are always path."""
    floor = bpy.data.objects[spec["floor"]]
    fp = [floor.matrix_world @ mathutils.Vector(c) for c in floor.bound_box]
    x0, x1 = min(p.x for p in fp), max(p.x for p in fp)
    y0, y1 = min(p.y for p in fp), max(p.y for p in fp)
    top = max(p.z for p in fp) + spec.get("lift", 0.004)
    cell = spec["cell"]
    nx, ny = max(1, int((x1 - x0) / cell)), max(1, int((y1 - y0) / cell))
    cx, cy = (x1 - x0) / nx, (y1 - y0) / ny
    grass = [[False] * ny for _ in range(nx)]
    inside = lambda r, x, y: r[0][0] <= x <= r[1][0] and r[0][1] <= y <= r[1][1]
    for i in range(nx):
        for j in range(ny):
            x, y = x0 + (i + 0.5) * cx, y0 + (j + 0.5) * cy
            if any(inside(r, x, y) for r in spec.get("grass", [])):
                grass[i][j] = True
    lawn = spec.get("lawnAround")
    if lawn:
        wall = [[False] * ny for _ in range(nx)]
        thick = lawn.get("thick", 0.35)
        for name in lawn["walls"]:
            o = bpy.data.objects.get(name)
            if not o:
                continue
            for v in o.data.vertices:
                p = o.matrix_world @ v.co
                i0, j0 = int((p.x - x0) / cx), int((p.y - y0) / cy)
                r = int(thick / min(cx, cy)) + 1
                for di in range(-r, r + 1):
                    for dj in range(-r, r + 1):
                        ii, jj = i0 + di, j0 + dj
                        if 0 <= ii < nx and 0 <= jj < ny and math.hypot(di * cx, dj * cy) <= thick:
                            wall[ii][jj] = True
        from collections import deque
        for name in lawn["seeds"]:
            o = bpy.data.objects.get(name)
            if not o:
                continue
            sp = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
            sx, sy = sum(p.x for p in sp) / 8, sum(p.y for p in sp) / 8
            si, sj = int((sx - x0) / cx), int((sy - y0) / cy)
            q, seen = deque([(si, sj)]), {(si, sj)}
            while q:
                i, j = q.popleft()
                grass[i][j] = True
                for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ii, jj = i + di, j + dj
                    if not (0 <= ii < nx and 0 <= jj < ny) or (ii, jj) in seen or wall[ii][jj]:
                        continue
                    if math.hypot((ii - si) * cx, (jj - sj) * cy) > lawn["radius"]:
                        continue
                    seen.add((ii, jj))
                    q.append((ii, jj))
        # the bushes themselves stand on grass
        for i in range(nx):
            for j in range(ny):
                if wall[i][j]:
                    grass[i][j] = True
    for i in range(nx):
        for j in range(ny):
            x, y = x0 + (i + 0.5) * cx, y0 + (j + 0.5) * cy
            if any(inside(r, x, y) for r in spec.get("paths", [])):
                grass[i][j] = False
    # `clip`: only the ground near these objects (no square plaza: around it is the island's lawn)
    keep = None
    clip = spec.get("clip")
    if clip:
        keep = [[False] * ny for _ in range(nx)]
        d = clip["dist"]
        r = int(d / min(cx, cy)) + 1
        for name in clip["objects"]:
            o = bpy.data.objects.get(name)
            if not o:
                continue
            for v in o.data.vertices:
                p = o.matrix_world @ v.co
                i0, j0 = int((p.x - x0) / cx), int((p.y - y0) / cy)
                for di in range(-r, r + 1):
                    for dj in range(-r, r + 1):
                        ii, jj = i0 + di, j0 + dj
                        if 0 <= ii < nx and 0 <= jj < ny and math.hypot(di * cx, dj * cy) <= d:
                            keep[ii][jj] = True
    # `grassIsLawn`: no grass cells — the island's own lawn shows there (same colour as around it)
    lawn_only = spec.get("grassIsLawn", False)
    bm = bmesh.new()
    verts = [[bm.verts.new((x0 + i * cx, y0 + j * cy, top)) for j in range(ny + 1)] for i in range(nx + 1)]
    gm = material_for({"color": spec.get("grassColor", "#6EA43A"), "name": "pasto"})
    rnd = random.Random(3)
    tile = spec.get("tile", 4)  # cells per paving stone
    shades = [material_for({"color": c, "name": "camino"}) for c in spec.get("pathColors", ["#CFC6B4", "#C6BCA8", "#D8D0BF", "#BEB4A0"])]
    me = bpy.data.meshes.new("suelo_" + spec["floor"])
    me.materials.append(gm)
    for m in shades:
        me.materials.append(m)
    gsh = [material_for({"color": c, "name": "pasto"}) for c in spec.get("grassColors", ["#6EA43A", "#66A035", "#76AC42"])]
    for m in gsh[1:]:
        me.materials.append(m)
    for i in range(nx):
        for j in range(ny):
            if (keep and not keep[i][j]) or (lawn_only and grass[i][j]):
                continue
            f = bm.faces.new((verts[i][j], verts[i + 1][j], verts[i + 1][j + 1], verts[i][j + 1]))
            if grass[i][j]:
                k = rnd.randrange(len(gsh))
                f.material_index = 0 if k == 0 else len(shades) + k
            else:
                f.material_index = 1 + (hash((i // tile, j // tile)) % len(shades))
    for v in [v for v in bm.verts if not v.link_faces]:
        bm.verts.remove(v)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("suelo_caminos" if lawn_only else "suelo_pasto_y_camino", me)
    bpy.context.scene.collection.objects.link(o)
    print("floor: %d x %d cells, %d grass, %d faces" % (nx, ny, sum(sum(r) for r in grass), len(me.polygons)))
    # `dropFloor`: the model's own floor slab goes (it stuck out of its spot like a mat)
    if spec.get("dropFloor") and not KEEP_SHAPES:
        bpy.data.objects.remove(floor)
        print("removed floor", spec["floor"])


def paint_box(o, rule, mat):
    lo, hi = rule["box"]
    max_area = rule.get("maxArea")  # (only the small faces: a big one of the body reached into the box)
    o.data.materials.append(mat)
    idx = len(o.data.materials) - 1
    n = 0
    scale = abs(o.matrix_world.to_3x3().determinant()) ** (2 / 3)
    for p in o.data.polygons:
        if not matches(o.material_slots[p.material_index].material, rule):
            continue
        if max_area is not None and p.area * scale > max_area:
            continue
        c = o.matrix_world @ p.center
        if all(lo[i] <= c[i] <= hi[i] for i in range(3)):
            p.material_index = idx
            n += 1
    if rule.get("project"):
        project_uvs(o, idx, rule["project"], rule.get("image"))
    print("recipe: %-14s -> %s (%d faces in the box)" % (o.name, rule.get("name"), n))


def paint_recess(o, rule, mat):
    """The windows of a plain building: the SMALL faces that sit deeper than the facade they look out
    of (the back of each window and its sides) get the rule's colour. The facades, and the big faces
    of a setback (a tower that narrows going up), keep theirs."""
    r = rule["recess"]
    depth, max_area = r.get("depth", 0.3), r.get("maxArea", 30)
    max_depth = r.get("maxDepth", 1e9)  # (deeper than a window: a setback of the building)
    o.data.materials.append(mat)
    idx = len(o.data.materials) - 1
    mw = o.matrix_world
    n3 = mw.to_3x3()
    faces = []
    for p in o.data.polygons:
        n = (n3 @ p.normal).normalized()
        if abs(n.z) > 0.3:  # (only walls: not the roofs or the floor)
            continue
        c = mw @ p.center
        key = (round(n.x, 1), round(n.y, 1))
        verts = [mw @ o.data.vertices[i].co for i in p.vertices]
        area = sum(((verts[i] - verts[0]).cross(verts[i + 1] - verts[0])).length / 2 for i in range(1, len(verts) - 1))
        faces.append((p, key, n.dot(c), area))
    outer = {}
    for p, key, d, a in faces:
        outer[key] = max(outer.get(key, -1e9), d)
    n = 0
    for p, key, d, a in faces:
        if outer[key] - max_depth < d < outer[key] - depth and a < max_area:
            p.material_index = idx
            n += 1
    print("recipe: %-14s -> %s (%d recessed faces)" % (o.name, rule.get("name"), n))


def face_area(mw, me, p):
    verts = [mw @ me.vertices[i].co for i in p.vertices]
    return sum(((verts[i] - verts[0]).cross(verts[i + 1] - verts[0])).length / 2 for i in range(1, len(verts) - 1))


def paint_wall_recess(o, rule, mat):
    """The windows of a building with several facades at different depths: for each facade (the
    faces looking the same way), its wall is the depth with most area; the faces a little deeper
    than ITS wall (min..max) are the windows."""
    r = rule["wallRecess"]
    lo, hi, max_area = r.get("min", 0.04), r.get("max", 0.6), r.get("maxArea", 1e9)
    if r.get("quadsOnly") and not KEEP_SHAPES:
        # (flat triangles merged into their faces first — same shape: a pane becomes one quad)
        bm = bmesh.new()
        bm.from_mesh(o.data)
        bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(0.5), verts=bm.verts, edges=bm.edges, delimit={'MATERIAL'})
        bm.to_mesh(o.data)
        bm.free()
    o.data.materials.append(mat)
    idx = len(o.data.materials) - 1
    mw, me = o.matrix_world, o.data
    n3 = mw.to_3x3()
    faces = []
    for p in me.polygons:
        n = (n3 @ p.normal).normalized()
        if abs(n.z) > 0.3:
            continue
        faces.append((p, (round(n.x, 1), round(n.y, 1)), n.dot(mw @ p.center), face_area(mw, me, p)))
    # (its wall: the faces looking the same way around it — within `near` — that stand furthest out)
    near = r.get("near", 0.9)
    cs = [(mw @ p.center) for p, _, _, _ in faces]
    n = 0
    for i, (p, k, d, a) in enumerate(faces):
        c = cs[i]
        out = d
        for j, (q, k2, d2, _) in enumerate(faces):
            if k2 == k and d2 > out and abs(cs[j].z - c.z) < near * 0.7 and (cs[j].xy - c.xy).length < near:
                out = d2
        dep = out - d
        if r.get("quadsOnly") and not KEEP_SHAPES and len(p.vertices) != 4:  # (the panes are quads; the slivers of a bevel, triangles)
            continue
        if lo < dep < hi and a < max_area and c.z >= r.get("zMin", -1e9):
            p.material_index = idx
            n += 1
    print("recipe: %-14s -> %s (%d window faces)" % (o.name, rule.get("name"), n))


def paint_facing(o, rule, mat):
    """The faces looking up (roofs, the top of a bench): normal.z above `up` (and under `upMax`)."""
    r = rule["facing"]
    o.data.materials.append(mat)
    idx = len(o.data.materials) - 1
    n3 = o.matrix_world.to_3x3()
    n = 0
    for p in o.data.polygons:
        z = (n3 @ p.normal).normalized().z
        if r.get("up", 0.5) < z <= r.get("upMax", 1.01) and (o.matrix_world @ p.center).z >= r.get("zMin", -1e9):
            p.material_index = idx
            n += 1
    print("recipe: %-14s -> %s (%d faces facing)" % (o.name, rule.get("name"), n))


def paint_thin(o, rule, mat):
    """Thin horizontal bands: the upright faces less tall than maxHeight (the edges of balconies,
    ledges and cornices), above zMin."""
    r = rule["thin"]
    o.data.materials.append(mat)
    idx = len(o.data.materials) - 1
    mw, me = o.matrix_world, o.data
    n3 = mw.to_3x3()
    n = 0
    for p in me.polygons:
        nn = (n3 @ p.normal).normalized()
        if abs(nn.z) > 0.3:
            continue
        zs = [(mw @ me.vertices[i].co).z for i in p.vertices]
        if max(zs) - min(zs) < r.get("maxHeight", 0.25) and min(zs) >= r.get("zMin", -1e9) and max(zs) <= r.get("zMax", 1e9):
            p.material_index = idx
            n += 1
    print("recipe: %-14s -> %s (%d thin faces)" % (o.name, rule.get("name"), n))


def build_railing(o, rule):
    """Replaces a piece by a clean railing (top and bottom rails + bars), a little in front of the
    wall: a SketchUp railing simplified 112 000 → 3 000 triangles came out broken."""
    r = rule["railing"]
    a, b = mathutils.Vector(r["from"]), mathutils.Vector(r["to"])
    h, step, t = r.get("height", 0.18), r.get("every", 0.045), r.get("thick", 0.012)
    mat = material_for({"color": r["color"], "name": rule.get("name", "reja")})
    bm = bmesh.new()

    def bar(c, size):
        m = mathutils.Matrix.Translation(c) @ mathutils.Matrix.Diagonal((size[0], size[1], size[2], 1))
        bmesh.ops.create_cube(bm, size=1, matrix=m)

    d = b - a
    length = d.length
    axis = 0 if abs(d.x) > abs(d.y) else 1
    span = [t, t, t]
    span[axis] = length
    mid = (a + b) / 2
    for z in (a.z + t / 2, a.z + h - t / 2, a.z + h * 0.5):  # bottom, top and a middle rail
        bar(mathutils.Vector((mid.x, mid.y, z)), span)
    n = max(2, int(length / step))
    for i in range(n + 1):
        p = a + d * (i / n)
        bar(mathutils.Vector((p.x, p.y, a.z + h / 2)), [t * 0.7, t * 0.7, h])
    me = bpy.data.meshes.new(rule.get("name", "reja"))
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    new = bpy.data.objects.new(rule.get("name", "reja"), me)
    bpy.context.scene.collection.objects.link(new)
    bpy.data.objects.remove(o)
    print("recipe: %-14s -> %s (railing, %d bars)" % (rule["object"], new.name, n + 1))


def shrink(o, f):
    """Pulls a piece a little inwards (around its own centre, in plan): its ends stop inside the
    wall instead of showing on its outer face as a line."""
    pts = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
    c = sum(pts, mathutils.Vector()) / 8
    m = mathutils.Matrix.Translation(c) @ mathutils.Matrix.Diagonal((f, f, 1, 1)) @ mathutils.Matrix.Translation(-c)
    o.matrix_world = m @ o.matrix_world
    print("recipe: %-14s -> shrunk %.2f" % (o.name, f))


if recipe:
    for rule in recipe.get("rules", []):
        if KEEP_SHAPES and (rule.get("shrink") or rule.get("railing")):
            continue  # (they move or rebuild a piece of the model)
        if rule.get("shrink"):
            if not prepared:  # (only once: it would shrink again every time)
                for o in objects_of(rule["object"]):
                    shrink(o, rule["shrink"])
            continue
        if rule.get("railing"):
            for o in objects_of(rule["object"]):
                build_railing(o, rule)
            continue
        targets = objects_of(rule["object"])
        if not targets:
            print("recipe: no object", rule["object"])
        for o in targets:
            # ("use": one of the model's own materials, e.g. the wall's, instead of a new colour)
            mat = bpy.data.materials[rule["use"]] if rule.get("use") else material_for(rule)
            if rule.get("box"):
                paint_box(o, rule, mat)
                continue
            if rule.get("recess"):
                paint_recess(o, rule, mat)
                continue
            if rule.get("wallRecess"):
                paint_wall_recess(o, rule, mat)
                continue
            if rule.get("thin"):
                paint_thin(o, rule, mat)
                continue
            if rule.get("facing"):
                paint_facing(o, rule, mat)
                continue
            if not o.material_slots:
                o.data.materials.append(mat)
            slots = [i for i, s in enumerate(o.material_slots) if matches(s.material, rule) or s.material is None]
            for i in slots:
                o.material_slots[i].material = mat
                if rule.get("project") == "slope":
                    project_slope(o, i, rule.get("tile", [0.4, 0.52]))
                elif rule.get("project") == "box":
                    project_box(o, i, rule.get("tile", 16))
                elif rule.get("project"):
                    project_uvs(o, i, rule["project"], rule.get("image"))
            print("recipe: %-14s -> %s (%d slot)" % (o.name, rule.get("name"), len(slots)))
    if recipe.get("floor"):
        paint_floor(recipe["floor"])


# ── 3b. the gatas: each one painted like the real one (colours painted on its vertices) ─────
import random


def srgb(hexcol):
    return [int(hexcol[i:i + 2], 16) / 255 for i in (1, 3, 5)]


def cat_frame(pts):
    """The cat's own axes: its length (principal axis in plan), its height, and which end is the
    head (the end with more volume up high: the tail is thin)."""
    n = len(pts)
    cx = sum(p.x for p in pts) / n
    cy = sum(p.y for p in pts) / n
    sxx = sum((p.x - cx) ** 2 for p in pts) / n
    syy = sum((p.y - cy) ** 2 for p in pts) / n
    sxy = sum((p.x - cx) * (p.y - cy) for p in pts) / n
    ang = 0.5 * math.atan2(2 * sxy, sxx - syy)
    ax, ay = math.cos(ang), math.sin(ang)
    proj = [(p.x - cx) * ax + (p.y - cy) * ay for p in pts]
    half = max(abs(v) for v in proj) or 1
    z0, z1 = min(p.z for p in pts), max(p.z for p in pts)
    t = [v / half for v in proj]
    h = [(p.z - z0) / ((z1 - z0) or 1) for p in pts]
    front = sum(1 for ti, hi in zip(t, h) if hi > 0.55 and ti > 0.4)
    back = sum(1 for ti, hi in zip(t, h) if hi > 0.55 and ti < -0.4)
    if back > front:
        t = [-v for v in t]
    return t, h


def cat_colours(style, pts, seed):
    rnd = random.Random(seed)
    t, h = cat_frame(pts)
    out = []
    for i, p in enumerate(pts):
        ti, hi = t[i], h[i]
        if style == "puas":  # red (its silver pins are real little spikes: add_pins)
            c = "#C81E2A"
        elif style == "rayas_patas":  # mustard, green-and-white striped legs, black ears
            c = "#E9A21E"
            if hi < 0.36:
                c = "#1F9C8C" if int(hi / 0.045) % 2 == 0 else "#F4F3EE"
            if ti > 0.55 and hi > 0.86:
                c = "#1E1E1E"
        elif style == "dorada":  # all gold
            c = "#D6A934"
        elif style == "cebra":  # black and white bands, a red one around the body
            c = "#1C1C1C" if int((ti + 1) * 7) % 2 == 0 else "#F4F4F0"
            if abs(ti - 0.18) < 0.12 and hi > 0.33:
                c = "#D4232B"
        elif style == "letras":  # white, written all over in red
            c = "#F6F4F0"
            row = int(hi * 16)
            fr = hi * 16 - row
            ch = int((ti + 1) * 22 + row * 7)
            ink = random.Random(row * 1000 + ch).random() < 0.55
            if hi > 0.3 and ink and 0.22 < fr < 0.78 and rnd.random() < 0.85:
                c = "#B0182A"
        else:
            c = "#F0EEE8"
        out.append(srgb(c))
    return out


def paint_points(o, colours, name):
    me = o.data
    attr = me.color_attributes.new(name="Col", type='BYTE_COLOR', domain='POINT')
    for i, c in enumerate(colours):
        attr.data[i].color_srgb = (c[0], c[1], c[2], 1.0)
    me.color_attributes.active_color = attr
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = 0.7
    vc = nt.nodes.new("ShaderNodeVertexColor")
    vc.layer_name = "Col"
    nt.links.new(vc.outputs["Color"], bsdf.inputs["Base Color"])
    me.materials.clear()
    me.materials.append(mat)


def add_pins(o, every=7, length=0.03, radius=0.004, seed=5):
    """The red gata's pins: thin silver spikes standing out of her body along its normals."""
    rnd = random.Random(seed)
    mw = o.matrix_world
    rot = mw.to_3x3()
    verts, faces = [], []
    for i, v in enumerate(o.data.vertices):
        if i % every or rnd.random() < 0.25:
            continue
        p = mw @ v.co
        n = (rot @ v.normal).normalized()
        a = n.orthogonal().normalized()
        b = n.cross(a)
        k = len(verts)
        for j in range(3):
            ang = j * 2 * math.pi / 3
            verts.append(p + (a * math.cos(ang) + b * math.sin(ang)) * radius)
        verts.append(p + n * length * (0.8 + rnd.random() * 0.4))
        faces += [(k, k + 1, k + 3), (k + 1, k + 2, k + 3), (k + 2, k, k + 3)]
    me = bpy.data.meshes.new("puas")
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.update()
    me.materials.append(material_for({"color": "#E6E7EA", "name": "puas_plateadas"}))
    pins = bpy.data.objects.new(o.name + "_puas", me)
    bpy.context.scene.collection.objects.link(pins)
    print("cat: %d pins" % (len(faces) // 3))


def striped_pedestal(o):
    """The zebra gata's pedestal: black and white diagonal stripes (subdivided so they show)."""
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=14, use_grid_fill=True)
    bm.to_mesh(o.data)
    bm.free()
    mw = o.matrix_world
    cols = [srgb("#1C1C1C" if int(((mw @ v.co).x + (mw @ v.co).y) * 3.2) % 2 == 0 else "#F4F4F0") for v in o.data.vertices]
    paint_points(o, cols, "pedestal_rayas")


def texture_cat(o, pts, image, name, sides_only=False):
    """A gata covered by a picture along her body (u: tail → head, v: paws → back): crisp red words
    or bands, which painted vertices can't draw. `sides_only`: the faces that look up or down (the
    back, the belly) get a plain corner of the picture — words would stretch across them."""
    t, h = cat_frame(pts)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    uv = bm.loops.layers.uv.verify()
    bm.verts.ensure_lookup_table()
    rot = o.matrix_world.to_3x3()
    for f in bm.faces:
        flat = sides_only and abs((rot @ f.normal).normalized().z) > 0.5
        for l in f.loops:
            i = l.vert.index
            l[uv].uv = (0.5, 0.97) if flat else ((t[i] + 1) / 2, h[i])
    bm.to_mesh(o.data)
    bm.free()
    mat = material_for({"image": image, "name": name})
    o.data.materials.clear()
    o.data.materials.append(mat)


if recipe:
    for k, cat in enumerate(recipe.get("cats", [])):
        o = bpy.data.objects.get(cat["object"])
        if not o:
            print("cat: no object", cat["object"])
            continue
        pts = [o.matrix_world @ v.co for v in o.data.vertices]
        if cat.get("image"):
            texture_cat(o, pts, cat["image"], "gata_" + cat["style"], sides_only=cat["style"] == "letras")
        else:
            paint_points(o, cat_colours(cat["style"], pts, 7 + k), "gata_" + cat["style"])
        if cat.get("pins") and not KEEP_SHAPES:
            add_pins(o)
        print("cat: %-10s -> %s (%d vertices)" % (o.name, cat["style"], len(pts)))
        if cat.get("pedestal") and bpy.data.objects.get(cat["pedestal"]) and not KEEP_SHAPES:
            striped_pedestal(bpy.data.objects[cat["pedestal"]])


# ── 4. an event laid out on the island ───────────────────────────────────────────
def lay_out_event(recipe):
    layout = json.load(open(os.path.join(HERE, recipe["layout"]), encoding="utf-8"))
    scale = layout["scale"]
    pennant = bpy.data.objects.get(recipe.get("pennant", ""))
    bodies = [o for o in meshes() if o.name in ("Cube", "Cube.004")]  # the two tents
    headers = {"Cube": "Plane", "Cube.004": "Plane.005"}  # their red gable (tells where the front is)
    totems = {"Cube": "Cube.003", "Cube.004": "Cube.005"}

    def centre(o):
        pts = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
        return sum(pts, mathutils.Vector()) / 8, pts

    units = []
    for body in bodies:
        units.append({"body": body, "parts": []})
    for o in meshes():
        if o == pennant:
            continue
        c, _ = centre(o)
        u = min(units, key=lambda u: (centre(u["body"])[0].xy - c.xy).length)
        u["parts"].append(o)

    # colours of the pennants
    pmats = []
    for k, col in enumerate(recipe.get("pennantColors", ["#F28A2E"])):
        m = bpy.data.materials.new("banderin_%s" % col.strip("#"))
        m.use_nodes = True
        m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = linear(col)
        m.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.8
        pmats.append(m)
    # one pennant: a triangle hanging down (1.2 wide, 1.5 tall in the model's units)
    pm = bpy.data.meshes.new("banderin")
    pm.from_pydata([(-0.6, 0, 0), (0.6, 0, 0), (0, 0, -1.5)], [], [(0, 1, 2)])
    pm.update()
    per_colour = []
    for m in pmats:
        mm = pm.copy()
        mm.materials.append(m)
        per_colour.append(mm)

    templates = []
    for u in units:
        body = u["body"]
        bc, bpts = centre(body)
        floor = min(min((o.matrix_world @ mathutils.Vector(c)).z for c in o.bound_box) for o in u["parts"])
        header = bpy.data.objects.get(headers[body.name])
        hn = (header.matrix_world.to_3x3() @ header.data.polygons[0].normal).normalized()
        # the front looks away from the tent: from the tent centre towards the header
        hc, _ = centre(header)
        front = (hc - bc).xy.normalized()
        if hn.xy.dot(front) < 0:
            hn = -hn
        phi = math.atan2(front.y, front.x)
        R = mathutils.Matrix.Rotation(-math.pi / 2 - phi, 4, 'Z')  # → its front looks at -Y (the page's +Z)
        T = mathutils.Matrix.Translation((-bc.x, -bc.y, -floor))
        local = R @ T
        # the tent measured in the normalized frame (front at y0, back at y1)
        pts = [local @ p for p in bpts]
        x0, x1 = min(p.x for p in pts), max(p.x for p in pts)
        y0, y1 = min(p.y for p in pts), max(p.y for p in pts)
        # the eave: right under the red gable (where the canvas walls end and the roof starts)
        hpts = [local @ (header.matrix_world @ mathutils.Vector(c)) for c in header.bound_box]
        eave = min(p.z for p in hpts)
        out_ = 0.08  # pennants hang just off the canvas, tied to its edge
        # pennants hanging DIRECTLY from the tent (nothing floating in the air): along the front
        # under the gable, and along both eaves of the sides — straight, tied to the edge
        strings = [
            ((x0, y0 - out_, eave), (x1, y0 - out_, eave), 0),
            ((x0 - out_, y0, eave), (x0 - out_, y1, eave), 0),
            ((x1 + out_, y0, eave), (x1 + out_, y1, eave), 0),
        ]
        templates.append({"parts": u["parts"], "local": local, "strings": strings, "name": body.name})

    root = bpy.data.objects.new("feria_bulevar", None)
    bpy.context.scene.collection.objects.link(root)
    k = 0
    for n, (x, z, yaw, kind) in enumerate(layout["spots"]):
        t = templates[kind % len(templates)]
        e = bpy.data.objects.new("pabellon_%02d" % (n + 1), None)
        bpy.context.scene.collection.objects.link(e)
        e.parent = root
        e.location = (x, -z, 0)
        e.rotation_euler = (0, 0, yaw)
        e.scale = (scale, scale, scale)
        for o in t["parts"]:
            c = o.copy()  # (same mesh: the file stays light)
            bpy.context.scene.collection.objects.link(c)
            c.parent = e
            c.matrix_parent_inverse = mathutils.Matrix.Identity(4)
            c.matrix_basis = t["local"] @ o.matrix_world
            c.name = "%s_%s" % (e.name, o.name.replace(".", ""))
        for s, (a, b, sag) in enumerate(t["strings"]):
            a, b = mathutils.Vector(a), mathutils.Vector(b)
            length = (b - a).length
            count = max(3, int(length / 1.7))
            d = (b - a).normalized()
            yaw_s = math.atan2(d.y, d.x)
            for i in range(count):
                f = (i + 0.5) / count
                p = a.lerp(b, f)
                p.z -= sag * 4 * f * (1 - f)  # the string sags in the middle
                fl = bpy.data.objects.new("%s_banderin_%d_%02d" % (e.name, s, i), per_colour[k % len(per_colour)])
                k += 1
                bpy.context.scene.collection.objects.link(fl)
                fl.parent = e
                fl.location = p
                fl.rotation_euler = (0, 0, yaw_s)
    # the originals were the templates: out of the scene (your design stays in originales/)
    for t in templates:
        for o in t["parts"]:
            bpy.data.objects.remove(o)
    if pennant:
        bpy.data.objects.remove(pennant)
    print("event: %d pavilions laid out along the walkway" % len(layout["spots"]))


if recipe and recipe.get("layout") and "feria_bulevar" not in bpy.data.objects:
    lay_out_event(recipe)

# ── 5. save ──────────────────────────────────────────────────────────────────────
if MARK not in bpy.data.objects:
    m = bpy.data.objects.new(MARK, None)
    bpy.context.scene.collection.objects.link(m)
os.makedirs(os.path.dirname(out), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_apply=True, export_yup=True)
if not prepared or FORCE:
    keep = os.path.join(os.path.dirname(src), "originales", os.path.basename(src))
    os.makedirs(os.path.dirname(keep), exist_ok=True)
    if not prepared:
        # a NEW model of yours (not prepared yet): it is the original now — the one there was before
        # is kept next to it as <name>.anterior.glb (a replaced model used to lose its original)
        if os.path.exists(keep):
            shutil.copyfile(keep, keep.replace(".glb", ".anterior.glb"))
        shutil.copyfile(src, keep)
        print("original kept:", keep)
    shutil.copyfile(out, src)  # the prepared one is the one to edit from now on
    print("prepared model saved in", src)

if png:  # a quick look (workbench)
    scene = bpy.context.scene
    objs = meshes()
    mn = mathutils.Vector((1e9,) * 3); mx = -mn
    for o in objs:
        for c in o.bound_box:
            p = o.matrix_world @ mathutils.Vector(c)
            for i in range(3):
                mn[i] = min(mn[i], p[i]); mx[i] = max(mx[i], p[i])
    centre = (mn + mx) / 2
    size = max(mx - mn)
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    cam.location = centre + mathutils.Vector((size * 0.5, -size * 0.9, size * 0.6))
    cam.rotation_euler = (centre - cam.location).to_track_quat('-Z', 'Y').to_euler()
    scene.camera = cam
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.display.shading.color_type = 'MATERIAL'
    scene.display.shading.light = 'STUDIO'
    scene.render.resolution_x, scene.render.resolution_y = 1200, 600
    scene.render.filepath = png
    bpy.ops.render.render(write_still=True)
