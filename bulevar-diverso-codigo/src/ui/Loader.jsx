import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { PHASES } from '../config.js'
import { UI } from '../data/content.js'
import { useExperience } from '../store/useExperience.js'

const READ_TIME = 3500 // ms the welcome message stays, so it can be read calmly

/**
 * Completely white, minimal loading screen. When the scene is ready a short welcome message
 * appears (with a thin bar that runs out while you read it) and then the intro starts by itself.
 * (Sound and voice start as soon as the browser allows it: see SoundDirector / AudioNudge.)
 */
export default function Loader() {
    const { progress } = useProgress()
    const phase = useExperience((s) => s.phase)
    const sceneReady = useExperience((s) => s.sceneReady)
    const setPhase = useExperience((s) => s.setPhase)
    const [minTimeDone, setMinTimeDone] = useState(false)

    useEffect(() => {
        const id = setTimeout(() => setMinTimeDone(true), 1200)
        return () => clearTimeout(id)
    }, [])

    const ready = phase === PHASES.LOADING && sceneReady && minTimeDone
    const pct = sceneReady ? 100 : Math.round(progress)

    useEffect(() => {
        if (!ready) return
        const id = setTimeout(() => setPhase(PHASES.INTRO), READ_TIME)
        return () => clearTimeout(id)
    }, [ready, setPhase])

    return (
        <div className={`loader ${phase !== PHASES.LOADING ? 'is-done' : ''}`} role="status" aria-live="polite">
            <div className="loader__panel">
                <h2 className="loader__title">{UI.loader.title}</h2>
                <div className="ruler" aria-hidden="true">
                    <div className="ruler__fill" style={{ transform: `scaleX(${pct / 100})` }} />
                </div>
                {ready ? (
                    <div className="loader__welcome">
                        <p className="loader__lead">{UI.loader.welcome}</p>
                        {UI.loader.note && <p className="loader__note">{UI.loader.note}</p>}
                        <span className="loader__timer" style={{ animationDuration: `${READ_TIME}ms` }} aria-hidden="true" />
                    </div>
                ) : (
                    <p className="loader__pct">{pct}%</p>
                )}
            </div>
        </div>
    )
}
