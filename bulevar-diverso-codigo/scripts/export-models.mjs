// Exports the island and its models to Assets/modelos/*.glb
//
//   1. npm run dev                       (the app on http://localhost:3000)
//   2. node scripts/export-models.mjs    (this receiver, on port 4180)   · add --fbx for FBX copies too
//   3. open http://localhost:3000/?export&to=http://localhost:4180/save
//      → the page builds the whole island + each model (ModelExport.jsx) and sends them here;
//        Chonti (public/models/chonti.glb) is copied next to them.
//      With --fbx, Blender (scripts/glb-to-fbx.py) also writes FBX copies in Assets/modelos/fbx.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..')
const OUT = path.join(ROOT, 'Assets', 'modelos')
// ModelExport.jsx sends each model, the island, then the island alone and the events (the Sucursal Fest LAST). (The places that already have their
// real model — lugar_mucic, lugar_biblioteca-centenario… — are not sent: they are not overwritten.)
const LAST = 'evento_sucursal_fest'
const FBX = process.argv.includes('--fbx')
// (the files that are yours — you arranged them: scripts/archivos-tuyos.json —: never overwritten)
const YOURS = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'archivos-tuyos.json'), 'utf8')).files)
const BLENDER = process.env.BLENDER ?? ['C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe', 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Blender\\blender.exe'].find((b) => fs.existsSync(b)) ?? ''
// The whole island is made from YOUR island (isla_para_acomodar.glb) with your original models in it,
// untouched and in quads (scripts/isla-completa.py) — not from what the page draws
const ARRANGED = path.join(OUT, 'isla_para_acomodar.glb')
const WHOLE = 'isla_bulevar-completa'

fs.mkdirSync(OUT, { recursive: true })
let got = 0
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method === 'OPTIONS') return res.end()
    const url = new URL(req.url, 'http://x')
    const name = (url.searchParams.get('name') ?? '').replace(/[^\w.-]/g, '')
    if (req.method !== 'POST' || !name) return res.writeHead(400).end()
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
        const buf = Buffer.concat(chunks)
        if (YOURS.has(name)) console.log('es tuyo, no se toca:', `${name}.glb`)
        else if (name === WHOLE && fs.existsSync(ARRANGED)) console.log(`${name}.glb se arma desde tu isla (al final)`)
        else {
            fs.writeFileSync(path.join(OUT, `${name}.glb`), buf)
            console.log('guardado', `${name}.glb`, `${(buf.length / 1024).toFixed(0)} KB`)
        }
        res.end('ok')
        got++
        if (name !== LAST) return
        fs.copyFileSync(path.join(ROOT, 'public', 'models', 'chonti.glb'), path.join(OUT, 'personaje_chonti.glb'))
        // the flat pieces of the island (lawn, streets, walks) merged into clean triangles: same
        // look, much less mesh (scripts/simplify-glb.py)
        // (not isla_edificios nor isla_terreno when they are yours: the page does not send them)
        if (fs.existsSync(BLENDER)) {
            const isla = [...(fs.existsSync(ARRANGED) ? [] : [WHOLE]), 'isla_para_acomodar', 'isla_sola', 'edificios_para_editar', 'evento_alumbrado', 'evento_sucursal_fest'].filter((n) => !YOURS.has(n)).map((n) => path.join(OUT, `${n}.glb`)).filter((f) => fs.existsSync(f))
            execFileSync(BLENDER, ['-b', '-P', path.join(ROOT, 'scripts', 'simplify-glb.py'), '--', ...isla], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 })
                .toString().split('\n').filter((l) => l.startsWith('simplified')).forEach((l) => console.log(l))
        }
        if (BLENDER && fs.existsSync(ARRANGED)) {
            execFileSync(BLENDER, ['-b', '-P', path.join(ROOT, 'scripts', 'isla-completa.py'), '--', ARRANGED, OUT, path.join(OUT, WHOLE), path.join(OUT, `${WHOLE}.informe.json`)], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 })
                .toString().split('\n').filter((l) => l.startsWith('LISTO')).forEach((l) => console.log(`${WHOLE}: ${l}`))
        }
        if (FBX) execFileSync(BLENDER, ['-b', '-P', path.join(ROOT, 'scripts', 'glb-to-fbx.py'), '--', OUT, path.join(OUT, 'fbx')], { stdio: 'inherit' })
        console.log('✔ GLB listos en', OUT)
        server.close()
    })
})
server.listen(4180, () => console.log('Esperando los modelos en http://localhost:4180/save …'))
