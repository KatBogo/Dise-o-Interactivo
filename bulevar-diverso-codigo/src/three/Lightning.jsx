import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ISLAND_TOP } from '../config.js'
import { skyState } from './skyState.js'

const MAX = 90
const material = new THREE.MeshBasicMaterial({ color: '#EEF3FF', transparent: true, opacity: 0, toneMapped: false, depthWrite: false, fog: false })
const geometry = new THREE.CylinderGeometry(1, 1, 1, 5)
const UP = new THREE.Vector3(0, 1, 0)

/** A jagged bolt from the clouds down past the island, with a few branches. */
function makeBolt({ x, z }) {
    const segs = []
    const walk = (from, dir, len, steps, width, branchProb) => {
        let p = from.clone()
        for (let i = 0; i < steps && segs.length < MAX; i++) {
            const next = p.clone().add(new THREE.Vector3(dir.x + (Math.random() - 0.5) * 1.6, -len, dir.z + (Math.random() - 0.5) * 1.2))
            segs.push({ a: p.clone(), b: next.clone(), w: width })
            if (Math.random() < branchProb) walk(next, new THREE.Vector3((Math.random() - 0.5) * 1.5, 0, (Math.random() - 0.5)), len * 0.7, 4 + Math.floor(Math.random() * 4), width * 0.5, 0)
            p = next
        }
    }
    walk(new THREE.Vector3(x, 24, z), new THREE.Vector3(0, 0, 0), 1.6, 18, 0.07, 0.25)
    return segs
}

/** Storm lightning: a visible bolt + a flash light, synced with Atmosphere's flash (and the thunder). */
export default function Lightning() {
    const mesh = useRef()
    const light = useRef()
    const state = useRef({ id: 0 })
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const q = useMemo(() => new THREE.Quaternion(), [])

    useFrame(() => {
        const bolt = skyState.bolt
        if (bolt && bolt.id !== state.current.id) {
            state.current.id = bolt.id
            const segs = makeBolt(bolt)
            segs.forEach((s, i) => {
                const d = s.b.clone().sub(s.a)
                dummy.position.copy(s.a).add(s.b).multiplyScalar(0.5)
                dummy.quaternion.copy(q.setFromUnitVectors(UP, d.clone().normalize()))
                dummy.scale.set(s.w, d.length(), s.w)
                dummy.updateMatrix()
                mesh.current.setMatrixAt(i, dummy.matrix)
            })
            mesh.current.count = segs.length
            mesh.current.instanceMatrix.needsUpdate = true
            light.current.position.set(bolt.x, ISLAND_TOP + 8, bolt.z + 4)
        }
        const f = skyState.flash
        material.opacity = f > 0.05 ? Math.min(1, f * 1.3) * (0.7 + Math.random() * 0.3) : 0 // flicker
        mesh.current.visible = material.opacity > 0
        light.current.intensity = f * 900
    })

    return (
        <group>
            <instancedMesh ref={mesh} args={[geometry, material, MAX]} frustumCulled={false} renderOrder={12} />
            <pointLight ref={light} color="#DDE6FF" intensity={0} distance={80} decay={1.4} />
        </group>
    )
}
