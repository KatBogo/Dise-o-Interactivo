import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ISLAND_TOP } from '../../config.js'
import { PALETTE } from '../../theme.js'
import { PLACES, inUserBuildings } from '../../data/content.js'
import { USER_ISLAND } from '../../data/userGround.js'
import { UserPiece } from '../island/Island.jsx'
import { useExperience } from '../../store/useExperience.js'
import { geo, mat } from '../materials.js'
import Marker, { GLOW } from '../Marker.jsx'
import { PLACE_MODELS, SwappableModel } from './PlaceModels.jsx'
import { riverZ } from '../../data/bulevarLayout.js'

const yawAt = (x) => -Math.atan2(riverZ(x + 0.1) - riverZ(x - 0.1), 0.2)

/**
 * A landmark always standing on its spot of the island. When selected:
 *   hop  : a little jump (up and a bouncy landing, with a dust ring)
 *   grow : swells up considerably, just before the focus view takes over
 * The big, interactive version on the left is rendered by ui/PlaceShowcase.jsx (its own
 * WebGL layer above the blurred island).
 */
function PlaceSpot({ place }) {
    const active = useExperience((s) => s.selectedPlace === place.id)
    const Placeholder = PLACE_MODELS[place.placeholder]
    // (your island as you arranged it: the place as it is in it — it hops and grows from where it stands)
    const mine = USER_ISLAND && inUserBuildings(`lugar_${place.id}`)

    const group = useRef()
    const spin = useRef()
    const dust = useRef()
    const anim = useRef({ hop: 0, grow: 0, dust: 0 })

    useEffect(() => {
        const a = anim.current
        const tl = gsap.timeline()
        if (active) {
            tl.to(a, { hop: 1, duration: 0.32, ease: 'power2.out' }) // jump…
              .to(a, { hop: 0, duration: 0.55, ease: 'bounce.out' }) // …and land
              .fromTo(a, { dust: 0 }, { dust: 1, duration: 0.6, ease: 'power1.out' }, '-=0.45')
              .to(a, { grow: 1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.2')
        } else {
            // closing: it shrinks AND turns back (the short way) to where it always stands,
            // facing its street — it never stays where the spin left it
            const r = spin.current.rotation
            r.y = Math.atan2(Math.sin(r.y), Math.cos(r.y))
            // (and back down on the ground: closed in the middle of its jump, it stayed floating)
            tl.to(a, { grow: 0, hop: 0, dust: 0, duration: 0.5, ease: 'power2.inOut' }).to(r, { y: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
        }
        return () => tl.kill()
    }, [active])

    useFrame(() => {
        const a = anim.current
        const g = group.current
        // (`sink`: a model with its own floor goes down into the island, its floor level with the ground)
        g.position.set(place.position[0], (mine ? 0 : ISLAND_TOP - (place.sink ?? 0) * (1 - a.grow)) + a.hop * 1.4, place.position[1])
        g.scale.setScalar((mine ? 1 : place.scale ?? 1) * (1 + a.grow * 1.6)) // grows considerably
        // (it stays still once it has grown: turning behind the blurred island it looked broken —
        // the big one in front, PlaceShowcase, is the one that turns)

        const puff = Math.sin(a.dust * Math.PI)
        dust.current.visible = puff > 0.01
        dust.current.scale.setScalar(0.6 + a.dust * 0.9)
        dust.current.children.forEach((c) => c.scale.setScalar(0.22 * puff))
    })

    return (
        <>
            {/* always facing its street, aligned with the curve of the river like its neighbours */}
            {/* (`turn`, island.json: degrees more, for the ones that look the other way) */}
            <group ref={group} name={`lugar_${place.id}`} rotation-y={mine ? 0 : yawAt(place.position[0]) + ((place.turn ?? 0) * Math.PI) / 180}>
                {mine && (
                    <group ref={spin} position={[-place.position[0], 0, -place.position[1]]}>
                        <UserPiece name={`lugar_${place.id}`} />
                    </group>
                )}
                <group ref={mine ? undefined : spin} visible={!mine}>
                    {/* (`size`: how wide the real model is on the island — some are bigger than the
                        placeholder they replace; the group above is already scaled by place.scale) */}
                    {!mine && <SwappableModel url={place.model} placeholder={Placeholder} size={place.size ? place.size / (place.scale ?? 1) : undefined} />}
                </group>
            </group>
            <group ref={dust} position={[place.position[0], ISLAND_TOP + 0.1, place.position[1]]} visible={false}>
                {Array.from({ length: 9 }, (_, i) => (
                    <mesh key={i} geometry={geo.sphereLow} position={[Math.cos((i / 9) * Math.PI * 2), 0, Math.sin((i / 9) * Math.PI * 2)]} material={mat(i % 2 ? PALETTE.lima : PALETTE.mango)} />
                ))}
            </group>
        </>
    )
}

export default function Places() {
    const mode = useExperience((s) => s.mode)
    const selected = useExperience((s) => s.selectedPlace)
    const selectPlace = useExperience((s) => s.selectPlace)

    return (
        <group>
            {PLACES.map((place) => (
                <PlaceSpot key={place.id} place={place} />
            ))}
            {mode === 'lugares' &&
                !selected &&
                PLACES.map((place, i) => (
                    <Marker key={place.id} index={i} position={place.position} label={place.name} glow={GLOW.lugares} onSelect={() => selectPlace(place.id)} />
                ))}
        </group>
    )
}
