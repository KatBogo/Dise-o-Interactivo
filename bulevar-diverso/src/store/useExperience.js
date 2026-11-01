import { create } from 'zustand'
import { Vector3 } from 'three'
import { CAMERA, PHASES, STAGES } from '../config.js'
import { EVENTS, GUIDE_LINES, PLACES, ROUTES, SEED_WALL, STOPS_BY_ID, UI } from '../data/content.js'
import { EVENT_SKY, MODE_SKY, PREVIEW_SKY, caliHourNow } from '../data/caliSky.js'

// High-frequency values (scroll progress) live OUTSIDE React state so that
// useFrame can read them every frame without triggering re-renders.
//  progress : smoothed intro scroll 0..1 (written by IntroTimeline's ScrollTrigger)
//  reveal   : 0..1 white screen → timeline world (stage 2)
export const introState = { progress: 0, reveal: 0, lookTarget: new Vector3(...CAMERA.intro.target) }

const WALL_KEY = 'bulevar-diverso:muro'
const loadWall = () => {
    try {
        return JSON.parse(localStorage.getItem(WALL_KEY)) ?? []
    } catch {
        return []
    }
}
const persistWall = (entries) => {
    try {
        localStorage.setItem(WALL_KEY, JSON.stringify(entries))
    } catch {
        /* private mode: the wall still works for this session */
    }
}

/** A route of your own needs at least this many stops to be published on the wall. */
export const MIN_ROUTE_STOPS = 2

const placeById = (id) => PLACES.find((p) => p.id === id)

/** A plan has been picked at least once → the island shows the real (or chosen) hour. */
export const skyIsLive = (s) => s.phase === PHASES.STAGE && (s.mode !== null || s.explored)
/** The sky the island shows now: a fixed preview until a plan is picked, then Cali's hour / yours. */
export const skyOf = (s) => (skyIsLive(s) ? s.manualSky ?? s.liveSky : PREVIEW_SKY)

/**
 * What to do right now, in one line: pick a point, pick an event, a route, tap the stops… It
 * stays in Chonti's bubble (when he is there) and under the plans (when you go without him).
 */
export function instructionOf(s) {
    const H = UI.hints
    if (s.phase !== PHASES.STAGE || (!s.mode && !s.explored)) return null
    if (!s.mode) return H.menu
    if (s.mode === 'lugares') return H.lugares
    if (s.mode === 'eventos') return s.activeEvent ? H.eventoActivo : H.eventos
    if (s.builder) return H.builder
    return s.activeRoute || s.previewRoute ? H.rutaActiva : H.rutas
}

/** What the three-plan selector says (title + every option). */
export const heroLine = () => `${UI.menu.heroTitle} ${UI.menu.options.map((f) => `${f.label}, ${f.hint}: ${f.desc}`).join(' ')}`

export const useExperience = create((set, get) => ({
    // ── Flow ─────────────────────────────────────────────────────────
    phase: PHASES.LOADING,
    sceneReady: false,
    setSceneReady: () => set({ sceneReady: true }),
    setPhase: (phase) => {
        if (get().phase === phase) return
        // no guide question any more (Chonti doesn't speak, there is nothing to choose): he always
        // comes along, straight to the plans
        if (phase === PHASES.GUIDE_PROMPT) {
            set({ skipToIsland: false })
            get().chooseGuide(true)
            return
        }
        // the fall is shown ONCE per visit: back in the story, reaching its end again takes you
        // straight down to the island (closing or reloading the page shows it again: introState
        // lives in memory only)
        if (phase === PHASES.FALLING && introState.fallSeen) {
            set((s) => ({ skipToIsland: true, greeting: false, walkDone: true, narration: { id: s.narration.id + 1, text: '' }, phase: PHASES.REVEAL }))
            return
        }
        if (phase === PHASES.FALLING) introState.fallSeen = true
        // while he falls: nothing is said, only the fall and the wind (whatever he was reading stops)
        if (phase === PHASES.FALLING) set((s) => ({ phase, narration: { id: s.narration.id + 1, text: '' } }))
        // the intro opens with Chonti greeting you (IntroScene); the scroll waits for him
        else if (phase === PHASES.INTRO) set({ phase, greeting: !introState.resume, greetStarted: false })
        else set({ phase })
        // on the island the plan selector greets you (StageUI) — with no guide, a short line
        if (phase === PHASES.STAGE && get().arrivalLine) {
            if (!get().guide) get().narrate(get().arrivalLine)
            set({ arrivalLine: null })
        }
    },
    skipIntro: () => set({ phase: PHASES.REVEAL }), // dev: straight to the island
    /**
     * "Ir a la isla": for whoever doesn't want to read — from anywhere in the intro straight to the
     * island's three plans: the camera dives to the map (the reveal) and the guide question is
     * skipped (Chonti comes along; the Voz button only decides whether he talks).
     */
    /**
     * The brand: back to the very beginning — Chonti waiting for you to press his head. In the
     * intro it just scrolls back up; from the island everything is reset first.
     */
    goToStart: () => {
        const { phase } = get()
        if (phase === PHASES.INTRO) {
            introState.jumpTo?.(0)
            return
        }
        if (phase !== PHASES.STAGE && phase !== PHASES.GUIDE_PROMPT) return // (mid-fall / dive: it finishes first)
        introState.resume = null
        set((s) => ({
            phase: PHASES.INTRO, greeting: true, greetStarted: false, walkDone: false,
            mode: null, explored: false, selectedPlace: null, slide: 0, activeEvent: null, activeRoute: null,
            builder: false, previewRoute: null, selectedStop: null, manualSky: null, skyBy: null,
            narration: { id: s.narration.id + 1, text: '' },
        }))
    },
    skipToIsland: false,
    goToIsland: () => {
        const { phase } = get()
        if (phase !== PHASES.INTRO && phase !== PHASES.LOADING) return
        set((s) => ({ skipToIsland: true, greeting: false, walkDone: true, narration: { id: s.narration.id + 1, text: '' }, phase: PHASES.REVEAL }))
    },
    /** From the island back to the timeline (the walk is skipped; the fall plays again at the end). */
    backToTimeline: () => {
        introState.resume = STAGES.discover[1] + 0.012
        set({ phase: PHASES.INTRO, greeting: false, mode: null, explored: false, selectedPlace: null, slide: 0, activeEvent: null, activeRoute: null, builder: false, previewRoute: null, manualSky: null, skyBy: null, walkDone: true })
    },
    // The intro opens with Chonti facing you, following your pointer, waiting for you to touch him
    // (greeting && !greetStarted). Touching him (that click is also what lets the browser play
    // sound) → he waves and introduces himself, then turns to walk: only then the scroll moves him.
    greeting: false,
    greetStarted: false,
    startGreeting: () => {
        if (!get().greeting || get().greetStarted) return
        set({ greetStarted: true })
        get().narrate('¡Hola! Yo soy Chonti. Scrollea hacia abajo y me acompañas.')
    },
    endGreeting: () => set({ greeting: false }),
    walkDone: false,
    skipWalk: () => {
        set({ walkDone: true, greeting: false })
        // the page has to be scrollable again (Interface) before jumping
        setTimeout(() => introState.skipWalk?.(), 60)
    },

    // ── Guide / accessibility ────────────────────────────────────────
    guide: false,
    // Chonti doesn't speak any more: what he says is written in his bubble (and read by screen
    // readers through the aria-live region of Narrator). `voice` stays false for good.
    voice: false,
    arrivalLine: null,
    chooseGuide: (guide) => {
        set({ guide, voice: false, arrivalLine: guide ? GUIDE_LINES.arrive : GUIDE_LINES.noGuide })
        get().setPhase(PHASES.STAGE)
    },
    speaking: false,
    setSpeaking: (speaking) => set({ speaking }),    magic: 0,
    // Browsers only let a page make sound after a click / tap / key (scrolling doesn't count).
    // audioReady: that has happened (or the browser allowed it anyway); wokeAt: when — so the
    // click that wakes the sound up never also switches Sonido / Voz off
    audioReady: false,
    wokeAt: 0,
    markAudioReady: (byGesture) => {
        if (get().audioReady) return
        set({ audioReady: true, wokeAt: byGesture ? performance.now() : 0 })
    },
    soundOn: true, // music + ambience + effects (audio/sound.js)
    // (turning it on with the slider at zero would sound like nothing: it comes back at a middle level)
    toggleSound: () => set((s) => (!s.soundOn && s.volume === 0 ? { soundOn: true, volume: 0.6 } : { soundOn: !s.soundOn })),
    // the slider that opens over "Sonido": down to zero mutes it, raising it turns it back on
    volume: 1,
    setVolume: (v) => set({ volume: v, soundOn: v > 0 }),
    narration: { id: 0, text: '' },
    // an empty text stops him; nothing is said while he falls or the clouds open
    narrate: (text) => {
        const { phase } = get()
        if (text && (phase === PHASES.FALLING || phase === PHASES.REVEAL)) return
        set((s) => ({ narration: { id: s.narration.id + 1, text } }))
    },
    // which phrase of the narration the voice is saying right now (the bubble shows that one)
    spokenPart: { id: -1, index: 0 },
    setSpokenPart: (spokenPart) => set({ spokenPart }),
    // Chonti reacts to what you do on screen (GuideChonti reads it): kind = an expression / gesture
    reaction: { id: 0, kind: null },
    react: (kind) => set((s) => ({ reaction: { id: s.reaction.id + 1, kind } })),

    // ── Sky: Cali's real hour, or the visitor's / the plan's choice ──
    // live   = the hour in Cali now (always a clear sky)
    // manual = { hour, weather } picked in the sky panel, or set by the plan / the event
    liveSky: { hour: caliHourNow(), weather: 'clear' },
    manualSky: null,
    setLiveSky: (patch) => set((s) => ({ liveSky: { ...s.liveSky, ...patch } })),
    setSkyHour: (hour) => {
        set({ manualSky: { weather: 'clear', hour }, skyBy: null })
        // he feels the hour you pick: sleepy at night, shy at dawn, happy in the day
        get().react(hour >= 20 || hour < 5 ? 'sleepy' : hour < 8 ? 'shy' : 'happy')
    },
    goLiveSky: () => {
        set({ manualSky: null, skyBy: null })
        get().react('surprised')
    },
    // who set the hour on the island: a plan ('lugares'…) or an event ('alumbrado'…) — Chonti says
    // why (UI.skyReasons); null = you or Cali's clock
    skyBy: null,

    // ── Menu option (null = camera locked) ──────────────────────────
    mode: null,
    explored: false, // after the first category the map stays free to explore
    setMode: (mode) => {
        set({
            mode,
            // each plan = its moment of the day (as on its slice): Lugares day · Eventos night · Rutas sunset
            manualSky: mode ? { ...MODE_SKY[mode] } : get().manualSky,
            skyBy: mode ?? get().skyBy,
            explored: mode !== null, // "Volver al mapa" → back to the three diagonal plans
            selectedPlace: null,
            slide: 0,
            activeEvent: null,
            activeRoute: null,
            builder: false,
            previewRoute: null,
            selectedStop: null,
        })
        // (Chonti also says why the hour of the island changed: there is no note under the clock)
        get().narrate(mode ? `${GUIDE_LINES[mode]} ${UI.skyReasons?.[mode] ?? ''}`.trim() : GUIDE_LINES.locked)
        get().react(mode ? 'excited' : 'happy')
    },

    // ── Lugares ──────────────────────────────────────────────────────
    selectedPlace: null,
    slide: 0,
    selectPlace: (id) => {
        set({ selectedPlace: id, slide: 0 })
        const place = placeById(id)
        get().narrate(place.guide) // (the story is on the card: he only welcomes you)
        get().react('love')
    },
    closePlace: () => {
        set({ selectedPlace: null, slide: 0 })
        get().react('wink')
    },
    stepSlide: (dir) => {
        const place = placeById(get().selectedPlace)
        if (!place) return
        const slide = (get().slide + dir + place.slides.length) % place.slides.length
        set({ slide })
        get().react(slide % 2 ? 'thinking' : 'happy') // (he reads along with you)
    },

    // ── Eventos ──────────────────────────────────────────────────────
    activeEvent: null,
    cardMin: false, // the floating card folded into a small pill (the map stays visible)
    setCardMin: (cardMin) => set({ cardMin }),
    setEvent: (id) => {
        // each event brings its own sky; leaving it gives the plan's sky back
        const prev = get().activeEvent
        set({
            activeEvent: id,
            cardMin: false,
            manualSky: EVENT_SKY[id] ? { ...EVENT_SKY[id] } : prev && EVENT_SKY[prev] ? { ...MODE_SKY.eventos } : get().manualSky,
            skyBy: EVENT_SKY[id] ? id : prev && EVENT_SKY[prev] ? 'eventos' : get().skyBy,
        })
        const event = EVENTS.find((e) => e.id === id)
        // (the card already says what, when and where: Chonti greets the event and says why the hour changed)
        if (event) get().narrate(`${event.guide} ${UI.skyReasons?.[id] ?? ''}`.trim())
        get().react(id === 'sucursal' ? 'dance' : id === 'alumbrado' ? 'love' : 'excited')
    },

    // ── Rutas ────────────────────────────────────────────────────────
    activeRoute: null,
    setRoute: (id) => {
        set({ activeRoute: id, previewRoute: null, selectedStop: null })
        get().narrate(ROUTES[id].guide)
        get().react('excited')
    },
    // the stop whose card is open (its explanation: with or without the guide)
    selectedStop: null,
    selectStop: (id) => {
        const stop = STOPS_BY_ID[id]
        if (!stop) return set({ selectedStop: null })
        set({ selectedStop: id })
        get().react('excited') // (the card says what the stop is: he is just glad you found it)
    },
    closeStop: () => set({ selectedStop: null }),
    builder: false,
    customStops: [],
    toggleBuilder: () => {
        const builder = !get().builder
        set({ builder, previewRoute: null, selectedStop: null, activeRoute: get().activeRoute ?? 'gastronomico' })
        if (builder) get().narrate(GUIDE_LINES.builder)
        get().react(builder ? 'thinking' : 'happy')
    },
    toggleStop: (id) => {
        if (!STOPS_BY_ID[id]) return // (an unknown stop: e.g. from an old saved route)
        const stops = get().customStops
        const next = stops.includes(id) ? stops.filter((s) => s !== id) : [...stops, id]
        set({ customStops: next })
        get().react(stops.includes(id) ? 'surprised' : 'wink')
        get().narrate(`${STOPS_BY_ID[id].name} ${stops.includes(id) ? 'fuera de' : 'agregada a'} tu ruta. Llevas ${next.length} paradas.`)
    },
    clearStops: () => {
        set({ customStops: [] })
        get().react('sad') // (he is a bit sad to see your route go)
    },

    wallOpen: false,
    setWallOpen: (wallOpen) => {
        set({ wallOpen })
        if (wallOpen) get().react('excited')
    },
    wall: [...SEED_WALL, ...loadWall()],
    saveRoute: (name, author) => {
        const stops = get().customStops
        if (stops.length < MIN_ROUTE_STOPS) return
        const entry = {
            id: `user-${Date.now()}`,
            name: name.trim() || 'Mi ruta',
            author: author.trim() || 'Anónimo caleño',
            stops,
        }
        const userEntries = [...loadWall(), entry]
        persistWall(userEntries)
        set({ wall: [...SEED_WALL, ...userEntries], customStops: [], builder: false, wallOpen: true, previewRoute: stops })
        get().narrate(`¡Ruta "${entry.name}" publicada en el Muro Comunitario!`)
        get().react('laugh')
    },
    previewRoute: null,
    showWallRoute: (entry) => {
        set({ previewRoute: entry.stops, wallOpen: false, builder: false, selectedStop: null })
        get().narrate(`Ruta ${entry.name}, de ${entry.author}: ${entry.stops.map((id) => STOPS_BY_ID[id]?.name).join(', ')}.`)
    },
}))
