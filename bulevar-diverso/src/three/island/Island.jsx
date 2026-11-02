import { Suspense, useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { clayMaterial } from '../chonti/clayMaterial.js'
import { clayed } from '../places/PlaceModels.jsx'
import { poleModel, unitModel, unitParts } from '../unitModel.js'
import MODELOS from '../../content/modelos.json'
import TERRENO from '../../content/terreno.json'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries, mergeVertices, toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { ISLAND_TOP } from '../../config.js'
import { PALETTE, mix, shade } from '../../theme.js'
import { geo, islandMaterials, mat } from '../materials.js'
import { seeded } from '../Clouds.jsx'
import Traffic, { LAMP_MATS } from './Traffic.jsx'
import { USER_GROUND, USER_ISLAND, USER_LAMPS, USER_TREES, onGround } from '../../data/userGround.js'
import { skyState } from '../skyState.js'
import { ALL_STOPS, EVENTS, OLD_STOP_LOTS, PLACES, STOP_COPIES, USER_BUILDINGS, movedBy } from '../../data/content.js'
import {
    AV1N_X, AV1N_TO, RETRETA, inRetreta, BUILDING_ROWS, CARRERA3, CARRERA3_X, CROSS_HALF, NORTH_STREET, ROAD_RIM, STREETS, inCarrera3, streetGap, onNorthStreetX, CROSS_STREETS, ISLAND_HALF_LENGTH as L, ISLAND_HALF_WIDTH as W, EMPTY_LOTS, EXTRA_ROWS, ISLAND_NAME, ISLAND_VARIANT, PEDESTRIAN, RIVER_HALF_LENGTH, SOUTH_ROAD, ZONES, halfWidthAt, northRoad, northShift, onCrossStreet, onPedestrian, onRoad, onSouthRoadX, riverZ, tunnelDepth,
} from '../../data/bulevarLayout.js'

/**
 * The Bulevar del Río as a floating island (architectural-model look):
 *  - long rounded strip following the Río Cali, rocky cliff underside with vegetation
 *  - sunken stone channel with flowing water (Río Cali), promenades + red ciclorruta, roads on
 *    both banks, cross streets with zebra crossings and vehicular bridges (traffic: Traffic.jsx)
 *  - the boulevard's real trees, simplified: samanes (wide umbrella crowns), guayacanes amarillos
 *    y rosados (flowering), ceibas (buttressed trunk, layered crown) and chiminangos in the blocks
 *  - city blocks in the Cali style: colonial houses with clay-tile hip roofs (San Antonio / La
 *    Merced), republican low-rises with balconies, modern mid-rises and towers downtown
 *  - landmarks: La Ermita (east end), Puente Ortiz, park at the west end (La Tertulia side)
 */

// Río Cali as a curve (other modules use it: Alumbrado lights follow the river).
export const RIVER = new THREE.CatmullRomCurve3(
    Array.from({ length: 21 }, (_, i) => {
        const x = -RIVER_HALF_LENGTH + (i / 20) * RIVER_HALF_LENGTH * 2
        return new THREE.Vector3(x, ISLAND_TOP, riverZ(x))
    })
)

const TOP = ISLAND_TOP
// (a place with a real, bigger model — `size` in places.json — keeps the trees and houses off
// its whole plaza, not just the usual circle)
const SPOTS = [
    // (a place keeps its lot clear of the city's buildings: the Biblioteca was against its neighbour)
    ...PLACES.map((s) => [...s.position, s.size ? s.size * 0.72 + 0.35 : 1.8]),
    ...[...EVENTS, ...ALL_STOPS].map((s) => [...s.position, s.size ? s.size * 0.72 + 0.35 : 0]),
    // (the landmark buildings of island.json too: nothing else on their lot)
    ...(ISLAND_VARIANT.landmarks ?? []).filter((l) => MODELOS.models.includes(l.model)).map((l) => [l.along, riverZ(l.along) + l.across, l.size * 0.72 + 0.35]),
]
const nearSpot = (x, z, r) => SPOTS.some(([sx, sz, big]) => Math.hypot(sx - x, sz - z) < Math.max(r, big))
// Rotation that aligns a local +X axis with the river at x
const yawAt = (x) => -Math.atan2(riverZ(x + 0.1) - riverZ(x - 0.1), 0.2)
const ERMITA = ALL_STOPS.find((s) => s.id === 'ermita').position
const PUENTE = ALL_STOPS.find((s) => s.id === 'puente-ortiz').position
const FOOTBRIDGES = [-4.6, 5.0] // (x of the two light footbridges)

// ── Geometry builders ────────────────────────────────────────────────────────────
const N = 220
function outline() {
    // the same curve as always, but its N points spread EVENLY along it (spread by angle they were
    // far apart along the long sides: the cliff and the lawn came out as long thin triangles)
    const M = N * 16
    const dense = []
    for (let i = 0; i < M; i++) {
        const a = (i / M) * Math.PI * 2
        const c = Math.cos(a), s = Math.sin(a)
        const jitter = 1 + 0.035 * Math.sin(a * 23) + 0.02 * Math.sin(a * 41 + 1.3)
        const x = L * Math.sign(c) * Math.sqrt(Math.abs(c)) * (1 + 0.008 * Math.sin(a * 17))
        const zr = W * Math.sign(s) * Math.sqrt(Math.abs(s)) * jitter
        dense.push(new THREE.Vector2(x, riverZ(x) + zr))
    }
    const cum = [0]
    for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + dense[i % M].distanceTo(dense[i - 1]))
    const total = cum[M]
    const pts = []
    let j = 0
    for (let i = 0; i < N; i++) {
        const t = (i / N) * total
        while (cum[j + 1] < t) j++
        const f = (t - cum[j]) / (cum[j + 1] - cum[j] || 1)
        pts.push(dense[j].clone().lerp(dense[(j + 1) % M], f))
    }
    return pts
}

/** Rocky underside: rings shrinking toward a rounded base, vertex-colored (vegetation → earth → rock). */
function cliffGeometry(ring) {
    // (two more rings at the bottom, so it closes on a small ring and not with a fan of long triangles)
    const depth = [0, 0.6, 1.5, 2.6, 3.7, 4.7, 5.5, 6.0, 6.25, 6.37]
    const sx = [1, 0.995, 0.965, 0.9, 0.8, 0.66, 0.5, 0.34, 0.19, 0.07]
    const sz = [1, 0.975, 0.88, 0.74, 0.58, 0.44, 0.3, 0.18, 0.1, 0.04]
    const rand = seeded(5)
    const pos = [], col = [], idx = []
    const green = [new THREE.Color(PALETTE.verde), new THREE.Color(shade(PALETTE.verde, 0.75)), new THREE.Color(mix(PALETTE.verde, PALETTE.lima, 0.4))]
    const earth = [new THREE.Color(shade(PALETTE.naranja, 0.5)), new THREE.Color(shade(PALETTE.naranja, 0.42)), new THREE.Color(shade(PALETTE.mango, 0.5)), new THREE.Color(shade(PALETTE.naranja, 0.62)), new THREE.Color(mix(shade(PALETTE.naranja, 0.5), PALETTE.rosa, 0.2))]
    depth.forEach((d, k) => {
        ring.forEach((p, i) => {
            const x = p.x * sx[k]
            const off = p.y - riverZ(p.x)
            const wobble = k === 0 ? 0 : (Math.sin(i * 0.37 + k) * 0.25 + Math.sin(i * 1.3 + k * 2.1) * 0.12) * Math.min(1, sz[k] * 5) // (less on the small rings at the bottom)
            const z = riverZ(x) + off * sz[k] + wobble
            const y = TOP - d - (k === 0 ? 0 : (Math.sin(i * 0.9 + k * 1.7) * 0.35 + (rand() - 0.5) * 0.25) * (k / depth.length))
            pos.push(x + (k ? (rand() - 0.5) * 0.3 : 0), y, z)
            const veg = k <= 1 || (k === 2 && rand() > 0.45) || (k === 3 && rand() > 0.85)
            const c = veg ? green[Math.floor(rand() * green.length)] : earth[Math.floor(rand() * earth.length)]
            col.push(c.r, c.g, c.b)
        })
    })
    const K = depth.length - 1
    for (let k = 0; k < K; k++) {
        for (let i = 0; i < N; i++) {
            const a = k * N + i, b = k * N + ((i + 1) % N), c = (k + 1) * N + i, d = (k + 1) * N + ((i + 1) % N)
            idx.push(a, b, c, b, d, c)
        }
    }
    const bottom = pos.length / 3
    pos.push(0, TOP - 6.4, riverZ(0))
    const e = earth[1]
    col.push(e.r, e.g, e.b)
    for (let i = 0; i < N; i++) idx.push(K * N + i, K * N + ((i + 1) % N), bottom)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
}

/** Several rocky tips hanging under the island (one big, many smaller), like a real floating rock. */
function stalactiteGeometry() {
    const rand = seeded(13)
    const tips = [[0, 0, 4.6, 1.7]]
    for (let i = 0; i < 10; i++) {
        const x = (rand() - 0.5) * L * 1.1
        tips.push([x, (rand() - 0.5) * 3.2, 1.4 + rand() * 2.8 * (1 - Math.abs(x) / L), 0.7 + rand() * 0.8])
    }
    const top = new THREE.Color(shade(PALETTE.naranja, 0.48))
    const tip = new THREE.Color(mix(shade(PALETTE.naranja, 0.3), '#3A3A36', 0.5))
    const parts = tips.map(([x, dz, len, r]) => {
        const g = new THREE.ConeGeometry(r, len, 10, 5).rotateX(Math.PI).translate(0, -len / 2, 0)
        g.deleteAttribute('uv')
        const p = g.attributes.position
        const colors = []
        const c = new THREE.Color()
        for (let i = 0; i < p.count; i++) {
            const y = p.getY(i)
            const u = -y / len
            const n = 1 + Math.sin(p.getX(i) * 4 + y * 3) * 0.12 + Math.sin(p.getZ(i) * 5 - y * 2) * 0.1
            p.setXYZ(i, p.getX(i) * n, y, p.getZ(i) * n)
            c.copy(top).lerp(tip, u)
            colors.push(c.r, c.g, c.b)
        }
        g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        return g.translate(x, TOP - 5.5 + Math.abs(x) * 0.12, riverZ(x) + dz)
    })
    const g = mergeGeometries(parts)
    g.computeVertexNormals()
    return g
}

const riverSamples = (step = 0.25) => {
    const xs = []
    for (let x = -RIVER_HALF_LENGTH; x <= RIVER_HALF_LENGTH + 1e-6; x += step) xs.push(x)
    return xs
}

/** Top surface with the river channel cut out as a hole. Shape space is (x, −z). */
function capGeometry(ring) {
    const shape = new THREE.Shape(ring.map((p) => new THREE.Vector2(p.x, -p.y)))
    const xs = riverSamples(0.5)
    const hole = new THREE.Path([
        ...xs.map((x) => new THREE.Vector2(x, -(riverZ(x) + ZONES.channel))),
        ...xs.slice().reverse().map((x) => new THREE.Vector2(x, -(riverZ(x) - ZONES.channel))),
    ])
    shape.holes.push(hole)
    // the trenches where the Av. Colombia goes down into the Túnel Mundialista
    for (const [a, b] of SOUTH_ROAD?.tunnels ?? []) {
        const [n, f] = SOUTH_ROAD.offsets
        // (exactly to both ends of the trench: a step short, a sliver of lawn covered its end — a
        // green line across the road where it comes out, a wedge over the mouth of the tunnel)
        const tx = []
        for (let x = a; x < b - 1e-6; x += 0.25) tx.push(x)
        tx.push(b)
        shape.holes.push(new THREE.Path([...tx.map((x) => new THREE.Vector2(x, -(riverZ(x) + n))), ...tx.slice().reverse().map((x) => new THREE.Vector2(x, -(riverZ(x) + f)))]))
    }
    const g = new THREE.ShapeGeometry(shape, 1)
    g.rotateX(-Math.PI / 2)
    g.translate(0, TOP, 0)
    return g
}

/**
 * Flat strip between two offsets from the river, at height y, clipped to the island width. The
 * offsets and the height can also be functions of x (a road that moves away from the river, a road
 * going down into the tunnel).
 */
// (`rim`: how close to the edge of the island it may run — the streets and their sidewalks, ROAD_RIM)
function strip(o1, o2, y, step = 0.25, xMin = -L, xMax = L, rim = 0.35) {
    const pos = [], idx = [], bankAttr = []
    const f1 = typeof o1 === 'function' ? o1 : () => o1
    const f2 = typeof o2 === 'function' ? o2 : () => o2
    const fy = typeof y === 'function' ? y : () => y
    let n = 0
    // (the streets and their sidewalks — rim ROAD_RIM — are not cut where the island narrows: they
    // are pressed against its rim and end following its shape)
    const toRim = rim === ROAD_RIM
    // (its last sample exactly at xMax: a step short, a street ended a sliver before the next one)
    const xs = []
    for (let x = xMin; x < xMax - 1e-6; x += step) xs.push(x)
    xs.push(xMax)
    for (const x of xs) {
        let a = f1(x), b = f2(x)
        const lim = halfWidthAt(x) - rim
        if (toRim) {
            if (lim <= 0) continue
            a = Math.sign(a) * Math.min(Math.abs(a), lim)
            b = Math.sign(b) * Math.min(Math.abs(b), lim)
        } else if (Math.max(Math.abs(a), Math.abs(b)) > lim) continue
        const z = riverZ(x)
        pos.push(x, fy(x), z + a, x, fy(x), z + b)
        bankAttr.push(0, 1)
        if (n > 0) {
            const a = (n - 1) * 2
            idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
        }
        n++
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aBank', new THREE.Float32BufferAttribute(bankAttr, 1))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
}

/** Vertical stone walls of the river channel (+ end caps). */
function channelWalls() {
    const xs = riverSamples(0.5)
    const pos = [], idx = []
    let v = 0
    for (const side of [1, -1]) {
        xs.forEach((x, i) => {
            const z = riverZ(x) + side * ZONES.channel
            pos.push(x, TOP, z, x, TOP - 0.35, z)
            if (i > 0) idx.push(v - 2, v - 1, v, v - 1, v + 1, v)
            v += 2
        })
    }
    for (const x of [xs[0], xs[xs.length - 1]]) {
        const z = riverZ(x)
        pos.push(x, TOP, z + ZONES.channel, x, TOP - 0.35, z + ZONES.channel, x, TOP, z - ZONES.channel, x, TOP - 0.35, z - ZONES.channel)
        idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2)
        v += 4
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
}

/**
 * The Túnel Mundialista: at each end of the pedestrian Bulevar the Av. Colombia goes down a trench
 * with green concrete walls and a brown railing on top, into the dark mouth of the tunnel, which runs
 * under the Bulevar (like the photos of the Calle 5 / Av. Colombia).
 */
const TUNNEL_DROP = 0.42
export const roadYAt = (x) => {
    const d = tunnelDepth(x)
    return d == null ? TOP + 0.006 : TOP + 0.006 - d * TUNNEL_DROP
}
function tunnelGeometry() {
    if (!SOUTH_ROAD) return null
    const [n, f] = SOUTH_ROAD.offsets
    const pos = [], idx = []
    let v = 0
    const mouths = [], rails = []
    for (const [a, b] of SOUTH_ROAD.tunnels) {
        const xs = []
        for (let x = a; x < b - 1e-6; x += 0.2) xs.push(x)
        xs.push(b) // (to the very end, like the hole in the lawn)
        // the two green walls, from the lawn down to the road
        for (const o of [n, f]) {
            xs.forEach((x, i) => {
                const z = riverZ(x) + o
                pos.push(x, TOP, z, x, roadYAt(x) - 0.01, z)
                if (i > 0) idx.push(v - 2, v - 1, v, v - 1, v + 1, v)
                v += 2
            })
            // the railing along the top of each wall
            for (let i = 0; i + 1 < xs.length; i += 2) {
                const x = (xs[i] + xs[Math.min(i + 2, xs.length - 1)]) / 2
                rails.push({ p: [x, TOP + 0.07, riverZ(x) + o], s: [0.42, 0.11, 0.025], r: [0, yawAt(x), 0] })
            }
        }
        // the mouth: at the Bulevar's end of the trench (under the pedestrian walk)
        const mx = a < 0 ? b : a
        mouths.push({ p: [mx, TOP - TUNNEL_DROP / 2 + 0.004, riverZ(mx) + (n + f) / 2], s: [0.06, TUNNEL_DROP, f - n + 0.02], r: [0, yawAt(mx), 0] })
        // and the lintel over it (the edge of the Bulevar above the tunnel)
        mouths.push({ p: [mx + (a < 0 ? 0.04 : -0.04), TOP + 0.01, riverZ(mx) + (n + f) / 2], s: [0.12, 0.05, f - n + 0.1], r: [0, yawAt(mx), 0], lintel: true })
    }
    const walls = new THREE.BufferGeometry()
    walls.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    walls.setIndex(idx)
    walls.computeVertexNormals()
    return { walls, mouths: mouths.filter((m) => !m.lintel), lintels: mouths.filter((m) => m.lintel), rails }
}
const tunnelWallMat = new THREE.MeshStandardMaterial({ color: '#8FC78A', roughness: 0.9, side: THREE.DoubleSide })
const tunnelMouthMat = new THREE.MeshBasicMaterial({ color: '#141614' })
const tunnelRailMat = new THREE.MeshStandardMaterial({ color: '#5A4636', roughness: 0.8 })

/**
 * The pedestrian Bulevar's paving: grey pavers in a running bond, each one a slightly different grey
 * (like the real one). One texture tile = PAVING_TILE island units.
 */
const PAVING_TILE = 0.55
const pavingMat = (() => {
    const m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95 })
    if (typeof document === 'undefined') return m
    const S = 256, rows = 6, cols = 3
    const c = document.createElement('canvas')
    c.width = c.height = S
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#A9A49C' // the joints
    ctx.fillRect(0, 0, S, S)
    const rand = seeded(5)
    const pw = S / cols, ph = S / rows, j = 3
    for (let r = 0; r < rows; r++) {
        const shift = (r % 2) * pw * 0.5
        for (let k = -1; k < cols; k++) {
            const v = 196 + Math.floor((rand() - 0.5) * 18)
            ctx.fillStyle = `rgb(${v + 4}, ${v}, ${v - 6})`
            ctx.fillRect(k * pw + shift + j / 2, r * ph + j / 2, pw - j, ph - j)
        }
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    m.map = t
    return m
})()
/**
 * The streets drawn as a line of points (island.json → streets: the one by La Ermita): a ribbon
 * along each line (`from` → `to`: from its middle, how far to each side — the road, or its
 * sidewalks), up to the rim of the island.
 */
/** island.json → corridor: the Bulevar's walk after its end, up to the street by La Ermita. */
const CORRIDOR = ISLAND_VARIANT.corridor ?? null
/** How tall some of your buildings are drawn (island.json · buildingHeights): a part of their height. */
export const BUILDING_HEIGHTS = ISLAND_VARIANT.buildingHeights ?? {}
// (its outer edge: as far as the walk goes, or the street if it gets there first — under its sidewalk)
const corridorEdge = (x) => {
    for (let o = CORRIDOR.across[0] + 0.05; o < CORRIDOR.across[1]; o += 0.05) if (streetGap(x, o) < 0.2) return o
    return CORRIDOR.across[1]
}

/** A point pulled in to ROAD_RIM from the edge of the island if it is beyond (null past its ends). */
function toRimPoint(x, z) {
    const lim = halfWidthAt(x) - ROAD_RIM
    if (lim <= 0) return null
    const off = z - riverZ(x)
    return [x, riverZ(x) + Math.sign(off) * Math.min(Math.abs(off), lim)]
}
function streetRibbons(from, to, y) {
    const pos = [], idx = []
    let v = 0
    for (const s of STREETS) {
        const pts = s.points.map(([a, o]) => new THREE.Vector2(a, riverZ(a) + o))
        const line = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p.x, 0, p.y)), false, 'centripetal', 0)
        const n = Math.ceil(line.getLength() / 0.05)
        for (const side of [-1, 1]) {
            let prev = false
            for (let i = 0; i <= n; i++) {
                const p = line.getPointAt(i / n), t = line.getTangentAt(i / n)
                const nx = -t.z * side, nz = t.x * side
                // (pressed against the rim where it reaches it: it ends with the shape of the island)
                const a = toRimPoint(p.x + nx * from, p.z + nz * from), b = toRimPoint(p.x + nx * to, p.z + nz * to)
                if (!a || !b) { prev = false; continue }
                pos.push(a[0], y, a[1], b[0], y, b[1])
                // (both windings: the ribbon is seen from above whichever way it was drawn)
                if (prev) idx.push(v - 2, v - 1, v, v - 1, v + 1, v, v, v - 1, v - 2, v, v + 1, v - 1)
                v += 2
                prev = true
            }
        }
    }
    if (!pos.length) return null
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    // (flat: all of it faces up)
    const nrm = g.attributes.normal
    for (let i = 0; i < nrm.count; i++) nrm.setXYZ(i, 0, 1, 0)
    return g
}

/**
 * The ciclorruta: the old lane of the MIO along the Bulevar, now for bicycles (like the photo):
 * grey interlocking pavers in zigzag ("adoquín ecológico"), a white line on each side and the
 * little corten pyramids along its edges. One tile = BIKE_TILE units.
 */
const BIKE_TILE = 0.42
const bikeMat = (() => {
    const m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95 })
    if (typeof document === 'undefined') return m
    const S = 256, rows = 4, cols = 2
    const c = document.createElement('canvas')
    c.width = c.height = S
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#6E6F70' // (the joints)
    ctx.fillRect(0, 0, S, S)
    const rand = seeded(17)
    const pw = S / cols, ph = S / rows, j = 4, wave = ph * 0.16
    // one paver: a rectangle whose short ends are an S (a wave in, a wave out)
    const paver = (x, y) => {
        const v = 128 + Math.floor((rand() - 0.5) * 16)
        ctx.fillStyle = `rgb(${v}, ${v + 1}, ${v + 3})`
        const x0 = x + j / 2, x1 = x + pw - j / 2, y0 = y + j / 2, y1 = y + ph - j / 2
        const end = (xx, dir) => {
            const m1 = y0 + (y1 - y0) * 0.33, m2 = y0 + (y1 - y0) * 0.66
            ctx.lineTo(xx, m1)
            ctx.quadraticCurveTo(xx + wave * dir, (m1 + m2) / 2, xx, m2)
        }
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y0)
        end(x1, 1)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x0, y1)
        ctx.lineTo(x0, (y0 + y1) / 2 + (y1 - y0) * 0.16)
        ctx.quadraticCurveTo(x0 + wave, (y0 + y1) / 2, x0, (y0 + y1) / 2 - (y1 - y0) * 0.16)
        ctx.closePath()
        ctx.fill()
    }
    for (let r = 0; r < rows; r++) for (let k = -1; k < cols; k++) paver(k * pw + (r % 2) * pw * 0.5, r * ph)
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    m.map = t
    return m
})()

/** UVs for a strip along the river: u along it, v across it, in `tile` units. */
function pavingUVs(g, tile = PAVING_TILE) {
    const p = g.attributes.position
    const uv = []
    for (let i = 0; i < p.count; i++) uv.push(p.getX(i) / tile, (p.getZ(i) - riverZ(p.getX(i))) / tile)
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    return g
}

/**
 * The ground under the Gato del Río: the Gato's model keeps its own floor (grass and stone path)
 * and goes down into the island (`sink` in island.json) over a patch of the SAME stone path, the
 * whole green strip between the river walk and the Av. 4 Oeste, with rounded ends — so it seems to
 * come out of the ground instead of sitting on a mat. (The stones: the colours of the model's path.)
 */
const GATO = PLACES.find((p) => p.id === 'gato')
// (island.json → floor: from where to where along the strip; the west end rounded, the east end
// goes on into the curve of the avenue, as narrow as the strip gets there)
const GATO_FLOOR = GATO?.sink ? { x: GATO.position[0], half: (GATO.size ?? 2) * 0.82, from: GATO.floor?.[0], to: GATO.floor?.[1] } : null
const GATO_TILE = 0.32 // (4 × 4 stones per tile, about the size of the model's own)
const gatoFloorMat = (() => {
    if (typeof document === 'undefined' || !GATO_FLOOR) return null
    const S = 128, n = 4
    const c = document.createElement('canvas')
    c.width = c.height = S
    const ctx = c.getContext('2d')
    const stones = ['#CFC6B4', '#C6BCA8', '#D8D0BF', '#BEB4A0']
    const rand = seeded(9)
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        ctx.fillStyle = stones[Math.floor(rand() * stones.length)]
        ctx.fillRect((i * S) / n, (j * S) / n, S / n, S / n)
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.magFilter = THREE.NearestFilter // (crisp stones, like the model's)
    t.colorSpace = THREE.SRGBColorSpace
    return clayMaterial({ color: '#ffffff', map: t, speckle: 0.05, speckleScale: 20, rim: 0.14, rimColor: '#FFE3C8', bump: 0.1, warmth: 0.02, sheen: 0.18, sheenColor: '#FFF1E2' })
})()
/** The hedge of bushes where the Gato's floor ends in the west: [x, offset] of each bush. */
function gatoHedge() {
    if (!GATO_FLOOR) return []
    const x = (GATO_FLOOR.from ?? GATO_FLOOR.x - GATO_FLOOR.half) - 0.12
    const near = ZONES.promenadeBack[0], far = northRoad(x)[1] + 0.26 * northRoad(x)[2]
    const out = []
    for (let o = near - 0.1; o > far + 0.1; o -= 0.2) out.push([x, o])
    return out
}
function gatoFloorGeometry() {
    if (!GATO_FLOOR) return null
    const { x: gx, half } = GATO_FLOOR
    const x0 = GATO_FLOOR.from ?? gx - half, x1 = GATO_FLOOR.to ?? gx + half
    // across: from the river walk to the sidewalk of the avenue; the west end rounded
    const near = ZONES.promenadeBack[0] // (the outer edge of the walk along the river)
    const far = (x) => northRoad(x)[1] + 0.26 * northRoad(x)[2]
    // (cut straight at the west end, where a hedge closes it: gatoHedge)
    const mid = (x) => (near + far(x)) / 2, hw = (x) => Math.max(0, (near - far(x)) / 2)
    return pavingUVs(strip((x) => mid(x) - hw(x), (x) => mid(x) + hw(x), TOP + 0.003, 0.04, x0, x1), GATO_TILE)
}

/**
 * Building block with a small chamfer (crisp but not razor sharp) and window UVs scaled to real
 * floors (≈0.45 units per bay). Roofs (normals pointing up/down) get no windows.
 */
function buildingGeometry(w, h, d, floors) {
    const g = new RoundedBoxGeometry(w, h, d, 1, Math.min(w, d) * 0.035)
    g.translate(0, h / 2, 0)
    const uv = g.attributes.uv
    const n = g.attributes.normal
    const bays = Math.max(1, Math.round(Math.max(w, d) / 0.45))
    for (let i = 0; i < uv.count; i++) {
        if (Math.abs(n.getY(i)) > 0.6) uv.setXY(i, 0.02, 0.02) // roof: plain wall pixel
        else uv.setXY(i, uv.getX(i) * bays, uv.getY(i) * floors)
    }
    return g
}

// Trees: tapered trunk (base at y = 0) + soft, lumpy crown clumps (smooth shading, more natural)
const trunkGeometry = new THREE.CylinderGeometry(0.6, 1, 1, 10).translate(0, 0.5, 0)
export const clumpGeometry = (() => {
    const base = new THREE.IcosahedronGeometry(1, 2)
    base.deleteAttribute('normal')
    base.deleteAttribute('uv')
    const g = mergeVertices(base)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
        const n = 1 + 0.11 * Math.sin(x * 5.1 + y * 3.3) * Math.cos(z * 4.7) + 0.06 * Math.sin(y * 11 + x * 7) + 0.04 * Math.cos(z * 13 - y * 5)
        p.setXYZ(i, x * n, y * n, z * n)
    }
    g.computeVertexNormals()
    return g
})()
const crownMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 })
// crowns sway with the wind (stronger with la brisa caleña and in storms)
const sway = { uTime: { value: 0 }, uWind: { value: 0.15 } }
crownMaterial.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, sway)
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime, uWind;').replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
            vec3 ip = instanceMatrix[3].xyz;
            float sw = sin(uTime * (1.2 + uWind * 1.5) + ip.x * 0.7 + ip.z * 0.5) * (0.03 + uWind * 0.14);
            transformed.x += sw * (position.y + 1.0) * 0.5;
            transformed.z += sw * 0.4 * (position.y + 1.0) * 0.5;
        #endif`
    )
}
crownMaterial.customProgramCacheKey = () => 'crown-sway'
const barkMaterial = new THREE.MeshStandardMaterial({ color: shade(PALETTE.naranja, 0.38), roughness: 1 })

export const VARIANTS = {
    house: { w: 0.95, h: 0.62, d: 0.85, floors: 2, roof: 'pitched' }, // colonial house
    low: { w: 1.1, h: 0.95, d: 0.95, floors: 3, roof: 'mixed' }, // republican low-rise
    mid: { w: 1.05, h: 1.9, d: 1.0, floors: 6, roof: 'flat' },
    tall: { w: 1.15, h: 3.0, d: 1.15, floors: 10, roof: 'flat' },
    tower: { w: 1.3, h: 4.4, d: 1.3, floors: 14, roof: 'flat' },
}
const WALLS = [
    PALETTE.crema, mix(PALETTE.crema, PALETTE.rosa, 0.5), mix(PALETTE.crema, PALETTE.mango, 0.45), mix(PALETTE.crema, PALETTE.lima, 0.4),
    mix(PALETTE.crema, PALETTE.naranja, 0.3), mix(PALETTE.crema, PALETTE.verde, 0.2), shade(PALETTE.naranja, 0.75), mix(PALETTE.rosa, PALETTE.naranja, 0.3), PALETTE.crema,
]
const ROOFS = [shade(PALETTE.naranja, 0.72), shade(PALETTE.naranja, 0.62), mix(PALETTE.naranja, PALETTE.rosa, 0.25), mix(PALETTE.naranja, PALETTE.mango, 0.3)]
const BLOOMS = [PALETTE.rosa, PALETTE.mango, PALETTE.lima, mix(PALETTE.rosa, PALETTE.crema, 0.3), PALETTE.naranja]
const CANOPY = [PALETTE.verde, shade(PALETTE.verde, 0.78), mix(PALETTE.verde, PALETTE.lima, 0.4), shade(PALETTE.verde, 0.65)]
const GUAYACAN = { amarillo: [PALETTE.mango, mix(PALETTE.mango, PALETTE.lima, 0.3)], rosado: [PALETTE.rosa, mix(PALETTE.rosa, PALETTE.crema, 0.3)] }

/**
 * The middle of the pedestrian Bulevar, like the real one: every so often the furniture of
 * Assets/modelos/asientos_centro.glb (the planter with its bench, the advertising column, the round
 * planter) and, halfway between two of them, a long planter with wooden benches along both sides.
 * The Feria's pavilions go in the gaps between them. x and half its length; BULEVAR_MID = offset.
 */
export const BULEVAR_MID = 2.05
const MODULE_LEN = 1.05 // (how long one furniture module is, along the river: the walk is wide)
// the benches along the river rail (sillas_borde_rio.glb): how long one is, and how far from the river
const RIVER_BENCH = { len: 0.95, o: 1.22 } // (just inside the lamps by the rail, 1.05)
// the long bench of Assets/modelos/sillas_centro_2.glb (its planter of bushes, the seats on both
// sides): how long it is. It goes right after each module, and then a gap before the next one.
const SEATS_LEN = 1.9
const HAS_SEATS = MODELOS.models.includes('sillas_centro_2')
export const BULEVAR_CENTER = (() => {
    if (ISLAND_NAME === 'clasica') return { modules: [], long: [], seats: [], items: [] }
    const modules = [], long = [], seats = []
    const P = 6.4
    for (let x = PEDESTRIAN[0] + 2.6; x < PEDESTRIAN[1] - 1.2; x += P) {
        if (Math.abs(x - PUENTE[0]) > 2) {
            modules.push({ x, half: MODULE_LEN / 2 })
            if (HAS_SEATS) seats.push({ x: x - MODULE_LEN / 2 - 0.05 - SEATS_LEN / 2, half: SEATS_LEN / 2 }) // (to its west, end to end)
        }
        const xl = x + P / 2
        // (without sillas_centro_2: halfway between two modules, a long planter made by the page)
        if (!HAS_SEATS && xl < PEDESTRIAN[1] - 1.5 && Math.abs(xl - PUENTE[0]) > 2) long.push({ x: xl, half: 0.8 })
    }
    return { modules, long, seats, items: [...modules, ...long, ...seats].sort((a, b) => a.x - b.x) }
})()

/**
 * Your buildings (Assets/modelos/isla_edificios.glb, as you arranged them): the boxes they stand in
 * on the island. The page draws them as you left them, and nothing else stands inside them — no
 * tree, no lamp, no bench (and no building of its own: the city of the page is yours now).
 */
const USER_BOXES = USER_BUILDINGS.map((it) => it.box)
const USER_TERRAIN_ON = ISLAND_NAME !== 'clasica' && (TERRENO.items ?? []).length > 0
// (for the lights of the Alumbrado: each box with its height over the island, and what it is)
export const USER_BOXES_TOP = USER_BUILDINGS.map(({ name, box: b }) => ({ ...b, h: b.y + b.h - TOP, kind: /^hito_/.test(name) ? 'landmark' : 'building', name }))
// (and your Puente Ortiz, wider than the page's: its ramps and stairs reach into both banks)
const BRIDGE_ZONE = { x: [16.75, 19.15], o: [-1.95, 2.45] }
const onUserBridge = (x, z, pad = 0) => USER_TERRAIN_ON && x > BRIDGE_ZONE.x[0] - pad && x < BRIDGE_ZONE.x[1] + pad && z - riverZ(x) > BRIDGE_ZONE.o[0] - pad && z - riverZ(x) < BRIDGE_ZONE.o[1] + pad
const inUserBuilding = (x, z, pad = 0) =>
    onUserBridge(x, z, pad) ||
    USER_BOXES.some((b) => {
        const dx = x - b.x, dz = z - b.z, c = Math.cos(b.yaw), s = Math.sin(b.yaw)
        return Math.abs(dx * c - dz * s) < b.w / 2 + pad && Math.abs(dx * s + dz * c) < b.d / 2 + pad
    })

/**
 * Where the pedestrian Bulevar ends in the west (over the mouth of the Túnel Mundialista) it gets
 * narrower and runs into a building, like the real one: the walk is narrow for END_NARROW after
 * its start, and the building stands in the corner it leaves.
 */
const END_NARROW = ISLAND_NAME === 'clasica' ? 0 : 0.7
const END_BUILDING = END_NARROW ? { x: PEDESTRIAN[0] + 0.1, o: 3.3, along: 1.2, across: 1.3 } : null

/**
 * Promenade trees (shared with the events: the Feria's stalls and shelves leave them room).
 * Front bank: samanes and guayacanes between the ciclorruta and the road + a sparse row by the
 * river; back bank: one row alternating guayacanes and chiminangos.
 */
/**
 * (on your terrain: the rim of the island where YOU left it — from a point of the page's rim, towards
 * the middle of the island (or away from it) until it is just inside your ground; none if too far)
 */
const onYourIsland = (x, z) => ['land', 'street', 'walk'].some((k) => onGround(k, x, z))
const userRim = (p, inset = null) => {
    const cx = THREE.MathUtils.clamp(p.x, -L + 3, L - 3), cz = riverZ(cx)
    const dx = cx - p.x, dz = cz - p.y, len = Math.hypot(dx, dz) || 1
    const ux = dx / len, uz = dz / len
    const inside = onYourIsland(p.x, p.y)
    for (let d = 0; d <= 3; d += 0.05) {
        const t = inside ? -d : d
        const x = p.x + ux * t, z = p.y + uz * t
        if (inside ? !onYourIsland(x, z) : onYourIsland(x, z)) {
            const back = inset ?? (inside ? 0.1 : 0.12) // (just inside the edge, or `inset` in)
            return { x: x + ux * back, y: z + uz * back }
        }
    }
    return null
}
/** (on your terrain: is x, z on a street, or on a path of La Retreta?) */
const offYourGround = (x, z, r = 0.12) => USER_GROUND && (onGround('street', x, z, r) || onGround('path', x, z, r))
export const PROMENADE_TREES = (() => {
    // (your island as you arranged it: its trees, where you left them)
    if (USER_ISLAND) return USER_TREES.map((t) => ({ x: t.x, z: t.z, kind: t.palm ? 'palma' : 'saman', s: 1 }))
    const rand = seeded(11)
    const out = []
    const add = (x, o, kind, r = 0.12) => {
        const z = riverZ(x) + o
        if (o > 0 && onSouthRoadX(x)) return // (the south bank there: the Av. Colombia and its buildings)
        if (nearSpot(x, z, 1.0) || Math.abs(o) + 0.4 > halfWidthAt(x) || onCrossStreet(x, 0.45)) return
        if (Math.hypot(x - PUENTE[0], z - PUENTE[1]) < 1.6) return
        if (inRetreta(x, o, 0.3)) return // (La Retreta has its own trees, around its paths)
        if (inUserBuilding(x, z, 0.25)) return // (nor inside one of your buildings)
        if (offYourGround(x, z, r)) return // (nor on a street or a path of your terrain)
        if (END_BUILDING && o > 2.4 && Math.abs(x - END_BUILDING.x) < END_BUILDING.along / 2 + 0.5) return // (the building at the end)
        if (GATO_FLOOR?.from != null && o < 0 && x > GATO_FLOOR.from - 0.35 && x < GATO_FLOOR.to + 0.2 && z - riverZ(x) > northRoad(x)[1]) return // (not on the floor of the Gato)
        out.push({ x, z, kind, s: 0.9 + rand() * 0.25 })
    }
    let i = 0
    for (let x = -19.5; x <= 19.5; x += 2.1, i++) {
        add(x + 0.4, 3.62, i % 3 === 1 ? (i % 2 ? 'guayacanRosado' : 'guayacanAmarillo') : i % 6 === 0 ? 'palma' : 'saman') // edge of the bulevar (a palm now and then)
        // by the river rail (palms along the pedestrian Bulevar, like the real one)
        // (no palm right against the furniture in the middle of the walk)
        if (onPedestrian(x + 1.2)) {
            const kind = i % 3 === 0 ? 'guayacanAmarillo' : 'palma'
            // (no tree over the furniture; with the long benches of sillas_centro_2, no guayacán either)
            if ((kind !== 'palma' && !HAS_SEATS) || !BULEVAR_CENTER.items.some((it) => Math.abs(x + 1.2 - it.x) < it.half + 0.6)) add(x + 1.2, 1.58, kind)
        }
        else if (i % 2 === 0) add(x + 1.2, 1.2, i % 4 === 0 ? 'guayacanAmarillo' : 'chiminango')
        // big shade trees in the middle (on the Bulevar, the middle is its furniture: BULEVAR_CENTER)
        if (i % 3 === 2 && !(BULEVAR_CENTER.items.length && onPedestrian(x + 0.9, 0.5))) add(x + 0.9, 2.5, 'saman')
        add(x + 0.5, -1.12, i % 2 ? 'guayacanRosado' : i % 4 === 0 ? 'palma' : 'chiminango') // green strip of the Av. 1 Norte (and its palms)
        add(x + 1.55, -1.12, i % 3 ? 'saman' : 'guayacanAmarillo') // (more trees by the river)
        // where the Av. 4 Oeste moves away from the river: big trees in the green strip (Gato del Río)
        if (northShift(x) < -1) add(x + 1.3, -2.25, i % 2 ? 'saman' : 'chiminango')
    }
    // and the edges of the river lined with trees, on both banks, all along it (their crowns over
    // the water, like the real Río Cali) — on the Bulevar's side with room between them for the
    // benches of the railing
    const KINDS = ['saman', 'guayacanAmarillo', 'chiminango', 'guayacanRosado', 'saman', 'chiminango']
    const near = (x, z, r) => out.some((t) => Math.hypot(t.x - x, t.z - z) < r)
    let k = 0
    for (const [o, step] of [[-1.07, 1.15], [1.08, 2.6]]) {
        for (let x = -22.4; x <= 22.4; x += step) {
            const z = riverZ(x) + o
            if (Math.abs(x - PUENTE[0]) < 1.3 || [-4.6, 5.0].some((b) => Math.abs(x - b) < 0.7) || onCrossStreet(x, 0.35) || near(x, z, o > 0 ? 1.2 : 0.75)) continue
            // (on your terrain the north bank is narrow — the avenue right by the river —: the tree
            // goes on the sidewalk by the rail, wherever there is room off the street)
            const oo = USER_GROUND && o < 0 ? [o, -1.0, -1.15, -0.95].find((v) => !onGround('street', x, riverZ(x) + v, 0.06)) : o
            if (oo == null) continue
            add(x, oo, KINDS[k++ % KINDS.length], USER_GROUND && o < 0 ? 0.04 : 0.12)
        }
    }
    // (on your terrain: trees all round the edge of the island too, on its lawn — far enough in that
    // their crowns do not hang out over the edge)
    if (USER_GROUND) {
        const ring = outline()
        for (let i = 0; i < ring.length; i += 2) {
            const q = userRim(ring[i], 0.55)
            if (!q || !onGround('land', q.x, q.y, 0.3) || onGround('street', q.x, q.y, 0.3) || onGround('walk', q.x, q.y, 0.15) || onGround('path', q.x, q.y, 0.2)) continue
            if (inUserBuilding(q.x, q.y, 0.35) || nearSpot(q.x, q.y, 0.8) || near(q.x, q.y, 0.9) || Math.hypot(q.x - PUENTE[0], q.y - PUENTE[1]) < 1.6) continue
            if (inRetreta(q.x, q.y - riverZ(q.x), 0.1)) continue // (La Retreta has its own trees)
            out.push({ x: q.x, z: q.y, kind: KINDS[k++ % KINDS.length], s: 0.8 + rand() * 0.25 })
        }
    }
    return out
})()

/**
 * Street lamps on BOTH sides of every street (Av. 1 Norte, Carrera 3, the calles) and along the
 * pedestrian Bulevar. They light up at night; the Alumbrado hangs its garlands between them.
 * { x, z, row } — row tells which line they belong to (pairs across a street share x).
 */
/** (a lamp on your terrain: off its streets, at their edge or on a walk / path — or none) */
const onYourGround = (l) => {
    if (!USER_GROUND) return l
    const ok = (x, z) => !onGround('street', x, z, 0.05) && !onGround('path', x, z) && (onGround('street', x, z, 0.3) || onGround('walk', x, z, 0.2) || onGround('path', x, z, 0.3))
    if (ok(l.x, l.z)) return l
    if (!onGround('street', l.x, l.z, 0.05) && !onGround('path', l.x, l.z)) return null // (where the street was)
    for (let r = 0.1; r <= 0.8; r += 0.1) {
        for (let k = 0; k < 16; k++) {
            const x = l.x + Math.cos((k * Math.PI) / 8) * r, z = l.z + Math.sin((k * Math.PI) / 8) * r
            if (ok(x, z)) return { ...l, x, z }
        }
    }
    return null
}
export const STREET_LAMPS = (() => {
    const out = []
    const free = (x, z) => !nearSpot(x, z, 1.0) && !PROMENADE_TREES.some((tr) => Math.hypot(tr.x - x, tr.z - z) < 0.42)
    const line = (row, o0, xMax, step = 1.6, pedestrianOnly = false, only = null) => {
        for (let x = -xMax + 0.6; x <= xMax - 0.6; x += step) {
            const o = typeof o0 === 'function' ? o0(x) : o0
            if (only && !only(x)) continue
            const z = riverZ(x) + o
            if (onCrossStreet(x, 0.55) || Math.abs(o) + 0.3 > halfWidthAt(x) || !free(x, z)) continue
            if (pedestrianOnly && !onPedestrian(x)) continue
            out.push({ x, z, row })
        }
    }
    line('bulevar-river', 1.05, 19.4, 1.5, true)
    line('bulevar-edge', 3.72, 19.4, 1.5, true, (x) => x > PEDESTRIAN[0] + END_NARROW + 0.2) // (only along the pedestrian Bulevar)
    // (only where the Av. 1 Norte runs: in the east it ends at La Retreta)
    line('av1n-river', (x) => northRoad(x)[1] + 0.12, AV1N_X, 1.6, false, (x) => x < AV1N_TO - 0.3)
    line('av1n-out', (x) => northRoad(x)[0] - 0.13, AV1N_X, 1.6, false, (x) => x < AV1N_TO - 0.3)
    if (SOUTH_ROAD) line('avcol-out', SOUTH_ROAD.offsets[1] + 0.14, 22.4, 1.6, false, (x) => onSouthRoadX(x) && tunnelDepth(x) == null)
    line('cra3-in', ZONES.roadFront[0] - 0.12, CARRERA3_X, 1.6, false, inCarrera3)
    line('cra3-out', ZONES.roadFront[1] + 0.12, CARRERA3_X, 1.6, false, inCarrera3)
    if (NORTH_STREET) line('norte2', NORTH_STREET.offsets[1] + 0.12, 22, 1.6, false, onNorthStreetX)
    // the calles: both sidewalks
    CROSS_STREETS.forEach((c, ci) => {
        for (const side of [-1, 1]) {
            const x = c + side * (CROSS_HALF + 0.1)
            const edge = halfWidthAt(x) - 0.45
            const southFrom = onSouthRoadX(x) ? SOUTH_ROAD.offsets[1] + 0.3 : ZONES.promenadeFront[1] + 0.25
            for (const [o0, o1] of [[southFrom, edge], [-edge, northRoad(x)[0] - 0.4]]) {
                for (let o = o0; o <= o1; o += 1.0) {
                    if (inCarrera3(x) && o > ZONES.roadFront[0] - 0.2 && o < ZONES.roadFront[1] + 0.2) continue
                    if (onNorthStreetX(x) && o > NORTH_STREET.offsets[0] - 0.2 && o < NORTH_STREET.offsets[1] + 0.2) continue
                    out.push({ x, z: riverZ(x) + o, row: `calle${ci}${side > 0 ? 'e' : 'w'}`, o })
                }
            }
        }
    })
    // (one of every two along each line: there were too many)
    const n = {}
    const lamps = out.filter((l) => (n[l.row] = (n[l.row] ?? -1) + 1) % 2 === 0)
    // La Retreta: lamps along both sides of its paths (all of them: it is a park at night)
    for (const [pi, [x0, x1, o0, o1]] of (RETRETA?.paths ?? []).entries()) {
        const along = x1 - x0 >= o1 - o0
        const sides = along ? [o0 - 0.12, o1 + 0.12] : [x0 - 0.12, x1 + 0.12]
        const [a, b] = along ? [x0, x1] : [o0, o1]
        const k = Math.max(1, Math.round((b - a) / 2.1))
        for (const [si, s] of sides.entries()) for (let i = 0; i <= k; i++) {
            const u = a + ((b - a) * i) / k
            const [x, o] = along ? [u, s] : [s, u]
            if (o > -1.1 || o < RETRETA.back || x > L - 0.3 || Math.abs(o) + 0.3 > halfWidthAt(x)) continue
            // (each side of each path its own line — those across the park, sorted like a calle's)
            lamps.push({ x, z: riverZ(x) + o, o, row: along ? `retreta${pi}${si}` : `calle_retreta${pi}${si}` })
        }
    }
    // (none inside one of your buildings; on your terrain, by its streets, walks and paths: one in the
    // middle of a street steps aside to its edge, one where you took the street out is not there)
    // (your island as you arranged it: its lamps, where you left them)
    if (USER_ISLAND) return USER_LAMPS.map((l, i) => ({ x: l.x, z: l.z, row: 'tuyos', o: i }))
    return lamps.map(onYourGround).filter((l) => l && !inUserBuilding(l.x, l.z, 0.12))
})()
// where the ciclorruta runs (the whole pedestrian Bulevar, from where its walk widens in the west)
// and the little corten pyramids along both its edges
const BIKE_X = [Math.max(-L, PEDESTRIAN[0] + (END_NARROW ? END_NARROW + 0.25 : 0)), Math.min(L, PEDESTRIAN[1])]
const BIKE_BOLLARDS = (() => {
    const out = []
    for (const o of [ZONES.bikeLane[0] - 0.05, ZONES.bikeLane[1] + 0.05]) {
        for (let x = BIKE_X[0] + 0.2; x < BIKE_X[1] - 0.1; x += 0.45) {
            if (onCrossStreet(x, 0.1) || PROMENADE_TREES.some((t) => Math.hypot(t.x - x, t.z - riverZ(x) - o) < 0.12)) continue
            out.push({ p: [x, TOP + 0.02, riverZ(x) + o], s: [0.07, 0.04, 0.07], r: [0, yawAt(x) + Math.PI / 4, 0] })
        }
    }
    return out
})()
/**
 * La Retreta (Parque Paseo Bolívar, island.json → retreta): on its lawn, the paths of concrete (the
 * paseo from the Puente Ortiz and the walks across the park), the circle of the kiosco (its model is
 * a landmark: Assets/modelos/Kiosko.glb) and the two stages of the Sucursal Fest. Is (x, offset) on
 * one of them (or within pad)?
 */
export const onRetretaSpot = (x, o, pad = 0) =>
    !!RETRETA &&
    ((RETRETA.paths ?? []).some(([x0, x1, o0, o1]) => x > x0 - pad && x < x1 + pad && o > o0 - pad && o < o1 + pad) ||
        (RETRETA.kiosk && Math.hypot(x - RETRETA.kiosk.along, o - RETRETA.kiosk.across) < RETRETA.kiosk.radius + pad) ||
        // (a stage and the room in front of it, for the people)
        (RETRETA.stages ?? []).some((s) => {
            const a = ((s.yaw ?? 0) * Math.PI) / 180
            return Math.hypot(x - s.along, o - s.across) < s.size * 1.6 + pad || Math.hypot(x - s.along - Math.sin(a) * s.size * 2, o - s.across - Math.cos(a) * s.size * 2) < s.size * 1.9 + pad
        }))
/** Its paths and the kiosk's circle, as one mesh (with the paving of the Bulevar). */
function retretaGeometry() {
    if (!RETRETA) return null
    const y = TOP + 0.011
    const parts = (RETRETA.paths ?? []).map(([x0, x1, o0, o1]) => strip(o0, o1, y, 0.1, x0, x1, ROAD_RIM))
    const k = RETRETA.kiosk
    if (k) {
        const cx = k.along, cz = riverZ(k.along) + k.across, N = 36
        const pos = [cx, y, cz], idx = []
        for (let i = 0; i <= N; i++) pos.push(cx + Math.cos((i / N) * Math.PI * 2) * k.radius, y, cz + Math.sin((i / N) * Math.PI * 2) * k.radius)
        for (let i = 1; i <= N; i++) idx.push(0, i + 1, i) // (counter-clockwise from above: it faces up)
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
        g.setAttribute('aBank', new THREE.Float32BufferAttribute(new Array(pos.length / 3).fill(0), 1))
        g.setIndex(idx)
        g.computeVertexNormals()
        parts.push(g)
    }
    return pavingUVs(mergeGeometries(parts))
}

// The tree models of Assets/modelos (those that are there): each tree is one of them; the palms, Palmera
const TREE_MODELS = ['arbol', 'Arbol2', 'Arbol3', 'Arbol4'].filter((m) => MODELOS.models.includes(m))
const PALM_MODEL = MODELOS.models.includes('Palmera')
const hash01 = (x, z) => {
    const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
    return s - Math.floor(s)
}
const lampPostMat = new THREE.MeshStandardMaterial({ color: '#2E2A22', roughness: 0.6, metalness: 0.4 })
export const lampHeadMat = new THREE.MeshStandardMaterial({ color: PALETTE.crema, emissive: '#FFE2A8', emissiveIntensity: 0.1, roughness: 0.4 })

/** City layout (deterministic, module level so the events can avoid trees and buildings). */
function buildCity() {
    {
        const rand = seeded(42)
        const buildings = Object.fromEntries(Object.keys(VARIANTS).map((k) => [k, []]))
        const roofs = [], slabs = [], plots = [], balconies = [], trunks = [], crowns = [], tanks = [], units = [], beds = [], blooms = [], benches = [], planters = [], railing = [], cortens = [], trees = [], lots = [], riverBenches = [], palms = []

        const pick = (x) => {
            const c = Math.max(0, 1 - Math.abs(x) / 19) // downtown in the middle
            const r = rand()
            if (r < 0.09 * c * c) return 'tower'
            if (r < 0.09 * c * c + 0.16 * c) return 'tall'
            if (r < 0.48) return 'mid'
            if (r < 0.72) return 'low'
            return 'house'
        }
        const pickColor = (list) => list[Math.floor(rand() * list.length)]
        const trunk = (x, z, h, r, tilt = 0, yaw = 0, y = 0) => trunks.push({ p: [x, TOP + y, z], s: [r, h, r], r: [0, -yaw, -tilt] })
        const clump = (x, y, z, sx, sy, sz, c) => crowns.push({ p: [x, TOP + y, z], s: [sx, sy, sz], r: [rand() * 3, rand() * 3, 0], c })

        // The trees are the model of Assets/modelos/arbol.glb (<IslandTrees />), each kind with its
        // size and its crown colour: the samán wide, the ceiba big, the guayacán small and in flower
        // (yellow or pink), the chiminango of the streets. (Their trunk also goes in `trunks`, as a
        // mark: the events keep their things off the trees.)
        // (m: which of the tree models it is — by where it stands, not by `rand`: the rest of the
        // city stays where it was)
        const modelTree = (x, z, w, c) => {
            trees.push({ p: [x, TOP, z], w, yaw: rand() * Math.PI * 2, c, m: Math.floor(hash01(x, z) * TREE_MODELS.length) })
            trunks.push({ p: [x, TOP, z], s: [0.06, 0.4, 0.06], r: [0, 0, 0], model: true })
        }
        const addSaman = (x, z, s = 1) => modelTree(x, z, 1.25 * s, pickColor(CANOPY))
        const addGuayacan = (x, z, s = 1, flowers = GUAYACAN.amarillo) => modelTree(x, z, 0.68 * s, pickColor(flowers))
        const addCeiba = (x, z, s = 1) => modelTree(x, z, 1.35 * s, pickColor(CANOPY))
        const addTree = (x, z, s = 1) => modelTree(x, z, (0.66 + rand() * 0.16) * s, pickColor(CANOPY))
        // Palma: the model of Assets/modelos/Palmera.glb (<IslandTrees />), as tall as the palm, leaning
        // its own way, its fronds in its green. (Without it: a tall slender trunk, a little bent, and a
        // crown of long drooping fronds. Both take the same random numbers: the city stays the same.)
        const addPalma = (x, z, s = 1) => {
            const h = (1.0 + rand() * 0.25) * s
            const tilt = 0.05 + rand() * 0.07
            const lean = rand() * Math.PI * 2
            const fronds = Array.from({ length: 7 }, (_, k) => ({ a: (k / 7) * Math.PI * 2 + rand() * 0.4, droop: 0.35 + rand() * 0.25, c: pickColor(CANOPY) }))
            const top = shade(pickColor(CANOPY), 0.8)
            if (PALM_MODEL) {
                rand(), rand() // (the two of its crown's clump)
                palms.push({ p: [x, TOP, z], h: h * 1.1, yaw: lean, c: fronds[0].c })
                trunks.push({ p: [x, TOP, z], s: [0.03, 0.4, 0.03], r: [0, 0, 0], model: true })
                return
            }
            trunk(x, z, h, 0.028 * s, tilt, lean)
            const tx = x + Math.sin(tilt) * h * Math.cos(lean), tz = z + Math.sin(tilt) * h * Math.sin(lean), ty = Math.cos(tilt) * h
            for (const { a, droop, c } of fronds) crowns.push({ p: [tx + Math.cos(a) * 0.2 * s, TOP + ty - 0.04 * s, tz + Math.sin(a) * 0.2 * s], s: [0.24 * s, 0.03 * s, 0.075 * s], r: [0, -a, -droop], c })
            clump(tx, ty + 0.01, tz, 0.07 * s, 0.06 * s, 0.07 * s, top)
        }
        const TREES = {
            palma: addPalma,
            saman: addSaman,
            guayacanAmarillo: (x, z, s) => addGuayacan(x, z, s, GUAYACAN.amarillo),
            guayacanRosado: (x, z, s) => addGuayacan(x, z, s, GUAYACAN.rosado),
            chiminango: addTree,
            ceiba: addCeiba,
        }

        // City blocks along both banks
        const rows = BUILDING_ROWS
        let slot = 0
        for (let x = -21; x <= 21; x += 1.45) {
            slot++
            const street = onCrossStreet(x, 0.45) // the cross streets cut the blocks
            for (const o0 of [...rows, ...EXTRA_ROWS.map((r) => r.offset)]) {
                const xx = x + (rand() - 0.5) * 0.25
                const extra = EXTRA_ROWS.find((r) => r.offset === o0 && !rows.includes(o0))
                if (extra && (xx < extra.x[0] || xx > extra.x[1])) continue
                // (the north rows move back with the Av. 4 Oeste where it leaves the river)
                const o = o0 < 0 ? o0 + northShift(xx) : o0
                if (onRoad(xx, o, 0.55)) continue
                const z = riverZ(xx) + o
                if (Math.abs(o) + 0.75 > halfWidthAt(xx)) continue
                if (street) continue
                // (a stop's building takes one lot: its neighbours stay; the big places keep their whole plaza)
                if (nearSpot(xx, z, 1.15)) continue
                if (END_BUILDING && Math.abs(xx - END_BUILDING.x) < 1.35 && Math.abs(o - END_BUILDING.o) < 1.25) continue
                if (Math.hypot(xx - ERMITA[0], z - ERMITA[1]) < 2.6) continue // Ermita plaza
                if (inRetreta(xx, o, 0.4)) continue // (La Retreta: its own trees, below)
                if (xx > 15.5 && o < 0 && !RETRETA) { if (rand() > 0.35) (rand() > 0.6 ? addCeiba : addSaman)(xx, z, 1.15); continue } // park at the east end
                // the first block of the north bank, between the Av. 1 Norte and its second street:
                // built up on both sides, like a real cuadra (no empty lots)
                const block = o0 < 0 && o0 > -5 && onNorthStreetX(xx)
                // negative space: many lots stay empty or become a tree
                if (!block && rand() < EMPTY_LOTS) { if (rand() < 0.55) (rand() > 0.75 ? addSaman : addTree)(xx, z, 1.1); continue }
                let kind = pick(xx)
                if (o > 0 && (kind === 'tall' || kind === 'tower')) kind = 'mid' // the south row is narrow
                const v = VARIANTS[kind]
                const yaw = yawAt(xx) + (rand() - 0.5) * 0.05
                // never over a street: the whole lot (its four corners) has to be off the roads
                const c = Math.cos(yaw), s = Math.sin(yaw)
                const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [xx + (a * v.w * c + b * v.d * s) / 2, z + (-a * v.w * s + b * v.d * c) / 2])
                // (nor on the sidewalks of the avenue: in its curve a corner on the sidewalk looked like it was on the street)
                const onWalk = (cx, off) => { const nr = northRoad(cx); return off > nr[0] - 0.3 * nr[2] && off < nr[1] + 0.3 * nr[2] }
                if (corners.some(([cx, cz]) => onRoad(cx, cz - riverZ(cx), 0.04) || onWalk(cx, cz - riverZ(cx)) || Math.abs(cz - riverZ(cx)) + 0.12 > halfWidthAt(cx))) continue
                const hScale = 0.88 + rand() * 0.24
                // the generic buildings are the models of Assets/modelos (edificio_bajo / _medio / _alto),
                // picked at random for their size; the colonial houses keep their clay-tile roofs.
                // Each one faces its street: the river, or the street behind (the second row of a block)
                const model = kind === 'low' ? 'bajo' : kind === 'mid' ? (rand() < 0.55 ? 'medio' : 'bajo') : kind === 'tall' ? (rand() < 0.6 ? 'alto' : 'medio') : kind === 'tower' ? 'alto' : null
                // (the back rows: the north one along its second street; on the south, the row behind
                // a front row along the Av. Colombia, and the second row of the block east of the Carrera 3)
                const back = (o0 === -4.75 && onNorthStreetX(xx)) ||
                    (o0 === BUILDING_ROWS[0] && EXTRA_ROWS.some((r) => r.offset < o0 && xx >= r.x[0] && xx <= r.x[1])) ||
                    (o0 > BUILDING_ROWS[0] && !!extra)
                const towardsRiver = o > 0 ? Math.PI : 0
                if (model) {
                    buildings[kind].push({ p: [xx, TOP, z], s: [1, hScale, 1], r: [0, yaw, 0], c: WALLS[Math.floor(rand() * WALLS.length)], model, w: v.w, d: v.d, h: hScale, turn: towardsRiver + (back ? Math.PI : 0) })
                    lots.push({ x: xx, z, yaw, w: v.w, d: v.d })
                    continue
                }
                buildings[kind].push({ p: [xx, TOP, z], s: [1, hScale, 1], r: [0, yaw, 0], c: WALLS[Math.floor(rand() * WALLS.length)] })
                lots.push({ x: xx, z, yaw, w: v.w, d: v.d })
                const pitched = v.roof === 'pitched' || (v.roof === 'mixed' && rand() < 0.5)
                // clay-tile hip roof with eaves, or a flat roof with a cornice
                if (pitched) roofs.push({ p: [xx, TOP + v.h * hScale, z], s: [v.w * 1.14, kind === 'house' ? 0.34 : 0.3, v.d * 1.14], r: [0, yaw, 0], c: ROOFS[Math.floor(rand() * ROOFS.length)] })
                else {
                    const roofY = TOP + v.h * hScale + 0.05
                    slabs.push({ p: [xx, roofY - 0.025, z], s: [v.w * 1.04, 0.05, v.d * 1.04], r: [0, yaw, 0] })
                    // rooftop life: a water tank and an AC unit, like every Cali rooftop
                    const rx = (rand() - 0.5) * v.w * 0.5, rz = (rand() - 0.5) * v.d * 0.5
                    tanks.push({ p: [xx + rx * Math.cos(yaw) + rz * Math.sin(yaw), roofY + 0.08, z - rx * Math.sin(yaw) + rz * Math.cos(yaw)], s: [0.09, 0.16, 0.09] })
                    units.push({ p: [xx - rx * Math.cos(yaw), roofY + 0.04, z - rz * Math.cos(yaw)], s: [0.16, 0.08, 0.12], r: [0, yaw, 0] })
                }
                // balconies on the facade that looks at the river (republican + modern blocks)
                if (kind !== 'house' && kind !== 'tower') {
                    const lz = -Math.sign(o) * (v.d / 2 + 0.05)
                    const every = kind === 'low' ? 1 : 2
                    for (let fl = 1; fl < v.floors; fl += every) {
                        const y = (fl / v.floors) * v.h * hScale
                        balconies.push({ p: [xx + lz * Math.sin(yaw), TOP + y, z + lz * Math.cos(yaw)], s: [v.w * 0.62, 0.035, 0.11], r: [0, yaw, 0] })
                    }
                }
            }
        }

        // buildings changed by hand (island.json → buildingSwaps): the generic building nearest the
        // spot becomes another model, facing where it says
        for (const sw of ISLAND_VARIANT.buildingSwaps ?? []) {
            const [ax, ao] = sw.at
            let best = null, bd = Infinity
            for (const list of Object.values(buildings)) for (const b of list) {
                if (!b.model) continue
                const d = Math.hypot(b.p[0] - ax, b.p[2] - riverZ(b.p[0]) - ao)
                if (d < bd) (bd = d), (best = b)
            }
            if (!best || bd > 1) continue
            const o = best.p[2] - riverZ(best.p[0])
            const river = o > 0 ? Math.PI : 0 // (the +z of a model, turned towards the river)
            best.model = sw.model
            best.turn = { rio: river, atras: river + Math.PI, calle_este: Math.PI / 2, calle_oeste: -Math.PI / 2 }[sw.face] ?? best.turn
            if (sw.model === 'medio' || sw.model === 'bajo') best.h = Math.min(best.h, sw.model === 'bajo' ? 0.75 : 0.95)
        }

        // Along the river rail of the pedestrian Bulevar (like the photo): the long benches of
        // Assets/modelos/sillas_borde_rio.glb (<RiverBenches />), end to end along the railing with a
        // gap between them, in the gaps between the palms and the lamps
        let lastBench = -Infinity
        for (let x = -19; x <= 19; x += 0.1) {
            const z = riverZ(x) + RIVER_BENCH.o
            const half = RIVER_BENCH.len / 2
            if (x - lastBench < RIVER_BENCH.len + 0.3 || !onPedestrian(x - half, -0.3) || !onPedestrian(x + half, -0.3) || onCrossStreet(x, 0.5 + half) || nearSpot(x, z, 0.5) || Math.abs(x - PUENTE[0]) < 1.1 + half || FOOTBRIDGES.some((b) => Math.abs(x - b) < 0.5 + half)) continue
            // (the palms stand behind the benches and the lamps of the rail in front: neither in the way)
            if (PROMENADE_TREES.some((tr) => Math.abs(tr.x - x) < half + 0.1 && tr.z - riverZ(tr.x) > 0 && tr.z - riverZ(tr.x) < 1.42)) continue
            lastBench = x
            riverBenches.push({ x, z, yaw: yawAt(x) })
        }
        // In the middle of the walk: long planters full of plants (and a guayacán), with a wooden
        // bench along each side (the furniture modules between them: <BulevarModules />)
        for (const { x, half } of BULEVAR_CENTER.long) {
            const yaw = yawAt(x)
            const z = riverZ(x) + BULEVAR_MID
            const c = Math.cos(yaw), s = Math.sin(yaw)
            cortens.push({ p: [x, TOP + 0.05, z], s: [half * 2, 0.1, 0.3], r: [0, yaw, 0] })
            for (const side of [-1, 1]) {
                benches.push({ p: [x + s * side * 0.19, TOP + 0.07, z + c * side * 0.19], s: [half * 1.9, 0.025, 0.08], r: [0, yaw, 0] })
                cortens.push({ p: [x + s * side * 0.19, TOP + 0.03, z + c * side * 0.19], s: [half * 1.8, 0.06, 0.05], r: [0, yaw, 0] })
            }
            for (let k = 0; k < 7; k++) {
                const t = (k / 6 - 0.5) * half * 1.8
                clump(x + t * c, 0.14, z - t * s, 0.15, 0.08, 0.11, pickColor(CANOPY))
            }
            addGuayacan(x, z, 0.85, rand() > 0.5 ? GUAYACAN.amarillo : GUAYACAN.rosado)
        }
        // (the little tree of the round planter of each furniture module comes in asientos_centro.glb;
        // its trunk marks it for the events, which keep their things off it)
        for (const { x } of BULEVAR_CENTER.modules) {
            const yaw = yawAt(x)
            const along = 0.105 * MODULE_LEN, across = -0.19 * MODULE_LEN
            trunks.push({ p: [x + along * Math.cos(yaw) + across * Math.sin(yaw), TOP, riverZ(x) + BULEVAR_MID - along * Math.sin(yaw) + across * Math.cos(yaw)], s: [0.06, 0.4, 0.06], r: [0, 0, 0], model: true })
        }
        // The building where the Bulevar ends in the west (its walk narrows and runs into it)
        if (END_BUILDING) {
            const { x, o, along, across } = END_BUILDING
            const v = VARIANTS.mid
            const yaw = yawAt(x)
            const z = riverZ(x) + o
            const hScale = 0.8
            buildings.mid.push({ p: [x, TOP, z], s: [along / v.w, hScale, across / v.d], r: [0, yaw, 0], c: mix(PALETTE.crema, PALETTE.rosa, 0.5) })
            lots.push({ x, z, yaw, w: along, d: across })
            slabs.push({ p: [x, TOP + v.h * hScale - 0.025, z], s: [along * 1.04, 0.05, across * 1.04], r: [0, yaw, 0] })
            tanks.push({ p: [x, TOP + v.h * hScale + 0.08, z], s: [0.09, 0.16, 0.09] })
        }

        // …and the white railing along the river
        for (let x = PEDESTRIAN[0] + 0.15; x <= PEDESTRIAN[1] - 0.15; x += 0.42) {
            if (Math.abs(x) > RIVER_HALF_LENGTH || Math.abs(x - PUENTE[0]) < 0.75 || FOOTBRIDGES.some((b) => Math.abs(x - b) < 0.35)) continue
            const yaw = yawAt(x)
            const z = riverZ(x) + 0.985
            railing.push({ p: [x, TOP + 0.08, z], s: [0.025, 0.16, 0.025], r: [0, yaw, 0] })
            if (Math.abs(x + 0.42 - PUENTE[0]) < 0.75 || FOOTBRIDGES.some((b) => Math.abs(x + 0.42 - b) < 0.35) || x + 0.42 > PEDESTRIAN[1] - 0.15) continue
            const zm = riverZ(x + 0.21) + 0.985
            for (const y of [0.16, 0.09]) railing.push({ p: [x + 0.21, TOP + y, zm], s: [0.44, 0.018, 0.018], r: [0, yawAt(x + 0.21), 0] })
        }

        // The boulevard's trees (samanes, guayacanes, chiminangos) + ceibas at the Ermita plaza
        PROMENADE_TREES.forEach((tr) => TREES[tr.kind](tr.x, tr.z, tr.s))
        ;[[-2.0, 1.3], [2.1, 1.6]].forEach(([dx, dz]) => {
            const x = ERMITA[0] + dx, z = ERMITA[1] + dz
            if (!onRoad(x, z - riverZ(x), 0.5)) addCeiba(x, z, 1.05) // (not on the street by the Ermita)
        })
        // the hedge where the floor of the Gato del Río ends
        for (const [x, o] of gatoHedge()) clump(x + (rand() - 0.5) * 0.04, 0.07, riverZ(x) + o, 0.13, 0.1, 0.13, pickColor(CANOPY))

        // Both ends of the island, all the way to the edge: a park with trees of every kind, a few
        // little houses, benches and flower beds (they used to be bare lawn). Nothing on the
        // river, the roads, the Ermita plaza, the places and stops, nor on what is already there.
        {
            const taken = [
                ...Object.entries(buildings).flatMap(([k, list]) => list.map((b) => [b.p[0], b.p[2], Math.max(VARIANTS[k].w, VARIANTS[k].d) * 0.75 + 0.45])),
                ...trunks.map((t) => [t.p[0], t.p[2], 0.55]),
            ]
            const free = (x, z, r) => !taken.some(([a, b, rr]) => Math.hypot(a - x, b - z) < r + rr)
            const yawFor = (x) => yawAt(x) + (rand() - 0.5) * 0.08
            for (let x = -22.7; x <= 22.7; x += 0.8) {
                if (Math.abs(x) < 18.4) continue
                const hw = halfWidthAt(x)
                for (let o = -hw + 0.5; o <= hw - 0.5; o += 0.8) {
                    const xx = x + (rand() - 0.5) * 0.35
                    const oo = o + (rand() - 0.5) * 0.35
                    const z = riverZ(xx) + oo
                    if ((Math.abs(xx) < RIVER_HALF_LENGTH + 0.6 && Math.abs(oo) < ZONES.channel + 0.45) || Math.abs(oo) + 0.45 > halfWidthAt(xx)) continue // river · edge
                    if (onRoad(xx, oo, 0.25) || nearSpot(xx, z, 1.5) || Math.hypot(xx - ERMITA[0], z - ERMITA[1]) < 2.5 || inRetreta(xx, oo, 0.3)) continue
                    if (CORRIDOR && xx > CORRIDOR.x[0] - 0.3 && xx < CORRIDOR.x[1] + 0.3 && oo > CORRIDOR.across[0] - 0.3 && oo < corridorEdge(xx) + 0.3) continue // (the walk by the trench)
                    const r = rand()
                    if (r < 0.1 && Math.abs(oo) > 2.4 && free(xx, z, 0.7)) {
                        // a little colonial house with its clay-tile roof
                        const v = VARIANTS.house
                        const yaw = yawFor(xx)
                        const hScale = 0.9 + rand() * 0.2
                        buildings.house.push({ p: [xx, TOP, z], s: [1, hScale, 1], r: [0, yaw, 0], c: WALLS[Math.floor(rand() * WALLS.length)] })
                        lots.push({ x: xx, z, yaw, w: v.w, d: v.d })
                        roofs.push({ p: [xx, TOP + v.h * hScale, z], s: [v.w * 1.14, 0.34, v.d * 1.14], r: [0, yaw, 0], c: ROOFS[Math.floor(rand() * ROOFS.length)] })
                        taken.push([xx, z, 0.9])
                    } else if (r < 0.72 && free(xx, z, 0.25)) {
                        const kind = rand()
                        ;(kind < 0.3 ? addSaman : kind < 0.5 ? (a, b, s) => addGuayacan(a, b, s, rand() > 0.5 ? GUAYACAN.rosado : GUAYACAN.amarillo) : kind < 0.65 ? addCeiba : addTree)(xx, z, 0.85 + rand() * 0.3)
                        taken.push([xx, z, 0.5])
                    } else if (r < 0.82 && free(xx, z, 0.3)) {
                        const yaw = yawFor(xx)
                        beds.push({ p: [xx, TOP + 0.04, z], s: [0.55, 0.08, 0.16], r: [0, yaw, 0] })
                        for (let k = 0; k < 4; k++) blooms.push({ p: [xx + (k - 1.5) * 0.13, TOP + 0.11, z + (rand() - 0.5) * 0.06], s: [0.07, 0.06, 0.07], r: [rand(), rand(), 0], c: BLOOMS[Math.floor(rand() * BLOOMS.length)] })
                        benches.push({ p: [xx, TOP + 0.07, z + 0.3], s: [0.42, 0.04, 0.12], r: [0, yaw, 0] })
                        taken.push([xx, z, 0.4])
                    }
                }
            }
        }

        // Edge vegetation hanging over the cliff (very characteristic in the reference)
        const ring = outline()
        ring.forEach((p, i) => {
            if (i % 2) return
            // (on your terrain: at ITS edge — the point of the rim moved in or out until it is there)
            const s = 0.28 + rand() * 0.35
            // (on your terrain: bushes ON the lawn of its edge, as far in as they are big, so none
            // sticks out over the edge)
            const q = USER_GROUND ? userRim(p, s + 0.05) : p
            if (!q) return
            // (not where a street reaches the rim: it runs all the way to the edge)
            if (USER_GROUND ? onGround('street', q.x, q.y, 0.25 + s) || onGround('walk', q.x, q.y, s * 0.6) : onRoad(p.x, (p.y - riverZ(p.x)) * 0.985, 0.18)) return
            if (USER_GROUND) {
                if (!inUserBuilding(q.x, q.y, s)) crowns.push({ p: [q.x, TOP + s * 0.42, q.y], s: [s, s * 0.85, s], r: [rand(), rand(), 0], c: CANOPY[Math.floor(rand() * CANOPY.length)] })
                return
            }
            const [x1, z1] = USER_GROUND ? [q.x, q.y] : [p.x * 0.985, riverZ(p.x) + (p.y - riverZ(p.x)) * 0.97]
            const [x2, z2] = USER_GROUND ? [q.x, q.y] : [p.x * 0.99, riverZ(p.x) + (p.y - riverZ(p.x)) * 0.985]
            crowns.push({ p: [x1, TOP - 0.1 - rand() * 0.25, z1], s: [s, s * 0.85, s], r: [rand(), rand(), 0], c: CANOPY[Math.floor(rand() * CANOPY.length)] })
            if (rand() > 0.5) crowns.push({ p: [x2, TOP - 0.7 - rand() * 0.5, z2], s: [s * 0.8, s, s * 0.8], r: [rand(), rand(), 0], c: CANOPY[Math.floor(rand() * CANOPY.length)] })
        })

        // La Retreta: big samanes and ceibas over its lawn (their shade over the walks, like the Paseo
        // Bolívar), off its paths, the kiosk, the stages and the lamps; and benches along the paths
        if (RETRETA) {
            const lampNear = (x, o, r) => STREET_LAMPS.some((l) => Math.hypot(l.x - x, l.z - riverZ(x) - o) < r)
            const clear = (x, o, r) => !onRetretaSpot(x, o, r) && !nearSpot(x, riverZ(x) + o, 0.6) && !lampNear(x, o, 0.3) && Math.abs(o) + r < halfWidthAt(x) - 0.25 && !onRoad(x, o, r)
            const spots = []
            for (let x = RETRETA.x + 0.35; x < L; x += 0.7) {
                for (let o = -1.35; o > RETRETA.back + 0.2; o -= 0.7) {
                    const h = hash01(x, o)
                    const xx = x + (h - 0.5) * 0.45, oo = o + (hash01(o, x) - 0.5) * 0.45
                    if (h < 0.08 || !clear(xx, oo, 0.2) || spots.some(([a, b]) => Math.hypot(a - xx, b - oo) < 0.72)) continue
                    spots.push([xx, oo])
                    ;(h > 0.82 ? addCeiba : addSaman)(xx, riverZ(xx) + oo, 0.9 + h * 0.3)
                }
            }
            for (const [x0, x1, o0, o1] of RETRETA.paths ?? []) {
                const along = x1 - x0 >= o1 - o0
                const [a, b] = along ? [x0, x1] : [o0, o1]
                for (const side of along ? [o0 - 0.16, o1 + 0.16] : [x0 - 0.16, x1 + 0.16]) {
                    for (let u = a + 0.55; u < b - 0.4; u += 1.25) {
                        const [x, o] = along ? [u, side] : [side, u]
                        if (o > -1.1 || !clear(x, o, 0.05) || spots.some(([sx, so]) => Math.hypot(sx - x, so - o) < 0.35) || lampNear(x, o, 0.35)) continue
                        benches.push({ p: [x, TOP + 0.07, riverZ(x) + o], s: [0.42, 0.04, 0.12], r: [0, yawAt(x) + (along ? 0 : Math.PI / 2), 0] })
                    }
                }
            }
        }
        // (La Ermita stands on the lawn itself: no plaza slab under it — only the building)
        // Your buildings: nothing of the page stands inside them (trees, palms, benches, flowers…)
        if (USER_BOXES.length) {
            const out = (list, at) => list.splice(0, list.length, ...list.filter((it) => !inUserBuilding(...at(it), 0.12)))
            const p = (it) => [it.p[0], it.p[2]]
            out(trees, p), out(palms, p), out(trunks, p), out(crowns, p), out(benches, p), out(beds, p), out(blooms, p)
            out(riverBenches, (b) => [b.x, b.z])
        }
        // Your terrain: nothing of the page on its streets and the paths of La Retreta
        if (USER_GROUND) {
            const off = (list, at) => list.splice(0, list.length, ...list.filter((it) => !offYourGround(...at(it))))
            const p = (it) => [it.p[0], it.p[2]]
            // (a trunk is thin: a tree may stand on the sidewalk right by the street)
            const trunk = (it) => [it.p[0], it.p[2], 0.05]
            off(trees, trunk), off(palms, trunk), off(trunks, trunk), off(crowns, p), off(beds, p), off(blooms, p)
            off(benches, (b) => [b.p[0], b.p[2], 0.02]) // (a bench: right at the edge of a path)
        }
        // Your island as you arranged it: its trees, benches, furniture and flowers are yours (in its
        // file, where you left them) — the page draws none of its own; its trees are where yours
        // stand (for the lights of the Alumbrado in their crowns)
        if (USER_ISLAND) {
            const mine = USER_TREES.filter((t) => !t.palm).map((t) => ({ p: [t.x, t.y ?? TOP, t.z], w: t.w, h: t.h, yaw: 0, c: CANOPY[0], m: 0 }))
            const myPalms = USER_TREES.filter((t) => t.palm).map((t) => ({ p: [t.x, t.y ?? TOP, t.z], h: t.h, yaw: 0, c: CANOPY[0] }))
            return { buildings, roofs, slabs, plots, balconies, trunks: [], crowns: [], ring, tanks, units, beds: [], blooms: [], benches: [], planters: [], railing: [], cortens: [], trees: mine, lots, riverBenches: [], palms: myPalms }
        }
        return { buildings, roofs, slabs, plots, balconies, trunks, crowns, ring, tanks, units, beds, blooms, benches, planters, railing, cortens, trees, lots, riverBenches, palms }
    }
}
export const CITY = buildCity()

/**
 * The ground of the blocks: pavement where the buildings are (around each one, and the gaps
 * between them in a block), like a real cuadra — the rim of the island stays green, and where
 * there is no building near there is no pavement either. Cells of the (along, across) grid.
 */
const BLOCK_CELL = 0.08
const BLOCK_RIM = 0.5 // (the green border, where the bushes are)
// (lighter and warmer than the streets: the same grey made the streets and the blocks one)
const blockMat = new THREE.MeshStandardMaterial({ color: '#EAE3D3', roughness: 0.95 })
function blockPavement() {
    const feet = [
        ...(USER_BOXES.length ? USER_BOXES : CITY.lots), // (around your buildings, as you left them)
        ...ALL_STOPS.filter((s) => !s.landmark).map((s) => ({ x: s.position[0], z: s.position[1], yaw: yawAt(s.position[0]), w: 1.1, d: 1.0 })),
        ...LANDMARKS.filter((l) => !inRetreta(l.along, l.across)).map((l) => ({ x: l.x, z: l.z, yaw: yawAt(l.x), w: l.size, d: l.size })), // (the kiosk of La Retreta stands on the lawn, in its circle)
        ...PLACES.filter((p) => !p.sink && (p.size ?? 0) < 3).map((p) => ({ x: p.position[0], z: p.position[1], yaw: yawAt(p.position[0]), w: p.size ?? 1.3, d: p.size ?? 1.3 })),
        // (a big place with its own plaza: pavement under it and a little around — island.json → pave)
        ...PLACES.filter((p) => p.pave).map((p) => ({ x: p.position[0], z: p.position[1], yaw: yawAt(p.position[0]) + ((p.turn ?? 0) * Math.PI) / 180, w: p.pave[0], d: p.pave[1] })),
    ]
    const X0 = -L, NX = Math.ceil((2 * L) / BLOCK_CELL), O0 = -W, NO = Math.ceil((2 * W) / BLOCK_CELL)
    const on = new Uint8Array(NX * NO)
    const cx = (i) => X0 + (i + 0.5) * BLOCK_CELL, co = (j) => O0 + (j + 0.5) * BLOCK_CELL
    const ok = (i, j) => {
        const x = cx(i), o = co(j)
        if (onPedestrian(x) && o > 0 && o < ZONES.promenadeFront[1]) return false // (the Bulevar has its own paving)
        return Math.abs(o) < halfWidthAt(x) - BLOCK_RIM && Math.abs(o) > ZONES.channel + 0.3 && !onRoad(x, o, 0)
    }
    const M = 0.35 // (the pavement around each building)
    for (const f of feet) {
        const r = Math.hypot(f.w, f.d) / 2 + M
        const i0 = Math.max(0, Math.floor((f.x - r - X0) / BLOCK_CELL)), i1 = Math.min(NX - 1, Math.ceil((f.x + r - X0) / BLOCK_CELL))
        const c = Math.cos(f.yaw), s = Math.sin(f.yaw)
        for (let i = i0; i <= i1; i++) {
            const x = cx(i), rz = riverZ(x)
            const j0 = Math.max(0, Math.floor((f.z - rz - r - O0) / BLOCK_CELL)), j1 = Math.min(NO - 1, Math.ceil((f.z - rz + r - O0) / BLOCK_CELL))
            for (let j = j0; j <= j1; j++) {
                const dx = x - f.x, dz = rz + co(j) - f.z
                const lx = dx * c - dz * s, lz = dx * s + dz * c
                if (Math.abs(lx) < f.w / 2 + M && Math.abs(lz) < f.d / 2 + M && ok(i, j)) on[i * NO + j] = 1
            }
        }
    }
    // the gaps of a block (an empty lot between two buildings) are paved too: along and across
    // (2 = paved, 1 = a street: a gap between pavement and pavement, or pavement and its street, is filled)
    const kind = (i, j) => (on[i * NO + j] ? 2 : onRoad(cx(i), co(j), 0) ? 1 : 0)
    const close = (n, m, get, set, maxGap) => {
        for (let a = 0; a < n; a++) {
            let last = -1, lastK = 0
            for (let b = 0; b < m; b++) {
                const k = get(a, b)
                if (!k) continue
                if (last >= 0 && b - last > 1 && b - last <= maxGap && (k === 2 || lastK === 2)) for (let q = last + 1; q < b; q++) set(a, q)
                last = b
                lastK = k
            }
        }
    }
    close(NO, NX, (j, i) => kind(i, j), (j, i) => ok(i, j) && (on[i * NO + j] = 1), Math.round(4.2 / BLOCK_CELL))
    close(NX, NO, (i, j) => kind(i, j), (i, j) => ok(i, j) && (on[i * NO + j] = 1), Math.round(2.0 / BLOCK_CELL))
    // one ribbon per run of cells along each row
    const pos = [], idx = []
    const y = TOP + 0.004
    for (let j = 0; j < NO; j++) {
        const oa = O0 + j * BLOCK_CELL, ob = oa + BLOCK_CELL
        let i = 0
        while (i < NX) {
            if (!on[i * NO + j]) { i++; continue }
            let e = i
            while (e + 1 < NX && on[(e + 1) * NO + j]) e++
            const xs = []
            for (let k = i; k <= e + 1; k += 4) xs.push(X0 + k * BLOCK_CELL)
            if (xs[xs.length - 1] < X0 + (e + 1) * BLOCK_CELL - 1e-6) xs.push(X0 + (e + 1) * BLOCK_CELL)
            const v = pos.length / 3
            xs.forEach((x, k) => {
                pos.push(x, y, riverZ(x) + oa, x, y, riverZ(x) + ob)
                if (k > 0) { const a = v + (k - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2, a + 2, a + 1, a, a + 2, a + 3, a + 1) }
            })
            i = e + 1
        }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(new Float32Array(pos.length).map((_, k) => (k % 3 === 1 ? 1 : 0)), 3))
    g.setIndex(idx)
    return g
}
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') (window.__bulevarCity = CITY), (window.__bulevarLamps = STREET_LAMPS), (window.__promenade = PROMENADE_TREES), (window.__stops = ALL_STOPS) // (dev: to look at the layout from the console)
const useCity = () => CITY

function Instanced({ name, geometry, material, items, castShadow = true, receiveShadow = true }) {
    const ref = useRef()
    useLayoutEffect(() => {
        if (!ref.current) return
        const d = new THREE.Object3D()
        const color = new THREE.Color()
        items.forEach((it, i) => {
            d.position.set(...it.p)
            d.rotation.set(...(it.r ?? [0, 0, 0]))
            d.scale.set(...it.s)
            d.updateMatrix()
            ref.current.setMatrixAt(i, d.matrix)
            if (it.c) ref.current.setColorAt(i, color.set(it.c))
        })
        ref.current.instanceMatrix.needsUpdate = true
        if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
        ref.current.computeBoundingSphere()
    }, [items])
    if (!items.length) return null
    return <instancedMesh ref={ref} name={name} args={[geometry, material, items.length]} castShadow={castShadow} receiveShadow={receiveShadow} />
}

/**
 * La Ermita (east end of the boulevard): Assets/modelos/iglesia_ermita.glb, its tower and its
 * façade towards the Bulevar, as long as ERMITA_LEN. (Until it loads: the simple one below.)
 */
const ERMITA_STOP = ALL_STOPS.find((s) => s.id === 'ermita')
const ERMITA_LEN = 2.7 * (ERMITA_STOP.scale ?? 1) // (as big as you left it in your buildings file)
// (turned on its spot — island.json → stops.ermita.turn, degrees: diagonal, its façade towards the
// Bulevar and the river)
const ERMITA_YAW = yawAt(ERMITA[0]) + Math.PI + (((ISLAND_VARIANT.stops?.ermita?.turn ?? 0) + (ERMITA_STOP.turn ?? 0)) * Math.PI) / 180
function Ermita() {
    return (
        <Suspense fallback={<group position={[ERMITA[0], TOP, ERMITA[1]]} rotation-y={ERMITA_YAW - Math.PI / 2}><ErmitaModel /></group>}>
            <ErmitaGlb />
        </Suspense>
    )
}
function ErmitaGlb() {
    const { scene } = useGLTF('models/iglesia_ermita.glb')
    const parts = useMemo(() => unitParts(scene, { speckleScale: 8 }), [scene])
    // (the model's tower is at its +x: turned round, it stands at the west end, facing the Bulevar)
    return (
        <group name="hito_la-ermita" position={[ERMITA[0], TOP, ERMITA[1]]} rotation-y={ERMITA_YAW} scale={ERMITA_LEN}>
            {parts.map((p, i) => <mesh key={i} geometry={p.geo} material={p.mat} castShadow receiveShadow />)}
        </group>
    )
}
useGLTF.preload('models/iglesia_ermita.glb')
/** The simple church (origin at its base): shown while the model loads. */
export function ErmitaModel() {
    const wall = mat(PALETTE.crema)
    const spire = mat(shade(PALETTE.crema, 0.55))
    return (
        <group>
            <mesh geometry={geo.box} material={wall} position={[0, 0.45, 0.2]} scale={[0.9, 0.9, 1.9]} castShadow receiveShadow />
            <mesh geometry={geo.cone} material={spire} position={[0, 1.05, 0.2]} scale={[0.62, 0.32, 1.35]} rotation-y={Math.PI / 4} castShadow />
            <mesh geometry={geo.box} material={wall} position={[0, 0.85, -0.85]} scale={[0.55, 1.7, 0.55]} castShadow />
            <mesh geometry={geo.cone} material={spire} position={[0, 2.25, -0.85]} scale={[0.36, 1.1, 0.36]} castShadow />
            {[-0.38, 0.38].map((x) => (
                <group key={x}>
                    <mesh geometry={geo.box} material={wall} position={[x, 0.6, -0.72]} scale={[0.2, 1.2, 0.2]} castShadow />
                    <mesh geometry={geo.cone} material={spire} position={[x, 1.45, -0.72]} scale={[0.13, 0.5, 0.13]} />
                </group>
            ))}
        </group>
    )
}

/** Puente Ortiz itself (origin at the middle of its deck) — also exported as an FBX. */
export function PuenteOrtizModel() {
    const brick = mat(shade(PALETTE.naranja, 0.62))
    return (
        <group>
            <mesh geometry={geo.box} material={brick} position-y={0.04} scale={[1.3, 0.12, 2.3]} castShadow receiveShadow />
            {[-1, 1].map((s) => (
                <group key={s}>
                    <mesh geometry={geo.box} material={brick} position={[s * 0.61, 0.17, 0]} scale={[0.08, 0.16, 2.3]} castShadow />
                    {[-0.8, -0.27, 0.27, 0.8].map((z) => <mesh key={z} geometry={geo.box} material={mat(PALETTE.crema)} position={[s * 0.61, 0.28, z]} scale={[0.1, 0.06, 0.1]} />)}
                </group>
            ))}
            {[-0.45, 0.45].map((z) => (
                <mesh key={z} material={brick} position={[0, -0.02, z]} rotation-y={Math.PI / 2} scale={[1, 1, 1.25]}>
                    <torusGeometry args={[0.42, 0.07, 8, 20, Math.PI]} />
                </mesh>
            ))}
        </group>
    )
}

/** Puente Ortiz (pedestrian, brick, arched) + two light footbridges. Cars don't cross the river here. */
function Bridges() {
    const deck = mat(shade(PALETTE.crema, 0.85))
    const rail = mat(shade(PALETTE.crema, 0.6))
    return (
        <>
            <group name="hito_puente-ortiz" position={[PUENTE[0], TOP, riverZ(PUENTE[0])]} rotation-y={yawAt(PUENTE[0])}>
                <PuenteOrtizModel />
            </group>
            {FOOTBRIDGES.map((x) => (
                <group key={x} name={`pasarela_${x < 0 ? 'oeste' : 'este'}`} position={[x, TOP, riverZ(x)]} rotation-y={yawAt(x)}>
                    <mesh geometry={geo.box} material={deck} position-y={0.03} scale={[0.6, 0.08, 2.2]} castShadow receiveShadow />
                    {[-1, 1].map((s) => (
                        <mesh key={s} geometry={geo.box} material={rail} position={[s * 0.28, 0.13, 0]} scale={[0.03, 0.12, 2.2]} />
                    ))}
                </group>
            ))}
        </>
    )
}

/**
 * Streets: the calles cross perpendicular to the river and end at the roads — on the north bank at
 * the Av. 1 Norte, on the south bank at the edge of the pedestrian Bulevar (crossing the Carrera 3).
 * Zebra crossings at every junction, dashed center lines.
 */
/**
 * The calles as one mesh: each piece { c, from(x), side } goes across the island from its avenue
 * to the rim (side +1 south, -1 north), as a grid that follows the rim at its end — a box cut
 * straight there left a corner of lawn on one side and stuck out on the other.
 */
function crossStreetGeometry(pieces) {
    const pos = [], idx = []
    const COLS = 6, ROWS = 14
    for (const { c, from, side } of pieces) {
        const base = pos.length / 3
        for (let i = 0; i <= COLS; i++) {
            const x = c - CROSS_HALF + (i / COLS) * CROSS_HALF * 2
            const o0 = from(x), o1 = side * (halfWidthAt(x) - ROAD_RIM)
            for (let j = 0; j <= ROWS; j++) {
                const o = o0 + (o1 - o0) * (j / ROWS)
                pos.push(x, TOP + 0.011, riverZ(x) + o)
            }
        }
        for (let i = 0; i < COLS; i++) {
            for (let j = 0; j < ROWS; j++) {
                const a = base + i * (ROWS + 1) + j, b = a + ROWS + 1
                // (both windings: seen from above whichever way it runs)
                idx.push(a, b, a + 1, b, b + 1, a + 1, a + 1, b, a, a + 1, b + 1, b)
            }
        }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3))
    g.setIndex(idx)
    return g
}

function useStreets() {
    return useMemo(() => {
        const roads = [], zebras = [], dashes = []
        const zebra = (x, a, b) => {
            for (let o = a + 0.08; o < b - 0.04; o += 0.13) zebras.push({ p: [x, TOP + 0.013, riverZ(x) + o], s: [0.22, 0.004, 0.065], r: [0, yawAt(x), 0] })
        }
        CROSS_STREETS.forEach((x) => {
            const yaw = yawAt(x)
            // (all the way to the rim of the island: where the rim is nearer, at either side of the calle)
            // (south: from the Bulevar — or from the Av. Colombia where it runs in the open; north: from
            // the Av. 1 Norte / 4 Oeste, wherever it runs — each all the way to the rim, with its shape)
            const southFrom = onSouthRoadX(x) ? SOUTH_ROAD.offsets[1] : ZONES.promenadeFront[1]
            roads.push({ c: x, from: () => southFrom, side: 1 }, { c: x, from: (xx) => northRoad(xx)[0] + 0.02, side: -1 })
            for (const dx of [-1, 1]) {
                const zx = x + dx * (CROSS_HALF + 0.16)
                if (zx < AV1N_TO) zebra(zx, northRoad(zx)[0], northRoad(zx)[1])
                if (onSouthRoadX(zx) && tunnelDepth(zx) == null) zebra(zx, ...SOUTH_ROAD.offsets)
                if (inCarrera3(zx)) zebra(zx, ...ZONES.roadFront)
                if (onNorthStreetX(zx)) zebra(zx, ...NORTH_STREET.offsets)
            }
            // where the calle meets the pedestrian Bulevar: a zebra across the calle
            if (onPedestrian(x)) for (let k = -2; k <= 2; k++) zebras.push({ p: [x + k * 0.15, TOP + 0.013, riverZ(x) + ZONES.promenadeFront[1] + 0.2], s: [0.07, 0.004, 0.24], r: [0, yaw, 0] })
        })
        const center = (o0, xMax, only = null, yOf = null) => {
            for (let x = -xMax + 0.5; x <= xMax - 0.5; x += 0.5) {
                const o = typeof o0 === 'function' ? o0(x) : o0
                if ((only && !only(x)) || onCrossStreet(x, 0.35) || Math.abs(o) + 0.4 > halfWidthAt(x)) continue
                dashes.push({ p: [x, (yOf ? yOf(x) : TOP) + 0.012, riverZ(x) + o], s: [0.24, 0.004, 0.025], r: [0, yawAt(x), 0] })
            }
        }
        center((x) => (ZONES.roadBack[0] + ZONES.roadBack[1]) / 2 + northShift(x), AV1N_X, (x) => x < AV1N_TO - 0.3)
        if (SOUTH_ROAD) center((SOUTH_ROAD.offsets[0] + SOUTH_ROAD.offsets[1]) / 2, 22.6, onSouthRoadX, (x) => roadYAt(x) - 0.006)
        center((ZONES.roadFront[0] + ZONES.roadFront[1]) / 2, 22.6, inCarrera3)
        if (NORTH_STREET) center((NORTH_STREET.offsets[0] + NORTH_STREET.offsets[1]) / 2, 22.6, onNorthStreetX)
        return { roads: crossStreetGeometry(roads), zebras, dashes }
    }, [])
}

/** Stones in the shallow Río Cali. */
const ROCKS = (() => {
    const rand = seeded(29)
    return Array.from({ length: 40 }, () => {
        const x = (rand() - 0.5) * RIVER_HALF_LENGTH * 1.9
        const s = 0.08 + rand() * 0.16
        return { p: [x, TOP - 0.21, riverZ(x) + (rand() - 0.5) * 1.3], s: [s * 1.4, s * 0.55, s], r: [0, rand() * 6, 0], c: [shade(PALETTE.crema, 0.62), shade(PALETTE.crema, 0.5), mix(shade(PALETTE.naranja, 0.45), '#3A3A36', 0.5)][Math.floor(rand() * 3)] }
    })
})()

/** The furniture modules in the middle of the Bulevar (Assets/modelos/asientos_centro.glb), as instances. */
const MODULE_URL = 'models/asientos_centro.glb'
function BulevarModules() {
    const { scene } = useGLTF(MODULE_URL)
    const parts = useMemo(() => unitParts(scene, { speckleScale: 10 }), [scene])
    const meshes = useRef([])
    useLayoutEffect(() => {
        const d = new THREE.Object3D()
        BULEVAR_CENTER.modules.forEach(({ x }, i) => {
            d.position.set(x, TOP + 0.004, riverZ(x) + BULEVAR_MID)
            d.rotation.set(0, yawAt(x), 0)
            d.scale.setScalar(MODULE_LEN)
            d.updateMatrix()
            for (const m of meshes.current) m?.setMatrixAt(i, d.matrix)
        })
        for (const m of meshes.current) if (m) (m.instanceMatrix.needsUpdate = true), m.computeBoundingSphere()
    }, [parts])
    return parts.map((p, i) => (
        <instancedMesh key={i} ref={(m) => (meshes.current[i] = m)} args={[p.geo, p.mat, BULEVAR_CENTER.modules.length]} castShadow receiveShadow name="bulevar_asientos_centro" />
    ))
}
if (BULEVAR_CENTER.modules.length) useGLTF.preload(MODULE_URL)

/** Instances of a model's pieces, placed by `place(item, dummy)` (and tinted by `tint(item)` if given). */
function ModelInstances({ parts, items, place, tint, name, tintable = () => true }) {
    const meshes = useRef([])
    useLayoutEffect(() => {
        const d = new THREE.Object3D()
        const color = new THREE.Color()
        items.forEach((it, i) => {
            place(it, d)
            d.updateMatrix()
            meshes.current.forEach((m, k) => {
                if (!m) return
                m.setMatrixAt(i, d.matrix)
                if (tint && tintable(parts[k])) m.setColorAt(i, color.set(tint(it)))
            })
        })
        for (const m of meshes.current) if (m) (m.instanceMatrix.needsUpdate = true), m.instanceColor && (m.instanceColor.needsUpdate = true), m.computeBoundingSphere()
    }, [parts, items, place, tint, tintable])
    if (!items.length) return null
    return parts.map((p, i) => <instancedMesh key={i} ref={(m) => (meshes.current[i] = m)} args={[p.geo, p.mat, items.length]} castShadow receiveShadow name={`${name}_${String(i + 1).padStart(2, '0')}`} />)
}

/** The long benches in the middle of the Bulevar, right after each module (Assets/modelos/sillas_centro_2.glb). */
function CenterSeats() {
    const { scene } = useGLTF('models/sillas_centro_2.glb')
    const parts = useMemo(() => unitParts(scene, { speckleScale: 10 }), [scene])
    const place = useCallback((s, d) => (d.position.set(s.x, TOP + 0.004, riverZ(s.x) + BULEVAR_MID), d.rotation.set(0, yawAt(s.x), 0), d.scale.setScalar(SEATS_LEN)), [])
    return <ModelInstances parts={parts} items={BULEVAR_CENTER.seats} place={place} name="bulevar_sillas_centro_2" />
}
if (HAS_SEATS) useGLTF.preload('models/sillas_centro_2.glb')

/** The long benches along the river rail of the Bulevar (Assets/modelos/sillas_borde_rio.glb). */
function RiverBenches({ items }) {
    const { scene } = useGLTF('models/sillas_borde_rio.glb')
    const parts = useMemo(() => unitParts(scene, { speckleScale: 10 }), [scene])
    const place = useCallback((b, d) => (d.position.set(b.x, TOP + 0.004, b.z), d.rotation.set(0, b.yaw, 0), d.scale.setScalar(RIVER_BENCH.len)), [])
    return <ModelInstances parts={parts} items={items} place={place} name="bulevar_bancas_rio" />
}
useGLTF.preload('models/sillas_borde_rio.glb')

/**
 * The trees (Assets/modelos/arbol, Arbol2, Arbol3, Arbol4: each tree one of them) and the palms
 * (Palmera): the trunk as it is, the crown in each tree's colour.
 */
const crownOf = (orig) => !/020|^tree$/i.test(orig?.name ?? '') // (Material.020 is the trunk of the trees; "Tree", the palm's)
const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
function TreeModel({ url, items, tall = false, name }) {
    const { scene } = useGLTF(url)
    const { parts, size } = useMemo(() => {
        // (the crown: white, so each tree's colour shows as it is — a little darker where your green
        // is darker, so the tones of your crowns stay)
        let top = 0
        scene.traverse((o) => o.isMesh && crownOf(o.material) && (top = Math.max(top, lum(o.material.color))))
        const crowns = new Map()
        const model = unitModel(scene, {
            speckleScale: 12,
            swap: (orig, clay) => {
                if (!crownOf(orig)) return clay
                if (!crowns.has(orig)) crowns.set(orig, Object.assign(clay.clone(), { color: new THREE.Color().setScalar(0.72 + 0.28 * (top ? lum(orig.color) / top : 1)), userData: { crown: true } }))
                return crowns.get(orig)
            },
        })
        // (the crowns soft and round, like Chonti's clay: their faces smoothed into each other — made
        // light, they came out faceted, like cut stones). Not the fronds of the palm: thin leaves,
        // smoothed, their two faces cancel out and they came out with dark triangles
        for (const p of model.parts) {
            if (!p.mat.userData.crown || tall) continue
            const g = p.geo.clone()
            g.deleteAttribute('normal')
            p.geo = mergeVertices(g, 1e-4)
            p.geo.computeVertexNormals()
        }
        return model
    }, [scene, tall])    // (a tree: as wide as its crown; a palm: as tall as it is)
    const place = useCallback((t, d) => (d.position.set(...t.p), d.rotation.set(0, t.yaw, 0), d.scale.setScalar(tall ? t.h / size.y : t.w)), [tall, size])
    const tint = useCallback((t) => t.c, [])
    const tintable = useCallback((p) => !!p.mat.userData.crown, [])
    return <ModelInstances parts={parts} items={items} place={place} tint={tint} tintable={tintable} name={name} />
}
function IslandTrees({ trees, palms }) {
    const byModel = useMemo(() => TREE_MODELS.map((_, i) => trees.filter((t) => t.m === i)), [trees])
    return (
        <>
            {TREE_MODELS.map((m, i) => <TreeModel key={m} url={`models/${m}.glb`} items={byModel[i]} name={`arboles_${m.toLowerCase()}`} />)}
            {PALM_MODEL && <TreeModel url="models/Palmera.glb" items={palms} tall name="palmeras" />}
        </>
    )
}
TREE_MODELS.forEach((m) => useGLTF.preload(`models/${m}.glb`))
if (PALM_MODEL) useGLTF.preload('models/Palmera.glb')

/**
 * The light of the street lamps at night: a warm pool on the ground under each lamp and a soft halo
 * around it (no real lights: one per lamp would be far too heavy). LAMP_HEADS: where your island's
 * lamps are (UserTerrain fills it); without your island, the page's own lamps.
 */
export const LAMP_HEADS = []
/**
 * The bulbs of a lamp-head geometry placed with `matrix` (world): one point per bulb — each piece of
 * the geometry that hangs together on its own (a post with two arms has two).
 */
function bulbsOf(geometry, matrix) {
    const pos = geometry.attributes.position
    const index = geometry.index ? geometry.index.array : null
    // (the same corner shared by several triangles: welded by its position)
    const key = (i) => `${pos.getX(i).toFixed(4)},${pos.getY(i).toFixed(4)},${pos.getZ(i).toFixed(4)}`
    const parent = Array.from({ length: pos.count }, (_, i) => i)
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
    const join = (a, b) => (parent[find(a)] = find(b))
    const same = new Map()
    for (let i = 0; i < pos.count; i++) {
        const k = key(i)
        if (same.has(k)) join(i, same.get(k))
        else same.set(k, i)
    }
    const tris = index ? index.length : pos.count
    for (let t = 0; t < tris; t += 3) {
        const [a, b, c] = index ? [index[t], index[t + 1], index[t + 2]] : [t, t + 1, t + 2]
        join(a, b), join(b, c)
    }
    const groups = new Map()
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
        const r = find(i)
        if (!groups.has(r)) groups.set(r, { sum: new THREE.Vector3(), n: 0 })
        const g = groups.get(r)
        g.sum.add(v.fromBufferAttribute(pos, i).applyMatrix4(matrix))
        g.n++
    }
    // (a lamp is made of several loose pieces — its shade, its glass…: the pieces close together are
    // one bulb)
    const pieces = [...groups.values()].filter((g) => g.n >= 3).map((g) => ({ p: g.sum.divideScalar(g.n), n: g.n }))
    const bulbs = []
    for (const { p, n } of pieces) {
        const near = bulbs.find((b) => b.p.distanceTo(p) < 0.09)
        if (near) near.p.multiplyScalar(near.n).addScaledVector(p, n).divideScalar((near.n += n))
        else bulbs.push({ p: p.clone(), n })
    }
    return bulbs.map((b) => b.p)
}
/**
 * Your island's street lamps, as you made them (RULE: their geometry is never changed — no lamp added,
 * none taken away): the lamp of each post — the prepared one's cream lamp, or the "Light" material of
 * your original postes.glb — is marked `_lampara` (it lights up at night) → its bulbs, for LampGlow.
 */
const LAMP_TAG = '_lampara'
// (a piece of one of your models, by its name or the name of a group it is in: a model with two
// materials comes as a group of two meshes, and the name is the group's)
const within = (o, rx) => {
    for (let n = o; n; n = n.parent) if (n.name && rx.test(n.name)) return true
    return false
}
function fixUserLamps(root) {
    root.updateMatrixWorld(true)
    const isHead = (m) => m.material?.color?.getHexString() === lampHeadMat.color.getHexString() || /light|lampara/i.test(m.material?.name ?? '')
    const heads = []
    root.traverse((o) => o.isMesh && within(o, /^postes_de_luz/) && isHead(o) && heads.push(o))
    for (const h of heads) if (!h.name.endsWith(LAMP_TAG)) h.name += LAMP_TAG
    return heads.flatMap((h) => bulbsOf(h.geometry, h.matrixWorld))
}
let glowTex = null
function glowTexture() {
    if (glowTex) return glowTex
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    r.addColorStop(0, 'rgba(255,255,255,1)')
    r.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r
    g.fillRect(0, 0, 128, 128)
    glowTex = new THREE.CanvasTexture(c)
    return glowTex
}
const poolMat = new THREE.MeshBasicMaterial({ color: '#FFC977', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
const haloMat = new THREE.SpriteMaterial({ color: '#FFE2A8', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
const flatPlane = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
const dummy = new THREE.Object3D()
function LampGlow({ ready }) {
    const pools = useRef()
    const heads = useMemo(() => {
        // (not the lamps standing at the ends of the footbridges: their light fell on the deck and,
        // seen from above, looked like stray balls of light over the bridge)
        const overBridge = (h) => FOOTBRIDGES.some((b) => Math.abs(h.x - b) < 0.55 && Math.abs(h.z - riverZ(h.x)) < 2.3)
        if (LAMP_HEADS.length) return LAMP_HEADS.filter((h) => !overBridge(h))
        return STREET_LAMPS.map((l) => new THREE.Vector3(l.x, TOP + LAMP_H * 0.95, l.z)).filter((h) => !overBridge(h))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready])
    useLayoutEffect(() => {
        poolMat.map = haloMat.map = glowTexture()
        heads.forEach((h, i) => {
            dummy.position.set(h.x, TOP + 0.016, h.z)
            dummy.rotation.set(0, 0, 0)
            dummy.scale.set(0.95, 1, 0.95) // (one pool under each lamp of the post)
            dummy.updateMatrix()
            pools.current?.setMatrixAt(i, dummy.matrix)
        })
        const m = pools.current
        if (m) (m.count = heads.length), (m.instanceMatrix.needsUpdate = true), m.computeBoundingSphere()
    }, [heads])
    const root = useRef()
    useFrame(() => {
        const n = THREE.MathUtils.smoothstep(skyState.night, 0.2, 0.75)
        poolMat.opacity = n * 0.55
        haloMat.opacity = n * 0.85
        if (root.current) root.current.visible = n > 0.01
    })
    if (!heads.length) return null
    return (
        <group ref={root} name="postes_luz_de_noche">
            <instancedMesh ref={pools} args={[flatPlane, poolMat, heads.length]} renderOrder={2} />
            {/* (the halo: a soft glow around each lamp, always facing you) */}
            {heads.map((h, i) => (
                <sprite key={i} position={h} scale={0.2} material={haloMat} renderOrder={3} />
            ))}
        </group>
    )
}

/** The street lamps (Assets/modelos/postes.glb): their arms across the street, their lamps light up at night. */
const LAMP_H = 0.56 // (lower than the traffic lights, 0.72)
function IslandLamps() {
    const { scene } = useGLTF('models/postes.glb')
    const parts = useMemo(() => poleModel(scene, { swap: (orig, clay) => (/light/i.test(orig?.name ?? '') ? lampHeadMat : clay) }).parts, [scene])
    const place = useCallback((l, d) => (d.position.set(l.x, TOP, l.z), d.rotation.set(0, yawAt(l.x), 0), d.scale.setScalar(LAMP_H)), [])
    return <ModelInstances parts={parts} items={STREET_LAMPS} place={place} name="postes_de_luz" />
}
useGLTF.preload('models/postes.glb')

/**
 * The generic buildings (Assets/modelos/edificio_bajo / _medio / _alto): each one fills its lot
 * (its footprint) and is as tall as its model says (a little more or less), in its own colour,
 * facing its street.
 */
const BUILDING_MODELS = { bajo: 'models/edificio_bajo.glb', medio: 'models/edificio_medio.glb', alto: 'models/edificio_alto.glb' }
function CityModel({ kind, items }) {
    const { scene } = useGLTF(BUILDING_MODELS[kind])
    const model = useMemo(() => buildingModelOf(scene), [scene])
    const place = useCallback((b, d) => {
        d.position.set(...b.p)
        d.rotation.set(0, b.r[1] + b.turn, 0)
        // (footprint of the lot; the height of the model at that width)
        d.scale.set(b.w / model.size.x, b.w * (model.size.y / model.size.x) * b.h, b.d / model.size.z)
    }, [model])
    const tint = useCallback((b) => b.c, [])
    const tintable = useCallback((p) => !p.mat.userData.windows, []) // (the windows stay dark)
    return <ModelInstances parts={model.parts} items={items} place={place} tint={tint} tintable={tintable} name={`edificios_modelo_${kind}`} />
}
Object.values(BUILDING_MODELS).forEach((u) => useGLTF.preload(u))
const buildingModels = new WeakMap() // (one per model, shared: the city and the Alumbrado)
const buildingModelOf = (scene) => (buildingModels.has(scene) || buildingModels.set(scene, buildingModel(scene)), buildingModels.get(scene))
/**
 * Every building of the city as a box: { x, z, yaw, w, d, h } — where it stands, which way, its
 * footprint and how tall it really is (a model building, as tall as its model makes it). The
 * Alumbrado hangs its lights on them.
 */
export function useBuildingBoxes() {
    if (USER_BOXES.length) return USER_BOXES_TOP // (yours: as tall as you left them) // eslint-disable-line react-hooks/rules-of-hooks
    const sizes = Object.fromEntries(Object.entries(BUILDING_MODELS).map(([k, u]) => [k, buildingModelOf(useGLTF(u).scene).size])) // eslint-disable-line react-hooks/rules-of-hooks
    return useMemo(() => Object.entries(CITY.buildings).flatMap(([kind, list]) => list.map((b) => {
        const v = VARIANTS[kind], m = b.model && sizes[b.model]
        return m
            ? { x: b.p[0], z: b.p[2], yaw: b.r[1] + (b.turn ?? 0), w: b.w, d: b.d, h: b.w * (m.y / m.x) * b.h * m.y, kind } // (its scale × its height: <CityModel />)
            : { x: b.p[0], z: b.p[2], yaw: b.r[1], w: v.w * b.s[0], d: v.d * b.s[2], h: v.h * b.s[1], kind }
    })), [sizes.bajo, sizes.medio, sizes.alto]) // eslint-disable-line react-hooks/exhaustive-deps
}
/**
 * A building model made to fill a lot: centred, base on the ground, its windows (the faces painted
 * "ventanas" when it was prepared) looking to +z. → { parts, size } (size: its box, in its units)
 */
function buildingModel(scene) {
    const { parts } = unitModel(scene, { speckleScale: 10, swap: (orig, clay) => (/ventanas/.test(orig?.name ?? '') ? Object.assign(clay, { userData: { ...clay.userData, windows: true } }) : clay) })
    // which way the windows look (the facade): the mean normal of the window faces
    const n = new THREE.Vector3(), v = new THREE.Vector3()
    for (const p of parts) if (p.mat.userData.windows) {
        const a = p.geo.attributes.normal
        for (let i = 0; i < a.count; i++) n.add(v.fromBufferAttribute(a, i))
    }
    n.y = 0
    const turn = n.lengthSq() > 1e-6 ? Math.atan2(n.x, n.z) : 0
    const r = new THREE.Matrix4().makeRotationY(-turn)
    for (const p of parts) p.geo.applyMatrix4(r)
    const box = new THREE.Box3()
    for (const p of parts) (p.geo.computeBoundingBox(), box.union(p.geo.boundingBox))
    const c = box.getCenter(new THREE.Vector3())
    for (const p of parts) p.geo.translate(-c.x, -box.min.y, -c.z)
    return { parts, size: box.getSize(new THREE.Vector3()) }
}

/**
 * Your buildings, as you arranged them in Assets/modelos/isla_edificios.glb (scripts/sync-assets.mjs
 * → public/models/isla_edificios.glb): each one where you left it, as big as you left it, in Chonti's
 * clay. (The places, the landmarks and the route houses are drawn by the page itself — they move,
 * turn and grow like you did to them in that file —, so their markers and their animations go with
 * them.)
 */
/**
 * Your terrain, as you made it in Assets/modelos/isla_terreno.glb (scripts/sync-assets.mjs →
 * public/models/isla_terreno.glb): its ground — cliff, lawn, streets, walks, zebras, the Bulevar,
 * the ciclorruta, the tunnel, the walls of the river, the bridges — in Chonti's clay. What moves or
 * lights up (the water, the trees, the lamps, the furniture…) the page draws itself, over it.
 */
export const USER_TERRAIN = ISLAND_NAME !== 'clasica' && (TERRENO.items ?? []).length > 0
// (your whole island as it is in its file — WholeIsland)
export const WHOLE_ISLAND = USER_ISLAND && MODELOS.models.includes('isla_bulevar-completa')
const WHOLE_URL = 'models/isla_bulevar-completa.glb'
function UserTerrain() {
    const { scene } = useGLTF('models/isla_terreno.glb')
    const ground = useMemo(() => {
        scene.updateMatrixWorld(true)
        const copy = scene.clone(true)
        // (a model of yours with two materials comes as a group of meshes named after its mesh, not after
        // the piece: each mesh takes the name of its piece — trees, lamps, shadows go by that name)
        const PIECE = /^(arboles|palmeras|postes_de_luz|semaforos|bancas|bulevar_|rio_piedras)/
        copy.traverse((o) => {
            if (!o.isMesh || PIECE.test(o.name)) return
            for (let n = o.parent; n; n = n.parent) if (n.name && PIECE.test(n.name)) return void (o.name = `${n.name}_${o.name}`)
        })
        // (the file brings no normals: flat faces — the ground is flat, the walls are walls; the trees
        // of your island, soft and round like Chonti's clay — with flat faces they looked like boxes —,
        // not the fronds of the palms: smoothed, they came out dark)
        copy.traverse((o) => {
            if (!o.isMesh) return
            if (USER_ISLAND && /^arboles_/.test(o.name)) {
                const s = o.geometry.clone()
                s.deleteAttribute('normal')
                const m = mergeVertices(s, 1e-4)
                m.computeVertexNormals()
                o.geometry = m.toNonIndexed()
                return
            }
            // (soft over the gentle slopes — a ramp made of long thin triangles came out in stripes, each
            // lit its own way —, sharp at the real edges: curbs, walls)
            // (the streets: up to 75° — the steep side of a ramp is a fan of thin triangles, smoothed into one)
            const g = toCreasedNormals(o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(), /^(calle|Plane)/.test(o.name) ? (Math.PI * 5) / 12 : Math.PI / 6)
            // (the floor of the streets lit evenly, as if flat: the ramps into the tunnel are fans of thin
            // triangles lying over each other, each tilted its own way — lit each its way, they flickered
            // in long lines)
            if (/^(calle|Plane)/.test(o.name)) {
                const nn = g.attributes.normal
                for (let i = 0; i < nn.count; i++) if (nn.getY(i) > 0.7) nn.setXYZ(i, 0, 1, 0)
                nn.needsUpdate = true
            }
            // (your cross streets — Plane — lie on the streets, at their very height: the two
            // flickered in stripes; it goes 2 mm under them)
            if (/^Plane/.test(o.name)) g.translate(0, -0.002, 0)
            o.geometry = g
        })
        // (its street lamps: every pole with its lamp, no lamp without a pole — and where each bulb
        // is, for its light at night, LampGlow)
        if (USER_ISLAND) LAMP_HEADS.splice(0, LAMP_HEADS.length, ...fixUserLamps(copy))
        // (the lenses of its traffic lights: which one is red, amber or green — by the colour each
        // one glows in the file — so they change with the traffic, Traffic.jsx)
        const lensKind = new Map()
        copy.traverse((o) => {
            if (!o.isMesh || !/^semaforos_luces/.test(o.name)) return
            const e = o.material?.emissive
            if (!e) return
            lensKind.set(o.name, e.g > e.r ? 'green' : e.r > 0.5 ? 'red' : 'amber')
        })
        // (its clay with coarser pores: as fine as on a building, over a whole street seen from the side
        // they ran together into lines)
        const clay = clayed(copy, { speckleScale: 2.5, fixed: true })
        clay.traverse((o) => o.isMesh && (o.castShadow = /muro|acantilado|tunel|pasarela|cesped_003\.001|Cubo|baranda/.test(o.name)))
        // (the paving — the Bulevar, the ciclorruta, the paths, the floor of the Gato —: its stones laid
        // again over the ground as it is now, the same size everywhere; moved in Blender, they came
        // out stretched into long stripes)
        clay.traverse((o) => {
            const m = Array.isArray(o.material) ? o.material[0] : o.material
            if (o.isMesh && m?.map) pavingUVs(o.geometry, /gato/i.test(o.name) ? GATO_TILE : PAVING_TILE)
        })
        // (the streets and walks are long thin triangles meeting edge to edge: hair-thin cracks open
        // between them and the dark below showed through, in long stripes — a copy of each, 3 mm
        // under it and of its colour, closes them)
        const backs = []
        clay.traverse((o) => {
            if (!o.isMesh || !/^(calle|Plane|anden|cuadras|bulevar_peatonal|bulevar_corredor|ciclorruta_\d|retreta|suelo_gato)/.test(o.name)) return
            const b = new THREE.Mesh(o.geometry.clone().translate(0, -0.003, 0), o.material)
            b.name = `${o.name}_fondo`
            b.receiveShadow = true
            backs.push([o.parent, b])
        })
        for (const [p, b] of backs) p.add(b)
        // (the steep faces inside a street — the sides of its ramps — drawn behind its floor where they
        // touch it: their top edges showed through it in long lines)
        const steep = []
        clay.traverse((o) => {
            if (!o.isMesh || !/^(calle|Plane)/.test(o.name) || /_fondo$/.test(o.name)) return
            const g = o.geometry, p = g.attributes.position, n = g.attributes.normal
            const keep = [], side = []
            for (let t = 0; t < p.count / 3; t++) (Math.abs(n.getY(t * 3)) < 0.5 ? side : keep).push(t)
            if (!side.length) return
            const make = (list) => {
                const pos = new Float32Array(list.length * 9), nor = new Float32Array(list.length * 9)
                list.forEach((t, j) => {
                    for (let k = 0; k < 3; k++) {
                        pos.set([p.getX(t * 3 + k), p.getY(t * 3 + k), p.getZ(t * 3 + k)], j * 9 + k * 3)
                        nor.set([n.getX(t * 3 + k), n.getY(t * 3 + k), n.getZ(t * 3 + k)], j * 9 + k * 3)
                    }
                })
                const out = new THREE.BufferGeometry()
                out.setAttribute('position', new THREE.BufferAttribute(pos, 3))
                out.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
                return out
            }
            o.geometry = make(keep)
            const back = Object.assign(o.material.clone(), { polygonOffset: true, polygonOffsetFactor: 4, polygonOffsetUnits: 8 })
            const m = new THREE.Mesh(make(side), back)
            m.name = `${o.name}_lados`
            m.receiveShadow = true
            steep.push([o.parent, m])
        })
        for (const [p, m] of steep) p.add(m)
        if (!USER_ISLAND) return clay
        // Your island as you arranged it: its trees, lamps, benches… cast their shadows too; the heads
        // of its lamps light up at night; and its pieces of one colour go together into one (the same
        // shapes, where they are — lighter for the page: some 750 pieces, drawn one by one, slowed it)
        const lampHead = lampHeadMat.color.getHexString()
        const byMat = new Map()
        clay.traverse((o) => {
            if (!o.isMesh || Array.isArray(o.material)) return
            if (o.name.endsWith(LAMP_TAG) || (within(o, /^postes_de_luz/) && o.material.color?.getHexString() === lampHead)) o.material = lampHeadMat
            if (lensKind.has(o.name)) o.material = LAMP_MATS.main[lensKind.get(o.name)]
            const shadow = o.castShadow || within(o, /^(arboles|palmeras|postes|semaforos|bancas|bulevar_|rio_piedras)/)
            // (the ground does not cast shadows on itself — it came out in stripes —: what casts and what
            // does not, apart, even of one colour)
            const k = o.material.uuid + (shadow ? '+' : '-')
            if (!byMat.has(k)) byMat.set(k, { mat: o.material, list: [], shadow })
            byMat.get(k).list.push(o)
        })
        const out = new THREE.Group()
        for (const { mat: m, list, shadow } of byMat.values()) {
            const keys = Object.keys(list[0].geometry.attributes).sort().join()
            const same = list.filter((o) => Object.keys(o.geometry.attributes).sort().join() === keys)
            const rest = list.filter((o) => !same.includes(o))
            const geo = same.length > 1 ? mergeGeometries(same.map((o) => o.geometry)) : same[0].geometry
            if (!geo) {
                for (const o of list) out.add(o)
                continue
            }
            const one = new THREE.Mesh(geo, m)
            one.name = same[0].name
            one.castShadow = shadow
            one.receiveShadow = true
            out.add(one)
            for (const o of rest) out.add(o)
        }
        return out
    }, [scene])
    return (
        <>
            <primitive object={ground} name="terreno_de_la_isla" />
            {/* (your lamps, found in the file just above: their light at night) */}
            {USER_ISLAND && <LampGlow ready={ground} />}
        </>
    )
}
if (USER_TERRAIN && !WHOLE_ISLAND) useGLTF.preload('models/isla_terreno.glb')

// (what the page draws itself: the places, the landmarks and the route houses that still are one — a
// cultural house of before that is no stop any more stays one of your buildings —, and the
// buildings a stop takes the place of: the corner of the empanadas of the Obelisco)
const DRAWN_BY_PAGE = USER_ISLAND
    ? new Set(USER_BUILDINGS.filter((it) => /^lugar_/.test(it.name) && PLACES.some((p) => `lugar_${p.id}` === it.name)).map((it) => it.name)) // (your island as you arranged it: everything as it is in it — the places too, drawn where they hop, Places.jsx)
    : new Set([
    ...USER_BUILDINGS.filter((it) => it.foot).map((it) => it.name).filter((n) =>
        /^lugar_/.test(n) ? PLACES.some((p) => `lugar_${p.id}` === n)
            : /^ruta_/.test(n) ? ALL_STOPS.some((s) => !s.landmark && `ruta_${s.id}` === n)
                : true),
    ...[...ALL_STOPS.map((s) => s.replaces), ...STOP_COPIES.map((s) => s.user)].filter(Boolean).flatMap((n) => [n, n.replace(/\./g, '')]), // (in the GLB its name loses the dots)
])
// (a cultural house of before: a building like yours in its lot — OLD_STOP_LOTS)
const OLD_LOTS = Object.fromEntries(OLD_STOP_LOTS.map((it) => [it.name.replace(/\./g, ''), it.box]))
/**
 * One of your buildings in Chonti's clay. (The file brings no normals: flat faces, like the page's
 * buildings.) Its windows and doors — the dark pieces on its walls — a hair in front of the wall:
 * lying on it, they flickered in stripes.
 */
// (a window with its light on at night: warm, brighter the darker it gets — Island's useFrame)
export const userWindowLit = new THREE.MeshStandardMaterial({ color: '#2F3B40', emissive: '#FFD58A', emissiveIntensity: 0, roughness: 0.6, side: THREE.DoubleSide }) // (both sides: some windows look inwards in the file)
// (a matte finish: no shine, no clearcoat — the information panels of the Gato's park)
const matteCache = new Map()
const matteOf = (m) => matteCache.get(m.color.getHex()) ?? matteCache.set(m.color.getHex(), new THREE.MeshStandardMaterial({ color: m.color.clone(), roughness: 1, metalness: 0, side: THREE.DoubleSide })).get(m.color.getHex())
// La Tertulia at night (UserPiece): only its windows lit, a little brighter than a home's — its walls
// and its plaza stay as they are (lit whole, the building glowed orange from end to end).
// (Only light: its shape is as it is in your island.)
const tertuliaWindowLit = Object.assign(userWindowLit.clone(), { emissive: new THREE.Color('#FFCF7A') })
function lightUpTertulia(clay) {
    clay.traverse((o) => {
        if (o.isMesh && o.material === userWindowLit) o.material = tertuliaWindowLit
    })
}
function clayBuilding(holder, { windows = true } = {}) {
    holder.traverse((o) => {
        if (!o.isMesh) return
        const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()
        g.computeVertexNormals()
        o.geometry = g
    })
    const clay = clayed(holder, { speckleScale: 10, fixed: true })
    // (a place with no windows — the Gato's park —: its dark pieces are signs, matte, never lit)
    if (!windows) {
        clay.traverse((o) => {
            if (!o.isMesh || Array.isArray(o.material) || !o.material.color) return
            const c = o.material.color
            if (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b <= 0.12) o.material = matteOf(o.material)
        })
        return clay
    }
    const dark = []
    clay.traverse((o) => {
        if (!o.isMesh || Array.isArray(o.material) || !o.material.color) return
        const c = o.material.color
        if (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b <= 0.12) dark.push(o)
    })
    const floorY = new THREE.Box3().setFromObject(clay).min.y // (the ground the building stands on)
    for (const o of dark) {
        // (its windows and doors a hair out of the wall — 4 mm, you set them where they go —: lying
        // exactly on it, they flickered in stripes)
        const g = o.geometry, p = g.attributes.position, n = g.attributes.normal
        const lit = [], off = []
        // (each window on its own: its triangles together — by the corners they share)
        const key = (i) => `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`
        const parent = Array.from({ length: p.count / 3 }, (_, i) => i)
        const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
        const owner = new Map()
        for (let i = 0; i < p.count; i++) {
            const k = key(i), t = Math.floor(i / 3)
            if (owner.has(k)) parent[find(t)] = find(owner.get(k))
            else owner.set(k, t)
        }
        const groups = new Map()
        for (let t = 0; t < p.count / 3; t++) {
            const r = find(t)
            if (!groups.has(r)) groups.set(r, [])
            groups.get(r).push(t)
        }
        const v = new THREE.Vector3(), nn = new THREE.Vector3()
        for (const tris of groups.values()) {
            const box = new THREE.Box3()
            let wall = 0
            for (const t of tris) for (let k = 0; k < 3; k++) {
                box.expandByPoint(v.fromBufferAttribute(p, t * 3 + k))
                if (Math.abs(nn.fromBufferAttribute(n, t * 3 + k).y) < 0.5) wall++
            }
            const size = box.getSize(v)
            const isWall = wall > tris.length * 1.5 // (on a wall, not a dark roof)
            // (at night most windows have their light on: only the small panes set into the wall —
            // not a big dark glass front, which is part of the building —, and not the doors: what
            // stands on the ground)
            const c = box.getCenter(new THREE.Vector3())
            const door = box.min.y < floorY + 0.03
            const on = isWall && !door && Math.max(size.x, size.y, size.z) < 0.3 && hash01(c.x * 7.1 + c.y * 3.3, c.z * 5.7) < 0.92
            ;(on ? lit : off).push(...tris.map((t) => [t, isWall]))
        }
        // (out of the building, whichever way its faces look: some windows of the file face inwards)
        const mid = new THREE.Box3().setFromObject(clay).getCenter(new THREE.Vector3())
        const out = new THREE.Vector3()
        const build = (list) => {
            const pos = new Float32Array(list.length * 9), nor = new Float32Array(list.length * 9)
            list.forEach(([t, isWall], j) => {
                for (let k = 0; k < 3; k++) {
                    nn.fromBufferAttribute(n, t * 3 + k)
                    v.fromBufferAttribute(p, t * 3 + k)
                    if (isWall) {
                        out.set(nn.x, 0, nn.z)
                        const toward = (v.x - mid.x) * out.x + (v.z - mid.z) * out.z
                        v.addScaledVector(out.normalize(), toward < 0 ? -0.004 : 0.004)
                    }
                    pos.set([v.x, v.y, v.z], j * 9 + k * 3)
                    nor.set([nn.x, nn.y, nn.z], j * 9 + k * 3)
                }
            })
            const g2 = new THREE.BufferGeometry()
            g2.setAttribute('position', new THREE.BufferAttribute(pos, 3))
            g2.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
            return g2
        }
        o.geometry = build(off)
        o.receiveShadow = false // (dark glass: no shadow acne on it)
        if (lit.length) {
            const m = new THREE.Mesh(build(lit), userWindowLit)
            m.name = `${o.name}_luz`
            o.parent.add(m)
        }
    }
    return clay
}
/**
 * La Ermita like the photo: white with a touch of blue, its trims whiter, its roofs slate blue and its
 * doors gold (its shape as it is in your island).
 */
const ERMITA_COLORS = { bccfe0: '#EAF1F8', f5f4ef: '#FCFDFE', '737d86': '#6E87A6', d3dee8: '#D3DEEA', c9a04a: '#C9A24A' }
function paintErmita(clay) {
    const byColor = new Map()
    clay.traverse((o) => {
        if (!o.isMesh || Array.isArray(o.material) || !o.material.color) return
        const to = ERMITA_COLORS[o.material.color.getHexString()]
        if (!to) return
        const k = o.material.uuid
        if (!byColor.has(k)) byColor.set(k, Object.assign(o.material.clone(), { color: new THREE.Color(to) }))
        o.material = byColor.get(k)
    })
}/** A building of your island (a place: it hops and grows when you choose it — Places.jsx), where it stands. */
/**
 * Your whole island as it is in Assets/modelos/isla_bulevar-completa.glb (copied as it is to
 * public/models — scripts/sync-assets.mjs): RULE — nothing of its shape is changed: not a vertex, a
 * normal or a texture coordinate, and every piece keeps its colour (in Chonti's clay finish —
 * clayOfFile). The page only adds light: at night the windows of the
 * buildings, the lamps and the traffic lights light up (a lit copy of their material on those pieces),
 * and the panels of the Gato stay matte. Not drawn with it: the places (drawn where they hop and grow,
 * Places.jsx · UserPiece) and its water (the page's flows in the same place).
 */
/**
 * Chonti's clay on every piece of your island: the same soft matte finish, velvety sheen and warm
 * rim as him — each piece in ITS colour (and its picture, if it has one). Smooth: no pores and no
 * dimples (on a whole island they read as a texture); and not one polygon more — the faces are the
 * ones of the file.
 */
const fileClay = new Map()
function clayOfFile(m) {
    if (!m || m.transparent || !m.isMeshStandardMaterial) return m
    if (!fileClay.has(m.uuid)) {
        const clay = clayMaterial({ color: m.color.clone(), map: m.map ?? null, vertexColors: !!m.vertexColors, speckle: 0, bump: 0, rim: 0.14, rimColor: '#FFE3C8', warmth: 0.02, sheen: 0.18, sheenColor: '#FFF1E2' })
        clay.side = m.side
        clay.name = m.name
        fileClay.set(m.uuid, clay)
    }
    return fileClay.get(m.uuid)
}
const BUILDING_GROUPS = /^(edificios|lugares_e_hitos|casas_de_las_rutas)$/
const luma = (c) => (c ? 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b : 1)
// (its window glass with the light on: a lit copy of your material — its colour stays, it glows)
const LIT_WINDOWS = []
const litCache = new Map()
function litWindow(m, glow = '#FFD58A') {
    const key = m.uuid + glow
    if (!litCache.has(key)) {
        const lit = m.clone()
        lit.emissive = new THREE.Color(glow)
        lit.emissiveIntensity = 0
        litCache.set(key, lit)
        LIT_WINDOWS.push(lit)
    }
    return litCache.get(key)
}
const inBuilding = (o) => {
    for (let n = o.parent; n; n = n.parent) if (BUILDING_GROUPS.test(n.name)) return true
    return false
}
// (the building a piece belongs to: the child of its group — for the ground it stands on)
const buildingOf = (o) => {
    let b = o
    while (b.parent && !BUILDING_GROUPS.test(b.parent.name)) b = b.parent
    return b.parent ? b : null
}
/**
 * At night only the panes set into the walls light up — what you see through the window holes —,
 * never a dark roof, a whole dark glass front, a sign or a door. The dark piece is read as it is:
 * its triangles, by the corners they share, make each pane; a pane is lit when it stands on a wall,
 * is small (a window, not a facade) and doesn't touch the ground (a door). RULE kept: no vertex of
 * the file moves — the lit panes are drawn by a second mesh that shares its vertices, the rest by the
 * piece itself (only which triangles each draws changes).
 */
const PANE_MAX = 0.45 // (the biggest a window is, in the island's units: a whole facade is bigger)
function lightPanes(o, lit, floorY) {
    const g = o.geometry, p = g.attributes.position
    const index = g.index ? g.index.array : Array.from({ length: p.count }, (_, i) => i)
    const tris = index.length / 3
    const key = (i) => `${p.getX(i).toFixed(4)},${p.getY(i).toFixed(4)},${p.getZ(i).toFixed(4)}`
    const parent = Array.from({ length: tris }, (_, i) => i)
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
    const owner = new Map()
    for (let t = 0; t < tris; t++) for (let k = 0; k < 3; k++) {
        const c = key(index[t * 3 + k])
        if (owner.has(c)) parent[find(t)] = find(owner.get(c))
        else owner.set(c, t)
    }
    const panes = new Map()
    for (let t = 0; t < tris; t++) {
        const r = find(t)
        if (!panes.has(r)) panes.set(r, [])
        panes.get(r).push(t)
    }
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), box = new THREE.Box3(), size = new THREE.Vector3()
    const on = [], off = []
    for (const list of panes.values()) {
        box.makeEmpty()
        let wall = 0, all = 0
        for (const t of list) {
            a.fromBufferAttribute(p, index[t * 3]).applyMatrix4(o.matrixWorld)
            b.fromBufferAttribute(p, index[t * 3 + 1]).applyMatrix4(o.matrixWorld)
            c.fromBufferAttribute(p, index[t * 3 + 2]).applyMatrix4(o.matrixWorld)
            box.expandByPoint(a).expandByPoint(b).expandByPoint(c)
            const n = b.sub(a).cross(c.sub(a)), area = n.length()
            if (!area) continue
            all += area
            if (Math.abs(n.y) / area < 0.3) wall += area
        }
        box.getSize(size)
        const pane = all > 0 && wall > all * 0.9 && Math.max(size.x, size.y, size.z) < PANE_MAX && box.min.y > floorY + 0.03
        ;(pane ? on : off).push(...list)
    }
    if (!on.length) return
    if (!off.length) return void (o.material = lit)
    const drawing = (list) => {
        const part = new THREE.BufferGeometry()
        for (const name in g.attributes) part.setAttribute(name, g.attributes[name])
        part.setIndex(list.flatMap((t) => [index[t * 3], index[t * 3 + 1], index[t * 3 + 2]]))
        return part
    }
    o.geometry = drawing(off)
    const glass = new THREE.Mesh(drawing(on), lit)
    glass.name = `${o.name}_luz`
    glass.receiveShadow = true
    o.add(glass)
}
const flat = (o) => {
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox()
    const b = o.geometry.boundingBox
    return (b.max.y - b.min.y) * o.getWorldScale(new THREE.Vector3()).y < 0.02
}
function WholeIsland() {
    const { scene } = useGLTF(WHOLE_URL)
    const island = useMemo(() => {
        const copy = scene.clone(true) // (its meshes and materials shared with the file: none is changed)
        copy.updateMatrixWorld(true)
        const out = []
        copy.traverse((o) => (DRAWN_BY_PAGE.has(o.name) || /^rio_agua/.test(o.name)) && out.push(o))
        // (a tree crown left off the island in the file — arboles_copas_037_malla.002, past the east
        // edge, with no trunk —: it hung in the air beside the island; any crown off the ground goes)
        const ground = new THREE.Box3().setFromObject(copy.getObjectByName('terreno') ?? copy)
        const mid = new THREE.Vector3()
        copy.getObjectByName('arboles')?.traverse((o) => {
            if (!o.isMesh) return
            new THREE.Box3().setFromObject(o).getCenter(mid)
            if (mid.x < ground.min.x || mid.x > ground.max.x || mid.z < ground.min.z || mid.z > ground.max.z) out.push(o)
        })
        out.forEach((o) => o.removeFromParent())
        LAMP_HEADS.splice(0, LAMP_HEADS.length, ...fixUserLamps(copy))
        const windows = []
        copy.traverse((o) => {
            if (!o.isMesh) return
            // (the ground casts no shadow on itself — it came out in stripes —; everything standing does)
            o.castShadow = !flat(o)
            o.receiveShadow = true
            if (Array.isArray(o.material)) return
            const m = o.material
            if (o.name.endsWith(LAMP_TAG)) o.material = lampHeadMat
            else if (within(o, /^semaforos_luces/) && m.emissive) o.material = LAMP_MATS.main[m.emissive.g > m.emissive.r ? 'green' : m.emissive.r > 0.5 ? 'red' : 'amber']
            else {
                o.material = clayOfFile(m)
                if (inBuilding(o) && luma(m.color) <= 0.12) windows.push([o, m])
            }
        })
        // (its windows: only the panes in the walls — lightPanes; after the walk, it adds meshes)
        const floors = new Map()
        for (const [o, m] of windows) {
            const b = buildingOf(o)
            if (!floors.has(b)) floors.set(b, new THREE.Box3().setFromObject(b).min.y)
            lightPanes(o, litWindow(m), floors.get(b))
        }
        return copy
    }, [scene])
    return (
        <>
            <primitive object={island} name="isla_completa" />
            <LampGlow ready={island} />
        </>
    )
}
if (WHOLE_ISLAND) useGLTF.preload(WHOLE_URL)

/** A place of your whole island, as it is in it (only light added: the panes of its windows at night). */
function wholePiece(scene, name) {
    scene.updateMatrixWorld(true)
    const root = scene.getObjectByName(name.replace(/\./g, ''))
    if (!root) return null
    const copy = root.clone(true)
    const gato = /^lugar_gato/.test(name), tertulia = /^lugar_tertulia/.test(name)
    const holder = new THREE.Group()
    copy.position.set(0, 0, 0), copy.quaternion.identity(), copy.scale.set(1, 1, 1)
    holder.add(copy)
    holder.updateMatrixWorld(true)
    const floorY = new THREE.Box3().setFromObject(copy).min.y
    const windows = []
    copy.traverse((o) => {
        if (!o.isMesh || Array.isArray(o.material)) return
        o.castShadow = !flat(o)
        o.receiveShadow = true
        const m = o.material
        // (Chonti's clay, in its colour — clayOfFile; its glass lit at night)
        o.material = clayOfFile(m)
        if (luma(m.color) > 0.12) return
        if (gato) o.material = matteOf(m)
        else windows.push([o, m])
    })
    // (only the panes in its walls: not its dark roofs, signs or doors — lightPanes)
    for (const [o, m] of windows) lightPanes(o, tertulia ? tertuliaWindowLit : litWindow(m), floorY)
    root.matrixWorld.decompose(holder.position, holder.quaternion, holder.scale)
    return holder
}

export function UserPiece({ name }) {
    return WHOLE_ISLAND ? <WholePiece name={name} /> : <PreparedPiece name={name} />
}
function WholePiece({ name }) {
    const { scene } = useGLTF(WHOLE_URL)
    const object = useMemo(() => wholePiece(scene, name), [scene, name])
    return object ? <primitive object={object} /> : null
}
function PreparedPiece({ name }) {
    const { scene } = useGLTF('models/isla_edificios.glb')
    const object = useMemo(() => {
        scene.updateMatrixWorld(true)
        const root = scene.children.find((r) => r.name === name.replace(/\./g, ''))
        if (!root) return null
        const holder = new THREE.Group()
        const copy = root.clone(true)
        copy.position.set(0, 0, 0), copy.quaternion.identity(), copy.scale.set(1, 1, 1)
        holder.add(copy)
        const clay = clayBuilding(holder, { windows: !/^lugar_gato/.test(name) })
        if (/^lugar_tertulia/.test(name)) {
            clay.traverse((o) => o.isMesh && o.geometry.computeBoundingBox())
            lightUpTertulia(clay)
        }
        // (the Gato: its own flat floor lay on the stone floor of the island, at its very height — the
        // two flickered —; it goes 1 cm under it, and the stones show)
        if (/^lugar_gato/.test(name)) clay.traverse((o) => {
            if (!o.isMesh) return
            o.geometry.computeBoundingBox()
            const b = o.geometry.boundingBox
            // (and its grey base slab, 4 cm thick: its top lay exactly at the height of the island's
            // stone floor and the two flickered — it goes a little lower too)
            if (b.max.y - b.min.y < 0.05 && b.min.y < 0.05) o.geometry.translate(0, -0.012, 0)
        })
        root.matrixWorld.decompose(clay.position, clay.quaternion, clay.scale)
        return clay
    }, [scene, name])
    return object ? <primitive object={object} /> : null
}
function UserBuildings() {
    const { scene } = useGLTF('models/isla_edificios.glb')
    const buildings = useMemo(() => {
        scene.updateMatrixWorld(true)
        // (the building of yours nearest to the lot, on its bank: its looks, and facing the way it faces)
        const v = new THREE.Vector3()
        const templateFor = (lot) => scene.children.filter((r) => /^edificios_modelo_(bajo|medio)/.test(r.name) && (r.getWorldPosition(v).z > riverZ(v.x)) === (lot.z > riverZ(lot.x)))
            .sort((a, b) => a.getWorldPosition(v).distanceTo(new THREE.Vector3(lot.x, v.y, lot.z)) - b.getWorldPosition(v).distanceTo(new THREE.Vector3(lot.x, v.y, lot.z)))[0]
        return scene.children
            .filter((root) => !DRAWN_BY_PAGE.has(root.name))
            .map((root) => {
                // (one building: baked into its own frame, then put back where it stands)
                const holder = new THREE.Group()
                const lot = OLD_LOTS[root.name]
                const template = lot && templateFor(lot)
                const copy = (template ?? root).clone(true)
                copy.position.set(0, 0, 0), copy.quaternion.identity(), copy.scale.set(1, 1, 1)
                if (template) {
                    // (as big as the lot, standing in the middle of it)
                    const box = new THREE.Box3().setFromObject(copy), size = box.getSize(new THREE.Vector3())
                    const s = Math.min(lot.w / (size.x || 1), lot.d / (size.z || 1))
                    copy.scale.setScalar(s)
                    copy.position.set((-(box.min.x + box.max.x) / 2) * s, -box.min.y * s, (-(box.min.z + box.max.z) / 2) * s)
                }
                holder.add(copy)
                const clay = clayBuilding(holder)
                if (/^hito_la-ermita/.test(root.name)) paintErmita(clay)
                clay.name = root.name
                root.matrixWorld.decompose(clay.position, clay.quaternion, clay.scale)
                // (one made lower — island.json · buildingHeights —: squashed from its base)
                const k = BUILDING_HEIGHTS[root.name]
                if (k) {
                    const before = new THREE.Box3().setFromObject(clay).min.y
                    clay.scale.y *= k
                    clay.updateMatrixWorld(true)
                    clay.position.y += before - new THREE.Box3().setFromObject(clay).min.y
                }
                if (template) template.matrixWorld.decompose(v, clay.quaternion, new THREE.Vector3()), clay.scale.set(1, 1, 1), clay.position.set(lot.x, clay.position.y, lot.z)
                return clay
            })
    }, [scene])
    return (
        <group name="edificios_de_la_isla">
            {buildings.map((b) => <primitive key={b.uuid} object={b} />)}
        </group>
    )
}
if (USER_BUILDINGS.length && !WHOLE_ISLAND) useGLTF.preload('models/isla_edificios.glb')

/** The landmark buildings of island.json (the Banco de Bogotá, the Café Boulevard…), when their file is there. */
export const LANDMARKS = (ISLAND_VARIANT.landmarks ?? [])
    .filter((l) => MODELOS.models.includes(l.model))
    .map((l) => {
        const at = { ...l, x: l.along, z: riverZ(l.along) + l.across }
        // (as you left it in your buildings file: moved, turned, scaled)
        const mv = movedBy(`hito_${l.model}`, [at.x, at.z])
        return mv ? { ...at, x: mv.position[0], z: mv.position[1], size: l.size * mv.scale, turn: (l.turn ?? 0) + mv.turn } : at
    })
function Landmark({ l }) {
    const { scene } = useGLTF(`models/${l.model}.glb`)
    const parts = useMemo(() => unitModel(scene, { speckleScale: 10 }).parts, [scene])
    // (its front, +z of the model, like the places; `turn`: degrees more)
    const yaw = yawAt(l.x) + ((l.turn ?? 0) * Math.PI) / 180
    return (
        <group name={`hito_${l.model}`} position={[l.x, TOP, l.z]} rotation-y={yaw} scale={l.size}>
            {parts.map((p, i) => <mesh key={i} geometry={p.geo} material={p.mat} castShadow receiveShadow />)}
        </group>
    )
}

export default function Island() {
    const city = useCity()
    const streets = useStreets()
    useFrame(({ clock }) => {
        islandMaterials.river.userData.uniforms.uTime.value = clock.elapsedTime
        sway.uTime.value = clock.elapsedTime
        sway.uWind.value += (skyState.wind - sway.uWind.value) * 0.02
        lampHeadMat.emissiveIntensity = 0.08 + skyState.night * 2.4 // street lamps light up at night
        userWindowLit.emissiveIntensity = skyState.night * 1.9 // (the windows of your buildings with their lights on)
        for (const m of LIT_WINDOWS) m.emissiveIntensity = skyState.night * 1.9
        // La Tertulia at night: only its windows, a little brighter
        tertuliaWindowLit.emissiveIntensity = skyState.night * 3.4
    })
    const palmTrunks = useMemo(() => city.trunks.filter((t) => !t.model), [city])
    const cityModels = useMemo(() => {
        const out = Object.fromEntries(Object.keys(BUILDING_MODELS).map((k) => [k, []]))
        for (const list of Object.values(city.buildings)) for (const b of list) if (b.model) out[b.model].push(b)
        return out
    }, [city])

    const g = useMemo(() => {
        const ring = city.ring
        const variants = Object.fromEntries(Object.entries(VARIANTS).map(([k, v]) => [k, buildingGeometry(v.w, v.h, v.d, v.floors)]))
        return {
            cliff: cliffGeometry(ring),
            tips: stalactiteGeometry(),
            cap: capGeometry(ring),
            walls: channelWalls(),
            water: strip(-ZONES.channel, ZONES.channel, TOP - 0.2, 0.25, -RIVER_HALF_LENGTH, RIVER_HALF_LENGTH),
            // the pedestrian Bulevar and its ciclorruta only where they really are (island.json);
            // outside, the south bank is a green park with a sidewalk along the river
            // (narrow where it starts in the west, against its building: END_NARROW)
            promenadeFront: pavingUVs(strip(ZONES.promenadeFront[0], (x) => (x < PEDESTRIAN[0] + END_NARROW ? 2.62 : x < PEDESTRIAN[0] + END_NARROW + 0.2 ? 2.62 + ((x - PEDESTRIAN[0] - END_NARROW) / 0.2) * (ZONES.promenadeFront[1] - 2.62) : ZONES.promenadeFront[1]), TOP + 0.006, 0.05, Math.max(-L, PEDESTRIAN[0]), Math.min(L, PEDESTRIAN[1]))),
            bike: pavingUVs(strip(...ZONES.bikeLane, TOP + 0.009, 0.1, ...BIKE_X), BIKE_TILE),
            // (its white lines, one on each side)
            bikeLines: mergeGeometries([ZONES.bikeLane[0] + 0.015, ZONES.bikeLane[1] - 0.015].map((o) => strip(o - 0.012, o + 0.012, TOP + 0.011, 0.1, ...BIKE_X))),
            gatoFloor: gatoFloorGeometry(),
            // the Av. Colombia where it runs in the open (and down into the tunnel at both ends of the
            // Bulevar), with a sidewalk on its far side
            avColWest: SOUTH_ROAD ? strip(...SOUTH_ROAD.offsets, roadYAt, 0.1, -L, PEDESTRIAN[0], ROAD_RIM) : null,
            avColEast: SOUTH_ROAD ? strip(...SOUTH_ROAD.offsets, roadYAt, 0.1, PEDESTRIAN[1], L, ROAD_RIM) : null,
            avColWalkWest: SOUTH_ROAD ? strip(SOUTH_ROAD.offsets[1], SOUTH_ROAD.offsets[1] + 0.3, TOP + 0.008, 0.1, -L, (SOUTH_ROAD.tunnels[0]?.[0] ?? PEDESTRIAN[0]) + 0.1, ROAD_RIM) : null,
            tunnel: tunnelGeometry(),
            roadFront: strip(...ZONES.roadFront, TOP + 0.006, 0.1, CARRERA3[0], CARRERA3[1], ROAD_RIM),
            promenadeBack: strip(...ZONES.promenadeBack, TOP + 0.006, 0.1, -L, L, ROAD_RIM),
            // the second street of the north bank (behind the first block) and its sidewalk
            northStreet: NORTH_STREET ? strip(...NORTH_STREET.offsets, TOP + 0.006, 0.1, ...NORTH_STREET.x, ROAD_RIM) : null,
            northStreetWalk: NORTH_STREET ? strip(NORTH_STREET.offsets[1], NORTH_STREET.offsets[1] + 0.22, TOP + 0.008, 0.1, ...NORTH_STREET.x, ROAD_RIM) : null,
            blocks: blockPavement(),
            // the walk of the Bulevar goes on after its end, along the trench, up to the street by the Ermita
            corridor: CORRIDOR ? pavingUVs(strip(CORRIDOR.across[0], corridorEdge, TOP + 0.006, 0.05, ...CORRIDOR.x, ROAD_RIM)) : null,
            // the street by La Ermita (and its sidewalks)
            otherStreets: STREETS.length ? streetRibbons(0, 0.35, TOP + 0.009) : null,
            otherStreetsWalk: STREETS.length ? streetRibbons(0.35, 0.55, TOP + 0.008) : null,
            // (the Av. 1 Norte / 4 Oeste: it moves away from the river in the west — northShift)
            // (same real width all along, also where it turns: northRoad)
            roadBack: strip((x) => northRoad(x)[0], (x) => northRoad(x)[1], TOP + 0.006, 0.1, -AV1N_X, AV1N_TO, ROAD_RIM),
            sidewalkBack: strip((x) => northRoad(x)[0] - (ZONES.sidewalkBack[1] - ZONES.sidewalkBack[0]) * northRoad(x)[2], (x) => northRoad(x)[0], TOP + 0.008, 0.1, -L, Math.min(L, AV1N_TO), ROAD_RIM),
            // La Retreta: its paths of concrete and the circle of its kiosk
            retreta: retretaGeometry(),
            // and where it does, a sidewalk on its river side too (along the green strip)
            sidewalkNear: northShift(-L) < -0.2 ? strip((x) => northRoad(x)[1], (x) => northRoad(x)[1] + 0.26 * northRoad(x)[2], TOP + 0.008, 0.1, -L, (ISLAND_VARIANT.northShift?.x ?? 0) + (ISLAND_VARIANT.northShift?.blend ?? 0.6), ROAD_RIM) : null, // (all along the curve, until it is back by the river)
            variants,
        }
    }, [city])

    return (
        <group name="isla">
            {/* the ground: yours, as you made it (Assets/modelos/isla_terreno.glb) — or, without that
                file, the page's own; the water of the river is always the page's (it flows) */}
            {WHOLE_ISLAND ? (
                // (your whole island, exactly as it is in your file)
                <Suspense fallback={null}>
                    <WholeIsland />
                </Suspense>
            ) : USER_TERRAIN && (
                <Suspense fallback={null}>
                    <UserTerrain />
                </Suspense>
            )}
            <mesh name="rio_agua" geometry={g.water} material={islandMaterials.river} receiveShadow />
            {!USER_TERRAIN && (
            <>
            <mesh name="isla_acantilado" geometry={g.cliff} material={islandMaterials.cliff} castShadow receiveShadow />
            <mesh name="isla_rocas_colgantes" geometry={g.tips} material={islandMaterials.cliff} castShadow />
            <mesh name="isla_cesped" geometry={g.cap} material={islandMaterials.lawn} receiveShadow />
            <mesh name="rio_muros" geometry={g.walls} material={islandMaterials.stone} receiveShadow />
            <mesh name="bulevar_peatonal" geometry={g.promenadeFront} material={pavingMat} receiveShadow />
            {g.avColWest && <mesh name="calle_av_colombia_oeste" geometry={g.avColWest} material={islandMaterials.road} receiveShadow />}
            {g.avColEast && <mesh name="calle_av_colombia_este" geometry={g.avColEast} material={islandMaterials.road} receiveShadow />}
            {g.avColWalkWest && <mesh name="anden_av_colombia" geometry={g.avColWalkWest} material={islandMaterials.path} receiveShadow />}
            {g.tunnel && (
                <group name="tunel_mundialista">
                    <mesh name="tunel_muros" geometry={g.tunnel.walls} material={tunnelWallMat} receiveShadow />
                    <Instanced name="tunel_bocas" geometry={geo.box} material={tunnelMouthMat} items={g.tunnel.mouths} castShadow={false} />
                    <Instanced name="tunel_dinteles" geometry={geo.box} material={islandMaterials.path} items={g.tunnel.lintels} />
                    <Instanced name="tunel_barandas" geometry={geo.box} material={tunnelRailMat} items={g.tunnel.rails} />
                </group>
            )}
            <mesh name="anden_norte_rio" geometry={g.promenadeBack} material={islandMaterials.path} receiveShadow />
            <mesh name="ciclorruta" geometry={g.bike} material={bikeMat} receiveShadow />
            <mesh name="ciclorruta_lineas" geometry={g.bikeLines} material={mat('#F4F2EC')} receiveShadow />
            <Instanced name="ciclorruta_piramides" geometry={geo.pyramid} material={mat('#7A4528')} items={BIKE_BOLLARDS} castShadow={false} />
            <mesh name="calle_carrera3" geometry={g.roadFront} material={islandMaterials.road} receiveShadow />
            <mesh name="calle_av1norte" geometry={g.roadBack} material={islandMaterials.road} receiveShadow />
            {g.northStreet && <mesh name="calle_norte_2" geometry={g.northStreet} material={islandMaterials.road} receiveShadow />}
            {g.northStreetWalk && <mesh name="anden_calle_norte_2" geometry={g.northStreetWalk} material={islandMaterials.path} receiveShadow />}
            {g.corridor && <mesh name="bulevar_corredor_tunel" geometry={g.corridor} material={pavingMat} receiveShadow />}
            {g.otherStreets && <mesh name="calle_ermita" geometry={g.otherStreets} material={islandMaterials.road} receiveShadow />}
            {g.otherStreetsWalk && <mesh name="anden_calle_ermita" geometry={g.otherStreetsWalk} material={islandMaterials.path} receiveShadow />}
            <mesh name="anden_av1norte" geometry={g.sidewalkBack} material={islandMaterials.path} receiveShadow />
            {g.sidewalkNear && <mesh name="anden_av4oeste_rio" geometry={g.sidewalkNear} material={islandMaterials.path} receiveShadow />}
            <mesh name="calles_transversales" geometry={streets.roads} material={islandMaterials.road} receiveShadow />
            <Instanced name="cebras" geometry={geo.box} material={mat(PALETTE.crema)} items={streets.zebras} castShadow={false} />
            <Instanced name="lineas_de_calle" geometry={geo.box} material={mat(PALETTE.mango)} items={streets.dashes} castShadow={false} />
            </>
            )}
            {!USER_ISLAND && <Instanced name="rio_piedras" geometry={clumpGeometry} material={mat('#ffffff', { roughness: 0.9 })} items={ROCKS} />}

            {!USER_TERRAIN && <Instanced name="lotes" geometry={geo.box} material={islandMaterials.plot} items={city.plots} castShadow={false} />}
            {!USER_TERRAIN && <mesh name="cuadras_pavimento" geometry={g.blocks} material={blockMat} receiveShadow />}
            {/* the city: your buildings, as you arranged them (Assets/modelos/isla_edificios.glb) — or,
                without that file, the page's own (the colonial houses drawn here, the generic ones
                the models: <CityModel />) */}
            {WHOLE_ISLAND ? null : USER_BOXES.length ? (
                <Suspense fallback={null}>
                    <UserBuildings />
                </Suspense>
            ) : (
                <>
                    {Object.entries(city.buildings).map(([k, items]) => (
                        <Instanced key={k} name={`edificios_${k}`} geometry={g.variants[k]} material={islandMaterials.building} items={items.filter((b) => !b.model)} />
                    ))}
                    <Suspense fallback={null}>
                        {Object.keys(BUILDING_MODELS).map((k) => (
                            <CityModel key={k} kind={k} items={cityModels[k]} />
                        ))}
                    </Suspense>
                    <Instanced name="techos_de_teja" geometry={geo.hipRoof} material={islandMaterials.roof} items={city.roofs} />
                    <Instanced name="techos_planos" geometry={geo.box} material={islandMaterials.plot} items={city.slabs} />
                    <Instanced name="balcones" geometry={geo.box} material={islandMaterials.plot} items={city.balconies} />
                    <Instanced name="tanques_de_agua" geometry={geo.column} material={mat(shade(PALETTE.crema, 0.7))} items={city.tanks} />
                    <Instanced name="aires_acondicionados" geometry={geo.box} material={mat(shade(PALETTE.crema, 0.6))} items={city.units} />
                </>
            )}
            <Suspense fallback={null}>
                {!USER_ISLAND && LANDMARKS.map((l) => (
                    <Landmark key={l.model} l={l} />
                ))}
            </Suspense>
            <Instanced name="jardineras" geometry={geo.box} material={mat(shade(PALETTE.verde, 0.7))} items={city.beds} />
            <Instanced name="flores" geometry={clumpGeometry} material={crownMaterial} items={city.blooms} />
            <Instanced name="bancas" geometry={geo.box} material={mat('#B9865A')} items={city.benches} />
            <Instanced name="bulevar_jardineras_concreto" geometry={geo.box} material={mat(shade(PALETTE.crema, 0.78))} items={city.planters} />
            {!USER_TERRAIN && <Instanced name="bulevar_baranda_blanca" geometry={geo.box} material={mat('#F7F4EE')} items={city.railing} />}
            <Instanced name="bulevar_jardineras_largas" geometry={geo.box} material={mat('#4A2B1B')} items={city.cortens} />
            {!USER_ISLAND && BULEVAR_CENTER.modules.length > 0 && (
                <Suspense fallback={null}>
                    <BulevarModules />
                </Suspense>
            )}
            {!USER_TERRAIN && g.retreta && <mesh name="retreta_caminos" geometry={g.retreta} material={pavingMat} receiveShadow />}
            {!USER_TERRAIN && g.gatoFloor && <mesh name="suelo_gato_del_rio" geometry={g.gatoFloor} material={gatoFloorMat} receiveShadow />}

            {/* (the palms' trunks; the other trees are the model: <IslandTrees />) */}
            <Instanced name="arboles_troncos" geometry={trunkGeometry} material={barkMaterial} items={palmTrunks} />
            <Instanced name="arboles_copas" geometry={clumpGeometry} material={crownMaterial} items={city.crowns} />
            <Suspense fallback={null}>
                {/* (your island as you arranged it: its trees, benches and lamps are in its file) */}
                {!USER_ISLAND && (
                    <>
                        <IslandTrees trees={city.trees} palms={city.palms} />
                        <RiverBenches items={city.riverBenches} />
                        {HAS_SEATS && <CenterSeats />}
                        <IslandLamps />
                        <LampGlow ready />
                    </>
                )}
            </Suspense>
            {/* (your island as you arranged it: La Ermita and the landmarks are in it, as they are) */}
            {!USER_ISLAND && <Ermita />}
            {!USER_TERRAIN && <Bridges />}
            <Traffic />
        </group>
    )
}
