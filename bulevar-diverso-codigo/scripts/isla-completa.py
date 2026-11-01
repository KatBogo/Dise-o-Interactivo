# Blender (4.x) — the whole island in one file, with YOUR models exactly as you made them.
#   blender -b -P scripts/isla-completa.py -- <isla_para_acomodar.glb> <Assets/modelos> <salida sin extensión> <informe.json>
#
# Your arranged island (isla_para_acomodar.glb) carries, for each tree, palm, lamp post, traffic light,
# bench, building, place, landmark and route house, the LIGHTENED copy the page made of your model
# (scripts/prepare-place-model.py). Here each copy is replaced by your ORIGINAL (Assets/modelos/originales),
# untouched — same vertices, same faces, same materials — standing exactly where the copy stood:
#   · where it stands, how it is turned and how big it is are found by laying the prepared model (the
#     one the copy was made from: the same shape, in the same frame as your original) over the copy;
#   · a copy that does not match almost exactly is left as it was (and listed in the report).
# Saved three times:
#   <salida>.glb    the island (glTF only stores triangles: Blender shows them as triangles; Alt+J
#                   in Edit Mode turns them back into quads)
#   <salida>.blend  the island in QUADS (the triangles of each face joined back, vertices welded)
#   <salida>.fbx    the same, in quads, for other programs
import bpy, bmesh, sys, os, re, json, math
import mathutils
from mathutils import Matrix, Vector
from mathutils.kdtree import KDTree

argv = sys.argv[sys.argv.index("--") + 1:]
ISLAND, MODELS, OUT, REPORT = argv[:4]
ORIGINALS = os.path.join(MODELS, "originales")

# which of your models each piece of the island is (by its name), in order: the first that fits
KINDS = [
    (r"^arboles_arbol2_", ["Arbol2"]),
    (r"^arboles_arbol3_", ["Arbol3"]),
    (r"^arboles_arbol4_", ["Arbol4"]),
    (r"^arboles_arbol_", ["arbol"]),
    (r"^palmeras", ["Palmera"]),
    (r"^postes_de_luz_", ["postes"]),
    (r"^semaforos_\d", ["semaforo"]),
    (r"^bulevar_bancas_rio", ["sillas_borde_rio"]),
    (r"^bulevar_asientos_centro", ["asientos_centro"]),
    (r"^bulevar_sillas_centro_2", ["sillas_centro_2"]),
    (r"^edificios_modelo_bajo", ["edificio_bajo"]),
    (r"^edificios_modelo_medio", ["edificio_medio"]),
    (r"^edificios_modelo_alto", ["edificio_alto"]),
    (r"^hito_banco_bogota", ["banco_bogota"]),
    (r"^hito_boulevard_cafe", ["boulevard_cafe"]),
    (r"^hito_Kiosko", ["Kiosko"]),
    (r"^hito_la-ermita", ["iglesia_ermita"]),
    (r"^hito_subway", ["subway"]),
    (r"^lugar_biblioteca", ["lugar_biblioteca-centenario"]),
    (r"^lugar_gato", ["lugar_gato-de-tejada"]),
    (r"^lugar_mucic", ["lugar_mucic"]),
    (r"^lugar_tertulia", ["lugar_museo-la-tertulia"]),
    (r"^ruta_", ["ruta_gastronomia_fonda", "ruta_cultura_casa-cultural", "ruta_taller", "edificio_bajo", "edificio_medio", "edificio_alto"]),
]
FIT = 0.005  # a copy matches when the prepared model lies on it within 0.5 % of its size
SAMPLES = 600


def meshes_under(o):
    return [c for c in ([o] + list(o.children_recursive)) if c.type == 'MESH']


def points(objs, limit=None):
    pts = []
    for o in objs:
        mw = o.matrix_world
        vs = o.data.vertices
        step = 1 if limit is None else max(1, len(vs) * len(objs) // limit)
        pts += [mw @ vs[i].co for i in range(0, len(vs), step)]
    return pts


def load(path):
    """Imports a GLB into its own (hidden) collection: its mesh objects."""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    lib = bpy.data.collections.new("biblioteca_" + os.path.basename(path))
    bpy.context.scene.collection.children.link(lib)
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        lib.objects.link(o)
    bpy.context.view_layer.update()
    return [o for o in new if o.type == 'MESH'], lib


library = {}


def model(name):
    """Your original (to place) and the prepared one (to find where it goes) of a model."""
    if name not in library:
        orig = os.path.join(ORIGINALS, name + ".glb")
        prep = os.path.join(MODELS, name + ".glb")
        if not (os.path.exists(orig) and os.path.exists(prep)):
            library[name] = None
        else:
            o_meshes, o_lib = load(orig)
            p_meshes, p_lib = load(prep)
            P = points(p_meshes)
            lo = Vector((min(p.x for p in P), min(p.y for p in P), min(p.z for p in P)))
            hi = Vector((max(p.x for p in P), max(p.y for p in P), max(p.z for p in P)))
            library[name] = {"orig": o_meshes, "orig_lib": o_lib, "prep_lib": p_lib, "P": P, "lo": lo, "hi": hi,
                             "sample": P[:: max(1, len(P) // SAMPLES)]}
    return library[name]


def solve(m, Q, kd, size):
    """Where the prepared model lies on the copy: turn (around Z), scale and position — or None."""
    lo, hi = m["lo"], m["hi"]
    ph = hi.z - lo.z
    qz0 = min(p.z for p in Q)
    qh = max(p.z for p in Q) - qz0
    if ph <= 1e-6 or qh <= 1e-6:
        return None
    s = qh / ph
    base = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    qx0, qx1 = min(p.x for p in Q), max(p.x for p in Q)
    qy0, qy1 = min(p.y for p in Q), max(p.y for p in Q)
    qc = Vector(((qx0 + qx1) / 2, (qy0 + qy1) / 2))
    flat = [(p.x - base.x, p.y - base.y) for p in m["P"][:: max(1, len(m["P"]) // 4000)]]

    def matrix(th):
        c, sn = math.cos(th), math.sin(th)
        xs = [s * (c * x - sn * y) for x, y in flat]
        ys = [s * (sn * x + c * y) for x, y in flat]
        mid = Vector(((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2))
        t = Vector((qc.x - mid.x, qc.y - mid.y, qz0))
        return Matrix.Translation(t) @ Matrix.Rotation(th, 4, 'Z') @ Matrix.Scale(s, 4) @ Matrix.Translation(-base), xs, ys

    def score(M):
        return sum(kd.find(M @ p)[2] for p in m["sample"]) / len(m["sample"])

    # 1. the turns whose footprint has the copy's size, 2. the one that lies on it best
    cands = []
    for deg in range(0, 360, 2):
        _, xs, ys = matrix(math.radians(deg))
        cands.append((abs((max(xs) - min(xs)) - (qx1 - qx0)) + abs((max(ys) - min(ys)) - (qy1 - qy0)), deg))
    cands.sort()
    best = None
    for _, deg in cands[:8]:
        for d in (-1, 0, 1):
            M = matrix(math.radians(deg + d))[0]
            e = score(M)
            if best is None or e < best[0]:
                best = (e, M, deg + d)
    e, M, deg = best
    for d in (-0.4, -0.2, -0.1, 0.1, 0.2, 0.4):  # (a finer turn)
        M2 = matrix(math.radians(deg + d))[0]
        e2 = score(M2)
        if e2 < e:
            e, M = e2, M2
    return (e / size, M, s)


def solve_stretched(m, Q, kd, size):
    """The same, for a copy stretched to its lot (another width, depth and height): for each turn,
    the scale along each of the model's own axes is what makes it as long as the copy that way."""
    lo, hi = m["lo"], m["hi"]
    ex, ey, ez = hi.x - lo.x, hi.y - lo.y, hi.z - lo.z
    if min(ex, ey, ez) <= 1e-6:
        return None
    qz0 = min(p.z for p in Q)
    sz = (max(p.z for p in Q) - qz0) / ez
    centre = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))

    def matrix(th):
        u, v = Vector((math.cos(th), math.sin(th))), Vector((-math.sin(th), math.cos(th)))
        au = [p.x * u.x + p.y * u.y for p in Q]
        av = [p.x * v.x + p.y * v.y for p in Q]
        sx, sy = (max(au) - min(au)) / ex, (max(av) - min(av)) / ey
        mid = u * ((max(au) + min(au)) / 2) + v * ((max(av) + min(av)) / 2)
        M = Matrix.Translation(Vector((mid.x, mid.y, qz0))) @ Matrix.Rotation(th, 4, 'Z') @ Matrix.Diagonal((sx, sy, sz, 1)) @ Matrix.Translation(-centre)
        return M, (sx, sy, sz)

    def score(M):
        return sum(kd.find(M @ p)[2] for p in m["sample"]) / len(m["sample"])

    best = None
    for deg in range(0, 360, 5):
        M, sc = matrix(math.radians(deg))
        e = score(M)
        if best is None or e < best[0]:
            best = (e, deg)
    e, deg = best
    M, sc = matrix(math.radians(deg))
    for d in (-3, -2, -1, -0.5, 0.5, 1, 2, 3):
        M2, sc2 = matrix(math.radians(deg + d))
        e2 = score(M2)
        if e2 < e:
            e, M, sc = e2, M2, sc2
    return (e / size, M, sc)


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=ISLAND)
island = [o for o in bpy.context.scene.objects if o.parent is None]
pieces = [k for root in island for g in root.children for k in g.children]
report = {"cambiados": {}, "sin_cambiar": [], "sin_original": []}


def copies(own):
    """The copies inside one piece (you duplicated it there: a row of trees, two benches): its
    objects grouped by their Blender suffix — piece_01, piece_02… one copy; piece_01.001… the next."""
    groups = {}
    for o in own:
        m = re.match(r"^(.*?)(\.\d{3})?$", o.name)
        groups.setdefault(m.group(2) or "", []).append(o)
    return list(groups.values())


def place(piece, own, label):
    """Your original in place of the copy made of the objects `own` — if it lies on it."""
    kind = next((names for rx, names in KINDS if re.match(rx, piece.name)), None)
    Q = points(own)
    kd = KDTree(len(Q))
    for i, p in enumerate(Q):
        kd.insert(p, i)
    kd.balance()
    size = max((max(p[i] for p in Q) - min(p[i] for p in Q)) for i in range(3)) or 1
    best = None
    for name in kind:
        m = model(name)
        if not m:
            continue
        r = solve(m, Q, kd, size)
        if r and (best is None or r[0] < best[0]):
            best = (r[0], r[1], r[2], name)
    if best and best[0] > FIT:  # (stretched to its lot?)
        for name in kind:
            m = model(name)
            r = m and solve_stretched(m, Q, kd, size)
            if r and r[0] < best[0]:
                best = (r[0], r[1], [round(v, 4) for v in r[2]], name)
    if best is None:
        return None
    err, M, s, name = best
    if err > FIT:
        return {"pieza": label, "modelo": name, "desajuste": round(err, 4)}
    # your original where the copy was (its objects share their mesh: the file stays light)
    for o in own:
        bpy.data.objects.remove(o)
    for o in library[name]["orig"]:
        c = o.copy()  # (same mesh data: not a vertex is changed)
        bpy.context.scene.collection.objects.link(c)
        c.parent = piece
        c.matrix_world = M @ o.matrix_world
        c.name = "%s_%s" % (label, o.name)
    report["cambiados"].setdefault(name, []).append({"pieza": label, "escala": s if isinstance(s, list) else round(s, 4), "desajuste": round(err, 5)})
    print("PIEZA %-32s <- %-28s desajuste %.5f" % (label, name, err))
    return True


for piece in pieces:
    if not any(re.match(rx, piece.name) for rx, _ in KINDS):
        continue
    own = meshes_under(piece)
    if not own:
        continue
    r = place(piece, own, piece.name)
    if r is None:
        report["sin_original"].append(piece.name)
    elif r is not True:
        # the piece as a whole is not one copy: each copy inside it on its own (the ones that are
        # only part of a model — a crown you duplicated — stay as you left them)
        groups = copies(own)
        if len(groups) < 2:
            report["sin_cambiar"].append(r)
            continue
        for k, g in enumerate(groups):
            r2 = place(piece, g, "%s_copia%d" % (piece.name, k + 1))
            if r2 is not True and r2:
                report["sin_cambiar"].append(r2)

# the libraries out of the island (the originals already have their copies in it)
for m in [m for m in library.values() if m]:
    for lib in (m["orig_lib"], m["prep_lib"]):
        for o in list(lib.objects):
            bpy.data.objects.remove(o)
        bpy.data.collections.remove(lib)
for me in [me for me in bpy.data.meshes if me.users == 0]:
    bpy.data.meshes.remove(me)

# 1. GLB: as it is (triangles, the only thing glTF stores)
bpy.ops.export_scene.gltf(filepath=OUT + ".glb", export_format='GLB', export_yup=True, export_apply=False)

# 2. quads: each mesh (once — the copies share it) with its split corners welded (same shape; the
# sharp edges stay sharp) and its triangles joined back into the quads they came from
tri = quad = 0
for me in bpy.data.meshes:
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.join_triangles(bm, faces=bm.faces, cmp_seam=False, cmp_sharp=False, cmp_uvs=True, cmp_vcols=True,
                             cmp_materials=True, angle_face_threshold=math.radians(40), angle_shape_threshold=math.radians(40))
    tri += sum(1 for f in bm.faces if len(f.verts) == 3)
    quad += sum(1 for f in bm.faces if len(f.verts) == 4)
    bm.to_mesh(me)
    bm.free()
bpy.ops.wm.save_as_mainfile(filepath=OUT + ".blend")
fbx = os.path.join(os.path.dirname(OUT), "fbx", os.path.basename(OUT) + ".fbx")
os.makedirs(os.path.dirname(fbx), exist_ok=True)
bpy.ops.export_scene.fbx(filepath=fbx, use_selection=False, apply_scale_options='FBX_SCALE_ALL', mesh_smooth_type='FACE', use_triangles=False, path_mode='COPY', embed_textures=True)

report["caras"] = {"quads": quad, "triangulos": tri}
report["cambiados_total"] = sum(len(v) for v in report["cambiados"].values())
json.dump(report, open(REPORT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("LISTO cambiados %d · sin cambiar %d · sin original %d · quads %d · triangulos %d" % (
    report["cambiados_total"], len(report["sin_cambiar"]), len(report["sin_original"]), quad, tri))
