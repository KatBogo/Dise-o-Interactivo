import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { ISLAND_TOP } from '../../config.js'
import { PALETTE, mix, shade } from '../../theme.js'
import { ALL_STOPS, ROUTES, STOPS_BY_ID, STOP_COPIES, USER_BUILDINGS } from '../../data/content.js'
import { USER_GROUND, USER_ISLAND } from '../../data/userGround.js'
import { CROSS_STREETS, SOUTH_ROAD, ZONES, northShift, onSouthRoadX, riverZ } from '../../data/bulevarLayout.js'
import { useExperience } from '../../store/useExperience.js'
import Marker, { GLOW } from '../Marker.jsx'
import { STOP_HEIGHT, STOP_MODELS, SwappableModel } from '../places/PlaceModels.jsx'

// ── The route walks along the STREETS, never through a block ────────────────────
// Three lanes along the island (offsets from the river): the Av. 1 Norte (north bank), the
// pedestrian Bulevar (south bank, by the river) and the Carrera 3 (south bank, behind the first
// row). The river is crossed only on the bridges (Puente Ortiz + the two footbridges) and the south
// row of blocks only along the calles that cut it.
// (offsets as functions of x: the Av. 1 Norte moves away from the river in the west, and where the
// Av. Colombia runs in the open the south lane is its sidewalk)
const LANE = {
    N: (x) => -1.8 + northShift(x),
    // (on the Bulevar: beside its furniture in the middle, before the ciclorruta)
    P: (x) => (onSouthRoadX(x) ? SOUTH_ROAD.offsets[1] + 0.15 : 2.72),
    C: () => (ZONES.roadFront[0] + ZONES.roadFront[1]) / 2,
}
const BRIDGES = [STOPS_BY_ID['puente-ortiz'].position[0], -4.6, 5.0] // Island.jsx · Bridges
const LINKS = { NP: BRIDGES, PC: CROSS_STREETS } // where you can change lane
const ORDER = ['N', 'P', 'C']
const at = (x, o) => [x, riverZ(x) + o]
/** Which lane a stop opens onto (Puente Ortiz IS a bridge: it joins north and south). */
function laneOf(stop) {
    if (stop.id === 'puente-ortiz') return 'X'
    const off = stop.position[1] - riverZ(stop.position[0])
    // (your island: the Carrera 3 is gone where you took it out — on the south bank the walk goes
    // along the Bulevar, where the people walk)
    return off < 0 ? 'N' : USER_GROUND ? 'P' : 'C'
}
/** Along one lane from x0 to x1 (following the curve of the river). */
function along(lane, x0, x1) {
    const n = Math.max(1, Math.ceil(Math.abs(x1 - x0) / 0.3))
    return Array.from({ length: n + 1 }, (_, i) => {
        const x = x0 + ((x1 - x0) * i) / n
        return at(x, LANE[lane](x))
    })
}
/** From lane a to lane b, ending at x1, starting at x0: picks the bridges / calles that walk least. */
function walk(a, x0, b, x1) {
    const ia = ORDER.indexOf(a)
    const ib = ORDER.indexOf(b)
    if (ia === ib) return along(a, x0, x1)
    const step = ib > ia ? 1 : -1
    const next = ORDER[ia + step]
    const key = step > 0 ? a + next : next + a
    // the link that keeps the whole walk shortest (a small search: there are only a few)
    let best = null
    for (const k of LINKS[key]) {
        const rest = walk(next, k, b, x1)
        const len = Math.abs(k - x0) + pathLength(rest)
        if (!best || len < best.len) best = { len, pts: [...along(a, x0, k), ...crossTo(k, a, next), ...rest] }
    }
    return best.pts
}
// changing lane at x: across a calle (straight), or over a bridge — then it steps up onto the deck
// (points at its two ends) so the line runs ON the bridge, not under it
const DECK = 1.3 // half the length of a bridge, from the middle of the river
function crossTo(x, a, b) {
    const oa = LANE[a](x), ob = LANE[b](x)
    if (!((a === 'N' && b === 'P') || (a === 'P' && b === 'N'))) return [at(x, oa), at(x, ob)]
    const s = Math.sign(ob - oa)
    return [at(x, oa), at(x, -s * DECK), at(x, s * DECK), at(x, ob)]
}
const pathLength = (pts) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0)

/**
 * From one stop to the next, along the streets: from the street in front of the stop to the street
 * in front of the next one (its pin marks the house — the line never goes into the building).
 */
function legBetween(a, b) {
    const la = laneOf(a)
    const lb = laneOf(b)
    const [ax] = a.position
    const [bx] = b.position
    // Puente Ortiz: step off the bridge onto the side we are going to
    const startLane = la === 'X' ? (lb === 'N' ? 'N' : 'P') : la
    const endLane = lb === 'X' ? (la === 'N' ? 'N' : 'P') : lb
    return [at(ax, LANE[startLane](ax)), ...walk(startLane, ax, endLane, bx), at(bx, LANE[endLane](bx))]
}

// Your buildings stand where you left them, and some take a bit of a street or a sidewalk: the line
// never runs under one. Where a point of it falls inside a building's footprint (USER_BUILDINGS ·
// box, with a little room around it), it moves towards the river until it is clear — never into
// the water (the walls of the river: |offset| ≥ 1).
const FOOTPRINTS = USER_BUILDINGS.map((it) => it.box).filter((b) => b && b.w && b.d)
const insideBuilding = (x, z, m = 0.07) =>
    FOOTPRINTS.some((b) => {
        const dx = x - b.x, dz = z - b.z, c = Math.cos(b.yaw ?? 0), s = Math.sin(b.yaw ?? 0)
        return Math.abs(dx * c - dz * s) < b.w / 2 + m && Math.abs(dx * s + dz * c) < b.d / 2 + m
    })
function clearOfBuildings([x, z]) {
    if (!insideBuilding(x, z)) return [x, z]
    const r = riverZ(x)
    let o = z - r
    const side = Math.sign(o) || 1
    while (Math.abs(o) > 1.0 && insideBuilding(x, r + o)) o -= side * 0.04
    return [x, r + o]
}

// drop repeated points (a dashed line needs real segments)
const dedupe = (pts) => pts.filter((p, i) => !i || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-3)
// on the ground, or on a bridge deck over the river
const lift = (x, z) => (Math.abs(z - riverZ(x)) <= DECK + 1e-3 ? 0.17 : 0.06)
const toVec = ([x, z]) => new THREE.Vector3(x, ISLAND_TOP + lift(x, z), z)
/** Drops the points that add nothing (Douglas–Peucker, in plan): straight stretches stay straight. */
function simplify(pts, tol = 0.02) {
    if (pts.length < 3) return pts
    const [a, b] = [pts[0], pts[pts.length - 1]]
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1
    let far = 0, at = 0
    for (let i = 1; i < pts.length - 1; i++) {
        const d = Math.abs((pts[i][0] - a[0]) * dz - (pts[i][1] - a[1]) * dx) / L
        if (d > far) (far = d), (at = i)
    }
    if (far <= tol) return [a, b]
    return [...simplify(pts.slice(0, at + 1), tol).slice(0, -1), ...simplify(pts.slice(at), tol)]
}
/**
 * A flat ribbon `width` wide along the points (on the ground / the bridge decks): a straight band
 * for each stretch and a round piece at every corner and at both ends — so it turns and ends
 * round, with no breaks, no steps and no gaps.
 */
function ribbonGeometry(points, width) {
    const pos = [], idx = []
    const h = width / 2
    for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i]
        const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz) || 1
        const nx = (-dz / L) * h, nz = (dx / L) * h
        const k = pos.length / 3
        pos.push(a.x + nx, a.y, a.z + nz, a.x - nx, a.y, a.z - nz, b.x + nx, b.y, b.z + nz, b.x - nx, b.y, b.z - nz)
        idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3)
    }
    const SEG = 18
    for (const p of points) {
        const k = pos.length / 3
        pos.push(p.x, p.y, p.z)
        for (let s = 0; s <= SEG; s++) {
            const t = (s / SEG) * Math.PI * 2
            pos.push(p.x + Math.cos(t) * h, p.y, p.z + Math.sin(t) * h)
        }
        for (let s = 0; s < SEG; s++) idx.push(k, k + s + 2, k + s + 1)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setIndex(idx)
    return g
}
const ribbonMat = (color, depth) => new THREE.MeshBasicMaterial({ color, toneMapped: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 - depth, polygonOffsetUnits: -4 - depth * 2 })
/**
 * ONE clean line along the streets through all the stops, in order: a solid stripe of the route's
 * colour over a white border, straight where the street is straight, with round corners and round
 * ends; each stop carries its number (1, 2, 3…) on its pin.
 */
function RoutePath({ stopIds, color }) {
    const geos = useMemo(() => {
        const stops = stopIds.map((id) => STOPS_BY_ID[id]).filter(Boolean)
        if (stops.length < 2) return null
        const legs = []
        for (let i = 1; i < stops.length; i++) legs.push(dedupe(legBetween(stops[i - 1], stops[i]).map(clearOfBuildings)))
        // (simplified stretch by stretch: where it steps up onto a bridge deck — or down from it — the
        // points stay, or it would pass under the deck)
        const all = dedupe(legs.flat())
        const runs = []
        for (const p of all) {
            const level = lift(p[0], p[1])
            if (!runs.length || runs[runs.length - 1].level !== level) runs.push({ level, pts: runs.length ? [runs[runs.length - 1].pts.at(-1)] : [] })
            runs[runs.length - 1].pts.push(p)
        }
        const points = dedupe(runs.flatMap((r) => simplify(r.pts))).map(toVec)
        return { border: ribbonGeometry(points, 0.15), stripe: ribbonGeometry(points.map((p) => p.clone().setY(p.y + 0.004)), 0.09) }
    }, [stopIds])
    const mats = useMemo(() => ({ border: ribbonMat('#FFFFFF', 0), stripe: ribbonMat(color, 1) }), [color])
    useEffect(() => () => geos && (geos.border.dispose(), geos.stripe.dispose()), [geos])
    if (!geos) return null
    // (untouched by the tone mapping: it reads at a glance on the grey streets, the green and the
    // water, by day and by night)
    return (
        <group name="ruta_linea">
            <mesh geometry={geos.border} material={mats.border} renderOrder={2} />
            <mesh geometry={geos.stripe} material={mats.stripe} renderOrder={3} />
        </group>
    )
}
// the route's colour, from the palette (theme.js) — a deeper orange for the routes, the green for
// yours — strong enough to read over the streets, the green and the water
const ROUTE_COLOR = shade(PALETTE.naranja, 0.92)
const BUILDER_COLOR = PALETTE.verde

// each stop building gets its own facade colour (same kind, different house)
const TINTS = {
    food: [mix(PALETTE.crema, PALETTE.mango, 0.45), mix(PALETTE.crema, PALETTE.rosa, 0.5), mix(PALETTE.crema, PALETTE.lima, 0.4), mix(PALETTE.crema, PALETTE.naranja, 0.35)],
    monument: [PALETTE.crema, mix(PALETTE.crema, PALETTE.mango, 0.25)],
    tent: [shade(PALETTE.naranja, 0.66), shade(PALETTE.naranja, 0.55), mix(shade(PALETTE.naranja, 0.6), PALETTE.rosa, 0.2), shade(PALETTE.naranja, 0.72)],
}
const yawAt = (x) => -Math.atan2(riverZ(x + 0.1) - riverZ(x - 0.1), 0.2)

/**
 * The stops of the example routes ARE buildings of the city (always there, routes or not): a fonda
 * for each food stop, a cultural house for each cultural one, a workshop for each taller — each
 * facing the river from its block. The routes only light them up with their markers.
 */
export function StopBuildings() {
    // (your island as you arranged it: the houses of the stops are in it, as big as you left them)
    if (USER_ISLAND) return null
    const counts = {}
    // (as you left them in your buildings file: turned like you did, as big as their lot — it —;
    // one you deleted takes the place of a building of yours; one you duplicated, one more house)
    return [...ALL_STOPS.filter((s) => !s.landmark && !s.noBuilding), ...STOP_COPIES].map((stop) => {
        const kind = stop.placeholder
        const n = (counts[kind] = (counts[kind] ?? -1) + 1)
        const Model = STOP_MODELS[kind]
        const [x, z] = stop.position
        // the front looks towards the river: on the north bank that is +z (the Av. 1 Norte), on the
        // south bank they are turned round to face the Bulevar
        const south = z > riverZ(x)
        return (
            <group key={stop.id} name={`ruta_${stop.id}`} position={[x, ISLAND_TOP, z]} rotation-y={yawAt(x) + (south ? Math.PI : 0) + ((stop.turn ?? 0) * Math.PI) / 180} scale={stop.fit ? 1 : stop.scale ?? 1}>
                <SwappableModel url={stop.model} placeholder={Model} tint={TINTS[kind][n % TINTS[kind].length]} height={STOP_HEIGHT[kind]} size={stop.fit} />
            </group>
        )
    })
}

export default function RouteLayer() {
    const mode = useExperience((s) => s.mode)
    const activeRoute = useExperience((s) => s.activeRoute)
    const builder = useExperience((s) => s.builder)
    const customStops = useExperience((s) => s.customStops)
    const previewRoute = useExperience((s) => s.previewRoute)
    const toggleStop = useExperience((s) => s.toggleStop)
    const selectStop = useExperience((s) => s.selectStop)
    const selectedStop = useExperience((s) => s.selectedStop)

    if (mode !== 'rutas') return null

    // In builder mode show ALL stops so a custom route can mix themes.
    const stops = builder
        ? Object.values(ROUTES).flatMap((r) => r.stops)
        : previewRoute
            ? previewRoute.map((id) => STOPS_BY_ID[id]).filter(Boolean)
            : activeRoute
                ? ROUTES[activeRoute].stops
                : []

    const pathIds = builder ? customStops : previewRoute ?? (activeRoute ? ROUTES[activeRoute].stops.map((s) => s.id) : [])

    return (
        <group key={`${activeRoute}-${builder}-${previewRoute?.join()}`}>
            {stops.map((stop, i) => {
                const order = customStops.indexOf(stop.id)
                return (
                    <Marker
                        key={stop.id}
                        index={i}
                        position={stop.position}
                        label={stop.name}
                        // the order of the walk: 1, 2, 3… (your own order while you build one)
                        badge={builder ? (order >= 0 ? order + 1 : null) : pathIds.indexOf(stop.id) + 1 || null}
                        active={builder ? order >= 0 : selectedStop === stop.id}
                        glow={GLOW.rutas}
                        // the light rises from the roof of the stop's building (StopBuildings)
                        base={stop.landmark || stop.noBuilding ? 0 : stop.top ?? (stop.fit ? stop.fit * 0.75 : STOP_HEIGHT[stop.placeholder] * (stop.scale ?? 1))}
                        // (its card explains it — with or without the guide; the guide also says it)
                        onSelect={() => (builder ? toggleStop(stop.id) : selectStop(stop.id))}
                    />
                )
            })}
            <RoutePath stopIds={pathIds} color={builder ? BUILDER_COLOR : ROUTE_COLOR} />
        </group>
    )
}
