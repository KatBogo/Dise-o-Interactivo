import { AUDIO } from '../data/content.js'

/**
 * Bulevar Diverso sound engine (Web Audio, everything synthesized — no files needed).
 *
 *  music     calm  : marimba de chonta (the Pacific marimba, made of chontaduro palm wood!)
 *                    arpeggios over a soft pad, slow and generative
 *            december : villancicos — "Noche de paz" (public domain), an original aguinaldo tune
 *                    and the "Tutaina", in a music-box marimba, in December (Cali time)
 *            alumbrado : the "Tutaina" (with maracas), on a loop while the Alumbrado is open
 *            reggaeton : Sucursal Fest — the dembow at 96 BPM, 808 bass, plucked chords and a hook
 *            techno : 128 BPM kick, hats, claps, rolling bass and stabs (kept, not in use)
 *            salsa : clave 3-2, congas, bass tumbao and piano montuno (kept, not in use)
 *  ambience  rain · wind · birds (day) · crickets (night) · soft city murmur
 *  effects   click, hover, pop, whoosh, open, boing, laugh ("ja ja ja"), giggle, chime, page, thunder
 *
 * Real recordings can replace the synthesized music: list them in src/content/audio.json
 * (e.g. your own Colombian villancicos in /public/audio/) and they are played instead.
 * Browsers only allow sound after a user gesture → unlock() is called on the first click/key.
 */

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)
// real recordings (the Tutaina) are mastered loud: keep them soft, under Chonti's voice
// (not too soft: under Chonti's long narration of the Alumbrado it got lost on phone speakers)
const FILE_VOLUME = 0.34
// the Christmas carols (the Tutaina of the Alumbrado, the villancicos of December) always play at
// 60% of the other music — recorded or synthesized, with Chonti talking or not
const CAROL = 0.6
const isCarol = (mode) => mode === 'december' || mode === 'alumbrado'
// the average level (RMS) a recording is brought to: about as loud as the synthesized music
const REF_RMS = 0.07
// a tiny silent WAV: played once inside the first touch, it unlocks the recordings' audio element
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

// Noche de paz (Franz Gruber, 1818 — public domain), 6/8: [midi, eighths]
const NOCHE_DE_PAZ = [
    [67, 3], [69, 1], [67, 2], [64, 6], [67, 3], [69, 1], [67, 2], [64, 6],
    [74, 4], [74, 2], [71, 6], [72, 4], [72, 2], [67, 6],
    [69, 4], [69, 2], [72, 3], [71, 1], [69, 2], [67, 3], [69, 1], [67, 2], [64, 6],
    [69, 4], [69, 2], [72, 3], [71, 1], [69, 2], [67, 3], [69, 1], [67, 2], [64, 6],
    [74, 4], [74, 2], [77, 3], [74, 1], [71, 2], [72, 6], [76, 6],
    [72, 3], [67, 1], [64, 2], [67, 3], [65, 1], [62, 2], [60, 12],
]
const NOCHE_BASS = [48, 48, 48, 48, 43, 43, 48, 48, 53, 53, 48, 48, 53, 53, 48, 48, 43, 43, 48, 48, 48, 43, 48, 48]
// "Aguinaldo caleño" — an original festive melody in 6/8 (written for this project)
const AGUINALDO = [
    [67, 1], [71, 1], [74, 1], [74, 2], [71, 1], [72, 1], [76, 1], [72, 1], [69, 3],
    [69, 1], [72, 1], [76, 1], [76, 2], [72, 1], [71, 1], [74, 1], [71, 1], [67, 3],
    [67, 1], [69, 1], [71, 1], [72, 2], [74, 1], [76, 2], [74, 1], [72, 3],
    [71, 1], [69, 1], [67, 1], [69, 2], [71, 1], [67, 6],
]
const AGUINALDO_BASS = [43, 43, 48, 45, 45, 43, 43, 43, 48, 48, 50, 43, 43]

// "Tutaina" (traditional Colombian villancico, public domain), F major, 2/4, [midi, eighths].
// The verse opens as it is sung ("Los pastores de Belén / vienen a adorar al niño":
// do fa fa fa sol la sib sib do do do sib la sol fa); the chorus ("Tutaina tuturumá, tutaina
// tuturumaina…") is an approximation. A real recording placed at /public/audio/tutaina.mp3
// (listed in content/audio.json) is played instead when it exists.
const TUTAINA_VERSE = [
    [60, 1], [65, 1], [65, 1], [65, 1], [67, 1], [69, 1], [70, 1], [70, 1], [72, 1], [72, 1], [72, 1], [70, 1], [69, 1], [67, 1], [65, 2],
    [60, 1], [65, 1], [65, 1], [65, 1], [67, 1], [69, 1], [70, 1], [70, 1], [72, 1], [70, 1], [69, 1], [67, 1], [69, 1], [64, 1], [65, 2],
]
const TUTAINA_CHORUS = [
    [72, 1], [74, 1], [72, 1], [70, 1], [69, 1], [70, 1], [72, 2], // tu-tai-na tu-tu-ru-má
    [70, 1], [72, 1], [70, 1], [69, 1], [67, 1], [69, 1], [70, 1], [67, 1], // tu-tai-na tu-tu-ru-mai-na
    [72, 1], [74, 1], [72, 1], [70, 1], [69, 1], [70, 1], [72, 2], // tu-tai-na tu-tu-ru-má
    [70, 1], [69, 1], [67, 2], // tu-ru-má
    [69, 1], [70, 1], [69, 1], [67, 1], [64, 1], [67, 1], [65, 2], // tu-tai-na tu-tu-ru-mai-na
]
const TUTAINA = [...TUTAINA_VERSE, ...TUTAINA_CHORUS, ...TUTAINA_CHORUS]
// one root per 2/4 bar (4 eighths): F · C7 · Bb
const TUTAINA_CHORUS_BASS = [48, 53, 46, 48, 48, 53, 48, 48, 53]
const TUTAINA_BASS = [53, 48, 48, 53, 53, 48, 48, 53, ...TUTAINA_CHORUS_BASS, ...TUTAINA_CHORUS_BASS]

// calm: chords for the marimba arpeggios (C major pentatonic world)
const CALM_CHORDS = [
    [60, 64, 67, 71, 74], // Cmaj9
    [57, 60, 64, 67, 72], // Am7
    [53, 57, 60, 64, 69], // Fmaj7
    [55, 59, 62, 67, 69], // G6
]
// salsa (C major I–IV–V–IV): bass roots and chord tones per bar
const SALSA_BARS = [[36, [60, 64, 67]], [41, [60, 65, 69]], [43, [59, 62, 67]], [41, [60, 65, 69]]]
const CLAVE_32 = [0, 3, 6, 10, 12] // son clave 3-2 over 16 eighths
// reggaetón (Am · F · C · G, a bar each): the 808 root and the plucked chord · the dembow snare ·
// the hook (64 sixteenths = 4 bars; 0 = rest)
const REGGAETON_BARS = [[33, [69, 72, 76]], [29, [65, 69, 72]], [36, [67, 72, 76]], [31, [67, 71, 74]]]
const DEMBOW = [3, 6, 11, 14]
const REGGAETON_HOOK = (() => {
    const out = new Array(64).fill(0)
    const line = [[0, 76], [3, 76], [6, 74], [8, 72], [10, 74], [14, 72], [16, 72], [19, 72], [22, 74], [24, 76], [27, 74], [32, 76], [35, 76], [38, 79], [40, 76], [42, 74], [48, 74], [51, 72], [54, 71], [56, 72]]
    for (const [k, n] of line) out[k] = n
    return out
})()
// techno (A minor: Am · F · G · Em, four bars each): the bass root and the stab
const TECHNO_BARS = [[33, [69, 72, 76]], [29, [65, 69, 72]], [31, [67, 71, 74]], [28, [64, 67, 71]]]

const caliMonth = () => Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', month: 'numeric' }).format(new Date()))

class SoundEngine {
    ctx = null
    enabled = true
    mode = null // 'calm' | 'december' | 'salsa' | null
    step = 0
    nextTime = 0
    ambience = { rain: 0, wind: 0, night: 0, day: 1, city: 0.5 }

    unlock() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume()
            this.unlockMedia()
            return
        }
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return
        // iPhone: the silent switch mutes Web Audio (the laugh, the music…) but not the voice —
        // declaring "playback" makes it sound like a video does
        try {
            if (navigator.audioSession) navigator.audioSession.type = 'playback'
        } catch {
            /* older Safari */
        }
        const ctx = (this.ctx = new AC())
        this.master = ctx.createGain()
        this.master.gain.value = this.masterLevel()
        // a little room so everything sits together
        const comp = ctx.createDynamicsCompressor()
        comp.threshold.value = -18
        this.master.connect(comp).connect(ctx.destination)
        this.reverb = this.makeReverb()
        this.reverb.connect(this.master)
        this.musicBus = ctx.createGain()
        this.musicBus.gain.value = 0
        this.musicBus.connect(this.master)
        this.musicSend = ctx.createGain()
        this.musicSend.gain.value = 0.35
        this.musicBus.connect(this.musicSend).connect(this.reverb)
        this.sfxBus = ctx.createGain()
        this.sfxBus.gain.value = 0.55
        this.sfxBus.connect(this.master)
        this.ambBus = ctx.createGain()
        this.ambBus.gain.value = 0.5
        this.ambBus.connect(this.master)
        this.noise = this.makeNoise()
        this.initMedia()
        this.unlockMedia()
        this.startAmbience()
        this.timer = setInterval(() => this.schedule(), 40)
    }

    setEnabled(on) {
        this.enabled = on
        if (!this.ctx) return
        this.master.gain.setTargetAtTime(this.masterLevel(), this.ctx.currentTime, 0.2)
        this.fileAudio?.[on ? 'play' : 'pause']?.()
    }

    // the listener's own volume (0–1, the slider beside "Sonido") scales everything
    volume = 1
    ducked = false
    masterLevel() {
        return this.enabled ? (this.ducked ? 0.55 : 0.8) * this.volume : 0
    }
    setVolume(v) {
        this.volume = Math.max(0, Math.min(1, v))
        if (!this.ctx) return
        this.master.gain.setTargetAtTime(this.masterLevel(), this.ctx.currentTime, 0.08)
    }

    /** Lower the music while Chonti speaks. */
    duck(on) {
        if (!this.ctx) return
        this.ducked = on
        this.musicSend.gain.setTargetAtTime(on ? 0.15 : 0.35, this.ctx.currentTime, 0.3)
        this.master.gain.setTargetAtTime(this.masterLevel(), this.ctx.currentTime, 0.3)
        if (this.fileAudio) this.setFileVolume(on ? FILE_VOLUME * 0.55 : FILE_VOLUME)
    }
    /** How loud the music of a mode plays (synthesized). */
    musicLevel(mode) {
        return (mode === 'salsa' || mode === 'techno' || mode === 'reggaeton' ? 0.55 : 0.45) * (isCarol(mode) ? CAROL : 1)
    }

    // ── building blocks ─────────────────────────────────────────────────────────
    makeNoise() {
        const len = this.ctx.sampleRate * 2
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
        return buf
    }
    makeReverb() {
        const ctx = this.ctx
        const len = ctx.sampleRate * 2.4
        const buf = ctx.createBuffer(2, len, ctx.sampleRate)
        for (let c = 0; c < 2; c++) {
            const d = buf.getChannelData(c)
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6)
        }
        const conv = ctx.createConvolver()
        conv.buffer = buf
        return conv
    }
    env(gain, t, a, peak, decay) {
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(peak, t + a)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + a + decay)
    }
    tone(t, freq, { type = 'sine', peak = 0.2, a = 0.005, decay = 0.6, out = this.musicBus, detune = 0 } = {}) {
        const o = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        o.type = type
        o.frequency.value = freq
        o.detune.value = detune
        this.env(g, t, a, peak, decay)
        o.connect(g).connect(out)
        o.start(t)
        o.stop(t + a + decay + 0.05)
        return o
    }
    /** Marimba de chonta: wooden bar = fundamental + strong 4th partial, short and warm. */
    marimba(t, n, vel = 1, out = this.musicBus) {
        const f = midi(n)
        const d = 0.9 - (n - 48) * 0.008
        this.tone(t, f, { peak: 0.16 * vel, decay: d, out })
        this.tone(t, f * 3.93, { peak: 0.035 * vel, decay: d * 0.25, out })
        this.tone(t, f * 2, { type: 'triangle', peak: 0.02 * vel, decay: d * 0.4, out })
    }
    /** Music box / celesta for the villancicos. */
    musicBox(t, n, vel = 1) {
        const f = midi(n)
        this.tone(t, f, { peak: 0.13 * vel, decay: 1.6 })
        this.tone(t, f * 2.76, { peak: 0.03 * vel, decay: 0.5 })
        this.tone(t, f * 5.4, { peak: 0.012 * vel, decay: 0.2 })
    }
    pad(t, notes, dur) {
        notes.slice(0, 3).forEach((n) => {
            for (const det of [-7, 7]) {
                const o = this.ctx.createOscillator()
                const f = this.ctx.createBiquadFilter()
                const g = this.ctx.createGain()
                o.type = 'sawtooth'
                o.frequency.value = midi(n - 12)
                o.detune.value = det
                f.type = 'lowpass'
                f.frequency.value = 700
                g.gain.setValueAtTime(0.0001, t)
                g.gain.linearRampToValueAtTime(0.012, t + dur * 0.4)
                g.gain.linearRampToValueAtTime(0.0001, t + dur * 1.1)
                o.connect(f).connect(g).connect(this.musicBus)
                o.start(t)
                o.stop(t + dur * 1.15)
            }
        })
    }
    noiseHit(t, { type = 'bandpass', freq = 1000, q = 1, peak = 0.2, decay = 0.1, out = this.musicBus, rate = 1 } = {}) {
        const s = this.ctx.createBufferSource()
        s.buffer = this.noise
        s.playbackRate.value = rate
        const f = this.ctx.createBiquadFilter()
        f.type = type
        f.frequency.value = freq
        f.Q.value = q
        const g = this.ctx.createGain()
        this.env(g, t, 0.003, peak, decay)
        s.connect(f).connect(g).connect(out)
        s.start(t, Math.random())
        s.stop(t + decay + 0.1)
        return { f, g }
    }

    // ── music ───────────────────────────────────────────────────────────────────
    setMusic(mode) {
        if (!this.ctx || mode === this.mode) return
        this.mode = mode
        const now = this.ctx.currentTime
        this.musicBus.gain.cancelScheduledValues(now)
        this.musicBus.gain.setTargetAtTime(0, now, 0.4)
        this.fileAudio?.pause()
        this.fileAudio = null
        clearTimeout(this.switchTimer)
        this.switchTimer = setTimeout(() => {
            this.step = 0
            this.nextTime = this.ctx.currentTime + 0.1
            this.song = mode === 'december' ? 0 : mode === 'alumbrado' ? 2 : this.song
            this.songStep = 0
            const files = mode && AUDIO.music?.[mode]
            if (files?.length) this.playFiles(files)
            else if (mode) this.musicBus.gain.setTargetAtTime(this.musicLevel(mode), this.ctx.currentTime, 0.8)
        }, 900)
    }
    /**
     * ONE audio element for the recordings (the Tutaina), unlocked at the first touch. iPhones only
     * let an element play if it was started inside a touch — the music starts a moment after you
     * pick the Alumbrado, so a new element was refused and the synthesized carol played instead.
     * It goes through Web Audio, because on iPhones an element's own volume can't be lowered.
     */
    initMedia() {
        if (this.fileEl || typeof Audio === 'undefined') return
        const el = (this.fileEl = new Audio())
        el.preload = 'auto'
        this.fileGain = this.ctx.createGain()
        this.fileGain.gain.value = FILE_VOLUME
        try {
            this.ctx.createMediaElementSource(el).connect(this.fileGain).connect(this.master)
            this.fileRouted = true
        } catch {
            this.fileRouted = false
        }
    }
    /** Called on every touch until it works: a silent play inside the gesture unlocks the element. */
    unlockMedia() {
        const el = this.fileEl
        if (!el || this.mediaUnlocked || this.fileAudio) return
        el.src = SILENT
        el.play()
            .then(() => {
                if (!this.fileAudio) el.pause()
                this.mediaUnlocked = true
            })
            .catch(() => {})
    }
    /**
     * Recordings come mastered much louder than the synthesized music: each one is measured once
     * (its average level, RMS) and brought to the level of the rest — so 60% of the music really
     * sounds like 60%, not like a loud record turned down a little.
     */
    measureFile(src) {
        if (!this.ctx || this.fileNorm.has(src)) return
        this.fileNorm.set(src, null)
        fetch(src)
            .then((r) => r.arrayBuffer())
            .then((b) => this.ctx.decodeAudioData(b))
            .then((buf) => {
                const d = buf.getChannelData(0)
                let sum = 0, n = 0
                for (let i = 0; i < d.length; i += 16) (sum += d[i] * d[i]), n++
                const rms = Math.sqrt(sum / Math.max(1, n)) || REF_RMS
                this.fileNorm.set(src, Math.min(1.5, Math.max(0.15, REF_RMS / rms)))
                if (this.fileAudio) this.setFileVolume(this.ducked ? FILE_VOLUME * 0.55 : FILE_VOLUME)
            })
            .catch(() => this.fileNorm.set(src, 1))
    }
    fileNorm = new Map()
    setFileVolume(v) {
        v *= this.fileNorm.get(this.fileSrc) ?? 0.5 // (brought to the level of the other music; soft while it is measured)
        if (isCarol(this.mode)) v *= CAROL // (the carols: 60% at most)
        if (this.fileRouted) this.fileGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.3)
        else if (this.fileEl) this.fileEl.volume = v
    }
    playFiles(list) {
        const el = this.fileEl
        const fallback = () => {
            if (this.fileAudio !== el) return
            this.fileAudio = null // no such file / not allowed → the synthesized version
            this.musicBus.gain.setTargetAtTime(this.musicLevel(this.mode), this.ctx.currentTime, 0.8)
        }
        if (!el) return
        const src = list[Math.floor(Math.random() * list.length)]
        el.onended = () => this.fileAudio === el && this.playFiles(list)
        el.onerror = fallback
        el.loop = list.length === 1
        el.src = src.replace(/^\//, '') // relative to the page (works from a sub-folder too)
        this.fileSrc = el.src
        this.measureFile(el.src)
        this.fileAudio = el
        this.setFileVolume(FILE_VOLUME)
        if (this.enabled) el.play().catch(fallback)
    }
    schedule() {
        if (!this.ctx || !this.mode || this.fileAudio) return
        const ahead = this.ctx.currentTime + 0.15
        while (this.nextTime < ahead) {
            const dur = this[this.mode](this.step, this.nextTime)
            this.nextTime += dur
            this.step++
        }
    }
    calm(i, t) {
        const e = 0.36 // eighth
        const chord = CALM_CHORDS[Math.floor(i / 16) % CALM_CHORDS.length]
        if (i % 16 === 0) this.pad(t, chord, e * 16)
        if (i % 16 === 0) this.marimba(t, chord[0] - 12, 0.7)
        const pattern = [0, 2, 4, 3, 1, 4, 2, 3]
        if (Math.random() < (i % 2 ? 0.45 : 0.8)) this.marimba(t, chord[pattern[i % 8]] + (Math.random() < 0.2 ? 12 : 0), 0.6 + Math.random() * 0.3)
        return e
    }
    december(i, t, order = [0, 1, 2]) {
        // plays the villancicos one after the other, step = one eighth of 6/8
        if (!this.tune || i === 0) this.loadTune(this.song ?? order[0])
        const T = this.tune
        const bar = T.bar ?? 6 // eighths per bar: 6/8, or 2/4 (4) for the Tutaina
        if (T.at === i && T.idx < T.notes.length) {
            const [n, d] = T.notes[T.idx]
            this.musicBox(t, n, 0.9)
            if (T.bright) this.marimba(t, n, 0.75) // a clear, singing lead you can follow
            T.at += d
            T.idx++
        }
        if (T.shaker) this.noiseHit(t, { type: 'highpass', freq: 6500, peak: i % (bar / 2) === 0 ? 0.05 : 0.025, decay: 0.05 }) // maracas
        if (i % bar === 0) {
            const b = T.bass[Math.floor(i / bar) % T.bass.length]
            this.marimba(t, b - 12, 0.7)
            this.marimba(t + T.e * (bar / 2), b - 5, 0.4)
        }
        if (T.idx >= T.notes.length && i >= T.at + bar) {
            this.songStep = ((this.songStep ?? 0) + 1) % order.length
            this.song = order[this.songStep]
            this.step = -1
            this.tune = null
        }
        return T.e
    }
    loadTune(k) {
        const TUNES = [
            { notes: NOCHE_DE_PAZ, bass: NOCHE_BASS, e: 0.26 },
            { notes: AGUINALDO, bass: AGUINALDO_BASS, e: 0.19 },
            { notes: TUTAINA, bass: TUTAINA_BASS, e: 0.24, bar: 4, shaker: true, bright: true },
        ]
        this.tune = { ...TUNES[k % TUNES.length], at: 0, idx: 0 }
    }
    /** Alumbrado: the Tutaina (with maracas), over and over. */
    alumbrado(i, t) {
        this.song = 2
        return this.december(i, t, [2])
    }
    salsa(i, t) {
        const e = 0.17
        const pos = i % 16
        const [root, chord] = SALSA_BARS[Math.floor(i / 8) % SALSA_BARS.length]
        // clave (woodblock)
        if (CLAVE_32.includes(pos)) this.tone(t, 2200, { peak: 0.12, decay: 0.05 })
        // congas: slap on 2, open tones on 4 and 4&
        const bp = pos % 8
        if (bp === 2) this.noiseHit(t, { freq: 900, q: 2, peak: 0.12, decay: 0.07 })
        if (bp === 6 || bp === 7) {
            const o = this.tone(t, bp === 6 ? 220 : 196, { peak: 0.2, decay: 0.28 })
            o.frequency.exponentialRampToValueAtTime(bp === 6 ? 180 : 160, t + 0.2)
        }
        // bass tumbao: on 2& and 4 (anticipating the chord)
        if (bp === 3 || bp === 6) this.tone(t, midi(bp === 6 ? SALSA_BARS[(Math.floor(i / 8) + 1) % 4][0] : root), { type: 'triangle', peak: 0.28, decay: 0.45 })
        // piano montuno (marimba-ish), syncopated
        const mont = [0, 1, 2, 1, 0, 2, 1, 2]
        if (bp !== 4) this.marimba(t, chord[mont[bp]] + 12, 0.55)
        // a little shaker
        this.noiseHit(t, { type: 'highpass', freq: 7000, peak: i % 2 ? 0.02 : 0.035, decay: 0.04 })
        return e
    }

    /**
     * Sucursal Fest: techno at 128 BPM, step = a sixteenth. Four-on-the-floor kick, open hats on
     * the off-beats, claps on 2 and 4, a rolling bass that ducks under the kick (sidechain feel)
     * with a slow filter sweep, and short minor stabs every two bars. A 32-bar arc: the kick
     * drops out for a 4-bar break, then everything comes back in.
     */
    techno(i, t) {
        const e = 60 / 128 / 4
        const pos = i % 16
        const bar = Math.floor(i / 16) % 32
        const brk = bar >= 24 && bar < 28 // the break
        const [root, stab] = TECHNO_BARS[Math.floor(i / 64) % TECHNO_BARS.length]
        // kick: a sine dropping fast in pitch + a click
        if (!brk && pos % 4 === 0) {
            const o = this.tone(t, 150, { peak: 0.5, a: 0.002, decay: 0.32 })
            o.frequency.setValueAtTime(150, t)
            o.frequency.exponentialRampToValueAtTime(45, t + 0.12)
            this.noiseHit(t, { type: 'highpass', freq: 3000, peak: 0.04, decay: 0.01 })
        }
        // hats: closed on every sixteenth (soft), open on the off-beats
        this.noiseHit(t, { type: 'highpass', freq: 9000, peak: pos % 2 ? 0.018 : 0.012, decay: 0.025 })
        if (pos % 4 === 2) this.noiseHit(t, { type: 'highpass', freq: 7000, peak: 0.06, decay: 0.16 })
        // clap on 2 and 4 (three quick layers of noise)
        if (pos === 4 || pos === 12) for (const d of [0, 0.012, 0.024]) this.noiseHit(t + d, { type: 'bandpass', freq: 1500, q: 1.2, peak: 0.12, decay: d === 0.024 ? 0.14 : 0.02 })
        // rolling bass: the three sixteenths after each kick, through a sweeping low-pass
        if (pos % 4 !== 0) {
            const o = this.ctx.createOscillator()
            const f = this.ctx.createBiquadFilter()
            const g = this.ctx.createGain()
            o.type = 'sawtooth'
            o.frequency.value = midi(root + (pos % 8 === 7 ? 12 : 0))
            f.type = 'lowpass'
            f.frequency.value = 260 + 900 * (0.5 + 0.5 * Math.sin((i / 256) * Math.PI * 2)) * (brk ? 0.4 : 1)
            f.Q.value = 6
            this.env(g, t, 0.004, 0.16, e * 0.9)
            o.connect(f).connect(g).connect(this.musicBus)
            o.start(t)
            o.stop(t + e + 0.05)
        }
        // stabs: a short minor chord on the "and" of 1, every two bars (and a riser in the break)
        if (pos === 2 && bar % 2 === 0) stab.forEach((n) => this.tone(t, midi(n), { type: 'square', peak: 0.03, decay: 0.18, detune: 8 }))
        if (brk && pos === 0) {
            const { f } = this.noiseHit(t, { type: 'bandpass', freq: 400 + (bar - 24) * 700, q: 2, peak: 0.07, decay: e * 16 })
            f.frequency.exponentialRampToValueAtTime(800 + (bar - 23) * 900, t + e * 16)
        }
        return e
    }

    /**
     * Sucursal Fest: reggaetón, bien movido — the dembow at 96 BPM, step = a sixteenth. Kick on every
     * beat, the snare on the dembow's "tun-cha-tun-cha" (3 · 6 · 11 · 14), hats on the eighths and a
     * shaker in between, an 808 bass that slides with the kick, short plucked chords off the beat
     * (Am · F · C · G) and, every other phrase, a little hook on top. A fill closes every 8 bars.
     */
    reggaeton(i, t) {
        const e = 60 / 96 / 4
        const pos = i % 16
        const bar = Math.floor(i / 16)
        const [root, chord] = REGGAETON_BARS[bar % REGGAETON_BARS.length]
        const fill = bar % 8 === 7 && pos >= 12
        // kick: a round thump on every beat
        if (pos % 4 === 0) {
            const o = this.tone(t, 120, { peak: 0.55, a: 0.002, decay: 0.28 })
            o.frequency.setValueAtTime(120, t)
            o.frequency.exponentialRampToValueAtTime(48, t + 0.1)
        }
        // the dembow snare (a crisp noise + a little tone body); in the fill, every sixteenth
        if (DEMBOW.includes(pos) || fill) {
            this.noiseHit(t, { type: 'bandpass', freq: 2200, q: 0.9, peak: fill ? 0.09 : 0.14, decay: 0.09 })
            this.tone(t, 210, { type: 'triangle', peak: 0.06, decay: 0.07 })
        }
        // hats on the eighths (an open one before the 4) and a soft shaker on the rest
        if (pos % 2 === 0) this.noiseHit(t, { type: 'highpass', freq: 8500, peak: pos === 14 ? 0.05 : 0.025, decay: pos === 14 ? 0.12 : 0.03 })
        else this.noiseHit(t, { type: 'highpass', freq: 6000, peak: 0.012, decay: 0.03 })
        // 808 bass: long, sliding down into each kick of the phrase (1 · the "a" of 2 · 3)
        if (pos === 0 || pos === 7 || pos === 8) {
            const o = this.tone(t, midi(root + (pos === 7 ? 12 : 0)), { type: 'sine', peak: 0.32, a: 0.005, decay: pos === 7 ? 0.16 : 0.5 })
            o.frequency.exponentialRampToValueAtTime(midi(root), t + 0.08)
        }
        // plucked chords, off the beat
        if (pos === 2 || pos === 6 || pos === 10 || pos === 13) chord.forEach((n) => this.tone(t, midi(n), { type: 'triangle', peak: 0.035, decay: 0.16 }))
        // the hook (every other 4-bar phrase): a short sing-along line in the marimba
        if (Math.floor(bar / 4) % 2 === 1) {
            const step = REGGAETON_HOOK[(bar % 4) * 16 + pos]
            if (step) this.marimba(t, step, 0.7)
        }
        return e
    }

    // ── ambience ────────────────────────────────────────────────────────────────
    loopNoise(filterType, freq, q = 0.7) {
        const s = this.ctx.createBufferSource()
        s.buffer = this.noise
        s.loop = true
        const f = this.ctx.createBiquadFilter()
        f.type = filterType
        f.frequency.value = freq
        f.Q.value = q
        const g = this.ctx.createGain()
        g.gain.value = 0
        s.connect(f).connect(g).connect(this.ambBus)
        s.start()
        return { f, g }
    }
    startAmbience() {
        this.rain = this.loopNoise('lowpass', 1600)
        this.rainHi = this.loopNoise('highpass', 5000)
        this.wind = this.loopNoise('bandpass', 380, 0.6)
        this.city = this.loopNoise('lowpass', 260)
        this.ambTimer = setInterval(() => this.ambienceTick(), 250)
    }
    setAmbience(a) {
        Object.assign(this.ambience, a)
        if (!this.ctx) return
        const t = this.ctx.currentTime
        const A = this.ambience
        this.rain.g.gain.setTargetAtTime(A.rain * 0.22, t, 0.8)
        this.rainHi.g.gain.setTargetAtTime(A.rain * 0.05, t, 0.8)
        this.wind.g.gain.setTargetAtTime(0.012 + A.wind * 0.12, t, 1.2)
        this.city.g.gain.setTargetAtTime(A.city * 0.05, t, 1.2)
    }
    ambienceTick() {
        if (!this.ctx || !this.enabled) return
        const A = this.ambience
        const t = this.ctx.currentTime
        // wind gusts
        this.wind.f.frequency.setTargetAtTime(300 + Math.sin(t * 0.3) * 120 + A.wind * 200, t, 0.5)
        // birds by day (not in the rain)
        if (A.day > 0.5 && A.rain < 0.3 && Math.random() < 0.035) {
            const base = 2200 + Math.random() * 1800
            const n = 2 + Math.floor(Math.random() * 4)
            for (let k = 0; k < n; k++) {
                const tt = t + k * 0.11
                const o = this.tone(tt, base, { peak: 0.025, decay: 0.07, out: this.ambBus })
                o.frequency.exponentialRampToValueAtTime(base * (1.3 + Math.random() * 0.4), tt + 0.06)
            }
        }
        // crickets at night
        if (A.night > 0.5 && A.rain < 0.5 && Math.random() < 0.25) {
            for (let k = 0; k < 3; k++) this.tone(t + k * 0.045, 4600 + Math.random() * 200, { peak: 0.012, decay: 0.02, out: this.ambBus })
        }
    }

    // ── effects ─────────────────────────────────────────────────────────────────
    play(name) {
        if (!this.ctx || !this.enabled) return
        const t = this.ctx.currentTime + 0.01
        const out = this.sfxBus
        switch (name) {
            case 'click':
                this.marimba(t, 79, 0.6, out)
                break
            case 'hover':
                this.tone(t, 1800, { peak: 0.015, decay: 0.03, out })
                break
            case 'pop': {
                const o = this.tone(t, 500, { peak: 0.18, decay: 0.15, out })
                o.frequency.exponentialRampToValueAtTime(1100, t + 0.1)
                break
            }
            case 'boing': {
                const o = this.tone(t, 300, { type: 'triangle', peak: 0.2, decay: 0.45, out })
                o.frequency.setValueAtTime(300, t)
                o.frequency.exponentialRampToValueAtTime(700, t + 0.08)
                o.frequency.exponentialRampToValueAtTime(380, t + 0.3)
                break
            }
            case 'laugh': {
                // a short child's "ja ja ja ja ja" on the rhythm of his belly laugh (one "ja" per
                // bounce, ~0.21 s apart, ~1.1 s in all): a breathy "h" + a voiced "a" (a buzzy
                // tone through the two formants of the vowel), each one a bit lower and softer
                for (let k = 0; k < 5; k++) {
                    const s = t + k * 0.21
                    const f0 = 470 - k * 22
                    const vel = 1 - k * 0.12
                    this.noiseHit(s, { type: 'bandpass', freq: 1900, q: 0.9, peak: 0.05 * vel, decay: 0.05, out })
                    const voice = this.ctx.createGain()
                    voice.gain.setValueAtTime(0.0001, s + 0.03)
                    voice.gain.exponentialRampToValueAtTime(0.16 * vel, s + 0.05)
                    voice.gain.exponentialRampToValueAtTime(0.0001, s + 0.17)
                    ;[[820, 6], [1250, 8]].forEach(([fq, q], i) => {
                        const f = this.ctx.createBiquadFilter()
                        f.type = 'bandpass'
                        f.frequency.value = fq
                        f.Q.value = q
                        const g = this.ctx.createGain()
                        g.gain.value = i === 0 ? 1.4 : 0.8
                        voice.connect(f).connect(g).connect(out)
                    })
                    const o = this.ctx.createOscillator()
                    o.type = 'sawtooth'
                    o.frequency.setValueAtTime(f0 * 1.06, s + 0.03)
                    o.frequency.exponentialRampToValueAtTime(f0 * 0.88, s + 0.17)
                    o.connect(voice)
                    o.start(s + 0.03)
                    o.stop(s + 0.2)
                }
                break
            }
            case 'giggle': {
                // a little "ji ji ji": quick bright chirps that fall in pitch, each with a wobble
                ;[0, 0.13, 0.26, 0.4].forEach((d, i) => {
                    const f0 = 880 - i * 70
                    const o = this.tone(t + d, f0, { type: 'triangle', peak: 0.09, a: 0.01, decay: 0.1, out })
                    o.frequency.setValueAtTime(f0, t + d)
                    o.frequency.exponentialRampToValueAtTime(f0 * 1.25, t + d + 0.04)
                    o.frequency.exponentialRampToValueAtTime(f0 * 0.9, t + d + 0.1)
                })
                break
            }
            case 'chime':
                this.musicBox(t, 84, 0.8)
                this.musicBox(t + 0.12, 88, 0.8)
                this.musicBox(t + 0.24, 91, 0.8)
                break
            case 'page':
                this.noiseHit(t, { type: 'bandpass', freq: 3000, q: 0.6, peak: 0.08, decay: 0.18, out })
                break
            case 'whoosh': {
                const { f } = this.noiseHit(t, { type: 'bandpass', freq: 300, q: 0.8, peak: 0.25, decay: 1.6, out })
                f.frequency.exponentialRampToValueAtTime(2400, t + 1.4)
                break
            }
            case 'open': {
                const { f } = this.noiseHit(t, { type: 'lowpass', freq: 400, q: 0.5, peak: 0.18, decay: 3, out })
                f.frequency.exponentialRampToValueAtTime(3000, t + 2.5)
                this.musicBox(t + 0.8, 79, 0.5)
                this.musicBox(t + 1.1, 84, 0.5)
                break
            }
            case 'magic': {
                // ¡puf! a soft puff of smoke + a twinkling glissando up
                const { f } = this.noiseHit(t, { type: 'bandpass', freq: 900, q: 0.7, peak: 0.16, decay: 0.5, out })
                f.frequency.exponentialRampToValueAtTime(3200, t + 0.4)
                ;[72, 76, 79, 84, 88, 91, 96].forEach((n, i) => this.musicBox(t + 0.05 + i * 0.045, n, 0.55))
                break
            }
            case 'fall': {
                // falling: a cartoon slide whistle going down + the air rushing past
                const o = this.tone(t, 1300, { type: 'sine', peak: 0.07, a: 0.05, decay: 2.6, out })
                o.frequency.setValueAtTime(1300, t)
                o.frequency.exponentialRampToValueAtTime(240, t + 2.5)
                const { f } = this.noiseHit(t, { type: 'bandpass', freq: 250, q: 0.6, peak: 0.3, decay: 3.6, out })
                f.frequency.exponentialRampToValueAtTime(1600, t + 3)
                break
            }
            case 'thunder': {
                this.noiseHit(t, { type: 'highpass', freq: 1500, peak: 0.3, decay: 0.25, out })
                const { f } = this.noiseHit(t + 0.05, { type: 'lowpass', freq: 220, q: 0.4, peak: 0.6, decay: 3.4, out, rate: 0.5 })
                f.frequency.exponentialRampToValueAtTime(60, t + 3)
                break
            }
            default:
        }
    }
    thunder(delay = 0.6) {
        setTimeout(() => this.play('thunder'), delay * 1000)
    }
}

export const sound = new SoundEngine()
export const isDecember = () => caliMonth() === 12
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') window.__sound = sound
