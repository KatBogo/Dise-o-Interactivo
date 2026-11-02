import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { PHASES } from '../../config.js'
import { PALETTE } from '../../theme.js'
import { skyOf, useExperience } from '../../store/useExperience.js'
import { sound } from '../../audio/sound.js'
import Chonti, { poseChonti } from './ChontiModel.jsx'

// Gestures that come with a reaction (on top of the expression)
// (he is expressive: every reaction has its gesture — a hop, a laugh, a wave, a little dance, his
// hand under the chin, his head down when he is sad, a jump back when he gets scared)
const GESTURE = { excited: 'excite', laugh: 'laugh', wink: 'wave', love: 'excite', dance: 'dance', thinking: 'think', surprised: 'excite', sad: 'droop', shy: 'droop', scared: 'excite', sleepy: 'droop', happy: 'wave', shocked: 'excite' }
const REACTION_TIME = 2.8 // s
const REACTION_TIMES = { laugh: 1.1 } // a quick laugh when you tap him, not a long one
const ACCESSORY = { alumbrado: 'santa', feria: 'glasses', sucursal: 'cap' }
// What he does on his own while he waits: follow the pointer with his whole body, scratch his
// head, look around, wave at you, a little hop, think — each with its face, for so many seconds
const IDLE = ['follow', 'scratch', 'lookAround', 'wave', 'hop', 'think', 'follow']
const IDLE_TIME = { follow: 5, scratch: 2.4, lookAround: 3.5, wave: 2, hop: 1.6, think: 2.6 }
const IDLE_GESTURE = { scratch: 'scratch', wave: 'wave', hop: 'excite', think: 'think' }
const IDLE_FACE = { follow: 'happy', scratch: 'thinking', lookAround: 'surprised', wave: 'happy', hop: 'excited', think: 'thinking' }

// His own little transparent canvas in the bottom-left corner (px). It sits ABOVE the plan
// selector's colour filters and the menus, so nothing tints or covers him.
const W = 320
const H = 420
// feet, from the corner · phones: small, just above the bottom bar, beside "Volver al mapa"
// — or standing on top of the open card (GuideChonti lifts the whole layer)
// (80 on computers; phones and narrow windows 46 — small, so his bubble sits low, right above his
// hat, and not up at the top of the screen)
// (phones: far enough from the left edge that his hat / glasses / cap are never cut by it)
const spot = (narrow) => ({ fx: narrow ? 58 : 112, fy: narrow ? 74 : 34, scale: narrow ? 46 : 80 })
const SHEETS = '.panel--right, .card--float, .card-pill'
// his height (× scale) from the feet to the top of what he wears — measured on the model whenever
// he changes outfit (the pompom of the Christmas hat goes well above his stem)
const height = { units: 2.1 }
const BUBBLE_GAP = 30 // px between the top of his hat and the bottom of his bubble (he hops a little when he reacts)
const box = new THREE.Box3(), part = new THREE.Box3(), toRoot = new THREE.Matrix4()
function measureHeight(root) {
    root.updateMatrixWorld(true)
    const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
    box.makeEmpty()
    root.traverse((o) => {
        if (!o.isMesh) return
        for (let n = o; n && n !== root; n = n.parent) if (!n.visible) return
        // (what he wears is skinned to him: its box as it sits in his pose, not in the file's)
        if (o.isSkinnedMesh) o.computeBoundingBox()
        else if (!o.geometry.boundingBox) o.geometry.computeBoundingBox()
        box.union(part.copy(o.isSkinnedMesh ? o.boundingBox : o.geometry.boundingBox).applyMatrix4(toRoot.multiplyMatrices(inv, o.matrixWorld)))
    })
    if (!box.isEmpty()) height.units = box.max.y
}

/** What Chonti feels when nothing special is happening: depends on the event, the weather and the hour. */
function moodNow(s) {
    const event = s.mode === 'eventos' ? s.activeEvent : null
    if (event === 'sucursal') return { expr: 'laugh', dance: 1 }
    if (event === 'alumbrado') return { expr: 'love' }
    if (event === 'feria') return { expr: 'happy' }
    const sky = skyOf(s)
    if (sky.weather === 'storm') return { expr: 'scared' }
    if (sky.weather === 'rain' || sky.weather === 'drizzle') return { expr: 'sad' }
    if (sky.hour >= 21.5 || sky.hour < 5) return { expr: 'sleepy' }
    return { expr: 'calm' }
}

// ── the magic trick: sparkles + a big soft cloud of smoke when he appears or vanishes ──
const SPARKLE = (() => {
    const s = new THREE.Shape()
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 2
        const r = i % 2 ? 0.22 : 1
        s[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r)
    }
    return new THREE.ShapeGeometry(s)
})()
const QUAD = new THREE.PlaneGeometry(1, 1)
let smokeTexture = null
function getSmokeTexture() {
    if (smokeTexture) return smokeTexture
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    // a few overlapping soft blobs → a billowy puff, not a perfect disc
    for (const [x, y, r, a] of [[64, 64, 60, 0.55], [46, 72, 36, 0.4], [82, 70, 34, 0.4], [62, 46, 34, 0.35]]) {
        const grd = g.createRadialGradient(x, y, 0, x, y, r)
        grd.addColorStop(0, `rgba(255,255,255,${a})`)
        grd.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = grd
        g.fillRect(0, 0, 128, 128)
    }
    smokeTexture = new THREE.CanvasTexture(c)
    return smokeTexture
}
const SPARKLE_COLORS = [PALETTE.mango, PALETTE.crema, PALETTE.lima, PALETTE.rosa, '#FFFFFF']
const N_SPARKS = 16
const N_SMOKE = 16

function MagicBurst({ fx }) {
    const sparks = useRef([])
    const smoke = useRef([])
    const data = useMemo(
        () => ({
            sparks: Array.from({ length: N_SPARKS }, (_, i) => ({ a: (i / N_SPARKS) * Math.PI * 2 + Math.random() * 0.3, d: 1.3 + Math.random() * 1.1, s: 0.12 + Math.random() * 0.12, spin: (Math.random() - 0.5) * 8 })),
            // smoke: puffs from his feet that billow out, rise and fade (some behind him, some in front)
            smoke: Array.from({ length: N_SMOKE }, (_, i) => ({
                a: (i / N_SMOKE) * Math.PI * 2 + Math.random() * 0.4,
                d: 0.5 + Math.random() * 0.9,
                s: 0.9 + Math.random() * 0.9,
                rise: 0.6 + Math.random() * 1.2,
                z: i % 3 === 0 ? 1.2 : -0.8,
                rot: Math.random() * Math.PI * 2,
                tint: 0.86 + Math.random() * 0.14,
            })),
            sparkMats: SPARKLE_COLORS.map((c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, depthTest: false, toneMapped: false })),
            smokeMats: Array.from({ length: N_SMOKE }, () => new THREE.MeshBasicMaterial({ map: getSmokeTexture(), color: '#F4EEE6', transparent: true, depthWrite: false, toneMapped: false })),
        }),
        []
    )
    const asleep = useRef(true)
    useFrame(() => {
        const age = fx.current.t0 < 0 ? 99 : performance.now() / 1000 - fx.current.t0
        // (once the smoke has cleared, nothing to move until his next entrance or exit)
        if (age > 2 && asleep.current) return
        asleep.current = age > 2
        const p = age / 1.1 // sparkles
        const q = age / 1.9 // smoke lasts longer
        const e = 1 - Math.pow(1 - Math.min(1, p), 3)
        const es = 1 - Math.pow(1 - Math.min(1, q), 2)
        data.sparks.forEach((s, i) => {
            const m = sparks.current[i]
            if (!m) return
            m.visible = p < 1
            m.position.set(Math.cos(s.a) * s.d * e, 1.1 + Math.sin(s.a) * s.d * e + e * 0.4, 2)
            m.rotation.z = s.spin * p
            m.scale.setScalar(s.s * Math.sin(Math.min(1, p) * Math.PI) * 1.4)
        })
        data.sparkMats.forEach((mt) => (mt.opacity = 1 - Math.min(1, p) ** 2))
        data.smoke.forEach((s, i) => {
            const m = smoke.current[i]
            if (!m) return
            m.visible = q < 1
            m.position.set(Math.cos(s.a) * s.d * (0.3 + es * 1.1), 0.25 + Math.abs(Math.sin(s.a)) * 0.5 * es + s.rise * es, s.z)
            m.rotation.z = s.rot + es * 0.8
            m.scale.setScalar(s.s * (0.4 + es * 1.3))
            // thick at first (it hides his arrival), then it thins out and fades
            data.smokeMats[i].opacity = Math.min(1, q * 8) * (1 - es) * 0.95
            data.smokeMats[i].color.setScalar(s.tint)
        })
    })
    return (
        <group>
            {data.smoke.map((s, i) => (
                <mesh key={'m' + i} ref={(el) => (smoke.current[i] = el)} geometry={QUAD} material={data.smokeMats[i]} visible={false} renderOrder={s.z > 0 ? 5 : -1} />
            ))}
            {data.sparks.map((_, i) => (
                <mesh key={'s' + i} ref={(el) => (sparks.current[i] = el)} geometry={SPARKLE} material={data.sparkMats[i % SPARKLE_COLORS.length]} visible={false} renderOrder={6} />
            ))}
        </group>
    )
}

/**
 * Chonti as the narrator, in his corner. He reacts to what you do (store.react): choosing a plan,
 * opening a place, an event (he dances at the Sucursal Fest), the hour (sleepy late at night), the
 * mouse (his eyes follow it, he gets happy when you hover a button), clicks on him (he laughs and
 * waves) and inactivity (he dozes off). He moves his mouth while the voice speaks.
 */
function GuideScene({ show, narrow, onGone }) {
    const reaction = useExperience((s) => s.reaction)
    const { fx: footX, fy: footY, scale } = spot(narrow)
    const x = -W / 2 + footX
    const y = -H / 2 + footY

    const root = useRef()
    const rig = useRef()
    const pose = useRef({ step: 0, walk: 0, talk: 0, wave: 0, excite: 0, think: 0, scratch: 0, dance: 0, look: [0, 0], spin: 0, turn: 0 })
    // idle: the little thing he is doing while he waits · thinkUntil: you clicked something, he ponders it
    const react = useRef({ kind: null, until: 0, idleSince: 0, hover: false, idle: null, nextIdle: 0, thinkUntil: 0 })
    const pointer = useRef({ x: 0, y: 0 })
    const burst = useRef({ t0: -1 })

    // like a magician: ¡puf! smoke, sparkles, and he spins in (or out, when the voice goes off)
    useEffect(() => {
        const g = root.current
        if (!g) return
        burst.current.t0 = performance.now() / 1000
        sound.play('magic')
        const tl = gsap.timeline()
        if (show) {
            tl.fromTo(g.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: scale, y: scale, z: scale, duration: 0.7, ease: 'back.out(2.2)', delay: 0.25 })
              .fromTo(g.position, { y: y + 30 }, { y, duration: 0.7, ease: 'bounce.out' }, '<')
              .fromTo(pose.current, { spin: Math.PI * 4 }, { spin: 0, duration: 0.8, ease: 'power3.out' }, '<')
              .to(pose.current, { wave: 1, duration: 0.3 })
              .to(pose.current, { wave: 0, duration: 0.4 }, '+=1.4')
        } else {
            tl.to(pose.current, { spin: Math.PI * 4, duration: 0.5, ease: 'power2.in' })
              .to(g.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.45, ease: 'back.in(2)' }, '<0.1')
              .call(onGone, null, '+=0.9') // the smoke clears before the canvas goes
        }
        return () => tl.kill()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    // dressed for each event: Christmas hat at the Alumbrado, little glasses at the Feria del
    // Libro, a pink cap at the Sucursal Fest
    const worn = useRef(undefined)
    useFrame(() => {
        const s = useExperience.getState()
        const outfit = s.mode === 'eventos' ? ACCESSORY[s.activeEvent] ?? null : null
        if (outfit === worn.current || !rig.current?.setAccessory) return
        worn.current = outfit
        rig.current.setAccessory(outfit)
        measureHeight(root.current) // (in his own units: his feet at 0, before his scale on the screen)
    })

    // reactions from the store
    useEffect(() => {
        if (!reaction.kind) return
        react.current.kind = reaction.kind
        react.current.until = performance.now() / 1000 + (REACTION_TIMES[reaction.kind] ?? REACTION_TIME)
    }, [reaction])
    // the mouse: his eyes follow it; any interaction wakes him up
    useEffect(() => {
        const move = (e) => {
            pointer.current.x = e.clientX
            pointer.current.y = e.clientY
            react.current.idleSince = performance.now() / 1000
            react.current.hover = !!e.target.closest?.('button, a, [role="button"]')
        }
        const wake = (e) => {
            const now = performance.now() / 1000
            react.current.idleSince = now
            // you clicked something (not him): he puts his hand under his chin and thinks about it
            if (e?.target?.closest?.('button, a, [role="button"], .marker-label') && !e.target.closest('.guide-layer__hit')) react.current.thinkUntil = now + 1.6
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerdown', wake)
        window.addEventListener('keydown', wake)
        return () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerdown', wake)
            window.removeEventListener('keydown', wake)
        }
    }, [])

    useFrame(({ clock }, dt) => {
        if (!rig.current) return
        const t = clock.elapsedTime
        const now = performance.now() / 1000
        const p = pose.current
        const s = useExperience.getState()
        const k = 1 - Math.exp(-dt * 6)
        const r = react.current
        if (!r.idleSince) r.idleSince = now

        // expression: reaction > talking > a click he thinks about > what he does while waiting >
        // hovering a button > dozing off > mood of the moment
        const mood = moodNow(s)
        const reacting = r.kind && now < r.until
        const pondering = !reacting && r.thinkUntil > now
        // while he waits (no reaction, not talking), every 8–16 s he does something on his own
        if (!r.nextIdle) r.nextIdle = now + 5
        if (!reacting && !s.speaking && now > r.nextIdle) {
            const kind = IDLE[Math.floor(Math.random() * IDLE.length)]
            r.idle = { kind, t0: now, until: now + IDLE_TIME[kind] }
            r.nextIdle = now + IDLE_TIME[kind] + 8 + Math.random() * 8
        }
        const idle = !reacting && !pondering && !s.speaking && r.idle && now < r.idle.until ? r.idle : null
        let expr = mood.expr
        if (now - r.idleSince > 25) expr = 'sleepy'
        if (idle) expr = IDLE_FACE[idle.kind]
        if (r.hover) expr = 'happy'
        if (pondering) expr = 'thinking'
        if (s.speaking) expr = 'talking'
        if (reacting) expr = r.kind === 'dance' ? 'laugh' : r.kind
        p.expr = p.wave > 0.4 && !reacting ? 'wink' : expr

        // gestures
        const gesture = reacting ? GESTURE[r.kind] : pondering ? 'think' : idle ? IDLE_GESTURE[idle.kind] : null
        p.excite += ((gesture === 'excite' ? 1 : 0) - p.excite) * k
        p.think += ((gesture === 'think' ? 1 : 0) - p.think) * k
        p.scratch += ((gesture === 'scratch' ? 1 : 0) - p.scratch) * k
        p.dance += ((gesture === 'dance' || mood.dance ? 1 : 0) - p.dance) * k
        // the laugh comes in at once (it is short: a slow blend made it barely show on phones)
        p.laugh = (p.laugh ?? 0) + ((gesture === 'laugh' ? 1 : 0) - (p.laugh ?? 0)) * (1 - Math.exp(-dt * 14))
        if (gesture === 'wave') p.wave = Math.max(p.wave, 0.9)
        else if (!reacting) p.wave += (0 - p.wave) * k * 0.5
        p.talk += ((s.speaking ? 1 : 0) - p.talk) * (1 - Math.exp(-dt * 10))
        // sad / shy / sleepy: the head goes down a little (and comes back up) · following the pointer:
        // his head goes up and down with it
        const following = idle?.kind === 'follow'
        const headTarget = gesture === 'droop' ? 0.55 : following ? THREE.MathUtils.clamp(-p.look[1] * 0.35, -0.2, 0.4) : 0
        p.lookDown = (p.lookDown ?? 0) + (headTarget - (p.lookDown ?? 0)) * k
        // and every new reaction starts with a little bounce of his whole body
        const fresh = reacting ? Math.max(0, 1 - (now - (r.until - (REACTION_TIMES[r.kind] ?? REACTION_TIME))) / 0.45) : 0
        // (only while it bounces: his entrance animation moves him too)
        if (reacting && now - (r.until - (REACTION_TIMES[r.kind] ?? REACTION_TIME)) < 0.6) root.current.position.y = y + Math.sin(fresh * Math.PI) * 10 * (gesture === 'droop' ? 0.3 : 1)

        // his eyes follow the mouse (relative to where he stands on the screen)
        const cx = footX, cy = window.innerHeight - (footY + scale * 1.2)
        p.look[0] = Math.max(-1, Math.min(1, (pointer.current.x - cx) / (window.innerWidth * 0.35)))
        p.look[1] = Math.max(-1, Math.min(1, -(pointer.current.y - cy) / (window.innerHeight * 0.35)))

        // his body turns: a little towards the pointer always · all the way while he follows it ·
        // left and right when he looks around
        let turn = p.look[0] * 0.15
        if (following) turn = p.look[0] * 0.7
        if (idle?.kind === 'lookAround') turn = Math.sin(((now - idle.t0) / IDLE_TIME.lookAround) * Math.PI * 2) * 0.65
        // at the Feria del Libro and the Sucursal Fest (only there) he stands facing you, square to
        // the screen, showing his glasses / his cap: just his eyes and a hint of his head follow the pointer
        const facing = s.mode === 'eventos' && (s.activeEvent === 'feria' || s.activeEvent === 'sucursal')
        if (facing) turn = p.look[0] * 0.06
        p.turn += (turn - p.turn) * (1 - Math.exp(-dt * 3))
        p.base = (p.base ?? 0.45) + ((facing ? 0 : 0.45) - (p.base ?? 0.45)) * (1 - Math.exp(-dt * 4))
        root.current.rotation.y = p.base + Math.sin(t * 0.7) * (facing ? 0.02 : 0.08) + p.turn + p.spin
        poseChonti(rig.current, p, t)
    })

    return (
        <>
            <ambientLight intensity={1.4} />
            <directionalLight position={[-2, 4, 6]} intensity={2.2} />
            <group ref={root} position={[x, y, 0]} scale={0.01}>
                <Chonti ref={rig} />
            </group>
            <group position={[x, y, 0]} scale={scale}>
                <MagicBurst fx={burst} />
            </group>
        </>
    )
}

/** The guide layer: shown on the island whenever his voice (the guide) is on. */
export default function GuideChonti() {
    const guide = useExperience((s) => s.guide)
    const phase = useExperience((s) => s.phase)
    const show = guide && phase === PHASES.STAGE
    const [mounted, setMounted] = useState(show)
    const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 800)

    useEffect(() => {
        if (show) setMounted(true)
    }, [show])
    useEffect(() => {
        const fit = () => setNarrow(window.innerWidth < 800)
        window.addEventListener('resize', fit)
        return () => window.removeEventListener('resize', fit)
    }, [])

    // phones: when a card / sheet is open he stands ON it (left side of its top edge), so he never
    // covers what it says and the sheet can sit low, leaving the island in view
    const layer = useRef()
    useEffect(() => {
        const el = layer.current
        if (!mounted || !el) return
        if (!narrow) {
            el.style.translate = ''
            return
        }
        const place = () => {
            let top = Infinity
            for (const sheet of document.querySelectorAll(SHEETS)) if (sheet.getClientRects().length) top = Math.min(top, sheet.getBoundingClientRect().top)
            const lift = top === Infinity ? 0 : Math.max(0, window.innerHeight - top - spot(true).fy - 3)
            el.style.translate = `0 ${-lift}px`
        }
        place()
        const id = setInterval(place, 200)
        return () => clearInterval(id)
    }, [mounted, narrow])

    // where the top of his head is (hat included): his bubble sits right above it — on phones too —,
    // with room to spare, so it never covers his Christmas hat / cap — whatever he wears, it follows
    useEffect(() => {
        if (!mounted) return
        const html = document.documentElement.style
        let last = ''
        const publish = () => {
            const { fy, scale } = spot(narrow)
            const top = fy + scale * height.units
            const v = `${Math.round(top + BUBBLE_GAP)}px`
            if (v === last) return
            last = v
            if (v) html.setProperty('--bubble-bottom', v)
            else html.removeProperty('--bubble-bottom')
        }
        publish()
        const id = setInterval(publish, 250)
        return () => {
            clearInterval(id)
            html.removeProperty('--bubble-bottom')
        }
    }, [mounted, narrow])

    // tickles: he laughs, hands on his belly, with a short "ja ja ja" on the rhythm of it
    const lastTickle = useRef(0)
    const tickle = () => {
        lastTickle.current = performance.now()
        sound.unlock() // (a phone may have put the sound to sleep)
        useExperience.getState().react('laugh')
        sound.play('laugh')
    }

    if (!mounted) return null
    const { fx, fy, scale } = spot(narrow)
    return (
        <div ref={layer} className="guide-layer" style={{ width: W, height: H }}>
            {/* R3F wraps the canvas in a div with pointer-events: auto → it would steal the hover of the
                Lugares slice and the menus under it; only the button below catches clicks */}
            <Canvas style={{ pointerEvents: 'none' }} orthographic dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 500], zoom: 1, near: 1, far: 1000 }}>
                <Suspense fallback={null}>
                    <GuideScene show={show} narrow={narrow} onGone={() => setMounted(false)} />
                </Suspense>
            </Canvas>
            {/* tap him: he laughs, hands on his belly (a real button, so it works with the keyboard too) */}
            {show && (
                <button
                    className="guide-layer__hit"
                    style={{ left: Math.max(0, fx - scale * 0.9), bottom: fy - 6, width: scale * 1.8, height: scale * 2.6 }}
                    aria-label="Chonti, tu guía"
                    // pointerdown too: on phones it answers at the touch, without waiting for the click
                    onPointerDown={(e) => {
                        if (e.pointerType === 'mouse') return
                        tickle()
                    }}
                    onClick={() => {
                        if (performance.now() - lastTickle.current < 600) return // (already done at the touch)
                        tickle()
                    }}
                />
            )}
        </div>
    )
}
