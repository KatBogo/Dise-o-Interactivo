import { useEffect, useState } from 'react'
import { PHASES } from '../config.js'
import { caliHourNow, dayPart, formatHour } from '../data/caliSky.js'
import { skyIsLive, useExperience } from '../store/useExperience.js'

const PRESETS = [
    { label: 'Amanecer', hour: 6.4 },
    { label: 'Mediodía', hour: 12.5 },
    { label: 'Atardecer', hour: 17.8 },
    { label: 'Noche', hour: 21 },
]

const ICONS = {
    sun: (
        <>
            <circle cx="12" cy="12" r="4.2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line key={a} x1="12" y1="2.6" x2="12" y2="5.2" transform={`rotate(${a} 12 12)`} />
            ))}
        </>
    ),
    moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
}
const Icon = ({ name }) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICONS[name]}
    </svg>
)

/** Keeps the live hour in sync with Cali's clock (every 30 s). */
function useCaliClock() {
    const setLiveSky = useExperience((s) => s.setLiveSky)
    useEffect(() => {
        const id = setInterval(() => setLiveSky({ hour: caliHourNow() }), 30_000)
        return () => clearInterval(id)
    }, [setLiveSky])
}

/**
 * Top-left: the hour on the island — Cali's real hour, or the one set by the plan / the event /
 * you. The slider and presets change it; "Volver a la hora de Cali" goes back to the real one.
 */
export default function SkyPanel() {
    useCaliClock()
    const phase = useExperience((s) => s.phase)
    const live = useExperience((s) => s.liveSky)
    const manual = useExperience((s) => s.manualSky)
    const setSkyHour = useExperience((s) => s.setSkyHour)
    const goLiveSky = useExperience((s) => s.goLiveSky)
    const [open, setOpen] = useState(false)
    // the island keeps a fixed sky behind the plan selector: the hour appears once a plan is picked
    const picked = useExperience(skyIsLive)

    if (phase !== PHASES.STAGE || !picked) return null
    const hour = (manual ?? live).hour
    const isLive = !manual
    const night = hour < 6 || hour > 18.6

    return (
        <section className={`sky ${open ? 'is-open' : ''}`} aria-label="Hora de la isla">
            <button className="sky__summary" aria-expanded={open} onClick={() => setOpen(!open)}>
                <Icon name={night ? 'moon' : 'sun'} />
                <span className="sky__now">
                    <span className="sky__place">{isLive ? 'Cali ahora' : 'Hora de la isla'}</span>
                    {formatHour(hour)} · {dayPart(hour)}
                </span>
                {isLive && <span className="sky__live" title="Hora real de Cali">EN VIVO</span>}
                <span className="sky__caret" aria-hidden="true">{open ? '–' : '＋'}</span>
            </button>
            {/* (why the island changed its hour: Chonti says it in his bubble) */}

            {open && (
                <div className="sky__body">
                    <label className="sky__label" htmlFor="sky-hour">
                        Hora · <strong>{dayPart(hour)}</strong>
                    </label>
                    <input
                        id="sky-hour"
                        className="sky__range"
                        type="range"
                        min="0"
                        max="23.9"
                        step="0.1"
                        value={hour}
                        onChange={(e) => setSkyHour(Number(e.target.value))}
                        aria-valuetext={formatHour(hour)}
                    />
                    <div className="sky__chips">
                        {PRESETS.map((p) => (
                            <button key={p.label} className="sky__chip" aria-pressed={!isLive && Math.abs(hour - p.hour) < 0.05} onClick={() => setSkyHour(p.hour)}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn--primary btn--block sky__reset" onClick={goLiveSky} disabled={isLive}>
                        {isLive ? 'Estás viendo la hora de Cali' : 'Volver a la hora de Cali'}
                    </button>
                </div>
            )}
        </section>
    )
}
