import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ScreenHtml from './ScreenHtml.jsx'
import gsap from 'gsap'
import { ISLAND_TOP } from '../config.js'

/** The light of each plan's lines: Lugares green · Eventos festive violet · Rutas sunset amber. */
export const GLOW = { lugares: '#7CE35C', eventos: '#C08BFF', rutas: '#FFB347' }

// The line under each pin is pure light, not a solid tube: an open cylinder whose brightness comes
// from how much each point faces you (bright thin centre → nothing at the edges), fading out at the
// ground and towards the pin, with soft pulses rising along it. Additive, so it only adds light.
// One material per colour, shared by every pin of that plan.
const BEAM = new THREE.CylinderGeometry(1, 1, 1, 20, 1, true)
const glowMaterials = new Map()
const glowTime = { value: 0 }
function glowFor(color) {
    if (!glowMaterials.has(color)) {
        glowMaterials.set(
            color,
            new THREE.ShaderMaterial({
                uniforms: { uColor: { value: new THREE.Color(color) }, uTime: glowTime },
                vertexShader: /* glsl */ `
                    varying vec3 vN;
                    varying vec3 vV;
                    varying float vY;
                    void main() {
                        vec4 mv = modelViewMatrix * vec4(position, 1.0);
                        vN = normalize(normalMatrix * normal);
                        vV = normalize(-mv.xyz);
                        vY = uv.y;
                        gl_Position = projectionMatrix * mv;
                    }`,
                fragmentShader: /* glsl */ `
                    uniform vec3 uColor;
                    uniform float uTime;
                    varying vec3 vN;
                    varying vec3 vV;
                    varying float vY;
                    void main() {
                        float facing = abs(dot(normalize(vN), normalize(vV)));
                        float core = pow(facing, 9.0) * 0.55;       // thin bright filament
                        float glow = pow(facing, 2.2) * 0.16;         // faint light around it
                        float ends = smoothstep(0.0, 0.22, vY) * (1.0 - smoothstep(0.82, 1.0, vY) * 0.7);
                        float pulse = 0.75 + 0.25 * sin(vY * 16.0 - uTime * 3.2);
                        float breath = 0.85 + 0.15 * sin(uTime * 2.2);
                        float a = (core + glow) * ends * pulse * breath;
                        gl_FragColor = vec4(uColor, a);
                        #include <colorspace_fragment>
                    }`,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                toneMapped: false,
            })
        )
    }
    return glowMaterials.get(color)
}

/**
 * Interactive point on the island: a thin line of light rising from the ground up to the round
 * HTML pin. The <button> makes every 3D point reachable by keyboard and screen readers too.
 */
export default function Marker({ position, label, badge, active = false, index = 0, glow = GLOW.lugares, base = 0, onSelect, children }) {
    const group = useRef()
    const light = glowFor(glow)
    useFrame(({ clock }) => (glowTime.value = clock.elapsedTime))

    // pop in with a little stagger
    useEffect(() => {
        const tw = gsap.fromTo(group.current.scale, { x: 0.001, y: 0.001, z: 0.001 }, { x: 1, y: 1, z: 1, duration: 0.7, delay: index * 0.08, ease: 'back.out(2.2)' })
        return () => tw.kill()
    }, [index])

    const select = (e) => {
        e.stopPropagation()
        onSelect?.()
    }

    return (
        <group ref={group} position={[position[0], ISLAND_TOP, position[1]]}>
            {children}
            {/* only a line of light upwards, ending at the pin (light, not a solid tube) */}
            <mesh geometry={BEAM} position-y={base + (2.8 - base) / 2} scale={[0.075, 2.8 - base, 0.075]} material={light} renderOrder={5} />
            {/* compact pin: the name appears on hover / keyboard focus / when active */}
            <ScreenHtml position={[0, 2.85, 0]}>
                <button className={`marker-label ${active ? 'is-active' : ''}`} aria-pressed={active} aria-label={label} onClick={select}>
                    {badge != null && <span className="marker-badge">{badge}</span>}
                    <span className="marker-label__text">{label}</span>
                </button>
            </ScreenHtml>
        </group>
    )
}
