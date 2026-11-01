import { ISLAND_NAME, ISLAND_VARIANT, bank, riverZ } from './bulevarLayout.js'
import edificios from '../content/edificios.json'
import edificiosAntes from '../content/edificios-antes.json'
import { USER_ISLAND } from './userGround.js'
const ISLAND_TOP_Y = 0.3 // (the top of the island: config.js ISLAND_TOP)
import timeline from '../content/timeline.json'
import places from '../content/places.json'
import events from '../content/events.json'
import routes from '../content/routes.json'
import ui from '../content/ui.json'
import audio from '../content/audio.json'

/**
 * Content adapter. ALL editorial content lives in /src/content/*.json (replace freely);
 * this file only converts JSON `location: { along, across }` into island coordinates [x, z]
 * and builds lookup tables. Components import from here, never from the JSON directly.
 */
const toPosition = ({ along, across }) => bank(along, across)

/**
 * Your buildings (Assets/modelos/isla_edificios.glb, as you arranged them — scripts/sync-assets.mjs →
 * src/content/edificios.json): what you did to each place, landmark and route house in that file
 * (moved, turned, scaled) is done to it here, so its marker goes with it.
 */
export const USER_BUILDINGS = ISLAND_NAME === 'clasica' ? [] : edificios.items ?? []
const USER_BY_NAME = Object.fromEntries(USER_BUILDINGS.map((it) => [it.name, it]))
const yawAt = (x) => -Math.atan2(riverZ(x + 0.1) - riverZ(x - 0.1), 0.2)
// (each time you arranged them, in order: your buildings of before — edificios-antes.json —, then your
// island as you arranged it — edificios.json —; each one moves things from where the one before left them)
const LAYERS = (ISLAND_NAME === 'clasica' ? [] : [edificiosAntes.items ?? [], USER_BUILDINGS]).map((items) => Object.fromEntries(items.filter((it) => it.foot).map((it) => [it.name, it])))
function moveOnce(it, [x, z]) {
    const m = it.matrix, [fx, , fz] = it.foot
    const nx = m[0] * (x - fx) + m[8] * (z - fz) + m[12], nz = m[2] * (x - fx) + m[10] * (z - fz) + m[14]
    // (its turn on its spot: what you turned it, minus how the river bends between there and here)
    const turn = Math.atan2(-m[2], m[0]) + yawAt(x) - yawAt(nx)
    return { position: [nx, nz], scale: Math.hypot(m[0], m[2]), turn: (turn * 180) / Math.PI }
}
/** Where a thing that stood at [x, z] goes now, how much more it turns (degrees) and how much bigger it is — or null. */
export function movedBy(name, p) {
    let out = null
    for (const layer of LAYERS) {
        if (!layer[name]) continue
        const m = moveOnce(layer[name], out ? out.position : p)
        out = out ? { position: m.position, scale: out.scale * m.scale, turn: out.turn + m.turn } : m
    }
    return out
}
/** Is it in your buildings file? (a route house you deleted there has no building on the page) */
export const inUserBuildings = (name) => !!USER_BY_NAME[name]

export const UI = ui
export const AUDIO = audio
export const GUIDE_LINES = ui.guide

export const TIMELINE_INFO = { eyebrow: timeline.eyebrow, title: timeline.title, lead: timeline.lead }
export const TIMELINE = timeline.items

/**
 * The story of a place shared out over its slides, in order and the same number of paragraphs
 * each (6 paragraphs → 2 + 2 + 2), so each slide reads whole without scrolling.
 */
function splitStory(story = [], parts) {
    const groups = Array.from({ length: parts }, () => [])
    story.forEach((paragraph, i) => groups[Math.min(parts - 1, Math.floor((i * parts) / story.length))].push(paragraph))
    return groups
}

// (where each place / stop goes on the island that is shown: src/content/island.json)
const placeAt = (p) => {
    const o = ISLAND_VARIANT.places?.[p.id]
    return o ? { ...p, location: { along: o.along, across: o.across }, ...(o.size ? { size: o.size } : {}), ...(o.sink ? { sink: o.sink } : {}), ...(o.turn ? { turn: o.turn } : {}), ...(o.floor ? { floor: o.floor } : {}), ...(o.pave ? { pave: o.pave } : {}) } : p
}
const stopAt = (s) => {
    const o = ISLAND_VARIANT.stops?.[s.id]
    return o ? { ...s, location: { along: o.along, across: o.across } } : s
}

const placeMoved = (p) => {
    const mv = movedBy(`lugar_${p.id}`, p.position)
    return mv ? { ...p, position: mv.position, turn: (p.turn ?? 0) + mv.turn, scale: (p.scale ?? 1) * mv.scale, ...(p.size ? { size: p.size * mv.scale } : {}) } : p
}
export const PLACES = places.items.map(placeAt).map((p) => placeMoved({ ...p, position: toPosition(p.location), storyParts: splitStory(p.story, p.slides.length) }))

// (the Sucursal Fest, on the real island, is at La Retreta: island.json → events)
const eventAt = (e) => {
    const o = ISLAND_VARIANT.events?.[e.id]
    return o ? { ...e, location: { along: o.along, across: o.across } } : e
}
export const EVENTS = events.items.map(eventAt).map((e) => ({ ...e, position: toPosition(e.location) }))

// (a route house: ruta_<id> in your file; La Ermita: hito_la-ermita)
const stopMoved = (s) => {
    // (a stop on a place — the cultural route: the Tertulia, the MUCIC… —: on it, where it is now)
    if (s.place) {
        const p = PLACES.find((q) => q.id === s.place)
        return p ? { ...s, position: p.position, landmark: true } : s
    }
    // (a stop that takes the place of one of your buildings — the empanadas of the Obelisco —:
    // there, as big as it — unless its house is in your file now: ruta_<id>, below)
    if (s.replaces && USER_BY_NAME[s.replaces] && !USER_BY_NAME[`ruta_${s.id}`]) {
        const b = USER_BY_NAME[s.replaces].box
        return { ...s, position: [b.x, b.z], fit: Math.max(b.w, b.d) }
    }
    const name = s.id === 'ermita' ? 'hito_la-ermita' : `ruta_${s.id}`
    const mv = movedBy(name, s.position)
    // (a route house: its model as big as the lot you left it, in the middle of it)
    if (s.id !== 'ermita' && s.model && USER_BY_NAME[name]) {
        const b = USER_BY_NAME[name].box
        return { ...s, position: [b.x, b.z], turn: mv?.turn ?? 0, fit: Math.max(b.w, b.d), top: b.y + b.h - ISLAND_TOP_Y }
    }
    if (mv && inUserBuildings(name)) return { ...s, position: mv.position, turn: mv.turn, scale: mv.scale }
    if (!USER_BUILDINGS.length || s.landmark || inUserBuildings(name)) return s
    // (your island as you arranged it: none of your buildings is turned into its house — its marker
    // stays where it was)
    if (USER_ISLAND) {
        // (its marker on the top of the building of yours nearest to where it was, on its bank — the
        // building stays as it is)
        const [qx, qz] = mv?.position ?? s.position
        const south = qz > riverZ(qx)
        const near = USER_BUILDINGS.filter((it) => /^edificios_modelo_/.test(it.name) && it.box.z > riverZ(it.box.x) === south)
            .map((it) => [it, Math.hypot(it.box.x - qx, it.box.z - qz)])
            .sort((a, b) => a[1] - b[1])[0]
        if (!near || near[1] > 2.5) return { ...s, position: [qx, qz], noBuilding: true }
        const b = near[0].box
        return { ...s, position: [b.x, b.z], top: b.y + b.h - ISLAND_TOP_Y, onBuilding: near[0].name }
    }
    // (one whose house you deleted: it takes the place of the building of yours nearest to where it
    // was, on its bank — its marker on a house of its own, not on somebody else's roof)
    const [px, pz] = mv?.position ?? s.position
    const south = pz > riverZ(px)
    const near = USER_BUILDINGS.filter((it) => /^edificios_modelo_/.test(it.name) && !TAKEN.has(it.name) && it.box.z > riverZ(it.box.x) === south)
        .map((it) => [it, Math.hypot(it.box.x - px, it.box.z - pz)])
        .sort((a, b) => a[1] - b[1])[0]
    if (!near || near[1] > 2.5 || !s.model) return { ...s, noBuilding: true }
    TAKEN.add(near[0].name)
    const b = near[0].box
    return { ...s, replaces: near[0].name, position: [b.x, b.z], fit: Math.max(b.w, b.d) }
}
// (the buildings of yours a stop already takes the place of)
const TAKEN = new Set(routes.categories.flatMap((r) => r.stops.map((s) => s.replaces)).filter(Boolean))

export const ROUTES = Object.fromEntries(
    routes.categories.map((r) => [
        r.id,
        { ...r, stops: r.stops.map(stopAt).map((s) => stopMoved({ ...s, position: toPosition(s.location), placeholder: s.placeholder ?? r.placeholder })) },
    ])
)

// (and La Ermita: on the island, outside the routes — routes.json → hitos)
const HITOS = (routes.hitos ?? []).map(stopAt).map((s) => stopMoved({ ...s, position: toPosition(s.location), placeholder: 'monument' }))
export const ALL_STOPS = [...Object.values(ROUTES).flatMap((route) => route.stops.map((stop) => ({ ...stop, route: route.id }))), ...HITOS.map((s) => ({ ...s, route: null }))]
export const STOPS_BY_ID = Object.fromEntries(ALL_STOPS.map((stop) => [stop.id, stop]))
/**
 * A route house you duplicated in your buildings file (ruta_chontaduro.001): one more house like it
 * there, as big as its lot (no marker: the stop is the first one). Turned as you turned the copy.
 */
const angleOf = (m) => (Math.atan2(-m[2], m[0]) * 180) / Math.PI
export const STOP_COPIES = USER_BUILDINGS.map((it) => [it, /^ruta_(.+)\.\d+$/.exec(it.name)?.[1]])
    .filter(([, id]) => STOPS_BY_ID[id]?.model && STOPS_BY_ID[id].fit)
    .map(([it, id]) => {
        const s = STOPS_BY_ID[id], orig = USER_BY_NAME[`ruta_${id}`]
        return { ...s, id: it.name.slice(5), user: it.name, position: [it.box.x, it.box.z], fit: Math.max(it.box.w, it.box.d), turn: (s.turn ?? 0) + (orig ? angleOf(it.matrix) - angleOf(orig.matrix) : 0) }
    })
/**
 * A cultural house of before that is no stop any more (ruta_jairo-varela, ruta_paseo-bolivar): a
 * building like the others of the city in its place, as big as its lot.
 */
export const OLD_STOP_LOTS = USER_ISLAND ? [] : USER_BUILDINGS.filter((it) => /^ruta_[^.]+$/.test(it.name) && !STOPS_BY_ID[it.name.slice(5)])

export const SEED_WALL = routes.wallSeed
