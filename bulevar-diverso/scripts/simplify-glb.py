# Blender (4.x) — makes the exported island lighter and cleaner WITHOUT changing how it looks.
#   blender -b -P scripts/simplify-glb.py -- <file.glb> [<file.glb> …]   (each one is overwritten)
#
# Only the pieces that are completely FLAT (the lawn, the streets, the walks, the zebras…): their
# faces that lie in the same plane, with the same material and the same texture coordinates, are
# merged and cut again into a few clean triangles — the lawn of the island, with the holes of the
# river and the tunnel cut out, came out of the page as thousands of long thin triangles fanning
# from its middle. Curved pieces (trees, the cliff, the models) and pieces with painted colours are
# left exactly as they are. Same shapes, same colours, same textures: just less to deal with.
import bpy, bmesh, sys, math, re, mathutils

argv = sys.argv[sys.argv.index("--") + 1:]
FLAT = math.cos(math.radians(0.5))
# the soft round blobs repeated by the thousand (tree crowns, lamp heads, flowers, river stones):
# half their triangles, the same rounded shape (they are lumpy balls)
LIGHTER = re.compile(r"^(arboles_copas|arboles_\d|faroles|flores|rio_piedras)")
RATIO = 0.5


def flat(me):
    """A flat piece: all its faces in parallel planes (some of them may be turned upside down: the
    page draws the streets from both sides, and Blender showed those as black triangles)."""
    up = None
    for p in me.polygons:
        n = p.normal
        if up is None:
            up = n.copy()
        if abs(n.dot(up)) < FLAT:
            return False
    return up is not None


def face_up(bm):
    """Every face of a flat piece looking the same way (up, for the ground), and no face twice."""
    ref = mathutils.Vector((0, 0, 1)) if abs(bm.faces[0].normal.z) > 0.9 else bm.faces[0].normal.copy()
    seen = set()
    extra = []
    for f in bm.faces:
        if f.normal.dot(ref) < 0:
            f.normal_flip()
        key = frozenset(v.index for v in f.verts)
        if key in seen:
            extra.append(f)
        seen.add(key)
    bmesh.ops.delete(bm, geom=extra, context='FACES')
    return len(extra)


for path in argv:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=path)
    before = after = done = 0
    for o in [o for o in bpy.context.scene.objects if o.type == 'MESH']:
        me = o.data
        n0 = sum(len(p.vertices) - 2 for p in me.polygons)
        before += n0
        # (no more: halving them opened holes in the shapes — now each one is its own small piece)
        if False and LIGHTER.match(o.name) and len(me.polygons) > 200:
            d = o.modifiers.new("aligerar", 'DECIMATE')
            d.decimate_type, d.ratio = 'COLLAPSE', RATIO
            dg = bpy.context.evaluated_depsgraph_get()
            new = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
            o.modifiers.remove(d)
            o.data = new
            for p in new.polygons:
                p.use_smooth = True
            after += sum(len(p.vertices) - 2 for p in new.polygons)
            done += 1
            continue
        # (texture coordinates only where there is a texture: without one they only split the shape
        # at each side — a box came as six loose squares)
        textured = any(n.type == 'TEX_IMAGE' for m in me.materials if m and m.use_nodes for n in m.node_tree.nodes)
        if not textured:
            for uv in list(me.uv_layers):
                me.uv_layers.remove(uv)
        if me.color_attributes or len(me.polygons) < 8 or not flat(me):
            # (its corners welded: a shape that came as loose triangles is closed again)
            bm = bmesh.new()
            bm.from_mesh(me)
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
            bm.to_mesh(me)
            bm.free()
            after += n0
            continue
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
        bm.verts.index_update()
        bm.faces.ensure_lookup_table()
        face_up(bm)
        bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(0.5), verts=bm.verts, edges=bm.edges, delimit={'MATERIAL', 'UV', 'SEAM', 'SHARP'})
        bmesh.ops.triangulate(bm, faces=bm.faces, quad_method='BEAUTY', ngon_method='BEAUTY')
        bm.to_mesh(me)
        bm.free()
        # (the normals the file brought were the old ones: some still looked down — black in Blender)
        if me.has_custom_normals:
            bpy.context.view_layer.objects.active = o
            bpy.ops.mesh.customdata_custom_splitnormals_clear()
        for p in me.polygons:
            p.use_smooth = False
        n1 = sum(len(p.vertices) - 2 for p in me.polygons)
        after += n1
        done += 1
    # (without normals: with them every hard edge splits the shape into loose faces — Blender makes
    # them again when it opens the file, and the shapes stay closed)
    try:  # (the cliff keeps its painted colours)
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_yup=True, export_normals=False, export_vertex_color='ACTIVE')
    except TypeError:
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_yup=True, export_normals=False)
    print("simplified %s: %d pieces, %d -> %d triangles" % (path, done, before, after))
