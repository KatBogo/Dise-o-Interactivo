import { Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { PALETTE, mix, shade } from '../../theme.js'
import { geo, mat } from '../materials.js'
import { clayMaterial } from '../chonti/clayMaterial.js'

// PLACEHOLDERS: simplified architectural models (origin = base, ~1.5 units tall), crisp volumes
// guided by Cali's architecture: brick modernism, republican porticoes, clay-tile roofs, bronze.
// To use a real model, set `"model": "/models/mucic.glb"` in src/content/places.json (or routes.json
// for stops): <SwappableModel> loads it, fits it to the placeholder's size and keeps every animation.

const C = {
    stone: shade(PALETTE.crema, 0.86),
    stoneDark: shade(PALETTE.crema, 0.7),
    wall: PALETTE.crema,
    brick: shade(PALETTE.naranja, 0.66),
    brickDark: shade(PALETTE.naranja, 0.52),
    tile: mix(shade(PALETTE.naranja, 0.72), PALETTE.rosa, 0.15),
    glass: shade(PALETTE.verde, 0.38),
    bronze: shade(PALETTE.mango, 0.5),
    wood: shade(PALETTE.naranja, 0.42),
}
const M = (c) => mat(c)
const glass = () => mat(C.glass, { roughness: 0.25, metalness: 0.35 })
const bronze = () => mat(C.bronze, { roughness: 0.38, metalness: 0.65 })

/** Box with its BASE at `p` (y) — easier to stack architecture. */
function Box({ s, p = [0, 0, 0], c, material, ry = 0, ...props }) {
    return <mesh geometry={geo.box} position={[p[0], p[1] + s[1] / 2, p[2]]} scale={s} rotation-y={ry} material={material ?? M(c)} castShadow receiveShadow {...props} />
}
function Column({ r = 0.05, h = 1, p = [0, 0, 0], c = C.wall }) {
    return <mesh geometry={geo.column} position={[p[0], p[1] + h / 2, p[2]]} scale={[r, h, r]} material={M(c)} castShadow />
}

/**
 * MUCIC: a colonial casona, like the old houses of downtown Cali (La Merced, San Antonio):
 * thick whitewashed walls with an ochre zócalo, clay-tile hip roof with deep eaves, a wooden
 * balcony running along the upper floor, big wooden doors and barred windows.
 */
export function MucicModel() {
    const wood = M(C.wood)
    const shutter = M(shade(PALETTE.verde, 0.55))
    const zocalo = M(mix(PALETTE.mango, PALETTE.naranja, 0.35))
    const W = 1.8, D = 1.2
    const front = D / 2 + 0.01
    return (
        <group>
            <Box s={[2.05, 0.08, 1.5]} c={C.stoneDark} />
            {/* two whitewashed floors + ochre zócalo */}
            <Box s={[W, 1.04, D]} p={[0, 0.08, 0]} c={C.wall} />
            <Box s={[W + 0.02, 0.14, D + 0.02]} p={[0, 0.08, 0]} material={zocalo} />
            <Box s={[W + 0.04, 0.04, D + 0.04]} p={[0, 0.58, 0]} c={C.stone} />
            {/* clay-tile hip roof with deep eaves (+ a ridge line) */}
            <mesh geometry={geo.hipRoof} position-y={1.12} scale={[W + 0.36, 0.42, D + 0.36]} material={M(C.tile)} castShadow />
            <Box s={[W + 0.36, 0.03, D + 0.36]} p={[0, 1.1, 0]} c={C.brickDark} />
            {/* ground floor: big wooden door, barred windows */}
            <Box s={[0.32, 0.42, 0.03]} p={[0, 0.08, front]} material={wood} />
            <Box s={[0.4, 0.05, 0.04]} p={[0, 0.5, front]} c={C.stone} />
            {[-0.6, 0.6].map((x) => (
                <group key={x}>
                    <Box s={[0.26, 0.26, 0.02]} p={[x, 0.22, front]} material={shutter} />
                    {[-0.09, -0.03, 0.03, 0.09].map((bx) => <Box key={bx} s={[0.012, 0.3, 0.05]} p={[x + bx, 0.2, front + 0.02]} c={'#2E2A22'} />)}
                    <Box s={[0.32, 0.03, 0.06]} p={[x, 0.18, front + 0.02]} c={C.stone} />
                </group>
            ))}
            {/* upper floor: balcony doors + the wooden balcony with balusters */}
            {[-0.55, 0, 0.55].map((x) => <Box key={x} s={[0.22, 0.36, 0.02]} p={[x, 0.66, front]} material={shutter} />)}
            <Box s={[W - 0.1, 0.04, 0.26]} p={[0, 0.62, front + 0.13]} material={wood} />
            <Box s={[W - 0.1, 0.03, 0.03]} p={[0, 0.86, front + 0.25]} material={wood} />
            {Array.from({ length: 21 }, (_, i) => (
                <Box key={i} s={[0.018, 0.2, 0.018]} p={[-0.8 + i * 0.08, 0.66, front + 0.25]} material={wood} />
            ))}
            {[-0.85, 0.85].map((x) => <Box key={x} s={[0.04, 0.48, 0.04]} p={[x, 0.66, front + 0.25]} material={wood} />)}
            {/* side windows */}
            {[-1, 1].map((s) => [-0.25, 0.25].map((z) => (
                <group key={s + '' + z}>
                    <Box s={[0.02, 0.24, 0.2]} p={[s * (W / 2 + 0.01), 0.22, z]} material={shutter} />
                    <Box s={[0.02, 0.28, 0.2]} p={[s * (W / 2 + 0.01), 0.68, z]} material={shutter} />
                </group>
            )))}
            <Box s={[0.38, 0.08, 0.02]} p={[0.55, 0.5, front + 0.01]} c={PALETTE.verde} />
        </group>
    )
}

// Smooth sculpted shapes for the cats (lathe silhouette of a seated cat + a curled tube tail)
const catBody = new THREE.LatheGeometry(
    [[0, 0.3], [0.27, 0.31], [0.35, 0.42], [0.36, 0.56], [0.32, 0.74], [0.25, 0.92], [0.18, 1.05], [0.12, 1.11], [0, 1.13]].map(([r, y]) => new THREE.Vector2(r, y)),
    36
)
const catTail = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([[0, 0.38, -0.3], [0.2, 0.33, -0.36], [0.38, 0.32, -0.18], [0.42, 0.33, 0.06], [0.33, 0.35, 0.26], [0.18, 0.4, 0.34]].map((p) => new THREE.Vector3(...p))),
    40, 0.042, 10
)
const catEar = new THREE.ConeGeometry(0.085, 0.2, 14)
const catEye = new THREE.SphereGeometry(1, 16, 12)

/** A seated cat (bronze or painted). */
function Cat({ material, eye = '#2E2A22', s = 1, ...props }) {
    return (
        <group scale={s} {...props}>
            <mesh geometry={catBody} scale={[1, 1, 0.92]} material={material} castShadow receiveShadow />
            <mesh geometry={geo.sphere} position={[0, 1.3, 0.04]} scale={[0.26, 0.23, 0.24]} material={material} castShadow />
            <mesh geometry={geo.sphere} position={[0, 1.24, 0.2]} scale={[0.12, 0.08, 0.08]} material={material} />
            {[-1, 1].map((side) => (
                <group key={side}>
                    <mesh geometry={catEar} position={[side * 0.15, 1.5, 0.02]} rotation-z={-side * 0.25} material={material} castShadow />
                    {/* big almond eyes, like Tejada's cat */}
                    <mesh geometry={catEye} position={[side * 0.1, 1.33, 0.24]} scale={[0.055, 0.04, 0.02]} rotation-z={side * 0.25} material={M(eye)} />
                    {/* front legs and paws */}
                    <mesh geometry={geo.column} position={[side * 0.13, 0.5, 0.24]} scale={[0.055, 0.42, 0.06]} material={material} castShadow />
                    <mesh geometry={geo.sphere} position={[side * 0.13, 0.31, 0.3]} scale={[0.07, 0.04, 0.09]} material={material} />
                    {/* haunches */}
                    <mesh geometry={geo.sphere} position={[side * 0.22, 0.42, -0.08]} scale={[0.14, 0.13, 0.2]} material={material} castShadow />
                </group>
            ))}
            <mesh geometry={catTail} material={material} castShadow />
        </group>
    )
}

/** El Gato del Río (Hernando Tejada, 1996): smooth bronze cat on its plinth by the river, and his "novias". */
export function GatoModel() {
    const b = bronze()
    return (
        <group>
            {/* little plaza by the river */}
            <mesh geometry={geo.column} position-y={0.02} scale={[1.2, 0.04, 1.2]} material={M(C.stone)} receiveShadow />
            <Box s={[0.82, 0.12, 0.82]} p={[0, 0.04, 0]} c={C.stoneDark} />
            <Box s={[0.7, 0.14, 0.7]} p={[0, 0.16, 0]} c={C.stone} />
            <Cat material={b} position-y={0.0} />
            <Box s={[0.26, 0.08, 0.02]} p={[0, 0.2, 0.36]} material={b} />
            {/* "las novias del gato": painted cats around */}
            {[[-0.9, 0.5, PALETTE.rosa, PALETTE.verde], [0.88, 0.42, PALETTE.lima, PALETTE.naranja], [0.15, -0.95, PALETTE.mango, PALETTE.rosa]].map(([x, z, c, eye]) => (
                <group key={x} position={[x, 0, z]} rotation-y={Math.atan2(-x, -z) * 0.6}>
                    <Box s={[0.3, 0.1, 0.3]} c={C.stone} />
                    <Cat material={mat(c, { roughness: 0.35, metalness: 0.05 })} eye={eye} s={0.38} position-y={0.0} />
                </group>
            ))}
        </group>
    )
}

/** Biblioteca Centenario: republican building — steps, columned portico, pediment, tile roof. */
export function BibliotecaModel() {
    const cols = [-0.45, -0.15, 0.15, 0.45]
    return (
        <group>
            <Box s={[2.0, 0.08, 1.45]} c={C.stoneDark} />
            <Box s={[1.85, 0.08, 1.3]} p={[0, 0.08, 0]} c={C.stone} />
            {/* main block with a darker plinth band */}
            <Box s={[1.7, 0.16, 1.0]} p={[0, 0.16, -0.08]} c={C.stoneDark} />
            <Box s={[1.7, 0.72, 1.0]} p={[0, 0.32, -0.08]} c={C.wall} />
            {/* tall windows on the facade */}
            {[-0.67, 0.67].map((x) => <Box key={x} s={[0.12, 0.38, 0.02]} p={[x, 0.42, 0.43]} material={glass()} />)}
            {[-0.55, -0.18, 0.18, 0.55].map((x) => <Box key={x} s={[0.12, 0.38, 0.02]} p={[x, 0.42, -0.59]} material={glass()} />)}
            {[-0.86, 0.86].flatMap((x) => [-0.32, 0.12].map((z) => <Box key={x + '' + z} s={[0.02, 0.38, 0.12]} p={[x, 0.42, z]} material={glass()} />))}
            {/* portico */}
            {cols.map((x) => <Column key={x} r={0.05} h={0.66} p={[x, 0.16, 0.6]} />)}
            <Box s={[1.15, 0.12, 0.3]} p={[0, 0.82, 0.5]} c={C.wall} />
            <mesh geometry={geo.gable} position={[0, 0.94, 0.5]} scale={[1.18, 0.28, 0.3]} material={M(C.wall)} castShadow />
            <Box s={[1.75, 0.06, 1.05]} p={[0, 1.04, -0.08]} c={C.stone} />
            {/* clay-tile hip roof */}
            <mesh geometry={geo.hipRoof} position={[0, 1.1, -0.12]} scale={[1.8, 0.4, 0.95]} material={M(C.tile)} castShadow />
            <Box s={[0.36, 0.08, 0.02]} p={[0, 0.98, 0.66]} c={PALETTE.verde} />
        </group>
    )
}

/** Museo La Tertulia: brick modernist galleries + the stepped open-air theatre facing the river. */
export function TertuliaModel() {
    const tiers = [0, 1, 2, 3]
    const segs = 20 // a smooth curve of stepped seats (the Teatrino)
    return (
        <group>
            <Box s={[2.2, 0.06, 1.8]} c={C.stone} />
            {/* graderías: angular stepped half-ring */}
            <group position={[-0.35, 0.06, 0.15]}>
                {tiers.map((i) => {
                    const r = 0.48 + i * 0.17
                    return Array.from({ length: segs }, (_, k) => {
                        const ang = Math.PI + ((k + 0.5) / segs) * Math.PI
                        return (
                            <mesh key={i + '-' + k} geometry={geo.box} position={[Math.cos(ang) * r, ((i + 1) * 0.1) / 2, -Math.sin(ang) * r * -1]}
                                rotation-y={-ang - Math.PI / 2} scale={[(Math.PI * r) / segs + 0.012, (i + 1) * 0.1, 0.17]}
                                material={M(i % 2 ? C.brick : C.brickDark)} castShadow receiveShadow />
                        )
                    })
                })}
                <Box s={[0.6, 0.06, 0.38]} p={[0, 0, 0.12]} c={C.wood} />
            </group>
            {/* galleries */}
            <Box s={[0.85, 0.85, 0.75]} p={[0.62, 0.06, -0.45]} c={C.brick} />
            <Box s={[0.87, 0.1, 0.77]} p={[0.62, 0.5, -0.45]} material={glass()} />
            <Box s={[0.6, 0.55, 0.6]} p={[0.75, 0.06, 0.38]} c={C.brickDark} />
            <Box s={[0.62, 0.05, 0.62]} p={[0.75, 0.61, 0.38]} c={C.wall} />
            <Box s={[0.9, 0.05, 0.8]} p={[0.62, 0.91, -0.45]} c={C.wall} />
            {/* sign + a sculpture in the garden */}
            <Box s={[0.5, 0.1, 0.02]} p={[0.62, 0.7, -0.06]} c={PALETTE.crema} />
            <mesh geometry={geo.box} position={[0.15, 0.4, 0.75]} rotation={[0.3, 0.6, 0.2]} scale={[0.1, 0.55, 0.1]} material={M(PALETTE.mango)} castShadow />
        </group>
    )
}

export const PLACE_MODELS = {
    mucic: MucicModel,
    gato: GatoModel,
    biblioteca: BibliotecaModel,
    tertulia: TertuliaModel,
}

// ── Buildings for the route stops (one look per kind of route) ──────────────────
// They stand in the city blocks like the other buildings (≈1 × 0.9 footprint, front = +z, facing
// the river) but each kind reads at a glance: a fonda with its striped awning and tables outside, a
// cultural house with portico, dome and banners, a workshop with a sawtooth roof and big windows.
const warm = (c) => mat(c, { emissive: PALETTE.mango, emissiveIntensity: 0.35 }) // lit interiors
const ink = '#2E2A22'
// a right-angled prism (one tooth of a sawtooth roof): vertical face at +x
const tooth = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-0.5, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0.5, 1)]), { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5)

/** GASTRONOMÍA — a two-storey fonda: open front with a counter, striped awning, hanging sign, tables outside. */
export function FoodStallModel({ tint = mix(PALETTE.crema, PALETTE.mango, 0.45) }) {
    const W = 1.0, D = 0.8, F = D / 2 + 0.01
    const stripes = 6
    return (
        <group>
            <Box s={[W + 0.16, 0.04, D + 0.5]} p={[0, 0, 0.1]} c={C.stoneDark} />
            <Box s={[W, 1.0, D]} p={[0, 0.04, 0]} c={tint} />
            <Box s={[W + 0.03, 0.12, D + 0.03]} p={[0, 0.04, 0]} c={shade(tint, 0.78)} />
            {/* ground floor: a wide open front, warm light inside, wooden counter */}
            <Box s={[0.72, 0.4, 0.02]} p={[0, 0.08, F]} material={warm(shade(PALETTE.naranja, 0.45))} />
            <Box s={[0.74, 0.13, 0.12]} p={[0, 0.06, F + 0.05]} c={C.wood} />
            {/* striped awning (orange / cream), sloping down towards the street */}
            {Array.from({ length: stripes }, (_, i) => (
                <mesh key={i} geometry={geo.box} position={[-W / 2 + 0.06 + (i + 0.5) * ((W - 0.12) / stripes), 0.55, F + 0.15]} rotation-x={0.42}
                    scale={[(W - 0.12) / stripes + 0.002, 0.025, 0.34]} material={M(i % 2 ? PALETTE.crema : PALETTE.naranja)} castShadow />
            ))}
            {/* upper floor: two windows with green shutters and flower boxes */}
            {[-0.25, 0.25].map((x) => (
                <group key={x}>
                    <Box s={[0.2, 0.24, 0.02]} p={[x, 0.68, F]} material={glass()} />
                    {[-1, 1].map((s) => <Box key={s} s={[0.07, 0.26, 0.02]} p={[x + s * 0.15, 0.67, F]} c={shade(PALETTE.verde, 0.6)} />)}
                    <Box s={[0.24, 0.05, 0.06]} p={[x, 0.64, F + 0.03]} c={C.brick} />
                    {[-0.07, 0, 0.07].map((bx, k) => <mesh key={bx} geometry={geo.sphereLow} position={[x + bx, 0.7, F + 0.04]} scale={0.035} material={M([PALETTE.rosa, PALETTE.mango, PALETTE.lima][k])} />)}
                </group>
            ))}
            {/* clay-tile roof with a chimney (the kitchen) */}
            <mesh geometry={geo.hipRoof} position-y={1.04} scale={[W + 0.2, 0.3, D + 0.2]} material={M(C.tile)} castShadow />
            <Box s={[0.11, 0.26, 0.11]} p={[0.3, 1.08, -0.15]} c={C.brickDark} />
            {/* round hanging sign with a plate */}
            <Box s={[0.2, 0.02, 0.02]} p={[W / 2 + 0.08, 0.86, F - 0.12]} c={ink} />
            <mesh geometry={geo.column} position={[W / 2 + 0.16, 0.76, F - 0.12]} rotation-z={Math.PI / 2} scale={[0.1, 0.02, 0.1]} material={M(PALETTE.rosa)} castShadow />
            <mesh geometry={geo.column} position={[W / 2 + 0.17, 0.76, F - 0.12]} rotation-z={Math.PI / 2} scale={[0.055, 0.025, 0.055]} material={M(PALETTE.crema)} />
            {/* two little tables with parasols outside */}
            {[-0.3, 0.3].map((x, k) => (
                <group key={x} position={[x, 0.04, F + 0.44]}>
                    <Column r={0.012} h={0.14} c={ink} />
                    <mesh geometry={geo.column} position-y={0.15} scale={[0.09, 0.015, 0.09]} material={M(C.wood)} castShadow />
                    <Column r={0.008} h={0.36} p={[0, 0.15, 0]} c={ink} />
                    <mesh geometry={geo.cone} position-y={0.55} scale={[0.2, 0.09, 0.2]} material={M(k ? PALETTE.lima : PALETTE.rosa)} castShadow />
                </group>
            ))}
        </group>
    )
}

/** CULTURA — a cultural house: steps, a portico with columns and pediment, a small dome, banners. */
export function MonumentModel({ tint = PALETTE.crema }) {
    const cols = [-0.36, -0.12, 0.12, 0.36]
    return (
        <group>
            <Box s={[1.2, 0.05, 1.05]} c={C.stoneDark} />
            <Box s={[1.1, 0.05, 0.95]} p={[0, 0.05, 0]} c={C.stone} />
            <Box s={[1.04, 0.84, 0.66]} p={[0, 0.1, -0.08]} c={tint} />
            {/* a mural band of colour along the top, like the murals of the city */}
            {[PALETTE.rosa, PALETTE.mango, PALETTE.lima, PALETTE.naranja, PALETTE.verde].map((c, i) => (
                <Box key={c} s={[0.208, 0.08, 0.02]} p={[-0.416 + i * 0.208, 0.78, 0.26]} c={c} />
            ))}
            {/* portico */}
            {cols.map((x) => <Column key={x} r={0.04} h={0.6} p={[x, 0.1, 0.38]} c={C.wall} />)}
            <Box s={[0.9, 0.08, 0.24]} p={[0, 0.7, 0.33]} c={C.wall} />
            <mesh geometry={geo.gable} position={[0, 0.78, 0.33]} scale={[0.94, 0.22, 0.24]} material={M(C.wall)} castShadow />
            <Box s={[0.26, 0.4, 0.02]} p={[0, 0.1, 0.26]} material={warm(C.wood)} />
            {/* banners hanging on the side bays */}
            {[[-0.46, PALETTE.rosa], [0.46, PALETTE.lima]].map(([x, c]) => (
                <group key={x}>
                    <Box s={[0.13, 0.36, 0.015]} p={[x, 0.3, 0.27]} c={c} />
                    <Box s={[0.16, 0.02, 0.03]} p={[x, 0.66, 0.27]} c={ink} />
                </group>
            ))}
            {/* flat roof with a cornice + the dome (a theatre / cultural centre landmark) */}
            <Box s={[1.08, 0.05, 0.7]} p={[0, 0.94, -0.08]} c={C.stone} />
            <mesh geometry={geo.column} position={[0, 1.02, -0.1]} scale={[0.24, 0.06, 0.24]} material={M(C.stone)} castShadow />
            <mesh geometry={geo.sphere} position={[0, 1.05, -0.1]} scale={[0.22, 0.2, 0.22]} material={M(C.tile)} castShadow />
            <Column r={0.015} h={0.12} p={[0, 1.24, -0.1]} c={C.bronze} />
            <mesh geometry={geo.sphereLow} position={[0, 1.37, -0.1]} scale={0.03} material={bronze()} />
        </group>
    )
}

/** TALLERES — a workshop: brick walls, sawtooth roof with skylights, big windows, a palette sign, a workbench outside. */
export function TentModel({ tint = C.brick }) {
    const W = 1.1, D = 0.82, H = 0.66, F = D / 2 + 0.01
    return (
        <group>
            <Box s={[W + 0.16, 0.04, D + 0.46]} p={[0, 0, 0.1]} c={C.stoneDark} />
            <Box s={[W, H, D]} p={[0, 0.04, 0]} c={tint} />
            <Box s={[W + 0.03, 0.05, D + 0.03]} p={[0, 0.04 + H - 0.05, 0]} c={C.stone} />
            {/* sawtooth roof: three teeth, each with its glass skylight on the vertical face */}
            {[0, 1, 2].map((i) => {
                const tw = W / 3
                const x = -W / 2 + tw * (i + 0.5)
                return (
                    <group key={i}>
                        <mesh geometry={tooth} position={[x, 0.04 + H, 0]} scale={[tw, 0.24, D]} material={M(shade(PALETTE.crema, 0.8))} castShadow />
                        <Box s={[0.012, 0.19, D - 0.08]} p={[x + tw / 2 + 0.004, 0.06 + H, 0]} material={glass()} />
                    </group>
                )
            })}
            {/* big factory windows (with mullions) and an open roller door */}
            <Box s={[0.56, 0.32, 0.02]} p={[-0.2, 0.22, F]} material={glass()} />
            {[-0.38, -0.2, -0.02].map((x) => <Box key={x} s={[0.02, 0.32, 0.03]} p={[x, 0.22, F + 0.005]} c={ink} />)}
            <Box s={[0.56, 0.02, 0.03]} p={[-0.2, 0.38, F + 0.005]} c={ink} />
            <Box s={[0.3, 0.42, 0.02]} p={[0.33, 0.04, F]} material={warm(shade(PALETTE.naranja, 0.5))} />
            <Box s={[0.34, 0.05, 0.05]} p={[0.33, 0.46, F + 0.01]} c={PALETTE.naranja} />
            {/* sign: a painter's palette with colour dots */}
            <mesh geometry={geo.column} position={[-0.2, 0.52, F + 0.02]} rotation-x={Math.PI / 2} scale={[0.13, 0.02, 0.09]} material={M(PALETTE.crema)} />
            {[[-0.27, PALETTE.rosa], [-0.2, PALETTE.lima], [-0.13, PALETTE.mango], [-0.2, PALETTE.verde]].map(([x, c], k) => (
                <mesh key={k} geometry={geo.sphereLow} position={[x, k === 3 ? 0.48 : 0.54, F + 0.035]} scale={0.022} material={M(c)} />
            ))}
            {/* workbench outside with clay pots (ceramics) */}
            <group position={[-0.15, 0.04, F + 0.32]}>
                <Box s={[0.5, 0.03, 0.2]} p={[0, 0.16, 0]} c={C.wood} />
                {[-0.22, 0.22].map((x) => <Box key={x} s={[0.03, 0.16, 0.18]} p={[x, 0, 0]} c={C.wood} />)}
                {[[-0.13, 0.07, C.brick], [0, 0.1, PALETTE.mango], [0.13, 0.06, C.brickDark]].map(([x, h, c]) => (
                    <mesh key={x} geometry={geo.column} position={[x, 0.19 + h / 2, 0]} scale={[0.04, h, 0.04]} material={M(c)} castShadow />
                ))}
            </group>
        </group>
    )
}

export const STOP_MODELS = { food: FoodStallModel, monument: MonumentModel, tent: TentModel }
/** Roof height of each stop building (the line of light starts there). */
export const STOP_HEIGHT = { food: 1.34, monument: 1.4, tent: 0.94 }

// ── Swappable model: a .glb / .fbx from the JSON, or the placeholder ─────────────
/**
 * Centers a loaded model on X/Z, puts its base at y = 0 and fits it INSIDE the placeholder's box
 * (`fit` = its size): as tall as it at most, and never wider than its footprint — a low, wide
 * casona fitted only by height came out huge and spilled over the streets.
 */
function fitted(source, fit) {
    const clone = source.clone(true)
    clone.traverse((o) => {
        if (o.isMesh) o.castShadow = o.receiveShadow = true
    })
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const group = new THREE.Group()
    clone.position.sub(new THREE.Vector3((box.min.x + box.max.x) / 2, box.min.y, (box.min.z + box.max.z) / 2))
    group.add(clone)
    const byHeight = fit.y / (size.y || 1)
    const byFootprint = fit.w ? fit.w / (Math.max(size.x, size.z) || 1) : Infinity
    group.scale.setScalar(Math.min(byHeight, byFootprint))
    group.position.y = 0.01 // (a hair above the lawn: a model's flat paths would flicker against it)
    return group
}

/**
 * The real models get CHONTI'S CLAY (clayMaterial: soft matte clay, fine speckles, a warm rim),
 * each piece keeping its own colour — so the buildings and the character share one graphic line.
 * Every piece is baked into the model's own space first, so the speckles have the same size on
 * all of them (whatever scale each piece had in Blender). Pieces with no material → warm stone.
 * `speckleScale`: pores per model unit (a model drawn much bigger than the island needs fewer).
 */
export function clayed(scene, { speckleScale: base = 6, fixed = false } = {}) {
    scene.updateMatrixWorld(true)
    // the speckles are counted per unit of the MODEL: one drawn 50 times bigger (the Tertulia) got
    // a fine grid of tiny squares over its walls — so they follow the model's size (as if it were
    // ~3 units across, like the others), unless `fixed`
    const dim = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3())
    const speckleScale = fixed ? base : (base * 3) / Math.max(dim.x, dim.z, 0.001)
    const inv = new THREE.Matrix4().copy(scene.matrixWorld).invert()
    const out = new THREE.Group()
    const cache = new Map()
    const clayOf = (m) => {
        if (!cache.has(m)) {
            const painted = !!(m?.map || m?.vertexColors) // a picture or colours painted on it (the gatas)
            const plain = !painted && (!m || m.name === '' || (m.color && m.color.r === 1 && m.color.g === 1 && m.color.b === 1))
            // (a painted surface keeps its picture / its painted colours: white base colour)
            const color = painted ? new THREE.Color('#ffffff') : plain ? new THREE.Color(C.stone) : m.color.clone()
            // (the same clay as Chonti, but its warm orange glow toned down: on him it is the peel of
            // a chontaduro; on a whitewashed wall it turned everything tan — each keeps its colour)
            const clay = clayMaterial({ color, map: m?.map ?? null, normalMap: m?.normalMap ?? null, vertexColors: !!m?.vertexColors, speckle: m?.map ? 0.05 : 0.18, speckleScale, rim: 0.14, rimColor: '#FFE3C8', bump: m?.map ? 0.1 : 0.3, warmth: 0.02, sheen: 0.18, sheenColor: '#FFF1E2' })
            // models made by hand often have some faces turned inwards (the walls of the MUCIC):
            // seen from outside they vanished and let you see through the house
            clay.side = THREE.DoubleSide
            if (m?.normalMap && m.normalScale) clay.normalScale.copy(m.normalScale) // (the loader's convention)
            cache.set(m, clay)
        }
        return cache.get(m)
    }
    scene.traverse((o) => {
        if (!o.isMesh) return
        const m4 = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)
        const g = o.geometry.clone().applyMatrix4(m4)
        // a piece mirrored in Blender (negative scale: the roof of the Tertulia's pavilion) comes
        // out inside-out once baked — its faces are turned back the right way, or the light hit it
        // from below and it looked dark olive
        if (m4.determinant() < 0) {
            if (g.index) {
                const a = g.index.array
                for (let i = 0; i < a.length; i += 3) [a[i + 1], a[i + 2]] = [a[i + 2], a[i + 1]]
                g.index.needsUpdate = true
            } else g.toNonIndexed && g.computeVertexNormals()
        }
        const mesh = new THREE.Mesh(g, Array.isArray(o.material) ? o.material.map(clayOf) : clayOf(o.material))
        mesh.name = o.name
        mesh.castShadow = mesh.receiveShadow = true
        out.add(mesh)
    })
    layerCoplanar(out)
    return out
}

/**
 * The shadows of the real models are cast by their back faces only: cast from both sides (the
 * materials are double-sided), every lit wall shadowed itself in tiny flickering speckles.
 * (No depth "priority" between pieces: pulling the small ones towards the camera made the floor of
 * the courtyard, 2 mm behind the wall, show through it from far away.)
 */
function layerCoplanar(group) {
    group.traverse((m) => {
        if (!m.isMesh) return
        for (const mat of Array.isArray(m.material) ? m.material : [m.material]) mat.shadowSide = THREE.BackSide
    })
}
const rel = (url) => url.replace(/^\//, '') // relative to the page (works from a sub-folder too)
function GlbModel({ url, fit }) {
    const { scene } = useGLTF(rel(url))
    const object = useMemo(() => fitted(clayed(scene), fit), [scene, fit])
    return <primitive object={object} />
}
// FBX from Blender: its colours are written linear and the loader linearises them again (they came
// out darker and redder) — undo that, and use the island's matte material instead of Phong
const fbxMaterial = (m) =>
    new THREE.MeshStandardMaterial({ name: m.name, color: m.color ? m.color.clone().convertLinearToSRGB() : '#ffffff', map: m.map ?? null, roughness: 0.85, metalness: 0, transparent: m.transparent, opacity: m.opacity ?? 1 })
function FbxModel({ url, fit }) {
    const group = useLoader(FBXLoader, rel(url))
    const object = useMemo(() => {
        const g = group.clone(true)
        g.traverse((o) => {
            if (o.isMesh) o.material = Array.isArray(o.material) ? o.material.map(fbxMaterial) : fbxMaterial(o.material)
        })
        return fitted(clayed(g), fit)
    }, [group, fit])
    return <primitive object={object} />
}

/**
 * `url` set → the real model (.glb or .fbx — e.g. one of Assets/modelos edited in Blender), shown
 * at the SAME height as the placeholder it replaces (measured once), so it fits its spot on the
 * island; the placeholder shows while it streams. `url` null → the placeholder.
 * `quiet`: the placeholder is never seen (only measured, hidden) — the real model or nothing.
 */
export function SwappableModel({ url, placeholder: Placeholder, height, size, quiet = false, ...props }) {
    const probe = useRef()
    const [measured, setMeasured] = useState(null)
    useLayoutEffect(() => {
        if (!url || !probe.current) return
        // (its own size: the box is in world units, so take out the scale of the groups above —
        // and its rotation on the island: measured flat, the footprint is its widest side)
        const p = probe.current
        p.updateWorldMatrix(true, true)
        const size = new THREE.Box3().setFromObject(p).getSize(new THREE.Vector3())
        const s = p.getWorldScale(new THREE.Vector3()).y || 1
        setMeasured({ y: size.y / s || 1.5, w: Math.min(size.x, size.z) / s || 0 })
    }, [url])
    // (with `size` the model is as wide as that, whatever the placeholder measured)
    const fit = useMemo(() => (size ? { y: Infinity, w: size } : measured ? { y: height ?? measured.y, w: measured.w } : null), [measured, height, size])
    if (!url) return <Placeholder {...props} />
    if (!fit)
        return (
            // (a hidden box still measures: setFromObject counts what is not drawn)
            <group ref={probe} visible={!quiet}>
                <Placeholder {...props} />
            </group>
        )
    const Model = /\.fbx$/i.test(url) ? FbxModel : GlbModel
    return (
        <Suspense fallback={quiet ? null : <Placeholder {...props} />}>
            <Model url={url} fit={fit} />
        </Suspense>
    )
}
