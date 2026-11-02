import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { CAMERA, ISLAND_TOP, PHASES, fovFor, prefersReducedMotion, stageDistanceFactor } from '../config.js'
import { introState, useExperience } from '../store/useExperience.js'
import { ALL_STOPS, PLACES } from '../data/content.js'
import { CITY, VARIANTS } from './island/Island.jsx'
import { STOP_HEIGHT } from './places/PlaceModels.jsx'

/** Stage camera position, pulled back on narrow screens so the long island fits. */
function stagePosition(aspect) {
    const target = new THREE.Vector3(...CAMERA.stage.target)
    const pos = new THREE.Vector3(...CAMERA.stage.position)
    return pos.sub(target).multiplyScalar(stageDistanceFactor(aspect)).add(target)
}

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

// How far the visitor can take the camera on the island (the default view is ~51 units away, 54°):
// free to orbit all the way round, zoom in close and slide along it, and tilt down to a low,
// almost street-level view. The only walls: it never goes under the island's surface nor into a
// building, a tree or a monument (KeepAbove).
// (minDistance: the closest the camera comes — the river street seen from above with its buildings on
// both sides; closer, the buildings filled the screen and their low-poly faces showed)
const STAGE_LIMITS = { minDistance: 16, maxDistance: 120, minPolar: 0.05, maxPolar: Math.PI * 0.47 }
// where the orbit centre can be slid to (pan): over the island, never off it
const PAN_BOUNDS = { x: [-19, 21], z: [-7, 7] }
// the lowest the camera can be: a little above the street
const STREET = ISLAND_TOP + 0.9

// Everything the camera flies OVER, never through: { x, z, r, top }. Around each one the allowed
// height rises smoothly (a soft invisible hill), so gliding over a block lifts the view gently
// instead of jumping — and it never ends up inside a building.
const OBSTACLES = (() => {
    const out = []
    for (const [kind, list] of Object.entries(CITY.buildings)) {
        const v = VARIANTS[kind]
        for (const b of list) out.push({ x: b.p[0], z: b.p[2], r: Math.hypot(v.w, v.d) / 2 + 0.3, top: ISLAND_TOP + v.h * b.s[1] + 0.55 })
    }
    for (const tr of CITY.trunks) out.push({ x: tr.p[0], z: tr.p[2], r: 0.65, top: ISLAND_TOP + 1.6 })
    for (const p of PLACES) out.push({ x: p.position[0], z: p.position[1], r: 1.3, top: ISLAND_TOP + 2.0 })
    for (const s of ALL_STOPS) if (!s.landmark) out.push({ x: s.position[0], z: s.position[1], r: 0.85, top: ISLAND_TOP + STOP_HEIGHT[s.placeholder] + 0.5 })
    const ermita = ALL_STOPS.find((s) => s.id === 'ermita')?.position
    if (ermita) out.push({ x: ermita[0], z: ermita[1], r: 1.5, top: ISLAND_TOP + 3.3 })
    return out
})()
const SOFT = 1.1 // width of the soft slope around each obstacle
function floorAt(x, z) {
    let y = STREET
    for (const o of OBSTACLES) {
        if (o.top <= y) continue
        const d = Math.hypot(x - o.x, z - o.z)
        if (d >= o.r + SOFT) continue
        y = Math.max(y, THREE.MathUtils.lerp(STREET, o.top, THREE.MathUtils.smoothstep(o.r + SOFT - d, 0, SOFT)))
    }
    return y
}

/**
 * The walls of the free exploration — whatever the orbit does (damping overshoot, a pinch…):
 *  - the orbit centre stays over the island when you slide the view; far away it sits a little
 *    below the surface (it frames the whole boulevard), and as you zoom in it rises onto the
 *    surface, so close up you can still turn around and tilt down (not only look from above)
 *  - the camera never sinks under the street level, nor into a building, tree or monument
 */
function KeepAbove() {
    useFrame(({ camera, controls }) => {
        if (!controls) return
        const t = controls.target
        const cx = THREE.MathUtils.clamp(t.x, ...PAN_BOUNDS.x)
        const cz = THREE.MathUtils.clamp(t.z, ...PAN_BOUNDS.z)
        const dist = camera.position.distanceTo(t)
        const cy = THREE.MathUtils.lerp(ISLAND_TOP + 0.3, CAMERA.stage.target[1], THREE.MathUtils.smoothstep(dist, 12, 40))
        if (cx !== t.x || cz !== t.z || Math.abs(cy - t.y) > 1e-4) {
            // move the camera by the same amount (keeps the view direction and the distance)
            camera.position.x += cx - t.x
            camera.position.z += cz - t.z
            camera.position.y += cy - t.y
            t.set(cx, cy, cz)
        }
        const floor = floorAt(camera.position.x, camera.position.z)
        if (camera.position.y < floor) camera.position.y = floor
    })
    return null
}

/**
 * Owns the camera for the whole experience.
 *
 *  intro  → IntroScene drives the camera (no controls mounted at all)
 *  reveal → GSAP dives the camera from the sky to the island, through the soft clouds
 *  stage  → OrbitControls are MOUNTED but `enabled={false}`: no orbit, no zoom
 *  mode   → once LUGARES / EVENTOS / RUTAS is picked, `enabled` flips to true (inertia via damping)
 *  reset  → back to the menu: the camera glides home and the controls lock again
 *
 * Responsive: the FOV opens up on portrait screens, the stage camera moves back to fit the
 * island, and touch screens get faster rotate/zoom so one finger/pinch feels natural.
 */
/**
 * Keeps the island out from under the floating cards: the projection is shifted (setViewOffset)
 * so the map is centred in the free part of the screen — to the left of a right-hand card, to the
 * right of a left-hand one, or above the bottom sheet on phones. Markers follow (same projection).
 * On phones the free gap (sky panel → open sheet) is measured on the page, and the island is also
 * zoomed out to fit in it, so it is always fully in view.
 */
const SHEETS = '.panel--right, .card--float, .card-pill'
function freeGap(H) {
    // (fixed elements have no offsetParent: a rendered box is the test)
    const visible = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
    const sky = document.querySelector('.sky')
    let top = (visible(sky) ? sky.getBoundingClientRect().bottom : 96) + 8
    // the card of a route stop sits on top: the island goes under it
    const stopCard = document.querySelector('.card--stop')
    if (visible(stopCard)) top = Math.max(top, stopCard.getBoundingClientRect().bottom + 8)
    const bar = document.querySelector('.filters__row')
    const barTop = visible(bar) ? bar.getBoundingClientRect().top - 50 : H - 120 // room for "Volver al mapa"
    let bottom = barTop
    let sheet = false
    for (const el of document.querySelectorAll(SHEETS))
        if (visible(el)) {
            bottom = Math.min(bottom, el.getBoundingClientRect().top - 8)
            sheet = true
        }
    // Chonti stands on the sheet (left corner): keep the island mostly clear of him
    const guide = document.querySelector('.guide-layer__hit')
    if (sheet && visible(guide)) {
        const r = guide.getBoundingClientRect()
        bottom = Math.min(bottom, r.top + r.height * 0.45)
    }
    return { top, bottom, ref: barTop - top }
}
function ViewShift() {
    const shift = useRef({ x: 0, y: 0, zoom: 1 })
    const gap = useRef({ key: '', at: -1, measured: 0, value: null })
    useFrame(({ camera, size, clock }, dt) => {
        const s = useExperience.getState()
        const stage = s.phase === PHASES.STAGE
        // (minimizing a card never moves the map: only the card animates, the framing stays)
        const right = stage && ((s.mode === 'eventos' && s.activeEvent) || s.mode === 'rutas')
        const left = stage && s.mode === 'rutas' && s.builder
        const narrow = size.width < 800
        let tx = 0, ty = 0, zoom = 1
        if (narrow) {
            if (right || left) {
                // measured only when WHAT is open changes (plan, event, route, stop, builder, window
                // size) — right away and once the cards' "plop" has settled. Folding a card into its
                // pill or opening the island clock is not a change of layout: the map stays put.
                const key = [s.mode, s.activeEvent, s.activeRoute, s.previewRoute, s.builder, s.selectedStop, size.width, size.height].join('|')
                const g0 = gap.current
                if (key !== g0.key) gap.current = { key, at: clock.elapsedTime, measured: 0, value: g0.value }
                const g1 = gap.current
                if ((g1.measured === 0 && clock.elapsedTime - g1.at > 0.05) || (g1.measured === 1 && clock.elapsedTime - g1.at > 0.7)) {
                    if (!s.cardMin || !g1.value) g1.value = freeGap(size.height)
                    g1.measured++
                }
                const g = gap.current.value
                if (g && g.bottom > g.top) {
                    ty = size.height / 2 - (g.top + g.bottom) / 2
                    // the long island takes about half of the free height in the portrait framing:
                    // zoom out only when the gap is smaller than that (e.g. the tall route maker)
                    zoom = THREE.MathUtils.clamp((g.bottom - g.top) / Math.max(1, g.ref * 0.5), 0.5, 1)
                }
            }
        } else {
            const card = Math.min(380, size.width * 0.32) / 2 + 12
            tx = (right ? card : 0) - (left ? card : 0)
        }
        const k = 1 - Math.exp(-dt * 4)
        const sh = shift.current
        sh.x += (tx - sh.x) * k
        sh.y += (ty - sh.y) * k
        sh.zoom += (zoom - sh.zoom) * k
        if (Math.abs(sh.x) < 0.5 && Math.abs(sh.y) < 0.5 && Math.abs(sh.zoom - 1) < 0.002) {
            if (camera.view?.enabled || camera.zoom !== 1) {
                camera.zoom = 1
                camera.clearViewOffset()
            }
            return
        }
        camera.zoom = sh.zoom
        camera.setViewOffset(size.width, size.height, sh.x, sh.y, size.width, size.height)
    })
    return null
}

export default function CameraRig() {
    const camera = useThree((s) => s.camera)
    const size = useThree((s) => s.size)
    const phase = useExperience((s) => s.phase)
    const mode = useExperience((s) => s.mode)
    const setPhase = useExperience((s) => s.setPhase)

    const controls = useRef()
    const lookTarget = useMemo(() => new THREE.Vector3(...CAMERA.intro.target), [])
    const explored = useExperience((s) => s.explored)
    // locked until a category is chosen; after that the map stays free (even back on the menu)
    const unlocked = phase === PHASES.STAGE && (mode !== null || explored)
    const aspect = size.width / size.height
    const touch = useMemo(isTouch, [])

    useLayoutEffect(() => {
        camera.lookAt(lookTarget)
    }, [camera, lookTarget])

    // Responsive field of view
    useLayoutEffect(() => {
        camera.fov = fovFor(aspect)
        camera.updateProjectionMatrix()
    }, [camera, aspect])

    // Reveal: dive from wherever the intro left the camera down to the island.
    useEffect(() => {
        if (phase !== PHASES.REVEAL) return
        lookTarget.copy(introState.lookTarget)
        const end = stagePosition(aspect)
        const target = new THREE.Vector3(...CAMERA.stage.target)
        const k = prefersReducedMotion() ? 0.35 : 1
        // orientations as quaternions (no lookAt while looking straight down → no shaking)
        const q0 = camera.quaternion.clone()
        const qEnd = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(end, target, new THREE.Vector3(0, 1, 0)))
        const turn = { k: 0 }
        const tl = gsap.timeline({ delay: 0.3, onComplete: () => setPhase(PHASES.GUIDE_PROMPT) }) // the question comes once the map is visible
        // 1. cenital: the cloud sea opens below (Clouds.jsx) and the camera sinks straight down
        //    through the gap, still looking down at the island
        tl.to(camera.position, { x: camera.position.x * 0.4, y: 33, duration: 3.2 * k, ease: 'power2.inOut' }, 0)
        // 2. glide into the 3/4 view of the whole boulevard, turning smoothly
        tl.to(camera.position, { x: end.x, y: end.y, z: end.z, duration: 3 * k, ease: 'power2.inOut' }, '>-0.4')
        tl.to(turn, { k: 1, duration: 3 * k, ease: 'power2.inOut', onUpdate: () => camera.quaternion.slerpQuaternions(q0, qEnd, turn.k) }, '<')
        return () => tl.kill()
        // aspect is read once at the start of the dive on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, camera, lookTarget, setPhase])

    // Re-lock: when the user goes back to the menu, fly home and freeze again.
    const wasUnlocked = useRef(false)
    useEffect(() => {
        if (unlocked) {
            wasUnlocked.current = true
            return
        }
        const c = controls.current
        if (!wasUnlocked.current || !c) return
        wasUnlocked.current = false
        const end = stagePosition(aspect)
        const [tx, ty, tz] = CAMERA.stage.target
        const tl = gsap.timeline({ onUpdate: () => c.update() })
        tl.to(camera.position, { x: end.x, y: end.y, z: end.z, duration: 1.4, ease: 'power2.inOut' }, 0)
        tl.to(c.target, { x: tx, y: ty, z: tz, duration: 1.4, ease: 'power2.inOut' }, 0)
        return () => tl.kill()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unlocked, camera])

    // Back to the menu after exploring: glide home, but keep the controls free.
    const prevMode = useRef(null)
    useEffect(() => {
        const was = prevMode.current
        prevMode.current = mode
        const c = controls.current
        if (!c || !was || mode) return
        const end = stagePosition(aspect)
        const [tx, ty, tz] = CAMERA.stage.target
        const tl = gsap.timeline({ onUpdate: () => c.update() })
        tl.to(camera.position, { x: end.x, y: end.y, z: end.z, duration: 1.4, ease: 'power2.inOut' }, 0)
        tl.to(c.target, { x: tx, y: ty, z: tz, duration: 1.4, ease: 'power2.inOut' }, 0)
        return () => tl.kill()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, camera])

    // Live responsive: when the window changes shape on the island, the camera re-frames the
    // boulevard right away (same view direction, distance adapted) — no refresh needed.
    const lastAspect = useRef(aspect)
    useEffect(() => {
        const c = controls.current
        const prev = lastAspect.current
        lastAspect.current = aspect
        if (phase !== PHASES.STAGE || !c) return
        const f = stageDistanceFactor(aspect) / stageDistanceFactor(prev)
        if (Math.abs(f - 1) < 0.01) return
        const dest = camera.position.clone().sub(c.target).multiplyScalar(f).add(c.target)
        const tw = gsap.to(camera.position, { x: dest.x, y: dest.y, z: dest.z, duration: 0.6, ease: 'power2.out', onUpdate: () => c.update() })
        return () => tw.kill()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aspect])

    // Controls only exist on stage. Mounting them earlier would make OrbitControls
    // call camera.lookAt(target) and break the intro framing.
    if (phase !== PHASES.STAGE) return <ViewShift />

    return (
        <>
        <ViewShift />
        <OrbitControls
            ref={controls}
            makeDefault
            target={CAMERA.stage.target}
            enabled={unlocked} // ← the lock / unlock switch
            enablePan={unlocked} // right-drag / two fingers: slide along the island (KeepAbove keeps it over it)
            screenSpacePanning={false}
            enableDamping // inertia + easing
            dampingFactor={touch ? 0.1 : 0.07}
            rotateSpeed={touch ? 0.95 : 0.6}
            zoomSpeed={touch ? 1.2 : 0.8}
            // free to explore: close to the streets, down to almost street level, far away;
            // never under the island (max polar < 90° + KeepAbove's minimum height)
            minDistance={STAGE_LIMITS.minDistance}
            maxDistance={STAGE_LIMITS.maxDistance * stageDistanceFactor(aspect)}
            minPolarAngle={STAGE_LIMITS.minPolar}
            maxPolarAngle={STAGE_LIMITS.maxPolar}
        />
        <KeepAbove />
        </>
    )
}
