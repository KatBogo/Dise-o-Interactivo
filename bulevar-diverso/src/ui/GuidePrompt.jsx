import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience } from '../store/useExperience.js'
import { UI } from '../data/content.js'

/** Appears the instant Chonti disappears behind the clouds (texts in src/content/ui.json → fallPrompt). */
export default function GuidePrompt() {
    const chooseGuide = useExperience((s) => s.chooseGuide)
    const root = useRef()
    const yes = useRef()
    const copy = UI.fallPrompt

    // useGSAP reverts on cleanup, so StrictMode's double effect doesn't leave the card stuck at opacity 0.
    useGSAP(() => {
        yes.current.focus()
        useExperience.getState().narrate(`${copy.title} ${copy.text}`)
        gsap.from(root.current, { autoAlpha: 0, y: 24, scale: 0.96, duration: 0.5, ease: 'back.out(1.6)' })
    })

    return (
        <div className="overlay overlay--soft">
            <section ref={root} className="card card--prompt" role="dialog" aria-modal="true" aria-labelledby="guide-title" aria-describedby="guide-desc">
                <p className="eyebrow">{copy.eyebrow}</p>
                <h2 id="guide-title" className="card__title">{copy.title}</h2>
                <p id="guide-desc" className="card__text">{copy.text}</p>
                <div className="card__actions">
                    <button ref={yes} className="btn btn--primary" onClick={() => chooseGuide(true)}>
                        {copy.yes}
                    </button>
                    <button className="btn btn--ghost" onClick={() => chooseGuide(false)}>
                        {copy.no}
                    </button>
                </div>
            </section>
        </div>
    )
}
