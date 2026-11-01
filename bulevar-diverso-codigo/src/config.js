import { TIMELINE } from './data/content.js'

// World layout. The intro happens high in the sky (INTRO_Y); the island floats at the origin.
// The reveal is literally a camera dive from one to the other, through the clouds.
export const INTRO_Y = 60
export const ISLAND_TOP = 0.3

/**
 * The intro is ONE vertical scroll (0 → 1), split in stages:
 *  1. WALK      0.00–0.20  cream screen (#FFFDF5), Chonti walks slowly left → right, camera follows a bit
 *  2. DISCOVER  0.20–0.30  Chonti stops; the cream backdrop disappears and the timeline appears BEHIND him
 *  3. TIMELINE  0.30–0.80  the timeline slides VERTICALLY DOWN with the scroll; Chonti stays and reads
 *  4. FALL      0.80       end of the timeline → AUTOMATIC sequence (scroll locks): he looks down,
 *                          the floor is gone, cannon-es drops him behind soft clouds
 * (fractions of the desktop runway). Each stage is a scroll length in vh; on phones Chonti's walk
 * takes much less scrolling (the screen is narrow), so the fractions are recomputed from them.
 */
const narrowScreen = typeof window !== 'undefined' && window.innerWidth < 800
const LENGTH_VH = { walk: narrowScreen ? 70 : 200, discover: 100, timeline: 500, tail: 200 }
/** Height of the intro's scroll runway (vh). */
export const RUNWAY_VH = LENGTH_VH.walk + LENGTH_VH.discover + LENGTH_VH.timeline + LENGTH_VH.tail
const at = (vh) => vh / RUNWAY_VH
export const STAGES = {
    walk: [0, at(LENGTH_VH.walk)],
    discover: [at(LENGTH_VH.walk), at(LENGTH_VH.walk + LENGTH_VH.discover)],
    timeline: [at(LENGTH_VH.walk + LENGTH_VH.discover), at(LENGTH_VH.walk + LENGTH_VH.discover + LENGTH_VH.timeline)],
}
export const FALL_AT = STAGES.timeline[1]
export const stageProgress = (p, [a, b]) => Math.min(1, Math.max(0, (p - a) / (b - a)))

/**
 * Timeline choreography shared by the 2D (IntroTimeline) and the 3D (Chonti's reactions):
 * the timeline stage is split in N + HEAD_SLOT slots; the header leaves in the first part,
 * then date i owns slot [i, i + 1): enters from the top, rests, leaves through the bottom.
 * Returns the slot coordinate for a stage-3 progress s3 (0..1).
 */
export const TIMELINE_HEAD_SLOT = 0.4
export const timelineSlot = (s3) => s3 * (TIMELINE.length + TIMELINE_HEAD_SLOT) - TIMELINE_HEAD_SLOT

// The sea of soft clouds Chonti falls into (seen from above), between the sky stage and the island
export const CLOUD_SEA = { top: 47, bottom: 36, halfX: 34, halfZ: 26 }

export const CAMERA = {
    intro: { position: [0, INTRO_Y + 1.2, 11], target: [0, INTRO_Y + 0.9, 0] },
    // Diagonal 3/4 view of the long island (like an architectural model).
    stage: { position: [-16, 27, 37], target: [1.5, -3.2, 0] },
}

// Responsive camera: wider FOV and a farther stage camera on portrait/narrow screens.
export const fovFor = (aspect) => (aspect < 0.8 ? 55 : aspect < 1.2 ? 48 : 40)
export const stageDistanceFactor = (aspect) => Math.min(2.2, Math.max(1, 1.5 / aspect))

export const PHASES = {
    LOADING: 'loading', // assets streaming, cream loader
    INTRO: 'intro', // scroll-driven stages 1–3
    FALLING: 'falling', // automatic: look down, fall (cannon-es, cenital camera), scroll locked
    REVEAL: 'reveal', // the cloud sea opens, the island appears from above, camera glides to the map
    GUIDE_PROMPT: 'guidePrompt', // over the map: "¿Deseas que Chonti te acompañe como guía?"
    STAGE: 'stage', // menu; camera locked until a category is chosen (then free for good)
}

export const MODES = ['lugares', 'eventos', 'rutas']

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
