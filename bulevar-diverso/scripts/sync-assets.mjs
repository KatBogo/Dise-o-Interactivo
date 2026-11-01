// Copies the character model from /Assets (where it is exported from Blender) to /public/models,
// which is the folder Next.js serves. Runs automatically before `npm run dev` and `npm run build`.
// The GLB is validated first: an empty or broken export never replaces the last good model.
import fs from 'node:fs'
import path from 'node:path'

// (Chonti: Assets/modelos/CHONTI.glb when it is there — before, Assets/personajechonti.glb)
const SOURCE = [path.resolve('Assets/modelos/CHONTI.glb'), path.resolve('Assets/personajechonti.glb')].find((f) => fs.existsSync(f)) ?? path.resolve('Assets/personajechonti.glb')

// Chonti dressed for each event (Assets/modelos): his accessory is taken from each one, where it sits
// on his head (src/three/chonti/ChontiModel.jsx). Served without accents or spaces in the name.
const OUTFITS = [
    [['chontinavideño.glb', 'chontinavideno.glb'], 'chonti_navideno.glb'],
    [['chontiferiadellibro.glb', 'chontiferiadellibroglb.glb'], 'chonti_feria.glb'],
    [['chontisucursal.glb', 'chontisucursalfest.glb'], 'chonti_sucursal.glb'],
]
for (const [names, out] of OUTFITS) {
    const src = names.map((n) => path.resolve('Assets/modelos', n)).find((f) => fs.existsSync(f))
    const dst = path.resolve('public/models', out)
    if (!src) continue
    try {
        inspect(src)
        if (!fs.existsSync(dst) || !fs.readFileSync(dst).equals(fs.readFileSync(src))) {
            fs.copyFileSync(src, dst)
            console.log(`[assets] Chonti de evento copiado: ${path.relative('.', src)} → models/${out}`)
        }
    } catch (err) {
        console.warn(`[assets] ⚠ ${path.relative('.', src)} NO se usó: ${err.message}`)
    }
}
const TARGET = path.resolve('public/models/chonti.glb')

// Music placed in /Assets: the Alumbrado's Tutaina (any of these names) → public/audio/tutaina.mp3
// (listed in src/content/audio.json). It's an MP3 even when saved as .mpeg.
const TUTAINA = ['tutaina.mp3', 'tutaina.mpeg', 'tutaina.m4a'].map((f) => path.resolve('Assets', f)).find((f) => fs.existsSync(f))
if (TUTAINA) {
    const out = path.resolve('public/audio/tutaina.mp3')
    const same = fs.existsSync(out) && fs.statSync(out).size === fs.statSync(TUTAINA).size
    if (!same) {
        fs.mkdirSync(path.dirname(out), { recursive: true })
        fs.copyFileSync(TUTAINA, out)
    }
    console.log(`[assets] Tutaina ${same ? 'al día' : 'copiada'}: ${path.relative('.', out)}`)
}

// Timeline photos placed in /Assets (or /Assets/timeline): each one replaces the provisional picture
// of its date. It is found by its description ("Vista histórica del Puente Ortiz.jpg", the imageAlt
// of src/content/timeline.json), its number (01…06) or its exact name (01_puente-ortiz.jpg), in any
// image format. Every photo comes out the SAME: a 2 : 1 JPEG of PHOTO_W × PHOTO_H, cropped around
// what matters, resized with Lanczos and sharpened (more when a small photo had to be enlarged).
const PHOTO_W = 1600
const PHOTO_H = 800
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const IMAGE = /\.(jpe?g|png|webp|avif)$/i
const folders = ['Assets/timeline', 'Assets'].map((d) => path.resolve(d)).filter((d) => fs.existsSync(d))
const photos = folders.flatMap((d) => fs.readdirSync(d).filter((f) => IMAGE.test(f)).map((f) => path.join(d, f)))
if (photos.length) {
    const sharp = (await import('sharp')).default
    const items = JSON.parse(fs.readFileSync(path.resolve('src/content/timeline.json'), 'utf8')).items
    const stampFile = path.resolve('node_modules/.cache/bulevar-fotos.json') // what each picture was made from (not published)
    const stamps = fs.existsSync(stampFile) ? JSON.parse(fs.readFileSync(stampFile, 'utf8')) : {}
    const nameOf = (f) => norm(path.basename(f, path.extname(f)))
    for (const [i, item] of items.entries()) {
        if (!item.image) continue
        const base = norm(path.basename(item.image, path.extname(item.image)))
        const num = String(i + 1).padStart(2, '0')
        const alt = item.imageAlt ? norm(item.imageAlt) : null
        const src =
            photos.find((f) => alt && nameOf(f) === alt) ??
            photos.find((f) => nameOf(f) === base) ??
            photos.find((f) => path.dirname(f).endsWith('timeline') && path.basename(f).startsWith(num))
        if (!src) continue
        const out = path.resolve('public', item.image)
        const st = fs.statSync(src)
        const stamp = `${path.basename(src)}|${st.size}|${st.mtimeMs}|${PHOTO_W}x${PHOTO_H}`
        if (stamps[item.image] === stamp && fs.existsSync(out)) {
            console.log(`[assets] Foto ${item.year} al día: ${path.basename(src)}`)
            continue
        }
        const meta = await sharp(src).metadata()
        const scale = Math.max(PHOTO_W / meta.width, PHOTO_H / meta.height) // > 1: it had to be enlarged
        await sharp(src)
            .rotate() // phone photos: respect their orientation
            .resize(PHOTO_W, PHOTO_H, { fit: 'cover', position: sharp.strategy.attention, kernel: 'lanczos3' })
            .sharpen({ sigma: scale > 1.6 ? 1.1 : scale > 1 ? 0.8 : 0.5, m1: 0.6, m2: 2.2 })
            .modulate({ saturation: 1.04 })
            .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
            .toFile(out)
        stamps[item.image] = stamp
        console.log(`[assets] Foto ${item.year} lista: ${path.basename(src)} (${meta.width}×${meta.height}) → ${path.relative('.', out)} (${PHOTO_W}×${PHOTO_H})`)
    }
    fs.mkdirSync(path.dirname(stampFile), { recursive: true })
    fs.writeFileSync(stampFile, JSON.stringify(stamps, null, 2))
}

// Models placed in /Assets/modelos: the places that src/content/places.json uses ("model":
// "/models/lugar_mucic.glb") and the events (evento_*.glb) are prepared for the page with Blender
// (scripts/prepare-place-model.py): the first time they are made light, get their real colours
// (scripts/place-colors.json) and, an event, its layout on the island; the prepared model replaces
// yours in Assets/modelos (yours is kept in Assets/modelos/originales) so you edit THAT one. From
// then on, every time you save it, it is copied to the page as you left it.
// Without Blender they are copied as they are.
const DECOR = /^(mio_|carros|asientos_|arbol|postes|semaforo|edificio_|banco_|boulevard_|decoracion_|poste_estrella|tira_luces|sillas_|iglesia_|palmera|subway|kiosko|ruta_).*\.glb$/i
const BLENDER = ['C:/Program Files (x86)/Steam/steamapps/common/Blender/blender.exe', 'C:/Program Files/Blender Foundation/Blender 4.5/blender.exe', 'C:/Program Files/Blender Foundation/Blender 4.2/blender.exe', '/Applications/Blender.app/Contents/MacOS/Blender', '/usr/bin/blender'].find((f) => fs.existsSync(f))
{
    const { execFileSync } = await import('node:child_process')
    const places = JSON.parse(fs.readFileSync(path.resolve('src/content/places.json'), 'utf8')).items
    const MODELS = path.resolve('Assets/modelos')
    const list = [
        ...places.filter((p) => p.model && /\.glb$/i.test(p.model)).map((p) => ({ name: p.name, file: path.basename(p.model) })),
        ...(fs.existsSync(MODELS) ? fs.readdirSync(MODELS).filter((f) => /^evento_.+\.glb$/i.test(f) && !/^evento_(alumbrado|sucursal_fest)\.glb$/i.test(f)) /* (those two are exported FOR you to arrange: the page makes them itself) */.map((f) => ({ name: f.replace(/\.glb$/i, ''), file: f })) : []),
        // the pieces the island repeats (the MIO bus, the cars, the furniture of the Bulevar, the trees,
        // the street lamps, the traffic lights, the generic buildings) and its landmark buildings
        ...(fs.existsSync(MODELS) ? fs.readdirSync(MODELS).filter((f) => DECOR.test(f)).map((f) => ({ name: f.replace(/\.glb$/i, ''), file: f })) : []),
    ]
    const stampFile = path.resolve('node_modules/.cache/bulevar-modelos.json') // what each one was made from
    const stamps = fs.existsSync(stampFile) ? JSON.parse(fs.readFileSync(stampFile, 'utf8')) : {}
    const stampOf = (f) => {
        const s = fs.statSync(f)
        return `${s.size}|${Math.round(s.mtimeMs)}`
    }
    for (const { name, file } of list) {
        const src = path.join(MODELS, file)
        const out = path.resolve('public/models', file)
        if (!fs.existsSync(src)) continue
        if (fs.existsSync(out) && stamps[file] === stampOf(src)) {
            console.log(`[assets] Modelo ${name} al día`)
            continue
        }
        fs.mkdirSync(path.dirname(out), { recursive: true })
        if (BLENDER) {
            execFileSync(BLENDER, ['-b', '-P', path.resolve('scripts/prepare-place-model.py'), '--', src, out], { stdio: 'ignore' })
            console.log(`[assets] Modelo ${name} listo: ${path.relative('.', out)}`)
        } else {
            fs.copyFileSync(src, out)
            console.warn(`[assets] Modelo ${name} copiado tal cual (no se encontró Blender): ${path.relative('.', out)}`)
        }
        stamps[file] = stampOf(src) // (after: the first time the prepared model replaces yours)
    }
    // Your buildings, as you arranged them (Assets/modelos/isla_edificios.glb): the page puts them
    // where you left them, as big as you left them (scripts/edificios-layout.py → public/models and
    // src/content/edificios.json, with where each place / landmark / route house was before —
    // scripts/edificios-origen.json —, so it moves, turns and scales like you did)
    // Your whole island as you arranged it (Assets/modelos/isla_para_acomodar.glb): the page uses it as
    // it is — split in its ground (with its trees, lamps, benches…) and its buildings
    // (scripts/isla-acomodada.py), then made light for the page without changing its shapes
    // (scripts/terreno-layout.py --tal-cual, scripts/edificios-layout.py). Where each place, landmark
    // and route house was when it was exported: scripts/edificios-origen-acomodada.json.
    // (the island the page shows: isla_bulevar-completa.glb — your island with your original models in
    // it, untouched: scripts/isla-completa.py — or, without it, your isla_para_acomodar.glb)
    const WHOLE = path.join(MODELS, 'isla_bulevar-completa.glb')
    const ARRANGED = fs.existsSync(WHOLE) ? WHOLE : path.join(MODELS, 'isla_para_acomodar.glb')
    const arranged = fs.existsSync(ARRANGED) && fs.existsSync(path.resolve('scripts/edificios-origen-acomodada.json'))
    if (arranged && BLENDER) {
        const cache = path.resolve('node_modules/.cache/isla_acomodada')
        const terrain = path.resolve('public/models/isla_terreno.glb'), buildings = path.resolve('public/models/isla_edificios.glb')
        const tjson = path.resolve('src/content/terreno.json'), bjson = path.resolve('src/content/edificios.json')
        if (stamps['isla_para_acomodar.glb'] !== `${path.basename(ARRANGED)}|${stampOf(ARRANGED)}` || ![terrain, buildings, tjson, bjson].every((f) => fs.existsSync(f))) {
            fs.mkdirSync(cache, { recursive: true })
            execFileSync(BLENDER, ['-b', '-P', path.resolve('scripts/isla-acomodada.py'), '--', ARRANGED, path.join(cache, 'terreno.glb'), path.join(cache, 'edificios.glb')], { stdio: 'ignore' })
            execFileSync(BLENDER, ['-b', '-P', path.resolve('scripts/terreno-layout.py'), '--', path.join(cache, 'terreno.glb'), terrain, tjson, '--tal-cual'], { stdio: 'ignore' })
            execFileSync(BLENDER, ['-b', '-P', path.resolve('scripts/edificios-layout.py'), '--', path.join(cache, 'edificios.glb'), buildings, bjson], { stdio: 'ignore' })
            const layout = JSON.parse(fs.readFileSync(bjson, 'utf8'))
            const { feet } = JSON.parse(fs.readFileSync(path.resolve('scripts/edificios-origen-acomodada.json'), 'utf8'))
            for (const it of layout.items) if (feet[it.name]) it.foot = feet[it.name]
            fs.writeFileSync(bjson, JSON.stringify(layout, null, 1) + '\n')
            stamps['isla_para_acomodar.glb'] = `${path.basename(ARRANGED)}|${stampOf(ARRANGED)}`
            console.log(`[assets] Tu isla (${path.basename(ARRANGED)}) lista: ${layout.items.length} edificios y su terreno (public/models/isla_terreno.glb, isla_edificios.glb)`)
        } else console.log('[assets] Tu isla acomodada al día')
    }
    // Your whole island (Assets/modelos/isla_bulevar-completa.glb): the page draws it AS IT IS — copied
    // byte for byte, nothing of it changed (Island.jsx · WholeIsland)
    {
        const src = path.join(MODELS, 'isla_bulevar-completa.glb'), out = path.resolve('public/models/isla_bulevar-completa.glb')
        if (fs.existsSync(src) && (!fs.existsSync(out) || fs.statSync(out).size !== fs.statSync(src).size || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs)) {
            fs.copyFileSync(src, out)
            console.log('[assets] Tu isla completa, tal cual: public/models/isla_bulevar-completa.glb')
        }
    }
    // Your Alumbrado as you arranged it (Assets/modelos/evento_alumbrado.glb): where you left its
    // Christmas trees, stars, star posts and strings (scripts/alumbrado-layout.py → alumbrado.json)
    {
        const src = path.join(MODELS, 'evento_alumbrado.glb')
        const json = path.resolve('src/content/alumbrado.json')
        if (fs.existsSync(src) && BLENDER && (stamps['evento_alumbrado.glb'] !== stampOf(src) || !fs.existsSync(json))) {
            execFileSync(BLENDER, ['-b', '-P', path.resolve('scripts/alumbrado-layout.py'), '--', src, json, path.resolve('public/models/alumbrado_estrellas.glb')], { stdio: 'ignore' })
            stamps['evento_alumbrado.glb'] = stampOf(src)
            console.log('[assets] Tu Alumbrado listo (src/content/alumbrado.json)')
        } else if (fs.existsSync(json)) console.log('[assets] Tu Alumbrado al día')
    }
    // Your stage for the Sucursal Fest (Assets/modelos/escenario.glb) and the people dancing in front
    // of it (Assets/modelos/persona.glb): as they are
    for (const name of ['escenario', 'monitos', 'persona']) {
        const src = path.join(MODELS, `${name}.glb`), out = path.resolve(`public/models/${name}.glb`)
        if (fs.existsSync(src) && (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs)) {
            fs.copyFileSync(src, out)
            console.log(`[assets] Tu ${name} listo: public/models/${name}.glb`)
        }
    }
    {
        const src = path.join(MODELS, 'isla_edificios.glb')
        const out = path.resolve('public/models/isla_edificios.glb')
        const json = path.resolve('src/content/edificios.json')
        if (!arranged && fs.existsSync(src) && BLENDER && (stamps['isla_edificios.glb'] !== stampOf(src) || !fs.existsSync(out) || !fs.existsSync(json))) {
            try {
                execFileSync(BLENDER, ['-b', '-P', path.resolve('scripts/edificios-layout.py'), '--', src, out, json], { stdio: 'ignore' })
                const layout = JSON.parse(fs.readFileSync(json, 'utf8'))
                const { feet } = JSON.parse(fs.readFileSync(path.resolve('scripts/edificios-origen.json'), 'utf8'))
                for (const it of layout.items) if (feet[it.name]) it.foot = feet[it.name]
                fs.writeFileSync(json, JSON.stringify(layout, null, 1) + '\n')
                console.log(`[assets] Tus edificios listos: ${layout.items.length} (public/models/isla_edificios.glb)`)
            } catch {
                // (saved without its meshes — only the empties: the page keeps your last buildings)
                console.warn('[assets] isla_edificios.glb no trae mallas (solo los puntos de origen): se quedan tus edificios anteriores')
            }
            stamps['isla_edificios.glb'] = stampOf(src)
        } else if (!arranged && fs.existsSync(json)) console.log('[assets] Tus edificios al día')
    }
    // The fronts of the Feria's tents (Assets/feria del libro-01…04.png): each tent wears one
    {
        const dir = path.resolve('public/textures')
        fs.mkdirSync(dir, { recursive: true })
        const fronts = fs.existsSync(path.resolve('Assets')) ? fs.readdirSync(path.resolve('Assets')).filter((f) => /^feria del libro-\d+\.png$/i.test(f)).sort() : []
        fronts.forEach((f, i) => fs.copyFileSync(path.resolve('Assets', f), path.join(dir, `feria_frente_${i + 1}.png`)))
        const list = path.resolve('src/content/feria-frentes.json')
        const text = JSON.stringify({ _info: 'Escrito por scripts/sync-assets.mjs: las imágenes del frente de las carpas de la Feria (Assets/feria del libro-NN.png).', fronts: fronts.map((_, i) => `textures/feria_frente_${i + 1}.png`) }, null, 2) + '\n'
        if (!fs.existsSync(list) || fs.readFileSync(list, 'utf8') !== text) fs.writeFileSync(list, text)
    }
    // Your terrain (Assets/modelos/isla_terreno.glb, as you made it): the page draws its ground as it
    // is — what moves or lights up (the water, the trees, the lamps, the furniture…) it draws itself
    // (scripts/terreno-layout.py → public/models/isla_terreno.glb and src/content/terreno.json)
    {
        const src = path.join(MODELS, 'isla_terreno.glb')
        const out = path.resolve('public/models/isla_terreno.glb')
        const json = path.resolve('src/content/terreno.json')
        if (!arranged && fs.existsSync(src) && BLENDER && (stamps['isla_terreno.glb'] !== stampOf(src) || !fs.existsSync(out) || !fs.existsSync(json))) {
            execFileSync(BLENDER, ['-b', '-P', path.resolve('scripts/terreno-layout.py'), '--', src, out, json], { stdio: 'ignore' })
            stamps['isla_terreno.glb'] = stampOf(src)
            const t = JSON.parse(fs.readFileSync(json, 'utf8'))
            console.log(`[assets] Tu terreno listo: ${t.items.length} piezas (public/models/isla_terreno.glb)`)
        } else if (!arranged && fs.existsSync(json)) console.log('[assets] Tu terreno al día')
    }
    fs.mkdirSync(path.dirname(stampFile), { recursive: true })
    fs.writeFileSync(stampFile, JSON.stringify(stamps, null, 2))
    // which models the page has (a landmark of island.json shows up once its file is there)
    const have = fs.readdirSync(path.resolve('public/models')).filter((f) => /\.glb$/i.test(f)).map((f) => f.replace(/\.glb$/i, '')).sort()
    const listFile = path.resolve('src/content/modelos.json')
    const text = JSON.stringify({ _info: 'Escrito por scripts/sync-assets.mjs: los modelos que hay en public/models.', models: have }, null, 2) + '\n'
    if (!fs.existsSync(listFile) || fs.readFileSync(listFile, 'utf8') !== text) fs.writeFileSync(listFile, text)
}

// The page's design made in the editor (?editar → Exportar → design.json): put it in
// Assets/diseno.json and it is published (copied to src/content/design.json)
{
    const src = path.resolve('Assets/diseno.json')
    const out = path.resolve('src/content/design.json')
    if (fs.existsSync(src)) {
        try {
            const d = JSON.parse(fs.readFileSync(src, 'utf8'))
            const text = JSON.stringify({ tokens: d.tokens ?? {}, rules: d.rules ?? {}, texts: d.texts ?? {} }, null, 2) + '\n'
            if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== text) {
                fs.writeFileSync(out, text)
                console.log('[assets] Diseño publicado desde Assets/diseno.json')
            } else console.log('[assets] Diseño al día')
        } catch (e) {
            console.warn(`[assets] ⚠ Assets/diseno.json no es válido: ${e.message}`)
        }
    }
}

// The classic island (Assets/modelos/isla_clasica): its own Feria layout, served from models/clasica
// so src/content/island.json can switch back to it ("variant": "clasica")
{
    const src = path.resolve('Assets/modelos/isla_clasica/evento_feria_del_libro.glb')
    const out = path.resolve('public/models/clasica/evento_feria_del_libro.glb')
    if (fs.existsSync(src) && (!fs.existsSync(out) || fs.statSync(out).size !== fs.statSync(src).size)) {
        fs.mkdirSync(path.dirname(out), { recursive: true })
        fs.copyFileSync(src, out)
        console.log('[assets] Isla clásica: feria copiada')
    }
}

function inspect(file) {
    const b = fs.readFileSync(file)
    if (b.toString('ascii', 0, 4) !== 'glTF') throw new Error('no es un archivo .glb')
    const json = JSON.parse(b.toString('utf8', 20, 20 + b.readUInt32LE(12)))
    const meshes = json.meshes?.length ?? 0
    const nodes = json.nodes?.length ?? 0
    if (!meshes || !nodes) throw new Error('la escena exportada está vacía (sin objetos ni mallas)')
    return { meshes, nodes, skins: json.skins?.length ?? 0, kb: Math.round(b.length / 1024) }
}

if (!fs.existsSync(SOURCE)) {
    console.log(`[assets] No hay ${path.relative('.', SOURCE)}; se usa el modelo actual.`)
    process.exit(0)
}

try {
    const info = inspect(SOURCE)
    const same = fs.existsSync(TARGET) && fs.readFileSync(TARGET).equals(fs.readFileSync(SOURCE))
    if (!same) {
        fs.mkdirSync(path.dirname(TARGET), { recursive: true })
        fs.copyFileSync(SOURCE, TARGET)
    }
    console.log(`[assets] Chonti ${same ? 'al día' : 'actualizado'}: ${info.nodes} nodos, ${info.meshes} mallas, ${info.skins} esqueleto(s), ${info.kb} KB`)
} catch (err) {
    console.warn(`\n[assets] ⚠ ${path.relative('.', SOURCE)} NO se usó: ${err.message}.`)
    console.warn('[assets]   En Blender: File → Export → glTF 2.0 (.glb), desmarcá "Limit to: Selected Objects"')
    console.warn('[assets]   (o seleccioná a Chonti y su Armature), y en Data → Mesh marcá "Apply Modifiers".')
    console.warn(`[assets]   Se sigue usando el último modelo válido: ${path.relative('.', TARGET)}\n`)
}
