import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Catmull–Clark subdivision — the same algorithm as Blender's "Subdivision Surface" modifier.
 * The modifier isn't applied when the head is exported to glTF, so the GLB only contains the
 * low-poly cage; subdividing that same cage here recovers the smooth shape seen in Blender
 * (100% the original model, nothing replaced).
 *
 * glTF stores triangles: Blender's quads are rebuilt first by pairing the two consecutive
 * triangles that share an edge. Only positions are used (normals are recomputed, no textures).
 */
export function catmullClark(source, levels = 3) {
    let g = new THREE.BufferGeometry()
    g.setAttribute('position', source.attributes.position.clone())
    if (source.index) g.setIndex(source.index.clone())
    g = mergeVertices(g, 1e-4) // weld the seams so the surface is continuous

    let verts = []
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) verts.push(new THREE.Vector3().fromBufferAttribute(pos, i))
    let faces = rebuildQuads(Array.from(g.index.array))

    for (let l = 0; l < levels; l++) ({ verts, faces } = subdivideOnce(verts, faces))

    // triangulate the final quads
    const index = []
    faces.forEach((f) => {
        for (let i = 1; i < f.length - 1; i++) index.push(f[0], f[i], f[i + 1])
    })
    const out = new THREE.BufferGeometry()
    out.setAttribute('position', new THREE.Float32BufferAttribute(verts.flatMap((v) => [v.x, v.y, v.z]), 3))
    out.setIndex(index)
    out.computeVertexNormals()
    return out
}

/** Pair consecutive triangles that share an edge back into the original quads. */
function rebuildQuads(idx) {
    const faces = []
    for (let t = 0; t < idx.length; t += 3) {
        const a = idx.slice(t, t + 3)
        const b = idx.slice(t + 3, t + 6)
        if (b.length === 3) {
            const shared = a.filter((v) => b.includes(v))
            if (shared.length === 2) {
                const extra = b.find((v) => !a.includes(v))
                // insert the extra vertex between the two shared ones, keeping the winding of `a`
                for (let i = 0; i < 3; i++) {
                    const p = a[i], q = a[(i + 1) % 3]
                    if (shared.includes(p) && shared.includes(q)) {
                        faces.push([...a.slice(0, i + 1), extra, ...a.slice(i + 1)])
                        break
                    }
                }
                t += 3
                continue
            }
        }
        faces.push(a)
    }
    return faces
}

function subdivideOnce(verts, faces) {
    const key = (a, b) => (a < b ? `${a}_${b}` : `${b}_${a}`)
    const facePts = faces.map((f) => f.reduce((s, i) => s.add(verts[i]), new THREE.Vector3()).divideScalar(f.length))

    const edges = new Map() // key → { a, b, faces: [] }
    const vertFaces = verts.map(() => [])
    const vertEdges = verts.map(() => new Set())
    faces.forEach((f, fi) => {
        f.forEach((v, i) => {
            const w = f[(i + 1) % f.length]
            const k = key(v, w)
            if (!edges.has(k)) edges.set(k, { a: v, b: w, faces: [] })
            edges.get(k).faces.push(fi)
            vertFaces[v].push(fi)
            vertEdges[v].add(k)
            vertEdges[w].add(k)
        })
    })

    const out = []
    // new positions of the original vertices
    verts.forEach((P, i) => {
        const es = [...vertEdges[i]].map((k) => edges.get(k))
        const boundary = es.filter((e) => e.faces.length < 2)
        if (boundary.length) {
            // crease rule on open borders: 3/4 P + 1/8 neighbours
            const s = new THREE.Vector3()
            boundary.forEach((e) => s.add(verts[e.a === i ? e.b : e.a]))
            out.push(P.clone().multiplyScalar(0.75).addScaledVector(s, 0.125 * (2 / Math.max(2, boundary.length))))
            return
        }
        const n = vertFaces[i].length
        const F = vertFaces[i].reduce((s, fi) => s.add(facePts[fi]), new THREE.Vector3()).divideScalar(n)
        const R = es.reduce((s, e) => s.add(verts[e.a].clone().add(verts[e.b]).multiplyScalar(0.5)), new THREE.Vector3()).divideScalar(es.length)
        out.push(F.add(R.multiplyScalar(2)).addScaledVector(P, n - 3).divideScalar(n))
    })
    // face points
    const faceIndex = facePts.map((p) => out.push(p.clone()) - 1)
    // edge points
    edges.forEach((e) => {
        const p = verts[e.a].clone().add(verts[e.b])
        if (e.faces.length === 2) p.add(facePts[e.faces[0]]).add(facePts[e.faces[1]]).divideScalar(4)
        else p.multiplyScalar(0.5)
        e.index = out.push(p) - 1
    })
    // every n-gon becomes n quads
    const newFaces = []
    faces.forEach((f, fi) => {
        f.forEach((v, i) => {
            const next = f[(i + 1) % f.length]
            const prev = f[(i - 1 + f.length) % f.length]
            newFaces.push([v, edges.get(key(v, next)).index, faceIndex[fi], edges.get(key(prev, v)).index])
        })
    })
    return { verts: out, faces: newFaces }
}
