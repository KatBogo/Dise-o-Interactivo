import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { CAMERA, CLOUD_SEA, FALL_AT, INTRO_Y, PHASES, STAGES, prefersReducedMotion, stageProgress } from '../../config.js'
import { introState, useExperience } from '../../store/useExperience.js'
import Chonti, { poseChonti } from './ChontiModel.jsx'
import { CHONTI_RADIUS, createFallWorld } from './fallPhysics.js'
import { sound } from '../../audio/sound.js'
import { UI } from '../../data/content.js'
import ScreenHtml from '../ScreenHtml.jsx'
import { PALETTE } from '../../theme.js'

// reading: turned towards the timeline (on the left), in profile, like a museum visitor — seen from
// behind, a head looking UP showed us his crown and read as looking at the floor
const YAW = { right: Math.PI / 2, front: 0, reading: -1.45 }
// overhead camera for the fall: looking straight down, screen-up = −z (no lookAt flips → no shaking)
const Q_TOP = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)))
export { Q_TOP }
const ink = '#3A3A36' // dark grey (allowed earth/grey tone) for the minimalist floor line
const lerp = THREE.MathUtils.lerp
const smooth = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b)

/**
 * The intro in 3D. Stages 1–3 are pure functions of the scroll (introState.progress, written by
 * IntroTimeline's ScrollTrigger), so they also play backwards:
 *  1. walks left → right on the cream screen, happy
 *  2. stops, surprised: the timeline appears behind him; he turns to it (mostly his back to us)
 *  3. reads like an interested museum visitor: his head follows the date in focus as the column slides down,
 *     and every new date gets a reaction in turn (opens his arms · thinks with his hand under
 *     the chin · scratches his head), with the character sheet's expressions
 * Before stage 1 he greets us (facing the front, smiling, waving) and turns to walk; the scroll is
 * locked until then (store `greeting`).
 * At FALL_AT the AUTOMATIC fall plays: a jump of surprise, he looks down, the timeline leaves, cannon-es drops him and
 * the camera turns to an overhead (cenital) view. He doesn't tumble: he turns to us and falls on
 * his back, face up, looking at the camera, into a sea of soft clouds until he disappears.
 */
export default function IntroScene() {
    const phase = useExperience((s) => s.phase)
    const setPhase = useExperience((s) => s.setPhase)
    const camera = useThree((s) => s.camera)
    const size = useThree((s) => s.size)

    const root = useRef()
    const sway = useRef()
    const heading = useRef()
    const lying = useRef() // falling on his back (inside the heading)
    const rig = useRef()
    const blob = useRef()
    const floorLine = useRef()
    const physics = useRef(null)
    const fallen = useRef(false)
    const fallTl = useRef(null) // the fall's gestures (paused: driven by fallClock)
    const fallClock = useRef(0) // s since the fall began, clamped per frame like the physics
    const fallFront = useRef(null) // where the camera was when the fall began
    const fallFollow = useRef(null) // where the camera follows him: his path, eased (smooth, never jerky)
    const prevX = useRef(0)
    const lastSlot = useRef(-1)
    const pose = useRef({ step: 0, walk: 0, read: 0, flail: 0, lookDown: 0, excite: 0, think: 0, scratch: 0, expr: 'happy' })
    const fx = useRef({ wobble: 0, droppedAt: -1, interestUntil: 0, interest: 0, qFront: null, front: 0, jump: 0, bang: 0 })
    const bang = useRef() // the "!" that pops over his head when he startles
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') window.__introFx = fx.current // dev: inspect the fall effects
    const greeting = useExperience((s) => s.greeting)
    const greetStarted = useExperience((s) => s.greetStarted)
    const waiting = phase === PHASES.INTRO && greeting && !greetStarted // facing us, waiting for a touch
    const gaze = useRef({ x: 0, y: 0 }) // where he looks while waiting (-1..1)
    const headPos = useMemo(() => new THREE.Vector3(), [])
    const yaw = useRef(YAW.right)
    const look = useMemo(() => new THREE.Vector3(...CAMERA.intro.target), [])
    const tmp = useMemo(() => ({ front: new THREE.Vector3(), top: new THREE.Vector3(), lookTop: new THREE.Vector3() }), [])
    // the heading that makes him look straight into the camera from where he stands
    const faceYaw = (x) => Math.atan2(camera.position.x - x, camera.position.z)

    // Screen-space layout at the intro depth (any aspect ratio / FOV)
    const { startX, endX, camLift, lowY, big } = useMemo(() => {
        const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * CAMERA.intro.position[2]
        const halfW = halfH * (size.width / size.height)
        const narrow = size.width < 800
        // portrait: Chonti near the bottom of the screen, the dates above him
        // · the timeline: the camera rises so he stands at the very BOTTOM of the screen (his feet
        //   at ~6% from the edge) — the cards rest above him and he is never on top of them
        //   (the view centre is 0.3 under the camera: feet at NDC −0.88)
        // (phones: he stands a little higher — feet at ~11% from the edge; a phone held upright: small,
        // so the dates have the whole width and room above him — a narrow window lying down: a bit
        // smaller than on a computer)
        const portrait = size.height > size.width
        return {
            startX: -halfW * 0.8,
            endX: halfW * (narrow ? 0.66 : 0.74),
            camLift: narrow ? halfH * 0.5 : 0,
            lowY: INTRO_Y + 0.3 + (narrow ? 0.78 : 0.88) * halfH,
            big: narrow ? (portrait ? 0.72 : 0.95) : 1.08,
        }
        // camera.fov is set from the aspect ratio (CameraRig), so size is the real dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size.width, size.height, camera.fov])

    // Back from the island to the timeline: Chonti stands again, ready to read and fall again
    useEffect(() => {
        if (phase !== PHASES.INTRO) return
        fallen.current = false
        physics.current = null
        Object.assign(fx.current, { wobble: 0, droppedAt: -1, interestUntil: 0, qFront: null, front: 0, jump: 0, bang: 0 })
        Object.assign(pose.current, { flail: 0, lookDown: 0, excite: 0, think: 0, scratch: 0, wave: 0, expr: 'happy' })
        root.current?.rotation.set(0, 0, 0)
        lying.current?.rotation.set(0, 0, 0)
        if (sway.current) sway.current.rotation.set(0, 0, 0)
    }, [phase])

    // ── GREETING: he faces us and waits, following the pointer with his eyes and head; when you
    //    touch him he waves and introduces himself, then turns to walk ──
    useEffect(() => {
        if (phase !== PHASES.INTRO || !greeting) return
        const p = pose.current
        const f = fx.current
        const fast = prefersReducedMotion() ? 0.5 : 1
        f.front = 1 // already facing us when the loader fades away
        yaw.current = Math.atan2(camera.position.x - (root.current?.position.x ?? 0), camera.position.z)
        if (!greetStarted) return // waiting for you to touch him
        const tl = gsap.timeline({ delay: 0.1, onComplete: () => useExperience.getState().endGreeting() })
        tl.to(p, { wave: 1, duration: 0.45, ease: 'power2.out' })
          .to(f, { jump: 0.12, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }, '<0.15') // a happy little hop
          .to(p, { wave: 0, duration: 0.45, ease: 'power2.inOut' }, `>${1.9 * fast}`) // ~3 swings of the hand
          // he turns to the right, ready to walk
          .to(f, { front: 0, duration: 0.6 * fast, ease: 'power2.inOut' }, '>-0.1')
        return () => {
            tl.kill()
            // "Saltar intro" (or leaving) mid-greeting: straight to the walking pose
            p.wave = 0
            f.front = 0
            f.jump = 0
        }
    }, [phase, greeting, greetStarted])

    // where the pointer is (his eyes and head follow it while he waits to be touched)
    const pointer = useRef({ x: -1, y: -1 })
    useEffect(() => {
        const move = (e) => ((pointer.current.x = e.clientX), (pointer.current.y = e.clientY))
        window.addEventListener('pointermove', move)
        return () => window.removeEventListener('pointermove', move)
    }, [])

    // ── AUTOMATIC FALL ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== PHASES.FALLING) return
        const r = root.current
        const world = createFallWorld(new THREE.Vector3(r.position.x, INTRO_Y, 0))
        physics.current = world
        const fast = prefersReducedMotion() ? 0.4 : 1
        const p = pose.current
        const f = fx.current
        // (PAUSED: useFrame advances it with the same clamped clock as the physics and the camera — a
        // hitch of the page, e.g. the clouds compiling the first time, never puts them out of step)
        const tl = gsap.timeline({ paused: true })
        fallTl.current = tl
        fallClock.current = 0
        fallFront.current = null
        fallFollow.current = null
        // 1. a jump of surprise: something is going on with the floor! (arms up, he turns to us)
        tl.call(() => (p.expr = 'surprised'))
          .to(p, { read: 0, think: 0, scratch: 0, excite: 1, duration: 0.2, ease: 'back.out(3)' })
          .to(f, { jump: 0.55, duration: 0.3, ease: 'power2.out' }, '<')
          .to(f, { jump: 0, duration: 0.28, ease: 'power2.in' }, '>')
          .to(p, { excite: 0.2, duration: 0.35 }, '>')
          // 2. then he looks down… "¿y el piso?"
          .to(p, { excite: 0, lookDown: 1, duration: 0.6 * fast, ease: 'power2.out' }, `>${0.2 * fast}`)
          // 3. …looks straight back at us and STARTLES: a jolt, arms up, and a "!" over his head
          .call(() => {
              p.expr = 'shocked'
              sound.play('pop')
          }, null, `>${0.4 * fast}`)
          .to(p, { lookDown: 0, duration: 0.18, ease: 'power2.out' }, '<')
          .to(p, { excite: 1, duration: 0.15, ease: 'back.out(3)' }, '<')
          .to(f, { jump: 0.3, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1 }, '<')
          .fromTo(f, { bang: 0 }, { bang: 1, duration: 0.3, ease: 'back.out(3)' }, '<')
          .to(f, { wobble: 0.6, duration: 0.3 }, '>')
          .to(p, { excite: 0.5, duration: 0.4 }, '<')
          // 4. and down he goes (the "!" goes with the floor) — smoothly into the falling pose
          .call(() => world.dropFloor(), null, `>${0.3 * fast}`)
          .to(f, { bang: 0, duration: 0.25, ease: 'power2.in' }, '<0.15')
          .to(p, { excite: 0, duration: 0.5, ease: 'power2.inOut' }, '<')
          .to(p, { flail: 1, duration: 0.6, ease: 'power2.inOut' }, '<')
          .to(fx.current, { wobble: 0, duration: 0.4 }, '<')
          // falling on his back he already faces the overhead camera: the neck straightens (bending it
          // back opened a gap between his chin and his chest), wide-eyed with surprise
          .to(p, { lookDown: 0, duration: 0.5, ease: 'power2.out' }, '<')
        return () => {
            tl.kill()
            fallTl.current = null
        }
    }, [phase])

    useFrame((state, dt) => {
        const t = state.clock.elapsedTime
        const r = root.current
        const p = pose.current
        const intro = phase === PHASES.LOADING || phase === PHASES.INTRO
        r.visible = intro || (phase === PHASES.FALLING && !fallen.current)
        blob.current.visible = intro
        // the floor line belongs to the cream intro only: once he falls it must never stay in the sky
        // (if the intro was skipped its fade never ran and it was left floating over the island)
        if (!intro) floorLine.current.visible = false
        // the "!" floats over his head (upright, whatever his body does), shaking a little
        const bs = fx.current.bang
        bang.current.visible = r.visible && bs > 0.01
        if (bang.current.visible) {
            bang.current.position.set(r.position.x + 0.55, r.position.y - CHONTI_RADIUS + 2.25, r.position.z + 0.2)
            bang.current.scale.setScalar(bs)
            bang.current.rotation.z = -0.2 + Math.sin(t * 12) * 0.05
        }
        if (!r.visible) return
        const k = 1 - Math.exp(-dt * 7)

        // ── Falling: physics drives Chonti; camera cuts to an overhead view ────
        const sim = physics.current
        if (sim) {
            // ONE clock for the whole fall: the physics, his gestures (the timeline) and the camera
            const step = Math.min(dt, 0.05)
            sim.step(step)
            fallClock.current += step
            fallTl.current?.time(fallClock.current)
            const ft = fallClock.current
            // the air holds him: he never goes faster than a gentle top speed, and as he sinks into the
            // clouds it eases down further, as if into cotton — little by little (the speed was cut
            // from ~17 to 5 in one frame at the clouds' top: a jolt)
            const inCloud = 1 - smooth(CLOUD_SEA.top - 3, CLOUD_SEA.top + 5, sim.chonti.position.y)
            const topSpeed = lerp(-8, -4, inCloud)
            if (sim.chonti.velocity.y < topSpeed) sim.chonti.velocity.y += (topSpeed - sim.chonti.velocity.y) * (1 - Math.exp(-step * 2.5))
            // the INTERPOLATED position: the physics runs at a fixed 60 steps a second, so on a 90 /
            // 120 Hz screen the raw position only changes every other frame → he seemed to vibrate
            r.position.copy(sim.chonti.interpolatedPosition)
            r.position.y += fx.current.jump // the jump of surprise (visual only, he lands where he was)
            introState.fallPos = r.position // the clouds that swallow him follow his path (Clouds.jsx)
            const w = fx.current.wobble
            sway.current.rotation.z = Math.sin(t * 5) * 0.1 * w // losing his balance (a slow totter)
            sway.current.rotation.x = Math.sin(t * 3.5) * 0.05 * w

            const falling = sim.chonti.velocity.y < -0.5
            if (falling && fx.current.droppedAt < 0) {
                fx.current.droppedAt = ft
                fx.current.qFront = camera.quaternion.clone()
            }
            const since = fx.current.droppedAt < 0 ? 0 : ft - fx.current.droppedAt
            // no tumbling: before the drop he turns to face the camera; once he drops, his heading is
            // frozen (turning while lying down spun him like a rotisserie) and he simply lies back,
            // face up to the overhead camera, with no wiggles
            // before the drop he turns to the camera; then he falls on his BACK (the lie is inside his
            // heading, so his face always ends up looking straight up at the overhead camera) and,
            // as he falls, he turns flat until his head points to the top of the screen. The body
            // sways like a real fall through the air (rocking and rolling a little)
            const lie = smooth(0.05, 1.2, since)
            const turnTo = fx.current.droppedAt < 0 ? faceYaw(r.position.x) : 0
            yaw.current += (turnTo - yaw.current) * (1 - Math.exp(-dt * (fx.current.droppedAt < 0 ? 5 : 2.5)))
            heading.current.rotation.y = yaw.current
            r.rotation.set(0, 0, 0)
            // tumbling through the air: rocking, rolling and turning on mixed rhythms (his face
            // always stays to the camera)
            const tumble = (k, ph) => Math.sin(t * k + ph) * 0.7 + Math.sin(t * k * 2.3 + ph * 2) * 0.3
            // (Euler XYZ, after lying back: y = rolling about his spine — kept small so his face stays
            // to us — and z = turning flat in the air, the big one)
            // (no roll about his spine — it twisted him sideways —, only a gentle rock and a slow
            // turn in the air, so he falls cleanly on his back facing the camera)
            lying.current.rotation.set((-Math.PI / 2) * lie + tumble(2.2, 0) * 0.08 * lie, 0, tumble(1.2, 1) * 0.16 * lie)
            poseChonti(rig.current, p, t)

            // front view → cenital. ONE curve drives where the camera is, where it looks (from the
            // timeline's view centre to Chonti) and which way is up (from +y to −z): position and
            // rotation can't drift apart — on tall phone screens they did, and Chonti shot up to the
            // top of the screen and came back down
            const blend = smooth(0, 1.2, since)
            // (the camera follows his path eased a little: following each physics step exactly, it
            // trembled with them; a hair behind him, the whole fall glides)
            if (!fallFollow.current) fallFollow.current = r.position.clone()
            const b = fallFollow.current.lerp(r.position, 1 - Math.exp(-step * 10))
            // (where the camera was when the fall began: reading its own moving position every frame made
            // it glide differently on every screen rate)
            if (!fallFront.current) fallFront.current = new THREE.Vector3(camera.position.x, lowY, CAMERA.intro.position[2])
            tmp.front.copy(fallFront.current)
            // (stays above the clouds' top — a soft floor: with a plain max it stopped dead the moment
            // he went past it)
            const over = b.y + 7.5 - (CLOUD_SEA.top + 8)
            tmp.top.set(b.x, CLOUD_SEA.top + 8 + 1.5 * Math.log1p(Math.exp(over / 1.5)), b.z)
            camera.position.lerpVectors(tmp.front, tmp.top, blend)
            tmp.lookTop.lerpVectors(introState.lookTarget, b, blend)
            camera.up.set(0, 1 - blend, -blend).normalize()
            camera.lookAt(tmp.lookTop)
            camera.up.set(0, 1, 0)

            // swallowed by the cloud sea (he sinks through the whole layer, covered little by little)
            // → the clouds open and the map appears
            if (!fallen.current && b.y < CLOUD_SEA.bottom + 0.5) {
                fallen.current = true
                physics.current = null
                introState.lookTarget.copy(look)
                setPhase(PHASES.REVEAL) // the clouds open → map → then the guide question
            }
            return
        }

        const prog = introState.progress
        const s1 = stageProgress(prog, STAGES.walk)
        const s2 = stageProgress(prog, STAGES.discover)
        const s3 = stageProgress(prog, STAGES.timeline)
        introState.reveal = smooth(0.1, 1, s2)

        // 1 → walk to the right · 2/3 → stays there, reading
        const x = lerp(startX, endX, s1)
        r.position.set(x, INTRO_Y + CHONTI_RADIUS + fx.current.jump, 0)
        r.rotation.set(0, 0, 0)
        lying.current.rotation.set(0, 0, 0)

        const speed = Math.abs(x - prevX.current) / Math.max(dt, 1e-3)
        prevX.current = x
        p.walk += (THREE.MathUtils.clamp(speed / 1.1, 0, 1) - p.walk) * k
        p.step += dt * Math.min(12, 2 + speed * 4.5) * (p.walk > 0.02 ? 1 : 0)

        // where he stands reading (the timeline) on the screen: his left side and the top of his head,
        // for the page — the dates keep clear of him (global.css · IntroTimeline)
        headPos.set(endX - 0.7 * big, INTRO_Y + 1.4 * big, 0).project(camera)
        const left = Math.round((headPos.x * 0.5 + 0.5) * size.width)
        headPos.set(endX, INTRO_Y + 2.15 * big, 0).project(camera)
        const top = Math.round((-headPos.y * 0.5 + 0.5) * size.height)
        if (left !== introState.chontiLeft || top !== introState.chontiTop) {
            introState.chontiLeft = left
            introState.chontiTop = top
            const html = document.documentElement.style
            html.setProperty('--chonti-left', `${left}px`)
            html.setProperty('--chonti-top', `${top}px`)
        }

        // while he waits to be touched his eyes and head follow the pointer around the screen
        const g = gaze.current
        let gx = 0, gy = 0
        if (waiting && pointer.current.x >= 0) {
            headPos.set(x, INTRO_Y + CHONTI_RADIUS + 0.8, 0).project(camera)
            const hx = (headPos.x * 0.5 + 0.5) * size.width
            const hy = (-headPos.y * 0.5 + 0.5) * size.height
            gx = THREE.MathUtils.clamp((pointer.current.x - hx) / (size.width * 0.35), -1, 1)
            gy = THREE.MathUtils.clamp((pointer.current.y - hy) / (size.height * 0.35), -1, 1)
        }
        const kg = 1 - Math.exp(-dt * 6)
        g.x += (gx - g.x) * kg
        g.y += (gy - g.y) * kg
        p.look = waiting ? [g.x, -g.y] : null

        // greets us looking straight at the camera (he stands on the left of the screen, so "front"
        // is towards the camera, not the scene's +z) — while he waits, his whole body turns after
        // your pointer, the head and eyes too; then looks right while walking; stops and looks to
        // the front; then turns towards the timeline
        const targetYaw = s2 <= 0 ? lerp(YAW.right, faceYaw(x), fx.current.front) + g.x * 0.85 : s2 < 0.4 ? YAW.front : lerp(YAW.front, YAW.reading, smooth(0.4, 1, s2))
        yaw.current += (targetYaw - yaw.current) * (1 - Math.exp(-dt * 5))
        heading.current.rotation.y = yaw.current

        // reading like an interested visitor; each new date → a reaction, in turn:
        // 0 opens his arms (surprised) · 1 thinks, hand under the chin · 2 scratches his head
        const reading = s2 > 0.6 || s3 > 0 ? 1 : 0
        p.read += (reading - p.read) * (1 - Math.exp(-dt * 3))
        const slot = s3 > 0 ? introState.focusIndex ?? -1 : -1
        if (slot !== lastSlot.current && slot >= 0) {
            fx.current.interestUntil = t + 2.6
            fx.current.interest = slot % 3
        }
        lastSlot.current = slot
        const interested = t < fx.current.interestUntil
        const kind = fx.current.interest
        const ke = 1 - Math.exp(-dt * 5)
        p.excite += ((interested && kind === 0 ? 1 : 0) - p.excite) * ke
        p.think += ((interested && kind === 1 ? 1 : 0) - p.think) * ke
        p.scratch += ((interested && kind === 2 ? 1 : 0) - p.scratch) * ke
        // his head FOLLOWS the date in focus as the column slides down: up when it enters from
        // the top, level in the middle, down as it leaves (introState.focusY from IntroTimeline)
        // (the cards rest ABOVE him now: he looks UP at them — never at the floor, it would make no
        // sense that only later he notices there is none — or at your pointer while he waits)
        const follow = s3 > 0 || s2 > 0.4 ? -1.4 + (introState.focusVisible ? (introState.focusY ?? 0) * 0.15 : 0) : g.y * 0.6
        p.lookDown += (follow - p.lookDown) * (1 - Math.exp(-dt * 6))
        p.flail = 0
        // his mouth moves while he speaks (the hands stay on the walk / the reading)
        p.mouth = (p.mouth ?? 0) + ((useExperience.getState().speaking ? 1 : 0) - (p.mouth ?? 0)) * k
        // expressions from the character sheet: feliz · sorprendido (each new date) · feliz reading
        p.expr = s2 <= 0 ? 'happy' : s2 < 0.5 ? 'surprised' : !interested ? 'happy' : ['surprised', 'surprised', 'wink'][kind]
        sway.current.rotation.set(0, 0, 0)
        poseChonti(rig.current, p, t)

        blob.current.position.set(x, INTRO_Y + 0.005, 0)
        const reveal = introState.reveal
        floorLine.current.material.opacity = 1 - reveal
        floorLine.current.visible = reveal < 0.99

        // camera: follows a little while he walks, then holds; as the timeline appears it rises so
        // he ends up at the bottom of the screen, under the cards
        camera.position.x += (x * 0.25 - camera.position.x) * k
        camera.position.y += (lerp(INTRO_Y + 1.2 + camLift, lowY, smooth(0, 0.7, s2)) - camera.position.y) * k
        camera.position.z += (CAMERA.intro.position[2] - camera.position.z) * k
        look.set(camera.position.x, camera.position.y - 0.3, 0)
        camera.lookAt(look)
        introState.lookTarget.copy(look)

        // end of the timeline → the automatic fall takes over (and locks the scroll)
        if (phase === PHASES.INTRO && prog >= FALL_AT - 0.002) setPhase(PHASES.FALLING)
    })

    return (
        <group>
            {/* root (physics) → sway (balance) → heading (yaw) → feet pivot → Chonti rig */}
            <group ref={root}>
                <group ref={sway}>
                    <group ref={heading}>
                        <group ref={lying}>
                            <group position-y={-CHONTI_RADIUS}>
                                {/* (scaled from his feet, so he still stands on the line) */}
                                <group scale={big}>
                                    <Chonti ref={rig} />
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
                {/* while he waits: press his head (a real button: keyboard too) → he says hi. That
                    touch is also what lets the browser play his voice and the music */}
                {waiting && (
                    <ScreenHtml position={[0, 0.78, 0]}>
                        <button className="intro-hit" onClick={() => useExperience.getState().startGreeting()} aria-label={UI.loader.touchMe}>
                            {/* a comic speech bubble beside his head */}
                            <span className="intro-hit__bubble" aria-hidden="true">{UI.loader.touchMe}</span>
                        </button>
                    </ScreenHtml>
                )}
            </group>

            {/* "!" — a bold orange exclamation with a white outline, like a comic. Transparent with a
                high renderOrder: drawn after the (transparent) sky dome, always on top */}
            <group ref={bang} visible={false}>
                <mesh position-y={0.2} scale={[1.25, 1.12, 1]} renderOrder={1000}>
                    <capsuleGeometry args={[0.075, 0.34, 6, 14]} />
                    <meshBasicMaterial color="#FFFFFF" toneMapped={false} depthTest={false} fog={false} transparent />
                </mesh>
                <mesh position-y={-0.2} scale={1.3} renderOrder={1000}>
                    <sphereGeometry args={[0.08, 16, 12]} />
                    <meshBasicMaterial color="#FFFFFF" toneMapped={false} depthTest={false} fog={false} transparent />
                </mesh>
                <mesh position={[0, 0.2, 0.01]} renderOrder={1001}>
                    <capsuleGeometry args={[0.075, 0.34, 6, 14]} />
                    <meshBasicMaterial color={PALETTE.naranja} toneMapped={false} depthTest={false} fog={false} transparent />
                </mesh>
                <mesh position={[0, -0.2, 0.01]} renderOrder={1001}>
                    <sphereGeometry args={[0.08, 16, 12]} />
                    <meshBasicMaterial color={PALETTE.naranja} toneMapped={false} depthTest={false} fog={false} transparent />
                </mesh>
            </group>

            <mesh ref={blob} rotation-x={-Math.PI / 2} scale={[0.55, 0.4, 1]}>
                <circleGeometry args={[1, 32]} />
                <meshBasicMaterial color={ink} transparent opacity={0.12} depthWrite={false} />
            </mesh>

            {/* Stage 1: a single precision line as floor of the cream screen */}
            <mesh ref={floorLine} position={[(startX + endX) / 2, INTRO_Y - 0.01, 0]} scale={[endX - startX + 8, 0.012, 0.012]}>
                <boxGeometry />
                <meshBasicMaterial color={ink} transparent />
            </mesh>

        </group>
    )
}
