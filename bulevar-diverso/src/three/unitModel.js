import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { clayed } from './places/PlaceModels.jsx'

/**
 * Models of Assets/modelos made into pieces to draw MANY times (instances): Chonti's clay on them,
 * one geometry per material. Each piece also says which material it had in the model (`orig`), so
 * a part can be swapped (the light of a lamp) or tinted per instance (the crown of a tree).
 */
/**
 * For the lights of the Alumbrado: a material that glows in the model (emissive) stays a light —
 * its glow colour, as transparent as it was — instead of Chonti's clay. Use as `swap`.
 */
const glowCache = new Map()
export function glowSwap(orig, clay) {
    const e = orig?.emissive
    if (!e || e.r + e.g + e.b < 0.05) return clay
    if (!glowCache.has(orig)) {
        const see = orig.transparent || orig.opacity < 1
        glowCache.set(orig, new THREE.MeshBasicMaterial({ color: e.clone(), transparent: see, opacity: see ? Math.max(0.35, orig.opacity) : 1, depthWrite: !see, toneMapped: false, side: THREE.DoubleSide }))
    }
    return glowCache.get(orig)
}

export function bakedPieces(scene, speckleScale = 16) {
    const originals = []
    scene.traverse((o) => o.isMesh && originals.push(Array.isArray(o.material) ? o.material : [o.material]))
    const pieces = []
    let k = 0
    clayed(scene, { speckleScale, fixed: true }).traverse((m) => {
        if (!m.isMesh) return
        const orig = originals[k++] ?? []
        const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()
        const mats = Array.isArray(m.material) ? m.material : [m.material]
        const groups = Array.isArray(m.material) && g.groups.length ? g.groups : [{ start: 0, count: g.attributes.position.count, materialIndex: 0 }]
        for (const gr of groups) {
            const part = new THREE.BufferGeometry()
            for (const key of ['position', 'normal']) part.setAttribute(key, new THREE.BufferAttribute(g.attributes[key].array.slice(gr.start * 3, (gr.start + gr.count) * 3), 3))
            pieces.push({ geo: part, mat: mats[gr.materialIndex ?? 0], orig: orig[gr.materialIndex ?? 0], name: m.name })
        }
    })
    return pieces
}
const boxOf = (pieces) => {
    const box = new THREE.Box3()
    pieces.forEach((p) => (p.geo.computeBoundingBox(), box.union(p.geo.boundingBox)))
    return box
}
/** Pieces → one geometry per material (`swap(orig, clay)` can give another material). */
export function merged(pieces, m4, swap) {
    const byMat = new Map()
    for (const p of pieces) {
        const mat = swap?.(p.orig, p.mat) ?? p.mat
        byMat.set(mat, [...(byMat.get(mat) ?? []), p.geo.applyMatrix4(m4)])
    }
    return [...byMat].map(([mat, list]) => ({ mat, geo: mergeGeometries(list) }))
}

/**
 * Baked into ONE length unit along +x (its longest side), centred, base on the ground.
 * `front`: which end goes to +x (+1 its +z, -1 its -z). → { parts: [{ geo, mat }], size }
 * (size: its box after that — 1 long, size.y high, size.z deep).
 */
export function unitModel(scene, { front = 1, speckleScale = 16, swap } = {}) {
    const pieces = bakedPieces(scene, speckleScale)
    const box = boxOf(pieces)
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
    const alongZ = size.z >= size.x
    const len = Math.max(size.x, size.z) || 1
    const m4 = new THREE.Matrix4().makeScale(1 / len, 1 / len, 1 / len)
        .multiply(new THREE.Matrix4().makeRotationY(alongZ ? (front * Math.PI) / 2 : front > 0 ? 0 : Math.PI))
        .multiply(new THREE.Matrix4().makeTranslation(-c.x, -box.min.y, -c.z))
    const parts = merged(pieces, m4, swap)
    return { parts, size: new THREE.Vector3(1, size.y / len, Math.min(size.x, size.z) / len) }
}
/** (the same, only the pieces) */
export const unitParts = (scene, options) => unitModel(scene, options).parts

/**
 * A pole (street lamp, traffic light): standing on its BASE at the origin, ONE unit high, its arm
 * pointing to +z. → { parts, arm, tip } (arm: how far the arm reaches, tip: height of its end).
 */
export function poleModel(scene, { speckleScale = 16, swap } = {}) {
    const pieces = bakedPieces(scene, speckleScale)
    const box = boxOf(pieces)
    const h = box.max.y - box.min.y || 1
    const v = new THREE.Vector3()
    const base = new THREE.Vector3(), far = new THREE.Vector3()
    let n = 0, best = -1
    for (const p of pieces) {
        const a = p.geo.attributes.position
        for (let i = 0; i < a.count; i++) {
            v.fromBufferAttribute(a, i)
            if (v.y < box.min.y + h * 0.05) (base.x += v.x), (base.z += v.z), n++
        }
    }
    base.divideScalar(n || 1)
    for (const p of pieces) {
        const a = p.geo.attributes.position
        for (let i = 0; i < a.count; i++) {
            v.fromBufferAttribute(a, i)
            const d = (v.x - base.x) ** 2 + (v.z - base.z) ** 2
            if (v.y > box.min.y + h * 0.6 && d > best) (best = d), far.copy(v)
        }
    }
    const angle = Math.atan2(far.x - base.x, far.z - base.z) // (turn the arm to +z)
    const m4 = new THREE.Matrix4().makeScale(1 / h, 1 / h, 1 / h)
        .multiply(new THREE.Matrix4().makeRotationY(-angle))
        .multiply(new THREE.Matrix4().makeTranslation(-base.x, -box.min.y, -base.z))
    const parts = merged(pieces, m4, swap)
    return { parts, arm: Math.sqrt(best) / h, tip: (far.y - box.min.y) / h }
}
