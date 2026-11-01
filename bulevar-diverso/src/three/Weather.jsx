import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ISLAND_TOP, PHASES } from '../config.js'
import { useExperience } from '../store/useExperience.js'
import { seeded } from './Clouds.jsx'
import { skyState } from './skyState.js'

const DROPS = 900
const AREA = { x: 26, z: 13, top: 18 }
const material = new THREE.MeshBasicMaterial({ color: '#D6E4EC', transparent: true, opacity: 0, depthWrite: false, fog: true })
const geometry = new THREE.BoxGeometry(0.04, 0.8, 0.04)

/** Rain streaks over the island (intensity = skyState.rain, from the weather / sky panel). */
export default function Weather() {
    const mesh = useRef()
    const drops = useMemo(() => {
        const rand = seeded(21)
        return Array.from({ length: DROPS }, () => ({
            x: (rand() - 0.5) * AREA.x * 2,
            z: (rand() - 0.5) * AREA.z * 2 - 1,
            y: ISLAND_TOP + rand() * AREA.top,
            v: 14 + rand() * 6,
        }))
    }, [])
    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((_, dt) => {
        const stage = useExperience.getState().phase === PHASES.STAGE
        const rain = stage ? skyState.rain : 0
        material.opacity += (rain * 0.5 - material.opacity) * (1 - Math.exp(-dt * 3))
        mesh.current.visible = material.opacity > 0.01
        if (!mesh.current.visible) return
        const count = Math.floor(DROPS * Math.min(1, 0.35 + rain * 0.65))
        mesh.current.count = count
        const step = Math.min(dt, 0.05)
        for (let i = 0; i < count; i++) {
            const d = drops[i]
            d.y -= d.v * step
            d.x -= d.v * step * 0.08 // a little wind
            if (d.y < ISLAND_TOP - 0.2) {
                d.y += AREA.top
                if (d.x < -AREA.x) d.x += AREA.x * 2
            }
            dummy.position.set(d.x, d.y, d.z)
            dummy.rotation.set(0, 0, 0.08)
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
        }
        mesh.current.instanceMatrix.needsUpdate = true
    })

    return <instancedMesh ref={mesh} args={[geometry, material, DROPS]} frustumCulled={false} renderOrder={11} />
}
