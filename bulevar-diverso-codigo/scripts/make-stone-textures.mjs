// Draws the sandstone of the Museo La Tertulia: scripts/textures/arenisca.png — the walls are
// cladded with BIG upright plates of yellow sandstone (taller than wide), all of close warm tones,
// in columns whose joints don't line up, with faint joints and soft clouds in each plate, like the
// photos of the Cinemateca. It tiles with no seams.
//   node scripts/make-stone-textures.mjs
import path from 'node:path'
import sharp from 'sharp'

const W = 512, H = 512
let s = 21
const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
// (close tones: the wall reads as one warm surface, the plates only just show)
const TONES = ['#EDD397', '#E8CA86', '#F1DAA3', '#E4C27C', '#EBCF8F', '#F3DFAE', '#E6C683']
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const px = Buffer.alloc(W * H * 3)

// a soft value noise for the clouds of the stone
const N = 16
const grid = Array.from({ length: N * N }, () => rand())
const noise = (u, v) => {
    const x = u * N, y = v * N
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j
    const g = (a, b) => grid[((b + N) % N) * N + ((a + N) % N)]
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    return (g(i, j) * (1 - sx) + g(i + 1, j) * sx) * (1 - sy) + (g(i, j + 1) * (1 - sx) + g(i + 1, j + 1) * sx) * sy
}

// columns of plates (widths add up to W, so it tiles across); each column its own plate heights
let x = 0
const cols = []
while (x < W) {
    const w = Math.min(W - x, [64, 72, 80, 88][Math.floor(rand() * 4)])
    cols.push([x, w])
    x += w
}
for (const [x0, w] of cols) {
    const shift = Math.floor(rand() * 180) // (the joints of neighbour columns don't line up)
    const plates = []
    let cy = 0
    while (cy < H) {
        const h = Math.min(H - cy, 120 + Math.floor(rand() * 90))
        plates.push([cy, h, hex(TONES[Math.floor(rand() * TONES.length)])])
        cy += h
    }
    for (let yy = 0; yy < H; yy++) {
        const sy = (yy + shift) % H
        const [a, h, col] = plates.find(([p, ph]) => sy >= p && sy < p + ph)
        for (let xx = x0; xx < x0 + w; xx++) {
            const joint = xx - x0 < 1 || sy - a < 1
            const cloud = 0.95 + 0.07 * noise(xx / W, yy / H) + 0.03 * noise((xx * 3) / W, (yy * 3) / H) + (rand() - 0.5) * 0.02
            const i = (yy * W + xx) * 3
            for (let c = 0; c < 3; c++) px[i + c] = Math.max(0, Math.min(255, joint ? col[c] * 0.88 : col[c] * cloud))
        }
    }
}
await sharp(px, { raw: { width: W, height: H, channels: 3 } }).png().toFile(path.resolve('scripts/textures/arenisca.png'))
console.log('arenisca.png lista')
