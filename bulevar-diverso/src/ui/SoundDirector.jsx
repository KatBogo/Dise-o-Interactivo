import { useEffect } from 'react'
import { PHASES } from '../config.js'
import { skyOf, useExperience } from '../store/useExperience.js'
import { isDecember, sound } from '../audio/sound.js'
import { skyState } from '../three/skyState.js'

/** Which music fits the moment: reggaetón at the Sucursal Fest, villancicos in December / Alumbrado, else calm. */
function musicFor(s) {
    // while he falls and the clouds open: only the fall and the wind
    if (s.phase === PHASES.LOADING || s.phase === PHASES.FALLING || s.phase === PHASES.REVEAL) return null
    const event = s.mode === 'eventos' ? s.activeEvent : null
    if (event === 'sucursal') return 'reggaeton'
    if (event === 'alumbrado') return 'alumbrado' // ¡Tutaina tuturumá!
    if (isDecember()) return 'december'
    return 'calm'
}

/**
 * Connects the app to the sound engine: unlocks audio on the first gesture, picks the music,
 * feeds the ambience from the sky (rain, wind, day / night) and plays the UI effects.
 */
export default function SoundDirector() {
    useEffect(() => {
        // the first click / tap / key anywhere wakes the sound up (the intro starts by itself; the
        // music and Chonti's voice join right away when the browser allows it, or at that moment)
        const unlock = () => {
            sound.unlock()
            sound.setEnabled(useExperience.getState().soundOn)
            sound.setMusic(musicFor(useExperience.getState()))
            useExperience.getState().markAudioReady(true)
        }
        window.addEventListener('pointerdown', unlock, true)
        window.addEventListener('keydown', unlock, true)
        window.addEventListener('touchend', unlock, true)
        // some browsers already allow it (a site you visit often): try right away
        sound.unlock()
        const tryNow = setTimeout(() => {
            if (sound.ctx?.state === 'running') {
                sound.setEnabled(useExperience.getState().soundOn)
                sound.setMusic(musicFor(useExperience.getState()))
                useExperience.getState().markAudioReady(false)
            }
        }, 300)

        // UI effects
        let lastHover = 0
        const click = (e) => e.target.closest?.('button, a, [role="button"], input[type="range"]') && sound.play('click')
        const over = (e) => {
            const el = e.target.closest?.('.filter, .btn, .marker-label, .sky__chip, .list__item')
            if (!el || performance.now() - lastHover < 90) return
            lastHover = performance.now()
            sound.play('hover')
        }
        window.addEventListener('click', click)
        window.addEventListener('pointerover', over)

        // music + one-shot effects from the store
        const unsub = useExperience.subscribe((s, prev) => {
            if (s.soundOn !== prev.soundOn) sound.setEnabled(s.soundOn)
            if (s.volume !== prev.volume) sound.setVolume(s.volume)
            sound.setMusic(musicFor(s))
            if (s.phase !== prev.phase) {
                if (s.phase === PHASES.FALLING) {
                    sound.play('boing') // his jump of surprise
                    setTimeout(() => sound.play('fall'), 3100) // when the floor goes (IntroScene)
                }
                if (s.phase === PHASES.REVEAL) sound.play('open')
            }
            if (s.selectedPlace && s.selectedPlace !== prev.selectedPlace) sound.play('pop')
            if (s.activeEvent && s.activeEvent !== prev.activeEvent) sound.play(s.activeEvent === 'feria' ? 'page' : 'chime')
            if (s.wall.length > prev.wall.length) sound.play('chime')
        })

        // ambience from the sky
        const amb = setInterval(() => {
            const s = useExperience.getState()
            const sky = skyOf(s)
            const onIsland = s.phase === PHASES.STAGE
            const inTheAir = s.phase === PHASES.FALLING || s.phase === PHASES.REVEAL // high wind up in the clouds
            sound.setAmbience({
                rain: onIsland ? skyState.rain : 0,
                wind: inTheAir ? 1 : sky.weather === 'windy' ? 1 : sky.weather === 'storm' ? 0.8 : sky.weather === 'rain' ? 0.4 : 0.1,
                night: skyState.night,
                day: 1 - skyState.night,
                city: onIsland ? 0.5 : 0,
            })
        }, 500)

        return () => {
            window.removeEventListener('pointerdown', unlock, true)
            window.removeEventListener('keydown', unlock, true)
            window.removeEventListener('touchend', unlock, true)
            clearTimeout(tryNow)
            window.removeEventListener('click', click)
            window.removeEventListener('pointerover', over)
            unsub()
            clearInterval(amb)
        }
    }, [])
    return null
}
