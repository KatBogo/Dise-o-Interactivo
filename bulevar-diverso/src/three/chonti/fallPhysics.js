import * as CANNON from 'cannon-es'

export const CHONTI_RADIUS = 0.6

/**
 * Tiny cannon-es world for the "¡no hay piso!" moment.
 * Chonti is a sphere resting on a static floor box; `dropFloor()` removes the floor
 * and gives a little startled hop backwards (−z = behind the clouds).
 */
export function createFallWorld(feet) {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -11, 0) })
    world.allowSleep = false

    const floor = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(1.2, 0.25, 1.2)),
        position: new CANNON.Vec3(feet.x, feet.y - 0.25, feet.z),
    })

    const chonti = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(CHONTI_RADIUS),
        position: new CANNON.Vec3(feet.x, feet.y + CHONTI_RADIUS, feet.z),
        linearDamping: 0.02,
        angularDamping: 0.05,
    })

    world.addBody(floor)
    world.addBody(chonti)

    return {
        chonti,
        dropFloor() {
            world.removeBody(floor)
            // loses his balance: a small stumble forward and back (−z = behind the front clouds)
            chonti.velocity.set(0.9, 1.1, -1.5)
            chonti.angularVelocity.set(-2.2, 0.6, -2.8)
        },
        step(dt) {
            world.step(1 / 60, dt, 3) // fixed timestep with interpolation-safe substeps
        },
    }
}
