import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PALETTE, mix, shade } from '../theme.js'
import { islandMaterials } from './materials.js'
import { skyState } from './skyState.js'
import { skyOf, useExperience } from '../store/useExperience.js'
import { PHASES } from '../config.js'
import { sound } from '../audio/sound.js'

// Phases where the canvas is TRANSPARENT: the cream page and the DOM timeline show through it
const SEE_THROUGH = [PHASES.LOADING, PHASES.INTRO]

/**
 * Cali's sky through the day. Keyframes by hour, blended smoothly:
 * madrugada → amanecer → mañana → mediodía → tarde → atardecer (the warm palette sunset)
 * → anochecer → noche estrellada. Numbers: fog distances, light intensities, `dark` (how much the
 * island materials darken), windows (lit at night), stars / moon / sun disc visibility.
 */
const NIGHT = {
    skyTop: '#0B1222', skyHorizon: '#1E2638', skyBottom: '#0E1420', glow: '#DCE4F2', fog: '#141B28', fogNear: 60, fogFar: 160,
    hemiSky: '#4A5878', hemiGround: '#1B1F18', hemi: 0.55, sun: '#A9BCDB', sunI: 0.5,
    dark: 1, windows: 1.15, stars: 1, disc: 0, moon: 1, riverGlow: 0.1, cloudLight: '#5A6480', cloudShade: '#2A3142',
}
const KEYS = [
    [0, NIGHT],
    [5.2, { ...NIGHT, skyTop: '#1A2034', skyHorizon: '#4A3D4E', skyBottom: '#151A26', glow: '#F2B6A0', hemi: 0.6, dark: 0.9, windows: 1, stars: 0.8, moon: 0.6, cloudLight: '#6A6678', cloudShade: '#3A3546' }],
    [6.3, {
        skyTop: '#8C90AE', skyHorizon: '#F6A574', skyBottom: '#E7B8A8', glow: '#FFD9A8', fog: '#D9B7A6', fogNear: 65, fogFar: 165,
        hemiSky: '#F3C7B0', hemiGround: '#5E6B33', hemi: 1.0, sun: '#FFB27A', sunI: 1.4,
        dark: 0.35, windows: 0.5, stars: 0.1, disc: 1, moon: 0, riverGlow: 0.04, cloudLight: '#FFE2CC', cloudShade: '#C89AA0',
    }],
    [8, {
        skyTop: '#9DC7E0', skyHorizon: '#F3EBD8', skyBottom: '#EFE7D6', glow: '#FFF6DE', fog: '#E4E8E2', fogNear: 70, fogFar: 175,
        hemiSky: '#EAF1F2', hemiGround: shade(PALETTE.verde, 0.8), hemi: 1.45, sun: '#FFF1D6', sunI: 2.6,
        dark: 0, windows: 0, stars: 0, disc: 1, moon: 0, riverGlow: 0, cloudLight: '#FFFFFF', cloudShade: '#D9DEE6',
    }],
    [12.5, {
        skyTop: '#86BCDD', skyHorizon: '#EAF1EE', skyBottom: '#E8EEE8', glow: '#FFFDF5', fog: '#E2EAEA', fogNear: 75, fogFar: 180,
        hemiSky: '#F2F6F2', hemiGround: shade(PALETTE.verde, 0.8), hemi: 1.6, sun: '#FFFBEF', sunI: 3.0,
        dark: 0, windows: 0, stars: 0, disc: 1, moon: 0, riverGlow: 0, cloudLight: '#FFFFFF', cloudShade: '#DDE3EA',
    }],
    [16, {
        skyTop: '#95C3DC', skyHorizon: '#F6EAD0', skyBottom: '#F1E6D3', glow: '#FFEFD2', fog: '#EADFD0', fogNear: 72, fogFar: 175,
        hemiSky: '#F6EBDD', hemiGround: shade(PALETTE.verde, 0.8), hemi: 1.5, sun: '#FFE6BF', sunI: 2.7,
        dark: 0, windows: 0, stars: 0, disc: 1, moon: 0, riverGlow: 0, cloudLight: '#FFFDF5', cloudShade: '#E8D8D2',
    }],
    [17.7, {
        // the warm Bulevar Diverso sunset (palette)
        skyTop: mix(PALETTE.rosa, PALETTE.naranja, 0.3), skyHorizon: mix(PALETTE.mango, PALETTE.crema, 0.3), skyBottom: mix(PALETTE.crema, PALETTE.rosa, 0.25),
        glow: PALETTE.crema, fog: mix(PALETTE.crema, PALETTE.mango, 0.35), fogNear: 70, fogFar: 170,
        hemiSky: mix(PALETTE.crema, PALETTE.rosa, 0.35), hemiGround: shade(PALETTE.verde, 0.8), hemi: 1.4, sun: mix(PALETTE.crema, PALETTE.mango, 0.45), sunI: 2.3,
        dark: 0.05, windows: 0.15, stars: 0, disc: 1, moon: 0, riverGlow: 0.03, cloudLight: PALETTE.crema, cloudShade: mix(PALETTE.crema, PALETTE.rosa, 0.35),
    }],
    [18.5, {
        skyTop: '#3A3656', skyHorizon: '#E07A4F', skyBottom: '#4A3A4C', glow: '#FF9E7A', fog: '#4A3D4A', fogNear: 62, fogFar: 160,
        hemiSky: '#8E7488', hemiGround: '#2D2A1C', hemi: 0.8, sun: '#FF9A6A', sunI: 0.9,
        dark: 0.6, windows: 0.85, stars: 0.35, disc: 0.6, moon: 0.2, riverGlow: 0.08, cloudLight: '#C98B8A', cloudShade: '#5A4558',
    }],
    [19.4, NIGHT],
    [24, NIGHT],
]
const COLOR_FIELDS = ['skyTop', 'skyHorizon', 'skyBottom', 'glow', 'fog', 'hemiSky', 'hemiGround', 'sun', 'cloudLight', 'cloudShade']
const NUM_FIELDS = ['fogNear', 'fogFar', 'hemi', 'sunI', 'dark', 'windows', 'stars', 'disc', 'moon', 'riverGlow', 'cover', 'rain', 'flashOk', 'wind']
const toMood = (src) => {
    const m = { cover: 0.12, rain: 0, flashOk: 0, wind: 0.15, ...src }
    COLOR_FIELDS.forEach((k) => (m[k] = new THREE.Color(src[k])))
    return m
}
const KEYFRAMES = KEYS.map(([h, v]) => [h, toMood(v)])
const newMood = () => toMood(NIGHT)
// The cream intro page: a fixed, soft studio light (Chonti must never look burnt or dark there,
// whatever the real hour in Cali); the real sky takes over from the fall on.
const STUDIO = toMood({
    ...KEYS.find(([h]) => h === 12.5)[1],
    hemiSky: '#FFF6EC', hemiGround: '#E9D8C4', hemi: 1.9, sun: '#FFF4E4', sunI: 1.9, fogNear: 300, fogFar: 600,
})
const copyMood = (out, a) => {
    COLOR_FIELDS.forEach((k) => out[k].copy(a[k]))
    NUM_FIELDS.forEach((k) => (out[k] = a[k] ?? 0))
}

/** Writes the mood of `hour` into `out`. */
function sample(hour, out) {
    const h = ((hour % 24) + 24) % 24
    let i = 0
    while (i < KEYFRAMES.length - 2 && KEYFRAMES[i + 1][0] <= h) i++
    const [h0, a] = KEYFRAMES[i], [h1, b] = KEYFRAMES[i + 1]
    const x = THREE.MathUtils.clamp((h - h0) / (h1 - h0 || 1), 0, 1)
    const t = x * x * (3 - 2 * x)
    COLOR_FIELDS.forEach((k) => out[k].copy(a[k]).lerp(b[k], t))
    NUM_FIELDS.forEach((k) => (out[k] = THREE.MathUtils.lerp(a[k] ?? 0, b[k] ?? 0, t)))
    return out
}

// Weather: greys the sky, dims the sun, brings the fog closer, adds clouds near the island,
// rain, wind and lightning. (g = how much the sky turns grey)
const WEATHER = {
    clear: null,
    partly: { g: 0.15, day: '#C9CFD1', night: '#22262C', sun: 0.85, hemi: 1, fog: [65, 170], cover: 0.4, rain: 0, wind: 0.25 },
    windy: { g: 0.1, day: '#D4D6CF', night: '#22262C', sun: 0.95, hemi: 1, fog: [65, 170], cover: 0.35, rain: 0, wind: 1 },
    cloudy: { g: 0.45, day: '#AEB4B7', night: '#1E2228', sun: 0.5, hemi: 0.95, fog: [50, 150], cover: 0.8, rain: 0, wind: 0.35 },
    fog: { g: 0.55, day: '#D7DBD8', night: '#2A2F35', sun: 0.45, hemi: 0.95, fog: [7, 58], cover: 0.5, rain: 0, wind: 0.05, fogTint: 0.85 },
    drizzle: { g: 0.55, day: '#9EA6AA', night: '#1A1D22', sun: 0.4, hemi: 0.9, fog: [42, 130], cover: 0.85, rain: 0.32, wind: 0.3 },
    rain: { g: 0.7, day: '#8E979C', night: '#171A1F', sun: 0.28, hemi: 0.82, fog: [35, 115], cover: 0.95, rain: 0.75, wind: 0.5 },
    storm: { g: 0.82, day: '#5F676E', night: '#111418', sun: 0.15, hemi: 0.7, fog: [28, 100], cover: 1, rain: 1, flash: 1, wind: 0.85 },
}
const grey = new THREE.Color()
const greyNight = new THREE.Color()
function applyWeather(m, weather) {
    const w = WEATHER[weather]
    if (!w) return m
    grey.set(w.day).lerp(greyNight.set(w.night), m.dark)
    m.skyTop.lerp(grey, w.g)
    m.skyHorizon.lerp(grey, w.g * 0.8)
    m.skyBottom.lerp(grey, w.g)
    m.glow.lerp(grey, w.g * 0.6)
    m.fog.lerp(grey, w.fogTint ?? 0.55)
    m.hemiSky.lerp(grey, w.g * 0.4)
    m.cloudLight.lerp(grey, 0.35)
    m.cloudShade.lerp(grey, 0.6)
    m.sunI *= w.sun
    m.hemi *= w.hemi
    m.fogNear = Math.min(m.fogNear, w.fog[0])
    m.fogFar = Math.min(m.fogFar, w.fog[1])
    m.disc *= w.g < 0.2 ? 0.8 : 0.1
    m.stars *= w.g < 0.2 ? 0.7 : weather === 'cloudy' ? 0.25 : 0
    m.moon *= w.g < 0.2 ? 0.8 : weather === 'cloudy' ? 0.3 : 0
    m.cover = w.cover
    m.rain = w.rain
    m.wind = w.wind
    m.flashOk = w.flash ?? 0
    return m
}

// Events add their touch on top of the sky (the sky itself is set by the event in the panel:
// Feria → mañana despejada, Alumbrado → noche, Sucursal → noche de concierto)
const ROSA = new THREE.Color(PALETTE.rosa)
const CREMA = new THREE.Color(PALETTE.crema)
function eventTweaks(event, m) {
    if (event === 'feria') {
        // bright, natural light under the trees
        m.sunI *= 1.12
        m.hemi *= 1.15
        m.skyHorizon.lerp(CREMA, 0.25 * (1 - m.dark))
    } else if (event === 'alumbrado') {
        m.stars = Math.max(m.stars, 1.1 * m.dark)
        m.windows = Math.max(m.windows, 1.25 * m.dark)
        m.riverGlow = Math.max(m.riverGlow, 0.9) // (the river shines with its flowers of light)
    } else if (event === 'sucursal') {
        m.stars = Math.max(m.stars, 0.9 * m.dark)
        m.windows = Math.max(m.windows, 0.8 * m.dark)
        m.riverGlow = Math.max(m.riverGlow, 0.3)
        m.skyTop.lerp(ROSA, 0.12)
    }
    return m
}

// Sky dome: gradient + sun disc and halo + moon + twinkling stars (no textures)
const skyShader = {
    vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform vec3 uTop, uHorizon, uBottom, uSun, uSunDir, uMoonDir;
        uniform float uOpacity, uStars, uDisc, uMoon, uTime, uFlash;
        uniform vec3 uShootA, uShootB;
        uniform float uShootT, uShootOn;
        varying vec3 vDir;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
            vec3 d = normalize(vDir);
            float h = d.y;
            vec3 col = h > 0.0
                ? mix(uHorizon, uTop, pow(smoothstep(0.0, 1.0, h), 0.55))
                : mix(uHorizon, uBottom, pow(smoothstep(0.0, 1.0, -h), 0.5));
            // sun: halo + disc
            float s = max(dot(d, uSunDir), 0.0);
            col += uSun * (pow(s, 6.0) * 0.22 + pow(s, 60.0) * 0.6) * max(uDisc, 0.25);
            col = mix(col, uSun, smoothstep(0.9975, 0.999, s) * uDisc);
            // stars: a twinkling grid all around (bright, a few of them big and shining)
            if (uStars > 0.001) {
                vec2 uv = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0))) * 70.0;
                vec2 cell = floor(uv);
                float r = hash(cell);
                vec2 f = fract(uv) - 0.5 - (vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5) * 0.6;
                float big = step(0.992, r); // (one in a hundred or so: a big bright one)
                float core = smoothstep(0.15 + big * 0.1, 0.0, length(f));
                float glow = smoothstep(0.45, 0.0, length(f)) * 0.35 * big;
                float star = step(0.95, r) * (core + glow) * (0.6 + 0.4 * sin(uTime * (1.5 + r * 3.0) + r * 40.0));
                col += vec3(1.0, 0.97, 0.9) * star * uStars * (1.7 + big * 1.3) * smoothstep(-0.75, -0.25, h); // the island floats: stars all around
            }
            // a shooting star now and then: a bright head with a fading tail across the sky
            if (uShootOn > 0.001) {
                vec3 head = normalize(mix(uShootA, uShootB, uShootT));
                vec3 tail = normalize(mix(uShootA, uShootB, max(0.0, uShootT - 0.28)));
                vec3 seg = head - tail;
                float k = clamp(dot(d - tail, seg) / max(dot(seg, seg), 1e-6), 0.0, 1.0);
                float dist = length(d - (tail + seg * k));
                float streak = smoothstep(0.0035, 0.0, dist) * k * k;
                float spark = smoothstep(0.01, 0.0, length(d - head));
                col += vec3(1.0, 0.96, 0.88) * (streak * 1.8 + spark * 1.5) * uShootOn;
            }
            // moon
            float m = max(dot(d, uMoonDir), 0.0);
            col += vec3(0.85, 0.9, 1.0) * (pow(m, 40.0) * 0.18) * uMoon;
            col = mix(col, vec3(0.98, 0.96, 0.9), smoothstep(0.9993, 0.9996, m) * uMoon);
            col += vec3(0.85, 0.9, 1.0) * uFlash * 0.6;
            gl_FragColor = vec4(col, uOpacity);
        }
    `,
}

const MOON_DIR = new THREE.Vector3(-0.38, 0.42, -0.82).normalize()
const MAT_DAY = {
    lawn: new THREE.Color(shade(mix(PALETTE.verde, PALETTE.lima, 0.25), 0.92)),
    path: new THREE.Color(mix(PALETTE.mango, PALETTE.crema, 0.55)),
    cliff: new THREE.Color('#ffffff'),
    roof: new THREE.Color('#ffffff'),
    river: new THREE.Color('#3F9A8C'), // a clear Río Cali, a little green
}
const MAT_NIGHT = {
    lawn: new THREE.Color(shade(PALETTE.verde, 0.42)),
    path: new THREE.Color(shade(PALETTE.mango, 0.5)),
    cliff: new THREE.Color(shade('#ffffff', 0.5)),
    roof: new THREE.Color(shade('#ffffff', 0.58)),
    river: new THREE.Color('#163A3A'),
}
// a river lit at night: deep blue water that glows softly, with only a hint of the warm lights on
// it (all mango, it looked like a yellow sand road, not water)
const RIVER_LIT = new THREE.Color('#3F78A8')
const RIVER_GLOW = new THREE.Color('#2F5F92').lerp(new THREE.Color(PALETTE.mango), 0.18)
const INTRO_CLOUD = { light: new THREE.Color(PALETTE.crema), shade: new THREE.Color(mix(PALETTE.crema, PALETTE.rosa, 0.35)) }

/**
 * Sky, fog and lights. Outside events the world follows Cali's clock and weather (or the
 * visitor's choice in the sky panel); each event has its own sky. Everything eases (exponential
 * damping → frame-rate independent). At night the windows light up through their emissive map.
 */
export default function Atmosphere() {
    const fog = useRef()
    const hemi = useRef()
    const sun = useRef()
    const dome = useRef()
    const target = useMemo(newMood, [])
    const current = useMemo(() => {
        const m = newMood()
        copyMood(m, STUDIO)
        return m
    }, [])
    const lit = useMemo(() => ({ sunDir: new THREE.Vector3(), tmp: new THREE.Color(), flash: 0, nextFlash: 3, skyAttr: '', shoot: { t: -1, next: 3, dur: 1, fwd: new THREE.Vector3(), side: new THREE.Vector3() } }), [])
    const skyMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                ...skyShader,
                side: THREE.BackSide,
                depthWrite: false,
                transparent: true,
                fog: false,
                uniforms: {
                    uTop: { value: new THREE.Color() },
                    uHorizon: { value: new THREE.Color() },
                    uBottom: { value: new THREE.Color() },
                    uSun: { value: new THREE.Color() },
                    uSunDir: { value: new THREE.Vector3(0.45, 0.07, -0.89).normalize() },
                    uMoonDir: { value: MOON_DIR },
                    uOpacity: { value: 0 },
                    uStars: { value: 0 },
                    uDisc: { value: 1 },
                    uMoon: { value: 0 },
                    uTime: { value: 0 },
                    uFlash: { value: 0 },
                    uShootA: { value: new THREE.Vector3(0, 1, 0) },
                    uShootB: { value: new THREE.Vector3(0, 1, 0) },
                    uShootT: { value: 0 },
                    uShootOn: { value: 0 },
                },
            }),
        []
    )

    useFrame(({ scene, camera, clock }, dt) => {
        const state = useExperience.getState()
        const { mode, activeEvent, phase } = state
        const sky = skyOf(state) // fixed preview until a plan is picked, then Cali's hour
        const event = mode === 'eventos' ? activeEvent : null
        if (SEE_THROUGH.includes(phase)) copyMood(target, STUDIO)
        else eventTweaks(event, applyWeather(sample(sky.hour, target), sky.weather))

        // ease the whole mood
        const k = 1 - Math.exp(-dt * 2.2)
        COLOR_FIELDS.forEach((f) => current[f].lerp(target[f], k))
        NUM_FIELDS.forEach((f) => (current[f] += (target[f] - current[f]) * k))
        const m = current

        // sun path: rises on the left (east), noon high, sets on the right, always behind the island
        const hour = sky.hour
        const th = THREE.MathUtils.clamp((hour - 6) / 12, -0.05, 1.05) * Math.PI
        lit.sunDir.set(-0.5 * Math.cos(th), 0.07 + 0.85 * Math.max(0, Math.sin(th)), -0.89).normalize()
        skyMaterial.uniforms.uSunDir.value.lerp(lit.sunDir, k).normalize()

        // lightning (storms only)
        if (m.flashOk > 0.5 && phase === PHASES.STAGE) {
            lit.nextFlash -= dt
            if (lit.nextFlash <= 0) {
                lit.flash = 1
                lit.nextFlash = 3 + Math.random() * 6
                // a real bolt somewhere around the island (Lightning.jsx) and its thunder
                skyState.bolt = { id: (skyState.bolt?.id ?? 0) + 1, x: (Math.random() - 0.5) * 50, z: -6 - Math.random() * 18 }
                sound.thunder(0.3 + Math.random() * 1.2)
            }
        }
        lit.flash = Math.max(0, lit.flash - dt * 3.2)
        const flash = lit.flash > 0.5 ? lit.flash : lit.flash * 0.3 // a double flicker

        // shared values for clouds / rain
        skyState.night = m.dark
        skyState.cover = m.cover
        skyState.rain = m.rain
        skyState.wind = m.wind
        skyState.flash = flash
        // on the cream intro page the clouds stay light; from the fall on they take the sky's light
        const intro = SEE_THROUGH.includes(phase)
        skyState.cloudLight.copy(intro ? INTRO_CLOUD.light : m.cloudLight)
        skyState.cloudShade.copy(intro ? INTRO_CLOUD.shade : m.cloudShade)
        const skyAttr = m.dark > 0.55 ? 'night' : 'day'
        if (skyAttr !== lit.skyAttr) document.documentElement.dataset.sky = lit.skyAttr = skyAttr

        // Intro: no WebGL background → Chonti is drawn over the cream page / the timeline.
        // From the fall on, the sky dome fades in around the camera.
        scene.background = null
        const u = skyMaterial.uniforms
        u.uOpacity.value += ((SEE_THROUGH.includes(phase) ? 0 : 1) - u.uOpacity.value) * (1 - Math.exp(-dt * 3))
        dome.current.visible = u.uOpacity.value > 0.003
        dome.current.position.copy(camera.position)
        u.uTop.value.copy(m.skyTop)
        u.uHorizon.value.copy(m.skyHorizon)
        u.uBottom.value.copy(m.skyBottom)
        u.uSun.value.copy(m.glow)
        u.uStars.value = m.stars
        u.uDisc.value = m.disc
        u.uMoon.value = m.moon
        u.uTime.value = clock.elapsedTime
        u.uFlash.value = flash
        // a shooting star every 6–14 s while the stars are out, crossing the sky you are looking at
        const sh = lit.shoot
        if (sh.t < 0) {
            sh.next -= dt
            if (sh.next <= 0 && m.stars > 0.35) {
                camera.getWorldDirection(sh.fwd)
                sh.fwd.y = 0
                sh.fwd.normalize()
                sh.side.set(-sh.fwd.z, 0, sh.fwd.x)
                const across = (Math.random() - 0.5) * 1.4
                const dir = Math.random() < 0.5 ? -1 : 1
                u.uShootA.value.copy(sh.fwd).addScaledVector(sh.side, across).setY(0.28 + Math.random() * 0.15).normalize() // (low: the camera looks down at the island)
                u.uShootB.value.copy(sh.fwd).addScaledVector(sh.side, across + dir * (0.5 + Math.random() * 0.3)).setY(0.08 + Math.random() * 0.08).normalize()
                sh.t = 0
                sh.dur = 0.9 + Math.random() * 0.5
            }
        } else {
            sh.t += dt / sh.dur
            if (sh.t >= 1) (sh.t = -1), (sh.next = 6 + Math.random() * 8)
        }
        u.uShootT.value = Math.max(0, sh.t)
        u.uShootOn.value = sh.t < 0 ? 0 : Math.sin(Math.PI * Math.min(1, sh.t)) * Math.min(1, m.stars)

        fog.current.color.copy(m.fog)
        fog.current.near = m.fogNear
        fog.current.far = m.fogFar
        hemi.current.color.copy(m.hemiSky)
        hemi.current.groundColor.copy(m.hemiGround)
        hemi.current.intensity = m.hemi + flash * 2.5
        sun.current.color.copy(m.sun)
        sun.current.intensity = m.sunI
        // light from the front-ish so the facades read; follows the sun across, moonlight at night
        const night = THREE.MathUtils.smoothstep(m.dark, 0.5, 0.9)
        sun.current.position.set(THREE.MathUtils.lerp(lit.sunDir.x * 30, -14, night), THREE.MathUtils.lerp(Math.max(8, lit.sunDir.y * 35), 26, night), 18)

        const mt = islandMaterials
        mt.lawn.color.copy(MAT_DAY.lawn).lerp(MAT_NIGHT.lawn, m.dark)
        mt.path.color.copy(MAT_DAY.path).lerp(MAT_NIGHT.path, m.dark)
        mt.cliff.color.copy(MAT_DAY.cliff).lerp(MAT_NIGHT.cliff, m.dark)
        mt.roof.color.copy(MAT_DAY.roof).lerp(MAT_NIGHT.roof, m.dark)
        mt.river.color.copy(MAT_DAY.river).lerp(MAT_NIGHT.river, m.dark).lerp(RIVER_LIT, THREE.MathUtils.clamp(m.riverGlow - 0.2, 0, 1))
        mt.river.emissive.copy(RIVER_GLOW)
        mt.river.emissiveIntensity = m.riverGlow
        // lit at night the water is a little less of a mirror (the lamps made big yellow glares)
        mt.river.roughness = THREE.MathUtils.lerp(0.12, 0.34, THREE.MathUtils.clamp(m.riverGlow * 1.6, 0, 1)) // (lit at night: a little less of a mirror)
        mt.building.emissiveIntensity = m.windows
    })

    return (
        <>
            <mesh ref={dome} material={skyMaterial} renderOrder={-10} frustumCulled={false}>
                <sphereGeometry args={[150, 48, 24]} />
            </mesh>
            <fog ref={fog} attach="fog" args={[PALETTE.crema, 70, 170]} />
            <hemisphereLight ref={hemi} args={[PALETTE.crema, PALETTE.verde, 1.5]} />
            <directionalLight
                ref={sun}
                position={[14, 30, 18]}
                intensity={2.6}
                castShadow
                shadow-mapSize={[1024, 1024]}
                // (with less, every wall, the lawn's sides and the cliff came out in thin stripes —
                // shadow acne, worst where the light grazes them)
                shadow-bias={-0.0008}
                shadow-normalBias={0.2}
                shadow-camera-left={-27}
                shadow-camera-right={27}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                shadow-camera-near={1}
                shadow-camera-far={80}
            />
        </>
    )
}
