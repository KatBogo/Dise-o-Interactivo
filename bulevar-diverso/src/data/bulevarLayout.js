import island from '../content/island.json'

// Geometry of the Bulevar del Río island (pure math, shared by the content data and the 3D scene).
// Modeled on the real place (Google Maps): the Río Cali runs down the middle. On the SOUTH bank
// (+ offsets, "front") the Av. Colombia goes underground (Túnel Mundialista), so on top there is
// only the wide pedestrian Bulevar with its ciclorruta; behind the first row of buildings runs the
// Carrera 3. On the NORTH bank (− offsets, "back") the Avenida 1 Norte runs right along the river.
// The calles cross perpendicular to the river and end at those roads (never on the boulevard).

export const ISLAND_HALF_LENGTH = 23
export const ISLAND_HALF_WIDTH = 7
// (the water runs almost to the rim of the island: closed off 2.5 units before it, the ends looked
// like a pool walled in among the trees)
export const RIVER_HALF_LENGTH = 22.82

// Río Cali centerline (gentle meander). The island follows it.
export const riverZ = (x) => 0.9 * Math.sin(x * 0.13) + 0.45 * Math.sin(x * 0.31 + 0.8)

// Superellipse outline (n = 4): long rounded strip.
export const halfWidthAt = (x) => {
    const u = Math.min(1, Math.abs(x) / ISLAND_HALF_LENGTH)
    return ISLAND_HALF_WIDTH * Math.pow(1 - Math.pow(u, 4), 0.25)
}

// A point on the island, `offset` units across the river (+ = south bank, − = north bank).
export const bank = (x, offset) => [x, +(riverZ(x) + offset).toFixed(2)]

// Cross-section (offsets from the river centerline).
export const ZONES = {
    water: 0.75, // half width of the water
    channel: 0.95, // stone channel edge
    // south bank: the pedestrian Bulevar (over the tunnel) + ciclorruta, then Carrera 3
    promenadeFront: [0.95, 3.9],
    bikeLane: [2.82, 3.46], // (the old lane of the MIO along the Bulevar, now for bicycles)
    roadFront: [5.3, 6.0], // Carrera 3
    // north bank: a green strip with trees by the river, Avenida 1 Norte, sidewalk
    promenadeBack: [-1.3, -0.95],
    roadBack: [-2.3, -1.3], // Avenida 1 Norte
    sidewalkBack: [-2.55, -2.3],
}
export const BUILDING_ROWS = [4.62, -3.45, -4.75, -6.05]

// Which island (src/content/island.json): "real" (the real map) or "clasica" (the previous one, kept)
export const ISLAND_VARIANT = island.variants[island.variant] ?? island.variants.clasica
export const ISLAND_NAME = island.variants[island.variant] ? island.variant : 'clasica'
/** Where the pedestrian Bulevar runs (x from → to); outside it the south bank is a green park. */
export const PEDESTRIAN = ISLAND_VARIANT.pedestrian ?? [-ISLAND_HALF_LENGTH, ISLAND_HALF_LENGTH]
export const onPedestrian = (x, pad = 0) => x > PEDESTRIAN[0] - pad && x < PEDESTRIAN[1] + pad

/**
 * The Av. Colombia on the SOUTH bank, where it runs in the open (outside the pedestrian Bulevar):
 * it dips into the Túnel Mundialista at both ends of the Bulevar (the trenches with green walls) and
 * runs under it. { offsets: [near, far], tunnels: [[x0, x1], …] } — null on the classic island.
 */
export const SOUTH_ROAD = ISLAND_VARIANT.southRoad ?? null
export const onSouthRoadX = (x) => !!SOUTH_ROAD && !onPedestrian(x) && Math.abs(x) <= ISLAND_HALF_LENGTH
/** 0 → 1 inside a tunnel trench (how far down the road is), null outside the trenches. */
export const tunnelDepth = (x) => {
    for (const [a, b] of SOUTH_ROAD?.tunnels ?? []) {
        if (x < a || x > b) continue
        // (deeper towards the Bulevar: the west trench goes down eastwards, the east one westwards)
        const t = (x - a) / (b - a)
        return a < 0 ? t : 1 - t
    }
    return null
}

/**
 * The Av. 1 Norte / Av. 4 Oeste on the NORTH bank moves away from the river in the west (the Gato
 * del Río sits in the green strip between the water and the road): how much its offsets move at x.
 */
const NS = ISLAND_VARIANT.northShift ?? null
export const northShift = (x) => {
    if (!NS) return 0
    const k = Math.min(1, Math.max(0, (NS.x + NS.blend - x) / NS.blend)) // 1 west of NS.x, 0 east of it
    return NS.by * k * k * (3 - 2 * k)
}
/**
 * How much wider (across the river, in z) the north road has to be at x so that it keeps its real
 * width where it turns: on a slanted stretch a strip of the same z width looks thinner.
 */
export const northWiden = (x) => {
    const d = 0.05
    const r = (riverZ(x + d) - riverZ(x - d)) / (2 * d)
    const s = r + (northShift(x + d) - northShift(x - d)) / (2 * d)
    return Math.sqrt(1 + s * s) / Math.sqrt(1 + r * r)
}
/** The Av. 1 Norte / Av. 4 Oeste at x: [far edge, river-side edge, widen] (offsets from the river). */
export const northRoad = (x) => {
    const [a, b] = ZONES.roadBack
    const w = northWiden(x)
    const mid = (a + b) / 2 + northShift(x)
    return [mid - ((b - a) / 2) * w, mid + ((b - a) / 2) * w, w]
}
/** Extra rows of buildings on some stretches (the built-up south bank along the Av. Colombia). */
export const EXTRA_ROWS = ISLAND_VARIANT.extraRows ?? []
/** How many lots stay empty (or become a tree): the real Bulevar is more built up. */
export const EMPTY_LOTS = ISLAND_VARIANT.emptyLots ?? 0.32

// Calles that cross perpendicular to the river (they end at the Bulevar / at the river road).
// Puente Ortiz and two footbridges are the only crossings of the river (pedestrian).
export const CROSS_STREETS = [-13.75, -5.05, 3.65, 12.35]
export const CROSS_HALF = 0.42 // half width of a cross street
export const onCrossStreet = (x, pad = 0) => CROSS_STREETS.some((c) => Math.abs(x - c) < CROSS_HALF + pad)
/** How close to the rim of the island the streets run (they go all the way to the edge). */
export const ROAD_RIM = 0.08
/** x range where the Carrera 3 fits on the island */
export const CARRERA3_X = (() => {
    let x = 0
    while (halfWidthAt(x + 0.1) - ROAD_RIM > ZONES.roadFront[1]) x += 0.1
    return x
})()
/**
 * Where the Carrera 3 runs: on the real island it starts at a calle in the west (beyond it, the
 * Museo La Tertulia and its gardens), island.json → carrera3West.
 */
export const CARRERA3 = [ISLAND_VARIANT.carrera3West ?? -CARRERA3_X, Math.min(CARRERA3_X, ISLAND_VARIANT.carrera3East ?? Infinity)]
export const inCarrera3 = (x) => x > CARRERA3[0] && x < CARRERA3[1]
// (the Av. 1 Norte runs to both ends of the island)
export const AV1N_X = (() => {
    let x = 0
    while (halfWidthAt(x + 0.1) - ROAD_RIM > -ZONES.roadBack[0]) x += 0.1
    return x
})()
/**
 * …except where it ends before (island.json → av1Norte.to: on the real island it ends at the calle
 * before the Puente Ortiz — beyond it, by the river, the park of La Retreta).
 */
export const AV1N_TO = Math.min(AV1N_X, ISLAND_VARIANT.av1Norte?.to ?? Infinity)
export const onAv1N = (x) => x > -AV1N_X && x < AV1N_TO
/**
 * La Retreta (Parque Paseo Bolívar): the park on the north bank by the Puente Ortiz, from x0 to the
 * east end, between the walk by the river and the second street (island.json → retreta).
 */
export const RETRETA = ISLAND_VARIANT.retreta ?? null
export const inRetreta = (x, off, pad = 0) => !!RETRETA && x > RETRETA.x - pad && off < -0.95 + pad && off > RETRETA.back - pad
/**
 * A second street on the north bank, behind the first block (the two rows of buildings along the
 * Av. 1 Norte, one facing it and one facing this street): island.json → northStreet
 * { offsets: [far, near], x: [from, to] } — only where it fits. Beyond it, to the rim, there is no
 * room for another row: lawn and trees.
 */
export const NORTH_STREET = ISLAND_VARIANT.northStreet ?? null
export const onNorthStreetX = (x) => !!NORTH_STREET && x > NORTH_STREET.x[0] && x < NORTH_STREET.x[1]
/**
 * Other streets, drawn as a line of points [along, across] with their width (island.json →
 * streets): the one by La Ermita, which comes out at the end of the Bulevar and splits, one way
 * along the river to the east end and the other along the Ermita to the south edge.
 */
export const STREETS = ISLAND_VARIANT.streets ?? []
/** How far (x, offset) is from one of those streets' middle line, minus half its width (< 0: on it). */
export function streetGap(x, off) {
    let best = Infinity
    for (const s of STREETS) {
        for (let i = 0; i + 1 < s.points.length; i++) {
            const [ax, ao] = s.points[i], [bx, bo] = s.points[i + 1]
            const dx = bx - ax, d0 = bo - ao
            const t = Math.max(0, Math.min(1, ((x - ax) * dx + (off - ao) * d0) / (dx * dx + d0 * d0 || 1)))
            best = Math.min(best, Math.hypot(x - ax - dx * t, off - ao - d0 * t) - s.width / 2)
        }
    }
    return best
}

/** Is (x, offset) on a road (or the ciclorruta)? Used to keep decorations off the streets. */
export function onRoad(x, off, pad = 0) {
    const inside = ([a, b]) => off > a - pad && off < b + pad
    const nr = northRoad(x)
    if ((onAv1N(x) && inside(nr)) || (onPedestrian(x) && inside(ZONES.bikeLane))) return true
    if (onSouthRoadX(x) && inside(SOUTH_ROAD.offsets)) return true
    if (inCarrera3(x) && inside(ZONES.roadFront)) return true
    if (onNorthStreetX(x) && inside(NORTH_STREET.offsets)) return true
    if (STREETS.length && streetGap(x, off) < pad) return true
    const southEnd = onSouthRoadX(x) ? SOUTH_ROAD.offsets[1] : ZONES.promenadeFront[1]
    if (onCrossStreet(x, pad) && (off > southEnd - pad || off < nr[1] + pad)) return true
    return false
}
