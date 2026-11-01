/**
 * Runs before `npm run dev`: removes the dev build cache (.next). A cache left over from a
 * production build or from an interrupted server gives errors such as
 * "Cannot find module './10.js'" on localhost; starting clean avoids them.
 */
import fs from 'node:fs'

try {
    fs.rmSync('.next', { recursive: true, force: true })
} catch (e) {
    // a file still locked by another running dev server: say so instead of failing
    console.warn(`[dev] No se pudo limpiar .next (${e.code}). ¿Hay otro "npm run dev" abierto? Ciérralo y vuelve a intentar.`)
}
