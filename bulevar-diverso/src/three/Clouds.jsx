import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { CLOUD_SEA, FALL_AT, PHASES } from '../config.js'
import { PALETTE, mix } from '../theme.js'
import { introState, useExperience } from '../store/useExperience.js'
import { skyState } from './skyState.js'

// Deterministic randomness so the scene looks the same on every load.
export function seeded(seed) {
    return () => {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/**
 * Puffy cumulus clouds (like a soft volumetric cloud): camera-facing billboards (one instanced
 * draw call per layer). Each puff is shaded as a soft ball lit from above — bright top, deeper
 * belly, a silver lining where the light passes through its thin border — with a gently lumpy
 * outline from smooth, low-frequency noise (no grain). Many overlapping puffs make the
 * cauliflower shape. Transparent, no depth writes.
 */
const vertexShader = /* glsl */ `
    attribute float aSeed;
    attribute float aAlpha;
    varying vec2 vUv;
    varying float vSeed;
    varying float vAlpha;
    void main() {
        vUv = uv;
        vSeed = aSeed;
        vAlpha = aAlpha;
        // billboard: take the instance position/scale, face the camera
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float s = length(vec3(instanceMatrix[0][0], instanceMatrix[0][1], instanceMatrix[0][2]));
        mv.xy += position.xy * s;
        gl_Position = projectionMatrix * mv;
    }
`
const fragmentShader = /* glsl */ `
    uniform sampler2D uMap;
    uniform float uTime;
    uniform vec3 uLight;
    uniform vec3 uShade;
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform float uOpacity;
    uniform float uFlash;
    varying vec2 vUv;
    varying float vSeed;
    varying float vAlpha;

    void main() {
        vec2 p = vUv - 0.5;
        // every puff samples the smooth noise rotated by its seed (and drifting a little)
        float a = vSeed * 6.2831 + uTime * 0.012;
        vec2 q = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
        float n = texture2D(uMap, q * 0.7 + 0.5 + vSeed).r;
        float d = length(p * vec2(1.0, 1.08)) * 2.0;            // 0 centre … 1 edge
        // a soft but defined, gently lumpy outline (big smooth bumps, no speckles)
        float body = 1.0 - smoothstep(0.5, 1.0, d + (n - 0.5) * 0.42);
        float alpha = body * body * (3.0 - 2.0 * body) * vAlpha * uOpacity;
        if (alpha < 0.004) discard;
        // volume: shade the puff like a soft ball lit from above (and a bit from the viewer)
        float r = clamp(d, 0.0, 1.0);
        float z = sqrt(1.0 - r * r);
        vec3 nrm = normalize(vec3(p * 2.0, z + 0.15));
        float lit = clamp(dot(nrm, normalize(vec3(-0.25, 0.9, 0.5))) * 0.55 + 0.45, 0.0, 1.0);
        lit *= 0.88 + 0.24 * n;                                    // soft pockets inside
        vec3 col = mix(uShade, uLight, smoothstep(0.2, 0.95, lit));
        // silver lining: light through the thin upper border
        col += uLight * pow(1.0 - z, 2.5) * smoothstep(-0.1, 0.4, p.y) * 0.3;
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, depth) * 0.6);
        col += vec3(0.75, 0.8, 1.0) * uFlash * 0.7 * (0.6 + 0.4 * z); // lit from inside by the lightning
        gl_FragColor = vec4(col, alpha);
    }
`

/** Smooth, low-frequency fbm noise (tileable) baked once on the CPU: big soft bumps, no grain. */
let puffTexture = null
function getPuffTexture() {
    if (puffTexture) return puffTexture
    const S = 128
    const rand = seeded(99)
    const G = 32
    const grid = Array.from({ length: G * G }, () => rand())
    // value noise that repeats every `period` cells (so the tile wraps without seams)
    const val = (x, y, period) => grid[(((y % period) + period) % period) * G + (((x % period) + period) % period)]
    const noise = (x, y, period) => {
        const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi
        const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
        return (val(xi, yi, period) * (1 - u) + val(xi + 1, yi, period) * u) * (1 - v) + (val(xi, yi + 1, period) * (1 - u) + val(xi + 1, yi + 1, period) * u) * v
    }
    const data = new Uint8Array(S * S * 4)
    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            // 4, 8 and 16 cells across the tile
            let f = 0, amp = 0.55, cells = 4
            for (let o = 0; o < 3; o++) {
                f += amp * noise((x / S) * cells, (y / S) * cells, cells)
                cells *= 2
                amp *= 0.45
            }
            f /= 0.55 + 0.2475 + 0.111375
            const i = (y * S + x) * 4
            data[i] = data[i + 1] = data[i + 2] = Math.round(f * 255)
            data[i + 3] = 255
        }
    }
    puffTexture = new THREE.DataTexture(data, S, S)
    puffTexture.wrapS = puffTexture.wrapT = THREE.RepeatWrapping
    puffTexture.magFilter = THREE.LinearFilter
    puffTexture.minFilter = THREE.LinearFilter
    puffTexture.needsUpdate = true
    return puffTexture
}

function makeMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
            uTime: { value: 0 },
            uMap: { value: getPuffTexture() },
            uLight: { value: new THREE.Color(PALETTE.crema) },
            uShade: { value: new THREE.Color(mix(PALETTE.crema, PALETTE.rosa, 0.35)) },
            uFogColor: { value: new THREE.Color(PALETTE.crema) },
            uFogNear: { value: 70 },
            uFogFar: { value: 170 },
            uOpacity: { value: 1 },
            uFlash: { value: 0 },
        },
    })
}

/** Builds the puffs of each cluster (several overlapping billboards → volume). */
function makePuffs(clusters, rand) {
    const puffs = []
    clusters.forEach((c, ci) => {
        c.delay = rand() * 0.5
        c.push = new THREE.Vector3(rand() - 0.5, rand() * 0.4, rand() - 0.5).normalize().multiplyScalar(4)
        const n = c.puffs ?? 6 + Math.floor(rand() * 4)
        const spread = c.spread ?? [2.6, 0.7, 1.2]
        for (let j = 0; j < n; j++) {
            puffs.push({
                cluster: ci,
                offset: new THREE.Vector3((rand() - 0.5) * spread[0], (rand() - 0.3) * spread[1], (rand() - 0.5) * spread[2]),
                r: 1.4 + rand() * 1.4,
                seed: rand(),
                alpha: 0.55 + rand() * 0.4,
            })
        }
    })
    return puffs
}

/**
 * One layer of soft clouds. `state.current` = { dissipate 0..1, origin?: Vector3 }.
 * With an `origin` the layer PARTS radially: clouds near the origin open first and slide away
 * horizontally (the cloud sea opening below the camera to reveal the island).
 */
function SoftCloudLayer({ clusters, state, opacity }) {
    const mesh = useRef()
    const material = useMemo(makeMaterial, [])
    const puffs = useMemo(() => makePuffs(clusters, seeded(clusters.length * 13 + 1)), [clusters])
    const geometry = useMemo(() => {
        const g = new THREE.PlaneGeometry(1, 1)
        g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(new Float32Array(puffs.map((p) => p.seed)), 1))
        g.setAttribute('aAlpha', new THREE.InstancedBufferAttribute(new Float32Array(puffs.length), 1).setUsage(THREE.DynamicDrawUsage))
        return g
    }, [puffs])
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const away = useMemo(() => new THREE.Vector3(), [])

    useFrame(({ clock, scene }) => {
        const d = state?.current.dissipate ?? 0
        const origin = state?.current.origin
        mesh.current.visible = d < 1
        if (!mesh.current.visible) return
        const t = clock.elapsedTime
        material.uniforms.uTime.value = t
        // lit like the sky of the moment (sunset, noon, night, rain…)
        material.uniforms.uLight.value.copy(skyState.cloudLight)
        material.uniforms.uShade.value.copy(skyState.cloudShade)
        material.uniforms.uFlash.value = skyState.flash
        const o = opacity ? opacity() : 1
        material.uniforms.uOpacity.value = o
        if (o < 0.01) {
            mesh.current.visible = false
            return
        }
        if (scene.fog) {
            material.uniforms.uFogColor.value.copy(scene.fog.color)
            material.uniforms.uFogNear.value = scene.fog.near
            material.uniforms.uFogFar.value = scene.fog.far
        }
        const alpha = geometry.attributes.aAlpha
        puffs.forEach((p, i) => {
            const c = clusters[p.cluster]
            let delay = c.delay
            if (origin) {
                away.set(c.center.x - origin.x, 0, c.center.z - origin.z)
                const dist = away.length()
                delay = Math.min(0.55, dist / 70)
                away.normalize().multiplyScalar(10 + dist * 0.6)
            } else away.copy(c.push)
            const local = THREE.MathUtils.clamp((d - delay) / 0.45, 0, 1) // dissipation of this cluster
            const e = local * local * (3 - 2 * local)
            dummy.position.copy(c.center).addScaledVector(p.offset, c.size).addScaledVector(away, e * (origin ? 1 : 1.5))
            dummy.position.x += Math.sin(t * (0.12 + skyState.wind * 0.25) + p.cluster) * (c.drift ?? 0.15) * (1 + skyState.wind * 2)
            dummy.position.y += Math.sin(t * 0.5 + p.cluster) * 0.06
            dummy.scale.setScalar(p.r * c.size * (1 + e * 0.5)) // they expand while they fade
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
            alpha.setX(i, p.alpha * (1 - e))
        })
        mesh.current.instanceMatrix.needsUpdate = true
        alpha.needsUpdate = true
    })

    return <instancedMesh ref={mesh} args={[geometry, material, puffs.length]} frustumCulled={false} renderOrder={10} />
}

/**
 * Soft cloud floor under the sea of puffs: fills the gaps so the island stays hidden until the
 * clouds part. Radial soft edge + a hole that opens from the camera's spot on dissipate.
 */
function CloudFloor({ state }) {
    const mesh = useRef()
    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                uniforms: {
                    uColor: { value: new THREE.Color(mix(PALETTE.crema, PALETTE.rosa, 0.3)) },
                    uEdge: { value: new THREE.Color(mix(PALETTE.rosa, PALETTE.mango, 0.4)) },
                    uOpen: { value: 0 },
                    uOrigin: { value: new THREE.Vector2() },
                    uOpacity: { value: 1 },
                },
                vertexShader: /* glsl */ `
                    varying vec2 vXZ;
                    void main() {
                        vec4 w = modelMatrix * vec4(position, 1.0);
                        vXZ = w.xz;
                        gl_Position = projectionMatrix * viewMatrix * w;
                    }
                `,
                fragmentShader: /* glsl */ `
                    uniform vec3 uColor, uEdge;
                    uniform float uOpen, uOpacity;
                    uniform vec2 uOrigin;
                    varying vec2 vXZ;
                    void main() {
                        float r = length(vXZ / vec2(${CLOUD_SEA.halfX.toFixed(1)}, ${CLOUD_SEA.halfZ.toFixed(1)}));
                        float edge = 1.0 - smoothstep(0.75, 1.15, r);
                        float hole = uOpen > 0.001 ? smoothstep(uOpen * 70.0 - 6.0, uOpen * 70.0 + 6.0, length(vXZ - uOrigin)) : 1.0;
                        float a = edge * hole * 0.97 * uOpacity;
                        gl_FragColor = vec4(mix(uEdge, uColor, edge), a);
                    }
                `,
            }),
        []
    )
    useFrame(() => {
        material.uniforms.uColor.value.copy(skyState.cloudLight).lerp(skyState.cloudShade, 0.3)
        material.uniforms.uEdge.value.copy(skyState.cloudShade)
        const d = state.current.dissipate
        const o = seaOpacity()
        mesh.current.visible = d < 1 && o > 0.01
        material.uniforms.uOpen.value = d
        material.uniforms.uOpacity.value = o
        if (state.current.origin) material.uniforms.uOrigin.value.set(state.current.origin.x, state.current.origin.z)
    })
    return (
        <mesh ref={mesh} material={material} rotation-x={-Math.PI / 2} position-y={CLOUD_SEA.bottom + 1.2} renderOrder={9}>
            <planeGeometry args={[CLOUD_SEA.halfX * 2.6, CLOUD_SEA.halfZ * 2.6]} />
        </mesh>
    )
}

/**
 * The clouds that swallow Chonti: three dense clusters stacked on his way down (they follow his
 * x/z), so he sinks into them and they cover him little by little; they part with the sea.
 */
function SwallowClouds({ state }) {
    const follow = useRef()
    const clusters = useMemo(() => [44.6, 41.8, 39.2].map((y) => ({ center: new THREE.Vector3(0, y, 0), size: 1.8, spread: [2.4, 0.6, 2.4], puffs: 9, drift: 0.1 })), [])
    useFrame(() => {
        const p = introState.fallPos
        if (follow.current && p && useExperience.getState().phase === PHASES.FALLING) follow.current.position.set(p.x, 0, p.z)
    })
    return (
        <group ref={follow}>
            <SoftCloudLayer clusters={clusters} state={state} opacity={swallowOpacity} />
        </group>
    )
}
const swallowOpacity = () => {
    const { phase } = useExperience.getState()
    return phase === PHASES.FALLING || phase === PHASES.REVEAL ? 1 : 0
}

// The sea of clouds he falls into: hidden while the timeline is read, it rises into view only as
// the timeline is ending (the last stretch before the fall), then stays for the fall and the reveal
const seaOpacity = () => {
    const { phase } = useExperience.getState()
    if (phase === PHASES.LOADING) return 0
    if (phase === PHASES.INTRO) return THREE.MathUtils.smoothstep(introState.progress, FALL_AT - 0.1, FALL_AT - 0.01)
    return 1
}

const overcastOpacity = () => (useExperience.getState().phase === PHASES.STAGE ? skyState.cover : 0)
const nearOpacity = () => (useExperience.getState().phase === PHASES.STAGE ? Math.max(0, skyState.cover - 0.3) * 1.4 : 0)

export default function Clouds() {
    const phase = useExperience((s) => s.phase)
    const camera = useThree((s) => s.camera)
    const sea = useRef({ dissipate: 0, origin: null })

    const { seaClusters, ambient, overcast, near } = useMemo(() => {
        const rand = seeded(7)
        // The sea of clouds under the intro: Chonti falls into it (seen from above),
        // then it opens from the middle to reveal the island far below.
        const seaClusters = []
        for (let x = -CLOUD_SEA.halfX; x <= CLOUD_SEA.halfX; x += 6.2) {
            for (let z = -CLOUD_SEA.halfZ; z <= CLOUD_SEA.halfZ; z += 6.2) {
                seaClusters.push({
                    center: new THREE.Vector3(x + (rand() - 0.5) * 4, CLOUD_SEA.bottom + rand() * (CLOUD_SEA.top - CLOUD_SEA.bottom - 2), z + (rand() - 0.5) * 4),
                    size: 1.6 + rand() * 1.1,
                    spread: [3.2, 1.6, 3.2],
                    puffs: 5 + Math.floor(rand() * 3),
                })
            }
        }
        // Around the island: a few big, compact cloud BANKS (clusters packed tight, large puffs)
        // instead of many scattered puffs, plus a soft bed of clouds right below the island
        const ambient = []
        const BANKS = 7
        for (let b = 0; b < BANKS; b++) {
            const a = (b / BANKS) * Math.PI * 2 + 0.4 + rand() * 0.3
            const r = 34 + rand() * 12
            const c = new THREE.Vector3(Math.cos(a) * r * 1.25, -6 + rand() * 14, Math.sin(a) * r * 0.85 - 8)
            for (let i = 0; i < 4; i++) {
                ambient.push({
                    center: c.clone().add(new THREE.Vector3((i - 1.5) * 4.2 + (rand() - 0.5) * 1.5, (rand() - 0.3) * 1.6, (rand() - 0.5) * 2.5)),
                    size: 1.9 + rand() * 0.7,
                    drift: 0.3,
                    spread: [3.2, 0.8, 1.6],
                    puffs: 7,
                })
            }
        }
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2
            ambient.push({
                center: new THREE.Vector3(Math.cos(a) * 16, -12.5 + rand() * 1.5, Math.sin(a) * 8.5),
                size: 2 + rand() * 0.6,
                drift: 0.2,
                spread: [4, 0.6, 3],
                puffs: 7,
            })
        }
        // Cloudy / rainy weather: a continuous wall of grey clouds on the horizon behind the island
        const overcast = []
        for (let i = 0; i < 12; i++) {
            const a = Math.PI * (1.08 + (i / 11) * 0.84) // the far half (behind the island)
            overcast.push({
                center: new THREE.Vector3(Math.cos(a) * 58, 2 + rand() * 6, Math.sin(a) * 40 - 6),
                size: 3.2 + rand() * 0.8,
                drift: 0.4,
                spread: [4.5, 1, 2],
                puffs: 7,
            })
        }
        // Cloudy weather: clouds close to the island, hugging its sides and passing just over it
        const near = []
        for (let i = 0; i < 11; i++) {
            const a = (i / 11) * Math.PI * 2 + rand() * 0.3
            near.push({
                center: new THREE.Vector3(Math.cos(a) * (25 + rand() * 4), -3 + rand() * 9, Math.sin(a) * (12 + rand() * 3)),
                size: 1.7 + rand() * 0.6,
                drift: 0.8,
                spread: [4, 0.9, 2],
                puffs: 6,
            })
        }
        for (let i = 0; i < 6; i++) {
            near.push({
                center: new THREE.Vector3(-18 + i * 7 + rand() * 2, 10 + rand() * 3, -6 + rand() * 4),
                size: 1.5 + rand() * 0.5,
                drift: 1,
                spread: [3.5, 0.6, 1.6],
                puffs: 5,
            })
        }
        return { seaClusters, ambient, overcast, near }
    }, [])

    // back to the timeline: the sea of clouds is there again to fall into
    useEffect(() => {
        if (phase === PHASES.INTRO) {
            sea.current.dissipate = 0
            sea.current.origin = null
        }
    }, [phase])

    useEffect(() => {
        if (phase !== PHASES.REVEAL) return
        // part the sea right below where the camera is looking from
        sea.current.origin = new THREE.Vector3(camera.position.x, 0, camera.position.z)
        const tw = gsap.to(sea.current, { dissipate: 1, duration: 3.4, ease: 'power1.inOut', delay: 0.4 })
        return () => tw.kill()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase])

    return (
        <>
            <CloudFloor state={sea} />
            <SoftCloudLayer clusters={seaClusters} state={sea} opacity={seaOpacity} />
            <SwallowClouds state={sea} />
            <SoftCloudLayer clusters={ambient} />
            <SoftCloudLayer clusters={overcast} opacity={overcastOpacity} />
            <SoftCloudLayer clusters={near} opacity={nearOpacity} />
        </>
    )
}
