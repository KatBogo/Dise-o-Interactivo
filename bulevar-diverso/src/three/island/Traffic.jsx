import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { poleModel, unitParts } from '../unitModel.js'
import { ISLAND_TOP } from '../../config.js'
import { PALETTE, mix, shade } from '../../theme.js'
import { USER_GROUND, USER_ISLAND, onGround } from '../../data/userGround.js'
import { AV1N_TO, AV1N_X, CARRERA3, CROSS_HALF, CROSS_STREETS, PEDESTRIAN, SOUTH_ROAD, ZONES, halfWidthAt, northShift, onPedestrian, riverZ, tunnelDepth } from '../../data/bulevarLayout.js'
import { geo, mat } from '../materials.js'
import { seeded } from '../Clouds.jsx'
import { skyState } from '../skyState.js'

const TOP = ISLAND_TOP
const yawAt = (x) => -Math.atan2(riverZ(x + 0.1) - riverZ(x - 0.1), 0.2)
const dummy = new THREE.Object3D()

// (wid / hgt: the proportions of the models of Assets/modelos — carros.glb and mio_verde.glb)
const TYPES = {
    car: { len: 0.38, wid: 0.144, hgt: 0.144, speed: 1.15, model: 'car' },
    taxi: { len: 0.36, wid: 0.137, hgt: 0.137, speed: 1.25, color: PALETTE.mango, model: 'car' },
    mio: { len: 0.95, wid: 0.246, hgt: 0.325, speed: 0.85, model: 'mio' },
}
const CAR_COLORS = [PALETTE.crema, PALETTE.rosa, PALETTE.naranja, mix(PALETTE.crema, PALETTE.lima, 0.5), shade(PALETTE.crema, 0.55), '#3A3A36', mix(PALETTE.rosa, PALETTE.naranja, 0.4)]

/**
 * The vehicles are the models of Assets/modelos (carros.glb for cars and taxis — each one gets its
 * colour —, mio_verde.glb for the MIO bus), drawn as instances: their pieces baked into one length
 * unit, nose towards +x, base on the ground. FRONT: which end of the model is its nose (+1 its +z).
 */
const MODEL_URL = { car: 'models/carros.glb', mio: 'models/mio_verde.glb' }
const FRONT = { car: 1, mio: -1 } // (the bus's nose — its sloped windscreen — is at its -z)
/** The instances of one model; `meshes` gets its pieces (the traffic moves them every frame). */
function VehicleModel({ kind, count, colors, meshes }) {
    const { scene } = useGLTF(MODEL_URL[kind])
    const parts = useMemo(() => unitParts(scene, { front: FRONT[kind] }), [scene, kind])
    useLayoutEffect(() => {
        const color = new THREE.Color()
        for (const m of meshes.current) {
            if (!m) continue
            m.count = count
            colors.forEach((c, i) => m.setColorAt(i, color.set(c)))
            if (m.instanceColor) m.instanceColor.needsUpdate = true
        }
    }, [parts, colors, count, meshes])
    return parts.map((p, i) => (
        // (no shadow of their own: what moves does not cast one — the shadows are drawn a few times a
        // second, and a car's lagged behind it)
        <instancedMesh key={i} ref={(m) => (meshes.current[i] = m)} args={[p.geo, p.mat, count]} receiveShadow frustumCulled={false} name={`vehiculos_${kind}`} />
    ))
}
useGLTF.preload(MODEL_URL.car)
useGLTF.preload(MODEL_URL.mio)

// Traffic-light cycle (s): avenue green → amber → all red → calle green → amber → all red
const CYCLE = 11
const lightsAt = (t) => {
    const c = t % CYCLE
    return { main: c < 5 ? 'green' : c < 6 ? 'amber' : 'red', cross: c >= 6.5 && c < 10 ? 'green' : c >= 10 && c < 10.8 ? 'amber' : 'red' }
}

/**
 * The lenses of the traffic lights: the one that is on glows in its colour, the others stay dark.
 * Shared with your island (Island.jsx · UserTerrain): the lenses of its traffic lights get these.
 */
const lens = (c) => new THREE.MeshStandardMaterial({ color: '#1f1f1c', emissive: c, emissiveIntensity: 0, toneMapped: false })
// the cars' own lights (their brightness follows the night: Traffic's useFrame)
const headMat = new THREE.MeshStandardMaterial({ color: '#FFF6DC', emissive: '#FFF1C2', emissiveIntensity: 0, transparent: true, toneMapped: false })
const tailMat = new THREE.MeshStandardMaterial({ color: '#7A1010', emissive: '#FF2020', emissiveIntensity: 0, transparent: true, toneMapped: false })
export const LAMP_MATS = {
    main: { red: lens('#FF2A1A'), amber: lens('#FFB21A'), green: lens('#3DFF5A') },
    cross: { red: lens('#FF2A1A'), amber: lens('#FFB21A'), green: lens('#3DFF5A') },
}

// The two roads with traffic: Avenida 1 Norte (north bank, along the river) and Carrera 3 (south,
// behind the buildings that face the Bulevar). Each has two lanes (one per direction).
// (the Av. 1 Norte moves away from the river in the west: shift; the Av. Colombia — real island
// only — runs on the south bank and goes under the pedestrian Bulevar, through the Túnel Mundialista)
const ROADS = [
    { id: 'av1n', lanes: [{ o: -1.55, dir: 1 }, { o: -2.05, dir: -1 }], xMin: -AV1N_X, xMax: AV1N_TO, side: -1, outer: ZONES.roadBack[0], inner: ZONES.roadBack[1], shift: northShift },
    // (the Carrera 3 starts at a calle in the west: CARRERA3)
    { id: 'cra3', lanes: [{ o: 5.48, dir: 1 }, { o: 5.82, dir: -1 }], xMin: CARRERA3[0], xMax: CARRERA3[1], side: 1, outer: ZONES.roadFront[1], inner: ZONES.roadFront[0] },
    ...(SOUTH_ROAD
        ? [{ id: 'avcol', lanes: [{ o: SOUTH_ROAD.offsets[0] + 0.32, dir: 1 }, { o: SOUTH_ROAD.offsets[1] - 0.32, dir: -1 }], xMax: 22.4, side: 1, outer: SOUTH_ROAD.offsets[1], inner: SOUTH_ROAD.offsets[0], through: true, crosses: (c) => !onPedestrian(c, 0.6) }]
        : []),
]
const shiftOf = (road, x) => (road.shift ? road.shift(x) : 0)
const lowOf = (road) => road.xMin ?? -road.xMax // (where the road starts in the west)
const crossesOf = (road) => CROSS_STREETS.filter((c) => c > lowOf(road) + 0.5 && c < road.xMax - 0.5 && (!road.crosses || road.crosses(c)))

/**
 * Route polylines (points on the xz plane) + the stop lines met on the way:
 *   through : along a lane from one end of the road to the other
 *   in      : from the island edge down a calle, turn onto the road, continue to its end
 *   out     : along the road, turn into a calle, up to the island edge
 * Stops: { s (arc length), axis: 'main' | 'cross' }.
 */
function makeRoute(road, lane, kind, c) {
    const pts = []
    const stops = []
    let len = 0
    const push = (x, o) => {
        const p = new THREE.Vector2(x, riverZ(x) + o)
        if (pts.length) len += p.distanceTo(pts[pts.length - 1])
        pts.push(p)
    }
    const along = (x0, x1) => {
        const dir = Math.sign(x1 - x0)
        for (let x = x0; dir > 0 ? x <= x1 : x >= x1; x += dir * 0.25) {
            // stop line before every junction of this road: right before its zebra crossing (the
            // zebra runs from CROSS_HALF + 0.05 to CROSS_HALF + 0.27 from the middle of the calle)
            for (const cs of crossesOf(road)) {
                const line = cs - dir * (CROSS_HALF + 0.32)
                if ((x - line) * dir >= 0 && (x - dir * 0.25 - line) * dir < 0) stops.push({ s: len, axis: 'main' })
            }
            push(x, lane.o + shiftOf(road, x))
        }
    }
    const edge = (x) => road.side * (halfWidthAt(x) - 0.4)
    const calle = (x, from, to) => {
        const dir = Math.sign(to - from)
        for (let o = from; dir > 0 ? o <= to : o >= to; o += dir * 0.2) {
            const line = (road.side > 0 ? road.outer + 0.15 : road.outer - 0.15) + shiftOf(road, x)
            if ((o - line) * dir >= 0 && (o - dir * 0.2 - line) * dir < 0 && Math.sign(to - from) === -road.side) stops.push({ s: len, axis: 'cross' })
            push(x, o)
        }
    }
    const from = lane.dir > 0 ? lowOf(road) : road.xMax, to = lane.dir > 0 ? road.xMax : lowOf(road)
    if (kind === 'through') along(from, to)
    else if (kind === 'in') {
        // come down the calle (in its inbound lane) towards the road, turn, drive on
        const x = c - 0.19 * lane.dir
        calle(x, edge(x), lane.o + shiftOf(road, x) - road.side * 0.15)
        along(x + lane.dir * 0.25, to)
    } else {
        const x = c + 0.19 * lane.dir
        along(from, x - lane.dir * 0.25)
        calle(x, lane.o + shiftOf(road, x) + road.side * 0.15, edge(x))
    }
    const cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
    return { pts, cum, len: cum[cum.length - 1], stops }
}

// (with your terrain: only the routes that stay on its streets — a calle you took out, no car goes there)
const underBulevar = (x) => { const t = SOUTH_ROAD?.tunnels; return !!t?.length && x >= t[0][0] && x <= t[t.length - 1][1] }
const onStreets = (route) => !USER_GROUND || route.pts.every((p, i) => i % 3 || (route.road === 'avcol' && underBulevar(p.x)) || onGround('street', p.x, p.y, 0.25)) // (its points: x, z as x, y; in the tunnel, under the ground: no street)
function buildRoutes() {
    const out = []
    ROADS.forEach((road) => {
        road.lanes.forEach((lane) => {
            out.push({ road: road.id, ...makeRoute(road, lane, 'through'), weight: 3 })
            if (road.through) return // (the Av. Colombia: only through traffic)
            CROSS_STREETS.filter((c) => c > lowOf(road) + 1 && c < road.xMax - 1).forEach((c) => {
                out.push({ road: road.id, ...makeRoute(road, lane, 'in', c), weight: 1 })
                out.push({ road: road.id, ...makeRoute(road, lane, 'out', c), weight: 1 })
            })
        })
    })
    return out.filter(onStreets)
}

/** Position + heading at arc length s. */
function sample(route, s, outP, outD) {
    const { pts, cum } = route
    let i = 1
    while (i < cum.length - 1 && cum[i] < s) i++
    const a = pts[i - 1], b = pts[i]
    const t = THREE.MathUtils.clamp((s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), 0, 1)
    outP.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
    outD.set(b.x - a.x, b.y - a.y).normalize()
}

/**
 * Traffic that makes sense: cars, taxis and a MIO bus drive along the Av. 1 Norte and the
 * Carrera 3, come in from the calles and turn onto them, or turn off into a calle and leave.
 * They keep their distance and stop at the stop line when the light is red.
 */
export default function Traffic() {
    const routes = useMemo(buildRoutes, [])
    const vehicles = useMemo(() => {
        const rand = seeded(61)
        const pickRoute = (road) => {
            const list = routes.filter((r) => r.road === road)
            const total = list.reduce((a, r) => a + r.weight, 0)
            let k = rand() * total
            for (const r of list) if ((k -= r.weight) <= 0) return r
            return list[0]
        }
        const list = []
        const n = SOUTH_ROAD ? 23 : 18
        for (let i = 0; i < n; i++) {
            const road = i < 11 ? 'av1n' : i < 18 ? 'cra3' : 'avcol'
            const type = i === 0 ? 'mio' : rand() > 0.72 ? 'taxi' : 'car'
            const route = pickRoute(road)
            if (!route) continue // (none of its routes on your streets)
            const model = TYPES[type].model
            const slot = list.filter((v) => v.model === model).length // (its instance in its model)
            list.push({ index: list.length, road, type, model, slot, route, s: rand() * route.len, v: 0, c: TYPES[type].color ?? CAR_COLORS[Math.floor(rand() * CAR_COLORS.length)], pos: new THREE.Vector2(), dir: new THREE.Vector2(), pickRoute })
        }
        return list
    }, [routes])
    const fleet = useMemo(() => {
        const of = (model) => vehicles.filter((v) => v.model === model)
        // (the bus keeps the colours of its model: white = no tint)
        return { car: { count: of('car').length, colors: of('car').map((v) => v.c) }, mio: { count: of('mio').length, colors: of('mio').map(() => '#ffffff') } }
    }, [vehicles])
    const models = { car: useRef([]), mio: useRef([]) }
    const heads = useRef()
    const tails = useRef()
    const lampMats = LAMP_MATS
    // a traffic light at each junction (one corner per side of the calle)
    const poles = useMemo(() => {
        const out = []
        ROADS.forEach((road) => {
            crossesOf(road).forEach((c) => {
                for (const dx of [-1, 1]) {
                    const x = c + dx * (CROSS_HALF + 0.14)
                    const o = (dx > 0 ? road.outer + road.side * 0.12 : road.inner - road.side * 0.1) + shiftOf(road, x)
                    const mid = (road.outer + road.inner) / 2 + shiftOf(road, x)
                    // (its arm reaches over the road: towards the middle of it)
                    out.push({ x, z: riverZ(x) + o, yaw: yawAt(x) + (mid < o ? Math.PI : 0) })
                }
            })
        })
        return out
    }, [])

    const tmp = useMemo(() => new THREE.Vector2(), [])
    useFrame(({ clock }, dt) => {
        const step = Math.min(dt, 0.05)
        const L = lightsAt(clock.elapsedTime)
        for (const axis of ['main', 'cross']) for (const k of ['red', 'amber', 'green']) lampMats[axis][k].emissiveIntensity = L[axis] === k ? 4 : 0.04

        vehicles.forEach((car) => sample(car.route, car.s, car.pos, car.dir))
        vehicles.forEach((car) => {
            const T = TYPES[car.type]
            let target = T.speed
            // keep the distance to whoever is ahead in the same lane / heading
            for (const other of vehicles) {
                if (other === car || other.road !== car.road) continue
                tmp.copy(other.pos).sub(car.pos)
                const ahead = tmp.dot(car.dir)
                if (ahead <= 0 || ahead > 2) continue
                const lateral = Math.abs(tmp.x * car.dir.y - tmp.y * car.dir.x)
                if (lateral > 0.17 || other.dir.dot(car.dir) < 0.3) continue
                const need = (T.len + TYPES[other.type].len) / 2 + 0.14
                target = Math.min(target, Math.max(0, (ahead - need) * 2.2))
            }
            // red light at the next stop line
            for (const st of car.route.stops) {
                // (from its NOSE: the whole car waits behind the line, never on the zebra)
                const d = st.s - car.s - T.len / 2
                if (d < -0.05 || d > 1) continue
                const light = L[st.axis]
                if (light === 'red' || (light === 'amber' && d > 0.25)) target = Math.min(target, Math.max(0, d * 1.8 - 0.02))
                break
            }
            car.v += (target - car.v) * (1 - Math.exp(-step * 4))
            car.s += car.v * step
            if (car.s >= car.route.len) {
                car.route = car.pickRoute(car.road)
                car.s = 0
                car.v = 0
            }
        })

        vehicles.forEach((car) => {
            const T = TYPES[car.type]
            sample(car.route, car.s, car.pos, car.dir)
            const yaw = Math.atan2(-car.dir.y, car.dir.x)
            const fade = Math.min(1, car.s * 2.5, (car.route.len - car.s) * 2.5)
            const x = car.pos.x, z = car.pos.y
            // the Av. Colombia goes down into the tunnel: the car sinks with the road, and is hidden
            // once inside (under the pedestrian Bulevar)
            let y = TOP
            let hide = 1
            if (car.road === 'avcol') {
                const d = tunnelDepth(x)
                if (d != null) y = TOP - d * 0.42
                const inside = Math.min(x - PEDESTRIAN[0], PEDESTRIAN[1] - x)
                if (inside > 0) { y = TOP - 0.42; hide = Math.max(0, 1 - inside * 5) }
            }
            const sc = Math.max(0.001, fade * hide)
            // the model (one length unit, nose to +x): as long as its type
            dummy.position.set(x, y + 0.005, z)
            dummy.rotation.set(0, yaw, 0)
            dummy.scale.setScalar(T.len * sc)
            dummy.updateMatrix()
            for (const m of models[car.model].current) m?.setMatrixAt(car.slot, dummy.matrix)
            // its lights: two headlights at the nose, two red ones at the back (on at night,
            // the brake lights brighter while it stops)
            const fx = car.dir.x, fz = car.dir.y // (forward on the ground: x, z)
            const sx = -fz, sz = fx // (to its side)
            const hl = T.hgt * 0.42, w = T.wid * 0.32
            for (let k = 0; k < 2; k++) {
                const side = k ? 1 : -1
                dummy.rotation.set(0, yaw, 0)
                dummy.scale.set(0.022 * sc, 0.016 * sc, 0.03 * sc)
                dummy.position.set(x + fx * T.len * 0.5 + sx * w * side, y + hl, z + fz * T.len * 0.5 + sz * w * side)
                dummy.updateMatrix()
                heads.current?.setMatrixAt(car.index * 2 + k, dummy.matrix)
                dummy.position.set(x - fx * T.len * 0.5 + sx * w * side, y + hl, z - fz * T.len * 0.5 + sz * w * side)
                dummy.updateMatrix()
                tails.current?.setMatrixAt(car.index * 2 + k, dummy.matrix)
            }
        })
        for (const list of Object.values(models)) for (const m of list.current) if (m) m.instanceMatrix.needsUpdate = true
        if (heads.current) heads.current.instanceMatrix.needsUpdate = true
        if (tails.current) tails.current.instanceMatrix.needsUpdate = true
        // at night they light up (a touch already at dusk); by day they are only their glass
        const n = THREE.MathUtils.smoothstep(skyState.night, 0.15, 0.7)
        headMat.emissiveIntensity = n * 3.2
        tailMat.emissiveIntensity = 0.15 + n * 2.2
        headMat.opacity = tailMat.opacity = 0.35 + n * 0.65
    })

    return (
        <group>
            <Suspense fallback={null}>
                <VehicleModel kind="car" count={fleet.car.count} colors={fleet.car.colors} meshes={models.car} />
                <VehicleModel kind="mio" count={fleet.mio.count} colors={fleet.mio.colors} meshes={models.mio} />
            </Suspense>
            {/* the lights of the cars (two at the front, two at the back of each one) */}
            <instancedMesh ref={heads} args={[geo.box, headMat, vehicles.length * 2]} frustumCulled={false} name="vehiculos_farolas" />
            <instancedMesh ref={tails} args={[geo.box, tailMat, vehicles.length * 2]} frustumCulled={false} name="vehiculos_luces_traseras" />
            <Suspense fallback={null}>
                {/* (your island as you arranged it: its traffic lights are in its file) */}
                {!USER_ISLAND && <TrafficLights poles={poles} lampMats={lampMats} />}
            </Suspense>
        </group>
    )
}

/**
 * The traffic lights: the model of Assets/modelos/semaforo.glb at each corner, its arm over the
 * road; the lights that change hang at the end of the arm (for the avenue) and on the pole (for
 * the calle).
 */
const POLE_H = 0.72
// (measured on semaforo.glb, as parts of its height: its light box is 0.017 to each side of the
// arm, 0.516 out along it; its lenses at these heights, 0.013 in radius)
const LENS = { x: 0.0185, z: 0.5157, r: 0.0125 }
const LENSES = [0.9282, 0.8905, 0.8532]
function TrafficLights({ poles, lampMats }) {
    const { scene } = useGLTF('models/semaforo.glb')
    const pole = useMemo(() => poleModel(scene), [scene])
    const meshes = useRef([])
    useLayoutEffect(() => {
        poles.forEach((p, i) => {
            dummy.position.set(p.x, TOP, p.z)
            dummy.rotation.set(0, p.yaw, 0)
            dummy.scale.setScalar(POLE_H)
            dummy.updateMatrix()
            for (const m of meshes.current) m?.setMatrixAt(i, dummy.matrix)
        })
        for (const m of meshes.current) if (m) (m.instanceMatrix.needsUpdate = true), m.computeBoundingSphere()
    }, [poles, pole])
    // the three lenses of the model's light box (at the end of its arm), in pole heights: on its
    // front face and the same on its back — the lights sit right on them, red on top
    const lights = (side) =>
        LENSES.map((y, j) => (
            <mesh key={j} geometry={geo.sphereLow} position={[side * LENS.x * POLE_H, y * POLE_H, LENS.z * POLE_H]} scale={[0.004, LENS.r * POLE_H, LENS.r * POLE_H]} material={lampMats.main[['red', 'amber', 'green'][j]]} />
        ))
    return (
        <>
            {pole.parts.map((p, i) => (
                <instancedMesh key={i} ref={(m) => (meshes.current[i] = m)} args={[p.geo, p.mat, poles.length]} castShadow name="semaforos" />
            ))}
            {poles.map((p, i) => (
                <group key={i} position={[p.x, TOP, p.z]} rotation-y={p.yaw} name="semaforos_luces">
                    {lights(-1)}
                    {lights(1)}
                </group>
            ))}
        </>
    )
}
useGLTF.preload('models/semaforo.glb')
