import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PHASES } from '../../config.js'
import { PALETTE } from '../../theme.js'
import { useExperience } from '../../store/useExperience.js'
import { skyState } from '../skyState.js'
import { sound } from '../../audio/sound.js'
import Chonti, { poseChonti } from './ChontiModel.jsx'
import { walkGrid } from './walkGrid.js'

/**
 * A little Chonti on the island while you look at a route, doing what the route is about:
 *   gastronómicas · on the walk in front of the Empanadas del Obelisco, eating an empanada
 *   talleres      · walking to La Tertulia; there he sits on the floor of its plaza with his
 *                   notebook, drawing it
 *   culturales    · at the Gato del Río: he looks at each gata, then reads the panel beside her, and
 *                   walks on to the next one
 * RULE: he never goes through anything — where he walks, stands and sits is read from the island
 * itself (walkGrid): only on floors, around everything standing, never on a street.
 * (No shadow: he never stops moving, and the shadows are drawn a few times a second. A little light
 * of his own: on the map, at dusk and at night, he came out dark.)
 */
const SIZE = 0.22 // (Chonti is 2 units tall: on the island ~0.44 — small beside the buildings, but he reads)
const SPEED = 0.42 // walking, units a second
const PLAN = {
    // (on the walk in front of the Empanadas del Obelisco — not on the street —, a little to the side
    // of its stop's marker: right under it, the marker took every touch meant for him)
    gastronomico: { at: [-11.7, 1.42], area: [-13.6, 0.6, -10.6, 2.4] },
    talleres: { from: [-12.5, 1.42], to: [-17.4, 3.3], face: [-15.4, 4.0], area: [-18.6, 0.8, -11.8, 4.6] },
    culturales: { area: [-5.6, -4.0, -2.6, -1.4] },
}
const LOOK = 3.2, READ = 3.8 // s at each gata, s reading her panel
const SIT_ROOM = 0.22 // (sitting, his legs reach out in front of him: that much room around his spot)

// the empanada (a golden half-moon, plump) and the notebook (pink cover, cream pages) — sizes in
// Chonti's own units (he is 2 tall)
export function props() {
    const moon = new THREE.Shape()
    moon.absarc(0, 0, 1, 0, Math.PI, false)
    moon.closePath()
    const geo = new THREE.ExtrudeGeometry(moon, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.14, bevelSegments: 4, curveSegments: 20 })
    geo.translate(0, -0.45, -0.15)
    const empanada = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#E3A646', roughness: 0.7 }))
    empanada.scale.setScalar(0.2)
    const notebook = new THREE.Group()
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.36), new THREE.MeshStandardMaterial({ color: PALETTE.rosa, roughness: 0.8 }))
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.034, 0.32), new THREE.MeshStandardMaterial({ color: PALETTE.crema, roughness: 0.9 }))
    pages.position.y = 0.01
    notebook.add(cover, pages)
    notebook.rotation.x = -0.35 // (tilted up towards him)
    return { empanada, notebook }
}
/**
 * Holds something between his two hands: his arms are short and never meet, so it sits in the middle
 * of them (a little lower / further out), every frame, wherever his hands are. `obj` is a child of
 * the group Chonti stands in.
 */
const TIP = new THREE.Vector3(0, 0.19, 0), vA = new THREE.Vector3(), vB = new THREE.Vector3()
export function holdInHands(rig, obj, { down = 0, out = 0 } = {}) {
    rig.bones.foreL.bone.localToWorld(vA.copy(TIP))
    rig.bones.foreR.bone.localToWorld(vB.copy(TIP))
    obj.parent.updateWorldMatrix(true, false)
    obj.position.copy(obj.parent.worldToLocal(vA.add(vB).multiplyScalar(0.5)))
    obj.position.y -= down
    obj.position.z += out
}

/** The gatas of the Gato del Río and the panel beside each one, read from the place itself. */
function gatas(scene) {
    const gato = scene.getObjectByName('lugar_gato')
    if (!gato) return []
    gato.updateMatrixWorld(true)
    const b = new THREE.Box3(), size = new THREE.Vector3(), c = new THREE.Vector3()
    const panels = [], cats = []
    gato.traverse((o) => {
        if (!o.isMesh || !o.material?.color) return
        b.setFromObject(o)
        b.getSize(size), b.getCenter(c)
        const hex = o.material.color.getHexString()
        if (hex === '2f3a45') panels.push([c.x, c.z])
        // (a gata: a figure on a pedestal — not the big red Gato, not a hedge)
        else if (b.min.y > 0.33 && size.y > 0.1 && size.y < 0.3 && Math.max(size.x, size.z) < 0.35) cats.push([c.x, c.z])
    })
    return panels
        .map((panel) => ({ panel, cat: cats.reduce((best, k) => (!best || Math.hypot(k[0] - panel[0], k[1] - panel[1]) < Math.hypot(best[0] - panel[0], best[1] - panel[1]) ? k : best), null) }))
        .filter((s) => s.cat && Math.hypot(s.cat[0] - s.panel[0], s.cat[1] - s.panel[1]) < 0.6)
}

export default function RouteChonti() {
    const phase = useExperience((s) => s.phase)
    const mode = useExperience((s) => s.mode)
    // (made once, the first time a route is looked at — then kept: making Chonti takes a moment)
    const [made, setMade] = useState(false)
    useEffect(() => {
        if (phase === PHASES.STAGE && mode === 'rutas') setMade(true)
    }, [phase, mode])
    // (his own Suspense: while he loads, the island stays)
    return made ? (
        <Suspense fallback={null}>
            <Walker />
        </Suspense>
    ) : null
}

// a walk along points: its pieces and their lengths
const route = (pts) => {
    const segs = []
    let total = 0
    for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i]
        const len = Math.hypot(b[0] - a[0], b[1] - a[1])
        segs.push({ a, b, len, from: total })
        total += len
    }
    return { segs, total }
}
const along = (p, d) => {
    if (!p.segs.length) return null
    const s = p.segs.find((g) => d <= g.from + g.len) ?? p.segs[p.segs.length - 1]
    const k = s.len ? Math.min(1, (d - s.from) / s.len) : 1
    return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k, Math.atan2(s.b[0] - s.a[0], s.b[1] - s.a[1])]
}
const faceTo = (from, to) => Math.atan2(to[0] - from[0], to[1] - from[1])

/**
 * Found him! Touch the little Chonti on a route and he bursts into confetti and is gone (until that
 * route is opened again). The confetti: little paper pieces in the palette's colours, flung out and
 * up from where he stood, tumbling and fading as they fall (sizes in the island's units).
 */
const BITS = 90
const CONFETTI_TIME = 1.8 // s
const CONFETTI_COLORS = [PALETTE.naranja, PALETTE.mango, PALETTE.rosa, PALETTE.lima, PALETTE.crema, '#E8641C']
function makeConfetti() {
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: false, toneMapped: false })
    const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.05, 0.03), mat, BITS)
    mesh.name = 'chonti_confeti'
    mesh.frustumCulled = false
    mesh.visible = false
    const color = new THREE.Color()
    for (let i = 0; i < BITS; i++) mesh.setColorAt(i, color.set(CONFETTI_COLORS[i % CONFETTI_COLORS.length]))
    const bits = Array.from({ length: BITS }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), spin: new THREE.Vector3() }))
    return { mesh, bits, t: -1 }
}
const dummy = new THREE.Object3D()
function popConfetti(c, at) {
    c.t = 0
    c.mesh.visible = true
    for (const b of c.bits) {
        const a = Math.random() * Math.PI * 2, out = 0.35 + Math.random() * 0.9
        b.p.copy(at).add(new THREE.Vector3(0, 0.22 + Math.random() * 0.12, 0))
        b.v.set(Math.cos(a) * out, 1.1 + Math.random() * 1.3, Math.sin(a) * out)
        b.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6)
        b.spin.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14)
    }
}
function stepConfetti(c, dt) {
    if (c.t < 0) return
    c.t += dt
    if (c.t > CONFETTI_TIME) {
        c.t = -1
        c.mesh.visible = false
        return
    }
    for (let i = 0; i < BITS; i++) {
        const b = c.bits[i]
        // (paper: gravity, but the air holds it — it flutters down slowly once it has flown out)
        b.v.y -= 3.2 * dt
        b.v.multiplyScalar(Math.exp(-dt * 1.8))
        b.p.addScaledVector(b.v, dt)
        b.r.x += b.spin.x * dt, b.r.y += b.spin.y * dt, b.r.z += b.spin.z * dt
        dummy.position.copy(b.p)
        dummy.rotation.copy(b.r)
        dummy.updateMatrix()
        c.mesh.setMatrixAt(i, dummy.matrix)
    }
    c.mesh.instanceMatrix.needsUpdate = true
    c.mesh.material.opacity = 1 - THREE.MathUtils.smoothstep(c.t, CONFETTI_TIME * 0.55, CONFETTI_TIME)
}

function Walker() {
    const { camera, scene } = useThree()
    const root = useRef()
    const rig = useRef()
    const pose = useRef({ step: 0, walk: 0, read: 0, sit: 0, eat: 0, write: 0, lookDown: 0, mouth: 0, expr: 'happy' })
    const st = useRef({ route: null })
    const items = useMemo(props, [])
    const glow = useRef([])
    const confetti = useMemo(makeConfetti, [])
    // touched: confetti where he stood, and he is gone (st.popped, until the route changes)
    const pop = (e) => {
        e.stopPropagation()
        const c = st.current
        if (c.popped || !root.current?.visible) return
        c.popped = true
        root.current.visible = false
        popConfetti(confetti, root.current.position)
        sound.play('pop')
        document.body.style.cursor = ''
    }

    // dressed for nothing, with his props in his hands, without a shadow, and a little light of his own
    useEffect(() => {
        const r = rig.current
        if (!r?.bones) return
        r.setAccessory?.(null)
        root.current.add(items.empanada, items.notebook)
        root.current.traverse((o) => {
            if (!o.isMesh) return
            o.castShadow = false
            for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
                if (!m?.emissive || m.userData.ownLight) continue
                // (his head is painted with colours on its points — its colour is white —: it glows orange)
                if (m.vertexColors) m.emissive.set('#E0763A')
                else m.emissive.copy(m.color)
                m.userData.ownLight = true
                glow.current.push(m)
            }
        })
        return () => {
            items.empanada.removeFromParent()
            items.notebook.removeFromParent()
        }
    }, [items])

    useFrame(({ clock }, dt) => {
        stepConfetti(confetti, Math.min(dt, 0.05))
        const g = root.current
        if (!g || !rig.current?.bones) return
        const s = useExperience.getState()
        const name = s.phase === PHASES.STAGE && s.mode === 'rutas' && PLAN[s.activeRoute] ? s.activeRoute : null
        if (!name) {
            g.visible = false
            st.current.route = null
            return
        }
        // (found and gone in confetti: he comes back only when a route is opened again)
        if (st.current.popped && st.current.route === name) {
            g.visible = false
            return
        }
        const now = clock.elapsedTime
        const c = st.current
        const plan = PLAN[name]
        if (c.route !== name) {
            // (a new route: where he can walk there is read first — a few frames —, then his story starts)
            const mine = new Set()
            g.traverse((o) => mine.add(o))
            Object.assign(c, { route: name, grid: walkGrid(scene, plan.area, mine), ready: false, d: 0, station: 0, leg: null, yaw: undefined, at: null, popped: false })
            if (process.env.NODE_ENV !== 'production') window.__routeChonti = c // (dev: to look at where he can walk)
            Object.assign(pose.current, { walk: 0, read: 0, sit: 0, eat: 0, write: 0, lookDown: 0 })
        }
        if (!c.ready) {
            g.visible = false
            if (!c.grid.step(1400)) return
            c.ready = true
            const G = c.grid
            if (name === 'gastronomico') c.spot = G.nearest(...plan.at)
            else if (name === 'talleres') {
                c.start = G.nearest(...plan.from)
                c.seat = G.nearest(...plan.to, SIT_ROOM)
                // (no way there around everything: he is simply there — never through anything)
                c.walkway = route((c.start && c.seat && G.path(c.start, c.seat)) ?? [c.seat ?? plan.to, c.seat ?? plan.to])
            } else {
                // each gata: he stands on the path, as near as it lets him to her and her panel (the
                // hedges keep him on it), and walks the park in order, gata after gata
                c.stations = gatas(scene)
                    .map((st) => ({ ...st, spot: G.nearest((st.cat[0] + st.panel[0]) / 2, (st.cat[1] + st.panel[1]) / 2) }))
                    .filter((st) => st.spot)
                    .sort((a, b) => a.spot[0] - b.spot[0])
            }
        }
        g.visible = true
        const G = c.grid
        const p = pose.current
        const k = 1 - Math.exp(-dt * 5)
        let x, z, yaw = c.yaw ?? 0, want = { walk: 0, read: 0, sit: 0, eat: 0, write: 0, lookDown: 0 }, expr = 'happy', mouth = 0
        if (name === 'gastronomico') {
            ;[x, z] = c.spot ?? plan.at
            yaw = Math.atan2(camera.position.x - x, camera.position.z - z) // (eating, facing you)
            want.eat = 1
            // (a bite — his head down to it, mouth open — then chewing, happy)
            const biting = Math.sin(now * 2.4) > 0.3
            mouth = biting ? 0.9 : Math.abs(Math.sin(now * 9)) * 0.5
            expr = biting ? 'excited' : 'happy'
        } else if (name === 'talleres') {
            const w = c.walkway
            c.d = Math.min(w.total, c.d + SPEED * dt)
            const at = along(w, c.d) ?? [...(c.seat ?? plan.to), yaw]
            x = at[0], z = at[1]
            if (c.d < w.total) {
                yaw = at[2]
                want.walk = 1
            } else {
                // there: sitting on the floor of the plaza, drawing La Tertulia in his notebook,
                // looking up at it now and then
                yaw = faceTo([x, z], plan.face)
                want.sit = 1
                want.write = 1
                const up = Math.sin(now * 0.7) > 0.6
                want.lookDown = up ? 0 : 0.55
                expr = up ? 'thinking' : 'happy'
            }
        } else {
            // the gatas: walk to one (around everything), look at her, read her panel, walk on
            const list = c.stations
            if (!list.length) {
                g.visible = false
                return
            }
            const here = list[c.station % list.length]
            if (!c.leg) {
                const from = c.at ?? here.spot
                // (no way there around everything: he is simply there — never through anything)
                c.leg = { way: route(G.path(from, here.spot) ?? [here.spot, here.spot]), d: 0, arrived: null }
            }
            const leg = c.leg
            leg.d = Math.min(leg.way.total, leg.d + SPEED * dt)
            const at = along(leg.way, leg.d) ?? [here.spot[0], here.spot[1], yaw]
            x = at[0], z = at[1]
            if (leg.d < leg.way.total - 0.001) {
                yaw = at[2]
                want.walk = 1
            } else {
                leg.arrived ??= now
                const t = now - leg.arrived
                if (t < LOOK) {
                    yaw = faceTo([x, z], here.cat)
                    expr = t < 1.2 ? 'surprised' : 'love'
                    want.lookDown = 0.25
                } else if (t < LOOK + READ) {
                    yaw = faceTo([x, z], here.panel)
                    want.read = 1
                    want.lookDown = 0.4
                    expr = 'thinking'
                } else {
                    c.at = [x, z]
                    c.station++
                    c.leg = null
                }
            }
        }
        // smooth: the pose, the turn
        for (const key of Object.keys(want)) p[key] += (want[key] - p[key]) * k
        p.mouth = mouth
        p.expr = expr
        if (p.walk > 0.05) p.step += dt * 9 * p.walk
        let dy = yaw - (c.yaw ?? yaw)
        dy = Math.atan2(Math.sin(dy), Math.cos(dy))
        c.yaw = (c.yaw ?? yaw) + dy * (1 - Math.exp(-dt * 6))
        // (on the floor under him, as it is: the walk, the step of the plaza…)
        const y = G.at(x, z) ?? c.y ?? 0.3
        c.y = y
        g.position.set(x, y, z)
        g.rotation.y = c.yaw
        items.empanada.visible = name === 'gastronomico'
        items.notebook.visible = p.write > 0.5
        // (his own light: a little by day, more at dusk and at night)
        const light = 0.12 + skyState.night * 0.38
        for (const m of glow.current) m.emissiveIntensity = light
        poseChonti(rig.current, p, now)
        if (items.empanada.visible) holdInHands(rig.current, items.empanada, { out: 0.12 })
        if (items.notebook.visible) holdInHands(rig.current, items.notebook, { down: 0.06, out: 0.05 })
    })

    return (
        <>
            <group
                ref={root}
                scale={SIZE}
                visible={false}
                name="chonti_rutas"
                onClick={pop}
                onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = 'pointer'))}
                onPointerOut={() => (document.body.style.cursor = '')}
            >
                <Chonti ref={rig} />
                {/* (where a touch finds him: he is tiny on the map — a few pixels —, so a bubble a bit
                    bigger than him, invisible, catches it) */}
                <mesh position-y={1.1} scale={[1.6, 1.9, 1.6]}>
                    <sphereGeometry args={[1, 12, 8]} />
                    <meshBasicMaterial visible={false} />
                </mesh>
            </group>
            <primitive object={confetti.mesh} />
        </>
    )
}
