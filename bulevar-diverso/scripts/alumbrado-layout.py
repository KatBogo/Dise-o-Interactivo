# Blender (4.x) — the Alumbrado as you arranged it (Assets/modelos/evento_alumbrado.glb):
#   blender -b -P scripts/alumbrado-layout.py -- <evento_alumbrado.glb> <alumbrado.json> [<estrellas.glb>]
#
# Where you left each piece of it, for the page to light them up there (its glow, its halos, how
# they come up one after another): the Christmas trees (arbol_navidad_NN, with their height), the
# stars of the path (estrella_camino_NN), the star posts (poste_estrella_NN) and the strings of
# lights over the streets (tira_luces_NN, from one end to the other). The lights along the roofs of
# the buildings and in the crowns of the trees the page hangs itself, on the buildings and trees of
# your island as they are now; the flowers of light of the river too.
import bpy, sys, json, re, math, mathutils

argv = sys.argv[sys.argv.index("--") + 1:]
src, out_json = argv[0], argv[1]
out_stars = argv[2] if len(argv) > 2 else None  # (the stars of the path as they are in your file: shape, place, turn and size)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)


def points(o):
    return [c.matrix_world @ v.co for c in [o] + list(o.children_recursive) if c.type == 'MESH' for v in c.data.vertices]


def yaw(o):
    # (page coordinates: x, z = -y; the turn round the vertical, like three.js rotation.y)
    m = o.matrix_world.to_3x3()
    f = m @ mathutils.Vector((1, 0, 0))
    return math.atan2(f.y, f.x)


out = {"trees": [], "stars": [], "posts": [], "tiras": []}
for o in sorted(bpy.context.scene.objects, key=lambda o: o.name):
    if o.parent is not None:
        continue
    pts = points(o)
    if not pts:
        continue
    lo = [min(p[i] for p in pts) for i in range(3)]
    hi = [max(p[i] for p in pts) for i in range(3)]
    cx, cz = (lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2
    if re.match(r"^arbol_navidad_\d+", o.name):
        out["trees"].append({"x": round(cx, 3), "z": round(cz, 3), "h": round(hi[2] - lo[2], 3), "yaw": round(yaw(o), 3)})
    elif re.match(r"^estrella_camino_\d+", o.name):
        out["stars"].append({"x": round(cx, 3), "z": round(cz, 3)})
    elif re.match(r"^poste_estrella_\d+", o.name):
        t = o.matrix_world.translation
        out["posts"].append({"x": round(t.x, 3), "z": round(-t.y, 3), "h": round(hi[2] - lo[2], 3), "yaw": round(yaw(o), 3)})
    elif re.match(r"^tira_luces_\d+", o.name):
        # (its two ends: the points furthest apart along it, seen from above; hung from their top)
        xy = [(p.x, -p.y, p.z) for p in pts]
        pa = max(xy, key=lambda p: (p[0] - cx) ** 2 + (p[1] - cz) ** 2)
        pb = max(xy, key=lambda p: (p[0] - pa[0]) ** 2 + (p[1] - pa[1]) ** 2)
        end = lambda e: max(p[2] for p in xy if (p[0] - e[0]) ** 2 + (p[1] - e[1]) ** 2 < 0.05 ** 2)
        out["tiras"].append({"a": [round(pa[0], 3), round(end(pa), 3), round(pa[1], 3)], "b": [round(pb[0], 3), round(end(pb), 3), round(pb[1], 3)]})
json.dump({"_info": "Escrito por scripts/alumbrado-layout.py desde Assets/modelos/evento_alumbrado.glb (tu Alumbrado): dónde dejaste los árboles de Navidad, las estrellas del camino, los postes de estrella y las tiras de luces de las calles. Las luces de los techos y de las copas las pone la página.", **out}, open(out_json, "w", encoding="utf-8"), indent=1)
print("alumbrado: %d arboles, %d estrellas, %d postes, %d tiras" % tuple(len(out[k]) for k in ("trees", "stars", "posts", "tiras")))
if out_stars:
    bpy.ops.object.select_all(action='DESELECT')
    n = 0
    for o in bpy.context.scene.objects:
        if o.parent is None and re.match(r"^estrella_camino_\d+", o.name):
            o.select_set(True)
            for c in o.children_recursive:
                c.select_set(True)
            n += 1
    bpy.ops.export_scene.gltf(filepath=out_stars, export_format='GLB', export_yup=True, use_selection=True, export_normals=False)
    print("estrellas: %d" % n)