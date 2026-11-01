import { useEffect, useRef, useState } from 'react'
import { PHASES } from '../config.js'
import { UI } from '../data/content.js'
import { useExperience } from '../store/useExperience.js'

const SPEAKER = 'M4 9.5h3.5L12 5.5v13l-4.5-4H4z'

/**
 * "Sonido" + its volume: a vertical slider and a speaker (tap it: mute / unmute) drop under it.
 * Tapping "Sonido" (computer or phone) sinks it and opens the slider; tapping anywhere else closes it.
 */
function VolumeControl({ soundOn, volume, setVolume, toggle }) {
    const root = useRef()
    const [open, setOpen] = useState(false)
    const level = soundOn ? volume : 0

    useEffect(() => {
        if (!open) return
        const away = (e) => !root.current?.contains(e.target) && setOpen(false)
        window.addEventListener('pointerdown', away)
        return () => window.removeEventListener('pointerdown', away)
    }, [open])

    return (
        <div ref={root} className={`volume ${open ? 'is-open' : ''}`}>
            <button
                className="btn btn--ghost volume__btn"
                aria-pressed={soundOn}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                aria-label="Música y sonidos"
            >
                Sonido {soundOn ? 'ON' : 'OFF'}
            </button>
            <div className="volume__pop">
                <span className="volume__value" aria-hidden="true">{Math.round(level * 100)}</span>
                <input
                    type="range" className="volume__range" min="0" max="1" step="0.05"
                    value={level}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    aria-label="Volumen de la música y los sonidos"
                    aria-orientation="vertical"
                    // (the pink fill reaches the middle of the thumb; at 0 there is none)
                    style={{ '--fill': level > 0 ? `calc(11px + (100% - 22px) * ${level})` : '0px' }}
                />
                <button className="volume__mute" onClick={toggle} aria-pressed={!soundOn} aria-label={soundOn ? 'Silenciar' : 'Activar el sonido'}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d={SPEAKER} className="volume__speaker" />
                        {soundOn ? (
                            <>
                                <path d="M15.5 9a4 4 0 0 1 0 6" />
                                {level > 0.5 && <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />}
                            </>
                        ) : (
                            <path d="M16 9.5l5 5M21 9.5l-5 5" />
                        )}
                    </svg>
                </button>
            </div>
        </div>
    )
}

/**
 * Brand + the controls that are always there, from the very first screen: Sonido (with its volume).
 * Chonti doesn't speak: what he says is in his bubble. On the island: back to the timeline.
 * The brand is hidden on the white intro screen (only Chonti there).
 */
export default function Hud() {
    const phase = useExperience((s) => s.phase)
    const soundOn = useExperience((s) => s.soundOn)
    const toggleSound = useExperience((s) => s.toggleSound)
    const volume = useExperience((s) => s.volume)
    const setVolume = useExperience((s) => s.setVolume)
    const goToIsland = useExperience((s) => s.goToIsland)
    const goToStart = useExperience((s) => s.goToStart)
    const backToTimeline = useExperience((s) => s.backToTimeline)
    const inIntro = phase === PHASES.INTRO
    // the click that wakes the sound up (you click "Sonido ON" because you hear nothing) must not
    // switch it OFF: that click only turns the sound on for real
    const unlessWaking = (toggle) => () => {
        const { wokeAt } = useExperience.getState()
        if (wokeAt && performance.now() - wokeAt < 700) return
        toggle()
    }
    const minimal = phase === PHASES.LOADING || inIntro || phase === PHASES.FALLING
    // the name of the experience: after the loader it stays big and green in the top-left corner
    // all through the intro (with Chonti, the timeline, the fall)
    const bigBrand = inIntro || phase === PHASES.FALLING

    return (
        <header className={`hud ${minimal ? 'is-minimal' : ''} ${bigBrand ? 'hud--intro' : ''}`}>
            {/* the name is also the way back to the very beginning (Chonti waiting for you) */}
            <h1 className="hud__brand">
                <button className="hud__home" onClick={goToStart} aria-label={`${UI.brand} · ${UI.goToStart}`} title={UI.goToStart}>
                    {UI.brand}
                </button>
            </h1>

            <div className="hud__actions">
                {/* for whoever doesn't want to read: straight to the island's plans */}
                {inIntro && (
                    <button className="btn btn--ghost hud__skip" onClick={goToIsland}>
                        {UI.goToIsland}
                    </button>
                )}
                {phase === PHASES.STAGE && (
                    <button className="btn btn--ghost" onClick={backToTimeline} aria-label="Volver a la historia del bulevar (línea del tiempo)">
                        Historia
                    </button>
                )}
                <VolumeControl soundOn={soundOn} volume={volume} setVolume={setVolume} toggle={unlessWaking(toggleSound)} />
            </div>
        </header>
    )
}
