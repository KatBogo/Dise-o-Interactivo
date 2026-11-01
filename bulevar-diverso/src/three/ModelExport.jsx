import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { BibliotecaModel, FoodStallModel, GatoModel, MonumentModel, MucicModel, TentModel, TertuliaModel } from './places/PlaceModels.jsx'
import Island, { PuenteOrtizModel, USER_TERRAIN } from './island/Island.jsx'
import { ALL_STOPS, PLACES, USER_BUILDINGS } from '../data/content.js'
import Places from './places/Places.jsx'
import { StopBuildings } from './routes/RouteLayer.jsx'
import { AlumbradoDecor, EventRoot, SucursalDecor } from './events/EventDecor.jsx'

/**
 * Dev-only: /?export&to=<url> — builds every model of the island and sends each one as a .glb to
 * <url> (scripts/export-models.mjs, a little local receiver that saves them in Assets/modelos):
 *  - the WHOLE island (terrain, river and waterfall, streets, every building, trees, lamps, the
 *    places, the route buildings, the landmarks): isla_bulevar-completa.glb
 *  - each replaceable model on its own (same origin, scale and orientation as on the island: base
 *    at y = 0, front towards +Z)
 */
// (a place that already has its REAL model — "model" in places.json, e.g. lugar_mucic.glb — is not
// exported again: its placeholder would overwrite the real model in Assets/modelos)
const REAL = new Set([...PLACES, ...ALL_STOPS].filter((p) => p.model).map((p) => p.model.split('/').pop().replace(/\.\w+$/, ''))) // (and the route houses that are yours)
export const EXPORTS = [
    ['lugar_mucic', MucicModel],
    ['lugar_gato-de-tejada', GatoModel],
    ['lugar_biblioteca-centenario', BibliotecaModel],
    ['lugar_museo-la-tertulia', TertuliaModel],
    ['ruta_gastronomia_fonda', FoodStallModel],
    ['ruta_cultura_casa-cultural', MonumentModel],
    ['ruta_taller', TentModel],
    ['hito_puente-ortiz', PuenteOrtizModel],
].filter(([name]) => !REAL.has(name))
export const ISLAND_FILE = 'isla_bulevar-completa'
const ARRANGE_FILE = 'isla_para_acomodar'

// isla_para_acomodar.glb: the pieces of the whole island in one group per kind (the first that fits)
const KINDS = [
    ['arboles', /^(arboles|palmeras)/],
    ['postes_y_semaforos', /^(postes|semaforos)/],
    ['bancas_y_muebles', /^(bancas|bulevar_bancas|bulevar_asientos|bulevar_sillas|bulevar_jardineras|jardineras|flores)/],
    ['lugares_e_hitos', /^(lugar_|hito_)/],
    ['casas_de_las_rutas', /^ruta_/],
    ['edificios', /^(edificios_|techos_|balcones|tanques_de_agua|aires_acondicionados|lotes)/],
    ['calles', /^(calle|cebras|lineas_de_calle|Plane)/],
    ['andenes_y_bulevar', /^(anden|bulevar_|ciclorruta|retreta_caminos|suelo_gato|cuadras)/],
    ['puentes', /^(pasarela|puente|Cubo\d|Plano\d)/], // (Cubo… / Plano…: your Puente Ortiz)
    ['tunel', /^tunel/],
    ['rio', /^rio_/],
]
function byKind(whole) {
    const out = new THREE.Group()
    out.name = ARRANGE_FILE
    const groups = new Map()
    const groupOf = (name) => {
        if (!groups.has(name)) {
            const g = new THREE.Group()
            g.name = name
            groups.set(name, g)
            out.add(g)
        }
        return groups.get(name)
    }
    for (const m of whole.children) groupOf(KINDS.find(([, re]) => re.test(m.name))?.[0] ?? 'terreno').add(m.clone())
    return out
}

// what goes in isla_edificios.glb (everything else is the terrain)
const BUILDING = /^(edificios_|techos_|balcones|tanques_de_agua|aires_acondicionados|lotes|lugar_|ruta_|parada_|hito_la-ermita|hito_banco|hito_boulevard|hito_subway)/
// what is ON the terrain (left out of isla_sola.glb: the island alone — its ground, river, streets,
// walks, tunnel and bridges)
const ON_GROUND = /^(arboles|palmeras|postes|semaforos|bancas|bulevar_bancas|bulevar_asientos|bulevar_jardineras|jardineras|flores)/
// what is UNDER the surface of the island (the cliff and its hanging rocks)
const UNDER = /^isla_(acantilado|rocas_colgantes)/

const hex = (c) => c.getHexString()
const materialCache = new Map()
/** The material of one colour of an instanced group (instance colour × material colour). */
function tinted(material, color) {
    if (!color) return material
    const key = material.uuid + hex(color)
    if (!materialCache.has(key)) {
        const m = material.clone()
        m.color = material.color.clone().multiply(color)
        m.name = `color_${hex(m.color)}`
        materialCache.set(key, m)
    }
    return materialCache.get(key)
}
/** Shader-only things become a plain standard material (or are left out: markers, lines…). */
function exportable(o) {
    if (o.userData.exportAs) {
        const { color, opacity } = o.userData.exportAs
        return new THREE.MeshStandardMaterial({ name: `${o.name}_material`, color, transparent: opacity < 1, opacity, side: THREE.DoubleSide, roughness: 0.2 })
    }
    const m = o.material
    if (!m || Array.isArray(m) || m.isShaderMaterial || m.isLineMaterial || m.isPointsMaterial || m.isSpriteMaterial) return null
    if (!m.name) m.name = `color_${hex(m.color ?? new THREE.Color('#ffffff'))}`
    return m
}

/**
 * A geometry ready for Blender: only what it needs, and its corners WELDED — the page draws every
 * triangle on its own (for the clay look), and in Blender each shape came in open, as loose
 * triangles. (Without its normals: Blender makes them, so the welded shape stays closed.)
 */
function welded(geometry, material) {
    const g = geometry.clone()
    // (its texture coordinates only if it has a texture: otherwise they split it at every side)
    for (const key of Object.keys(g.attributes)) if (!(key === 'position' || (key === 'uv' && material.map) || (key === 'color' && material.vertexColors))) g.deleteAttribute(key)
    return mergeVertices(g, 1e-4)
}
/** Meshes (in world coordinates) as ONE object you can move: its origin at its foot, where it stands. */
function pieceAtFoot(key, meshes) {
    const box = new THREE.Box3()
    meshes.forEach((m) => (m.geometry.computeBoundingBox(), box.union(m.geometry.boundingBox)))
    const foot = new THREE.Vector3((box.min.x + box.max.x) / 2, box.min.y, (box.min.z + box.max.z) / 2)
    const g = new THREE.Group()
    g.name = key
    g.position.copy(foot)
    meshes.forEach((m, i) => {
        m.geometry.translate(-foot.x, -foot.y, -foot.z)
        m.name = meshes.length > 1 ? `${key}_${String(i + 1).padStart(2, '0')}` : `${key}_malla`
        g.add(m)
    })
    return g
}
// the repeated things that come ONE BY ONE (each tree, lamp, bench, building… its own object, with
// all its parts together); the rest of what repeats (zebras, lines, railing…) one mesh per colour
const PER_PIECE = /^(arboles|palmeras|postes_de_luz|semaforos|bulevar_bancas_rio|bulevar_asientos_centro|bancas|bulevar_jardineras|jardineras|flores|edificios_|techos_|tanques_de_agua|aires_acondicionados|balcones)/
const pad = (i, n = 3) => String(i).padStart(n, '0')

/**
 * A copy of the scene that Blender reads well: world transforms baked into the meshes, every
 * InstancedMesh turned into real meshes; each place, landmark, route building, tree, lamp, bench and
 * building is one object (origin at its foot) — the rest, one mesh per colour.
 */
function bake(root, name) {
    root.updateMatrixWorld(true)
    const out = new THREE.Group()
    out.name = name
    const local = new THREE.Matrix4()
    const world = new THREE.Matrix4()
    const color = new THREE.Color()
    const pieces = new Map() // key → [meshes]
    const add = (key, mesh) => pieces.set(key, [...(pieces.get(key) ?? []), mesh])
    // the place / landmark / route building a mesh belongs to (all its meshes: one object)
    const owner = (o) => {
        for (let p = o; p && p !== root; p = p.parent) {
            if (/^(lugar_|ruta_|hito_)/.test(p.name)) return p.name
            if (p !== o && p.parent?.name === 'edificios_de_la_isla') return p.name // (one of your buildings)
        }
        return null
    }
    // the name of the nearest named object above
    const named = (o) => {
        for (let p = o; p && p !== root; p = p.parent) if (p.name) return p.name
        return name
    }
    let n = 0
    root.traverse((o) => {
        if (!o.isMesh) return
        let hidden = false
        for (let p = o; p; p = p.parent) if (!p.visible) hidden = true
        if (hidden) return
        if (/^vehiculos_/.test(o.name)) return // (the traffic moves: the cars and the bus are their own files, carros.glb and mio_verde.glb)
        const material = exportable(o)
        if (!material) return
        const base = welded(o.geometry, material)
        if (!o.isInstancedMesh) {
            const mesh = new THREE.Mesh(base.applyMatrix4(o.matrixWorld), material)
            const own = owner(o)
            if (own) return add(own, mesh)
            mesh.name = `${named(o)}_${pad(++n)}`
            out.add(mesh)
            return
        }
        const one = PER_PIECE.test(o.name)
        const kind = o.name.replace(/_\d\d$/, '') // (the parts of one model: arboles_arbol2_01, _02… → arboles_arbol2)
        const groups = new Map() // colour → geometries
        for (let i = 0; i < o.count; i++) {
            o.getMatrixAt(i, local)
            world.multiplyMatrices(o.matrixWorld, local)
            const g = base.clone().applyMatrix4(world)
            const c = o.instanceColor ? (o.getColorAt(i, color), color.clone()) : null
            if (one) {
                add(`${kind}_${pad(i + 1)}`, new THREE.Mesh(g, tinted(material, c)))
                continue
            }
            const key = c ? hex(c) : '-'
            if (!groups.has(key)) groups.set(key, { c, list: [] })
            groups.get(key).list.push(g)
        }
        let k = 0
        for (const { c, list } of groups.values()) {
            const mesh = new THREE.Mesh(mergeGeometries(list), tinted(material, c))
            mesh.name = groups.size > 1 ? `${named(o)}_${pad(++k, 2)}` : named(o)
            out.add(mesh)
        }
    })
    for (const [key, meshes] of pieces) out.add(pieceAtFoot(key, meshes))
    return out
}

/**
 * An event as pieces you can move in Blender: every piece (a Christmas tree, an arch of stars, a
 * stage…) is ONE object, its origin at its foot, where it stands on the island. Which piece a mesh
 * belongs to: the instance's key (userData.keys) or the nearest named group above it.
 */
function bakeEvent(root, name) {
    root.updateMatrixWorld(true)
    const pieces = new Map() // key → [mesh in world coordinates]
    const local = new THREE.Matrix4(), world = new THREE.Matrix4(), color = new THREE.Color()
    const keyOf = (o) => {
        for (let p = o; p && p !== root; p = p.parent) if (p.name && !/^(confeti)$/.test(p.name)) return p.name
        return 'resto'
    }
    const add = (key, mesh) => pieces.set(key, [...(pieces.get(key) ?? []), mesh])
    root.traverse((o) => {
        if (!o.isMesh || o.name === 'confeti') return
        for (let p = o; p; p = p.parent) if (!p.visible) return
        const material = exportable(o)
        // (nor the beams of light of the stages: in Blender they are solid sticks)
        if (!material || material.blending === THREE.AdditiveBlending) return
        const base = welded(o.geometry, material)
        if (!o.isInstancedMesh) return add(keyOf(o), new THREE.Mesh(base.applyMatrix4(o.matrixWorld), material))
        // (instances of one piece and one colour: one mesh)
        const groups = new Map()
        for (let i = 0; i < o.count; i++) {
            o.getMatrixAt(i, local)
            world.multiplyMatrices(o.matrixWorld, local)
            const c = o.instanceColor ? (o.getColorAt(i, color), color.clone()) : null
            const key = `${o.userData.keys?.[i] ?? keyOf(o)}|${c ? hex(c) : '-'}`
            if (!groups.has(key)) groups.set(key, { c, list: [] })
            groups.get(key).list.push(base.clone().applyMatrix4(world))
        }
        for (const [key, { c, list }] of groups) add(key.split('|')[0], new THREE.Mesh(mergeGeometries(list), tinted(material, c)))
    })
    const out = new THREE.Group()
    out.name = name
    for (const [key, meshes] of [...pieces].sort(([a], [b]) => a.localeCompare(b))) out.add(pieceAtFoot(key, meshes))
    return out
}
// the events made on the page (the Feria del Libro is already its own GLB: evento_feria_del_libro.glb)
const EVENT_EXPORTS = [['evento_alumbrado', AlumbradoDecor], ['evento_sucursal_fest', SucursalDecor]]

function Exporter({ onDone }) {
    const roots = useRef([])
    const island = useRef()
    const events = useRef([])
    useEffect(() => {
        const to = new URLSearchParams(location.search).get('to')
        const exporter = new GLTFExporter()
        const send = async (name, object) => {
            const glb = await exporter.parseAsync(object, { binary: true, onlyVisible: true })
            await fetch(`${to}?name=${encodeURIComponent(name)}`, { method: 'POST', body: glb })
        }
        ;(async () => {
            const done = []
            for (let i = 0; i < EXPORTS.length; i++) {
                const [name] = EXPORTS[i]
                await send(name, bake(roots.current[i], name))
                done.push(name)
            }
            // the island needs a moment: its instances, the places and the trees settle in a few frames
            // (and the real models of the places stream in: up to 5 s)
            // (and the events stand up, one piece after another: about 5 s)
            await new Promise((r) => setTimeout(r, 7000))
            const whole = bake(island.current, ISLAND_FILE)
            // the same island in two files that fit together (same coordinates): the TERRAIN alone
            // (cliff, lawn, river, streets, trees, lamps…) and ALL its BUILDINGS, each where it stands
            // (the city blocks with their roofs, the places, the route buildings, La Ermita)
            const terrain = new THREE.Group(), buildings = new THREE.Group()
            terrain.name = 'isla_terreno'
            buildings.name = 'isla_edificios'
            for (const m of [...whole.children]) (BUILDING.test(m.name) ? buildings : terrain).add(m.clone())
            // (isla_terreno.glb is YOURS too — your terrain: never overwritten)
            if (!USER_TERRAIN) await send('isla_terreno', terrain)
            // (isla_edificios.glb is YOURS now — your buildings as you arranged them: never overwritten;
            // the page draws them as they are, and they go in the whole island and the files below)
            if (!USER_BUILDINGS.length) await send('isla_edificios', buildings)
            await send(ISLAND_FILE, whole)
            // the same whole island to finish arranging in Blender: each kind of thing in its own group
            // (all the trees together, all the streets together…) — click the group in the outliner to
            // move them all, or one of its pieces to move just that one
            await send(ARRANGE_FILE, byKind(whole))
            // the island alone: only its ground (nothing on it)
            const alone = new THREE.Group()
            alone.name = 'isla_sola'
            for (const m of terrain.children) if (!ON_GROUND.test(m.name)) alone.add(m.clone())
            await send('isla_sola', alone)
            // the surface of the island (its ground without the cliff and the rocks under it): under
            // the buildings to edit, and under the events
            const surface = () => {
                const g = new THREE.Group()
                g.name = 'isla_superficie'
                for (const m of alone.children) if (!UNDER.test(m.name)) g.add(m.clone())
                return g
            }
            // the buildings to edit (each one an object, its origin at its foot: move it, scale it…),
            // standing on the surface of the island
            const toEdit = new THREE.Group()
            toEdit.name = 'edificios_para_editar'
            const only = new THREE.Group()
            only.name = 'edificios'
            for (const m of buildings.children) only.add(m.clone())
            toEdit.add(only, surface())
            await send('edificios_para_editar', toEdit)
            done.push(...(USER_TERRAIN ? [] : ['isla_terreno']), ...(USER_BUILDINGS.length ? [] : ['isla_edificios']), ISLAND_FILE, ARRANGE_FILE, 'isla_sola', 'edificios_para_editar')
            // (each event once its models are there — it loads them — and a moment to stand up)
            const meshesIn = (g) => {
                let n = 0
                g?.traverse((o) => o.isMesh && o.name !== 'confeti' && n++)
                return n
            }
            for (let k = 0; k < 120 && events.current.some((g) => meshesIn(g) < 3); k++) await new Promise((r) => setTimeout(r, 500))
            await new Promise((r) => setTimeout(r, 2000))
            for (let i = 0; i < EVENT_EXPORTS.length; i++) {
                const [name] = EVENT_EXPORTS[i]
                // (with the island under it: to see where each piece goes)
                const event = bakeEvent(events.current[i], name)
                const file = new THREE.Group()
                file.name = name
                event.name = name.replace(/^evento_/, '')
                file.add(event, surface())
                await send(name, file)
                done.push(name)
            }
            onDone(done)
        })().catch((e) => onDone([`ERROR ${e.message}`]))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // (the single models all at the origin, hidden from view under the island — it's a tool)
    return (
        <>
            {EXPORTS.map(([name, Model], i) => (
                <group key={name} ref={(el) => (roots.current[i] = el)}>
                    <Model />
                </group>
            ))}
            <group ref={island} name={ISLAND_FILE}>
                <Island />
                <Places />
                <StopBuildings />
            </group>
            {EVENT_EXPORTS.map(([name, Decor], i) => (
                <group key={name} ref={(el) => (events.current[i] = el)}>
                    <EventRoot active instant>
                        {(clock) => (
                            <Suspense fallback={null}>
                                <Decor clock={clock} forExport />
                            </Suspense>
                        )}
                    </EventRoot>
                </group>
            ))}
        </>
    )
}

export default function ModelExport() {
    const [done, setDone] = useState(null)
    return (
        <div style={{ position: 'fixed', inset: 0 }}>
            <Canvas camera={{ position: [-10, 30, 45], fov: 40 }}>
                <color attach="background" args={['#FFFDF5']} />
                <hemisphereLight args={['#ffffff', '#b08a6a', 1.6]} />
                <directionalLight position={[3, 6, 5]} intensity={2} />
                <Exporter onDone={setDone} />
            </Canvas>
            <p id="export-status" style={{ position: 'fixed', top: 12, left: 12, font: '14px sans-serif' }}>
                {done ? `Listo: ${done.join(', ')}` : 'Exportando…'}
            </p>
        </div>
    )
}
