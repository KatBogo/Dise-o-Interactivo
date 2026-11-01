import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import FERIA_FRONTS from '../../content/feria-frentes.json'
import ALU_LAYOUT from '../../content/alumbrado.json'
import { USER_FURNITURE, onGround } from '../../data/userGround.js'
import { clayMaterial } from '../chonti/clayMaterial.js'
import * as THREE from 'three'
import gsap from 'gsap'
import { ISLAND_TOP } from '../../config.js'
import { PALETTE, mix, shade } from '../../theme.js'
import { ALL_STOPS, EVENTS, PLACES, USER_BUILDINGS, inUserBuildings } from '../../data/content.js'
import { CROSS_STREETS, ISLAND_NAME, PEDESTRIAN, RETRETA, ZONES, halfWidthAt, onCrossStreet, onPedestrian, onRoad, riverZ } from '../../data/bulevarLayout.js'
import { useExperience } from '../../store/useExperience.js'
import { skyState } from '../skyState.js'
import { geo, mat } from '../materials.js'
import { seeded } from '../Clouds.jsx'
import { BUILDING_HEIGHTS, BULEVAR_CENTER, BULEVAR_MID, CITY, LANDMARKS, PROMENADE_TREES, RIVER, STREET_LAMPS, onRetretaSpot, useBuildingBoxes } from '../island/Island.jsx'
import Marker, { GLOW } from '../Marker.jsx'
import { STOP_HEIGHT, clayed } from '../places/PlaceModels.jsx'
import MODELOS from '../../content/modelos.json'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { bakedPieces, glowSwap, merged, poleModel, unitModel } from '../unitModel.js'

const TOP = ISLAND_TOP
const SUCURSAL = EVENTS.find((e) => e.id === 'sucursal').position
const COLORS = [PALETTE.verde, PALETTE.lima, PALETTE.naranja, PALETTE.mango, PALETTE.rosa, PALETTE.crema]
const dummy = new THREE.Object3D()
const backOut = gsap.parseEase('back.out(1.7)')
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const yawAt = (x) => -Math.atan2(riverZ(x + 0.1) - riverZ(x - 0.1), 0.2)
const WOOD = shade(PALETTE.naranja, 0.42)
const POLE = shade(PALETTE.crema, 0.55)

// ── Free space on the island (landmarks, stops, trees, buildings, cross streets) ──────
const SPOTS = [...PLACES, ...EVENTS, ...ALL_STOPS].map((s) => s.position)
const TRUNKS = CITY.trunks.filter((t) => t.p[1] < TOP + 0.3).map((t) => [t.p[0], t.p[2]])
const HOUSES = Object.values(CITY.buildings).flat().map((b) => [b.p[0], b.p[2]])
const TREES = [...TRUNKS, ...PROMENADE_TREES.map((t) => [t.x, t.z])]
function isFree(x, z, r) {
    const off = z - riverZ(x)
    if (Math.abs(off) + r * 0.6 > halfWidthAt(x) - 0.3) return false
    if (Math.abs(off) < 0.95 + r * 0.5) return false // not in the river
    if (onCrossStreet(x, r * 0.6) || onRoad(x, off, r * 0.6 + 0.1)) return false // never on a street
    if (BULEVAR_CENTER.items.some((it) => Math.abs(x - it.x) < it.half + r * 0.6 && Math.abs(off - BULEVAR_MID) < 0.45 + r * 0.6)) return false // (nor on the furniture in the middle of the walk)
    return !SPOTS.some(([a, b]) => Math.hypot(a - x, b - z) < r + 0.7) && !TREES.some(([a, b]) => Math.hypot(a - x, b - z) < r * 0.75 + 0.3) && !HOUSES.some(([a, b]) => Math.hypot(a - x, b - z) < r + 0.7)
}
/** Up to `n` free spots inside a box of the island (x range, offsets from the river), `gap` apart. */
function findSpots({ x: [x0, x1], o: [o0, o1], r, n, gap = 2, seed = 1 }) {
    const rand = seeded(seed)
    const out = []
    for (let tries = 0; tries < 900 && out.length < n; tries++) {
        const x = x0 + rand() * (x1 - x0)
        const z = riverZ(x) + o0 + rand() * (o1 - o0)
        if (isFree(x, z, r) && !out.some(([a, b]) => Math.hypot(a - x, b - z) < gap)) out.push([x, z])
    }
    return out
}

// The pedestrian Bulevar: the only place where events put things (never on the river or a street)
const WALK = [1.2, 2.7]
// …and only along its real stretch (src/content/island.json)
const WALK_X = [Math.max(-18.5, PEDESTRIAN[0] + 0.5), Math.min(19, PEDESTRIAN[1] - 1.5)]
const CLASSIC = ISLAND_NAME === 'clasica'

/**
 * Where the Feria del Libro's pavilions go: one after another along the walkway, on its outer half
 * (their fronts face the river, so the walk stays free in front of them), off the cross streets,
 * the markers and the trees. [x, z, yaw, kind] in island coordinates — scripts/prepare-place-model.py
 * builds evento_feria_del_libro.glb with them (scripts/feria-layout.json); after that the GLB is the
 * one that says where everything is (it can be moved in Blender).
 */
export function feriaSpots() {
    const out = []
    let kind = 0
    // the real island: the middle of the walk has its furniture (BULEVAR_CENTER) — one pavilion in
    // each gap between two pieces, wherever it fits
    const items = BULEVAR_CENTER.items
    if (!CLASSIC && items.length) {
        const ends = [{ x: PEDESTRIAN[0] + 0.4, half: 0.4 }, ...items, { x: PEDESTRIAN[1] - 0.9, half: 0.4 }]
        for (let i = 0; i + 1 < ends.length; i++) {
            const a = ends[i].x + ends[i].half, b = ends[i + 1].x - ends[i + 1].half
            if (b - a < 1.3) continue // (a pavilion is about a metre long)
            // (as many as fit in the gap — two in a long one — spread along it)
            const fit = Math.min(2, Math.floor((b - a) / 1.45))
            for (let k = 0; k < fit; k++) for (const dx of [0, 0.15, -0.15, 0.3, -0.3]) {
                const x = a + ((b - a) * (k + 0.5)) / fit + dx
                const o = 2.2
                const z = riverZ(x) + o
                if (x - 0.55 < a || x + 0.55 > b || onRoad(x, o, 0.6) || o + 0.55 > halfWidthAt(x)) continue
                // (the events' own markers stand in the middle of the walk: a pavilion can be beside one)
                const blocked = SPOTS.some(([sx, sz]) => Math.hypot(sx - x, sz - z) < 1.35 && Math.abs(sz - riverZ(sx) - BULEVAR_MID) > 0.9)
                if (blocked || PROMENADE_TREES.some((t) => Math.hypot(t.x - x, t.z - z) < (t.kind === 'palma' ? 0.45 : 0.62))) continue
                out.push([+x.toFixed(3), +z.toFixed(3), +(yawAt(x) + Math.PI).toFixed(4), kind++ % 2])
                break
            }
        }
        return out
    }
    // (along the pedestrian stretch only; a little tighter on the real island, which is shorter)
    const [xa, xb] = CLASSIC ? [-18.2, 18.5] : [WALK_X[0], WALK_X[1]]
    for (let x0 = xa; x0 < xb; x0 += CLASSIC ? 2.7 : 2.3) {
        for (const dx of [0, 0.35, -0.35, 0.7, -0.7, 1.0]) {
            const x = x0 + dx
            const o = 2.2
            const z = riverZ(x) + o
            if (x < xa || x > xb) continue // (never past the ends of the walk: the tunnel mouths, the Ermita)
            if (Math.abs(x) > 19 || onCrossStreet(x, 0.7) || onRoad(x, o, 0.6) || o + 0.55 > halfWidthAt(x)) continue
            if (SPOTS.some(([a, b]) => Math.hypot(a - x, b - z) < 1.35) || PROMENADE_TREES.some((t) => Math.hypot(t.x - x, t.z - z) < (t.kind === 'palma' ? 0.45 : 0.62))) continue // (a palm's trunk is thin)
            if (out.some(([a]) => Math.abs(a - x) < 1.9)) continue
            out.push([+x.toFixed(3), +z.toFixed(3), +(yawAt(x) + Math.PI).toFixed(4), kind++ % 2])
            break
        }
    }
    return out
}
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') window.__feriaSpots = feriaSpots // dev: scripts/feria-layout.json

// ── Events build themselves up, little by little ───────────────────────────────────
// Every event has a clock: it runs while the event is on and runs back (faster) when it leaves.
// Each element stands up after a delay that grows along the island (east → west), so the whole
// event assembles like dominoes, and dismantles in reverse.
const RISE = 0.6 // s for one element
const delayAt = (x) => (x + 21) * 0.07
const riseOf = (clock, delay) => clamp01((clock.t - delay) / RISE)
function useEventClock(active, instant) {
    const clock = useRef({ t: 0, span: 4 })
    useFrame((_, dt) => {
        const c = clock.current
        const step = Math.min(dt, 0.25) // real time, even on slow computers
        c.t = instant ? c.span : active ? Math.min(c.span, c.t + step) : Math.max(0, c.t - step * 2.6)
    })
    return clock
}
/**
 * A group that stands up (bouncy scale) after `delay`. With `pivot` = [x, z] it grows from that
 * ground point (for children placed in world coordinates); otherwise from its own position.
 */
function Rise({ clock, delay = 0, pivot, children, ...props }) {
    const ref = useRef()
    useFrame(() => {
        const e = Math.max(0.001, backOut(riseOf(clock.current, delay)))
        ref.current.scale.setScalar(e)
        if (pivot) ref.current.position.set(pivot[0] * (1 - e), TOP * (1 - e), pivot[1] * (1 - e))
        ref.current.visible = e > 0.002
    })
    return (
        <group ref={ref} {...props}>
            {children}
        </group>
    )
}
/**
 * Instanced parts that rise with the event clock. Items: { p, s, r?, c?, delay, g?: [x, z] pivot,
 * yaw? } — with `tilt` they stand up like dominoes (rotating up from the floor around their
 * pivot), otherwise they grow from it.
 */
const mA = new THREE.Matrix4(), mB = new THREE.Matrix4()
// (keys: which piece of the event each instance belongs to — the exported GLB of the event keeps
// each piece as one object you can move: scripts/export-models.mjs)
function RiseParts({ geometry, material, items, clock, tilt = false, cast = true, keys }) {
    const ref = useRef()
    const last = useRef(-1)
    const base = useMemo(
        () =>
            items.map((it) => {
                dummy.position.set(...it.p)
                dummy.rotation.set(...(it.r ?? [0, 0, 0]))
                dummy.scale.set(...it.s)
                dummy.updateMatrix()
                return dummy.matrix.clone()
            }),
        [items]
    )
    useLayoutEffect(() => {
        if (!ref.current) return
        const color = new THREE.Color()
        items.forEach((it, i) => it.c && ref.current.setColorAt(i, color.set(it.c)))
        if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
        last.current = -1
    }, [items])
    useFrame(() => {
        const t = clock.current.t
        if (!ref.current || t === last.current) return
        last.current = t
        items.forEach((it, i) => {
            const f = riseOf(clock.current, it.delay ?? 0)
            const e = Math.max(0.0001, backOut(f))
            const gx = it.g ? it.g[0] : it.p[0], gz = it.g ? it.g[1] : it.p[2]
            mA.makeTranslation(gx, TOP, gz)
            if (tilt) {
                const yaw = it.yaw ?? 0
                mA.multiply(mB.makeRotationY(yaw)).multiply(mB.makeRotationX((1 - e) * (Math.PI / 2))).multiply(mB.makeScale(Math.min(1, f * 4) || 0.0001, Math.min(1, f * 4) || 0.0001, Math.min(1, f * 4) || 0.0001)).multiply(mB.makeRotationY(-yaw))
            } else mA.multiply(mB.makeScale(e, e, e))
            mA.multiply(mB.makeTranslation(-gx, -TOP, -gz)).multiply(base[i])
            ref.current.setMatrixAt(i, mA)
        })
        ref.current.instanceMatrix.needsUpdate = true
    })
    if (!items.length) return null
    return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow={cast} receiveShadow frustumCulled={false} userData={keys ? { keys } : undefined} />
}

/**
 * An event only exists while it's on: built when chosen, kept while it dismantles, then freed
 * (memory stays low on modest computers).
 */
// (instant: all of it standing at once — for the export of its GLB)
export function EventRoot({ active, instant = false, children }) {
    const clock = useEventClock(active, instant)
    const group = useRef()
    const [mounted, setMounted] = useState(false)
    if (active && !mounted) setMounted(true)
    useFrame(() => {
        if (group.current) group.current.visible = clock.current.t > 0
        if (!active && mounted && clock.current.t === 0) setMounted(false)
    })
    return (
        <group ref={group} visible={false}>
            {mounted && children(clock)}
        </group>
    )
}

// ════════════════════════════════════════════════════════════════════════════════
// FERIA DEL LIBRO — the fair's pavilions along the walkway (Assets/modelos/evento_feria_del_libro.glb:
// white tents with the red gable of the "Pabellón de libros", orange panels at the entrance, the
// red "Libro Cali" totem in front and strings of coloured pennants), in Chonti's clay. The GLB
// says where each pavilion is (move them in Blender); each one stands up in turn along the island,
// and leaves flutter over it.
// ════════════════════════════════════════════════════════════════════════════════
// (each island has its own layout of the pavilions: the classic one is kept in models/clasica)
const FERIA_URL = CLASSIC ? 'models/clasica/evento_feria_del_libro.glb' : 'models/evento_feria_del_libro.glb'

/**
 * The front of a tent (Assets/feria del libro-NN.png: its gable with the name of the pavilion, its
 * band and its two columns): a picture as wide and as tall as the front of the tent, on it — the
 * front is where its red gable is.
 */
const frontMaterials = new Map()
function tentFront(clay, texture, mirrored) {
    // (by their colour: the white canvas of the tent, and its red gable — whatever their names)
    const hex = (m) => (Array.isArray(m.material) ? m.material[0] : m.material)?.color?.getHexString()
    const body = clay.children.filter((m) => hex(m) === 'f4f2ed').sort((a, b) => new THREE.Box3().setFromObject(b).getSize(v3).length() - new THREE.Box3().setFromObject(a).getSize(v3).length())[0]
    const gable = clay.children.find((m) => hex(m) === 'e5482f')
    if (!body || !gable || !texture) return null
    const b = new THREE.Box3().setFromObject(body), g = new THREE.Box3().setFromObject(gable)
    const bs = b.getSize(new THREE.Vector3()), gs = g.getSize(new THREE.Vector3())
    // (the gable is thin across the front: that is the way the tent looks)
    const alongX = gs.x < gs.z
    const bc = b.getCenter(new THREE.Vector3()), gc = g.getCenter(new THREE.Vector3())
    const side = Math.sign(alongX ? gc.x - bc.x : gc.z - bc.z) || 1
    const w = alongX ? bs.z : bs.x, h = bs.y
    const key = texture.uuid + (mirrored ? 'm' : '')
    if (!frontMaterials.has(key)) {
        const map = texture.clone()
        map.colorSpace = THREE.SRGBColorSpace
        // (seen from outside, the picture reads the right way round — mirrored tents too)
        if (key.endsWith('m')) (map.wrapS = THREE.RepeatWrapping), (map.repeat.x = -1), (map.offset.x = 1)
        map.needsUpdate = true
        frontMaterials.set(key, clayMaterial({ color: '#ffffff', map, speckle: 0.04, speckleScale: 8, rim: 0.12, rimColor: '#FFE3C8', bump: 0.05, warmth: 0.02, sheen: 0.15, sheenColor: '#FFF1E2' }))
        Object.assign(frontMaterials.get(key), { side: THREE.DoubleSide, alphaTest: 0.5, transparent: false })
    }
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), frontMaterials.get(key))
    mesh.name = 'frente_carpa'
    const out = (alongX ? b.max.x - b.min.x : b.max.z - b.min.z) / 2 + 0.004 // (just in front of the tent)
    mesh.position.set(alongX ? bc.x + side * out : bc.x, b.min.y + h / 2, alongX ? bc.z : bc.z + side * out)
    mesh.rotation.y = alongX ? (side > 0 ? Math.PI / 2 : -Math.PI / 2) : side > 0 ? 0 : Math.PI
    return mesh
}
const ISLAND_COPY = /^(_bulevar|arboles|bancas|bulevar_|edificios|hito_|lugar_|postes|ruta_|techos|isla|calle|anden|rio_)/ // (the island that comes with the Feria in its file)
function FeriaDecor({ clock }) {
    const { scene } = useGLTF(FERIA_URL)
    const fronts = useTexture(FERIA_FRONTS.fronts.length ? FERIA_FRONTS.fronts : [])
    const pavilions = useMemo(() => {
        scene.updateMatrixWorld(true)
        const root = scene.getObjectByName('feria_bulevar') ?? scene
        const rand = seeded(23)
        // (and what you added out of its group — the books, the stands —; not the copy of the island
        // that came with it)
        const extra = root === scene ? [] : scene.children.filter((c) => c !== root && (c.isMesh || c.children.length) && !ISLAND_COPY.test(c.name))
        const list = [...root.children.filter((c) => c.children.length || c.isMesh), ...extra]
            .map((c) => {
                // (its pieces in the clay, then the whole pavilion where the GLB puts it)
                const holder = new THREE.Group()
                const clay = clayed(c, { speckleScale: 0.5, fixed: true })
                // (on its front, one of the pictures of the fronts, at random)
                const front = fronts.length && tentFront(clay, fronts[Math.floor(rand() * fronts.length)], c.matrixWorld.determinant() < 0)
                if (front) {
                    clay.add(front)
                    // (the picture brings its own gable and columns: the red gable and the orange
                    // panels of the template, which stood in front of it, go)
                    clay.children.forEach((m) => {
                        const c = (Array.isArray(m.material) ? m.material[0] : m.material)?.color?.getHexString()
                        if (c === 'e5482f' || c === 'f0892b') m.visible = false
                    })
                }
                holder.add(clay)
                c.matrixWorld.decompose(holder.position, holder.quaternion, holder.scale)
                // (a layout made on the ground of the island — yours, on the island — is at its height
                // already: lifted again, it flew)
                if (holder.position.y < TOP * 0.5) holder.position.y += TOP
                return { object: holder, x: holder.position.x, z: holder.position.z }
            })
        // (every tent and decoration exactly where the GLB puts it: none moved, none added)
        return list
    }, [scene, fronts])
    useLayoutEffect(() => {
        clock.current.span = delayAt(21) + RISE + 0.4
    }, [clock])
    return (
        <group>
            {pavilions.map((p, i) => (
                <Rise key={i} clock={clock} delay={delayAt(p.x)} pivot={[p.x, p.z]}>
                    <primitive object={p.object} />
                </Rise>
            ))}
            <FeriaLights pavilions={pavilions} clock={clock} />
            <Leaves clock={clock} />
        </group>
    )
}

/**
 * The Feria when the hour changes towards the evening: every tent lights up from inside — its
 * fabric glows warm, as if lamps were on in it, with a little light spilling on the ground at its
 * entrance — and a few warm lights fill the walk. The more night, the more light. (No bulbs nor
 * balls of light: the light of the tents is enough.)
 */
let feriaGlowTex = null
function feriaGlow() {
    if (feriaGlowTex) return feriaGlowTex
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    r.addColorStop(0, 'rgba(255,255,255,1)')
    r.addColorStop(0.4, 'rgba(255,255,255,0.45)')
    r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r
    g.fillRect(0, 0, 128, 128)
    return (feriaGlowTex = new THREE.CanvasTexture(c))
}
const feriaPoolMat = new THREE.MeshBasicMaterial({ color: '#FFB860', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
const TENT_GLOW = new THREE.Color('#FFB25C')
const groundPlane = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
function FeriaLights({ pavilions, clock }) {
    const { tents, fabrics } = useMemo(() => {
        const tents = [], fabrics = new Set()
        pavilions.forEach((p) => {
            p.object.updateMatrixWorld(true)
            const box = new THREE.Box3().setFromObject(p.object)
            const size = box.getSize(new THREE.Vector3())
            if (size.x > 4 || size.z > 4 || size.y < 0.2) return // (a string of pennants, not a tent)
            const c = box.getCenter(new THREE.Vector3())
            tents.push({ c: [c.x, box.min.y + size.y * 0.45, c.z], w: Math.max(size.x, size.z), floor: box.min.y, delay: delayAt(p.x) + 0.5 })
            // its fabric: the light parts of it (the white tents, the panels), not the dark wood
            p.object.traverse((o) => {
                if (!o.isMesh) return
                for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
                    if (!m?.color || !('emissive' in m)) continue
                    const c2 = m.color
                    if (0.2126 * c2.r + 0.7152 * c2.g + 0.0722 * c2.b > 0.35 || m.map) fabrics.add(m)
                }
            })
        })
        fabrics.forEach((m) => m.emissive.copy(TENT_GLOW))
        return { tents, fabrics: [...fabrics] }
    }, [pavilions])
    const poolRef = useRef()
    const lights = useRef([])
    // three warm lights spread along the fair (no more: lights are costly)
    const fill = useMemo(() => {
        if (!tents.length) return []
        const xs = tents.map((t) => t.c[0]).sort((a, b) => a - b)
        return [0.2, 0.5, 0.8].map((q) => tents.reduce((best, t) => (Math.abs(t.c[0] - xs[Math.floor(q * (xs.length - 1))]) < Math.abs(best.c[0] - xs[Math.floor(q * (xs.length - 1))]) ? t : best)))
    }, [tents])
    useLayoutEffect(() => {
        feriaPoolMat.map = feriaGlow()
        return () => fabrics.forEach((m) => (m.emissiveIntensity = 0))
    }, [fabrics])
    useFrame(({ clock: c }) => {
        const night = THREE.MathUtils.smoothstep(skyState.night, 0.12, 0.7)
        const t = c.elapsedTime
        // (the fabric lit from inside, breathing a little like real lamps behind cloth)
        const glow = night * (0.42 + 0.04 * Math.sin(t * 1.7))
        fabrics.forEach((m) => (m.emissiveIntensity = glow))
        const p = poolRef.current
        if (p) {
            tents.forEach((tn, i) => {
                const e = riseOf(clock.current, tn.delay)
                dummy.position.set(tn.c[0], tn.floor + 0.02, tn.c[2])
                dummy.rotation.set(0, 0, 0)
                dummy.scale.set(tn.w * 1.5 * e + 0.0001, 1, tn.w * 1.5 * e + 0.0001)
                dummy.updateMatrix()
                p.setMatrixAt(i, dummy.matrix)
            })
            p.instanceMatrix.needsUpdate = true
        }
        feriaPoolMat.opacity = night * 0.35
        lights.current.forEach((l) => l && (l.intensity = night * 3.5))
    })
    if (!tents.length) return null
    return (
        <group name="feria_luces">
            <instancedMesh ref={poolRef} args={[groundPlane, feriaPoolMat, tents.length]} frustumCulled={false} renderOrder={2} />
            {fill.map((tn, i) => (
                <pointLight key={i} ref={(l) => (lights.current[i] = l)} position={[tn.c[0], tn.c[1] + 0.8, tn.c[2]]} color="#FFC27A" intensity={0} distance={6} decay={1.6} />
            ))}
        </group>
    )
}
useGLTF.preload(FERIA_URL)

// leaves (and guayacán petals) fluttering over the boulevard
const leafGeometry = (() => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.5)
    s.quadraticCurveTo(0.38, -0.1, 0, 0.5)
    s.quadraticCurveTo(-0.38, -0.1, 0, -0.5)
    return new THREE.ShapeGeometry(s, 4)
})()
const leafMaterial = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.8 })
const LEAF_COLORS = [PALETTE.verde, PALETTE.lima, shade(PALETTE.verde, 0.75), PALETTE.mango, PALETTE.naranja, PALETTE.rosa, mix(PALETTE.lima, PALETTE.mango, 0.5)]

function Leaves({ clock }) {
    const mesh = useRef()
    const leaves = useMemo(() => {
        const rand = seeded(17)
        return Array.from({ length: 200 }, (_, i) => {
            const x = (rand() - 0.5) * 40
            return {
                x, z: riverZ(x) + (rand() - 0.5) * 10, y: TOP + rand() * 6,
                fall: 0.25 + rand() * 0.35, swirl: 0.3 + rand() * 0.6, phase: rand() * 10, spin: 1 + rand() * 3,
                size: 0.1 + rand() * 0.08, c: LEAF_COLORS[i % LEAF_COLORS.length],
            }
        })
    }, [])
    useLayoutEffect(() => {
        const color = new THREE.Color()
        leaves.forEach((l, i) => mesh.current.setColorAt(i, color.set(l.c)))
        mesh.current.instanceColor.needsUpdate = true
    }, [leaves])
    useFrame(({ clock: c }, dt) => {
        const amount = clamp01(clock.current.t / 1.5)
        mesh.current.visible = amount > 0.01
        if (!mesh.current.visible) return
        const t = c.elapsedTime
        const step = Math.min(dt, 0.05)
        leaves.forEach((l, i) => {
            l.y -= l.fall * step
            l.x += 0.45 * step // the breeze along the river
            if (l.y < TOP + 0.05) {
                l.y = TOP + 5 + Math.random() * 2
                l.x = (Math.random() - 0.5) * 40
                l.z = riverZ(l.x) + (Math.random() - 0.5) * 10
            }
            if (l.x > 21) l.x -= 42
            dummy.position.set(l.x + Math.sin(t * 0.9 + l.phase) * l.swirl, l.y, l.z + Math.cos(t * 0.7 + l.phase) * l.swirl * 0.6)
            dummy.rotation.set(t * l.spin * 0.7 + l.phase, t * l.spin + l.phase, Math.sin(t * 2 + l.phase) * 0.8)
            dummy.scale.setScalar(l.size * amount)
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
        })
        mesh.current.instanceMatrix.needsUpdate = true
    })
    return <instancedMesh ref={mesh} args={[leafGeometry, leafMaterial, leaves.length]} frustumCulled={false} />
}

// ════════════════════════════════════════════════════════════════════════════════
// ALUMBRADO: strings of lights between the street lamps (all along the Bulevar, fewer elsewhere),
// little lights along the roof of every building and in the crowns of the trees by the river,
// Christmas trees in the middle of the walk, arches of stars over it, star posts and the river full
// of lotus flowers of light — lighting up one by one, every light with its glow around it.
// ════════════════════════════════════════════════════════════════════════════════
const bulbMaterial = new THREE.MeshBasicMaterial({ toneMapped: false })
const LIGHT = { warm: '#FFE2A8', white: '#FFF6E2', gold: PALETTE.mango, pink: PALETTE.rosa, lime: PALETTE.lima }

/** The lights of the models shine fully: their see-through glass (faint at night) becomes solid light. */
const litCache = new Map()
function litSwap(orig, clay) {
    const g = glowSwap(orig, clay)
    if (g === clay) return clay
    if (!litCache.has(g)) {
        const m = Object.assign(g.clone(), { transparent: false, opacity: 1, depthWrite: true })
        m.userData.lit = true
        litCache.set(g, m)
    }
    return litCache.get(g)
}

// ── The glow around the lights: soft round points that add their light ─────────────
const haloShader = {
    vertexShader: /* glsl */ `
        attribute vec3 aColor;
        attribute float aDelay;
        uniform float uT, uSize, uViewH, uTime;
        varying vec3 vColor;
        varying float vA;
        void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            mv.xyz -= normalize(mv.xyz) * uSize * 0.5; // (a little towards you: the wall or the water it sits on doesn't cut it)
            gl_Position = projectionMatrix * mv;
            float on = clamp((uT - aDelay) / 0.6, 0.0, 1.0); // (lights up with its light, like the rest)
            vA = on * (0.72 + 0.28 * sin(uTime * 2.6 + aDelay * 9.0));
            vColor = aColor;
            gl_PointSize = on > 0.0 ? uSize * projectionMatrix[1][1] * uViewH * 0.5 / -mv.z : 0.0;
        }
    `,
    fragmentShader: /* glsl */ `
        uniform float uStrength;
        varying vec3 vColor;
        varying float vA;
        void main() {
            float d = max(0.0, 1.0 - length(gl_PointCoord - 0.5) * 2.0);
            float a = d * d * d * vA * uStrength; // (bright in the middle, fading to nothing)
            if (a < 0.004) discard;
            gl_FragColor = vec4(linearToOutputTexel(vec4(vColor, 1.0)).rgb * a, 1.0);
        }
    `,
}
/** Glows: points { p: [x, y, z], c (colour), delay } — size: how wide one is (world units). */
function Halos({ points, clock, size = 0.2, strength = 0.9 }) {
    const { geometry, material } = useMemo(() => {
        const g = new THREE.BufferGeometry()
        const pos = new Float32Array(points.length * 3), col = new Float32Array(points.length * 3), del = new Float32Array(points.length)
        const c = new THREE.Color()
        points.forEach((p, i) => {
            pos.set(p.p, i * 3)
            c.set(p.c ?? LIGHT.warm)
            col.set([c.r, c.g, c.b], i * 3)
            del[i] = p.delay ?? 0
        })
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
        g.setAttribute('aDelay', new THREE.BufferAttribute(del, 1))
        const uniforms = { uT: { value: 0 }, uSize: { value: size }, uViewH: { value: 800 }, uTime: { value: 0 }, uStrength: { value: strength } }
        const m = new THREE.ShaderMaterial({ ...haloShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
        return { geometry: g, material: m }
    }, [points, size, strength])
    useEffect(() => () => (geometry.dispose(), material.dispose()), [geometry, material])
    useFrame(({ gl, clock: c }) => {
        material.uniforms.uT.value = clock.current.t
        material.uniforms.uTime.value = c.elapsedTime
        material.uniforms.uViewH.value = gl.domElement.height
    })
    if (!points.length) return null
    return <points geometry={geometry} material={material} frustumCulled={false} />
}
/** Some points of the shining parts of a model (its own units, with their colour), `n` at most. */
function litSpots(parts, n) {
    const pts = []
    for (const p of parts) {
        if (!p.mat.userData.lit) continue
        const a = p.geo.attributes.position
        for (let i = 0; i < a.count; i++) pts.push({ v: [a.getX(i), a.getY(i), a.getZ(i)], c: p.mat.color })
    }
    const step = Math.max(1, Math.floor(pts.length / n))
    return pts.filter((_, i) => i % step === 0).slice(0, n)
}
/** Those points on every item ({ p, s, r: [0, yaw, 0], delay }) of the model. */
const v3 = new THREE.Vector3()
function spotsOn(spots, items) {
    return items.flatMap((it) => spots.map(({ v, c }) => {
        v3.set(...v).multiplyScalar(it.s[0]).applyAxisAngle(UP_Y, it.r[1])
        return { p: [it.p[0] + v3.x, it.p[1] + v3.y, it.p[2] + v3.z], c, delay: it.delay + 0.2 }
    }))
}
const UP_Y = new THREE.Vector3(0, 1, 0)

/**
 * Where everything of the Alumbrado goes (the models are Assets/modelos: tira_luces, arbol_navidad,
 * decoracion_camino, poste_estrella, decoracion_rio):
 *  - tiras: a string of lights between two street lamps — every gap on the Bulevar and across its
 *    walk, one of every two on the other streets of the map
 *  - trees: Christmas trees in the middle of the walk, in the gaps between its furniture
 *  - stars: the red and green stars, one and one, standing on the ciclorruta every so often
 *  - posts: the posts with a star, a few on the walk and a few along the streets
 *  - rings: little lights in the crowns of the trees by the river
 * (the river: decoracion_rio repeated along the whole Río Cali, <RiverLights />; the lights on the
 * roofs of the buildings: <BuildingLights />)
 */
// (your Alumbrado as you arranged it: Assets/modelos/evento_alumbrado.glb → scripts/alumbrado-layout.py)
const ALU_TUYO = !CLASSIC && (ALU_LAYOUT.trees?.length || ALU_LAYOUT.tiras?.length || ALU_LAYOUT.stars?.length) > 0
const LAMP_TOP = 0.5 // (where a string hangs from a street lamp: just under its head)
const STAR_GAP = 1.15 // (one star every so much ciclorruta)
const BIKE_MID = (ZONES.bikeLane[0] + ZONES.bikeLane[1]) / 2 // (the middle of the ciclorruta)
function buildAlumbrado() {
    const tiras = [], trees = [], stars = [], posts = [], rings = []
    // (your Alumbrado as you arranged it — Assets/modelos/evento_alumbrado.glb → alumbrado.json —: its
    // Christmas trees, stars, star posts and strings where you left them; the lights of the roofs and
    // of the crowns, on the buildings and trees as they are now)
    if (ALU_TUYO) {
        for (const { a, b } of ALU_LAYOUT.tiras) {
            const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz)
            if (L > 0.1) tiras.push({ p: [a[0], a[1], a[2]], s: [L, L, L], r: [0, Math.atan2(-dz, dx), 0], g: [(a[0] + b[0]) / 2, (a[2] + b[2]) / 2], delay: delayAt(a[0]) + 0.25 })
        }
        ALU_LAYOUT.trees.forEach((t) => trees.push({ x: t.x, z: t.z, h: t.h, yaw: t.x + t.yaw, delay: delayAt(t.x) + 0.1 }))
        ALU_LAYOUT.stars.forEach((s, n) => stars.push({ x: s.x, z: s.z, y: STAR_H / 2, kind: n % 2, n, delay: delayAt(s.x) + 0.15 }))
        ALU_LAYOUT.posts.forEach((p) => posts.push({ x: p.x, z: p.z, h: p.h, yaw: yawAt(p.x) + p.yaw, delay: delayAt(p.x) + 0.15 }))
        crownLights(rings)
        return { tiras, trees, stars, posts, rings }
    }
    const tira = (a, b) => {
        const dx = b.x - a.x, dz = b.z - a.z
        const L = Math.hypot(dx, dz)
        if (L < 0.3) return
        tiras.push({ p: [a.x, TOP + LAMP_TOP, a.z], s: [L, L, L], r: [0, Math.atan2(-dz, dx), 0], g: [(a.x + b.x) / 2, (a.z + b.z) / 2], delay: delayAt(a.x) + 0.25 })
    }
    const rows = {}
    STREET_LAMPS.forEach((l) => (rows[l.row] ??= []).push(l))
    // on the Bulevar the light gathers: strings all along both sides of the walk, hung from its
    // lamps AND its trees (the palms by the river, the trees by the ciclorruta)
    const anchors = (row, o0, o1) =>
        [...(rows[row] ?? []), ...PROMENADE_TREES.filter((t) => onPedestrian(t.x) && t.z - riverZ(t.x) > o0 && t.z - riverZ(t.x) < o1)].sort((p, q) => p.x - q.x)
    const walkRiver = CLASSIC ? [] : anchors('bulevar-river', 0.9, 1.8)
    const walkEdge = CLASSIC ? [] : anchors('bulevar-edge', 3.3, 4.0)
    for (const list of [walkRiver, walkEdge]) list.forEach((l, i) => i && Math.hypot(l.x - list[i - 1].x, l.z - list[i - 1].z) < 4.6 && tira(list[i - 1], l))
    // …and across the walk, where its middle is clear (no furniture nor Christmas tree under them)
    const clear = (x) => !BULEVAR_CENTER.items.some((it) => Math.abs(x - it.x) < it.half + 0.25)
    walkRiver.forEach((l) => {
        const m = walkEdge.find((q) => Math.abs(q.x - l.x) < 0.9)
        if (m && clear((l.x + m.x) / 2)) tira(l, m)
    })
    // the other streets of the map: one of every two gaps between their lamps
    Object.entries(rows).forEach(([row, list]) => {
        if (row.startsWith('bulevar') && !CLASSIC) return
        const sorted = row.startsWith('calle') ? list.sort((p, q) => p.o - q.o) : list.sort((p, q) => p.x - q.x)
        sorted.forEach((l, i) => {
            if (!i || (!row.startsWith('bulevar') && i % 2)) return
            const p = sorted[i - 1]
            if (Math.hypot(l.x - p.x, l.z - p.z) < 5) tira(p, l)
        })
    })
    const across = (r1, r2, every = 1) => {
        const other = rows[r2] ?? []
        ;(rows[r1] ?? []).forEach((l, i) => {
            if (i % every) return
            const m = other.find((q) => Math.abs(q.x - l.x) < 0.8 && (q.o == null || Math.abs(q.o - l.o) < 0.5))
            if (m) tira(l, m)
        })
    }
    if (CLASSIC) across('bulevar-river', 'bulevar-edge') // over the walk
    across('av1n-river', 'av1n-out', 2) // over the Avenida 1 Norte
    across('cra3-in', 'cra3-out', 2) // over the Carrera 3
    CROSS_STREETS.forEach((_, ci) => across(`calle${ci}w`, `calle${ci}e`, 2)) // over the calles

    // the Christmas trees: in the middle of the walk, in the gaps between its furniture
    const items = BULEVAR_CENTER.items
    if (!CLASSIC && items.length) {
        // (in the gaps with room for one — not between a module and its long bench, end to end)
        const gaps = []
        for (let i = 0; i + 1 < items.length; i++) {
            const a = items[i].x + items[i].half, b = items[i + 1].x - items[i + 1].half
            if (b - a < 1.1) continue
            // (moved along its gap off the palms and trees of the walk: one went through the Christmas tree)
            const free = (x) => !PROMENADE_TREES.some((t) => Math.hypot(t.x - x, t.z - riverZ(x) - BULEVAR_MID) < 0.8)
            const x = [0, 0.4, -0.4, 0.8, -0.8, 1.1, -1.1].map((d) => (a + b) / 2 + d).find((x) => x - 0.45 > a && x + 0.45 < b && free(x))
            if (x != null) gaps.push(x)
        }
        // (five, spread along the walk — the one nearest the Alumbrado's marker stays clear)
        const marker = EVENTS.find((e) => e.id === 'alumbrado')?.position[0] ?? 0
        const pick = gaps.filter((x) => Math.abs(x - marker) > 1).slice(0, 5)
        pick.forEach((x) => trees.push({ x, z: riverZ(x) + BULEVAR_MID, delay: delayAt(x) + 0.1 }))
        // the stars of the path: standing on the ground of the ciclorruta (where the MIO used to run),
        // one after another every so often, red and green by turns
        let n = 0
        for (let x = PEDESTRIAN[0] + 1.0; x < PEDESTRIAN[1] - 0.4; x += STAR_GAP) {
            if (onCrossStreet(x, 0.3)) continue
            stars.push({ x, z: riverZ(x) + BIKE_MID, y: STAR_H / 2, kind: n % 2, n: n++, delay: delayAt(x) + 0.15 })
        }
    } else {
        findSpots({ x: WALK_X, o: WALK, r: 0.45, n: 7, gap: 3.6, seed: 47 }).forEach(([x, z]) => trees.push({ x, z, delay: delayAt(x) + 0.1 }))
    }
    // the star posts: a few on the walk (between the lamps by the ciclorruta), a few along the streets
    const between = (row, every, off = 0, list = (rows[row] ?? []).slice().sort((p, q) => p.x - q.x)) => {
        list.forEach((l, i) => {
            if (!i || (i + off) % every) return
            const p = list[i - 1]
            const x = (p.x + l.x) / 2, z = (p.z + l.z) / 2
            if (Math.hypot(l.x - p.x, l.z - p.z) > 5 || PROMENADE_TREES.some((t) => Math.hypot(t.x - x, t.z - z) < 0.45) || STREET_LAMPS.some((t) => Math.hypot(t.x - x, t.z - z) < 0.3)) return
            posts.push({ x, z, delay: delayAt(x) + 0.15 })
        })
    }
    between(null, 3, 0, walkEdge) // (a few on the walk, by the ciclorruta)
    between('av1n-river', 3, 1)
    between('av1n-out', 4, 2)
    between('norte2', 3, 1)
    between('cra3-out', 2, 1)

    crownLights(rings)
    return { tiras, trees, stars, posts, rings }
}
// a ring of little lights in the crown of every tree along the river (and the palms, under their fronds)
function crownLights(rings) {
    const ring = (x, y, z, r, n, k0, key) => {
        for (let k = 0; k < n; k++) {
            const a = (k / n) * Math.PI * 2
            rings.push({ p: [x + Math.cos(a) * r, TOP + y + Math.sin(a * 3) * 0.04, z + Math.sin(a) * r], s: [0.045, 0.045, 0.045], c: COLORS[((k + k0) % 5) + 1], delay: delayAt(x) + 0.3, key })
        }
    }
    const byRiver = (x, z) => Math.abs(z - riverZ(x)) < 4.2
    // (your trees: in the middle of their crown, as tall as they really are and standing where they are)
    const lift = (t) => t.p[1] - TOP
    CITY.trees.forEach((t, i) => byRiver(t.p[0], t.p[2]) && t.w < 2.5 && ring(t.p[0], t.h ? lift(t) + 0.62 * t.h : 0.69 * t.w, t.p[2], (t.h ? 0.4 : 0.48) * t.w, 10, i, `luces_arbol_${String(i + 1).padStart(3, '0')}`))
    CITY.palms.forEach((t, i) => byRiver(t.p[0], t.p[2]) && ring(t.p[0], lift(t) + 0.8 * t.h, t.p[2], 0.16 * t.h, 8, i, `luces_palmera_${String(i + 1).padStart(2, '0')}`))
}

/**
 * Every building of the city with a string of lights (tira_luces.glb, like the streets) along each
 * edge of its roof, as tall as it really is — your buildings, the landmarks, the route houses: the
 * whole city lit up around the river. (Their strings: in <AlumbradoModels />.)
 */
const NO_LIGHTS = /^(lugar_gato|hito_boulevard_cafe)/ // (they have no lights on top)
function useRoofTiras() {
    const city = useBuildingBoxes()
    // (with your buildings file everything is in it but the landmarks it does not have — the
    // kiosk —; without it, the landmarks and the houses of the route stops too)
    const landmarks = USER_BUILDINGS.length ? LANDMARKS.filter((l) => !inUserBuildings(`hito_${l.model}`)) : LANDMARKS
    const landmarkScenes = landmarks.map((l) => useGLTF(`models/${l.model}.glb`).scene) // eslint-disable-line react-hooks/rules-of-hooks
    return useMemo(() => {
        // (your buildings: along the real edges of their roofs — scripts/edificios-layout.py —, each
        // building of a group its own; on the Tertulia only its lowest roofs, not those on top; not on the
        // Gato nor on the Café Boulevard)
        // (a building drawn lower — BUILDING_HEIGHTS —: its roofs as low as it is)
        const roofY = (it, y) => (BUILDING_HEIGHTS[it.name] ? TOP + (y - TOP) * BUILDING_HEIGHTS[it.name] : y)
        const roofs = USER_BUILDINGS.some((it) => it.roofs)
            ? USER_BUILDINGS.filter((it) => !NO_LIGHTS.test(it.name)).flatMap((it) => (it.roofs ?? []).filter((r) => !/^lugar_tertulia/.test(it.name) || r.y <= Math.min(...it.roofs.map((q) => q.y)) + 0.05).map((r) => ({ x: r.x, z: r.z, yaw: r.yaw, w: r.w, d: r.d, top: roofY(it, r.y), kind: /^hito_/.test(it.name) ? 'landmark' : 'building' })))
            : null
        const boxes = roofs ? [...roofs, ...landmarks.map((l, i) => {
            if (NO_LIGHTS.test(`hito_${l.model}`)) return null
            const s = new THREE.Box3().setFromObject(landmarkScenes[i]).getSize(new THREE.Vector3())
            const long = Math.max(s.x, s.z) || 1
            return { x: l.x, z: l.z, yaw: yawAt(l.x) + ((l.turn ?? 0) * Math.PI) / 180, w: l.size, d: (l.size * Math.min(s.x, s.z)) / long, h: (l.size * s.y) / long, kind: 'landmark' }
        }).filter(Boolean)] : [
            ...city,
            ...landmarks.map((l, i) => {
                const s = new THREE.Box3().setFromObject(landmarkScenes[i]).getSize(new THREE.Vector3())
                const long = Math.max(s.x, s.z) || 1
                return { x: l.x, z: l.z, yaw: yawAt(l.x) + ((l.turn ?? 0) * Math.PI) / 180, w: l.size, d: (l.size * Math.min(s.x, s.z)) / long, h: (l.size * s.y) / long, kind: 'landmark' }
            }),
            ...(USER_BUILDINGS.length ? [] : ALL_STOPS.filter((s) => !s.landmark).map((s) => ({ x: s.position[0], z: s.position[1], yaw: yawAt(s.position[0]), w: 1.0, d: 0.9, h: STOP_HEIGHT[s.placeholder] * 0.6, kind: 'house' }))),
        ]
        const out = []
        boxes.forEach((b, bi) => {
            const cos = Math.cos(b.yaw), sin = Math.sin(b.yaw)
            const at = (lx, lz) => [b.x + lx * cos + lz * sin, b.z - lx * sin + lz * cos]
            const hw = b.w / 2 + 0.03, hd = b.d / 2 + 0.03, y = b.top != null ? b.top + 0.005 : TOP + b.h + 0.005
            const corners = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([lx, lz]) => at(lx, lz))
            const key = `luces_${b.kind === 'landmark' ? 'hito' : 'edificio'}_${String(bi + 1).padStart(3, '0')}`
            corners.forEach(([ax, az], k) => {
                const [bx, bz] = corners[(k + 1) % 4]
                const L = Math.hypot(bx - ax, bz - az)
                if (L < 0.2) return
                out.push({ p: [ax, y, az], s: [L, L, L], r: [0, Math.atan2(-(bz - az), bx - ax), 0], g: [(ax + bx) / 2, (az + bz) / 2], delay: delayAt(ax) + 0.35, key })
            })
        })
        return out
    }, [city, ...landmarkScenes]) // eslint-disable-line react-hooks/exhaustive-deps
}
/** The little lights in the crowns of the trees by the river (they twinkle, in two groups). */
const twinkleA = new THREE.MeshBasicMaterial({ toneMapped: false })
const twinkleB = new THREE.MeshBasicMaterial({ toneMapped: false })
function BuildingLights({ clock, rings }) {
    const { lightsA, lightsB, halos } = useMemo(() => ({ lightsA: rings.filter((_, i) => i % 2 === 0), lightsB: rings.filter((_, i) => i % 2 === 1), halos: rings }), [rings])
    useFrame(({ clock: c }) => {
        const t = c.elapsedTime
        twinkleA.color.setScalar(0.7 + 0.3 * Math.max(0, Math.sin(t * 2.6)))
        twinkleB.color.setScalar(0.7 + 0.3 * Math.max(0, Math.sin(t * 2.6 + Math.PI)))
    })
    return (
        <>
            <RiseParts clock={clock} geometry={geo.bulb} material={twinkleA} items={lightsA} cast={false} keys={lightsA.map((l) => l.key)} />
            <RiseParts clock={clock} geometry={geo.bulb} material={twinkleB} items={lightsB} cast={false} keys={lightsB.map((l) => l.key)} />
            <Halos points={halos} clock={clock} size={0.12} strength={0.8} />
        </>
    )
}

// ── The models of the Alumbrado ─────────────────────────────────────────────────
const ALU = (n) => `models/${n}.glb`
const ALU_MODELS = ['tira_luces', 'arbol_navidad', 'decoracion_camino', 'poste_estrella', 'decoracion_rio']
/** A model's parts, each risen like the rest of the event at every one of `items`. */
function ModelRise({ parts, items, clock, keys }) {
    return parts.map((p, i) => <RiseParts key={i} clock={clock} geometry={p.geo} material={p.mat} items={items} cast={false} keys={keys} />)
}
const keysOf = (name, list, of = (_, i) => i) => list.map((it, i) => `${name}_${String(of(it, i) + 1).padStart(2, '0')}`)
const TREE_H = 1.6, STAR_H = 0.34, POST_H = 0.85
/** The bulbs of a string: the bulb of tira_luces, always the same size, hung along its cable, each a colour. */
const tiraBulbMat = new THREE.MeshBasicMaterial({ toneMapped: false })
const BULB_COLORS = [PALETTE.rosa, PALETTE.mango, PALETTE.lima, LIGHT.warm, PALETTE.naranja, LIGHT.white]
const BULB_GAP = 0.22 // (one bulb every so much cable)
const BULB_SIZE = 0.09 // (how tall a bulb is)
/**
 * tira_luces.glb: its cable in one length unit, from its first end (at the origin) to the other
 * (at x = 1), hanging as in the model (yAt: its height along it); and its bulb on its own, one unit
 * tall, its top at the origin (it is hung along the cable at its real size: BULB_SIZE).
 */
function tiraParts(scene) {
    const pieces = bakedPieces(scene, 16)
    const cable = pieces.filter((p) => /Curva/.test(p.name))
    const bulb = pieces.filter((p) => !/Curva/.test(p.name))
    // the ends of the cable: its two points furthest apart along it
    const v = new THREE.Vector3()
    const pts = []
    for (const p of cable) for (let i = 0; i < p.geo.attributes.position.count; i++) pts.push(v.fromBufferAttribute(p.geo.attributes.position, i).clone())
    const box = new THREE.Box3().setFromPoints(pts), size = box.getSize(new THREE.Vector3())
    const alongZ = size.z >= size.x
    const a = pts.reduce((m, p) => ((alongZ ? p.z > m.z : p.x < m.x) ? p : m), pts[0])
    const b = pts.reduce((m, p) => ((alongZ ? p.z < m.z : p.x > m.x) ? p : m), pts[0])
    const L = Math.hypot(b.x - a.x, b.z - a.z) || 1
    const m4 = new THREE.Matrix4().makeScale(1 / L, 1 / L, 1 / L)
        .multiply(new THREE.Matrix4().makeRotationY(Math.atan2(-(b.z - a.z), b.x - a.x) * -1))
        .multiply(new THREE.Matrix4().makeTranslation(-a.x, -a.y, -a.z))
    const cableParts = merged(cable.map((p) => ({ ...p, geo: p.geo.clone() })), m4)
    // the height of the cable along it (its lowest point at each tenth)
    const local = pts.map((p) => p.clone().applyMatrix4(m4))
    const yAt = (u) => {
        const near = local.filter((p) => Math.abs(p.x - u) < 0.04)
        return near.length ? Math.min(...near.map((p) => p.y)) : 0
    }
    // the bulb: centred, its top at the origin, one unit tall
    const bb = new THREE.Box3()
    bulb.forEach((p) => (p.geo.computeBoundingBox(), bb.union(p.geo.boundingBox)))
    const bc = bb.getCenter(new THREE.Vector3()), bh = bb.max.y - bb.min.y || 1
    const bulbParts = bulb.map((piece) => {
        const glow = glowSwap(piece.orig, piece.mat) !== piece.mat
        return { geo: piece.geo.clone().translate(-bc.x, -bb.max.y, -bc.z).scale(1 / bh, 1 / bh, 1 / bh), mat: glow ? tiraBulbMat : piece.mat, glow }
    })
    return { cable: cableParts, bulb: bulbParts, yAt }
}
/** The bulbs along each string (instances of the bulb, at their real size, each one a colour). */
function tiraBulbs(tiras, yAt) {
    const out = []
    let k = 0
    tiras.forEach((t, ti) => {
        const L = t.s[0], yaw = t.r[1]
        const n = Math.max(2, Math.round(L / BULB_GAP))
        for (let i = 0; i < n; i++) {
            const u = (i + 0.5) / n
            const along = u * L
            out.push({
                p: [t.p[0] + Math.cos(yaw) * along, t.p[1] + yAt(u) * L - 0.004, t.p[2] - Math.sin(yaw) * along],
                s: [BULB_SIZE, BULB_SIZE, BULB_SIZE], r: [0, yaw, 0], g: t.g, delay: t.delay + u * 0.25,
                c: BULB_COLORS[k++ % BULB_COLORS.length], ti,
            })
        }
    })
    return out
}
/** decoracion_camino.glb has two stars side by side: each one alone, standing, one unit high, facing +z. */
function starParts(scene) {
    const pieces = bakedPieces(scene, 16)
    const cx = pieces.reduce((s, p) => (p.geo.computeBoundingBox(), s + p.geo.boundingBox.getCenter(new THREE.Vector3()).x), 0) / pieces.length
    return [0, 1].map((side) => {
        const own = pieces.filter((p) => (p.geo.boundingBox.getCenter(new THREE.Vector3()).x < cx) === (side === 0)).map((p) => ({ ...p, geo: p.geo.clone() }))
        const box = new THREE.Box3()
        own.forEach((p) => box.union(p.geo.boundingBox))
        const c = box.getCenter(new THREE.Vector3()), h = box.max.y - box.min.y || 1
        const size = box.getSize(new THREE.Vector3())
        const m4 = new THREE.Matrix4().makeScale(1 / h, 1 / h, 1 / h)
            .multiply(new THREE.Matrix4().makeRotationY(size.z > size.x ? Math.PI / 2 : 0)) // (its face to +z)
            .multiply(new THREE.Matrix4().makeTranslation(-c.x, -box.min.y, -c.z))
        return merged(own, m4, litSwap)
    })
}
/**
 * The stars of the arches: each one always shows its face (it turns to the camera), so it reads as
 * a star from anywhere; they come up one after another along the arch.
 */
const STAR_GLOW = ['#FF6A55', '#6BFF8E'] // (red, green)
function StarArches({ stars, parts, clock }) {
    const meshes = useRef([[], []])
    const byKind = useMemo(() => [0, 1].map((k) => stars.filter((s) => s.kind === k)), [stars])
    useFrame(({ camera }) => {
        byKind.forEach((list, k) => {
            list.forEach((s, i) => {
                const e = Math.max(0.0001, backOut(riseOf(clock.current, s.delay)))
                dummy.position.set(s.x, TOP + Math.max(0, s.y - STAR_H / 2), s.z)
                dummy.rotation.set(0, Math.atan2(camera.position.x - s.x, camera.position.z - s.z), 0)
                dummy.scale.setScalar(STAR_H * e)
                dummy.updateMatrix()
                for (const m of meshes.current[k]) m?.setMatrixAt(i, dummy.matrix)
            })
            for (const m of meshes.current[k]) if (m) m.instanceMatrix.needsUpdate = true
        })
    })
    const halos = useMemo(() => stars.map((s) => ({ p: [s.x, TOP + Math.max(STAR_H / 2, s.y), s.z], c: STAR_GLOW[s.kind], delay: s.delay + 0.1 })), [stars])
    return (
        <>
            {parts.map((list, k) => list.map((p, i) => <instancedMesh key={`${k}-${i}`} ref={(m) => (meshes.current[k][i] = m)} args={[p.geo, p.mat, byKind[k].length]} frustumCulled={false} userData={{ keys: keysOf('estrella_camino', byKind[k], (s) => s.n) }} />))}
            <Halos points={halos} clock={clock} size={0.42} strength={0.7} />
        </>
    )
}
/**
 * The stars of the path as they are in your Alumbrado (Assets/modelos/evento_alumbrado.glb →
 * public/models/alumbrado_estrellas.glb): their shape, where you left them, turned and as big as you
 * made them — they stay as they are, they do not turn to the camera. Their lights shine; each one
 * comes up after the one before.
 */
const STARS_TUYAS = ALU_TUYO && MODELOS.models.includes('alumbrado_estrellas')
const STAR_SCALE = 0.75
const starLitCache = new Map()
const starLit = (c) => {
    const k = c.getHexString()
    if (!starLitCache.has(k)) starLitCache.set(k, Object.assign(new THREE.MeshBasicMaterial({ color: c.clone(), toneMapped: false, side: THREE.DoubleSide }), { userData: { lit: true } }))
    return starLitCache.get(k)
}
function UserStars({ clock }) {
    const { scene } = useGLTF('models/alumbrado_estrellas.glb')
    const { stars, halos } = useMemo(() => {
        const copy = scene.clone(true)
        // (the file brings no normals)
        copy.traverse((o) => {
            if (!o.isMesh) return
            const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()
            g.computeVertexNormals()
            o.geometry = g
        })
        const byStar = new Map()
        for (const p of bakedPieces(copy, 16)) {
            const key = /^estrella_camino_\d+/.exec(p.name)?.[0] ?? p.name
            const mat = p.orig?.isMeshBasicMaterial ? starLit(p.orig.color) : p.mat
            if (!byStar.has(key)) byStar.set(key, [])
            byStar.get(key).push({ geo: p.geo, mat })
        }
        const halos = []
        const stars = [...byStar].map(([key, parts]) => {
            const box = new THREE.Box3()
            parts.forEach((p) => (p.geo.computeBoundingBox(), box.union(p.geo.boundingBox)))
            const c = box.getCenter(new THREE.Vector3())
            // (one going through a Christmas tree or a bench: a little along its path, just enough)
            const hits = (dx) =>
                ALU_LAYOUT.trees.some((t) => Math.hypot(t.x - (c.x + dx), t.z - c.z) < 0.28 * t.h + (box.max.x - box.min.x) / 2) ||
                USER_FURNITURE.some(([x0, z0, x1, z1]) => box.min.x + dx < x1 && box.max.x + dx > x0 && box.min.z < z1 && box.max.z > z0)
            const dx = hits(0) ? Array.from({ length: 30 }, (_, i) => (Math.floor(i / 2) + 1) * 0.05 * (i % 2 ? -1 : 1)).find((d) => !hits(d)) ?? 0 : 0
            const delay = delayAt(c.x) + 0.15
            // (a little smaller than in the file, from its foot: big, they ran into the buildings)
            const k = STAR_SCALE, by = box.min.y
            halos.push(...litSpots(parts, 6).map(({ v, c: col }) => ({ p: [c.x + dx + (v[0] - c.x) * k, by + (v[1] - by) * k, c.z + (v[2] - c.z) * k], c: col, delay: delay + 0.1 })))
            return { key, parts, pivot: [c.x + dx, c.z], dx, delay, foot: [c.x, by, c.z] }
        })
        return { stars, halos }
    }, [scene])
    return (
        <>
            {stars.map((s) => (
                <Rise key={s.key} clock={clock} delay={s.delay} pivot={s.pivot} name={s.key}>
                    <group position={[s.foot[0] + s.dx, s.foot[1], s.foot[2]]} scale={STAR_SCALE}>
                        <group position={[-s.foot[0], -s.foot[1], -s.foot[2]]}>{s.parts.map((p, i) => <mesh key={i} geometry={p.geo} material={p.mat} />)}</group>
                    </group>
                </Rise>
            ))}
            <Halos points={halos} clock={clock} size={0.42} strength={0.7} />
        </>
    )
}
/**
 * Cascades of Christmas lights: curtains of bulbs hanging from the roof down the two long facades
 * of some buildings (one of every three), strands of different lengths like icicles, with a glow
 * that runs down each strand. `edges`: the strings along the roofs (useRoofTiras).
 */
// (thousands of tiny bulbs: a 20-face bead looks just as round as a sphere at their size, and the
// drop of light running down each strand is worked out on the graphics card, not bulb by bulb here)
const cascadeGeo = new THREE.IcosahedronGeometry(1, 0)
const cascadeTime = { value: 0 }
const cascadeMat = new THREE.MeshBasicMaterial({ toneMapped: false })
cascadeMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = cascadeTime
    shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec2 aWave;\nuniform float uTime;\nvarying float vWave;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWave = max(0.0, sin((aWave.x * 5.0 - uTime * 2.2 + aWave.y) * 1.3));')
    shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vWave;')
        .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= 0.45 + 1.1 * vWave * vWave;')
}
const CASCADE_COLORS = [LIGHT.white, LIGHT.warm, '#BFE6FF', LIGHT.white, PALETTE.mango]
function Cascades({ edges, clock }) {
    const bulbs = useMemo(() => {
        const byKey = new Map()
        for (const e of edges) if (e.key) (byKey.get(e.key) ?? byKey.set(e.key, []).get(e.key)).push(e)
        const rand = seeded(83)
        const out = []
        ;[...byKey.entries()].forEach(([, list], bi) => {
            if (bi % 3 || list.length < 3) return
            // (the middle of the building: where "outwards" is)
            const cx = list.reduce((s, e) => s + e.p[0], 0) / list.length, cz = list.reduce((s, e) => s + e.p[2], 0) / list.length
            const color = CASCADE_COLORS[bi % CASCADE_COLORS.length]
            list.slice().sort((a, b) => b.s[0] - a.s[0]).slice(0, 2).forEach((e) => {
                const L = e.s[0], y = e.p[1]
                const ux = Math.cos(e.r[1]), uz = -Math.sin(e.r[1]) // along the edge
                const mx = e.p[0] + (ux * L) / 2, mz = e.p[2] + (uz * L) / 2
                let nx = -uz, nz = ux // (its normal, turned outwards)
                if ((mx - cx) * nx + (mz - cz) * nz < 0) (nx = -nx), (nz = -nz)
                const drop = THREE.MathUtils.clamp((y - TOP) * 0.55, 0.3, 1.8)
                for (let a = 0.06; a < L - 0.04; a += 0.11) {
                    const len = drop * (0.55 + rand() * 0.45)
                    const phase = rand() * 6
                    for (let d = 0.04; d < len; d += 0.085) {
                        out.push({ p: [e.p[0] + ux * a + nx * 0.035, y - d, e.p[2] + uz * a + nz * 0.035], c: color, k: d / drop, phase, delay: e.delay + 0.2 + d * 0.3 })
                    }
                }
            })
        })
        return out
    }, [edges])
    const ref = useRef()
    const halos = useMemo(() => bulbs.filter((_, i) => i % 5 === 0).map((b) => ({ p: b.p, c: b.c, delay: b.delay })), [bulbs])
    const geometry = useMemo(() => {
        const g = cascadeGeo.clone()
        // (where each bulb is down its strand, and the strand's own beat: for the drop of light)
        g.setAttribute('aWave', new THREE.InstancedBufferAttribute(new Float32Array(bulbs.flatMap((b) => [b.k, b.phase])), 2))
        return g
    }, [bulbs])
    useLayoutEffect(() => {
        const m = ref.current
        if (!m) return
        const col = new THREE.Color()
        bulbs.forEach((b, i) => m.setColorAt(i, col.set(b.c)))
        if (m.instanceColor) m.instanceColor.needsUpdate = true
        return () => geometry.dispose()
    }, [bulbs, geometry])
    const last = useRef(-1)
    useFrame(({ clock: c }) => {
        const m = ref.current
        if (!m) return
        cascadeTime.value = c.elapsedTime
        // (where they are: only while the event builds up or dismantles)
        if (clock.current.t === last.current) return
        last.current = clock.current.t
        bulbs.forEach((b, i) => {
            const e = riseOf(clock.current, b.delay)
            dummy.position.set(b.p[0], b.p[1], b.p[2])
            dummy.rotation.set(0, 0, 0)
            dummy.scale.setScalar(0.022 * Math.max(0.0001, e))
            dummy.updateMatrix()
            m.setMatrixAt(i, dummy.matrix)
        })
        m.instanceMatrix.needsUpdate = true
    })
    if (!bulbs.length) return null
    return (
        <>
            <instancedMesh ref={ref} args={[geometry, cascadeMat, bulbs.length]} frustumCulled={false} name="cascadas_de_luces" />
            <Halos points={halos} clock={clock} size={0.12} strength={0.7} />
        </>
    )
}

function AlumbradoModels({ clock, tiras: streetTiras, trees, stars, posts }) {
    // (the strings of the streets, and those along the roofs of every building)
    const roofTiras = useRoofTiras()
    const tiras = useMemo(() => [...streetTiras, ...roofTiras], [streetTiras, roofTiras])
    const tiraKeys = useMemo(() => tiras.map((t, i) => t.key ?? `tira_luces_${String(i + 1).padStart(2, '0')}`), [tiras])
    const scenes = ALU_MODELS.slice(0, 4).map((n) => useGLTF(ALU(n)).scene) // eslint-disable-line react-hooks/rules-of-hooks
    const [tiraScene, treeScene, starScene, postScene] = scenes
    const tiraP = useMemo(() => tiraParts(tiraScene), [tiraScene])
    const tree = useMemo(() => unitModel(treeScene, { swap: litSwap }), [treeScene])
    const starP = useMemo(() => starParts(starScene), [starScene])
    const post = useMemo(() => poleModel(postScene, { swap: litSwap }), [postScene])
    // (each one as tall as you left it — yours —, or as tall as they are)
    const treeItems = useMemo(() => trees.map((it) => { const k = (it.h ?? TREE_H) / tree.size.y; return { p: [it.x, TOP, it.z], s: [k, k, k], r: [0, it.yaw ?? it.x, 0], delay: it.delay } }), [trees, tree])
    const postItems = useMemo(() => posts.map((it) => { const k = it.h ?? POST_H; return { p: [it.x, TOP, it.z], s: [k, k, k], r: [0, it.yaw ?? yawAt(it.x), 0], delay: it.delay } }), [posts])
    const bulbItems = useMemo(() => tiraBulbs(tiras, tiraP.yAt), [tiras, tiraP])
    // (the socket keeps its own colour; the light, each bulb's)
    const socketItems = useMemo(() => bulbItems.map(({ c, ...it }) => it), [bulbItems])
    useFrame(({ clock: c }) => tiraBulbMat.color.setScalar(0.78 + 0.22 * Math.sin(c.elapsedTime * 2.6))) // (the strings twinkle)
    // the glow of every light: the bulbs of the strings, the lights of the Christmas trees and the stars of the posts
    const bulbHalos = useMemo(() => bulbItems.map((b) => ({ p: [b.p[0], b.p[1] - BULB_SIZE * 0.6, b.p[2]], c: b.c, delay: b.delay })), [bulbItems])
    const modelHalos = useMemo(() => [...spotsOn(litSpots(tree.parts, 45), treeItems), ...spotsOn(litSpots(post.parts, 14), postItems)], [tree, treeItems, post, postItems])
    return (
        <>
            <ModelRise parts={tiraP.cable} items={tiras} clock={clock} keys={tiraKeys} />
            {tiraP.bulb.map((p, i) => <RiseParts key={i} clock={clock} geometry={p.geo} material={p.mat} items={p.glow ? bulbItems : socketItems} cast={false} keys={bulbItems.map((b) => tiraKeys[b.ti])} />)}
            <ModelRise parts={tree.parts} items={treeItems} clock={clock} keys={keysOf('arbol_navidad', treeItems)} />
            <ModelRise parts={post.parts} items={postItems} clock={clock} keys={keysOf('poste_estrella', postItems)} />
            {STARS_TUYAS ? <UserStars clock={clock} /> : <StarArches stars={stars} parts={starP} clock={clock} />}
            <Cascades edges={roofTiras} clock={clock} />
            <Halos points={bulbHalos} clock={clock} size={0.15} strength={0.85} />
            <Halos points={modelHalos} clock={clock} size={0.18} strength={0.5} />
        </>
    )
}
ALU_MODELS.forEach((n) => useGLTF.preload(ALU(n)))

/**
 * decoracion_rio.glb (lotus flowers of light, rings of petals and strings across the water) laid
 * along the whole Río Cali: the model is one stretch of river, repeated end to end and bent to
 * follow its curve. They come up out of the water, shining, with their glow on the water.
 */
const RIVER_W = 1.35 // (how wide the water it covers: the river is 1.5)
function RiverLights({ clock, forExport = false }) {
    const { scene } = useGLTF(ALU('decoracion_rio'))
    const { parts, halos, tiles } = useMemo(() => {
        const pieces = bakedPieces(scene, 16)
        const box = new THREE.Box3()
        pieces.forEach((p) => (p.geo.computeBoundingBox(), box.union(p.geo.boundingBox)))
        const size = box.getSize(new THREE.Vector3())
        const acrossX = size.x <= size.z // (the long side runs along the river)
        const wide = acrossX ? size.x : size.z, long = acrossX ? size.z : size.x
        const k = RIVER_W / wide, tileLen = long * k
        const n = Math.floor((2 * RIVER_HALF) / tileLen)
        const x0 = -(n * tileLen) / 2
        const byMat = new Map()
        const byTile = Array.from({ length: n }, () => new Map()) // (for its GLB: each stretch on its own)
        for (const p of pieces) {
            const mat = litSwap(p.orig, p.mat)
            for (let t = 0; t < n; t++) {
                const g = p.geo.clone()
                const a = g.attributes.position
                for (let i = 0; i < a.count; i++) {
                    const along = acrossX ? (a.getZ(i) - box.min.z) : (a.getX(i) - box.min.x)
                    const across = acrossX ? a.getX(i) - (box.min.x + box.max.x) / 2 : a.getZ(i) - (box.min.z + box.max.z) / 2
                    const X = x0 + t * tileLen + along * k
                    a.setXYZ(i, X, TOP - 0.2 + 0.012 + (a.getY(i) - box.min.y) * k, riverZ(X) + across * k)
                }
                byMat.set(mat, [...(byMat.get(mat) ?? []), g])
                if (forExport) byTile[t].set(mat, [...(byTile[t].get(mat) ?? []), g])
            }
        }
        const parts = [...byMat].map(([mat, list]) => ({ mat, geo: mergeGeometries(list) }))
        const tiles = forExport ? byTile.map((m) => [...m].map(([mat, list]) => ({ mat, geo: mergeGeometries(list) }))) : null
        // (their glow: some points of the shining flowers, along the whole river)
        const halos = litSpots(parts, 2600).map(({ v, c }) => ({ p: v, c, delay: 0.3 + (v[0] + 21) * 0.02 }))
        return { parts, halos, tiles }
    }, [scene, forExport])
    const group = useRef()
    useFrame(() => {
        const e = Math.max(0.001, riseOf(clock.current, 0.3))
        group.current.scale.y = e
        group.current.position.y = (TOP - 0.2) * (1 - e)
        group.current.visible = e > 0.002
    })
    return (
        <>
            <group ref={group} name="flores_del_rio">
                {tiles
                    ? tiles.map((list, t) => (
                        <group key={t} name={`flores_rio_${String(t + 1).padStart(2, '0')}`}>
                            {list.map((p, i) => <mesh key={i} geometry={p.geo} material={p.mat} />)}
                        </group>
                    ))
                    : parts.map((p, i) => <mesh key={i} geometry={p.geo} material={p.mat} />)}
            </group>
            <Halos points={halos} clock={clock} size={0.24} strength={0.5} />
        </>
    )
}
const RIVER_HALF = 22.6

export function AlumbradoDecor({ clock, forExport = false }) {
    const { tiras, trees, stars, posts, rings } = useMemo(buildAlumbrado, [])
    useLayoutEffect(() => {
        clock.current.span = delayAt(21) + RISE + 1.2
    }, [clock])
    return (
        <group>
            <Suspense fallback={null}>
                <AlumbradoModels clock={clock} tiras={tiras} trees={trees} stars={stars} posts={posts} />
                <RiverLights clock={clock} forExport={forExport} />
                <BuildingLights clock={clock} rings={rings} />
            </Suspense>
            {/* (soft: strong mango lights turned the river into a yellow road — it is water at night,
                with the colours of the lights only reflected on it) */}
            <pointLight position={[-6, 2.5, 1.8]} color={PALETTE.mango} intensity={5} distance={9} />
            <pointLight position={[6, 2.5, 1.8]} color={PALETTE.rosa} intensity={5} distance={9} />
            <pointLight position={[0, 2.5, 2.4]} color={LIGHT.warm} intensity={4} distance={8} />
        </group>
    )
}

// ════════════════════════════════════════════════════════════════════════════════
// SUCURSAL FEST: a music festival on the walkway of the bulevar. Four stages facing the river, each
// with truss, light rig (PAR cans + sweeping beams), LED screen, speakers and mics; a dance floor
// full of people; confetti over the WHOLE island; recreation: ferris wheel, picnic parasols.
// ════════════════════════════════════════════════════════════════════════════════
const confettiMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
const ledMaterial = new THREE.MeshBasicMaterial({ color: PALETTE.rosa, toneMapped: false })
const beamGeometry = new THREE.ConeGeometry(0.42, 3.2, 16, 1, true).translate(0, -1.6, 0)
const BEAM_COLORS = [PALETTE.rosa, PALETTE.mango, PALETTE.lima, '#FFFFFF', PALETTE.naranja]
const beamMaterials = BEAM_COLORS.map((c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }))
const parMaterials = BEAM_COLORS.map((c) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false }))

/** A stage (on a pontoon over the river, or on land) with its light rig. */
const STAGE_MODEL = MODELOS.models.includes('escenario')

// ── Your stage (Assets/modelos/escenario.glb) with the colours of the real Sucursal Fest ──────────
// (its shapes as they are; its colours like the photo: a frame of coloured LED — pinks, purples,
// cyans, orange, yellow — with the logo on top, a silver truss, a dark roof, red PAR lights and cyan
// beams going out of its open front into the night: they cross nothing)
const ledShader = {
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
        uniform float uTime, uPhase;
        varying vec2 vUv;
        vec3 hsl(float h) { vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return mix(vec3(1.0), k, 0.85); }
        void main() {
            vec2 p = vUv * vec2(8.0, 3.0);
            float flow = vUv.x * 0.9 + sin(vUv.y * 5.0 + uTime * 0.8 + uPhase) * 0.12 + uTime * 0.06;
            // (pink, purple, cyan, orange, yellow — the colours of the festival's screens)
            float h = fract(0.83 + flow * 0.55);
            vec3 c = hsl(h);
            // (round flowers drifting over it)
            vec2 cell = fract(p + vec2(uTime * 0.15, 0.0)) - 0.5;
            float flower = smoothstep(0.32, 0.24, length(cell) + 0.06 * sin(atan(cell.y, cell.x) * 6.0));
            c = mix(c, hsl(fract(h + 0.45)), flower * 0.8);
            gl_FragColor = vec4(c * (0.9 + 0.1 * sin(uTime * 3.0 + vUv.x * 9.0)), 1.0);
        }
    `,
}
const ledMats = [0, 1.7, 3.1].map((phase) => new THREE.ShaderMaterial({ ...ledShader, uniforms: { uTime: { value: 0 }, uPhase: { value: phase } }, toneMapped: false }))
// (the logo on the top of the frame: SUCURSAL FEST 2026, on its colours)
const logoTexture = (() => {
    if (typeof document === 'undefined') return null
    const c = document.createElement('canvas')
    c.width = 1024; c.height = 128
    const x = c.getContext('2d')
    const g = x.createLinearGradient(0, 0, 1024, 0)
    ;['#FF4FA3', '#9B4DFF', '#22D3EE', '#FF8A3D', '#FFD23F', '#FF4FA3'].forEach((col, i, a) => g.addColorStop(i / (a.length - 1), col))
    x.fillStyle = g
    x.fillRect(0, 0, 1024, 128)
    for (let i = 0; i < 26; i++) {
        x.fillStyle = ['#FFE066', '#7CFFB2', '#FF9AD5', '#8FE9FF'][i % 4]
        x.globalAlpha = 0.55
        x.beginPath(); x.arc((i * 97) % 1024, 20 + ((i * 53) % 90), 10 + (i % 3) * 6, 0, Math.PI * 2); x.fill()
    }
    x.globalAlpha = 1
    x.fillStyle = '#1B1430'
    x.fillRect(250, 18, 524, 92)
    x.font = '900 64px Arial Black, Impact, sans-serif'
    x.textAlign = 'center'; x.textBaseline = 'middle'
    x.lineWidth = 8; x.strokeStyle = '#1B1430'
    x.strokeText('SUCURSAL FEST 2026', 512, 66)
    x.fillStyle = '#FFFFFF'
    x.fillText('SUCURSAL FEST 2026', 512, 66)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
})()
const logoMat = new THREE.MeshBasicMaterial({ map: logoTexture, toneMapped: false, side: THREE.DoubleSide })
const logoFront = new THREE.MeshBasicMaterial({ map: logoTexture, toneMapped: false }) // (seen only from the front)
const STAGE_ROLE = [
    [/012$/, 'logo'], [/^Cube$/, 'screen'], [/004$/, 'lip'], [/008$/, 'truss'], [/^Sphere/, 'roof'], [/003$/, 'booth'], [/Cube001$/, 'base'],
]
// (greys light enough that its shape shows at night — all in black it looked like a box)
const STAGE_COLOR = { truss: '#C4C7CD', roof: '#6A6676', booth: '#4A4654', base: '#55515F' }
/** (planar coordinates, so the screens and the logo lie flat on their front) */
function frontUVs(g) {
    g.computeBoundingBox()
    const { min, max } = g.boundingBox
    const p = g.attributes.position, uv = []
    for (let i = 0; i < p.count; i++) uv.push((p.getX(i) - min.x) / (max.x - min.x || 1), (p.getY(i) - min.y) / (max.y - min.y || 1))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
}
const stageBlack = new THREE.MeshStandardMaterial({ color: '#0E0C12', roughness: 0.8 })
/** (the faces of a geometry that look to its front, +z — and the others) */
function splitFacing(g) {
    const p = g.attributes.position, n = g.attributes.normal
    const fr = [], bk = []
    for (let t = 0; t < p.count / 3; t++) (n.getZ(t * 3) > 0.5 ? fr : bk).push(t)
    const make = (list) => {
        if (!list.length) return null
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
    return [make(fr) ?? g, make(bk)]
}
function SucursalStage({ seed }) {
    const { scene } = useGLTF('models/escenario.glb')
    const { parts, top, front } = useMemo(() => {
        const copy = scene.clone(true)
        copy.updateMatrixWorld(true)
        const box = new THREE.Box3().setFromObject(copy), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
        const k = 2.4 / Math.max(size.x, size.z)
        const m4 = new THREE.Matrix4().makeScale(k, k, k).multiply(new THREE.Matrix4().makeTranslation(-c.x, -box.min.y, -c.z))
        const out = []
        copy.traverse((o) => {
            if (!o.isMesh) return
            const role = STAGE_ROLE.find(([re]) => re.test(o.name))?.[1] ?? 'truss'
            const g = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()).applyMatrix4(new THREE.Matrix4().multiplyMatrices(m4, o.matrixWorld))
            g.computeVertexNormals()
            if (role === 'logo' || role === 'screen' || role === 'lip') {
                // (its colours only on its front — towards the people —; behind and on its sides, black)
                const [front, back] = splitFacing(g)
                frontUVs(front)
                out.push({ geo: front, mat: role === 'logo' ? logoMat : role === 'screen' ? ledMats[seed % 3] : ledMats[(seed + 1) % 3], role })
                if (back) out.push({ geo: back, mat: stageBlack, role: 'back' })
                return
            }
            out.push({ geo: g, mat: clayMaterial({ color: STAGE_COLOR[role], speckle: 0.12, speckleScale: 30, rim: 0.12, rimColor: '#FFE3C8', bump: 0.15, warmth: 0.02, sheen: 0.2, sheenColor: '#FFF1E2' }), role })
        })
        return { parts: out, top: size.y * k, front: (box.max.z - c.z) * k }
    }, [scene, seed])
    const beams = useRef([])
    useFrame(({ clock: c }) => {
        const t = c.elapsedTime
        ledMats.forEach((m) => (m.uniforms.uTime.value = t))
        beams.current.forEach((b, i) => {
            if (!b) return
            // (out of the open front, up into the night, sweeping — never into the roof nor the ground)
            b.rotation.x = -2.2 - 0.35 * (0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.3 + seed))
            b.rotation.z = Math.sin(t * 0.7 + i * 2.1 + seed) * 0.55
        })
    })
    const lights = [-0.95, -0.57, -0.19, 0.19, 0.57, 0.95]
    return (
        <group>
            {parts.map((p, i) => <mesh key={i} geometry={p.geo} material={p.mat} castShadow={p.role !== 'logo'} receiveShadow />)}
            {/* (the logo, on a sign standing on the top of its front — the frame of the model is too thin to read it) */}
            <mesh position={[0, top + 0.13, front - 0.04]} material={logoFront}>
                <planeGeometry args={[2.0, 0.25]} />
            </mesh>
            <mesh position={[0, top + 0.13, front - 0.045]} rotation-y={Math.PI} material={stageBlack}>
                <planeGeometry args={[2.0, 0.25]} />
            </mesh>
            {lights.map((lx, i) => (
                <group key={lx} position={[lx, top * 0.62, front + 0.03]}>
                    {/* (red PAR cans at the front, under the roof, like the photo) */}
                    <mesh geometry={geo.column} scale={[0.045, 0.06, 0.045]} rotation-x={0.6} material={parRed} />
                    {i % 2 === 0 && <mesh ref={(el) => (beams.current[i] = el)} geometry={stageBeamGeometry} material={cyanBeam} />}
                </group>
            ))}
        </group>
    )
}
// (thin and short: a ray of light out of the stage, not a cone that goes through the trees)
const stageBeamGeometry = new THREE.ConeGeometry(0.08, 1.1, 12, 1, true).translate(0, -0.55, 0)
const parRed = new THREE.MeshBasicMaterial({ color: '#FF2A1F', toneMapped: false })
const cyanBeam = new THREE.MeshBasicMaterial({ color: '#7FF6FF', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })

/**
 * The people dancing in front of a stage — your persona (Assets/modelos/persona.glb), each one dressed
 * in a colour of its own, or little clay people while it is not there —, jumping and swaying to the music.
 */
const MONITOS = MODELOS.models.includes('persona')
function Dancers({ x, z, yaw, size, clock, seed }) {
    const people = useMemo(() => {
        const rand = seeded(97 + seed)
        const n = Math.round(16 * size / 0.55)
        return Array.from({ length: n }, (_, i) => {
            // (a crowd in front of it: rows, a little loose)
            const row = Math.floor(i / 6), col = (i % 6) - 2.5
            // (each one a colour of the palette, mixed so two neighbours are rarely the same)
            return { lx: (col * 0.2 + (rand() - 0.5) * 0.08) * size / 0.55, lz: (0.62 + row * 0.2 + (rand() - 0.5) * 0.06) * size / 0.55, c: COLORS[(i * 7 + row + seed) % COLORS.length], ph: rand() * 6, sp: 5 + rand() * 3, h: 0.16 + rand() * 0.05 }
        })
    }, [size, seed])
    const refs = useRef([])
    useFrame(({ clock: c }) => {
        const t = c.elapsedTime
        const on = Math.max(0.001, riseOf(clock.current, delayAt(x) + 0.3))
        people.forEach((p, i) => {
            const m = refs.current[i]
            if (!m) return
            m.position.y = TOP + Math.abs(Math.sin(t * p.sp * 0.5 + p.ph)) * 0.05
            m.rotation.set(0, Math.sin(t * 2 + p.ph) * 0.6, Math.sin(t * p.sp * 0.25 + p.ph) * 0.15)
            m.scale.setScalar(on)
        })
    })
    const cos = Math.cos(yaw), sin = Math.sin(yaw)
    return people.map((p, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={[x + p.lx * cos + p.lz * sin, TOP, z - p.lx * sin + p.lz * cos]}>
            {MONITOS ? <Suspense fallback={null}><Monito h={p.h} pick={i} color={p.c} /></Suspense> : (
                <>
                    <mesh geometry={personGeometry} scale={p.h / 0.32} material={mat(p.c)} />
                    <mesh geometry={geo.sphereLow} position-y={p.h * 1.05} scale={p.h * 0.28} material={mat(PALETTE.crema)} />
                </>
            )}
        </group>
    ))
}
const SKINS = ['#F2C9A0', '#D9A273', '#B97D52', '#8C5A3C', '#E8B98F']
const personaMats = new Map()
function Monito({ h, pick, color }) {
    const { scene } = useGLTF('models/persona.glb')
    // (the figure of the file, as tall as a person on the island: its body in its colour, its head a skin tone)
    const figure = useMemo(() => {
        const clay = clayed(scene)
        const box = new THREE.Box3().setFromObject(clay), c = box.getCenter(new THREE.Vector3())
        clay.position.sub(new THREE.Vector3(c.x, box.min.y, c.z))
        const g = new THREE.Group()
        g.add(clay)
        g.userData.k = 1 / (box.max.y - box.min.y || 1)
        return g
    }, [scene])
    const object = useMemo(() => {
        const o = figure.clone(true)
        const skin = SKINS[pick % SKINS.length]
        // (the highest piece is the head; the rest, the body)
        const parts = []
        o.traverse((m) => m.isMesh && parts.push(m))
        const top = parts.reduce((best, m) => {
            m.geometry.computeBoundingBox()
            return !best || m.geometry.boundingBox.max.y > best.geometry.boundingBox.max.y ? m : best
        }, null)
        for (const m of parts) {
            const hex = m === top && parts.length > 1 ? skin : color
            const key = (m.material.uuid ?? '') + hex
            // (its colour of the palette, glowing a little on its own: at night, under the stage
            // lights, they all came out black)
            if (!personaMats.has(key)) {
                const mt = Object.assign(m.material.clone(), { color: new THREE.Color(hex) })
                if (mt.emissive) (mt.emissive = new THREE.Color(hex)), (mt.emissiveIntensity = 0.45)
                personaMats.set(key, mt)
            }
            m.material = personaMats.get(key)
            m.castShadow = false // (they never stop dancing: no shadow, it lagged behind them)
        }
        return o
    }, [figure, pick, color])
    return <primitive object={object} scale={h * 1.3 * figure.userData.k} />
}

/**
 * La Retreta at night, for the Sucursal Fest: towers of lights on its lawn (coloured PAR cans, beams
 * up into the sky) and strings of bulbs coming out of the top of the kiosk to each of them.
 */
const bulbMats = BEAM_COLORS.map((c) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false }))
function RetretaLights({ clock }) {
    const kiosk = useMemo(() => {
        // (the point of its roof, and its eaves round it — scripts/edificios-layout.py: apex, eave)
        const k = USER_BUILDINGS.find((it) => /^hito_Kiosko/i.test(it.name))
        const l = LANDMARKS.find((m) => m.model === 'Kiosko')
        return k?.apex ? { x: k.apex[0], z: k.apex[2], top: k.apex[1], eave: (k.eave ?? 0.34) + 0.02, ringY: (k.eaveY ?? k.apex[1] - 0.15) - 0.01 } : k ? { x: k.box.x, z: k.box.z, top: k.box.y + k.box.h, eave: 0.36, ringY: k.box.y + k.box.h - 0.12 } : l ? { x: l.x, z: l.z, top: TOP + 0.6, eave: 0.36, ringY: TOP + 0.48 } : null
    }, [])
    // (on its lawn, round the kiosk — near enough that its strings stay over the park, never over a street)
    const towers = useMemo(() => findSpots({ x: [RETRETA.x + 0.4, 22.6], o: [-5.0, -1.0], r: 0.35, n: 8, gap: 1.1, seed: 41 }).filter(([x, z]) => !onRetretaSpot(x, z - riverZ(x), 0.3) && !USER_FURNITURE.some(([x0, z0, x1, z1]) => x > x0 - 0.2 && x < x1 + 0.2 && z > z0 - 0.2 && z < z1 + 0.2) && (!kiosk || Math.hypot(x - kiosk.x, z - kiosk.z) < 2.2) && !onGround('street', x, z, 0.3)).slice(0, 5), [kiosk])
    const H = 1.05
    const { bulbs, halos } = useMemo(() => {
        const bulbs = [], halos = []
        if (kiosk) {
            towers.forEach(([tx, tz], ti) => {
                // (a string hanging from the kiosk's top to the tower's: a soft curve of bulbs)
                const n = Math.max(6, Math.round(Math.hypot(tx - kiosk.x, tz - kiosk.z) / 0.16))
                for (let i = 1; i < n; i++) {
                    const u = i / n
                    const y = kiosk.top + (TOP + H - kiosk.top) * u - Math.sin(u * Math.PI) * 0.18
                    const p = [kiosk.x + (tx - kiosk.x) * u, y, kiosk.z + (tz - kiosk.z) * u]
                    bulbs.push({ p, m: (i + ti) % bulbMats.length })
                    halos.push({ p, c: BEAM_COLORS[(i + ti) % BEAM_COLORS.length], delay: delayAt(tx) + 0.4 })
                }
            })
            // (and a ring of them round the edge of its roof)
            for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2
                const p = [kiosk.x + Math.cos(a) * kiosk.eave, kiosk.ringY, kiosk.z + Math.sin(a) * kiosk.eave]
                bulbs.push({ p, m: i % bulbMats.length })
                halos.push({ p, c: BEAM_COLORS[i % BEAM_COLORS.length], delay: delayAt(kiosk.x) + 0.4 })
            }
        }
        towers.forEach(([tx, tz], ti) => [-0.12, 0, 0.12].forEach((d, k) => halos.push({ p: [tx + d, TOP + H + 0.04, tz], c: BEAM_COLORS[(ti + k) % BEAM_COLORS.length], delay: delayAt(tx) + 0.3 })))
        return { bulbs, halos }
    }, [kiosk, towers])
    const beams = useRef([])
    useFrame(({ clock: c }) => {
        const t = c.elapsedTime
        beams.current.forEach((b, i) => {
            if (!b) return
            b.rotation.x = Math.PI + Math.sin(t * 0.8 + i * 1.7) * 0.4 // (up into the sky)
            b.rotation.z = Math.sin(t * 0.6 + i * 2.3) * 0.4
        })
    })
    const truss = mat(shade(PALETTE.crema, 0.6))
    return (
        <>
            {towers.map(([tx, tz], i) => (
                <Rise key={i} clock={clock} delay={delayAt(tx) + 0.2} pivot={[tx, tz]} name={`torre_luces_${String(i + 1).padStart(2, '0')}`}>
                    <group position={[tx, TOP, tz]}>
                        <mesh geometry={geo.box} position-y={H / 2} scale={[0.05, H, 0.05]} material={truss} castShadow />
                        <mesh geometry={geo.box} position-y={H} scale={[0.34, 0.04, 0.05]} material={truss} />
                        {[-0.12, 0, 0.12].map((d, k) => <mesh key={k} geometry={geo.column} position={[d, H + 0.04, 0]} scale={[0.05, 0.07, 0.05]} material={parMaterials[(i + k) % parMaterials.length]} />)}
                        <mesh ref={(el) => (beams.current[i] = el)} position-y={H + 0.06} geometry={stageBeamGeometry} material={beamMaterials[i % beamMaterials.length]} />
                    </group>
                </Rise>
            ))}
            {bulbs.map((b, i) => <mesh key={i} geometry={geo.sphereLow} position={b.p} scale={0.022} material={bulbMats[b.m]} />)}
            <Halos points={halos} clock={clock} size={0.16} strength={0.8} />
        </>
    )
}
function Stage({ x, z: zLand, size = 1, led = true, river = false, seed = 0, clock, yaw: facing }) {
    const z = river ? riverZ(x) : zLand
    const yaw = facing ?? yawAt(x) + (river ? 0 : Math.PI) // on land: the stage looks at the river (or where it says)
    const beams = useRef([])
    const truss = mat(shade(PALETTE.crema, 0.75))
    useFrame(({ clock: c }) => {
        if (clock && clock.current.t === 0) return
        const t = c.elapsedTime
        beams.current.forEach((b, i) => {
            if (!b) return
            b.rotation.x = 0.55 + Math.sin(t * 1.3 + i * 1.7 + seed) * 0.45
            b.rotation.z = Math.sin(t * 0.9 + i * 2.3 + seed) * 0.6
        })
    })
    // (your stage — Assets/modelos/escenario.glb —, as big as the page's, its front to the river; with
    // the sweeping beams of light over it)
    if (STAGE_MODEL)
        return (
            <group position={[x, TOP, z]} rotation-y={yaw} scale={size}>
                <Suspense fallback={null}>
                    <SucursalStage seed={seed} />
                </Suspense>
            </group>
        )
    return (
        <group position={[x, TOP, z]} rotation-y={yaw} scale={size}>
            {river && <mesh geometry={geo.box} position={[0, -0.02, -0.1]} scale={[2.4, 0.12, 1.5]} material={mat(WOOD)} receiveShadow />}
            <mesh geometry={geo.box} position={[0, 0.12, -0.25]} scale={[2.1, 0.16, 1.0]} material={mat('#2E2A22')} castShadow receiveShadow />
            {[-1, 1].map((s) => (
                <group key={s}>
                    <mesh geometry={geo.box} position={[s * 1.0, 0.8, -0.7]} scale={[0.08, 1.4, 0.08]} material={truss} castShadow />
                    <mesh geometry={geo.box} position={[s * 1.0, 0.8, 0.2]} scale={[0.08, 1.4, 0.08]} material={truss} castShadow />
                </group>
            ))}
            <mesh geometry={geo.box} position={[0, 1.5, -0.25]} scale={[2.15, 0.08, 1.05]} material={truss} castShadow />
            <mesh geometry={geo.box} position={[0, 1.44, 0.2]} scale={[2.0, 0.06, 0.06]} material={truss} />
            {/* light rig: PAR cans + sweeping beams */}
            {[-0.8, -0.48, -0.16, 0.16, 0.48, 0.8].map((lx, i) => (
                <group key={lx} position={[lx, 1.38, 0.2]}>
                    <mesh geometry={geo.column} scale={[0.07, 0.12, 0.07]} rotation-x={0.6} material={parMaterials[(i + seed) % parMaterials.length]} />
                    {i % 2 === 0 && <mesh ref={(el) => (beams.current[i] = el)} geometry={beamGeometry} material={beamMaterials[(i + seed) % beamMaterials.length]} />}
                </group>
            ))}
            {led && <mesh geometry={geo.box} position={[0, 0.75, -0.7]} scale={[1.6, 0.85, 0.04]} material={ledMaterial} />}
            {[-1, 1].map((s) => (
                <group key={'spk' + s} position={[s * 1.25, 0.06, 0.2]}>
                    {[0, 1, 2].map((k) => (
                        <group key={k} position-y={0.14 + k * 0.27}>
                            <mesh geometry={geo.box} scale={[0.3, 0.26, 0.26]} material={mat('#2E2A22')} castShadow />
                            <mesh geometry={geo.column} position={[0, 0, 0.135]} rotation-x={Math.PI / 2} scale={[0.09, 0.01, 0.09]} material={mat(shade(PALETTE.crema, 0.45))} />
                        </group>
                    ))}
                </group>
            ))}
            {[-0.45, 0, 0.45].map((mx) => (
                <group key={mx} position={[mx, 0.2, 0.05]}>
                    <mesh geometry={geo.cylinder} position-y={0.22} scale={[0.008, 0.44, 0.008]} material={mat('#2E2A22')} />
                    <mesh geometry={geo.sphereLow} position-y={0.46} scale={0.03} material={mat('#9A9A92', { metalness: 0.6, roughness: 0.3 })} />
                </group>
            ))}
            <mesh geometry={geo.column} position={[0.6, 0.35, -0.35]} scale={[0.09, 0.3, 0.09]} material={mat(PALETTE.naranja)} castShadow />
            <mesh geometry={geo.column} position={[0.78, 0.33, -0.3]} scale={[0.08, 0.26, 0.08]} material={mat(PALETTE.mango)} castShadow />
            <mesh geometry={geo.box} position={[-0.6, 0.38, -0.35]} scale={[0.5, 0.06, 0.18]} material={mat('#2E2A22')} castShadow />
        </group>
    )
}

const personGeometry = new THREE.CapsuleGeometry(0.055, 0.14, 4, 8).translate(0, 0.12, 0)
function DanceFloor({ x, o = 1.6, clock }) {
    const tiles = useRef()
    const people = useRef()
    const z = riverZ(x) + o
    const yaw = yawAt(x)
    const grid = useMemo(() => {
        const out = []
        for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) out.push([(i - 2.5) * 0.36, (j - 1.5) * 0.36])
        return out
    }, [])
    const crowd = useMemo(() => {
        const rand = seeded(5)
        return Array.from({ length: 30 }, (_, i) => ({ x: (rand() - 0.5) * 2, z: (rand() - 0.5) * 1.3, phase: rand() * 6, c: COLORS[i % COLORS.length], h: 0.85 + rand() * 0.3 }))
    }, [])
    const color = useMemo(() => new THREE.Color(), [])
    useLayoutEffect(() => {
        crowd.forEach((p, i) => people.current.setColorAt(i, color.set(p.c)))
        people.current.instanceColor.needsUpdate = true
    }, [crowd, color])
    useFrame(({ clock: c }) => {
        if (clock && clock.current.t === 0) return
        const t = c.elapsedTime
        const beat = Math.floor(t * 2.2)
        grid.forEach(([gx, gz], i) => {
            dummy.position.set(gx, 0.03, gz)
            dummy.rotation.set(0, 0, 0)
            dummy.scale.set(0.34, 0.04, 0.34)
            dummy.updateMatrix()
            tiles.current.setMatrixAt(i, dummy.matrix)
            tiles.current.setColorAt(i, color.set(COLORS[(i * 7 + beat) % 5]))
        })
        tiles.current.instanceMatrix.needsUpdate = true
        tiles.current.instanceColor.needsUpdate = true
        crowd.forEach((p, i) => {
            dummy.position.set(p.x, 0.16 + Math.abs(Math.sin(t * 4.4 + p.phase)) * 0.07, p.z)
            dummy.rotation.set(0, Math.sin(t * 2 + p.phase) * 0.6, Math.sin(t * 4.4 + p.phase) * 0.12)
            dummy.scale.set(1, p.h, 1)
            dummy.updateMatrix()
            people.current.setMatrixAt(i, dummy.matrix)
        })
        people.current.instanceMatrix.needsUpdate = true
    })
    return (
        <group position={[x, TOP, z]} rotation-y={yaw}>
            <mesh geometry={geo.box} position-y={-0.02} scale={[2.4, 0.1, 1.6]} material={mat(WOOD)} receiveShadow />
            <instancedMesh ref={tiles} args={[geo.box, bulbMaterial, grid.length]} />
            <instancedMesh ref={people} args={[personGeometry, mat('#ffffff'), crowd.length]} />
        </group>
    )
}

function FerrisWheel({ x, z, clock }) {
    const wheel = useRef()
    const cabins = useRef([])
    const R = 1.05
    useFrame((_, dt) => {
        if (clock && clock.current.t === 0) return
        wheel.current.rotation.z += dt * 0.35
        cabins.current.forEach((c) => c && (c.rotation.z = -wheel.current.rotation.z))
    })
    const frame = mat(PALETTE.crema)
    return (
        <group position={[x, TOP, z]} rotation-y={yawAt(x)}>
            {[-1, 1].map((s) =>
                [-1, 1].map((f) => <mesh key={s + '' + f} geometry={geo.box} position={[s * 0.45, 0.7, f * 0.18]} rotation-z={s * 0.32} scale={[0.05, 1.5, 0.05]} material={frame} castShadow />)
            )}
            <group ref={wheel} position-y={1.4}>
                <mesh material={mat(PALETTE.rosa)}>
                    <torusGeometry args={[R, 0.03, 8, 40]} />
                </mesh>
                {Array.from({ length: 8 }, (_, i) => {
                    const a = (i / 8) * Math.PI * 2
                    return (
                        <group key={i}>
                            <mesh geometry={geo.box} position={[Math.cos(a) * R * 0.5, Math.sin(a) * R * 0.5, 0]} rotation-z={a} scale={[R, 0.025, 0.025]} material={frame} />
                            <group ref={(el) => (cabins.current[i] = el)} position={[Math.cos(a) * R, Math.sin(a) * R, 0]}>
                                <mesh geometry={geo.box} position-y={-0.12} scale={[0.16, 0.16, 0.16]} material={mat(COLORS[(i % 5) + 1])} />
                            </group>
                        </group>
                    )
                })}
            </group>
        </group>
    )
}

// stages along the bulevar: [x, size, LED screen] (main one at the Sucursal Fest marker)
// (the real island: the two stages of La Retreta, island.json → retreta.stages)
const RETRETA_STAGES = !CLASSIC && RETRETA?.stages?.length ? RETRETA.stages : null
const STAGES_AT = CLASSIC
    ? [[SUCURSAL[0], 0.78, true], [-11.0, 0.62, true], [-2.9, 0.5, false], [16.4, 0.6, true]]
    : [[SUCURSAL[0], 0.78, true], [-4.6, 0.62, true], [1.6, 0.5, false], [14.6, 0.6, true]]

export function SucursalDecor({ clock }) {
    const confetti = useRef()
    const mainX = SUCURSAL[0]
    const pieces = useMemo(() => {
        const rand = seeded(11)
        return Array.from({ length: 520 }, (_, i) => {
            const x = (rand() - 0.5) * 44
            return { x, z: riverZ(x) + (rand() - 0.5) * 13, y: TOP + rand() * 10, speed: 0.6 + rand() * 0.9, spin: rand() * 6, c: COLORS[i % COLORS.length] }
        })
    }, [])
    const layout = useMemo(() => {
        // (on the real island the fest is at La Retreta: its two stages, picnic tables on its lawn)
        if (RETRETA_STAGES) {
            const picnic = findSpots({ x: [RETRETA.x + 0.6, 22.4], o: [-4.9, -1.4], r: 0.4, n: 5, gap: 1.6, seed: 83 }).filter(([x, z]) => !onRetretaSpot(x, z - riverZ(x), 0.45))
            return { wheel: null, land: [], picnic }
        }
        const wx = CLASSIC ? 18.6 : 16.4 // (the real island has the Puente Ortiz and La Ermita at its east end)
        const wheel = [wx, riverZ(wx) + 1.95]
        const land = []
        const picnic = findSpots({ x: WALK_X, o: WALK, r: 0.4, n: CLASSIC ? 7 : 5, gap: 2.5, seed: 83 })
        return { wheel, land, picnic }
    }, [])
    const d = (x) => delayAt(x)
    const tables = useMemo(() => layout.picnic.map(([x, z]) => ({ p: [x, TOP + 0.22, z], s: [0.5, 0.04, 0.3], c: WOOD, delay: d(x) })), [layout])
    const benches = useMemo(() => layout.picnic.flatMap(([x, z]) => [-1, 1].map((s) => ({ p: [x, TOP + 0.12, z + s * 0.26], s: [0.5, 0.03, 0.1], c: shade(PALETTE.naranja, 0.5), delay: d(x), g: [x, z] }))), [layout])
    const umbrellas = useMemo(() => layout.picnic.map(([x, z], i) => ({ p: [x, TOP + 0.62, z], s: [0.85, 0.22, 0.85], r: [0, i, 0], c: COLORS[(i % 5) + 1], delay: d(x) + 0.15 })), [layout])
    const poles = useMemo(() => layout.picnic.map(([x, z]) => ({ p: [x, TOP + 0.36, z], s: [0.015, 0.5, 0.015], c: POLE, delay: d(x) })), [layout])

    useLayoutEffect(() => {
        clock.current.span = delayAt(21) + RISE + 0.6
        const color = new THREE.Color()
        pieces.forEach((p, i) => confetti.current.setColorAt(i, color.set(p.c)))
        confetti.current.instanceColor.needsUpdate = true
    }, [pieces, clock])
    useFrame(({ clock: c }, dt) => {
        if (clock.current.t === 0) return
        const t = c.elapsedTime
        const step = Math.min(dt, 0.05)
        const amount = clamp01(clock.current.t / 2)
        pieces.forEach((p, i) => {
            p.y -= p.speed * step
            if (p.y < TOP) p.y = TOP + 10
            dummy.position.set(p.x + Math.sin(t + i) * 0.3, p.y, p.z)
            dummy.rotation.set(t * p.spin, t * p.spin * 0.7, 0)
            dummy.scale.set(0.1 * amount + 0.0001, 0.17 * amount + 0.0001, 1)
            dummy.updateMatrix()
            confetti.current.setMatrixAt(i, dummy.matrix)
        })
        confetti.current.instanceMatrix.needsUpdate = true
        ledMaterial.color.setHSL((t * 0.08) % 1, 0.75, 0.62)
    })
    return (
        <group>
            <instancedMesh ref={confetti} args={[undefined, confettiMaterial, pieces.length]} frustumCulled={false} name="confeti">
                <planeGeometry />
            </instancedMesh>
            {/* four stages on the walkway of the bulevar, facing the river, + the dance floor */}
            {RETRETA_STAGES
                ? RETRETA_STAGES.map((s, i) => {
                    const z = riverZ(s.along) + s.across
                    return (
                        <group key={i}>
                            <Rise clock={clock} delay={d(s.along)} pivot={[s.along, z]} name={`tarima_${String(i + 1).padStart(2, '0')}`}>
                                <Stage x={s.along} z={z} size={s.size} led={i === 0} seed={i * 2} clock={clock} yaw={yawAt(s.along) + ((s.yaw ?? 0) * Math.PI) / 180} />
                            </Rise>
                            {/* (the people dancing in front of it) */}
                            <Dancers x={s.along} z={z} size={s.size} yaw={yawAt(s.along) + ((s.yaw ?? 0) * Math.PI) / 180} clock={clock} seed={i} />
                        </group>
                    )
                })
                : STAGES_AT.map(([x, size, led], i) => (
                    <Rise key={x} clock={clock} delay={d(x)} pivot={[x, riverZ(x) + 2.35]} name={`tarima_${String(i + 1).padStart(2, '0')}`}>
                        <Stage x={x} z={riverZ(x) + 2.35} size={size} led={led} seed={i * 2} clock={clock} />
                    </Rise>
                ))}
            {/* (La Retreta at night: towers of lights and strings of bulbs out of the kiosk) */}
            {RETRETA_STAGES && STAGE_MODEL && <Suspense fallback={null}><RetretaLights clock={clock} /></Suspense>}
            {!RETRETA_STAGES && <Rise clock={clock} delay={d(mainX - 2.4)} pivot={[mainX - 2.4, riverZ(mainX - 2.4) + 1.6]} name="pista_de_baile"><DanceFloor x={mainX - 2.4} clock={clock} /></Rise>}
            {layout.land.map(([x, z], i) => (
                <Rise key={i} clock={clock} delay={d(x)} pivot={[x, z]}>
                    <Stage x={x} z={z} river={false} size={0.62} seed={i + 1} clock={clock} />
                </Rise>
            ))}
            {layout.wheel && <Rise clock={clock} delay={d(layout.wheel[0])} pivot={layout.wheel} name="rueda_de_chicago"><FerrisWheel x={layout.wheel[0]} z={layout.wheel[1]} clock={clock} /></Rise>}
            <RiseParts clock={clock} geometry={geo.box} material={mat('#ffffff')} items={tables} keys={keysOf('picnic', tables)} />
            <RiseParts clock={clock} geometry={geo.box} material={mat('#ffffff')} items={benches} keys={keysOf('picnic', benches, (_, i) => Math.floor(i / 2))} />
            <RiseParts clock={clock} geometry={geo.cylinder} material={mat('#ffffff')} items={poles} keys={keysOf('picnic', poles)} />
            <RiseParts clock={clock} geometry={geo.pyramid} material={mat('#ffffff')} items={umbrellas} keys={keysOf('picnic', umbrellas)} />
        </group>
    )
}

export default function EventDecor() {
    const mode = useExperience((s) => s.mode)
    const activeEvent = useExperience((s) => s.activeEvent)
    const setEvent = useExperience((s) => s.setEvent)
    const current = mode === 'eventos' ? activeEvent : null

    return (
        <group>
            <EventRoot active={current === 'feria'}>
                {(clock) => (
                    <Suspense fallback={null}>
                        <FeriaDecor clock={clock} />
                    </Suspense>
                )}
            </EventRoot>
            <EventRoot active={current === 'alumbrado'}>{(clock) => <AlumbradoDecor clock={clock} />}</EventRoot>
            <EventRoot active={current === 'sucursal'}>{(clock) => <SucursalDecor clock={clock} />}</EventRoot>
            {mode === 'eventos' &&
                EVENTS.map((ev, i) => (
                    <Marker key={ev.id} index={i} position={ev.position} label={ev.name} active={activeEvent === ev.id} glow={GLOW.eventos} onSelect={() => setEvent(ev.id)} />
                ))}
        </group>
    )
}
