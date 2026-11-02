/**
 * Builds the static site and prepares `bulevar-diverso-github/`, a folder ready to upload to a
 * GitHub repository and publish with GitHub Pages (or any static hosting).
 *
 *   npm run github
 *
 * Next.js writes absolute paths (/_next/…); GitHub Pages serves a project at
 * usuario.github.io/<repo>/, so every path is made relative to the page here. The `_next` folder
 * is renamed to `assets`: GitHub Pages (Jekyll) hides everything that starts with "_", so with
 * `_next` the page came out blank whenever `.nojekyll` was not uploaded. The result works from
 * any sub-folder, with or without `.nojekyll`.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const BUILD = '.next-export'
const DEST = 'bulevar-diverso-github'
const ASSETS = 'assets' // replaces `_next`

// 1. static build (output: 'export', see next.config.mjs)
const run = spawnSync('npx next build', { stdio: 'inherit', shell: true, env: { ...process.env, STATIC_EXPORT: '1', NEXT_DIST_DIR: BUILD } })
if (run.status !== 0) process.exit(run.status ?? 1)

// 2. fresh copy of the site
fs.rmSync(DEST, { recursive: true, force: true })
fs.cpSync(BUILD, DEST, { recursive: true })
fs.rmSync(BUILD, { recursive: true, force: true })
fs.rmSync(path.join(DEST, 'index.txt'), { force: true }) // RSC payload for client navigations (one page: not needed)
fs.renameSync(path.join(DEST, '_next'), path.join(DEST, ASSETS))

// 3. absolute → relative paths (and _next → assets)
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]))
let changed = 0
for (const file of walk(DEST)) {
    const ext = path.extname(file)
    if (!['.html', '.css', '.js'].includes(ext)) continue
    const before = fs.readFileSync(file, 'utf8')
    let after = before
    if (ext === '.html') after = after.replace(/(["'(=]|\\")(?:\.)?\/_next\//g, `$1./${ASSETS}/`) // links, scripts, inline payload
    if (ext === '.css') after = after.replace(/url\(\/_next\/static\/media\//g, 'url(../media/') // fonts, next to the css folder
    if (ext === '.js')
        after = after
            .replace(/\.p="\/_next\/"/g, `.p="./${ASSETS}/"`) // webpack public path (lazy chunks)
            .replace(/"\/_next\/static\/media\//g, `"./${ASSETS}/static/media/`) // imported images / files
    if (after !== before) {
        fs.writeFileSync(file, after)
        changed++
    }
}

// 4. GitHub Pages: don't run Jekyll (not needed any more, but harmless), plus the instructions
fs.writeFileSync(path.join(DEST, '.nojekyll'), '')
fs.copyFileSync('scripts/github-README.md', path.join(DEST, 'README.md'))

// 5. lighter: with your whole island (isla_bulevar-completa) the page never opens your separate
// buildings and terrain — they stay out —; the other models packed without loss where it helps
// (scripts/compress-models.mjs)
const MODELOS = JSON.parse(fs.readFileSync('src/content/modelos.json', 'utf8'))
if (MODELOS.models?.includes('isla_bulevar-completa'))
    for (const name of ['isla_edificios.glb', 'isla_terreno.glb']) fs.rmSync(path.join(DEST, 'models', name), { force: true })
const pack = spawnSync(`node scripts/compress-models.mjs ${path.join(DEST, 'models')} 100`, { stdio: 'inherit', shell: true })
if (pack.status !== 0) process.exit(pack.status ?? 1)

const files = walk(DEST).length
console.log(`\n✔ ${DEST}/ lista: ${files} archivos (${changed} con rutas relativas). Seguí ${DEST}/README.md para publicarla.`)
