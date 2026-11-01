import { useLayoutEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const v = new THREE.Vector3()
const camDir = new THREE.Vector3()

/**
 * A small stand-in for drei's <Html> (the island's markers only need this part): DOM content
 * anchored to a 3D point, centred on it, in front of the canvas.
 *
 * Why not drei's: with React 19 its <Html> unmounts its inner React root synchronously while the
 * scene is re-rendering, and Next.js reports that as an error ("Attempted to synchronously unmount
 * a root while React was already rendering") every time markers change. Here the root is unmounted
 * right after the current render instead.
 */
export default function ScreenHtml({ position = [0, 0, 0], children, zIndexMax = 30 }) {
    const group = useRef()
    const gl = useThree((s) => s.gl)
    const elRef = useRef(null)
    const root = useRef(null)
    const content = <div style={{ transform: 'translate(-50%, -50%)' }}>{children}</div>

    // mount: a fresh positioned div next to the canvas, with its own React root (a new div each
    // time, since the previous root is only unmounted after the current render)
    useLayoutEffect(() => {
        const target = gl.domElement.parentNode
        const el = document.createElement('div')
        el.style.cssText = 'position:absolute;top:0;left:0;transform-origin:0 0;will-change:transform;display:none;'
        target?.appendChild(el)
        const r = createRoot(el)
        elRef.current = el
        root.current = r
        return () => {
            if (root.current === r) root.current = null
            if (elRef.current === el) elRef.current = null
            el.remove()
            setTimeout(() => r.unmount(), 0) // after the current render, never during it
        }
    }, [gl])

    // the content (labels, handlers, active state) follows every render
    useLayoutEffect(() => {
        root.current?.render(content)
    })

    // every frame: project the anchor onto the screen (same projection as the canvas, so the
    // view shift that keeps the island beside the cards moves the pins too)
    useFrame(({ camera, size }) => {
        const g = group.current
        const el = elRef.current
        if (!g || !el) return
        v.setFromMatrixPosition(g.matrixWorld)
        const behind = v.clone().sub(camera.position).dot(camera.getWorldDirection(camDir)) < 0
        if (behind) {
            el.style.display = 'none'
            return
        }
        const dist = camera.position.distanceTo(v)
        v.project(camera)
        const x = (v.x * 0.5 + 0.5) * size.width
        const y = (-v.y * 0.5 + 0.5) * size.height
        el.style.display = ''
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
        el.style.zIndex = String(Math.max(0, Math.min(zIndexMax, Math.round(zIndexMax - dist / 6)))) // nearer pins on top
    })

    return <group ref={group} position={position} />
}
