import { Color } from 'three'

// Per-frame sky values written by Atmosphere and read by the clouds, rain and event decor
// (outside React: no re-renders).
//  night  0 day … 1 full night        cover  0 clear … 1 overcast
//  rain   0 … 1 rain intensity         flash  lightning 0 … 1
export const skyState = {
    night: 0,
    cover: 0,
    rain: 0,
    flash: 0,
    wind: 0.15, // 0 calm … 1 la brisa / storm
    bolt: null, // { id, x, z } of the last lightning bolt
    cloudLight: new Color('#FFFDF5'),
    cloudShade: new Color('#FFD7CF'),
}
