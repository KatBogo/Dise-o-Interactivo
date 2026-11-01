import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { PALETTE } from '../theme.js'
import { PLACES, UI } from '../data/content.js'
import { useExperience } from '../store/useExperience.js'
import { PLACE_MODELS, SwappableModel } from '../three/places/PlaceModels.jsx'

/**
 * The big model on the left: its own small WebGL layer ABOVE the blurred island, so the blur
 * never touches it. It spins slowly by itself (autoRotate) and drag / swipe on it rotates it by
 * hand with inertia (OrbitControls bound to this canvas only, so the card still scrolls on touch).
 */
/**
 * Frames the place: once its model is there (and again if it changes — the real model after its
 * placeholder — or the window does), the camera is put so the whole model, as it turns, fits in its
 * part of the screen (the left side, beside the card; the top on phones), centred in it both ways.
 * The canvas itself fills the screen (a view offset moves the picture to that part): coming closer
 * never cuts the model at the edges of a box.
 */
const ARRIVE = new THREE.Vector3(0, 1.2, 5.8).normalize() // (the direction it is seen from at first)
// every place's model loaded ahead (your island shows its own pieces, not these): going from one
// place to the next, the next one is already there
if (typeof window !== 'undefined') for (const p of PLACES) if (p.model && /\.glb$/i.test(p.model)) useGLTF.preload(p.model.replace(/^\//, ''))
// (a touch screen: the instructions speak of fingers, not of a mouse)
const TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
function FitView({ children, wide, area }) {
    const group = useRef()
    const { camera, size, controls } = useThree()
    const fitted = useRef('')
    const box = useMemo(() => new THREE.Box3(), [])
    useFrame(() => {
        if (!group.current || !controls) return
        box.setFromObject(group.current)
        if (box.isEmpty()) return
        const s = box.getSize(new THREE.Vector3())
        const key = `${s.x.toFixed(2)},${s.y.toFixed(2)},${s.z.toFixed(2)},${size.width},${size.height},${wide},${area?.cx},${area?.w}`
        if (key === fitted.current) return
        fitted.current = key
        // its part of the screen: the free space left of the card (measured: PlaceShowcase), centred
        // in it both ways — or (phones) the whole canvas
        const W = size.width, H = size.height
        const region = wide ? { cx: area?.cx ?? W * 0.3, w: (area?.w ?? W * 0.6) * 0.86, h: H * 0.72 } : { cx: W / 2, w: W * 0.9, h: H * 0.86 }
        // (turning, its width is as much as its diagonal seen from above)
        const across = Math.hypot(s.x, s.z), tall = s.y
        const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
        const d = Math.max((across * H) / (2 * tanV * region.w), (tall * H) / (2 * tanV * region.h)) + across * 0.25
        const c = box.getCenter(new THREE.Vector3())
        controls.target.copy(c)
        camera.position.copy(c).addScaledVector(ARRIVE, d)
        controls.minDistance = d * 0.25
        controls.maxDistance = d * 2.5
        camera.setViewOffset(W, H, W / 2 - region.cx, 0, W, H)
        camera.updateProjectionMatrix()
        controls.update()
    })
    return <group ref={group}>{children}</group>
}

function ShowcaseModel({ place, wide, area }) {
    const Placeholder = PLACE_MODELS[place.placeholder]
    return (
        <Canvas dpr={[1, 2]} shadows resize={{ offsetSize: true }} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 1.2, 5.8], fov: 34 }}>
            <hemisphereLight args={[PALETTE.crema, PALETTE.verde, 1.3]} />
            <directionalLight position={[3, 6, 4]} intensity={2.6} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-4, 2, -3]} intensity={0.7} color={PALETTE.rosa} />
            <Suspense fallback={null}>
                <FitView key={place.id} wide={wide} area={area}>
                    <Center top position-y={-0.6}>
                        <group>
                            {/* (only the real model: the first, made-in-code version never flashes in
                                between when you go from one place to another) */}
                            <SwappableModel url={place.model} placeholder={Placeholder} quiet />
                        </group>
                    </Center>
                </FitView>
                <ContactShadows position={[0, -0.6, 0]} opacity={0.35} blur={2.6} scale={9} far={3} color="#3A3A36" />
            </Suspense>
            {/* moved like the map: drag to turn it, right-drag / two fingers to slide it, the wheel
                or a pinch to come closer, with inertia · it turns by itself until you take it */}
            <OrbitControls
                makeDefault
                autoRotate
                autoRotateSpeed={1.2}
                onStart={(e) => e?.target && (e.target.autoRotate = false)}
                enableDamping
                dampingFactor={0.07}
                rotateSpeed={0.6}
                zoomSpeed={0.8}
                enablePan
                screenSpacePanning={false}
                minPolarAngle={0.15}
                maxPolarAngle={Math.PI / 2 + 0.12}
            />
        </Canvas>
    )
}

/**
 * LUGARES focus view:
 *  - the island behind gets blurred + slightly darkened (backdrop-filter)
 *  - the place's model, big, on the LEFT (auto spin + manual rotation)
 *  - a wide floating card on the RIGHT, close to the model: numbered slides (no reload), each
 *    with its own part of the story, sized to be read without scrolling
 * It enters right after the model has emerged from the island (Places.jsx).
 */
export default function PlaceShowcase() {
    const selected = useExperience((s) => s.selectedPlace)
    const slide = useExperience((s) => s.slide)
    const stepSlide = useExperience((s) => s.stepSlide)
    const closePlace = useExperience((s) => s.closePlace)
    const selectPlace = useExperience((s) => s.selectPlace)
    const root = useRef()
    const body = useRef()
    const closeBtn = useRef()
    const wasOpen = useRef(false)
    const place = PLACES.find((p) => p.id === selected)
    // (from 600px the model has the left of the screen, beside the card; on phones, the top)
    const [wide, setWide] = useState(() => typeof window === 'undefined' || window.innerWidth >= 600)
    useEffect(() => {
        const fit = () => setWide(window.innerWidth >= 600)
        window.addEventListener('resize', fit)
        return () => window.removeEventListener('resize', fit)
    }, [])
    // the free space left of the card (where the model and its instructions are centred): from the
    // left edge of the screen to the card, measured — whatever the window's size
    const [area, setArea] = useState(null)
    useEffect(() => {
        if (!selected) return
        const measure = () => {
            const panel = root.current?.querySelector('.focus__panel')
            if (!panel) return
            const left = panel.offsetLeft // (the layout's place, not the "plop" animation's)
            const a = { cx: Math.round(left / 2), w: Math.round(left) }
            setArea((b) => (b && b.cx === a.cx && b.w === a.w ? b : a))
            root.current.style.setProperty('--model-cx', `${a.cx}px`)
            root.current.style.setProperty('--model-w', `${a.w}px`)
        }
        measure()
        const raf = requestAnimationFrame(measure)
        window.addEventListener('resize', measure)
        return () => (cancelAnimationFrame(raf), window.removeEventListener('resize', measure))
    }, [selected])

    useGSAP(
        () => {
            if (!place) {
                wasOpen.current = false
                return
            }
            // first opening: wait for the model to rise out of the island, then blur it.
            // switching place inside the focus view: keep the blur, just swap model + card.
            const switching = wasOpen.current
            wasOpen.current = true
            const tl = gsap.timeline({ delay: switching ? 0 : 1.1 })
            if (switching) gsap.set('.focus__backdrop', { opacity: 1, backdropFilter: 'blur(14px)' })
            else tl.fromTo('.focus__backdrop', { opacity: 0, backdropFilter: 'blur(0px)' }, { opacity: 1, backdropFilter: 'blur(14px)', duration: 0.8, ease: 'power2.out' })
            // RULE: an interaction made of several pieces shows them ALL AT ONCE — the model, its
            // "drag to turn it" hint, the card and the other places start together (nothing shows
            // up before the rest). (clearProps: once in place, the CSS layout owns the position
            // again — so turning the phone or resizing the window never leaves the card shifted)
            const at = switching ? 0 : '<0.15'
            tl.addLabel('in', at)
              .fromTo('.focus__model', { autoAlpha: 0, scale: 0.45, y: 140 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.1, ease: 'back.out(1.3)', clearProps: 'transform,translate,scale' }, 'in')
              // the card "plops" in: pops from small, overshoots a touch and settles
              .fromTo('.focus__card', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', clearProps: 'transform,scale' }, 'in')
              .fromTo('.focus__places', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', clearProps: 'transform,scale' }, 'in')
              .fromTo('.focus__hint', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 'in')
              .call(() => closeBtn.current?.focus())
        },
        { dependencies: [selected], scope: root, revertOnUpdate: true }
    )

    // swap slide content without reloading (it slides in from the side you're going to)
    const dir = useRef(1)
    useEffect(() => {
        if (!body.current) return
        body.current.scrollTop = 0
        // (opacity only: the hidden slides are hidden by the CSS, so a tween cut halfway by a quick
        // change never leaves an old slide showing on top of the new one)
        const tw = gsap.fromTo('.focus__slide.is-current', { opacity: 0, x: 22 * dir.current }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', clearProps: 'opacity,transform' })
        return () => tw.kill()
    }, [slide, selected])

    // change slide by swiping the card (phones) or with the mouse wheel over it (computer);
    // it stops at the first and the last slide
    const card = useRef()
    const count = place?.slides.length ?? 0
    useEffect(() => {
        const el = card.current
        if (!el || !count) return
        const go = (d) => {
            const { slide: now } = useExperience.getState()
            const next = now + d
            if (next < 0 || next >= count) return false
            dir.current = d
            stepSlide(d)
            return true
        }
        let acc = 0, lock = 0
        const onWheel = (e) => {
            e.preventDefault()
            if (performance.now() < lock) return
            acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
            if (Math.abs(acc) < 40) return
            go(Math.sign(acc))
            acc = 0
            lock = performance.now() + 550 // one slide per flick of the wheel / trackpad
        }
        let start = null
        const onStart = (e) => (start = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null)
        const onEnd = (e) => {
            if (!start) return
            const t = e.changedTouches[0]
            const dx = t.clientX - start.x
            const dy = t.clientY - start.y
            start = null
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1) // swipe left → next
        }
        el.addEventListener('wheel', onWheel, { passive: false })
        el.addEventListener('touchstart', onStart, { passive: true })
        el.addEventListener('touchend', onEnd, { passive: true })
        return () => {
            el.removeEventListener('wheel', onWheel)
            el.removeEventListener('touchstart', onStart)
            el.removeEventListener('touchend', onEnd)
        }
    }, [selected, count, stepSlide])

    useEffect(() => {
        if (!place) return
        const onKey = (e) => {
            if (e.key === 'Escape') closePlace()
            if (e.key === 'ArrowRight') stepSlide(1)
            if (e.key === 'ArrowLeft') stepSlide(-1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [place, closePlace, stepSlide])

    if (!place) return null
    const goSlide = (i) => {
        if (i === slide || i < 0 || i >= count) return
        dir.current = Math.sign(i - slide)
        stepSlide(i - slide)
    }
    const index = PLACES.indexOf(place)
    const prevPlace = PLACES[(index - 1 + PLACES.length) % PLACES.length]
    const nextPlace = PLACES[(index + 1) % PLACES.length]

    return (
        <div ref={root} className="focus" role="dialog" aria-modal="true" aria-labelledby="focus-title">
            <div className="focus__backdrop" onClick={closePlace} aria-hidden="true" />

            {/* how to move it, for a mouse or a finger — each part on its own line when they don't fit */}
            <p className="focus__hint">
                {(TOUCH ? UI.hints.placeTouch : UI.hints.place).map((h) => (
                    <span key={h}>{h}</span>
                ))}
            </p>
            <div className="focus__model" aria-hidden="true">
                <ShowcaseModel place={place} wide={wide} area={area} />
            </div>

            {/* the card and, right under it (as wide as it, edge to edge), the other places */}
            <div className="focus__panel">
            <article ref={card} className="card focus__card">
                <header className="card__head">
                    <button ref={closeBtn} className="icon-btn" onClick={closePlace} aria-label="Cerrar y volver a la isla">✕</button>
                </header>
                <h2 id="focus-title" className="focus__title">{place.name}</h2>

                {/* each slide: only its part of the story — the whole story is spread over the
                    slides, so nothing has to scroll */}
                {/* all the slides share one grid cell: the card takes the tallest one's height, so it
                    doesn't jump (and the model doesn't resize) when you change slide */}
                <div ref={body} className="focus__body" aria-label="Historia del lugar">
                    {place.slides.map((s, i) => (
                        <div key={i} className={`focus__slide ${i === slide ? 'is-current' : ''}`} aria-hidden={i !== slide} aria-live={i === slide ? 'polite' : undefined}>
                            <section className="focus__story" aria-label={s.title}>
                                {place.storyParts?.[i]?.map((paragraph, k) => (
                                    <p key={k}>{paragraph}</p>
                                ))}
                            </section>
                        </div>
                    ))}
                </div>

                {/* the parts of the story: ‹ arrow · 01 02 03 · arrow › */}
                <footer className="focus__nav" role="group" aria-label="Partes de la historia">
                    <button className="focus__arrow" onClick={() => goSlide(slide - 1)} disabled={slide === 0} aria-label="Parte anterior de la historia">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                    </button>
                    <div className="focus__steps">
                        {place.slides.map((s, i) => (
                            <button key={i} className="step-btn" aria-pressed={i === slide} aria-label={s.title} onClick={() => goSlide(i)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button className="focus__arrow" onClick={() => goSlide(slide + 1)} disabled={slide === count - 1} aria-label="Siguiente parte de la historia">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                    </button>
                </footer>
            </article>

            <nav className="focus__places" aria-label="Otros lugares">
                {/* (two equal halves: one starts at the card's left edge, the other ends at its right) */}
                <div className="focus__places-row">
                    <button className="focus__place-btn" onClick={() => selectPlace(prevPlace.id)} aria-label={`Lugar anterior: ${prevPlace.name}`}>
                        <span className="focus__place-dir">‹ Lugar anterior</span>
                        <span className="focus__place-name">{prevPlace.name}</span>
                    </button>
                    <button className="focus__place-btn focus__place-btn--next" onClick={() => selectPlace(nextPlace.id)} aria-label={`Siguiente lugar: ${nextPlace.name}`}>
                        <span className="focus__place-dir">Siguiente lugar ›</span>
                        <span className="focus__place-name">{nextPlace.name}</span>
                    </button>
                </div>
            </nav>
            </div>
        </div>
    )
}
