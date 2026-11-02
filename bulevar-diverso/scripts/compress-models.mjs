/**
 * Makes the .glb models of a folder lighter for the web, WITHOUT changing them: their vertex and
 * index data is packed with meshoptimizer (glTF extension EXT_meshopt_compression, lossless mode —
 * no quantization: every vertex keeps its exact value). The page opens them as they are: useGLTF
 * brings the meshopt decoder with it (nothing downloaded from elsewhere).
 * Every packed piece is unpacked again here and compared byte by byte with the original: if one
 * differs, that model is left untouched.
 *
 *   node scripts/compress-models.mjs <folder> [min KB]
 *
 * (meshoptimizer comes with the project's 3D libraries — node_modules/meshoptimizer)
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { MeshoptEncoder } from 'meshoptimizer/encoder'
import { MeshoptDecoder } from 'meshoptimizer/decoder'

const EXT = 'EXT_meshopt_compression'
const SIZE = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 }
const COMPS = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 }
const pad4 = (n) => (n + 3) & ~3

function readGlb(buf) {
    if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error('no es un GLB')
    let at = 12, json = null, bin = null
    while (at < buf.length) {
        const len = buf.readUInt32LE(at), type = buf.readUInt32LE(at + 4)
        const data = buf.subarray(at + 8, at + 8 + len)
        if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8'))
        else if (type === 0x004e4942) bin = data
        at += 8 + len
    }
    return { json, bin }
}
function writeGlb(json, bin) {
    const text = Buffer.from(JSON.stringify(json), 'utf8')
    const jsonLen = pad4(text.length), binLen = pad4(bin.length)
    const out = Buffer.alloc(12 + 8 + jsonLen + 8 + binLen)
    out.writeUInt32LE(0x46546c67, 0), out.writeUInt32LE(2, 4), out.writeUInt32LE(out.length, 8)
    out.writeUInt32LE(jsonLen, 12), out.writeUInt32LE(0x4e4f534a, 16)
    out.fill(0x20, 20, 20 + jsonLen), text.copy(out, 20)
    const b = 20 + jsonLen
    out.writeUInt32LE(binLen, b), out.writeUInt32LE(0x004e4942, b + 4)
    bin.copy(out, b + 8)
    return out
}

/** What each bufferView holds, when it can be packed: [mode, count, element size]. */
function packable(json) {
    const users = new Map() // bufferView → [{ accessor, role }]
    const use = (i, role) => {
        const a = json.accessors[i]
        if (a?.bufferView === undefined) return
        if (!users.has(a.bufferView)) users.set(a.bufferView, [])
        users.get(a.bufferView).push({ a, role })
    }
    for (const m of json.meshes ?? [])
        for (const p of m.primitives) {
            for (const i of Object.values(p.attributes)) use(i, 'attr')
            for (const t of p.targets ?? []) for (const i of Object.values(t)) use(i, 'attr')
            if (p.indices !== undefined) use(p.indices, (p.mode ?? 4) === 4 ? 'tri' : 'idx')
        }
    const plan = new Map()
    for (const [v, list] of users) {
        const view = json.bufferViews[v]
        // (only a view that holds exactly one accessor, from its start, tightly packed, and not sparse)
        const shared = new Set(list.map((u) => u.a)).size > 1
        const { a, role } = list[0]
        if (shared || a.sparse || (a.byteOffset ?? 0) !== 0 || list.some((u) => u.role !== role)) continue
        const size = SIZE[a.componentType] * COMPS[a.type]
        if (view.byteStride && view.byteStride !== size) continue
        if (role === 'attr') {
            if (size % 4 || size > 256 || a.count * size !== view.byteLength) continue
            plan.set(v, ['ATTRIBUTES', a.count, size])
        } else {
            if ((size !== 2 && size !== 4) || a.count * size !== view.byteLength) continue
            if (role === 'tri' && a.count % 3) continue
            plan.set(v, [role === 'tri' ? 'TRIANGLES' : 'INDICES', a.count, size])
        }
    }
    return plan
}

/**
 * The unpacked data is the original: byte by byte — except that the triangle codec may start a
 * triangle at another of its corners (a b c → b c a): the same triangle, facing the same way.
 */
function same(back, raw, mode, size) {
    if (mode !== 'TRIANGLES') return Buffer.from(back).equals(raw)
    const T = size === 2 ? Uint16Array : Uint32Array
    const a = new T(back.buffer, back.byteOffset, back.length / size)
    const b = new T(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length))
    for (let i = 0; i < a.length; i += 3) {
        const [x, y, z] = [b[i], b[i + 1], b[i + 2]]
        const ok = (a[i] === x && a[i + 1] === y && a[i + 2] === z) || (a[i] === y && a[i + 1] === z && a[i + 2] === x) || (a[i] === z && a[i + 1] === x && a[i + 2] === y)
        if (!ok) return false
    }
    return true
}

async function compress(file) {
    const { json, bin } = readGlb(fs.readFileSync(file))
    if (!bin || json.buffers?.length !== 1 || json.extensionsUsed?.includes(EXT)) return null
    const plan = packable(json)
    if (!plan.size) return null
    const parts = []
    let main = 0, fallback = 0
    json.bufferViews.forEach((view, v) => {
        const raw = bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength)
        const how = plan.get(v)
        if (!how) {
            parts.push({ data: raw, at: main })
            view.buffer = 0
            view.byteOffset = main
            main = pad4(main + raw.length)
            return
        }
        const [mode, count, size] = how
        const packed = MeshoptEncoder.encodeGltfBuffer(new Uint8Array(raw), count, size, mode)
        // (unpacked again: exactly the original, or the model stays as it was)
        const back = new Uint8Array(count * size)
        MeshoptDecoder.decodeGltfBuffer(back, count, size, packed, mode)
        if (!same(back, raw, mode, size)) throw new Error(`la vista ${v} no vuelve igual`)
        parts.push({ data: Buffer.from(packed), at: main })
        view.extensions = { ...view.extensions, [EXT]: { buffer: 0, byteOffset: main, byteLength: packed.length, byteStride: size, count, mode } }
        main = pad4(main + packed.length)
        view.buffer = 1
        view.byteOffset = fallback
        fallback = pad4(fallback + view.byteLength)
    })
    const out = Buffer.alloc(main)
    for (const p of parts) p.data.copy(out, p.at)
    json.buffers = [{ byteLength: main }, { byteLength: fallback, extensions: { [EXT]: { fallback: true } } }]
    json.extensionsUsed = [...new Set([...(json.extensionsUsed ?? []), EXT])]
    json.extensionsRequired = [...new Set([...(json.extensionsRequired ?? []), EXT])]
    return writeGlb(json, out)
}

const dir = process.argv[2]
const minKB = Number(process.argv[3] ?? 100)
if (!dir) {
    console.error('uso: node scripts/compress-models.mjs <carpeta> [KB mínimos]')
    process.exit(1)
}
await MeshoptEncoder.ready
await MeshoptDecoder.ready
let before = 0, after = 0
for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.glb'))) {
    const file = path.join(dir, name)
    const size = fs.statSync(file).size
    if (size < minKB * 1024) continue
    try {
        const out = await compress(file)
        // (only when it travels lighter: GitHub Pages sends every file gzipped, and gzip alone
        // already squeezes some models — the whole island — better than packed + gzip)
        if (!out || zlib.gzipSync(out).length >= zlib.gzipSync(fs.readFileSync(file)).length) continue
        fs.writeFileSync(file, out)
        before += size, after += out.length
        console.log(`[modelos] ${name}: ${(size / 1048576).toFixed(1)} MB → ${(out.length / 1048576).toFixed(1)} MB`)
    } catch (err) {
        console.warn(`[modelos] ⚠ ${name} se deja como estaba: ${err.message}`)
    }
}
console.log(`[modelos] total: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`)
