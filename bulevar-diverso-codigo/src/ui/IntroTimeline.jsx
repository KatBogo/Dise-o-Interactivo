import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PHASES, RUNWAY_VH, STAGES } from '../config.js'
import { TIMELINE, TIMELINE_INFO, UI } from '../data/content.js'
import { introState, useExperience } from '../store/useExperience.js'

const pct = (x) => x * 100 // the master timeline lasts exactly 100 units = 100% of the scroll
const N = TIMELINE.length
// [left %, top %, size, parallax depth] of the soft DOM clouds in the sunset backdrop
const SKY_CLOUDS = [[-6, 8, 1.2, 0.5], [22, 18, 0.8, 0.3], [58, 6, 1.4, 0.6], [78, 26, 0.9, 0.35], [8, 52, 1.1, 0.7], [44, 44, 0.7, 0.25], [70, 62, 1.5, 0.8], [30, 78, 1.2, 0.6], [88, 84, 1, 0.45], [-4, 90, 1.3, 0.9]]

/**
 * The intro scroll. A tall invisible runway gives the page its length; ONE GSAP timeline
 * (scrubbed by ScrollTrigger) lasts 100 units, so every tween sits at the scroll % where it
 * happens. Its smoothed progress goes to `introState.progress` → Chonti and the camera
 * (IntroScene) share the same clock as the 2D.
 *
 * The timeline lives BEHIND the WebGL canvas (transparent during the intro), so Chonti stands
 * in front of it.
 *
 *  0–20%   cream screen, only the scroll hint (Chonti walks)
 *  20–30%  the cream backdrop disappears → the great timeline appears behind Chonti
 *  30–80%  a normal vertical reading: the title and every date (oldest first) form ONE column
 *          that scrolls up as you scroll down; the date crossing the middle comes into focus and
 *          Chonti follows it with his head (introState.focus*).
 */
/**
 * Depth of field on the column: the date crossing the middle of the window is sharp, big and
 * bright; the others recede. Also tells Chonti where that date is (-1 top … +1 bottom).
 */
// Where each date comes to rest (the scroll snaps to it): its top a little under the brand, so the
// whole card — year, photo and text — sits in the upper part of the screen and Chonti, at the
// bottom, is always UNDER it, never on top of it.
// Phones: each card is CENTRED in the free band between the brand and Chonti's head (he stands at
// the bottom, IntroScene), so it neither hugs the top nor reaches him.
const narrow = () => window.innerWidth < 800
const BAND_TOP = 64 // under the brand and the buttons
// Chonti's head (where IntroScene measures it — with the hat on —, or about there before it does)
const bandBottom = () => (introState.chontiTop > 0 ? introState.chontiTop - 12 : window.innerHeight * 0.69)
/**
 * Phones: every date fits in the band above Chonti's head — if its photo, title and text are
 * taller than that band, the photo gets smaller (never under 124px wide), so he never stands on the
 * text. RULE: always 16:9 — it gets narrower, never squashed.
 */
function fitCards(root) {
    let changed = false
    root?.querySelectorAll('.tl-item__inner').forEach((inner) => {
        const media = inner.querySelector('.tl-item__media')
        if (!media) return
        const before = media.style.width
        media.style.width = ''
        let w = ''
        if (narrow()) {
            const over = inner.offsetHeight - (bandBottom() - BAND_TOP - 8)
            if (over > 0) w = `${Math.max(124, Math.round(((media.offsetHeight - over) * 16) / 9))}px`
        }
        media.style.width = w
        if (w !== before) changed = true
    })
    return changed
}
const restTop = (el) => {
    if (!narrow()) return window.innerHeight * 0.11
    const h = el?.offsetHeight ?? 0
    return Math.max(BAND_TOP, BAND_TOP + (bandBottom() - BAND_TOP - h) / 2)
}
// the line where a date is "in focus" (the middle of a card at rest)
const focusLine = () => (narrow() ? (BAND_TOP + bandBottom()) / 2 / window.innerHeight : 0.42)

function focusItems(items) {
    const H = window.innerHeight
    const line = focusLine()
    let best = -1, bestD = Infinity, bestY = 0
    items.forEach((el, i) => {
        // (the card itself, not its screen-tall slot: its middle is where it rests)
        const r = (el.querySelector('.tl-item__inner') ?? el).getBoundingClientRect()
        const c = (r.top + r.height / 2) / H // 0 top … 1 bottom
        const d = Math.abs(c - line)
        // (fully sharp around the line where a date rests, fading as it moves away)
        el.style.setProperty('--focus', Math.min(1, Math.max(0, 1 - (d - 0.08) * 2.6)).toFixed(3))
        if (c > -0.2 && c < 1.2 && d < bestD) (bestD = d), (best = i), (bestY = c * 2 - 1)
    })
    items.forEach((el, i) => el.toggleAttribute('data-active', i === best && bestD < 0.3))
    // Chonti reads each date when it reaches the middle of the screen
    if (bestD < 0.18 && best !== introState.readIndex) {
        introState.readIndex = best
        const it = TIMELINE[best]
        useExperience.getState().narrate(`${it.year.replace('–', 'a')}. ${it.name ? `${it.name}. ` : ''}${it.title}. ${it.text}`)
    } else if (introState.readIndex >= 0 && bestD > 0.45) {
        // the date he was reading has left the screen (scrolled away): he stops
        introState.readIndex = -1
        useExperience.getState().narrate('')
    }
    introState.focusIndex = bestD < 0.3 ? best : -1
    introState.focusY = best < 0 ? 0 : Math.max(-1, Math.min(1, bestY))
    introState.focusVisible = best >= 0 && bestD < 0.65
}

export default function IntroTimeline() {
    const phase = useExperience((s) => s.phase)
    const scope = useRef()
    const runway = useRef()
    useEffect(() => () => void (document.documentElement.dataset.tl = 'off'), [])
    // (the dates fitted above Chonti: again when the window changes or he is measured anew)
    useEffect(() => {
        let last = ''
        const check = () => {
            // (his head in steps of 24px: while the camera settles it moves a little every frame)
            const key = `${window.innerWidth}x${window.innerHeight}:${Math.round((introState.chontiTop ?? 0) / 24)}`
            if (key === last) return
            last = key
            if (fitCards(scope.current)) ScrollTrigger.refresh() // (the column's length changed)
        }
        check()
        const id = setInterval(check, 300)
        return () => clearInterval(id)
    }, [])

    useGSAP(
        () => {
            if (phase === PHASES.FALLING) {
                gsap.to('.tl-stage, .tl-rail, .tl-head', { autoAlpha: 0, duration: 0.8, delay: 0.6 })
                return
            }
            if (phase !== PHASES.INTRO) return
            window.scrollTo(0, 0)
            introState.progress = 0
            introState.readIndex = -1
            introState.titleRead = false
            // (his "¡Hola!" is said when you touch him: store.startGreeting)

            const [d0, d1] = STAGES.discover.map(pct)
            const [t0, t1] = STAGES.timeline.map(pct)
            const vh = (v) => () => (window.innerHeight * v) / 100

            // The scroll is not free along the dates: when you stop, it settles on the nearest one
            // (its card at rest, Chonti under it). Before the timeline it is free (his walk); after
            // the last date, going on a little more lets it run to the end → the fall.
            const [s0, s1] = STAGES.timeline
            const snapTo = (v) => {
                if (v < s0 - 0.004 || v >= s1) return v
                const track = scope.current?.querySelector('.tl-track')
                if (!track) return v
                const y = Number(gsap.getProperty(track, 'y')) || 0
                const travel = track.offsetHeight + window.innerHeight * 0.2
                const points = [s0]
                // (offsets, not the box on screen: the card in focus is scaled a little)
                const trackTop = track.getBoundingClientRect().top - y
                track.querySelectorAll('.tl-item__inner').forEach((el) => {
                    const top0 = trackTop + el.parentElement.offsetTop + el.offsetTop // where it is with the column at rest
                    const k = (top0 - restTop(el)) / travel
                    if (k > 0 && k < 1) points.push(s0 + k * (s1 - s0))
                })
                const last = points[points.length - 1]
                if (v > last + (s1 - last) * 0.35) return s1
                return points.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a))
            }
            const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: runway.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    invalidateOnRefresh: true,
                    snap: { snapTo, duration: { min: 0.3, max: 0.8 }, delay: 0.1, ease: 'power2.inOut', inertia: false },
                },
                onUpdate() {
                    introState.progress = this.progress()
                },
            })
            tl.set({}, {}, 100) // lock the total duration to 100

            // 1 — only the hint on the cream screen
            tl.to('.intro-hint', { autoAlpha: 0, y: -20, duration: 4 }, 2)

            // 2 — the cream backdrop disappears; the timeline appears behind Chonti
            tl.fromTo('.tl', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, d0)
            tl.fromTo('.tl-backdrop', { opacity: 0 }, { opacity: 1, duration: 5, ease: 'power1.inOut' }, d0)
            tl.fromTo('.tl-head', { clipPath: 'inset(0 0 100% 0)', y: vh(-12), z: -300 }, { clipPath: 'inset(0 0 0% 0)', y: 0, z: 0, duration: 6, ease: 'power2.out' }, d0 + 3)
            tl.fromTo('.tl-rail', { scaleY: 0 }, { scaleY: 1, duration: 5, ease: 'power2.out' }, d0 + 4)

            // 3 — a normal vertical reading: the whole column (title + every date, oldest first)
            //     scrolls UP as you scroll down, like a page; the date crossing the middle comes
            //     into focus and Chonti follows it with his head.
            tl.fromTo('.tl-rail__fill', { scaleY: 0 }, { scaleY: 1, duration: t1 - t0 }, t0)
            // the clouds drift down too, slower the farther they are (parallax), and the sun sets a bit
            gsap.utils.toArray('.tl-cloud').forEach((c) => tl.fromTo(c, { y: vh(-8) }, { y: vh(10 + 30 * Number(c.dataset.depth)), duration: t1 - t0 }, t0))
            // …and they only show up as the timeline is ending, just before the fall into the clouds
            tl.fromTo('.tl-cloud', { opacity: 0 }, { opacity: 0.1, duration: 7, ease: 'power1.in' }, t1 - 7)
            tl.fromTo('.tl-sun', { y: 0 }, { y: vh(14), duration: t1 - t0 }, t0)

            // the column, linear with the scroll, until its last date has left through the top
            const track = scope.current.querySelector('.tl-track')
            const items = gsap.utils.toArray('.tl-item')
            tl.fromTo(track, { y: 0 }, { y: () => -(track.offsetHeight + window.innerHeight * 0.2), duration: t1 - t0, ease: 'none' }, t0)
            tl.eventCallback('onUpdate', function () {
                introState.progress = this.progress()
                // the dark timeline is on screen (the brand turns light green over it)
                const on = this.progress() > STAGES.discover[0] + 0.03 ? 'on' : 'off'
                if (document.documentElement.dataset.tl !== on) document.documentElement.dataset.tl = on
                // the title of the timeline, read once when it appears
                if (this.progress() > STAGES.discover[0] + 0.06 && !introState.titleRead) {
                    introState.titleRead = true
                    useExperience.getState().narrate(`${TIMELINE_INFO.title}. ${TIMELINE_INFO.lead}`)
                }
                focusItems(items)
                if (this.progress() > STAGES.walk[1] && !useExperience.getState().walkDone) useExperience.setState({ walkDone: true })
            })

            // jump straight to a point of the intro (instantly, no scrub)
            const jump = (p) => {
                const st = tl.scrollTrigger
                if (!st) return
                window.scrollTo({ top: st.start + (st.end - st.start) * p, behavior: 'instant' })
                ScrollTrigger.update()
                st.getTween?.()?.progress(1)
                tl.progress(p)
            }
            // "Saltar intro" skips only Chonti's walk: straight to the timeline
            introState.skipWalk = () => jump(STAGES.discover[1] + 0.01)
            // the brand (Hud): back to the very top
            introState.jumpTo = (p) => jump(p)
            // coming back from the island ("← Línea del tiempo"): resume at the timeline
            //     (only consumed once the jump really happens: in dev the setup runs twice)
            if (introState.resume) {
                const p = introState.resume
                const raf = requestAnimationFrame(() => {
                    if (!tl.scrollTrigger) return
                    introState.resume = null
                    ScrollTrigger.refresh()
                    jump(p)
                })
                return () => cancelAnimationFrame(raf)
            }
        },
        { dependencies: [phase], scope, revertOnUpdate: false }
    )

    return (
        <div ref={scope}>
            {/* scroll length of the whole intro */}
            <div ref={runway} className="runway" style={{ height: `${RUNWAY_VH}vh` }} aria-hidden="true" />

            <p className="intro-hint">
                {UI.loader.hint}
                <span aria-hidden="true"> ↓</span>
            </p>

            <section className="tl" aria-label={TIMELINE_INFO.title}>
                {/* sunset sky: gradient, a low sun and soft clouds drifting down with the timeline */}
                <div className="tl-backdrop" aria-hidden="true">
                    <div className="tl-sun" />
                    {SKY_CLOUDS.map(([x, y, s, depth], i) => (
                        <span key={i} className="tl-cloud" data-depth={depth} style={{ left: `${x}%`, top: `${y}%`, '--s': s }} />
                    ))}
                </div>
                <div className="tl-rail" aria-hidden="true">
                    <div className="tl-rail__fill" />
                    {TIMELINE.map((item, i) => (
                        <span key={item.title} className="tl-rail__tick" style={{ top: `${(i / (N - 1)) * 100}%` }}>
                            {/* (only the first year: a whole range would run into the photos) */}
                            {item.year.split('–')[0].trim()}
                        </span>
                    ))}
                </div>

                <div className="tl-stage">
                    <div className="tl-track">
                    <header className="tl-head">
                        <p className="eyebrow">{TIMELINE_INFO.eyebrow}</p>
                        <h2 className="tl-head__title">{TIMELINE_INFO.title}</h2>
                        <p className="tl-head__lead">{TIMELINE_INFO.lead}</p>
                    </header>
                    <ol className="tl-list">
                    {TIMELINE.map((item, i) => (
                        <li key={item.title} className="tl-item">
                            <div className="tl-item__inner">
                                <span className={`tl-item__year ${item.year.length > 5 ? 'tl-item__year--range' : ''}`}>{item.year}</span>
                                {/* every picture in the same frame (same size, cropped to fill it) */}
                                <figure className="tl-item__media">
                                    {item.image ? (
                                        <img src={item.image} alt={item.imageAlt ?? ''} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
                                    ) : (
                                        <div className={`tl-item__placeholder tl-item__placeholder--${i % 3}`} aria-hidden="true">
                                            <span>Foto {i + 1}</span>
                                        </div>
                                    )}
                                </figure>
                                {item.name && <p className="tl-item__name">{item.name}</p>}
                                <h3 className="tl-item__title">{item.title}</h3>
                                <p className="tl-item__text">{item.text}</p>
                            </div>
                        </li>
                    ))}
                    </ol>
                    </div>
                </div>
            </section>
        </div>
    )
}
