import { Color } from 'three'

// The ONLY six colors of Bulevar Diverso. Every 3D material, light and CSS variable
// derives from these (see styles/global.css for the mirrored CSS custom properties).
export const PALETTE = {
    verde: '#769F13',
    lima: '#C1D653',
    naranja: '#FB8A44',
    mango: '#FAB045',
    rosa: '#FFA9A9',
    crema: '#FFFDF5',
}

// Derived tones (still the palette, just mixed or darkened) for night scenes and contrast.
export const mix = (a, b, t) => '#' + new Color(a).lerp(new Color(b), t).getHexString()
export const shade = (hex, k) => '#' + new Color(hex).multiplyScalar(k).getHexString()
