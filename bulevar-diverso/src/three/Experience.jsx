import { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor, Preload } from '@react-three/drei'
import { CAMERA, PHASES } from '../config.js'
import { useExperience } from '../store/useExperience.js'
import Atmosphere from './Atmosphere.jsx'
import CameraRig from './CameraRig.jsx'
import IntroScene from './chonti/IntroScene.jsx'
import Clouds from './Clouds.jsx'
import Weather from './Weather.jsx'
import Lightning from './Lightning.jsx'
import Island from './island/Island.jsx'
import Places from './places/Places.jsx'
import EventDecor from './events/EventDecor.jsx'
import RouteLayer, { StopBuildings } from './routes/RouteLayer.jsx'
import RouteChonti from './chonti/RouteChonti.jsx'

// Fires once everything inside <Suspense> has resolved → the loader can hand over to the walk.
function SceneReady() {
    const setSceneReady = useExperience((s) => s.setSceneReady)
    const get = useThree((s) => s.get)
    useEffect(() => setSceneReady(), [setSceneReady])
    // dev: expose the R3F state (camera, scene, controls) next to the store
    useEffect(() => {
        if (window.__bulevar) window.__bulevar.three = get // (dev, or ?debug)
    }, [get])
    return null
}

/**
 * Shadows are re-rendered a few times per second instead of every frame (the sun moves slowly,
 * cars are tiny): a big saving on large screens.
 */
function ShadowThrottle() {
    const gl = useThree((s) => s.gl)
    useEffect(() => {
        gl.shadowMap.autoUpdate = false
        gl.shadowMap.needsUpdate = true
    }, [gl])
    let n = 0
    useFrame(() => {
        if (++n % 5 === 0) gl.shadowMap.needsUpdate = true
    })
    return null
}

// pixel ratio: 1 on large screens, up to 1.25 on small ones; lower still when the device struggles
const maxDpr = () => Math.min(window.devicePixelRatio || 1, window.innerWidth > 1300 ? 1 : 1.25)

export default function Experience() {
    const [dpr, setDpr] = useState(maxDpr)
    const phase = useExperience((s) => s.phase)
    // During the scroll intro the canvas must not swallow wheel/touch events.
    const interactive = phase === PHASES.STAGE || phase === PHASES.REVEAL

    return (
        <div className={`canvas-wrap ${interactive ? 'is-interactive' : ''}`}>
            <Canvas
                dpr={dpr}
                shadows
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                camera={{ fov: 40, near: 0.3, far: 220, position: CAMERA.intro.position }}
                aria-label="Mapa 3D del Bulevar del Río. Todo su contenido también está disponible en los paneles de texto."
            >
                <PerformanceMonitor onDecline={() => setDpr(0.8)} onIncline={() => setDpr(maxDpr())} />
                <ShadowThrottle />
                <Atmosphere />
                <Suspense fallback={null}>
                    <IntroScene />
                    <Clouds />
                    <Weather />
                    <Lightning />
                    <Island />
                    <Places />
                    <EventDecor />
                    <StopBuildings />
                    <RouteLayer />
                    <RouteChonti />
                    <Preload all />
                    <SceneReady />
                </Suspense>
                <CameraRig />
            </Canvas>
        </div>
    )
}
