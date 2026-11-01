import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { PALETTE } from '../../theme.js'
import Chonti, { bend, poseChonti } from './ChontiModel.jsx'
import { holdInHands, props } from './RouteChonti.jsx'

/** Dev-only turnaround to check Chonti against the character sheet: open /?chonti (add &walk to animate, &raw for the raw GLB). */
function Turnaround() {
    const rigs = useRef([])
    const held = useRef([])
    const q = new URLSearchParams(location.search)
    const walk = q.has('walk')
    const manual = q.has('manual')
    const pose = q.get('pose') // read | wave | flail | excite | talk | look | think | scratch
    const expr = q.get('expr') ?? 'happy' // happy | curious | surprised | worried | calm | wink | excited
    window.__chontiRigs = rigs.current
    window.__bend = bend
    useFrame(({ clock }) => {
        if (manual) return
        const t = clock.elapsedTime
        const s = {
            step: t * 7, walk: walk ? 1 : 0, expr,
            read: pose === 'read' ? 1 : 0, wave: pose === 'wave' ? 1 : 0, flail: pose === 'flail' ? 1 : 0,
            excite: pose === 'excite' ? 1 : 0, talk: pose === 'talk' ? 1 : 0, lookDown: pose === 'look' ? 1 : Number(q.get('lookDown') ?? 0),
            think: pose === 'think' ? 1 : 0, scratch: pose === 'scratch' ? 1 : 0, dance: pose === 'dance' ? 1 : 0, laugh: pose === 'laugh' ? 1 : 0,
            eat: pose === 'eat' ? 1 : 0, sit: pose === 'sit' ? 1 : 0, write: pose === 'sit' ? 1 : 0,
        }
        rigs.current.forEach((rig, i) => {
            rig?.setAccessory?.(q.get('acc')) // santa | glasses | cap
            // (the props of the little Chonti of the routes: the empanada, the notebook)
            if (rig?.bones && !held.current[i] && (pose === 'eat' || pose === 'sit')) {
                const p = props()
                held.current[i] = pose === 'eat' ? p.empanada : p.notebook
                rig.body.parent.parent.add(held.current[i])
            }
            poseChonti(rig, s, t)
            if (held.current[i]) holdInHands(rig, held.current[i], pose === 'eat' ? { out: 0.12 } : { down: 0.06, out: 0.05 })
        })
    })
    const angles = new URLSearchParams(location.search).has('front') ? [0.35] : [0, Math.PI / 2, Math.PI, -Math.PI / 2, 0.6]
    return angles.map((yaw, i) => (
        <group key={i} position={[angles.length === 1 ? 0 : (i - 2) * 1.6, -1, 0]} rotation-y={yaw}>
            <Chonti ref={(el) => (rigs.current[i] = el)} />
        </group>
    ))
}

function RawGlb() {
    const { scene } = useGLTF('models/chonti.glb')
    const copies = useMemo(
        () =>
            [0, Math.PI / 2, Math.PI].map(() => {
                const c = clone(scene)
                if (new URLSearchParams(location.search).has('nohead')) (c.getObjectByName('Cube011') ?? c.getObjectByName('Cube008')).visible = false
                return c
            }),
        [scene]
    )
    return copies.map((c, i) => (
        <group key={i} position={[(i - 1) * 3 - 2.2, -1.5, 0]} rotation-y={[0, Math.PI / 2, Math.PI][i]}>
            <primitive object={c} />
        </group>
    ))
}

export default function ChontiPreview() {
    const raw = new URLSearchParams(location.search).has('raw')
    return (
        <div style={{ position: 'fixed', inset: 0 }}>
            <Canvas shadows camera={{ position: [0, 0.6, raw ? 10 : new URLSearchParams(location.search).has('front') ? 5 : 12], fov: 40 }}>
                <color attach="background" args={[PALETTE.crema]} />
                <hemisphereLight args={[PALETTE.crema, '#b08a6a', 1.4]} />
                <directionalLight position={[3, 5, 6]} intensity={2.4} castShadow />
                {raw ? <RawGlb /> : <Turnaround />}
                <OrbitControls target={[0, 0, 0]} />
            </Canvas>
        </div>
    )
}
