import { useEffect, useState } from 'react'
import { useExperience } from '../store/useExperience.js'
import { sound } from '../audio/sound.js'

/**
 * Chonti's voice + accessibility layer.
 *  - aria-live region → screen readers announce every narration
 *  - Web Speech API  → Chonti speaks while Voz is ON
 *
 * Voice — ONE voice, the most HUMAN the device has (soft, not hoarse), a man's whenever possible:
 *  - natural voices first: neural / online (Edge "Gonzalo / Jorge Online (Natural)") and Chrome's
 *    Google voices; the old system voices (Windows "Raúl / Sabina") sound robotic and hoarse, so
 *    they are only the last resort
 *  - among equally natural voices: a man's (Chonti is a boy), then es-CO, then Latin American
 *  - natural voices keep almost their own pitch (any change is re-synthesised = robotic); the old
 *    system voices get a lighter, younger pitch so they sound less hoarse
 *  - spoken in whole phrases (a few sentences per utterance) so the voice keeps its natural
 *    melody; symbols / apostrophes are cleaned so they read well
 *  - always about what is on screen: every new narration cuts the previous one right away
 *    (an empty narration just stops him)
 *  - browsers only allow speech after the first click / key / touch: whatever was on screen is
 *    said as soon as that happens
 */
// (Android's Google voices have codes instead of names: esd / eed / eef are the men's)
const MALE = /gonzalo|ra[uú]l|pablo|jorge|diego|[aá]lvaro|enrique|juan|carlos|andr[eé]s|gerardo|jos[eé]|emilio|tom[aá]s|lorenzo|federico|santiago|dar[ií]o|sergio|manuel|alonso|liam|arnau|teo|male|hombre|masculin|ni[ñn]o|x-esd|x-eed|x-eef/i
const FEMALE = /google|helena|laura|sabina|salom[eé]|elvira|dalia|paloma|elena|ximena|camila|catalina|larissa|paulina|m[oó]nica|luciana|isabel|marisol|soledad|zira|hazel|susan|linda|irene|carmen|lupe|pen[eé]lope|conchita|esperanza|francisca|valentina|luc[ií]a|renata|beatriz|candela|triana|abril|ver[oó]nica|yolanda|andrea|marta|paola|elsa|angelica|female|femenin|mujer|ni[ñn]a/i
const NATURAL = /natural|online|neural|premium|enhanced|mejorad/i
const GOOGLE = /google/i // Chrome's network voices: smooth, though not neural
// iPhone / Mac novelty voices (cartoon, robotic): never Chonti's
const NOVELTY = /eddy|\bflo\b|grandma|grandpa|abuel|reed|rocko|sandy|shelley|bubbles|bad news|good news|bahh|bells|boing|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|\bfred\b|junior|ralph|kathy|cellos/i
export const isMaleVoice = (v) => !!v && (MALE.test(v.name) || MALE.test(v.voiceURI ?? '')) && !FEMALE.test(v.name)

function rankVoice(v) {
    let score = 0
    if (NOVELTY.test(v.name)) score -= 400
    // a man's voice ALWAYS comes first (Chonti is a boy): an "enhanced" woman's voice on the
    // iPhone used to win over the men's and he spoke with a woman's voice
    if (isMaleVoice(v)) score += 200
    if (NATURAL.test(v.name)) score += 100 // neural: the most human
    else if (GOOGLE.test(v.name)) score += 80 // smooth network voices
    if (v.localService === false) score += 5
    if (/es[-_]CO/i.test(v.lang)) score += 15
    else if (/es[-_](419|MX|US|VE|EC|PE)/i.test(v.lang)) score += 8 // Latin American accents
    return score
}

/**
 * Sentences grouped into phrases of up to ~160 characters: Chrome cuts very long utterances, and
 * the speech bubble shows one phrase at a time — the one he is saying — so it always fits.
 */
export function phrases(text) {
    const sentences = text.match(/[^.!?…]+[.!?…]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text]
    const out = []
    for (const s of sentences) {
        if (out.length && out[out.length - 1].length + s.length < 160) out[out.length - 1] += ` ${s}`
        else out.push(s)
    }
    return out
}

/** Chonti's voice: the best-ranked Spanish voice of this device (a man's, the most natural one). */
function useSpanishVoice() {
    const [voice, setVoice] = useState(null)
    useEffect(() => {
        if (!('speechSynthesis' in window)) return
        const pick = () => {
            const es = window.speechSynthesis.getVoices().filter((v) => /^es/i.test(v.lang))
            setVoice(es.sort((a, b) => rankVoice(b) - rankVoice(a))[0] ?? null)
        }
        pick()
        window.speechSynthesis.addEventListener('voiceschanged', pick)
        return () => window.speechSynthesis.removeEventListener('voiceschanged', pick)
    }, [])
    return voice
}

/** Has the visitor clicked / pressed a key / touched yet? (speech is blocked before that) */
function useActivated() {
    const [on, setOn] = useState(() => typeof navigator === 'undefined' || navigator.userActivation?.hasBeenActive !== false)
    useEffect(() => {
        if (on) return
        const go = () => setOn(true)
        const evs = ['pointerdown', 'keydown', 'touchend']
        evs.forEach((e) => window.addEventListener(e, go, { once: true }))
        return () => evs.forEach((e) => window.removeEventListener(e, go))
    }, [on])
    return on
}

/** What he reads: no emojis, arrows or dots in the middle, and "pa'" said like a caleño. */
const clean = (text) =>
    text
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
        .replace(/[←→↓↑▶]/g, '')
        .replace(/\s·\s/g, ', ')
        .replace(/\bpa'/gi, 'pa')
        .replace(/'/g, '')
        .replace(/\s+/g, ' ')
        .trim()

export default function Narrator() {
    const narration = useExperience((s) => s.narration)
    const voiceOn = useExperience((s) => s.voice)
    const setSpeaking = useExperience((s) => s.setSpeaking)
    const setSpokenPart = useExperience((s) => s.setSpokenPart)
    const voice = useSpanishVoice()
    // speech can start after the first click / tap / key, or right away if the browser allowed audio
    const gestured = useActivated()
    const audioReady = useExperience((s) => s.audioReady)
    const activated = gestured || audioReady

    useEffect(() => {
        if (!narration.text) return
        const canSpeak = voiceOn && activated && 'speechSynthesis' in window

        // No sound yet (the browser waits for a first click / tap / key) or Voz OFF: his mouth stays
        // still — it only ever moves with the real voice (utterance start → end), so both go
        // together. As soon as the sound is allowed this effect runs again and he says it.
        if (!canSpeak) {
            setSpeaking(false)
            return
        }

        const synth = window.speechSynthesis
        synth.cancel()
        // natural voices: almost their own pitch (just a touch younger), their own pace — that is
        // what keeps them human; old system voices: lighter (less hoarse) and a touch slower
        const natural = voice && (NATURAL.test(voice.name) || GOOGLE.test(voice.name))
        const male = isMaleVoice(voice)
        // a man's voice: almost its own pitch, a touch younger. If this device has NO man's voice
        // at all (some phones), a woman's voice lowered sounds like a boy instead of a woman
        const basePitch = male ? (natural ? 1.08 : 1.2) : 0.72
        const baseRate = natural ? 1.0 : 0.97
        // (the bubble splits the same way, from the raw text, so its phrases match these)
        const parts = phrases(narration.text).map(clean).filter(Boolean)

        const id = setTimeout(() => {
            parts.forEach((part, i) => {
                const u = new SpeechSynthesisUtterance(part)
                if (voice) u.voice = voice
                u.lang = voice?.lang ?? 'es-CO'
                // the voice does its own intonation
                u.pitch = basePitch
                u.rate = baseRate
                u.volume = 1
                // the bubble follows the phrase he is saying
                const onStart = () => setSpokenPart({ id: narration.id, index: i })
                if (i === 0) u.onstart = () => (setSpeaking(true), sound.duck(true), onStart())
                else u.onstart = onStart
                if (i === parts.length - 1) u.onend = () => (setSpeaking(false), sound.duck(false))
                u.onerror = () => (setSpeaking(false), sound.duck(false))
                synth.speak(u)
            })
        }, 60) // Chrome drops speak() calls made right after cancel()

        return () => {
            clearTimeout(id)
            synth.cancel()
            setSpeaking(false)
            sound.duck(false)
        }
    }, [narration.id, narration.text, voiceOn, voice, activated, setSpeaking, setSpokenPart])

    return (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
            {narration.text}
        </div>
    )
}
