import * as THREE from 'three'

/**
 * Chonti's face. The GLB head has the eye bumps modeled but no eyes/mouth, so the features are
 * attached ON its surface (they follow the neck bone):
 *  - the eye bumps are found automatically on a front depth map of the head (local protrusion),
 *  - every feature sits on that surface, oriented to its normal (no raycasts → instant).
 *
 * A cute face: big glossy eyes (two sparkles each), soft blush, small mouth. Expressions:
 *  sheet: happy (Feliz) · talking (Hablando) · surprised (Sorprendido) · angry (Enojado) · wink (Guiño) · calm (Tranquilo)
 *  more:  laugh · love · sad · sleepy · excited · shy · thinking · scared
 * Every expression is a set of numbers eased every frame, so any change is smooth; the eyes can
 * also look somewhere (`look`), e.g. following the mouse.
 */

const C = {
    dark: '#2A170F',
    cheek: '#F0625A',
    mouth: '#5A1C14',
    tongue: '#F08D8B',
    teeth: '#FFFDF5',
    heart: '#E0121E', // red hearts (love)
}

const BASE = {
    eye: [1, 1], look: [0, 0], closeL: 0, closeR: 0, lid: 0, heart: 0, sparkle: 0,
    brow: 0, browTilt: 0, browY: 0, browAsym: 0, blush: 1,
    smile: 0, laugh: 0, talk: 0, o: 0, closed: 0, frown: 0, flat: 0, cat: 0,
}
export const EXPRESSIONS = {
    // the six of the character sheet
    happy: { ...BASE, smile: 1 },
    talking: { ...BASE, talk: 1 },
    surprised: { ...BASE, eye: [1.1, 1.14], o: 1, brow: 0.8, browY: 0.7 },
    angry: { ...BASE, eye: [1, 0.86], brow: 1, browTilt: -1, o: 0.6 },
    wink: { ...BASE, closeR: 1, smile: 0.9, blush: 1.2 },
    calm: { ...BASE, closeL: 1, closeR: 1, closed: 1 },
    // more expressions
    laugh: { ...BASE, closeL: 1, closeR: 1, laugh: 1, blush: 1.35 },
    love: { ...BASE, heart: 1, smile: 0.85, blush: 1.6 },
    sad: { ...BASE, eye: [1, 0.92], look: [0, -0.6], brow: 1, browTilt: 1, frown: 1 },
    sleepy: { ...BASE, lid: 1, o: 0.55, blush: 0.8 },
    excited: { ...BASE, eye: [1.14, 1.16], sparkle: 1, laugh: 0.75, blush: 1.3 },
    shy: { ...BASE, eye: [0.92, 0.92], look: [0.45, -0.55], cat: 1, blush: 1.8 },
    thinking: { ...BASE, look: [-0.6, 0.75], flat: 1, brow: 0.8, browAsym: 1 },
    scared: { ...BASE, eye: [1.12, 1.2], brow: 1, browTilt: 0.8, browY: 0.45, o: 0.7 },
    // big surprise (the fall): eyes wide open, brows way up, a big round "O"
    shocked: { ...BASE, eye: [1.24, 1.32], sparkle: 0.4, brow: 1, browY: 1, o: 1.7, blush: 0.9 },
}
const NUM_KEYS = Object.keys(BASE).filter((k) => !Array.isArray(BASE[k]))
// older names still used around the code
const ALIASES = { curious: 'thinking', worried: 'scared', dance: 'excited' }

// ── Locating the face on the head ────────────────────────────────────────────────
const G = 56 // resolution of the front depth map
const mapCache = new WeakMap()

/**
 * Front "depth map" of the smooth head, built straight from its vertices (no raycasts → fast):
 * for every (x, y) cell keep the front-most vertex (position + normal, in head-local space).
 * The eye bumps are the cells that stick out the most from their surroundings.
 */
function frontMap(head, key, eyesAt = null) {
    if (mapCache.has(key)) return mapCache.get(key)
    const pos = head.geometry.attributes.position
    const nor = head.geometry.attributes.normal
    const m = head.matrixWorld
    const nm = new THREE.Matrix3().getNormalMatrix(m)
    const P = [], N = []
    const box = new THREE.Box3()
    for (let i = 0; i < pos.count; i++) {
        P.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(m))
        N.push(new THREE.Vector3().fromBufferAttribute(nor, i).applyMatrix3(nm).normalize())
        box.expandByPoint(P[i])
    }
    const W = box.max.x - box.min.x, H = box.max.y - box.min.y
    const cells = new Array(G * G).fill(-1)
    P.forEach((p, i) => {
        if (N[i].z < 0.2) return // front surface only
        const cx = Math.min(G - 1, Math.floor(((p.x - box.min.x) / W) * G))
        const cy = Math.min(G - 1, Math.floor(((p.y - box.min.y) / H) * G))
        const k = cy * G + cx
        if (cells[k] < 0 || p.z > P[cells[k]].z) cells[k] = i
    })
    const at = (x, y) => {
        // nearest filled cell (spiral search)
        const cx = Math.round(((x - box.min.x) / W) * G), cy = Math.round(((y - box.min.y) / H) * G)
        for (let r = 0; r < 6; r++) {
            for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
                const X = cx + dx, Y = cy + dy
                if (X < 0 || Y < 0 || X >= G || Y >= G) continue
                const i = cells[Y * G + X]
                if (i >= 0) return { point: P[i], normal: N[i] }
            }
        }
        return null
    }
    const z = (X, Y) => (X < 0 || Y < 0 || X >= G || Y >= G || cells[Y * G + X] < 0 ? null : P[cells[Y * G + X]].z)

    // eye bumps: biggest local protrusion on each side of the front
    const eye = (side) => {
        let best = null, bestScore = -Infinity
        const mid = G / 2
        for (let Y = Math.floor(G * 0.2); Y <= Math.floor(G * 0.7); Y++) {
            for (let s = Math.floor(G * 0.05); s <= Math.floor(G * 0.32); s++) {
                const X = Math.round(mid + side * s)
                const i = cells[Y * G + X]
                if (i < 0 || N[i].z < 0.75) continue
                const ring = [[3, 0], [-3, 0], [0, 3], [0, -3], [2, 2], [-2, 2], [2, -2], [-2, -2]].map(([dx, dy]) => z(X + dx, Y + dy))
                if (ring.some((v) => v === null)) continue
                const score = P[i].z - ring.reduce((acc, v) => acc + v, 0) / ring.length
                if (score > bestScore) (bestScore = score), (best = P[i])
            }
        }
        return best ?? new THREE.Vector3(box.min.x + W * (0.5 + side * 0.2), box.min.y + H * 0.38, box.max.z)
    }
    // (a head with its own eyes modeled: the face's eyes go right on them)
    const l = eyesAt?.left ?? eye(-1), r = eyesAt?.right ?? eye(1)
    // (the face always centred on the head: the modeled eyes are a little off to one side)
    const cx = (box.min.x + box.max.x) / 2
    const half = (Math.abs(l.x - cx) + Math.abs(r.x - cx)) / 2 // symmetric face
    const result = { at, cx, eyeY: (l.y + r.y) / 2, half, exact: !!eyesAt, width: W }
    mapCache.set(key, result)
    return result
}

/** Builds the face on `head` (the smooth head mesh, rest pose); `eyesAt`: { left, right } where its own eyes are. */
export function buildFace(head, cacheKey, eyesAt = null) {
    head.updateMatrixWorld(true)
    const map = frontMap(head, cacheKey, eyesAt)
    const es = map.half * 2 // eye spacing = the unit of the whole face
    // the whole face sits a bit higher than the modeled eye bumps, centred like the reference sheet
    // (on modeled eyes: exactly on them)
    const eyeY = map.eyeY + (map.exact ? 0 : 0.06 * es)
    const a = { left: { x: map.cx - map.half, y: eyeY }, right: { x: map.cx + map.half, y: eyeY }, cx: map.cx }

    const headScale = head.getWorldScale(new THREE.Vector3()).x
    const headQuatInv = head.getWorldQuaternion(new THREE.Quaternion()).invert()
    const zAxis = new THREE.Vector3(0, 0, 1)

    /** A group stuck on the head surface at world (x, y), facing out, sized in world units. */
    // (symmetric: each feature at exactly the (x, y) asked — not snapped to the nearest vertex of the
    // head, which put one eye higher than the other — with the depth and the tilt of the surface
    // averaged with its mirror point, so the left and right features match)
    const decals = []
    const decal = (x, y, out = 0.012 * es) => {
        const g = new THREE.Group()
        decals.push(g)
        const hit = map.at(x, y)
        if (!hit) return g
        const twin = map.at(2 * map.cx - x, y) ?? hit
        const normal = new THREE.Vector3(hit.normal.x - twin.normal.x, hit.normal.y + twin.normal.y, hit.normal.z + twin.normal.z).normalize()
        const point = new THREE.Vector3(x, y, (hit.point.z + twin.point.z) / 2)
        g.position.copy(head.worldToLocal(point.addScaledVector(normal, out)))
        g.quaternion.copy(headQuatInv).multiply(new THREE.Quaternion().setFromUnitVectors(zAxis, normal))
        g.scale.setScalar(1 / headScale)
        head.add(g)
        return g
    }

    const basic = (color, extra) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, ...extra })
    const M = {
        dark: basic(C.dark),
        cheek: basic('#ffffff', { map: blushTexture(), transparent: true, depthWrite: false }),
        mouth: basic(C.mouth),
        tongue: basic(C.tongue),
        teeth: basic(C.teeth),
        // 3D hearts: lit (round, glossy) but with some glow of their own, so they stay a true red
        heart: new THREE.MeshStandardMaterial({ color: C.heart, emissive: C.heart, emissiveIntensity: 0.35, roughness: 0.28, metalness: 0, toneMapped: false }),
        shine: basic('#ffffff'),
    }
    const circle = new THREE.CircleGeometry(1, 40)
    const lower = new THREE.CircleGeometry(1, 40, Math.PI, Math.PI) // lower half → the D-shaped smile
    const upper = new THREE.CircleGeometry(1, 40, 0, Math.PI)
    // (in segments: bent onto the round head below, a plane of only 4 corners sank in the middle —
    // the strip of his teeth came out broken in two)
    const plane = new THREE.PlaneGeometry(1, 1, 16, 4)
    const capsule = new THREE.CapsuleGeometry(1, 1, 4, 12)
    const arc = new THREE.TorusGeometry(1, 0.2, 8, 40, Math.PI) // ∩
    const eyeArc = new THREE.TorusGeometry(1, 0.34, 8, 40, Math.PI) // ∩ (closed happy eye, bolder)
    const browArc = new THREE.TorusGeometry(1, 0.22, 6, 24, Math.PI * 0.62).rotateZ(Math.PI * 0.19) // a soft brow
    // a puffy heart: extruded with a round bevel, its back resting on the face
    const heartGeo = new THREE.ExtrudeGeometry(heartShape(), { depth: 0.06, bevelEnabled: true, bevelThickness: 0.11, bevelSize: 0.12, bevelSegments: 6, curveSegments: 16 })
    heartGeo.translate(0, 0, 0.07)
    const starGeo = new THREE.ShapeGeometry(starShape(), 1)
    const mesh = (geo, mat, s, p = [0, 0, 0], rz = 0) => {
        const m = new THREE.Mesh(geo, mat)
        m.scale.set(...s)
        m.position.set(...p)
        m.rotation.z = rz
        return m
    }

    // Eyes: big glossy ovals with two sparkles · closed happy arc · sleepy lid · hearts · stars
    const eyes = [a.left, a.right].map((p, i) => {
        const g = decal(p.x, p.y, 0.018 * es)
        const open = new THREE.Group()
        open.add(mesh(circle, M.dark, [0.115 * es, 0.18 * es, 1]))
        const shine = new THREE.Group() // the sparkles move a little with the gaze
        shine.add(mesh(circle, M.shine, [0.042 * es, 0.05 * es, 1], [0.035 * es, 0.072 * es, 0.002]))
        shine.add(mesh(circle, M.shine, [0.019 * es, 0.019 * es, 1], [-0.035 * es, -0.062 * es, 0.002]))
        open.add(shine)
        const closed = new THREE.Group()
        closed.add(mesh(eyeArc, M.dark, [0.095 * es, 0.085 * es, 0.02 * es], [0, -0.02 * es, 0]))
        // (built at its full size, so it bends onto the head with the same curve it is shown at)
        const heart = mesh(heartGeo, M.heart, [HEART * es, HEART * es, HEART * es], [0, 0, 0.004])
        heart.add(mesh(circle, M.shine, [0.13, 0.09, 1], [-0.33, 0.28, 0.25], 0.6)) // its glossy highlight
        const star = mesh(starGeo, M.shine, [0.06 * es, 0.06 * es, 1], [0.02 * es, 0.05 * es, 0.005])
        g.add(open, closed, heart, star)
        return { open, shine, closed, heart, star, side: i === 0 ? -1 : 1 }
    })

    // Brows: soft arcs, shown only by the expressions that need them
    const brows = [a.left, a.right].map((p, i) => {
        const g = decal(p.x, eyeY + 0.3 * es, 0.015 * es)
        const inner = new THREE.Group()
        const side = i === 0 ? -1 : 1
        inner.add(mesh(browArc, M.dark, [0.085 * es * -side, 0.06 * es, 0.02 * es]))
        inner.userData.side = side
        g.add(inner)
        return inner
    })

    // Soft rosy blush (radial gradient, not a flat disc)
    const cheeks = [-1, 1].map((side) => {
        const g = decal(a.cx + side * 0.78 * es, eyeY - 0.16 * es, 0.01 * es)
        const c = mesh(plane, M.cheek, [0.4 * es, 0.28 * es, 1])
        g.add(c)
        return c
    })

    // Mouths (blended by scale), all a bit smaller than before → cuter
    // right under the eyes, like the reference sheet (it used to sit on the curve of the chin)
    const mouthAnchor = decal(a.cx, eyeY - 0.19 * es, 0.016 * es)
    const smile = new THREE.Group() // Feliz / Guiño: D shape, teeth on top, tongue at the bottom
    smile.add(mesh(lower, M.mouth, [0.3 * es, 0.22 * es, 1]))
    smile.add(mesh(plane, M.teeth, [0.36 * es, 0.055 * es, 1], [0, -0.03 * es, 0.002]))
    smile.add(mesh(upper, M.tongue, [0.15 * es, 0.075 * es, 1], [0, -0.2 * es, 0.003]))
    const laugh = new THREE.Group() // carcajada: big open D
    laugh.add(mesh(lower, M.mouth, [0.31 * es, 0.3 * es, 1]))
    laugh.add(mesh(plane, M.teeth, [0.36 * es, 0.06 * es, 1], [0, -0.032 * es, 0.002]))
    laugh.add(mesh(upper, M.tongue, [0.17 * es, 0.1 * es, 1], [0, -0.28 * es, 0.003]))
    const talk = new THREE.Group() // Hablando: a rounder open mouth with teeth and tongue
    talk.add(mesh(circle, M.mouth, [0.14 * es, 0.11 * es, 1], [0, -0.05 * es, 0]))
    talk.add(mesh(plane, M.teeth, [0.13 * es, 0.035 * es, 1], [0, 0.035 * es, 0.002]))
    talk.add(mesh(upper, M.tongue, [0.085 * es, 0.05 * es, 1], [0, -0.145 * es, 0.003]))
    const o = new THREE.Group() // Sorprendido: small round mouth
    o.add(mesh(circle, M.mouth, [0.07 * es, 0.09 * es, 1], [0, -0.045 * es, 0]))
    o.add(mesh(upper, M.tongue, [0.045 * es, 0.03 * es, 1], [0, -0.115 * es, 0.002]))
    const closed = new THREE.Group() // Tranquilo: closed smile ‿
    closed.add(mesh(arc, M.dark, [0.12 * es, 0.08 * es, 0.02 * es], [0, 0, 0], Math.PI))
    const frown = new THREE.Group() // triste: ∩
    frown.add(mesh(arc, M.dark, [0.1 * es, 0.06 * es, 0.02 * es], [0, -0.08 * es, 0]))
    const flat = new THREE.Group() // pensando: a little line to the side
    flat.add(mesh(capsule, M.dark, [0.014 * es, 0.06 * es, 0.01], [0.04 * es, -0.03 * es, 0], Math.PI / 2 + 0.15))
    const cat = new THREE.Group() // tímido: ω
    ;[-1, 1].forEach((s) => cat.add(mesh(arc, M.dark, [0.045 * es, 0.04 * es, 0.02 * es], [s * 0.045 * es, -0.005 * es, 0], Math.PI)))
    const mouths = { smile, laugh, talk, o, closed, frown, flat, cat }
    Object.values(mouths).forEach((m) => mouthAnchor.add(m))

    // Accessory: round glasses (Feria del Libro), stuck on the face like the eyes, so they
    // follow every expression; hidden until needed (GuideChonti)
    const frameMat = new THREE.MeshStandardMaterial({ color: '#2C3B07', roughness: 0.35, metalness: 0.2 })
    const lensMat = basic('#DDF1FF', { transparent: true, opacity: 0.28, depthWrite: false })
    // big round lenses, a bridge joining them in the middle and the temples (patas) going back
    // over the sides of the head
    const ring = new THREE.TorusGeometry(1, 0.1, 10, 44)
    const rim = 0.3 * es // lens radius
    const glasses = [a.left, a.right].map((p, i) => {
        const side = i === 0 ? -1 : 1
        const g = decal(p.x, p.y, 0.09 * es)
        g.add(mesh(ring, frameMat, [rim, rim * 1.05, rim]))
        g.add(mesh(circle, lensMat, [rim * 0.95, rim, 1], [0, 0, -0.004]))
        // temple: from the outer edge of the lens, back along the side of the head
        const temple = new THREE.Mesh(new THREE.BoxGeometry(0.045 * es, 0.045 * es, 0.9 * es), frameMat)
        temple.position.set(side * rim * 1.02, rim * 0.18, -0.42 * es)
        temple.rotation.y = side * 0.38
        g.add(temple)
        return g
    })
    // the bridge: a small arch from one lens to the other, over the nose
    const gap = 2 * map.half - 2 * rim // space between the two lenses
    const bridge = decal(a.cx, eyeY + 0.08 * es, 0.1 * es)
    bridge.add(mesh(new THREE.TorusGeometry(1, 0.2, 8, 24, Math.PI), frameMat, [Math.max(gap, 0.12 * es) / 2 + 0.03 * es, 0.08 * es, 0.12 * es]))
    glasses.push(bridge)
    glasses.forEach((g) => (g.visible = false))

    // Every feature curved like his head: flat discs on a round head stood off it at their edges,
    // and from the side they showed as thin plates sticking out of his face. Each one is bent onto
    // a sphere as round as the head (the farther from its middle, the deeper it goes).
    const R = (map.width ?? es * 3) * 0.5
    head.updateMatrixWorld(true)
    const inv = new THREE.Matrix4(), rel = new THREE.Matrix4(), back = new THREE.Matrix4(), v = new THREE.Vector3()
    for (const g of decals) {
        inv.copy(g.matrixWorld).invert()
        g.traverse((m) => {
            if (!m.isMesh || glasses.includes(g)) return
            rel.multiplyMatrices(inv, m.matrixWorld)
            back.copy(rel).invert()
            const geo = m.geometry.clone()
            const pos = geo.attributes.position
            for (let i = 0; i < pos.count; i++) {
                v.fromBufferAttribute(pos, i).applyMatrix4(rel)
                v.z -= (v.x * v.x + v.y * v.y) / (2 * R)
                v.applyMatrix4(back)
                pos.setXYZ(i, v.x, v.y, v.z)
            }
            m.geometry = geo
        })
    }

    return {
        eyes, brows, cheeks, mouth: mouths, es, glasses,
        state: { ...structuredClone(EXPRESSIONS.happy), lastT: 0 },
    }
}

function blushTexture() {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 32, 2, 32, 32, 31)
    grad.addColorStop(0, 'rgba(240, 98, 90, 0.85)')
    grad.addColorStop(0.55, 'rgba(240, 98, 90, 0.45)')
    grad.addColorStop(1, 'rgba(240, 98, 90, 0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
}
const HEART = 0.33 // size of the heart eyes (× eye size; with the round edge, a bit bigger than the flat ones were)
function heartShape() {
    const s = new THREE.Shape()
    s.moveTo(0, -0.62)
    s.bezierCurveTo(-0.95, -0.05, -0.62, 0.72, 0, 0.3)
    s.bezierCurveTo(0.62, 0.72, 0.95, -0.05, 0, -0.62)
    return s
}
function starShape() {
    const s = new THREE.Shape()
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 2
        const r = i % 2 ? 0.28 : 1
        i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    return s
}

const ease = (cur, target, k) => cur + (target - cur) * k
const tiny = (v) => Math.max(0.001, v)

/**
 * Eases the face towards `expr` (+ talking flaps, blinking). `look` = optional extra gaze
 * [x, y] in -1..1 (e.g. towards the mouse).
 */
export function updateFace(face, expr = 'happy', talk = 0, t = 0, look = null) {
    if (!face) return
    const s = face.state
    const P = EXPRESSIONS[ALIASES[expr] ?? expr] ?? EXPRESSIONS.happy
    const dt = Math.min(0.1, Math.max(0, t - s.lastT))
    s.lastT = t
    const k = 1 - Math.exp(-dt * 10)
    for (const key of NUM_KEYS) s[key] = ease(s[key], P[key], k)
    s.eye[0] = ease(s.eye[0], P.eye[0], k)
    s.eye[1] = ease(s.eye[1], P.eye[1], k)
    const lx = THREE.MathUtils.clamp(P.look[0] + (look?.[0] ?? 0), -1, 1)
    const ly = THREE.MathUtils.clamp(P.look[1] + (look?.[1] ?? 0), -1, 1)
    s.look[0] = ease(s.look[0], lx, k)
    s.look[1] = ease(s.look[1], ly, k)

    // while the voice speaks, the "Hablando" mouth takes over and flaps
    const speaking = Math.min(1, talk)
    const talkW = Math.max(s.talk, speaking)
    const others = 1 - speaking
    const es = face.es

    const blink = t % 3.6 < 0.11 ? 1 : 0
    face.eyes.forEach((e, i) => {
        const closedSide = i === 0 ? s.closeL : s.closeR
        const shut = Math.max(closedSide, blink)
        const openW = (1 - shut) * (1 - s.heart)
        const lidY = 1 - s.lid * 0.6 // sleepy: half-closed
        e.open.scale.set(tiny(s.eye[0] * (1 - s.heart)), tiny(s.eye[1] * (1 - shut) * lidY * (1 - s.heart)), 1)
        e.open.position.set(s.look[0] * 0.035 * es, s.look[1] * 0.03 * es - s.lid * 0.04 * es, 0)
        e.shine.position.set(s.look[0] * 0.012 * es, s.look[1] * 0.01 * es, 0)
        e.closed.scale.setScalar(tiny(shut * (blink && !closedSide ? 0 : 1) * (1 - s.heart)))
        e.heart.scale.setScalar(tiny(s.heart * HEART * es * (1 + Math.sin(t * 6) * 0.08))) // big red hearts, beating
        e.star.scale.setScalar(tiny(s.sparkle * openW * 0.06 * es * (0.8 + Math.abs(Math.sin(t * 4 + i)) * 0.4)))
        e.star.rotation.z = t * 1.5
    })
    face.brows.forEach((b) => {
        const side = b.userData.side
        const asym = side > 0 ? s.browAsym : 0
        b.scale.setScalar(tiny(Math.max(s.brow, asym * 0.8)))
        b.rotation.z = side * (-0.42 * s.browTilt) // tilt > 0: inner ends up (sad) · < 0: inner ends down (angry)
        b.position.y = (s.browY * 0.08 + asym * 0.07 - Math.max(0, -s.browTilt) * 0.04) * es
    })
    face.cheeks.forEach((c) => c.scale.set(0.4 * es * (0.7 + s.blush * 0.3), 0.28 * es * (0.7 + s.blush * 0.3), 1))
    face.cheeks.forEach((c) => (c.material.opacity = Math.min(1, 0.55 + s.blush * 0.3)))
    const flap = speaking > 0.01 ? 0.45 + Math.abs(Math.sin(t * 13)) * 0.75 : 1
    const m = face.mouth
    m.talk.scale.set(tiny(talkW), tiny(talkW * flap), 1)
    m.smile.scale.setScalar(tiny(s.smile * others))
    m.laugh.scale.set(tiny(s.laugh * others), tiny(s.laugh * others * (0.92 + Math.abs(Math.sin(t * 9)) * 0.12)), 1)
    m.o.scale.setScalar(tiny(s.o * others))
    m.closed.scale.setScalar(tiny(s.closed * others))
    m.frown.scale.setScalar(tiny(s.frown * others))
    m.flat.scale.setScalar(tiny(s.flat * others))
    m.cat.scale.setScalar(tiny(s.cat * others))
}
