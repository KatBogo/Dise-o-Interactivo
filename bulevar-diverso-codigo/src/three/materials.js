import * as THREE from 'three'
import { PALETTE, mix, shade } from '../theme.js'

// Matte, slightly realistic surfaces (architectural-model look) instead of toon shading.
// Cache: same color + options → same material instance (fewer programs, fewer state switches).
const cache = new Map()
export function mat(color, extra = {}) {
    const key = color + JSON.stringify(extra)
    if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra }))
    return cache.get(key)
}

// Facade texture: a window grid (map) + the same grid as emissive mask (windows light up at night).
function facadeTextures() {
    const make = (wall, glass) => {
        const c = document.createElement('canvas')
        c.width = c.height = 64
        const g = c.getContext('2d')
        g.fillStyle = wall
        g.fillRect(0, 0, 64, 64)
        g.fillStyle = glass
        g.fillRect(18, 14, 28, 32)
        if (wall !== '#000000') {
            g.fillStyle = 'rgba(255,255,255,0.55)' // sill
            g.fillRect(16, 46, 32, 4)
        }
        const t = new THREE.CanvasTexture(c)
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 4
        return t
    }
    return { map: make('#ffffff', shade(PALETTE.verde, 0.32)), emissiveMap: make('#000000', '#ffffff') }
}

const facade = typeof document !== 'undefined' ? facadeTextures() : {}

/**
 * Río Cali water: flowing ripples (normal perturbed by moving noise, flowing towards the east),
 * light streaks, foam along the stone banks — a little green, like the real Río Cali coming down
 * from the Farallones. Built on MeshStandardMaterial so the sky, the night glow (Alumbrado) and
 * the fog keep working. `aBank` (0 → 1 across the channel) comes from the strip.
 */
function waterMaterial() {
    const m = new THREE.MeshStandardMaterial({ color: '#3F9A8C', roughness: 0.12, metalness: 0.15, emissive: PALETTE.mango, emissiveIntensity: 0 })
    const uniforms = { uTime: { value: 0 } }
    m.userData.uniforms = uniforms
    m.onBeforeCompile = (s) => {
        s.uniforms.uTime = uniforms.uTime
        s.vertexShader = s.vertexShader
            .replace('#include <common>', '#include <common>\nattribute float aBank;\nvarying float vBank;\nvarying vec3 vWaterPos;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBank = aBank;\nvWaterPos = (modelMatrix * vec4(position, 1.0)).xyz;')
        s.fragmentShader = s.fragmentShader
            .replace(
                '#include <common>',
                `#include <common>
                uniform float uTime;
                varying float vBank;
                varying vec3 vWaterPos;
                float wHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
                float wNoise(vec2 p) {
                    vec2 i = floor(p), f = fract(p);
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(mix(wHash(i), wHash(i + vec2(1, 0)), u.x), mix(wHash(i + vec2(0, 1)), wHash(i + vec2(1, 1)), u.x), u.y);
                }
                float wHeight(vec2 p) {
                    vec2 flow = vec2(uTime * 0.55, 0.0); // the river runs towards the east (−x)
                    return wNoise(p * vec2(2.2, 4.0) + flow) * 0.6 + wNoise(p * vec2(5.0, 9.0) + flow * 1.7 + 3.1) * 0.3 + wNoise(p * 14.0 + flow * 2.5) * 0.1;
                }`
            )
            .replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                float wh = wHeight(vWaterPos.xz);
                float streak = smoothstep(0.55, 0.9, wNoise(vWaterPos.xz * vec2(0.9, 6.0) + vec2(uTime * 0.8, 0.0)));
                float edge = abs(vBank * 2.0 - 1.0);
                float foam = smoothstep(0.78, 1.0, edge + (wh - 0.5) * 0.35);
                diffuseColor.rgb *= 0.86 + wh * 0.28;
                diffuseColor.rgb += vec3(0.08, 0.1, 0.09) * streak;
                diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.95, 0.9), foam * 0.65);`
            )
            .replace(
                '#include <normal_fragment_maps>',
                `#include <normal_fragment_maps>
                {
                    float h = wHeight(vWaterPos.xz) * 0.06;
                    vec3 dpdx = dFdx(-vViewPosition), dpdy = dFdy(-vViewPosition);
                    float dhdx = dFdx(h), dhdy = dFdy(h);
                    vec3 r1 = cross(dpdy, normal), r2 = cross(normal, dpdx);
                    float det = dot(dpdx, r1);
                    normal = normalize(abs(det) * normal - sign(det) * (dhdx * r1 + dhdy * r2) * 6.0);
                }`
            )
    }
    m.customProgramCacheKey = () => 'rio-cali-water'
    return m
}
// Island materials are dedicated (not cached) because the event system tweens them.
export const islandMaterials = {
    lawn: new THREE.MeshStandardMaterial({ color: shade(mix(PALETTE.verde, PALETTE.lima, 0.25), 0.92), roughness: 1 }),
    cliff: new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.95 }),
    path: new THREE.MeshStandardMaterial({ color: mix(PALETTE.mango, PALETTE.crema, 0.55), roughness: 0.95 }),
    bike: new THREE.MeshStandardMaterial({ color: shade(PALETTE.naranja, 0.78), roughness: 0.95 }),
    road: new THREE.MeshStandardMaterial({ color: shade(PALETTE.crema, 0.55), roughness: 0.9 }),
    stone: new THREE.MeshStandardMaterial({ color: shade(PALETTE.crema, 0.8), roughness: 0.9, side: THREE.DoubleSide }),
    river: waterMaterial(),
    plot: new THREE.MeshStandardMaterial({ color: shade(PALETTE.crema, 0.88), roughness: 0.95 }),
    building: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, map: facade.map, emissiveMap: facade.emissiveMap, emissive: PALETTE.mango, emissiveIntensity: 0 }),
    roof: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 }),
}

/** Unit clay-tile hip roof (1×1 footprint, height 1, ridge along X), flat-shaded. */
function hipRoofGeometry() {
    const A = [-0.5, 0, -0.5], B = [0.5, 0, -0.5], C = [0.5, 0, 0.5], D = [-0.5, 0, 0.5]
    const R1 = [-0.22, 1, 0], R2 = [0.22, 1, 0]
    const tris = [D, C, R2, D, R2, R1, B, A, R1, B, R1, R2, C, B, R2, A, D, R1, A, B, C, A, C, D]
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3))
    g.computeVertexNormals()
    return g
}

/** Unit triangular prism (pediments, gables): base 1 wide on y = 0, apex at y = 1, depth 1. */
function gableGeometry() {
    const shape = new THREE.Shape([new THREE.Vector2(-0.5, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0, 1)])
    return new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5)
}

// Shared unit geometries (scale them per mesh instead of creating new geometries).
export const geo = {
    hipRoof: hipRoofGeometry(),
    gable: gableGeometry(),
    pyramid: new THREE.ConeGeometry(Math.SQRT1_2, 1, 4).rotateY(Math.PI / 4).translate(0, 0.5, 0), // 1×1 base, origin at the base
    column: new THREE.CylinderGeometry(1, 1, 1, 10),
    facet: new THREE.IcosahedronGeometry(1, 1),
    sphere: new THREE.SphereGeometry(1, 24, 16),
    sphereLow: new THREE.SphereGeometry(1, 12, 8),
    bulb: new THREE.IcosahedronGeometry(1, 0), // tiny Christmas bulbs: thousands of them, 20 triangles each
    blob: new THREE.IcosahedronGeometry(1, 1),
    cylinder: new THREE.CylinderGeometry(1, 1, 1, 24),
    cone: new THREE.ConeGeometry(1, 1, 24),
    box: new THREE.BoxGeometry(1, 1, 1),
}
