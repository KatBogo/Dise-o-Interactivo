import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { riverZ } from '../data/bulevarLayout.js'
import { ISLAND_TOP } from '../config.js'
import Island from './island/Island.jsx'
import Places from './places/Places.jsx'
import { StopBuildings } from './routes/RouteLayer.jsx'
import { AlumbradoDecor, EventRoot } from './events/EventDecor.jsx'
import { islandMaterials } from './materials.js'
import { skyState } from './skyState.js'

/**
 * Dev-only: /?shots&to=<url> — the PROVISIONAL pictures of the timeline (public/timeline/*.jpg),
 * photographed on the island itself until the real photos arrive (put them in Assets/timeline:
 * scripts/sync-assets.mjs copies them over these). One scene per date, all 2 : 1 at 2400 × 1200.
 */
const MODERN = /^(edificios|techos|lotes|balcones|tanques|aires|calle|calles|cebras|lineas|postes|faroles|bancas|ciclorruta|anden_av1norte|lugar_|ruta_|hito_la-ermita|pasarela)/
const z = (x, o = 0) => riverZ(x) + o
export const SHOTS = [
    // 1835 – 1845 · the Puente Ortiz alone over the river (no city yet)
    { name: '01_puente-ortiz', hide: [MODERN], sky: '#E8D3B2', sun: [-10, 8, 8], cam: [-13.6, 1.5, z(-13.6, 2.9)], at: [-16.5, 0.35, z(-16.5)] },
    // 1950 – 2010 · the road, the traffic and the bridge
    { name: '02_avenida-colombia', hide: [], sky: '#D9DDDD', sun: [6, 9, -8], cam: [-10.4, 1.25, z(-10.4, -1.85)], at: [-16.5, 0.5, z(-16.5, -0.9)] },
    // 2011 – 2012 · down in the river, by the old brick arches and stone walls of the bridge
    { name: '03_obras-y-hallazgos', hide: [], sky: '#E2D1B6', sun: [-6, 7, 9], cam: [-19.8, 0.95, z(-19.8, -0.35)], at: [-16.5, 0.22, z(-16.5, 0.15)] },
    // 2013 · the new pedestrian Bulevar along the river
    { name: '04_inauguracion-bulevar', hide: [], sky: '#D6E6EC', sun: [-6, 11, 9], cam: [-7.5, 3.4, z(-7.5, 7.2)], at: [3, 0.3, z(3, 2.2)] },
    // 2014 – 2023 · the Bulevar lit up at night (the Alumbrado)
    { name: '05_corredor-festivo', hide: [], sky: '#18203A', night: true, sun: [-6, 10, 8], cam: [3.2, 2.7, z(3.2, 6.6)], at: [-6.5, 0.6, z(-6.5, 1.4)] },
    // 2024 · the green: trees, gardens and the promenade
    { name: '06_cop16-zona-verde', hide: [], sky: '#D3E7DC', sun: [8, 10, 9], cam: [10.2, 2.6, z(10.2, 7.4)], at: [16.6, 0.45, z(16.6, 1.6)] },
]
const W = 2400
const H = 1200

function Shooter({ onDone, setNight }) {
    const { gl, scene, camera } = useThree()
    const sun = useRef()
    const sky = useRef()
    useEffect(() => {
        const to = new URLSearchParams(location.search).get('to')
        const island = scene.getObjectByName('shots_root')
        const wait = (ms) => new Promise((r) => setTimeout(r, ms))
        ;(async () => {
            await wait(1500) // the instances, places and trees settle
            const done = []
            const only = new URLSearchParams(location.search).get('only') // e.g. &only=03_obras-y-hallazgos
            for (const shot of SHOTS.filter((s) => !only || s.name === only)) {
                const night = !!shot.night
                setNight(night)
                skyState.night = night ? 1 : 0 // street lamps on
                islandMaterials.building.emissiveIntensity = night ? 0.9 : 0 // lit windows
                sky.current.intensity = night ? 0.32 : 1.25
                sky.current.color.set(night ? '#8FA2D6' : '#ffffff')
                sun.current.intensity = night ? 0.35 : 2.6
                sun.current.color.set(night ? '#9DB0E8' : '#ffffff')
                if (night) await wait(3000) // the Alumbrado's lights rise into place
                island.traverse((o) => {
                    if (o === island || o.name === 'isla') return
                    // named parts (buildings, streets, places…) by their name; the unnamed ones
                    // straight under the island are the traffic — modern too
                    if (o.name) o.visible = !shot.hide.some((re) => re.test(o.name))
                    else if (o.parent?.name === 'isla') o.visible = !shot.hide.length
                })
                scene.background = new THREE.Color(shot.sky)
                camera.position.set(...shot.cam)
                camera.lookAt(...shot.at)
                camera.updateProjectionMatrix()
                const [sx, sy, sz] = shot.sun
                sun.current.position.set(shot.at[0] + sx, ISLAND_TOP + sy, shot.at[2] + sz)
                sun.current.target.position.set(...shot.at)
                sun.current.target.updateMatrixWorld()
                gl.shadowMap.needsUpdate = true
                for (let i = 0; i < 3; i++) gl.render(scene, camera)
                const blob = await new Promise((r) => gl.domElement.toBlob(r, 'image/jpeg', 0.9))
                // (raw bytes, no content type: a plain request, no CORS preflight)
                await fetch(`${to}?name=${shot.name}`, { method: 'POST', body: await blob.arrayBuffer() })
                done.push(shot.name)
            }
            setNight(false)
            skyState.night = 0
            islandMaterials.building.emissiveIntensity = 0
            onDone(done)
        })().catch((e) => onDone([`ERROR ${e.message}`]))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <hemisphereLight ref={sky} args={['#ffffff', '#b9a37f', 1.25]} />
            <directionalLight ref={sun} intensity={2.6} castShadow shadow-mapSize={[4096, 4096]} shadow-bias={-0.0004}>
                <orthographicCamera attach="shadow-camera" args={[-14, 14, 14, -14, 0.5, 60]} />
            </directionalLight>
        </>
    )
}

export default function TimelineShots() {
    const [done, setDone] = useState(null)
    const [night, setNight] = useState(false)
    return (
        <div style={{ position: 'fixed', left: 0, top: 0, width: W, height: H }}>
            <Canvas shadows dpr={1} gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ fov: 34, near: 0.1, far: 400 }}>
                <group name="shots_root">
                    <Island />
                    <Places />
                    <StopBuildings />
                </group>
                <EventRoot active={night}>{(clock) => <AlumbradoDecor clock={clock} />}</EventRoot>
                <Shooter onDone={setDone} setNight={setNight} />
            </Canvas>
            <p id="shots-status" style={{ position: 'fixed', top: 12, left: 12, font: '14px sans-serif', background: '#fff' }}>
                {done ? `Listo: ${done.join(', ')}` : 'Fotografiando…'}
            </p>
        </div>
    )
}
