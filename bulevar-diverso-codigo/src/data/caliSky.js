/**
 * Cali's real sky: local time (America/Bogota) + current weather from Open-Meteo
 * (free, no API key, CORS enabled). Used when the visitor hasn't picked a time/weather by hand.
 */
export const CALI = { latitude: 3.4372, longitude: -76.5225, timeZone: 'America/Bogota' }

export const WEATHERS = {
    clear: 'Despejado',
    partly: 'Parcial',
    cloudy: 'Nublado',
    windy: 'Brisa', // la brisa caleña de la tarde
    fog: 'Neblina',
    drizzle: 'Llovizna',
    rain: 'Lluvia',
    storm: 'Tormenta',
}

// Until a plan is picked the island always shows the same bright late morning, so it reads well
// behind the plan selector; after that it follows Cali's real hour (and the sky panel appears)
export const PREVIEW_SKY = { hour: 10.5, weather: 'clear' }

// Inside each plan the island takes the moment of the day its slice shows: Lugares a sunny day,
// Eventos the night, Rutas the pink sunset (the sky panel can change it or go back to Cali's hour)
export const MODE_SKY = {
    lugares: { hour: 11.5, weather: 'clear' },
    eventos: { hour: 20.6, weather: 'clear' },
    rutas: { hour: 17.75, weather: 'clear' },
}

// The sky each event suggests (the panel shows it and you can still change it)
export const EVENT_SKY = {
    feria: { hour: 10.5, weather: 'clear' },
    alumbrado: { hour: 20.5, weather: 'clear' },
    sucursal: { hour: 21, weather: 'clear' }, // (a concert: at night, with its lights)
}

/** Hour of the day in Cali as a decimal (15.5 = 3:30 p. m.). */
export function caliHourNow(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: CALI.timeZone, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(date)
    const get = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0)
    return get('hour') + get('minute') / 60
}

/** 15.5 → "3:30 p. m." */
export function formatHour(hour) {
    const h = Math.floor(hour) % 24
    const m = Math.floor((hour - Math.floor(hour)) * 60)
    const h12 = h % 12 === 0 ? 12 : h % 12
    return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`
}

/** Part of the day, in caleño. */
export function dayPart(hour) {
    if (hour < 5) return 'Madrugada'
    if (hour < 7) return 'Amanecer'
    if (hour < 12) return 'Mañana'
    if (hour < 17) return 'Tarde'
    if (hour < 19) return 'Atardecer'
    return 'Noche'
}

/** WMO weather code (Open-Meteo) → one of our skies. */
export function weatherFromCode(code) {
    if (code >= 95) return 'storm'
    if (code >= 51 && code <= 57) return 'drizzle'
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 86)) return 'rain'
    if (code === 45 || code === 48) return 'fog'
    if (code === 3) return 'cloudy'
    if (code >= 1) return 'partly'
    return 'clear'
}

/** Current weather in Cali → { weather, temp } (throws on network errors). */
export async function fetchCaliWeather(signal) {
    const url =
        'https://api.open-meteo.com/v1/forecast' +
        `?latitude=${CALI.latitude}&longitude=${CALI.longitude}` +
        '&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m' +
        `&timezone=${encodeURIComponent(CALI.timeZone)}`
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`)
    const { current } = await res.json()
    let weather = weatherFromCode(current.weather_code)
    if ((weather === 'clear' || weather === 'partly') && current.cloud_cover > 70) weather = 'cloudy'
    if ((weather === 'clear' || weather === 'partly') && current.wind_speed_10m > 22) weather = 'windy'
    return { weather, temp: Math.round(current.temperature_2m) }
}
