import * as THREE from 'three'

/**
 * Chonti's "clay" shader, matching the character-sheet render: soft matte clay with a velvety
 * sheen, the speckled chontaduro peel and a warm subsurface-like rim at the silhouette.
 * Built on MeshPhysicalMaterial (keeps lights, shadows and skinning) + onBeforeCompile:
 *  - speckles: procedural noise on the OBJECT-space position (sticks to the skin when he moves)
 *  - warm rim: fresnel term added to the outgoing light (light passing through the peel)
 */
export function clayMaterial({ color = '#ffffff', map = null, normalMap = null, vertexColors = false, speckle = 0.35, speckleScale = 9, rim = 0.35, rimColor = '#FFB27A', bump = 0.35, warmth = 0.14, sheen = 0.3, sheenColor = '#FFB27E' } = {}) {
    const mat = new THREE.MeshPhysicalMaterial({
        color,
        map, // (a painted surface, e.g. roof tiles: the clay speckles go over it too)
        normalMap, // (and its relief)
        vertexColors,
        roughness: 0.55,
        metalness: 0,
        sheen,
        sheenRoughness: 0.75,
        sheenColor: new THREE.Color(sheenColor),
        clearcoat: 0.14,
        clearcoatRoughness: 0.5,
    })
    const uniforms = {
        uSpeckle: { value: speckle },
        uSpeckleScale: { value: speckleScale },
        uRim: { value: rim },
        uRimColor: { value: new THREE.Color(rimColor) },
        uBump: { value: bump },
        uWarmth: { value: warmth },
    }
    mat.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms)
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vClayPos;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvClayPos = position;')
        shader.fragmentShader = shader.fragmentShader
            .replace(
                '#include <common>',
                `#include <common>
                varying vec3 vClayPos;
                uniform float uSpeckle, uSpeckleScale, uRim, uBump, uWarmth;
                uniform vec3 uRimColor;
                // (a hash without sin(): with the big numbers of a whole island, sin() lost its precision
                // and the speckles turned into long stripes over the streets)
                float clayHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
                float clayNoise(vec3 p) {
                    vec3 i = floor(p), f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(mix(mix(clayHash(i), clayHash(i + vec3(1,0,0)), f.x), mix(clayHash(i + vec3(0,1,0)), clayHash(i + vec3(1,1,0)), f.x), f.y),
                               mix(mix(clayHash(i + vec3(0,0,1)), clayHash(i + vec3(1,0,1)), f.x), mix(clayHash(i + vec3(0,1,1)), clayHash(i + vec3(1,1,1)), f.x), f.y), f.z);
                }`
            )
            .replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                // speckled peel: tiny darker pores + a soft mottled variation
                float pores = smoothstep(0.78, 0.92, clayNoise(vClayPos * uSpeckleScale * 4.0));
                float mottle = clayNoise(vClayPos * uSpeckleScale * 0.6);
                diffuseColor.rgb *= (1.0 - pores * uSpeckle * 0.45) * (0.94 + mottle * 0.12);`
            )
            .replace(
                '#include <normal_fragment_maps>',
                `#include <normal_fragment_maps>
                {
                    // the soft, slightly dimpled peel of the reference (keeps the 3D shape, adds tactile detail)
                    float h = (clayNoise(vClayPos * uSpeckleScale * 3.0) * 0.7 + clayNoise(vClayPos * uSpeckleScale * 7.0) * 0.3) * 0.004 * uBump;
                    vec3 dpdx = dFdx(-vViewPosition), dpdy = dFdy(-vViewPosition);
                    float dhdx = dFdx(h), dhdy = dFdy(h);
                    vec3 r1 = cross(dpdy, normal), r2 = cross(normal, dpdx);
                    float det = dot(dpdx, r1);
                    normal = normalize(abs(det) * normal - sign(det) * (dhdx * r1 + dhdy * r2));
                }`
            )
            .replace(
                '#include <opaque_fragment>',
                `float clayFres = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 2.4);
                outgoingLight += uRimColor * clayFres * uRim * diffuseColor.rgb;
                outgoingLight += diffuseColor.rgb * vec3(1.0, 0.5, 0.3) * uWarmth; // warm, slightly translucent clay
                #include <opaque_fragment>`
            )
    }
    mat.customProgramCacheKey = () => 'chonti-clay'
    return mat
}
