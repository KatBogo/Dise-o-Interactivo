import { useEffect } from 'react'
import { PHASES } from '../config.js'
import { useExperience } from '../store/useExperience.js'
import Loader from './Loader.jsx'
import IntroTimeline from './IntroTimeline.jsx'
import StageUI from './StageUI.jsx'
import Narrator from './Narrator.jsx'
import Hud from './Hud.jsx'
import GuideBubble from './GuideBubble.jsx'
import SkyPanel from './SkyPanel.jsx'
import SoundDirector from './SoundDirector.jsx'
import GuideChonti from '../three/chonti/GuideChonti.jsx'
import DesignEditor, { DesignStyle } from './DesignEditor.jsx'
import ScreenLayout from './ScreenLayout.jsx'

export default function Interface() {
    const phase = useExperience((s) => s.phase)
    const mood = useExperience((s) => (s.mode === 'eventos' && s.activeEvent) || 'base')
    const guide = useExperience((s) => s.guide)
    const greeting = useExperience((s) => s.greeting)
    // a card or sheet is open over the island (phones: the bubble would cover the same text)
    const card = useExperience((s) => (s.mode === 'eventos' && !!s.activeEvent && !s.cardMin) || s.builder)
    // any sheet on the island (the RUTAS strip too): phones keep the gap above it for the island
    const sheet = useExperience((s) => card || (s.phase === PHASES.STAGE && s.mode === 'rutas'))
    const builder = useExperience((s) => s.phase === PHASES.STAGE && s.builder)

    useEffect(() => {
        const html = document.documentElement
        html.dataset.mood = mood
        html.dataset.guide = String(guide)
        html.dataset.phase = phase
        html.dataset.greeting = String(greeting)
        html.dataset.card = String(card)
        html.dataset.sheet = String(sheet)
        html.dataset.builder = String(builder)
        // Only the intro scrolls the document (not while Chonti says hi); everything else is a fixed "app".
        html.classList.toggle('is-scrollable', phase === PHASES.INTRO && !greeting)
    }, [mood, guide, phase, greeting, card, sheet, builder])

    const intro = phase === PHASES.INTRO || phase === PHASES.FALLING

    return (
        <>
            <Hud />
            <ScreenLayout />
            <SkyPanel />
            <SoundDirector />
            {(phase === PHASES.LOADING || phase === PHASES.INTRO) && <Loader />}
            {intro && <IntroTimeline />}
            {phase === PHASES.STAGE && <StageUI />}
            <GuideBubble />
            <GuideChonti />
            <Narrator />
            {/* the page's design (src/content/design.json) and, with ?editar, its editor */}
            <DesignStyle />
            <DesignEditor />
        </>
    )
}
