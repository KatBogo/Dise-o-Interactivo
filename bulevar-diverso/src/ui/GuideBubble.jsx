import { useEffect, useState } from 'react'
import { PHASES } from '../config.js'
import { instructionOf, useExperience } from '../store/useExperience.js'
import { phrases } from './Narrator.jsx'

/**
 * Speech bubble of the guide Chonti. It shows the WHOLE narration, one phrase at a time — the
 * phrase his voice is saying (Narrator reports it), or, with the voice off, each phrase for its
 * reading time — so the text always fits and nothing is cut. Phrases cross-fade softly. When he is
 * done, the bubble keeps only the short instruction of the moment ("Selecciona un punto…"), with
 * or without his voice. The aria-live region in Narrator announces the full text.
 */
const readTime = (text) => 1800 + text.length * 50

export default function GuideBubble() {
    const guide = useExperience((s) => s.guide)
    const phase = useExperience((s) => s.phase)
    const narration = useExperience((s) => s.narration)
    const speaking = useExperience((s) => s.speaking)
    const spoken = useExperience((s) => s.spokenPart)
    // while the big plan selector fills the screen the bubble would cover it (the voice still speaks)
    const selector = useExperience((s) => !s.explored && !s.mode)
    const instruction = useExperience(instructionOf)
    // with his voice OFF and a card open, what he would say is what the card already says: the
    // bubble doesn't repeat it (only the short instruction stays)
    const repeats = useExperience((s) => !s.voice && ((s.mode === 'eventos' && !!s.activeEvent && !s.cardMin) || !!s.selectedPlace || !!s.selectedStop))
    const [own, setOwn] = useState({ id: -1, index: 0, done: false })
    // minimized by the visitor: stays folded until they open it again
    const [min, setMin] = useState(false)
    const fold = (e) => {
        const bubble = e.currentTarget.closest('.guide-bubble')
        if (!bubble) return setMin(true)
        bubble.classList.add('is-folding')
        setTimeout(() => setMin(true), 280)
    }

    // (phones: it sits right under the island clock, whatever its size — ScreenLayout)

    const parts = narration.text ? phrases(narration.text) : []
    const following = spoken.id === narration.id // the voice is reading it: follow the voice
    const mine = own.id === narration.id ? own : { id: narration.id, index: 0, done: false }
    const index = Math.min(parts.length - 1, following ? spoken.index : mine.index)

    // with no voice: each phrase stays its reading time, then the next one; after the last, it fades
    useEffect(() => {
        if (!narration.text || following) return
        const part = parts[mine.index] ?? ''
        const id = setTimeout(() => {
            setOwn(mine.index < parts.length - 1 ? { id: narration.id, index: mine.index + 1, done: false } : { id: narration.id, index: mine.index, done: true })
        }, readTime(part))
        return () => clearTimeout(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [narration.id, mine.index, following])

    // with the voice: it fades a moment after he stops talking
    const [quiet, setQuiet] = useState(false)
    useEffect(() => {
        setQuiet(false)
        if (!following || speaking) return
        const id = setTimeout(() => setQuiet(true), 1600)
        return () => clearTimeout(id)
    }, [following, speaking, narration.id])

    if (!guide || phase !== PHASES.STAGE || selector) return null
    const hidden = repeats || !parts.length || (following ? quiet : mine.done)
    // folded into a small "Chonti ＋" pill (his voice keeps talking): only the bubble animates
    if (min)
        return (
            // (only the ＋ opens it: the name is just a label)
            <div className="guide-pill">
                <span aria-hidden="true">Chonti</span>
                <button className="guide-pill__open" onClick={() => setMin(false)} aria-label="Abrir el texto de Chonti">＋</button>
            </div>
        )
    // when he is done talking, the bubble keeps what to do now (the instruction stays with him)
    if (hidden) {
        if (!instruction) return null
        return (
            <div key={`do-${instruction}`} className="guide-bubble guide-bubble--do">
                <BubbleHead onFold={fold} />
                <span className="guide-bubble__text is-next" aria-hidden="true">{instruction}</span>
            </div>
        )
    }
    // (no dots nor progress line: it isn't something to tap — the phrase simply changes when he
    // finishes saying it, with a small "boing" of the bubble)
    return (
        <div key={narration.id} className={`guide-bubble ${hidden ? 'is-hidden' : ''}`}>
            <BubbleHead onFold={fold} />
            <span key={index} className={`guide-bubble__text ${index > 0 ? 'is-next' : ''}`} aria-hidden="true">{parts[index]}</span>
        </div>
    )
}

/** "Chonti" and the button that folds the bubble away. */
function BubbleHead({ onFold }) {
    return (
        <span className="guide-bubble__head">
            <span className="guide-bubble__name" aria-hidden="true">Chonti</span>
            <button className="icon-btn icon-btn--sm guide-bubble__fold" onClick={onFold} aria-label="Minimizar el texto de Chonti">–</button>
        </span>
    )
}
