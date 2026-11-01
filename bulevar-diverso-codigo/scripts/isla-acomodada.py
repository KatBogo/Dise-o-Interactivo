# Blender (4.x) — your whole island as you arranged it (Assets/modelos/isla_para_acomodar.glb),
# split in the two files the page reads, nothing of it changed (same shapes, same places):
#   blender -b -P scripts/isla-acomodada.py -- <isla_para_acomodar.glb> <terreno.glb> <edificios.glb>
#
# edificios.glb: the groups edificios, lugares_e_hitos and casas_de_las_rutas — each building, place,
#   landmark and route house one object, where you left it (scripts/edificios-layout.py reads it).
# terreno.glb: all the rest — the ground, the streets, the walks, the bridges, the tunnel, the river
#   walls and its stones, the trees, the lamps, the traffic lights, the benches and the furniture —
#   (scripts/terreno-layout.py --tal-cual reads it). The water of the river is the page's (it flows).
import bpy, sys

argv = sys.argv[sys.argv.index("--") + 1:]
src, out_terrain, out_buildings = argv[0], argv[1], argv[2]
BUILDINGS = {"edificios", "lugares_e_hitos", "casas_de_las_rutas"}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
root = next((o for o in bpy.context.scene.objects if o.parent is None and o.type == 'EMPTY' and len(o.children) > 3), None)
groups = {g.name: g for g in (root.children if root else [])}


def lift(objs):
    """Its pieces, out of their group: top-level, where they stand (the same world transform)."""
    for o in objs:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw


def export(path, objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
        for c in o.children_recursive:
            c.select_set(True)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_yup=True, use_selection=True)


tops_b, tops_t = [], []
for name, g in groups.items():
    kids = list(g.children)
    lift(kids)
    (tops_b if name in BUILDINGS else tops_t).extend(kids)
# (the corner of the Obelisco: its building of always — the empanadas are sold there —, where you left
# the house of the stop; it takes its name, so the stop of the route is on it)
import json, os, mathutils
spec_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "obelisco-edificio.json")
house = next((o for o in tops_b if o.name == "ruta_obelisco"), None)
if house and os.path.exists(spec_path):
    spec = json.load(open(spec_path, encoding="utf-8-sig"))
    model = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), spec["model"])
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=model)
    new = [o for o in bpy.data.objects if o not in before]
    tops_new = [o for o in new if o.parent is None]
    holder = bpy.data.objects.new("ruta_obelisco_edificio", None)
    bpy.context.scene.collection.objects.link(holder)
    for o in tops_new:
        o.parent = holder
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ mathutils.Vector(c) for o in new if o.type == 'MESH' for c in o.bound_box]
    lo = mathutils.Vector([min(p[i] for p in pts) for i in range(3)]); hi = mathutils.Vector([max(p[i] for p in pts) for i in range(3)])
    # (as wide and as tall as it was: its lot and its height, like the city drew it)
    kw = spec["w"] / max(hi.x - lo.x, hi.y - lo.y)
    k = spec["h"] / (hi.z - lo.z)
    foot = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    for o in tops_new:
        o.location -= foot
    holder.scale = (kw, kw, k)
    holder.rotation_euler = (0, 0, spec["yaw"])
    t = house.matrix_world.translation
    holder.location = (t.x, t.y, 0.3)  # (on the ground of the island)
    bpy.context.view_layer.update()
    # (the house goes; the building takes its name)
    tops_b = [o for o in tops_b if o is not house] + [holder]
    for c in list(house.children_recursive) + [house]:
        bpy.data.objects.remove(c)
    holder.name = "ruta_obelisco"
    print("obelisco: su edificio en la esquina")
# (the water of the river: the page's, it flows)
tops_t = [o for o in tops_t if not o.name.startswith("rio_agua")]
export(out_buildings, tops_b)
export(out_terrain, tops_t)
print("isla acomodada: %d edificios, %d piezas de terreno" % (len(tops_b), len(tops_t)))
