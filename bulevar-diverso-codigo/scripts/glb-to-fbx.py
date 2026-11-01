# Blender (4.x) — converts every .glb of a folder into an .fbx (same name) in another folder.
#   blender -b -P scripts/glb-to-fbx.py -- <folder with .glb> <output folder>
# Used by scripts/export-models.mjs to produce Assets/modelos/*.fbx.
import os
import sys

import bpy

src, out = sys.argv[sys.argv.index("--") + 1:][:2]
os.makedirs(out, exist_ok=True)
for f in sorted(os.listdir(src)):
    if not f.lower().endswith(".glb"):
        continue
    name = os.path.splitext(f)[0]
    if name == "isla_bulevar-completa":
        continue  # (scripts/isla-completa.py writes its FBX itself, in quads)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(src, f))
    # parts that share one shape but have different colours: FBX keeps the colour on the MESH, so
    # every part gets its own copy of the mesh and its material moves onto it (no colour is lost)
    for obj in bpy.data.objects:
        if obj.type != "MESH":
            continue
        if obj.data.users > 1:
            obj.data = obj.data.copy()
        for slot in obj.material_slots:
            if slot.link == "OBJECT":
                material = slot.material
                slot.link = "DATA"
                slot.material = material
        obj.data.name = obj.name
    # the empty root keeps the model's name; meshes keep their part names
    bpy.ops.export_scene.fbx(
        filepath=os.path.join(out, name + ".fbx"),
        use_selection=False,
        apply_scale_options="FBX_SCALE_ALL",
        axis_forward="-Z",
        axis_up="Y",
        path_mode="COPY",
        embed_textures=True,
        add_leaf_bones=False,
        bake_anim=False,
    )
    print("FBX:", name)
