import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { catmullClark } from './subdivide.js'
import { buildFace, updateFace } from './chontiFace.js'
import { clayMaterial } from './clayMaterial.js'
import { PALETTE } from '../../theme.js'

/**
 * Chonti, el chontaduro caleño — EXCLUSIVELY the character model from Blender
 * (Assets/modelos/CHONTI.glb → public/models/chonti.glb, see prepareChonti; and his outfits for the
 * events, OUTFIT_URLS). The file before (Assets/personajechonti.glb) is still understood:
 *
 *  Cube006  body, arms and legs (skinned)
 *  Cube008  leaf crown + stem (skinned)
 *  Cube011  head (rigid, attached to the neck bone). It is exported as its low-poly cage
 *           because the Subdivision Surface modifier isn't applied on export, so the same
 *           cage is subdivided here to recover its smooth shape.
 *
 * The GLB has no materials, so it is colored with the character sheet's palette.
 * It has no animation clips: walking/reading/talking/falling rotate its own 18-bone skeleton
 * (see poseChonti). Faces +Z, feet at y = 0, total height CHONTI_HEIGHT.
 */

// relative to the page, so the site also works from a sub-folder (GitHub Pages: usuario.github.io/repo/)
export const CHONTI_URL = 'models/chonti.glb'
export const CHONTI_HEIGHT = 2
// Chonti dressed for each event (scripts/sync-assets.mjs copies them from Assets/modelos):
// what he wears in each one is put on the same Chonti (prepareChonti)
const OUTFIT_URLS = [
    ['santa', 'models/chonti_navideno.glb'], // Alumbrado — chontinavideño
    ['glasses', 'models/chonti_feria.glb'], // Feria del Libro — chontiferiadellibro
    ['cap', 'models/chonti_sucursal.glb'], // Sucursal Fest — chontisucursal
]

// Character sheet colors (Assets/ChatGPT Image … .png): only colors change, never the geometry
const C = {
    rust: '#B4361B', // top of the head
    red: '#CF4A1C',
    orange: '#E8641C',
    light: '#F27F24', // chin
    body: '#EE7020',
    leaf: '#DDAA62',
    leafEdge: '#B07A3E',
    stem: '#6E3D1F',
    stemTip: '#53301A',
}

// Bones of the GLB rig (three.js strips the dots from Blender names: "Bone.005.L" → "Bone005L")
const RIG = {
    neck: 'Bone', // head + crown hang from it
    spine: 'Bone002',
    legL: 'Bone005L', // thighs
    legR: 'Bone005R',
    armL: 'Bone009L', // upper arms (Bone008 = shoulder)
    armR: 'Bone009R',
    foreL: 'Bone010L', // forearms (elbows)
    foreR: 'Bone010R',
}

// Joint limits (radians, around WORLD X = forward/back and WORLD Z = sideways) so the limbs
// never go through his big head or his belly.
const LIMITS = {
    legL: { x: [-0.6, 0.6], z: [-0.12, 0.12] },
    legR: { x: [-0.6, 0.6], z: [-0.12, 0.12] },
    armL: { x: [-1.1, 0.75], z: [-0.55, 0.75] },
    armR: { x: [-1.1, 0.75], z: [-0.75, 0.55] },
    foreL: { x: [-1.3, 0.1], z: [-0.2, 0.6] },
    foreR: { x: [-1.3, 0.1], z: [-0.6, 0.2] },
    neck: { x: [-0.25, 0.5], z: [-0.3, 0.3] }, // never far back: it would open a gap under his chin
    spine: { x: [-0.1, 0.1], z: [-0.08, 0.08] },
}

// (materials: clayMaterial.js — soft clay + sheen + speckled peel + warm rim, like the sheet render)

/** Rest-pose world positions of a (skinned or rigid) mesh. */
function restPositions(mesh) {
    const pos = mesh.geometry.attributes.position
    const out = []
    for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i)
        if (mesh.isSkinnedMesh) mesh.applyBoneTransform(i, v)
        out.push(v.applyMatrix4(mesh.matrixWorld))
    }
    return out
}

/** Vertical gradient as vertex colors (stops: [t, color] with t = 0 bottom … 1 top). */
function paintGradient(geometry, worldYs, stops) {
    const min = Math.min(...worldYs), max = Math.max(...worldYs)
    const cols = stops.map(([t, c]) => [t, new THREE.Color(c)])
    const tmp = new THREE.Color()
    const data = new Float32Array(worldYs.length * 3)
    worldYs.forEach((y, i) => {
        const t = (y - min) / (max - min || 1)
        let k = 1
        while (k < cols.length - 1 && cols[k][0] < t) k++
        const [t0, c0] = cols[k - 1], [t1, c1] = cols[k]
        tmp.copy(c0).lerp(c1, THREE.MathUtils.clamp((t - t0) / (t1 - t0 || 1), 0, 1))
        tmp.toArray(data, i * 3)
    })
    geometry.setAttribute('color', new THREE.BufferAttribute(data, 3))
}

/** Bone + rest pose + world axes expressed in its local frame (to bend around world X / Z). */
function boneInfo(bone) {
    const q = new THREE.Quaternion()
    bone.getWorldQuaternion(q)
    const inv = q.clone().invert()
    return {
        bone,
        rest: bone.quaternion.clone(),
        ax: new THREE.Vector3(1, 0, 0).applyQuaternion(inv),
        az: new THREE.Vector3(0, 0, 1).applyQuaternion(inv),
    }
}

/**
 * The exported body has its legs OPEN at the bottom (you could see into them from below, e.g. while
 * he falls). This finds every open border of the mesh near the soles and closes it with a cap: a
 * fan of triangles to the middle of the hole. The new middle vertex is skinned like the border,
 * so the sole moves with its leg.
 */
function capFeet(mesh) {
    const g = mesh.geometry
    const pos = g.attributes.position
    const index = g.index ? Array.from(g.index.array) : Array.from({ length: pos.count }, (_, i) => i)
    // weld split vertices (UV seams) by position, so only REAL borders count as open
    const keyOf = (i) => `${Math.round(pos.getX(i) * 1e4)},${Math.round(pos.getY(i) * 1e4)},${Math.round(pos.getZ(i) * 1e4)}`
    const canon = new Map()
    const id = Array.from({ length: pos.count }, (_, i) => {
        const k = keyOf(i)
        if (!canon.has(k)) canon.set(k, canon.size)
        return canon.get(k)
    })
    const uses = new Map() // undirected edge → how many triangles
    const directed = [] // [from vertex, to vertex] as wound in their triangle
    for (let t = 0; t < index.length; t += 3) {
        for (let e = 0; e < 3; e++) {
            const a = index[t + e], b = index[t + ((e + 1) % 3)]
            const k = id[a] < id[b] ? `${id[a]}_${id[b]}` : `${id[b]}_${id[a]}`
            uses.set(k, (uses.get(k) ?? 0) + 1)
            directed.push([a, b, k])
        }
    }
    const border = directed.filter(([, , k]) => uses.get(k) === 1)
    if (!border.length) return g
    // chain the border edges into loops
    const next = new Map(border.map(([a, b]) => [id[a], [a, b]]))
    const rest = restPositions(mesh)
    let minY = Infinity, maxY = -Infinity
    rest.forEach((p) => ((minY = Math.min(minY, p.y)), (maxY = Math.max(maxY, p.y))))
    const seen = new Set()
    const loops = []
    for (const [start] of next) {
        if (seen.has(start)) continue
        const loop = []
        let at = start
        while (next.has(at) && !seen.has(at)) {
            seen.add(at)
            const [a, b] = next.get(at)
            loop.push([a, b])
            at = id[b]
        }
        if (loop.length < 3) continue
        const y = loop.reduce((s, [a]) => s + rest[a].y, 0) / loop.length
        if (y < minY + (maxY - minY) * 0.18) loops.push(loop) // only the soles
    }
    if (!loops.length) return g
    // new geometry: the old vertices + one centre per hole, and the cap triangles
    const out = new THREE.BufferGeometry()
    const extra = loops.length
    for (const [name, attr] of Object.entries(g.attributes)) {
        const size = attr.itemSize
        const data = new attr.array.constructor((attr.count + extra) * size)
        data.set(attr.array.subarray(0, attr.count * size))
        loops.forEach((loop, l) => {
            const o = (attr.count + l) * size
            const skin = name === 'skinIndex' || name === 'skinWeight'
            for (let c = 0; c < size; c++) {
                // skinning copied from the border (the foot); everything else averaged
                data[o + c] = skin ? attr.array[loop[0][0] * size + c] : loop.reduce((s, [a]) => s + attr.array[a * size + c], 0) / loop.length
            }
            if (name === 'normal') ((data[o] = 0), (data[o + 1] = -1), (data[o + 2] = 0))
        })
        out.setAttribute(name, new THREE.BufferAttribute(data, size, attr.normalized))
    }
    const caps = []
    loops.forEach((loop, l) => {
        const c = pos.count + l
        for (const [a, b] of loop) caps.push(b, a, c) // the opposite winding of the border's triangle
    })
    out.setIndex([...index, ...caps])
    out.groups = g.groups
    return out
}
const capCache = new WeakMap()

const headCache = new WeakMap() // subdividing the head is the costly part: done once per GLB
/** Which file it is: Chonti (CHONTI.glb, with his outfits for the events) or the one before. */
function prepare(scene, outfits) {
    return scene.getObjectByName('Cube011') ? prepareClassic(scene) : prepareChonti(scene, outfits)
}

const vertsOf = (m) => m.geometry.attributes.position.count
/**
 * The pieces of a Chonti file, whatever Blender called them:
 *  eyeHead  the head that carries his two eyes (a mesh with two mesh children)
 *  boneHead the head that rides on the neck bone (CHONTI.glb has both, one over the other)
 *  body     the skinned body
 */
function piecesOf(root) {
    let eyeHead = null, boneHead = null, body = null
    root.traverse((o) => {
        if (!o.isMesh) return
        if (o.isSkinnedMesh) body ??= o
        else if (o.children.filter((c) => c.isMesh).length >= 2) eyeHead ??= o
        else if (o.parent?.isBone) boneHead ??= o
    })
    return { eyeHead, boneHead, body }
}

/**
 * Chonti (Assets/modelos/CHONTI.glb → public/models/chonti.glb): his 18-bone skeleton with the
 * skinned body, his head + leaf crown + stem (one smooth piece, on the neck bone) and, on a copy of
 * the head, his two eyes (where the eyes of the face go). The file has no materials: everything is
 * coloured here, with the sheet's palette.
 *
 * His outfits (`outfits`: { santa, glasses, cap } → the scene of each file) are Chonti dressed for
 * an event — chontinavideño (Alumbrado), chontiferiadellibro (Feria), chontisucursal (Sucursal
 * Fest). Of each one only what he wears is taken (all that is not his body, head or eyes), kept
 * exactly where it sits on his head in that file, and hung from his neck bone here — so the same
 * Chonti, with all his moves, puts it on and takes it off.
 */
function prepareChonti(scene, outfits = {}) {
    const model = cloneSkinned(scene)
    model.updateMatrixWorld(true)
    const { eyeHead, boneHead, body } = piecesOf(model)
    const head = boneHead ?? eyeHead
    const box = new THREE.Box3()

    // Body: one clay colour · the open soles closed
    body.material = clayMaterial({ color: C.body, speckle: 0.22, rim: 0.28 })
    if (!capCache.has(body.geometry)) capCache.set(body.geometry, capFeet(body))
    body.geometry = capCache.get(body.geometry)
    restPositions(body).forEach((p) => box.expandByPoint(p))

    // His own eyes: where the eyes of the face go (the face draws them, with all its expressions),
    // carried over to the head on the bone (the same head: through its own local space)
    const toHead = new THREE.Matrix4().copy(head.matrixWorld).multiply(new THREE.Matrix4().copy(eyeHead.matrixWorld).invert())
    const eyeAt = eyeHead.children.filter((c) => c.isMesh).map((e) => {
        e.visible = false
        e.geometry.computeBoundingBox()
        return e.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(e.matrixWorld).applyMatrix4(toHead)
    }).sort((a, b) => a.x - b.x)
    if (eyeHead !== head) eyeHead.visible = false // (the copy of the head: one over the other they flickered)

    // Head, crown and stem in one piece: painted by height — orange chin → rust top of the head,
    // then the beige leaves of the crown and the brown stem on top
    head.geometry = head.geometry.clone()
    const headRest = restPositions(head)
    headRest.forEach((p) => box.expandByPoint(p))
    paintGradient(head.geometry, headRest.map((p) => p.y), [[0, C.light], [0.3, C.orange], [0.55, C.red], [0.7, C.rust], [0.72, C.leafEdge], [0.77, C.leaf], [0.84, C.leaf], [0.86, C.stem], [1, C.stemTip]])
    head.material = clayMaterial({ vertexColors: true, speckle: 0.4, rim: 0.35 })

    // The expressive face, on his modeled eyes
    const face = buildFace(head, scene, eyeAt.length === 2 ? { left: eyeAt[0], right: eyeAt[1] } : null)

    // The outfits, skinned to his own skeleton: every point of what he wears moves like the nearest
    // point of his body (a sleeve with his arm, the trousers with his legs) or, over his head, with
    // the head (hat, glasses, cap) — so they follow every move (hidden until an event needs them)
    const neckBone = model.getObjectByName(RIG.neck)
    const known = new Set([vertsOf(body), vertsOf(head), ...eyeHead.children.filter((c) => c.isMesh).map(vertsOf)])
    const wearer = skinSource(body, head, neckBone)
    const headBox = new THREE.Box3().setFromPoints(headRest)
    // (of each outfit only what goes on his head: the Christmas suit of chontinavideño stays out —
    // his body is always his own orange — and so does anything else below the middle of his head)
    const onHead = headBox.min.y + (headBox.max.y - headBox.min.y) * 0.45
    const accessories = {}
    for (const [kind, outfit] of Object.entries(outfits)) {
        if (!outfit) continue
        const acc = outfitPiece(kind, outfit, head.matrixWorld, known, wearer, kind === 'santa' ? onHead : null)
        if (!acc) continue
        if (kind === 'cap') capDesign(acc, wearer)
        acc.visible = false
        model.add(acc)
        accessories[kind] = acc
    }

    model.traverse((o) => {
        if (!o.isMesh) return
        o.castShadow = true
        o.receiveShadow = true
        o.frustumCulled = false // skinned bounds don't follow the pose
    })

    const bones = Object.fromEntries(Object.entries(RIG).map(([k, name]) => [k, { ...boneInfo(model.getObjectByName(name)), limits: LIMITS[k] }]))
    head.geometry.computeBoundingBox()
    const hb = head.geometry.boundingBox.clone().applyMatrix4(head.matrix)
    const headShape = { c: hb.getCenter(new THREE.Vector3()), r: hb.getSize(new THREE.Vector3()).multiplyScalar(0.5) }
    const center = box.getCenter(new THREE.Vector3())
    return { model, bones, face, headShape, accessories, center, minY: box.min.y, scale: CHONTI_HEIGHT / (box.max.y - box.min.y) }
}

/**
 * What Chonti wears in one outfit file: every piece that is not his body, a head or an eye, moved
 * from that file's head onto his head (`headWorld`), exactly as it sits there. It keeps its own
 * colours when the file has them (the Christmas hat); otherwise it is coloured here.
 */
const OUTFIT_COLOR = { santa: '#C8202B', glasses: '#2C3B07', cap: '#F1E6D0' }
/**
 * Where his body and his head are in the rest pose (model space), with the bones each point follows
 * — a grid of cells so the nearest point to anything is found at once.
 */
function skinSource(body, head, neckBone) {
    const skeleton = body.skeleton
    const neck = skeleton.bones.indexOf(neckBone)
    const si = body.geometry.attributes.skinIndex, sw = body.geometry.attributes.skinWeight
    // every point of the body (its own index) and of the head (−1), in flat arrays: a plain search
    // over them is fast enough (a fraction of a second, once per outfit file)
    const bodyPts = restPositions(body), headPts = restPositions(head)
    const n = bodyPts.length + headPts.length
    const P = new Float32Array(n * 3), owner = new Int32Array(n)
    ;[...bodyPts, ...headPts].forEach((p, i) => {
        P[i * 3] = p.x, P[i * 3 + 1] = p.y, P[i * 3 + 2] = p.z
        owner[i] = i < bodyPts.length ? i : -1
    })
    const nearest = (x, y, z) => {
        let best = 0, bd = Infinity
        for (let i = 0; i < n; i++) {
            const dx = P[i * 3] - x, dy = P[i * 3 + 1] - y, dz = P[i * 3 + 2] - z
            const d = dx * dx + dy * dy + dz * dz
            if (d < bd) (bd = d), (best = i)
        }
        return owner[best]
    }
    /** The bones (4 indices) and weights a point at x, y, z follows. */
    const weightsAt = (x, y, z) => {
        const i = nearest(x, y, z)
        if (i < 0) return [[neck, 0, 0, 0], [1, 0, 0, 0]]
        return [[si.getX(i), si.getY(i), si.getZ(i), si.getW(i)], [sw.getX(i), sw.getY(i), sw.getZ(i), sw.getW(i)]]
    }
    return { skeleton, weightsAt, neck }
}
/** Keeps only the triangles of `g` whose middle is above `y` (null when none is left). */
function keepAbove(g, y) {
    const pos = g.attributes.position
    const index = g.index ? Array.from(g.index.array) : Array.from({ length: pos.count }, (_, i) => i)
    const kept = []
    for (let t = 0; t < index.length; t += 3) {
        const [a, b, c] = [index[t], index[t + 1], index[t + 2]]
        if ((pos.getY(a) + pos.getY(b) + pos.getY(c)) / 3 >= y) kept.push(a, b, c)
    }
    if (!kept.length) return null
    g.setIndex(kept)
    return g
}
const outfitCache = new WeakMap() // (the weights of an outfit are found once per file)
function outfitPiece(kind, outfit, headWorld, known, wearer, above = null) {
    outfit.updateMatrixWorld(true)
    const { eyeHead } = piecesOf(outfit)
    if (!eyeHead) return null
    const move = new THREE.Matrix4().copy(headWorld).multiply(new THREE.Matrix4().copy(eyeHead.matrixWorld).invert())
    const group = new THREE.Group()
    group.name = { santa: 'HatSanta', cap: 'HatCap', glasses: 'Glasses' }[kind]
    outfit.traverse((o) => {
        if (!o.isMesh || o.isSkinnedMesh || known.has(vertsOf(o))) return
        let g = outfitCache.get(o.geometry)
        if (g === null) return // (nothing of it on his head)
        if (!g) {
            const m4 = new THREE.Matrix4().multiplyMatrices(move, o.matrixWorld)
            g = o.geometry.clone().applyMatrix4(m4)
            if (above != null && !keepAbove(g, above)) {
                outfitCache.set(o.geometry, null)
                return
            }
            if (!g.attributes.normal) g.computeVertexNormals()
            const pos = g.attributes.position
            // (a hair out from his skin: a suit made on the body lay exactly on it and the two
            // flickered in patches)
            const nor = g.attributes.normal
            for (let i = 0; i < pos.count; i++) pos.setXYZ(i, pos.getX(i) + nor.getX(i) * 0.006, pos.getY(i) + nor.getY(i) * 0.006, pos.getZ(i) + nor.getZ(i) * 0.006)
            const idx = new Uint16Array(pos.count * 4), wts = new Float32Array(pos.count * 4)
            for (let i = 0; i < pos.count; i++) {
                const [a, b] = wearer.weightsAt(pos.getX(i), pos.getY(i), pos.getZ(i))
                idx.set(a, i * 4)
                wts.set(b, i * 4)
            }
            g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(idx, 4))
            g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(wts, 4))
            outfitCache.set(o.geometry, g)
        }
        const src = Array.isArray(o.material) ? o.material[0] : o.material
        const own = src && src.name && src.color // (a material made in Blender: its colour)
        const mat = new THREE.MeshStandardMaterial({
            color: own ? src.color.clone() : OUTFIT_COLOR[kind],
            roughness: kind === 'glasses' ? 0.35 : 0.8,
            metalness: kind === 'glasses' ? 0.2 : 0,
            side: THREE.DoubleSide, // (some pieces come mirrored from the file: both sides)
            polygonOffset: true, // (and drawn in front of his skin where they touch it)
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2,
        })
        // (bound in the rest pose, in the model's own space: the space its points are in)
        const mesh = new THREE.SkinnedMesh(g, mat)
        mesh.bind(wearer.skeleton, new THREE.Matrix4())
        mesh.castShadow = true
        mesh.frustumCulled = false
        group.add(mesh)
    })
    return group.children.length ? group : null
}

/**
 * The Sucursal Fest cap, with a design: the crown pink, the visor green (the palette) and, on the
 * front, a round patch — a mango sun with a palm tree and "SF". The patch is found on the front of
 * the crown (a ray from in front, at its height) and rides on the head like the cap.
 */
function capDesign(group, wearer) {
    const meshes = group.children.filter((m) => m.isMesh)
    const box = new THREE.Box3()
    meshes.forEach((m) => (m.geometry.computeBoundingBox(), box.union(m.geometry.boundingBox)))
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
    const yPatch = box.min.y + size.y * 0.74 // (high on the crown: never over his face)
    const ray = new THREE.Raycaster(new THREE.Vector3(c.x, yPatch, box.max.z + 1), new THREE.Vector3(0, 0, -1))
    const plain = meshes.map((m) => new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })))
    const hit = ray.intersectObjects(plain)[0]
    // crown pink · visor green: the visor is what sticks out in front of the round crown (as wide as
    // the cap, its back at the back of the cap)
    const r = size.x / 2, crownZ = box.min.z + r
    const crown = new THREE.Color(PALETTE.rosa), visor = new THREE.Color(PALETTE.verde)
    for (const m of meshes) {
        const pos = m.geometry.attributes.position
        const data = new Float32Array(pos.count * 3)
        for (let i = 0; i < pos.count; i++) (Math.hypot(pos.getX(i) - c.x, pos.getZ(i) - crownZ) > r * 1.04 && pos.getZ(i) > crownZ ? visor : crown).toArray(data, i * 3)
        m.geometry.setAttribute('color', new THREE.BufferAttribute(data, 3))
        m.material.vertexColors = true
        m.material.color.set('#ffffff')
        m.material.needsUpdate = true
    }
    if (!hit) return
    // the patch, a hair in front of the crown, facing out of it
    const n = hit.face.normal.clone()
    if (n.z < 0) n.negate()
    const s = size.x * 0.27
    const pg = new THREE.PlaneGeometry(s, s)
    pg.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n))
    pg.translate(hit.point.x + n.x * 0.006, hit.point.y + n.y * 0.006, hit.point.z + n.z * 0.006)
    const count = pg.attributes.position.count
    pg.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(count * 4).map((_, i) => (i % 4 ? 0 : wearer.neck)), 4))
    pg.setAttribute('skinWeight', new THREE.Float32BufferAttribute(new Float32Array(count * 4).map((_, i) => (i % 4 ? 0 : 1)), 4))
    const patch = new THREE.SkinnedMesh(pg, new THREE.MeshStandardMaterial({ map: capPatchTexture(), transparent: true, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }))
    patch.bind(wearer.skeleton, new THREE.Matrix4())
    patch.frustumCulled = false
    group.add(patch)
}
/** The patch of the cap: a mango sun, a dark green palm tree and "SF", on a transparent canvas. */
let capPatch = null
function capPatchTexture() {
    if (capPatch) return capPatch
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')
    // the round patch: crema ring, mango sun
    g.fillStyle = PALETTE.crema
    g.beginPath(), g.arc(128, 128, 124, 0, Math.PI * 2), g.fill()
    g.fillStyle = PALETTE.mango
    g.beginPath(), g.arc(128, 128, 108, 0, Math.PI * 2), g.fill()
    g.fillStyle = PALETTE.naranja
    g.beginPath(), g.arc(128, 150, 62, Math.PI, 0), g.fill() // (the sun going down)
    // the palm tree
    g.strokeStyle = g.fillStyle = '#2C3B07'
    g.lineCap = 'round'
    g.lineWidth = 12
    g.beginPath(), g.moveTo(138, 196), g.quadraticCurveTo(122, 140, 132, 84), g.stroke()
    const leaf = (a, len) => {
        g.save()
        g.translate(132, 84)
        g.rotate(a)
        g.beginPath()
        g.moveTo(0, 0)
        g.quadraticCurveTo(len * 0.5, -len * 0.32, len, len * 0.2)
        g.quadraticCurveTo(len * 0.5, -len * 0.06, 0, 0)
        g.fill()
        g.restore()
    }
    ;[[-0.15, 66], [0.55, 56], [-0.85, 58], [Math.PI + 0.15, 66], [Math.PI - 0.55, 56], [Math.PI + 0.85, 58]].forEach(([a, l]) => leaf(a, l))
    // SF
    g.fillStyle = PALETTE.crema
    g.font = 'bold 44px sans-serif'
    g.textAlign = 'center'
    g.fillText('SF', 128, 238 - 16)
    capPatch = new THREE.CanvasTexture(c)
    capPatch.colorSpace = THREE.SRGBColorSpace
    return capPatch
}

function prepareClassic(scene) {
    const model = cloneSkinned(scene)
    model.updateMatrixWorld(true)
    const body = model.getObjectByName('Cube006')
    const crown = model.getObjectByName('Cube008')
    const head = model.getObjectByName('Cube011')
    const box = new THREE.Box3()

    // Body: one clay color · the open soles closed
    body.material = clayMaterial({ color: C.body, speckle: 0.22, rim: 0.28 })
    if (!capCache.has(body.geometry)) capCache.set(body.geometry, capFeet(body))
    body.geometry = capCache.get(body.geometry)
    restPositions(body).forEach((p) => box.expandByPoint(p))

    // Leaf crown + stem (one mesh): beige leaves, brown stem on top
    crown.geometry = crown.geometry.clone()
    const crownRest = restPositions(crown)
    crownRest.forEach((p) => box.expandByPoint(p))
    paintGradient(crown.geometry, crownRest.map((p) => p.y), [[0, C.leafEdge], [0.18, C.leaf], [0.5, C.leaf], [0.56, C.stem], [1, C.stemTip]])
    crown.material = clayMaterial({ vertexColors: true, speckle: 0.1, rim: 0.15 })

    // Head: subdivide the exported cage (same model, smooth), rust crown → orange chin
    // only when it arrives as the low-poly cage; an export with "Apply Modifiers" is already smooth
    const cage = head.geometry
    if (!headCache.has(cage)) headCache.set(cage, cage.attributes.position.count < 1500 ? catmullClark(cage, 2) : cage.clone())
    head.geometry = headCache.get(cage).clone()
    const headRest = restPositions(head)
    headRest.forEach((p) => box.expandByPoint(p))
    paintGradient(head.geometry, headRest.map((p) => p.y), [[0, C.light], [0.35, C.orange], [0.7, C.red], [1, C.rust]])
    head.material = clayMaterial({ vertexColors: true, speckle: 0.5, rim: 0.4 })

    // Expressive face on the head surface (eyes on the modeled bumps, brows, cheeks, mouths)
    const face = buildFace(head, scene)

    // The leaf crown is skinned to other bones than the head, so when he moved his head the head
    // went through the crown. Same geometry, now rigidly attached to the neck bone (like the head),
    // a hair higher so the leaves always sit on top of it.
    const neckBone = model.getObjectByName(RIG.neck)
    const toNeck = new THREE.Matrix4().copy(neckBone.matrixWorld).invert()
    const crownGeo = crown.geometry.clone()
    const cp = crownGeo.attributes.position
    crownRest.forEach((p, i) => {
        const v = p.clone().applyMatrix4(toNeck)
        cp.setXYZ(i, v.x, v.y, v.z)
    })
    crownGeo.deleteAttribute('skinIndex')
    crownGeo.deleteAttribute('skinWeight')
    crownGeo.computeBoundingBox()
    const cc = crownGeo.boundingBox.getCenter(new THREE.Vector3())
    crownGeo.translate(-cc.x, -cc.y, -cc.z).scale(1.03, 1.03, 1.03).translate(cc.x, cc.y + (crownGeo.boundingBox.max.y - crownGeo.boundingBox.min.y) * 0.06, cc.z)
    crownGeo.computeVertexNormals()
    const crownRigid = new THREE.Mesh(crownGeo, crown.material)
    crownRigid.name = 'CrownRigid'
    neckBone.add(crownRigid)
    crown.visible = false

    // Accessories for the events (hidden until needed): built in the model's rest space over the
    // leaf crown, then hung from the neck bone so they follow every move of the head
    const hats = buildHats(new THREE.Box3().setFromPoints(headRest), new THREE.Box3().setFromPoints(crownRest))
    Object.values(hats).forEach((h) => {
        h.visible = false
        model.add(h)
        neckBone.attach(h) // keeps its rest-pose place, now relative to the neck
    })

    model.traverse((o) => {
        if (!o.isMesh) return
        o.castShadow = true
        o.receiveShadow = true
        o.frustumCulled = false // skinned bounds don't follow the pose
    })

    const bones = Object.fromEntries(Object.entries(RIG).map(([k, name]) => [k, { ...boneInfo(model.getObjectByName(name)), limits: LIMITS[k] }]))
    // the head as an ellipsoid in NECK-bone space (the head mesh is a rigid child of that bone):
    // used to keep his hands from ever entering it
    head.geometry.computeBoundingBox()
    const hb = head.geometry.boundingBox.clone().applyMatrix4(head.matrix)
    const headShape = { c: hb.getCenter(new THREE.Vector3()), r: hb.getSize(new THREE.Vector3()).multiplyScalar(0.5) }
    const center = box.getCenter(new THREE.Vector3())
    const accessories = { santa: hats.santa, cap: hats.cap, glasses: face.glasses }
    return { model, bones, face, headShape, accessories, center, minY: box.min.y, scale: CHONTI_HEIGHT / (box.max.y - box.min.y) }
}

/**
 * The event hats, in the model's rest space (Chonti faces +Z, up +Y), sized on his head and crown,
 * seated on the leaf crown (its leaves end around the middle of its height; the stem goes inside):
 *  santa  Alumbrado: a red Christmas hat in one soft piece that flops over to one side, with a
 *         thick white fur brim and a pompom at the tip
 *  cap    Sucursal Fest: a cream baseball cap with a palm tree on the front and a curved visor
 */
function buildHats(headBox, crownBox) {
    const head = headBox.getSize(new THREE.Vector3())
    const crownH = crownBox.max.y - crownBox.min.y
    const crownW = crownBox.max.x - crownBox.min.x
    const cx = (headBox.min.x + headBox.max.x) / 2
    const cz = (headBox.min.z + headBox.max.z) / 2
    const leavesTop = crownBox.min.y + crownH * 0.5 // where the beige leaves end and the stem begins
    const R = Math.max(head.x * 0.34, crownW * 0.3) // hat radius
    const mat = (color, rough = 0.75) => new THREE.MeshStandardMaterial({ color, roughness: rough })

    // ── Christmas hat ──
    const santa = new THREE.Group()
    santa.name = 'HatSanta'
    const red = mat('#C8202B', 0.85)
    const fur = mat('#FFF8F0', 1)
    // one cone, then bent: the higher a vertex, the more it flops to the side and down
    const H = R * 2.2
    const cone = new THREE.ConeGeometry(R * 0.92, H, 32, 24, true)
    cone.translate(0, H / 2, 0)
    const pos = cone.attributes.position
    const v = new THREE.Vector3()
    const bendAt = (h) => {
        const t = Math.max(0, h / H - 0.25) / 0.75 // the bottom quarter stays straight
        return { x: t * t * R * 1.15, y: -t * t * t * R * 0.55 }
    }
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i)
        const b = bendAt(v.y)
        pos.setXYZ(i, v.x + b.x, v.y + b.y, v.z)
    }
    cone.computeVertexNormals()
    const body = new THREE.Mesh(cone, red)
    const brim = new THREE.Mesh(new THREE.TorusGeometry(R * 0.95, R * 0.24, 14, 40), fur)
    brim.rotation.x = Math.PI / 2
    const tipBend = bendAt(H)
    const pom = new THREE.Mesh(new THREE.SphereGeometry(R * 0.24, 20, 14), fur)
    pom.position.set(tipBend.x, H + tipBend.y, 0)
    santa.add(body, brim, pom)
    santa.position.set(cx, leavesTop - crownH * 0.06, cz - head.z * 0.03)
    santa.rotation.set(-0.1, 0, 0.08) // a little back and to one side, as it's worn

    // ── cap (cream, palm tree on the front) ──
    const cap = new THREE.Group()
    cap.name = 'HatCap'
    const cream = mat('#F1E6D0', 0.7)
    const creamDark = mat('#E2D3B6', 0.7)
    const dome = new THREE.Mesh(new THREE.SphereGeometry(R * 1.05, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), cream)
    dome.scale.y = 0.78
    // the seams of the panels
    for (let k = 0; k < 6; k++) {
        const seam = new THREE.Mesh(new THREE.TorusGeometry(R * 1.052, R * 0.012, 4, 24, Math.PI / 2), creamDark)
        seam.rotation.set(0, (k / 6) * Math.PI * 2, Math.PI / 2)
        seam.scale.set(0.78, 1, 1) // follows the flattened dome
        cap.add(seam)
    }
    // visor: a curved half-disc to the front, tipped down a little
    const visorGeo = new THREE.CylinderGeometry(R * 1.12, R * 1.12, R * 0.06, 36, 1, false, -1.25, 2.5)
    const visor = new THREE.Mesh(visorGeo, creamDark)
    visor.position.set(0, R * 0.03, R * 0.5)
    visor.rotation.x = 0.16
    const button = new THREE.Mesh(new THREE.SphereGeometry(R * 0.09, 12, 8), creamDark)
    button.position.y = R * 0.8
    // the palm tree: drawn once on a canvas, stuck on the front panel
    // (on the dome's surface ~25° up the front: y = 0.78·1.05R·sin25°, z = 1.05R·cos25°)
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.8, R * 0.8), new THREE.MeshBasicMaterial({ map: palmTexture(), transparent: true, depthWrite: false, toneMapped: false }))
    logo.position.set(0, R * 0.36, R * 0.98)
    logo.rotation.x = -0.36
    cap.add(dome, visor, button, logo)
    cap.position.set(cx, leavesTop - crownH * 0.04, cz)
    cap.rotation.x = -0.08

    for (const g of [santa, cap]) g.traverse((o) => o.isMesh && ((o.castShadow = true), (o.frustumCulled = false)))
    return { santa, cap }
}

/** A black palm tree (trunk + fronds) on a transparent canvas, for the front of the cap. */
let palmTex = null
function palmTexture() {
    if (palmTex) return palmTex
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    g.strokeStyle = g.fillStyle = '#1E1E1C'
    g.lineCap = 'round'
    // trunk: a slightly bent line
    g.lineWidth = 9
    g.beginPath()
    g.moveTo(66, 122)
    g.quadraticCurveTo(58, 80, 64, 46)
    g.stroke()
    // fronds: curved leaves out of the top
    const leaf = (angle, len) => {
        g.save()
        g.translate(64, 46)
        g.rotate(angle)
        g.beginPath()
        g.moveTo(0, 0)
        g.quadraticCurveTo(len * 0.5, -len * 0.32, len, len * 0.18)
        g.quadraticCurveTo(len * 0.5, -len * 0.08, 0, 0)
        g.fill()
        g.restore()
    }
    ;[[-0.15, 52], [0.55, 46], [-0.85, 48], [Math.PI + 0.15, 52], [Math.PI - 0.55, 46], [Math.PI + 0.85, 48]].forEach(([a, l]) => leaf(a, l))
    palmTex = new THREE.CanvasTexture(c)
    palmTex.colorSpace = THREE.SRGBColorSpace
    return palmTex
}

const Chonti = forwardRef(function Chonti(props, ref) {
    const [{ scene }, ...dressed] = useGLTF([CHONTI_URL, ...OUTFIT_URLS.map(([, url]) => url)])
    const prep = useMemo(() => prepare(scene, Object.fromEntries(OUTFIT_URLS.map(([kind], i) => [kind, dressed[i].scene]))), [scene, ...dressed]) // eslint-disable-line react-hooks/exhaustive-deps
    const body = useRef()

    useImperativeHandle(
        ref,
        () => ({
            body: body.current,
            bones: prep.bones,
            face: prep.face,
            headShape: prep.headShape,
            /** 'santa' (Alumbrado) · 'glasses' (Feria del Libro) · 'cap' (Sucursal Fest) · null */
            setAccessory: (kind) => {
                for (const [k, part] of Object.entries(prep.accessories)) {
                    const on = k === kind
                    ;(Array.isArray(part) ? part : [part]).forEach((p) => (p.visible = on))
                }
            },
        }),
        [prep]
    )

    return (
        <group scale={prep.scale} {...props}>
            {/* body: bob/sway; the model is re-centered so feet are at y = 0 and the body on the axis */}
            <group ref={body}>
                <primitive object={prep.model} position={[-prep.center.x, -prep.minY, -prep.center.z]} />
            </group>
        </group>
    )
})

export default Chonti

// ── Animation ────────────────────────────────────────────────────────────────────
const ARMS_DOWN = 0.35 // the rig's rest pose is an A-pose: relax the arms
// "interested" poses, measured on the model so the short arms reach without entering the head:
//  think   → right hand under the chin
//  scratch → left hand at the side of the head, scratching
// (his arms are short and his head is big: a hand under the chin or at the side of the head ended
// up as a raised fist — so he thinks with a hand on his tummy, and "¿y eso?" rubs it)
const THINK = { arm: [-0.6, -0.1], fore: [-1.05, -0.3] }
const SCRATCH = { arm: [-0.5, 0.1], fore: [-1.0, 0.28] }
// a real "¡hola!" (measured on the model): the arm up and out to the side, the open hand swinging
// from the elbow between pointing out (fore z 0) and upright beside the head (0.65), never into it
const WAVE = { arm: [-0.15, 1.0], fore: [-0.15, 0.32], swing: 0.32 }
// a belly laugh: both hands forward on his tummy (left / right mirrored on z)
const BELLY = { arm: [-0.55, 0.12], fore: [-1.0, 0.25] }
const lerp = THREE.MathUtils.lerp
const qa = new THREE.Quaternion()
const qb = new THREE.Quaternion()
const clamp = THREE.MathUtils.clamp
/** Rotate a bone from its rest pose around WORLD X (forward/back) and WORLD Z (sideways), within its limits. */
export function bend(info, x, z = 0, limits = info.limits) {
    const L = limits
    if (L) {
        x = clamp(x, L.x[0], L.x[1])
        z = clamp(z, L.z[0], L.z[1])
    }
    qa.setFromAxisAngle(info.ax, x)
    qb.setFromAxisAngle(info.az, z)
    info.bone.quaternion.copy(info.rest).multiply(qa).multiply(qb)
}
/** Normal (clamped) angles blended towards a measured pose target with weight w. */
function blendTo(info, x, z, target, w) {
    const L = info.limits
    return [lerp(clamp(x, L.x[0], L.x[1]), target[0], w), lerp(clamp(z, L.z[0], L.z[1]), target[1], w)]
}

// ── Hands never enter the head ─────────────────────────────────────────────────────
const HAND_TIP = new THREE.Vector3(0, 0.19, 0) // end of the forearm (+Y runs along the bone)
const HAND_RADIUS = 0.055
const vHand = new THREE.Vector3()
function handInHead(rig, fore) {
    const e = rig.headShape
    vHand.copy(HAND_TIP)
    fore.bone.localToWorld(vHand)
    rig.bones.neck.bone.worldToLocal(vHand)
    const dx = (vHand.x - e.c.x) / (e.r.x + HAND_RADIUS)
    const dy = (vHand.y - e.c.y) / (e.r.y + HAND_RADIUS)
    const dz = (vHand.z - e.c.z) / (e.r.z + HAND_RADIUS)
    return dx * dx + dy * dy + dz * dz < 1
}
/**
 * Poses one arm (upper arm + forearm). If the hand would end up inside the head, the pose is
 * pulled back towards the relaxed arm (binary search) so the hand stops right at its surface.
 */
// (the skin of his elbow only bends well forwards: bent sideways much past this it pinched into a
// sharp crease — the rest of a sideways bend goes to the shoulder, so the gesture still reads)
const FORE_SIDE = 0.28
function placeArm(rig, arm, fore, a, f, restZ) {
    const side = Math.sign(f[1]) * Math.max(0, Math.abs(f[1]) - FORE_SIDE)
    if (side) (f = [f[0], f[1] - side]), (a = [a[0], a[1] + side * 0.6])
    f = [Math.max(-1.15, f[0]), f[1]] // (and forwards not past the point where it folds on itself)
    const apply = (k) => {
        bend(arm, a[0] * k, lerp(restZ, a[1], k), null)
        bend(fore, f[0] * k, f[1] * k, null)
        arm.bone.updateMatrixWorld(true)
    }
    apply(1)
    if (!rig.headShape || !handInHead(rig, fore)) return
    let lo = 0, hi = 1
    for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2
        apply(mid)
        if (handInHead(rig, fore)) hi = mid
        else lo = mid
    }
    apply(lo)
}

/**
 * Procedural body language on the GLB skeleton + facial expression.
 * `s` = { step, walk, read, talk, flail, lookDown, wave, excite, think, scratch, dance, look, expr }
 *  step    stride phase (radians), advanced by the caller with the speed
 *  walk    0..1 walk cycle (legs and arms swing in opposition, bouncy steps)
 *  read    0..1 "interested visitor": leans in, hands behind his back, curious head tilts and nods
 *  excite  0..1 open arms with a tiny bounce (e.g. a new date appears)
 *  think   0..1 hand under the chin, head tilted, looking up ("mmm…")
 *  scratch 0..1 scratches the side of his head, head tilted ("¿y eso?")
 *  dance   0..1 salsa: alternating arms, steps, hip sway and head bob
 *  talk    0..1 head bobs, small hand gestures and mouth flaps (guide)
 *  look    optional [x, y] gaze for the eyes (e.g. towards the mouse)
 *  lookDown, flail, wave … for the fall and the greeting
 *  expr    face preset (chontiFace.js EXPRESSIONS)
 * Every joint is clamped (LIMITS) and every hand is checked against the head, so his arms never
 * go through his head or belly.
 */
export function poseChonti(rig, s, t) {
    if (!rig?.bones) return
    // (mouth: talking with the mouth only — the intro, where his hands are busy walking / reading)
    const { step = 0, walk = 0, read = 0, talk = 0, mouth = 0, flail = 0, lookDown = 0, wave = 0, excite = 0, think = 0, scratch = 0, dance = 0, laugh = 0, sit = 0, eat = 0, write = 0, look = null, expr = 'happy' } = s
    const chuckle = Math.abs(Math.sin(t * 15)) * laugh // the "ja ja ja" rhythm
    const { legL, legR, armL, armR, foreL, foreR, neck, spine } = rig.bones
    const sw = Math.sin(step)
    // (the arms always start relaxed by his sides: no gesture opens them out like a T)
    const down = ARMS_DOWN * (1 - flail)
    const hop = Math.abs(Math.sin(t * 6)) * excite * 0.35 // barely leaves the floor
    const gesture = Math.sin(t * 3.1) * talk
    const beat = Math.sin(t * 7.2) * dance // salsa: one, two, three…
    const posing = Math.max(think, scratch)
    // (eating: a bite every couple of seconds — his head goes down to the empanada in his hands)
    const bite = eat * THREE.MathUtils.smoothstep(Math.sin(t * 2.4), 0.3, 0.9)

    // legs (negative X = forward)
    // falling: the legs pedal in the air, one against the other, opening and closing a little
    if (flail > 0.01) {
        // (a slow, even pedal — one leg against the other —, the legs a little apart)
        const kickL = Math.sin(t * 3.6) * 0.26 * flail
        const kickR = Math.sin(t * 3.6 + Math.PI) * 0.26 * flail
        bend(legL, -sw * 0.5 * walk * (1 - flail) - 0.12 * flail + kickL, 0.1 * flail, null)
        bend(legR, sw * 0.5 * walk * (1 - flail) - 0.12 * flail + kickR, -0.1 * flail, null)
    } else {
        // (sitting on the floor: his legs straight out in front of him, a little apart)
        const free = sit > 0.01 ? null : undefined
        bend(legL, lerp(-sw * 0.5 * walk + hop * 0.15 + beat * 0.28, -1.45, sit), 0.12 * sit, free)
        bend(legR, lerp(sw * 0.5 * walk + hop * 0.15 - beat * 0.28, -1.45, sit), -0.12 * sit, free)
    }
    bend(spine, 0, sw * 0.03 * walk + beat * 0.05)

    // head first (the hands are checked against it): curious tilts and nods while reading,
    // bobs when talking or dancing, looks down at the edge
    const nod = Math.abs(Math.sin(t * 8)) * 0.07 * talk
    const curiousTilt = Math.sin(t * 0.9) * 0.18 * read
    bend(
        neck,
        // (looking down / up: only part of it in the neck — his big head on a low pivot swung so far
        // it seemed to come off the body — the rest is the whole body leaning, below)
        read * (0.14 + Math.sin(t * 1.7) * 0.04) * (1 - posing) + lookDown * 0.32 + bite * 0.22 + nod - excite * 0.1 - think * 0.18 + Math.abs(beat) * 0.08 - laugh * 0.2 - chuckle * 0.07 + Math.sin(t * 3.7) * 0.08 * flail,
        Math.sin(t * 4.3) * 0.08 * flail + Math.sin(step + 0.6) * 0.06 * walk + curiousTilt * (1 - posing) + Math.sin(t * 1.3) * 0.06 * talk + think * 0.2 - scratch * 0.22 + Math.sin(t * 3.6) * 0.14 * dance - wave * (0.1 + Math.sin(t * 10.5) * 0.03)
    )
    neck.bone.updateMatrixWorld(true)

    // arms: walk swing · hands behind the back while reading · open arms when excited · flail ·
    // wave · dance — then the measured poses (think / scratch) on top
    const armX = (side) => side * sw * 0.5 * walk + read * 0.55 - talk * 0.25 + (side > 0 ? gesture : -gesture) * 0.25 - dance * 0.35
    const raise = 0 // (the fall's raised arms are set below, as a pose of their own)
    // dancing: the elbows bent and the arms swinging in front of him by turns, close to the body
    const danceUp = (side) => dance * (0.12 + 0.12 * Math.sin(t * 7.2 + (side > 0 ? 0 : Math.PI)))
    const scratchFore = [SCRATCH.fore[0] + Math.sin(t * 6) * 0.1, SCRATCH.fore[1]] // (rubbing his tummy, slowly)
    const aL = blendTo(armL, armX(1), -down + raise - read * 0.12 + danceUp(1), SCRATCH.arm, scratch)
    const fL = blendTo(foreL, -0.25 * walk - read * 0.35 - talk * 0.35 - dance * 0.8, 0, scratchFore, scratch)
    const aR = blendTo(armR, armX(-1), down - raise + read * 0.12 - danceUp(-1), THINK.arm, think)
    const fR = blendTo(foreR, -0.25 * walk - read * 0.35 - talk * 0.35 - dance * 0.8, 0, THINK.fore, think)
    if (talk > 0.001) {
        // explaining: both hands in front of him, moving in turns (one rises as the other comes
        // down), opening out now and then, like someone telling you something
        const w = talk * (1 - Math.max(think, scratch, dance)) * 0.9
        const beatL = Math.sin(t * 4.2)
        const beatR = Math.sin(t * 4.2 + 2.2)
        const open = 0.5 + 0.5 * Math.sin(t * 1.35)
        // (close to his body: opened out as far as before, his arms looked like a T)
        aL[0] = lerp(aL[0], -0.45 + beatL * 0.14, w)
        aL[1] = lerp(aL[1], -0.15 + open * 0.18, w)
        fL[0] = lerp(fL[0], -0.9 + beatL * 0.2, w)
        fL[1] = lerp(fL[1], 0.1 + open * 0.12, w)
        aR[0] = lerp(aR[0], -0.45 + beatR * 0.14, w)
        aR[1] = lerp(aR[1], -(-0.15 + open * 0.18), w)
        fR[0] = lerp(fR[0], -0.9 + beatR * 0.2, w)
        fR[1] = lerp(fR[1], -(0.1 + open * 0.12), w)
    }
    if (excite > 0.001) {
        // happy / surprised: his little hands together in front of his chest, clapping and bouncing
        // with the hop (instead of opening his arms wide)
        const w = excite * (1 - Math.max(think, scratch, dance, laugh))
        // (low, in front of his tummy: higher up, his big head is in the way of his short arms)
        const clap = Math.max(0, Math.sin(t * 12)) * 0.14
        // (z: the rig's rest pose is an A-pose — near −ARMS_DOWN the arm hangs by his side)
        aL[0] = lerp(aL[0], -0.7, w)
        aL[1] = lerp(aL[1], -0.32 + clap * 0.3, w)
        fL[0] = lerp(fL[0], -1.15, w)
        fL[1] = lerp(fL[1], 0.55 - clap, w)
        aR[0] = lerp(aR[0], -0.7, w)
        aR[1] = lerp(aR[1], 0.32 - clap * 0.3, w)
        fR[0] = lerp(fR[0], -1.15, w)
        fR[1] = lerp(fR[1], -(0.55 - clap), w)
    }
    if (dance > 0.001) {
        // the salsa / techno step: forearms up in front, swinging by turns with the beat
        const w = dance * (1 - Math.max(think, scratch, laugh))
        const sL = Math.sin(t * 7.2), sR = Math.sin(t * 7.2 + Math.PI)
        aL[0] = lerp(aL[0], -0.45 + sL * 0.25, w)
        fL[0] = lerp(fL[0], -1.2 + sL * 0.2, w)
        fL[1] = lerp(fL[1], 0.2, w)
        aR[0] = lerp(aR[0], -0.45 + sR * 0.25, w)
        fR[0] = lerp(fR[0], -1.2 + sR * 0.2, w)
        fR[1] = lerp(fR[1], -0.2, w)
    }
    if (wave > 0.001) {
        // the wave rises smoothly into the pose and the hand swings ~1.7 times a second
        const swing = Math.sin(t * 10.5) * WAVE.swing
        aL[0] = lerp(aL[0], WAVE.arm[0], wave)
        aL[1] = lerp(aL[1], WAVE.arm[1] + Math.sin(t * 10.5 - 0.6) * 0.06, wave) // the shoulder follows a little
        fL[0] = lerp(fL[0], WAVE.fore[0], wave)
        fL[1] = lerp(fL[1], WAVE.fore[1] + swing, wave)
    }
    if (laugh > 0.001) {
        // laughing: hands on the belly, shaking with each "ja"
        const shake = chuckle * 0.12
        aL[0] = lerp(aL[0], BELLY.arm[0] + shake, laugh)
        aL[1] = lerp(aL[1], BELLY.arm[1], laugh)
        fL[0] = lerp(fL[0], BELLY.fore[0], laugh)
        fL[1] = lerp(fL[1], BELLY.fore[1], laugh)
        aR[0] = lerp(aR[0], BELLY.arm[0] + shake, laugh)
        aR[1] = lerp(aR[1], -BELLY.arm[1], laugh)
        fR[0] = lerp(fR[0], BELLY.fore[0], laugh)
        fR[1] = lerp(fR[1], -BELLY.fore[1], laugh)
    }
    if (eat > 0.001) {
        // eating: the empanada held in both hands in front of him (his arms are short and his head is
        // big: his hands never reach his mouth) — he bends his head down to it for each bite, above
        // (low, in front of his tummy: higher up his head, bending down for the bite, met his hands)
        const lift = bite * 0.08
        aL[0] = lerp(aL[0], -0.62 - lift, eat)
        aL[1] = lerp(aL[1], -0.3, eat)
        fL[0] = lerp(fL[0], -1.05, eat)
        fL[1] = lerp(fL[1], 0.5, eat)
        aR[0] = lerp(aR[0], -0.62 - lift, eat)
        aR[1] = lerp(aR[1], 0.3, eat)
        fR[0] = lerp(fR[0], -1.05, eat)
        fR[1] = lerp(fR[1], -0.5, eat)
    }
    if (write > 0.001) {
        // sitting with his notebook on his lap: both hands on it, the right one writing
        const pen = Math.sin(t * 8) * 0.06
        aL[0] = lerp(aL[0], -0.5, write)
        aL[1] = lerp(aL[1], -0.2, write)
        fL[0] = lerp(fL[0], -0.85, write)
        fL[1] = lerp(fL[1], 0.25, write)
        aR[0] = lerp(aR[0], -0.5 + pen * 0.5, write)
        aR[1] = lerp(aR[1], 0.2, write)
        fR[0] = lerp(fR[0], -0.85 + pen, write)
        fR[1] = lerp(fR[1], -0.25 + pen * 0.5, write)
    }
    if (flail > 0.01) {
        // falling (on his back, facing the camera): both arms reaching out in front of him — up, to
        // the camera —, a little open, as if trying to catch hold of something; the elbows only a
        // little bent, waving slowly and evenly, the two arms half a beat apart (no T, no jitter, and
        // well clear of his big head)
        const flapL = Math.sin(t * 4.2)
        const flapR = Math.sin(t * 4.2 + 1.3)
        aL[0] = lerp(aL[0], -0.7 + flapL * 0.12, flail)
        aL[1] = lerp(aL[1], -0.05 + flapL * 0.06, flail)
        aR[0] = lerp(aR[0], -0.7 + flapR * 0.12, flail)
        aR[1] = lerp(aR[1], -(-0.05 + flapR * 0.06), flail)
        fL[0] = lerp(fL[0], -0.45 + flapL * 0.08, flail)
        fL[1] = lerp(fL[1], 0.12, flail)
        fR[0] = lerp(fR[0], -0.45 + flapR * 0.08, flail)
        fR[1] = lerp(fR[1], -0.12, flail)
    }
    placeArm(rig, armL, foreL, aL, fL, -ARMS_DOWN)
    placeArm(rig, armR, foreR, aR, fR, ARMS_DOWN)

    // whole body: bouncy steps, leaning in to read, hopping with joy, hips to the beat
    rig.body.position.y = Math.abs(Math.cos(step)) * 0.05 * walk + hop * 0.05 + Math.sin(t * 2) * 0.008 * (1 - walk) + Math.abs(beat) * 0.035 + chuckle * 0.03
    rig.body.rotation.z = sw * 0.05 * walk + Math.sin(t * 3.6) * 0.07 * dance + Math.sin(t * 10.5 - 0.4) * 0.025 * wave // the body sways with the hand
    rig.body.rotation.x = read * 0.12 * (1 - posing) + lookDown * 0.17 - laugh * 0.08 // leans with his gaze; back a little when he laughs
    // sitting: the whole body down until his seat is on the floor (where his hips are, measured once)
    if (sit > 0.001) {
        if (rig.hipY == null) rig.hipY = rig.body.worldToLocal(rig.bones.legL.bone.getWorldPosition(new THREE.Vector3())).y
        rig.body.position.y -= sit * rig.hipY * 0.82
    }

    updateFace(rig.face, expr, Math.max(talk, mouth), t, look)
}

useGLTF.preload(CHONTI_URL)
OUTFIT_URLS.forEach(([, url]) => useGLTF.preload(url))
