import TERRENO from '../content/terreno.json'
import { ISLAND_NAME } from './bulevarLayout.js'

/**
 * Where your terrain (Assets/modelos/isla_terreno.glb) has street, walk and path — a map of cells
 * written by scripts/terreno-layout.py (src/content/terreno.json → ground). The page keeps its cars
 * on your streets, its lamps by your streets and walks, its trees and benches off them.
 */
const G = ISLAND_NAME !== 'clasica' ? TERRENO.ground : null
export const USER_GROUND = !!G
/**
 * Your whole island as you arranged it (Assets/modelos/isla_para_acomodar.glb → scripts/isla-acomodada.py):
 * its trees, lamps, benches and stones are yours, where you left them — the page draws none of its own.
 * USER_LAMPS / USER_TREES: where they stand (the lamps light up at night; the Alumbrado lights the trees).
 */
export const USER_ISLAND = !!G && !!TERRENO.arranged
export const USER_LAMPS = USER_ISLAND ? TERRENO.lamps ?? [] : []
export const USER_TREES = USER_ISLAND ? TERRENO.trees ?? [] : []
/** Where its benches and furniture are, seen from above: [x0, z0, x1, z1] (the tents of the Feria keep off them). */
export const USER_FURNITURE = USER_ISLAND ? TERRENO.furniture ?? [] : []
const layers = G ? Object.fromEntries(['street', 'walk', 'path', 'land'].filter((k) => G[k]).map((k) => [k, Uint8Array.from(atob(G[k]), (c) => c.charCodeAt(0))])) : {}
const at = (layer, i, j) => {
    if (i < 0 || j < 0 || i >= G.nx || j >= G.nz || !layers[layer]) return false
    const k = i * G.nz + j
    return ((layers[layer][k >> 3] >> (k & 7)) & 1) === 1
}
/** Is there (within r) street / walk / path / land (the top of the island) of your terrain at x, z (island coordinates)? */
export function onGround(layer, x, z, r = 0) {
    if (!G) return false
    const ci = Math.floor((x - G.x0) / G.cell), cj = Math.floor((z - G.z0) / G.cell)
    const n = Math.ceil(r / G.cell)
    for (let di = -n; di <= n; di++) for (let dj = -n; dj <= n; dj++) {
        if (di * di + dj * dj > n * n + 1) continue
        if (at(layer, ci + di, cj + dj)) return true
    }
    return false
}
