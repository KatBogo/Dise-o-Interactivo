import { lazy, Suspense } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Experience from './three/Experience.jsx'
import Interface from './ui/Interface.jsx'
import { introState, useExperience } from './store/useExperience.js'
import { sound } from './audio/sound.js'
import * as layout from './data/bulevarLayout.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// The intro always starts at the top of the scroll.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const DEV = process.env.NODE_ENV !== 'production'
// Dev-only handle for debugging from the console: __bulevar.store.getState().skipIntro()
// (also on the published page with ?debug at the end of the address, to check things there)
const DEBUG = DEV || (typeof window !== 'undefined' && /[?&]debug\b/.test(window.location.search))
if (DEBUG) window.__bulevar = { store: useExperience, introState, gsap, THREE, sound, layout }

const ChontiPreview = lazy(() => import('./three/chonti/ChontiPreview.jsx'))
const ModelExport = lazy(() => import('./three/ModelExport.jsx'))
const TimelineShots = lazy(() => import('./three/TimelineShots.jsx'))

// Two layers: a fixed WebGL canvas (3D world) and a DOM overlay (2D precision UI).
// They only talk through the zustand store, never through props.
export default function BulevarApp() {
    // Dev-only character turnaround: /?chonti
    // Dev-only: exports the island's replaceable models (scripts/export-models.mjs): /?export
    if (DEV && new URLSearchParams(location.search).has('export')) {
        return (
            <Suspense fallback={null}>
                <ModelExport />
            </Suspense>
        )
    }
    // Dev-only: photographs the timeline's placeholder pictures on the island: /?shots
    if (DEV && new URLSearchParams(location.search).has('shots')) {
        return (
            <Suspense fallback={null}>
                <TimelineShots />
            </Suspense>
        )
    }
    if (DEV && new URLSearchParams(location.search).has('chonti')) {
        return (
            <Suspense fallback={null}>
                <ChontiPreview />
            </Suspense>
        )
    }
    return (
        <>
            <Experience />
            <Interface />
        </>
    )
}
