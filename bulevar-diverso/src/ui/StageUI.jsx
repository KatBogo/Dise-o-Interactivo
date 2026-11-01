import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { EVENTS, PLACES, ROUTES, STOPS_BY_ID, UI } from '../data/content.js'
import { MIN_ROUTE_STOPS, heroLine, instructionOf, useExperience } from '../store/useExperience.js'
import PlaceShowcase from './PlaceShowcase.jsx'

const FILTERS = UI.menu.options // LUGARES · EVENTOS · RUTAS (src/content/ui.json)
// (a touch screen: "desliza", not "arrastra")
const TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const ICONS = {
    lugares: <path d="M24 44s14-12.4 14-24a14 14 0 1 0-28 0c0 11.6 14 24 14 24zm0-18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />,
    eventos: (
        <>
            <path d="M24 6l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L24 29.6l-9.3 4.9 1.8-10.3L9 16.9l10.4-1.5z" />
            <path d="M8 40l4-4M40 40l-4-4M24 44v-5" />
        </>
    ),
    rutas: (
        <>
            <circle cx="11" cy="37" r="4" />
            <circle cx="37" cy="11" r="4" />
            <path d="M15 37h14a6 6 0 0 0 0-12H19a6 6 0 0 1 0-12h14" strokeDasharray="3 4" />
        </>
    ),
}
/**
 * The first choice (wireframe): the screen is split into three DIAGONAL, transparent slices over
 * the island — each one tints the island with its own ambience (Lugares: a bright day ·
 * Eventos: a festive night with sparkles · Rutas: a warm sunset). Hovering one brings it forward;
 * choosing it makes it fill the screen, then everything settles into the bottom bar.
 */
const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
function FilterHero() {
    const setMode = useExperience((s) => s.setMode)
    const root = useRef()
    const busy = useRef(false)
    useGSAP(
        () => {
            // (RULE: the pieces of one screen arrive together — title, slices, plans and cuts at once)
            gsap.from('.hero__intro > *', { autoAlpha: 0, y: 24, duration: 0.8, ease: 'power3.out', delay: 0.3 })
            // Chonti reads the screen as soon as it is there
            const id = setTimeout(() => useExperience.getState().narrate(heroLine()), 500)
            gsap.from('.slice', { autoAlpha: 0, duration: 0.9, ease: 'power2.out', delay: 0.3 })
            gsap.from('.slice__content', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: 0.3 })
            gsap.from('.hero__lines line', { attr: { y2: 0 }, duration: 0.9, ease: 'power2.inOut', delay: 0.3 })
            return () => clearTimeout(id)
        },
        { scope: root }
    )
    // where the columns stand vertically → each one sits on the centre line of its diagonal slice
    useEffect(() => {
        const fit = () => {
            const col = root.current?.querySelector('.slice__column')
            if (!col) return
            const r = col.getBoundingClientRect()
            root.current.style.setProperty('--cy', ((r.top + r.bottom) / 2 / window.innerHeight).toFixed(3))
        }
        fit()
        window.addEventListener('resize', fit)
        return () => window.removeEventListener('resize', fit)
    }, [])
    const choose = (id, e) => {
        if (busy.current) return
        busy.current = true
        const el = e.currentTarget
        const tl = gsap.timeline({ onComplete: () => setMode(id) })
        tl.to('.hero__intro, .hero__lines', { autoAlpha: 0, duration: 0.3 })
          .to(gsap.utils.toArray('.slice').filter((s) => s !== el), { autoAlpha: 0, duration: 0.35 }, '<')
          .to(el, { clipPath: FULL, duration: 0.6, ease: 'power3.inOut' }, '<')
          .to(el.querySelector('.slice__content'), { autoAlpha: 0, y: 30, duration: 0.3 }, '<0.2')
          .to(el, { autoAlpha: 0, duration: 0.5 }, '>0.05')
    }
    return (
        <nav ref={root} className="hero" aria-label={UI.menu.heroTitle}>
            {FILTERS.map((f) => (
                <button key={f.id} className={`slice slice--${f.id}`} onClick={(e) => choose(f.id, e)}>
                    <span className="slice__ambient" aria-hidden="true" />
                    {/* one centred column that leans like its diagonal (global.css) */}
                    <span className="slice__column">
                        <span className="slice__content">
                            <svg className="slice__icon" viewBox="0 0 48 48" aria-hidden="true">{ICONS[f.id]}</svg>
                            <span className="slice__label">{f.label}</span>
                            <span className="slice__hint">{f.hint}</span>
                            <span className="slice__desc">{f.desc}</span>
                            <span className="slice__go" aria-hidden="true">Escoger</span>
                        </span>
                    </span>
                </button>
            ))}
            {/* the diagonal cuts between the slices */}
            <svg className="hero__lines hero__lines--wide" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <line x1="39" y1="0" x2="27" y2="100" />
                <line x1="73" y1="0" x2="61" y2="100" />
            </svg>
            <svg className="hero__lines hero__lines--tall" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="44" x2="100" y2="36" />
                <line x1="0" y1="74" x2="100" y2="66" />
            </svg>
            <header className="hero__intro">
                <h2 className="hero__title">{UI.menu.heroTitle}</h2>
            </header>
        </nav>
    )
}

function FilterBar() {
    const mode = useExperience((s) => s.mode)
    const setMode = useExperience((s) => s.setMode)
    const instruction = useExperience(instructionOf)
    const root = useRef()

    // Cinematic entrance: the options rise out of the depth, all together, then keep floating (CSS)
    useGSAP(() => {
        gsap.from(root.current.children, {
            autoAlpha: 0, y: 90, z: -260, rotateX: -55, filter: 'blur(10px)',
            duration: 1.2, ease: 'expo.out', delay: 0.3, clearProps: 'filter',
        })
    })

    return (
        <>
        {/* plain text under the plans (not a button): what to do now · how to move the island */}
        <p className="stage-hint" aria-live="polite">
            {/* (with Chonti there the instruction lives in his bubble: here only the drag hint) */}
            {instruction && <strong key={instruction} className="stage-hint__do">{instruction}</strong>}
            {mode && <span className="stage-hint__drag">{TOUCH ? UI.hints.dragTouch : UI.hints.drag}</span>}
        </p>
        <nav className="filters" aria-label="Escoge tu plan">
            {mode && (
                <div className="filters__status-row">
                    <button className="btn btn--primary filters__back" onClick={() => setMode(null)}>
                        {UI.menu.back}
                    </button>
                </div>
            )}
            <div ref={root} className="filters__row">
                {FILTERS.map((f) => (
                    <button key={f.id} className="filter" aria-pressed={mode === f.id} onClick={() => setMode(mode === f.id ? null : f.id)}>
                        <span className="filter__label">{f.label}</span>
                        <span className="filter__hint">{f.hint}</span>
                    </button>
                ))}
            </div>
        </nav>
        </>
    )
}

/**
 * RUTAS menu, on the RIGHT side: route categories + "¿Quieres crear tu ruta?" + Muro comunitario.
 * (Lugares and Eventos are picked directly on the island: every 3D marker is also a button.)
 */
function RoutesMenu() {
    const s = useExperience()
    if (s.mode !== 'rutas') return null
    const title = 'Rutas'
    const items = Object.values(ROUTES).map((r) => ({ id: r.id, label: r.name, meta: `${r.stops.length} paradas`, active: s.activeRoute === r.id && !s.builder && !s.previewRoute, onClick: () => s.setRoute(r.id) }))

    return (
        <aside className="panel panel--list panel--right" aria-label={title}>
            <h2 className="panel__title">{title}</h2>
            <p className="panel__sub">{UI.routes.pick ?? 'Escoge un tipo de ruta'}</p>
            {/* the three kinds of route: real buttons you want to press */}
            <ul className="list list--choices">
                {items.map((it, i) => (
                    <li key={it.id}>
                        <button className="list__item" aria-pressed={it.active} onClick={it.onClick}>
                            <span className="list__num">{i + 1}</span>
                            <span className="list__label">{it.label}</span>
                            <span className="list__meta">{it.meta}</span>
                        </button>
                    </li>
                ))}
            </ul>
            {/* a route on the map and nothing touched yet: how to learn about each stop */}
            <RouteActions />
        </aside>
    )
}

/**
 * The event card. Folding it into the little pill (and opening it again) is animated — the card
 * sinks and fades towards the pill, the pill pops in; the card rises softly when it opens — so
 * nothing jumps on the screen (Chonti, standing on it on phones, glides down / up with it).
 */
function EventCard() {
    const activeEvent = useExperience((s) => s.activeEvent)
    const min = useExperience((s) => s.cardMin)
    const setCardMin = useExperience((s) => s.setCardMin)
    const ev = EVENTS.find((e) => e.id === activeEvent)
    const card = useRef()
    const folding = useRef(false)

    // it opens (first time, or back from the pill) with the cards' "plop" (CSS)
    useEffect(() => {
        if (!min) folding.current = false
    }, [min])
    // another event while it is open: only its content changes, with a soft fade
    useGSAP(
        () => {
            if (min || !card.current) return
            gsap.fromTo(card.current.querySelectorAll('.card__title, .card__text, .eyebrow'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' })
        },
        { dependencies: [activeEvent] }
    )
    const fold = () => {
        if (folding.current) return
        folding.current = true
        gsap.to(card.current, { autoAlpha: 0, y: 34, scale: 0.94, transformOrigin: '100% 100%', duration: 0.35, ease: 'power2.in', onComplete: () => setCardMin(true) })
    }

    if (!ev) return null
    if (min)
        return (
            <button className="card-pill" onClick={() => setCardMin(false)} aria-label={`Abrir la tarjeta de ${ev.name}`}>
                <span className="eyebrow">Evento</span> {ev.name} <span aria-hidden="true">＋</span>
            </button>
        )
    return (
        <article ref={card} className="card card--float card--event" aria-labelledby="event-title">
            <header className="card__head">
                <p className="eyebrow">Evento · {ev.when}</p>
                <button className="icon-btn icon-btn--sm" onClick={fold} aria-label="Minimizar la tarjeta y ver el mapa">–</button>
            </header>
            <h2 id="event-title" className="card__title">{ev.name}</h2>
            <p className="card__text">{ev.body}</p>
            {/* when and where (an approximate season when there is no fixed date) */}
            {(ev.dates || ev.place) && (
                <dl className="event-facts">
                    {ev.dates && (
                        <div>
                            <dt><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>Cuándo</dt>
                            <dd>{ev.dates}</dd>
                        </div>
                    )}
                    {ev.place && (
                        <div>
                            <dt><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.6" /></svg>Dónde</dt>
                            <dd>{ev.place}</dd>
                        </div>
                    )}
                    {/* (why the hour changed: only under the island clock, not repeated here) */}
                </dl>
            )}
        </article>
    )
}

/**
 * RUTAS: the card of the stop you touched on the island — what it is and why it is worth it.
 * It is the explanation when there is no guide (and it stays with the guide too: on phones his
 * bubble hides while the routes sheet is open). The arrows walk the route stop by stop.
 */
function StopCard() {
    const id = useExperience((s) => s.selectedStop)
    const builder = useExperience((s) => s.builder)
    const activeRoute = useExperience((s) => s.activeRoute)
    const previewRoute = useExperience((s) => s.previewRoute)
    const selectStop = useExperience((s) => s.selectStop)
    const closeStop = useExperience((s) => s.closeStop)
    const stop = STOPS_BY_ID[id]
    if (!stop || builder) return null
    const list = previewRoute ?? (activeRoute ? ROUTES[activeRoute].stops.map((s) => s.id) : [id])
    const at = Math.max(0, list.indexOf(id))
    const go = (d) => selectStop(list[(at + d + list.length) % list.length])
    return (
        // (key: every stop pops in again with the cards' "plop")
        <article key={id} className="card card--stop" aria-labelledby="stop-title" aria-live="polite">
            {/* (no line over the title: the name says it all) */}
            <header className="card__head">
                <h2 id="stop-title" className="card__title">{stop.name}</h2>
                <button className="icon-btn icon-btn--sm" onClick={closeStop} aria-label="Cerrar la parada">✕</button>
            </header>
            <p className="card__text">{stop.desc ?? stop.note}</p>
            {list.length > 1 && (
                <footer className="stop-nav">
                    <button className="focus__arrow" onClick={() => go(-1)} aria-label="Parada anterior de la ruta">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                    </button>
                    <span className="stop-nav__count">Parada {at + 1} de {list.length}</span>
                    <button className="focus__arrow" onClick={() => go(1)} aria-label="Siguiente parada de la ruta">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                    </button>
                </footer>
            )}
        </article>
    )
}

function RouteActions() {
    const builder = useExperience((s) => s.builder)
    const toggleBuilder = useExperience((s) => s.toggleBuilder)
    const setWallOpen = useExperience((s) => s.setWallOpen)
    return (
        <div className="route-actions">
            <button className="btn btn--primary btn--block" aria-pressed={builder} onClick={toggleBuilder}>
                {builder ? UI.routes.exitBuilder : UI.routes.create}
            </button>
            <button className="btn btn--ghost btn--block" onClick={() => setWallOpen(true)}>
                {UI.routes.wall}
            </button>
        </div>
    )
}

function RouteBuilder() {
    const builder = useExperience((s) => s.builder)
    const stops = useExperience((s) => s.customStops).filter((id) => STOPS_BY_ID[id])
    const toggleStop = useExperience((s) => s.toggleStop)
    const clearStops = useExperience((s) => s.clearStops)
    const saveRoute = useExperience((s) => s.saveRoute)
    const toggleBuilder = useExperience((s) => s.toggleBuilder)
    const [name, setName] = useState('')
    const [author, setAuthor] = useState('')
    // asking before the two things you can't undo: publishing it on the wall · clearing it
    const [confirm, setConfirm] = useState(null) // 'publish' | 'clear' | null
    // "Agregar desde la lista" folds away when you touch anything outside it (the card itself
    // included), so the list never stays open over the card
    const picker = useRef()
    useEffect(() => {
        if (!builder) return
        const onDown = (e) => {
            const el = picker.current
            if (el?.open && !el.contains(e.target)) el.open = false
        }
        document.addEventListener('pointerdown', onDown)
        return () => document.removeEventListener('pointerdown', onDown)
    }, [builder])
    if (!builder) return null
    const R = UI.routes
    const missing = Math.max(0, MIN_ROUTE_STOPS - stops.length)

    return (
        // a STATIC card (nothing to scroll): title · the rule · your name and the route's · your
        // stops · "agregar desde la lista" · the count and the two buttons, always in view
        <article className="card card--float card--left card--builder" aria-labelledby="builder-title">
            <header className="card__head">
                <h2 id="builder-title" className="card__title">{R.create}</h2>
                {/* on phones the routes list (with its own exit button) is hidden while this is open */}
                <button className="icon-btn icon-btn--sm" onClick={toggleBuilder} aria-label={R.exitBuilder}>✕</button>
            </header>
            <p className="builder-rule">{R.min}</p>
            <form
                id="builder-form"
                className="builder-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    if (!missing) setConfirm('publish')
                }}
            >
                <label className="field">
                    <span>{R.author}</span>
                    <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={R.authorPlaceholder} maxLength={30} autoComplete="name" />
                </label>
                <label className="field">
                    <span>{R.name}</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder={R.namePlaceholder} maxLength={40} />
                </label>
            </form>
            {/* your stops, in order: small chips (they wrap; the card never needs a scroll) */}
            {stops.length > 0 && (
                <ol className="itinerary itinerary--chips">
                    {stops.map((id, i) => (
                        <li key={id}>
                            <span className="list__num">{i + 1}</span>
                            <span className="itinerary__name">{STOPS_BY_ID[id].name}</span>
                            <button className="itinerary__x" onClick={() => toggleStop(id)} aria-label={`Quitar ${STOPS_BY_ID[id].name}`}>✕</button>
                        </li>
                    ))}
                </ol>
            )}
            {/* the list opens OVER the card (upwards): the card itself keeps its size */}
            <details ref={picker} className="builder-picker">
                <summary>{R.addFromList}</summary>
                <div className="builder-picker__pop" role="group" aria-label="Escoge tus paradas">
                    {/* its own card beside the route maker (never over it), with its way out */}
                    <header className="builder-picker__head">
                        <h3 className="builder-picker__title">Escoge tus paradas</h3>
                        <button type="button" className="btn btn--primary builder-picker__done" onClick={() => picker.current && (picker.current.open = false)}>
                            Listo
                        </button>
                    </header>
                    {Object.values(ROUTES).map((r) => (
                        <fieldset key={r.id}>
                            <legend>{r.name}</legend>
                            {r.stops.map((st) => (
                                <label key={st.id} className="check">
                                    <input type="checkbox" checked={stops.includes(st.id)} onChange={() => toggleStop(st.id)} />
                                    {st.name}
                                </label>
                            ))}
                        </fieldset>
                    ))}
                </div>
            </details>
            <p className={`builder-count ${missing ? '' : 'is-ready'}`} aria-live="polite">
                {missing === 1 ? R.missingOne : missing ? R.missing.replace('{n}', missing) : R.ready}
            </p>
            <div className="card__actions builder-actions">
                <button type="submit" form="builder-form" className="btn btn--primary" disabled={missing > 0}>
                    {R.publish}
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setConfirm('clear')} disabled={!stops.length}>
                    {R.clear}
                </button>
            </div>
            {confirm && (
                <ConfirmDialog
                    title={confirm === 'publish' ? R.confirmPublishTitle : R.confirmClearTitle}
                    yes={confirm === 'publish' ? R.confirmPublishYes : R.confirmClearYes}
                    no={confirm === 'publish' ? R.confirmPublishNo : R.confirmClearNo}
                    danger={confirm === 'clear'}
                    onNo={() => setConfirm(null)}
                    onYes={() => {
                        if (confirm === 'publish') {
                            saveRoute(name, author)
                            setName('')
                        } else clearStops()
                        setConfirm(null)
                    }}
                >
                    {confirm === 'publish' ? (
                        <>
                            <p className="card__text">{R.confirmPublishText}</p>
                            <div className="confirm__route">
                                <p className="confirm__name">{name.trim() || 'Mi ruta'}</p>
                                <p className="confirm__by">por {author.trim() || 'Anónimo caleño'}</p>
                                <ol className="confirm__stops">
                                    {stops.map((id) => <li key={id}>{STOPS_BY_ID[id].name}</li>)}
                                </ol>
                            </div>
                        </>
                    ) : (
                        <p className="card__text">{R.confirmClearText.replace('{n}', stops.length)}</p>
                    )}
                </ConfirmDialog>
            )}
        </article>
    )
}

/** A small "are you sure?" over the screen (Escape or "no" closes it; the "yes" button gets the focus). */
function ConfirmDialog({ title, children, yes, no, danger = false, onYes, onNo }) {
    const yesBtn = useRef()
    useEffect(() => {
        yesBtn.current?.focus()
        const onKey = (e) => e.key === 'Escape' && onNo()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onNo])
    // (to <body>: inside the card its "plop" animation would trap it in the card's box)
    return createPortal(
        <div className="overlay overlay--soft confirm" onClick={onNo}>
            <section className="card confirm__card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
                <h2 id="confirm-title" className="confirm__title">{title}</h2>
                {children}
                <div className="card__actions confirm__actions">
                    <button ref={yesBtn} className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onYes}>{yes}</button>
                    <button className="btn btn--ghost" onClick={onNo}>{no}</button>
                </div>
            </section>
        </div>,
        document.body
    )
}

function CommunityWall() {
    const open = useExperience((s) => s.wallOpen)
    const wall = useExperience((s) => s.wall)
    const setWallOpen = useExperience((s) => s.setWallOpen)
    const showWallRoute = useExperience((s) => s.showWallRoute)
    const closeBtn = useRef()

    useEffect(() => {
        if (!open) return
        closeBtn.current?.focus()
        const onKey = (e) => e.key === 'Escape' && setWallOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, setWallOpen])

    if (!open) return null
    return (
        <div className="overlay" onClick={() => setWallOpen(false)}>
            <section className="card card--wall" role="dialog" aria-modal="true" aria-labelledby="wall-title" onClick={(e) => e.stopPropagation()}>
                <header className="card__head card__head--end">
                    <button ref={closeBtn} className="icon-btn" onClick={() => setWallOpen(false)} aria-label="Cerrar muro">✕</button>
                </header>
                <h2 id="wall-title" className="card__title">{UI.routes.wall}</h2>
                <ul className="wall">
                    {[...wall].reverse().map((entry) => (
                        <li key={entry.id} className="wall__item">
                            <h3 className="wall__name">{entry.name}</h3>
                            <p className="wall__author">por {entry.author}</p>
                            <p className="wall__stops">{entry.stops.map((id) => STOPS_BY_ID[id]?.name).filter(Boolean).join(' · ')}</p>
                            <button className="btn btn--ghost" onClick={() => showWallRoute(entry)}>Ver en la isla</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default function StageUI() {
    const mode = useExperience((s) => s.mode)
    const explored = useExperience((s) => s.explored)
    return (
        <>
            {/* first time: the big selector; after the first plan: the compact bar at the bottom */}
            {!explored && !mode ? <FilterHero /> : <FilterBar />}
            <RoutesMenu />
            {mode === 'lugares' && <PlaceShowcase />}
            {mode === 'eventos' && <EventCard />}
            {mode === 'rutas' && <RouteBuilder />}
            {mode === 'rutas' && <StopCard />}
            <CommunityWall />
        </>
    )
}
