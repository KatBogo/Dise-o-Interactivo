import * as THREE from 'three'

/**
 * Where the little Chonti of the routes can walk, read from the island itself — so he never goes
 * through anything. A grid of cells over an area, each one either free (with the height of its floor)
 * or blocked:
 *   · free: the highest thing over the cell, seen from above, is a FLOOR — something flat (a walk, a
 *     path, the plaza of La Tertulia) or the ground of the island — with nothing over it
 *   · blocked: the streets (the cars), the river, and everything standing — hedges, pedestals,
 *     panels, lamp posts, benches, trees, buildings —, then a margin as wide as Chonti around them
 * (Seen from above at once: every triangle over the area is laid on the cells it covers, the highest
 * one wins — a ray per cell went through every triangle of the island and took seconds.) Then it gives
 * paths around the obstacles and the nearest free spot to stand (or sit) at.
 */
const CELL = 0.04
const CLEAR = 0.09 // (half his width: the paths of the Gato run narrow between their hedges)
const STEP = 0.07 // (the step up to the plaza of La Tertulia: 6 cm)
const FLOOR = /^(anden|Plano|cuadras_pavimento|suelo_gato|bulevar_peatonal|bulevar_corredor|ciclorruta_\d|ciclorruta$|pasarela|retreta|isla_cesped)/
const NOT_FLOOR = /^(calle|Plane|lineas_de_calle|rio_)/
const SKIP = /luz|_fondo$|_lados$/

export function walkGrid(scene, [x0, z0, x1, z1], exclude) {
    const nx = Math.ceil((x1 - x0) / CELL) + 1, nz = Math.ceil((z1 - z0) / CELL) + 1
    const total = nx * nz
    const top = new Float32Array(total).fill(-Infinity) // the highest surface over each cell
    const owner = new Array(total).fill(null) // …and what it is
    const up = new Uint8Array(total) // …and if it faces up
    const area = new THREE.Box3(new THREE.Vector3(x0, -1, z0), new THREE.Vector3(x1, 3, z1))
    const b = new THREE.Box3(), size = new THREE.Vector3()
    const standing = []
    const flat = new Map()
    scene.updateMatrixWorld(true)
    const meshes = []
    scene.traverse((o) => {
        if (!o.isMesh || o.isInstancedMesh || !o.visible || !o.name || exclude.has(o) || SKIP.test(o.name) || o.material?.blending === THREE.AdditiveBlending) return
        for (let p = o.parent; p; p = p.parent) if (!p.visible) return
        b.setFromObject(o)
        if (!b.intersectsBox(area) || b.min.y > 0.9) return // (not what floats high: a marker over a stop)
        b.getSize(size)
        meshes.push(o)
        flat.set(o, size.y < 0.02)
        // (thin things standing — a lamp post, a panel's legs, a gata — the cells may miss: their
        // footprint counts; the long ones — a winding hedge — the cells see, their box would cover the path)
        if (size.y > 0.05 && b.min.y < 0.5 && b.max.y > 0.33 && Math.max(size.x, size.z) < 0.35) standing.push(b.clone())
    })
    // every triangle over the area, laid on the cells it covers (the highest wins)
    const a = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3()
    for (const o of meshes) {
        const pos = o.geometry.attributes.position, index = o.geometry.index
        const count = index ? index.count : pos.count
        const mw = o.matrixWorld
        for (let t = 0; t < count; t += 3) {
            const i0 = index ? index.getX(t) : t, i1 = index ? index.getX(t + 1) : t + 1, i2 = index ? index.getX(t + 2) : t + 2
            a.fromBufferAttribute(pos, i0).applyMatrix4(mw)
            c.fromBufferAttribute(pos, i1).applyMatrix4(mw)
            d.fromBufferAttribute(pos, i2).applyMatrix4(mw)
            const minx = Math.min(a.x, c.x, d.x), maxx = Math.max(a.x, c.x, d.x), minz = Math.min(a.z, c.z, d.z), maxz = Math.max(a.z, c.z, d.z)
            if (maxx < x0 || minx > x1 || maxz < z0 || minz > z1) continue
            // (its plane: y over a point; a wall seen from above covers nothing)
            const den = (c.z - d.z) * (a.x - d.x) + (d.x - c.x) * (a.z - d.z)
            if (Math.abs(den) < 1e-10) continue
            e1.subVectors(c, a), e2.subVectors(d, a)
            const ny = e1.z * e2.x - e1.x * e2.z, nl = e1.clone().cross(e2).length() || 1
            const facesUp = Math.abs(ny / nl) > 0.8
            const i0c = Math.max(0, Math.ceil((minx - x0) / CELL)), i1c = Math.min(nx - 1, Math.floor((maxx - x0) / CELL))
            const k0c = Math.max(0, Math.ceil((minz - z0) / CELL)), k1c = Math.min(nz - 1, Math.floor((maxz - z0) / CELL))
            for (let k = k0c; k <= k1c; k++) {
                const z = z0 + k * CELL
                for (let i = i0c; i <= i1c; i++) {
                    const x = x0 + i * CELL
                    const w1 = ((c.z - d.z) * (x - d.x) + (d.x - c.x) * (z - d.z)) / den
                    const w2 = ((d.z - a.z) * (x - d.x) + (a.x - d.x) * (z - d.z)) / den
                    const w3 = 1 - w1 - w2
                    if (w1 < -1e-6 || w2 < -1e-6 || w3 < -1e-6) continue
                    const y = w1 * a.y + w2 * c.y + w3 * d.y
                    const j = k * nx + i
                    if (y > top[j]) (top[j] = y), (owner[j] = o), (up[j] = facesUp ? 1 : 0)
                }
            }
        }
    }
    // free: a floor on top, facing up, low enough, no thin thing standing on it
    const ground = new Float32Array(total).fill(NaN)
    for (let k = 0; k < nz; k++)
        for (let i = 0; i < nx; i++) {
            const j = k * nx + i, o = owner[j]
            if (!o || top[j] > 0.45 || !up[j] || NOT_FLOOR.test(o.name) || !(FLOOR.test(o.name) || flat.get(o))) continue
            const x = x0 + i * CELL, z = z0 + k * CELL
            if (standing.some((s) => x > s.min.x - CLEAR && x < s.max.x + CLEAR && z > s.min.z - CLEAR && z < s.max.z + CLEAR)) continue
            ground[j] = top[j]
        }
    // the margin around what blocks (as wide as him)
    const r = Math.floor(CLEAR / CELL), rr = (CLEAR / CELL) ** 2
    const cells = ground.slice()
    for (let k = 0; k < nz; k++)
        for (let i = 0; i < nx; i++) {
            if (Number.isNaN(ground[k * nx + i])) continue
            search: for (let dk = -r; dk <= r; dk++)
                for (let di = -r; di <= r; di++) {
                    if (di * di + dk * dk > rr) continue
                    const ii = i + di, kk = k + dk
                    if (ii < 0 || kk < 0 || ii >= nx || kk >= nz || Number.isNaN(ground[kk * nx + ii])) {
                        cells[k * nx + i] = NaN
                        break search
                    }
                }
        }
    // the biggest stretch he can walk all over (the paths of a park, not a pocket of lawn closed in by
    // its hedges): where he goes from spot to spot
    const label = new Int32Array(total).fill(-1)
    let best = -1, bestSize = 0
    for (let s = 0; s < total; s++) {
        if (label[s] >= 0 || Number.isNaN(cells[s])) continue
        const queue = [s]
        label[s] = s
        let n = 0
        while (queue.length) {
            const cur = queue.pop()
            n++
            const ci = cur % nx, ck = Math.floor(cur / nx)
            for (const [di, dk] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const i = ci + di, k = ck + dk
                if (i < 0 || k < 0 || i >= nx || k >= nz) continue
                const j = k * nx + i
                if (label[j] >= 0 || Number.isNaN(cells[j]) || Math.abs(cells[j] - cells[cur]) > STEP) continue
                label[j] = s
                queue.push(j)
            }
        }
        if (n > bestSize) (best = s), (bestSize = n)
    }

    const g = {
        ready: true,
        cells,
        raw: ground, // (before the margin: to look at, in dev)
        step: () => true,
        main: (j) => label[j] === best,
        /** The floor at a point (null: blocked). */
        at(x, z) {
            const i = Math.round((x - x0) / CELL), k = Math.round((z - z0) / CELL)
            if (i < 0 || k < 0 || i >= nx || k >= nz) return null
            const y = cells[k * nx + i]
            return Number.isNaN(y) ? null : y
        },
        /** The free spot nearest to (x, z) with `room` around it free too (sitting: his legs out) — on the
         * biggest stretch he can walk all over (`anywhere`: not only there). */
        nearest(x, z, room = 0, anywhere = false) {
            const ci = Math.round((x - x0) / CELL), ck = Math.round((z - z0) / CELL)
            const rr2 = Math.ceil(room / CELL)
            const ok = (i, k) => {
                if (!anywhere && !g.main(k * nx + i)) return false
                for (let dk = -rr2; dk <= rr2; dk++)
                    for (let di = -rr2; di <= rr2; di++) {
                        if (di * di + dk * dk > rr2 * rr2) continue
                        const ii = i + di, kk = k + dk
                        if (ii < 0 || kk < 0 || ii >= nx || kk >= nz || Number.isNaN(cells[kk * nx + ii])) return false
                    }
                return true
            }
            for (let dd = 0; dd < Math.max(nx, nz); dd++)
                for (let dk = -dd; dk <= dd; dk++)
                    for (let di = -dd; di <= dd; di++) {
                        if (Math.max(Math.abs(di), Math.abs(dk)) !== dd) continue
                        const i = ci + di, k = ck + dk
                        if (i >= 0 && k >= 0 && i < nx && k < nz && ok(i, k)) return [x0 + i * CELL, z0 + k * CELL]
                    }
            return null
        },
        /** A walk from p to q around everything (A*, then straightened where the way is clear). */
        path(p, q) {
            const idx = (v) => Math.round((v[1] - z0) / CELL) * nx + Math.round((v[0] - x0) / CELL)
            const start = idx(p), goal = idx(q)
            if (Number.isNaN(cells[start]) || Number.isNaN(cells[goal])) return null
            const cost = new Float32Array(total).fill(Infinity), from = new Int32Array(total).fill(-1)
            const est = new Float32Array(total).fill(Infinity)
            const open = [start], inOpen = new Uint8Array(total)
            inOpen[start] = 1
            cost[start] = 0
            const gx = goal % nx, gk = Math.floor(goal / nx)
            const h = (j) => Math.hypot((j % nx) - gx, Math.floor(j / nx) - gk)
            est[start] = h(start)
            while (open.length) {
                let bi = 0
                for (let s = 1; s < open.length; s++) if (est[open[s]] < est[open[bi]]) bi = s
                const cur = open[bi]
                open[bi] = open[open.length - 1]
                open.pop()
                inOpen[cur] = 0
                if (cur === goal) break
                const ci = cur % nx, ck = Math.floor(cur / nx)
                for (let dk = -1; dk <= 1; dk++)
                    for (let di = -1; di <= 1; di++) {
                        if (!di && !dk) continue
                        const i = ci + di, k = ck + dk
                        if (i < 0 || k < 0 || i >= nx || k >= nz) continue
                        const j = k * nx + i
                        if (Number.isNaN(cells[j]) || Math.abs(cells[j] - cells[cur]) > STEP) continue
                        // (no cutting a corner between two blocked cells)
                        if (di && dk && (Number.isNaN(cells[ck * nx + i]) || Number.isNaN(cells[k * nx + ci]))) continue
                        const c2 = cost[cur] + (di && dk ? Math.SQRT2 : 1)
                        if (c2 < cost[j]) {
                            cost[j] = c2
                            from[j] = cur
                            est[j] = c2 + h(j)
                            if (!inOpen[j]) (inOpen[j] = 1), open.push(j)
                        }
                    }
            }
            if (from[goal] < 0 && goal !== start) return null
            const pts = []
            for (let j = goal; j >= 0; j = from[j]) {
                pts.unshift([x0 + (j % nx) * CELL, z0 + Math.floor(j / nx) * CELL])
                if (j === start) break
            }
            // straightened: from each point, as far ahead as the way stays free
            const clear = (u, v) => {
                const len = Math.hypot(v[0] - u[0], v[1] - u[1]), steps = Math.ceil(len / (CELL / 2))
                let y = g.at(u[0], u[1])
                for (let s = 1; s <= steps; s++) {
                    const y2 = g.at(u[0] + ((v[0] - u[0]) * s) / steps, u[1] + ((v[1] - u[1]) * s) / steps)
                    if (y2 == null || Math.abs(y2 - y) > STEP) return false
                    y = y2
                }
                return true
            }
            const out = [pts[0]]
            let k = 0
            while (k < pts.length - 1) {
                let far = k + 1
                for (let m = pts.length - 1; m > k + 1; m--)
                    if (clear(pts[k], pts[m])) {
                        far = m
                        break
                    }
                out.push(pts[far])
                k = far
            }
            return out
        },
    }
    return g
}
