import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import baseDesign from '../content/design.json'

/**
 * The design of the page, editable like in Figma (everything but the 3D):
 *  - the TOKENS: the palette, the fonts, the thickness of the lines (CSS variables on :root)
 *  - the COMPONENTS: cards, buttons, Chonti's bubble, the clock, the timeline… (a CSS rule each)
 *  - ANY element: DOUBLE CLICK it on the page (or "Elegir en la página" → click it) and edit it
 *  - the TEXTS: what an element says (design.texts, swapped wherever that text shows)
 * Everything becomes one <style> at the end of the page (it wins over the page's own CSS).
 * Visitors get src/content/design.json; while you edit, your changes are kept in this browser
 * (localStorage) and "Exportar" downloads them as design.json → put it in Assets/diseno.json and
 * the next build publishes it (scripts/sync-assets.mjs copies it to src/content/design.json).
 * Open the editor with ?debug (or ?editar) at the end of the address.
 */
const KEY = 'bulevar-diverso:diseno'
const STYLE_ID = 'bulevar-diseno'

const TOKENS = [
    ['--verde', 'Verde', 'color'],
    ['--lima', 'Lima', 'color'],
    ['--naranja', 'Naranja', 'color'],
    ['--mango', 'Mango', 'color'],
    ['--rosa', 'Rosa', 'color'],
    ['--crema', 'Crema (fondos)', 'color'],
    ['--ink', 'Tinta (textos y líneas)', 'color'],
    ['--tierra-oscuro', 'Fondo de la historia', 'color'],
    ['--vol-fill', 'Volumen: relleno', 'color'],
    ['--vol-track', 'Volumen: fondo', 'color'],
    ['--line', 'Línea de los bordes', 'line'],
    ['--font-title', 'Fuente de títulos', 'font'],
    ['--font-text', 'Fuente de textos', 'font'],
]

const COMPONENTS = [
    ['Tarjetas', '.card, .panel--list'],
    ['Títulos de tarjetas', '.card__title, .panel__title, .focus__title'],
    ['Textos de tarjetas', '.card__text, .focus__story p, .builder-rule'],
    ['Botones', '.btn'],
    ['Botón principal (naranja)', '.btn--primary'],
    ['Botones de arriba (Historia, Sonido)', '.hud__actions .btn'],
    ['Nombre "Bulevar Diverso"', '.hud__brand'],
    ['Planes (Lugares, Eventos, Rutas)', '.filter'],
    ['Botones de tipos de ruta', '.list--choices .list__item'],
    ['Burbuja de Chonti', '.guide-bubble'],
    ['Panel de la hora', '.sky'],
    ['Tarjeta "Arma tu ruta"', '.card--builder'],
    ['Paradas elegidas (chips)', '.itinerary--chips li'],
    ['Campos de texto', '.field input'],
    ['Historia · año', '.tl-item__year'],
    ['Historia · título', '.tl-item__title'],
    ['Historia · texto', '.tl-item__text'],
    ['Historia · foto', '.tl-item__media'],
    ['Texto de abajo ("Arrastra…")', '.stage-hint'],
]

// quick shadows (the sliders then fine-tune them): x, y, blur, spread, opacity
const SHADOW_PRESETS = [
    ['Alrededor', { x: 0, y: 0, blur: 24, spread: 2, a: 0.3 }],
    ['Abajo', { x: 0, y: 12, blur: 26, spread: -8, a: 0.35 }],
    ['Suave', { x: 0, y: 4, blur: 14, spread: 0, a: 0.15 }],
    ['Relieve', { x: 0, y: 4, blur: 0, spread: 0, a: 1 }],
    ['Brillo', { x: 0, y: 0, blur: 18, spread: 6, a: 0.6, hex: '#FFE2A8' }],
]
const FONTS = {
    '': 'La de la página',
    "var(--font-bebas), 'Bebas Neue', Impact, sans-serif": 'Bebas Neue (títulos)',
    "var(--font-poppins), 'Poppins', system-ui, sans-serif": 'Poppins (textos)',
    'system-ui, sans-serif': 'Del sistema',
    'Georgia, serif': 'Georgia (con serifa)',
    "'Courier New', monospace": 'Monoespaciada',
}
const WEIGHTS = { '': 'La de la página', 300: 'Delgada', 400: 'Normal', 500: 'Media', 600: 'Semi negrita', 700: 'Negrita' }

const DISPLAY = { '': 'Como está', none: 'Oculto', block: 'Bloque', flex: 'Flex (en fila o columna)', grid: 'Cuadrícula', 'inline-flex': 'Flex en línea', 'inline-block': 'En línea' }
const DIRECTION = { '': 'Como está', row: 'En fila →', column: 'En columna ↓', 'row-reverse': 'En fila ←', 'column-reverse': 'En columna ↑' }
const JUSTIFY = { '': 'Como está', 'flex-start': 'Al inicio', center: 'Al centro', 'flex-end': 'Al final', 'space-between': 'Repartidos (extremos)', 'space-around': 'Repartidos' }
const ALIGN = { '': 'Como está', stretch: 'Estirados', 'flex-start': 'Arriba / inicio', center: 'Al centro', 'flex-end': 'Abajo / final' }
const TEXT_ALIGN = { '': 'Como está', left: 'Izquierda', center: 'Centro', right: 'Derecha', justify: 'Justificado' }
const TRANSFORM = { '': 'Como está', none: 'Normal', uppercase: 'MAYÚSCULAS', lowercase: 'minúsculas', capitalize: 'Primera Mayúscula' }
const POSITION = { '': 'Como está', static: 'Normal (en el flujo)', relative: 'Relativa', absolute: 'Absoluta (dentro de su caja)', fixed: 'Fija en la pantalla' }
const WRAP = { '': 'Como está', nowrap: 'En una línea', wrap: 'Que baje de línea' }
const BORDER_STYLE = { '': 'Como está', solid: 'Línea', dashed: 'Rayas', dotted: 'Puntos', none: 'Sin borde' }

const SIDES = [['Arriba', 'top'], ['Derecha', 'right'], ['Abajo', 'bottom'], ['Izquierda', 'left']]
const CORNERS = [['Arriba a la izquierda', 'top-left'], ['Arriba a la derecha', 'top-right'], ['Abajo a la derecha', 'bottom-right'], ['Abajo a la izquierda', 'bottom-left']]
const BLEND = { '': 'Normal', multiply: 'Multiplicar', screen: 'Aclarar', overlay: 'Superponer', 'soft-light': 'Luz suave', difference: 'Diferencia', luminosity: 'Luminosidad' }

// the properties of an element you can change, by section (label, css property, kind, extra)
const SECTIONS = [
    ['Colores', [
        ['Fondo', 'background', 'color'],
        ['Degradado de fondo', 'background-image', 'gradient'],
        ['Color del texto', 'color', 'color'],
        ['Color del borde', 'border-color', 'color'],
    ]],
    ['Borde y forma', [
        ['Grosor del borde', 'border-width', 'range', [0, 8, 0.5, 'px']],
        ['Estilo del borde', 'border-style', 'select', BORDER_STYLE],
        ['Redondeo de esquinas', 'border-radius', 'range', [0, 80, 1, 'px']],
    ]],
    // (like Figma: each side of the border, each corner, on its own)
    ['Bordes por lado', SIDES.flatMap(([l, s]) => [
        [`${l} · grosor`, `border-${s}-width`, 'range', [0, 12, 0.5, 'px']],
        [`${l} · color`, `border-${s}-color`, 'color'],
        [`${l} · estilo`, `border-${s}-style`, 'select', BORDER_STYLE],
    ])],
    ['Esquinas por separado', CORNERS.map(([l, c]) => [l, `border-${c}-radius`, 'range', [0, 120, 1, 'px']])],
    ['Sombra', [
        ['Sombra del objeto', 'box-shadow', 'shadow'],
        ['Sombra del texto', 'text-shadow', 'textShadow'],
    ]],
    ['Letra', [
        ['Tamaño de letra', 'font-size', 'range', [6, 160, 1, 'px']],
        ['Grosor de letra', 'font-weight', 'select', WEIGHTS],
        ['Fuente', 'font-family', 'select', FONTS],
        ['Cursiva', 'font-style', 'select', { '': 'Como está', normal: 'Normal', italic: 'Cursiva' }],
        ['Subrayado', 'text-decoration-line', 'select', { '': 'Como está', none: 'Sin línea', underline: 'Subrayado', 'line-through': 'Tachado', overline: 'Línea arriba' }],
        ['Alto de línea', 'line-height', 'range', [0.7, 2.4, 0.05, '']],
        ['Espacio entre letras', 'letter-spacing', 'range', [-0.05, 0.4, 0.01, 'em']],
        ['Espacio entre palabras', 'word-spacing', 'range', [-0.2, 1, 0.02, 'em']],
        ['Alineación del texto', 'text-align', 'select', TEXT_ALIGN],
        ['Mayúsculas', 'text-transform', 'select', TRANSFORM],
    ]],
    ['Tamaño', [
        ['Ancho', 'width', 'range', [0, 1400, 1, 'px']],
        ['Ancho mínimo', 'min-width', 'range', [0, 1400, 1, 'px']],
        ['Ancho máximo', 'max-width', 'range', [0, 1400, 1, 'px']],
        ['Alto', 'height', 'range', [0, 1000, 1, 'px']],
        ['Alto mínimo', 'min-height', 'range', [0, 1000, 1, 'px']],
        ['Alto máximo', 'max-height', 'range', [0, 1200, 1, 'px']],
        ['Recortar lo que se sale', 'overflow', 'select', { '': 'Como está', visible: 'Se ve todo', hidden: 'Recortar', auto: 'Con barra de desplazamiento' }],
    ]],
    ['Espacios', [
        ['Relleno (todo)', 'padding', 'range', [0, 80, 1, 'px']],
        ['Relleno arriba y abajo', 'padding-block', 'range', [0, 80, 1, 'px']],
        ['Relleno a los lados', 'padding-inline', 'range', [0, 80, 1, 'px']],
        ...SIDES.map(([l, s]) => [`Relleno · ${l.toLowerCase()}`, `padding-${s}`, 'range', [0, 100, 1, 'px']]),
        ['Margen (todo)', 'margin', 'range', [-80, 120, 1, 'px']],
        ...SIDES.map(([l, s]) => [`Margen · ${l.toLowerCase()}`, `margin-${s}`, 'range', [-80, 160, 1, 'px']]),
        ['Separación entre lo de adentro', 'gap', 'range', [0, 80, 1, 'px']],
    ]],
    ['Contorno (por fuera del borde)', [
        ['Grosor', 'outline-width', 'range', [0, 12, 0.5, 'px']],
        ['Color', 'outline-color', 'color'],
        ['Estilo', 'outline-style', 'select', BORDER_STYLE],
        ['Separación del objeto', 'outline-offset', 'range', [-20, 30, 1, 'px']],
    ]],
    ['Disposición', [
        ['Mostrar', 'display', 'select', DISPLAY],
        ['Dirección de lo de adentro', 'flex-direction', 'select', DIRECTION],
        ['Repartir a lo largo', 'justify-content', 'select', JUSTIFY],
        ['Alinear a lo ancho', 'align-items', 'select', ALIGN],
        ['Bajar de línea', 'flex-wrap', 'select', WRAP],
        ['Columnas (cuadrícula)', 'grid-template-columns', 'text'],
    ]],
    ['Posición', [
        ['Tipo de posición', 'position', 'select', POSITION],
        ['Arriba', 'top', 'range', [-200, 1000, 1, 'px']],
        ['Derecha', 'right', 'range', [-200, 1600, 1, 'px']],
        ['Abajo', 'bottom', 'range', [-200, 1000, 1, 'px']],
        ['Izquierda', 'left', 'range', [-200, 1600, 1, 'px']],
        ['Mover (a los lados · arriba o abajo)', 'translate', 'move', [-400, 400, 1, 'px']],
        ['Girar', 'rotate', 'range', [-180, 180, 1, 'deg']],
        ['Escala', 'scale', 'range', [0.2, 3, 0.05, '']],
        ['Capa (encima / debajo)', 'z-index', 'range', [-5, 200, 1, '']],
    ]],
    ['Efectos', [
        ['Opacidad', 'opacity', 'range', [0, 1, 0.05, '']],
        ['Desenfoque del objeto', 'filter', 'select', { '': 'Como está', none: 'Nítido', 'blur(1px)': 'Muy poco', 'blur(3px)': 'Poco', 'blur(6px)': 'Medio', 'blur(12px)': 'Mucho', 'grayscale(1)': 'Blanco y negro', 'brightness(1.15)': 'Más brillante', 'brightness(0.85)': 'Más oscuro', 'saturate(1.5)': 'Más saturado' }],
        ['Desenfoque detrás', 'backdrop-filter', 'select', { '': 'Como está', none: 'Sin desenfoque', 'blur(4px)': 'Poco', 'blur(10px)': 'Medio', 'blur(20px)': 'Mucho' }],
        ['Mezcla con lo de atrás', 'mix-blend-mode', 'select', BLEND],
    ]],
]
const PROPS = SECTIONS.flatMap(([, list]) => list)
// (the CSS goes out in this order — the whole border first, then each side — whatever order you edited in)
const ORDER = new Map(PROPS.map(([, p], i) => [p, i]))
const load = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) ?? null
    } catch {
        return null
    }
}
const clean = (d) => ({ tokens: { ...(d?.tokens ?? {}) }, rules: { ...(d?.rules ?? {}) }, texts: { ...(d?.texts ?? {}) } })

// ── Texts: any text of the page can be rewritten — design.texts = { "the original": "the new one" }.
// They are swapped wherever that exact text shows (also when the page draws it again), and the
// placeholders of the fields too; taking one out puts the original back.
let TEXTS = {}
const shownText = new WeakMap() // text node → { orig, shown }
const shownHint = new WeakMap() // field → { orig, shown } (its placeholder)
function fixText(n) {
    if (n.parentElement?.closest('.de-panel, style, script, noscript')) return
    let s = shownText.get(n)
    if (s && n.nodeValue !== s.shown) s = null // (the page changed it itself: that is its new original)
    const orig = s ? s.orig : n.nodeValue
    const key = orig.trim()
    const to = key ? TEXTS[key] : null
    const next = to ? orig.replace(key, to) : orig
    if (next === orig && !s) return
    if (n.nodeValue !== next) n.nodeValue = next
    if (next === orig) shownText.delete(n)
    else shownText.set(n, { orig, shown: next })
}
function fixHint(el) {
    if (el.closest('.de-panel')) return
    const now = el.getAttribute('placeholder') ?? ''
    let s = shownHint.get(el)
    if (s && now !== s.shown) s = null
    const orig = s ? s.orig : now
    const next = TEXTS[orig.trim()] || orig
    if (next === orig && !s) return
    if (now !== next) el.setAttribute('placeholder', next)
    if (next === orig) shownHint.delete(el)
    else shownHint.set(el, { orig, shown: next })
}
function fixAll(root) {
    if (root.nodeType === 3) return fixText(root)
    if (root.nodeType !== 1) return
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    for (let n = w.nextNode(); n; n = w.nextNode()) fixText(n)
    if (root.hasAttribute('placeholder')) fixHint(root)
    root.querySelectorAll('[placeholder]').forEach(fixHint)
}
let textObserver = null
function applyTexts(texts) {
    TEXTS = { ...texts }
    if (!textObserver && Object.keys(TEXTS).length) {
        // (what the page draws later gets its new text too)
        textObserver = new MutationObserver((list) => {
            for (const m of list) {
                if (m.type === 'characterData') fixText(m.target)
                else if (m.type === 'attributes') fixHint(m.target)
                else m.addedNodes.forEach(fixAll)
            }
        })
        textObserver.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder'] })
    }
    fixAll(document.body)
}
/** The texts inside an element, as they originally were (to edit them). */
function textsOf(el) {
    const out = []
    const add = (kind, orig) => orig && !out.some((t) => t.orig === orig) && out.push({ kind, orig })
    if (el.hasAttribute('placeholder')) add('hint', (shownHint.get(el)?.orig ?? el.getAttribute('placeholder')).trim())
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    for (let n = w.nextNode(); n && out.length < 12; n = w.nextNode()) add('text', (shownText.get(n)?.orig ?? n.nodeValue).trim())
    return out
}

function cssOf(design) {
    const t = Object.entries(design.tokens).filter(([, v]) => v !== '' && v != null)
    let css = t.length ? `:root{${t.map(([k, v]) => `${k}:${v}`).join(';')}}\n` : ''
    for (const [sel, props] of Object.entries(design.rules)) {
        const p = Object.entries(props)
            .filter(([k, v]) => k !== '__css' && v !== '' && v != null)
            .sort(([a], [b]) => (ORDER.get(a) ?? 999) - (ORDER.get(b) ?? 999))
        const own = (props.__css ?? '').trim() // (free CSS for anything without its own control)
        if (!p.length && !own) continue
        // (a border width needs a border style to show: the whole border or just that side)
        const extra = ['', '-top', '-right', '-bottom', '-left', 'outline']
            .map((s) => (s === 'outline' ? ['outline-width', 'outline-style'] : [`border${s}-width`, `border${s}-style`]))
            .filter(([w, st]) => props[w] && !props[st] && !(st !== 'border-style' && st !== 'outline-style' && props['border-style']))
            .map(([, st]) => `;${st}:solid!important`)
            .join('')
        const ownCss = own ? ';' + own.split(';').filter((d) => d.trim()).map((d) => (/!important/.test(d) ? d : d + '!important')).join(';') : ''
        css += `${sel}{${p.map(([k, v]) => `${k}:${v}!important`).join(';')}${extra}${ownCss}}\n`
    }
    return css
}
function apply(design) {
    if (typeof document === 'undefined') return
    let el = document.getElementById(STYLE_ID)
    if (!el) {
        el = document.createElement('style')
        el.id = STYLE_ID
        document.head.appendChild(el)
    }
    el.textContent = cssOf(design)
    applyTexts(design.texts ?? {})
}

/** Always mounted: applies the published design (and, in your browser, your unsaved edits). */
export function DesignStyle() {
    useEffect(() => {
        const mine = load()
        apply(clean(mine ?? baseDesign))
    }, [])
    return null
}

/** A readable selector for a clicked element: its own classes (or its tag inside its parent's). */
function selectorFor(el) {
    const cls = [...el.classList].filter((c) => !/^(is-|has-)/.test(c))
    if (cls.length) return '.' + cls.slice(0, 2).join('.')
    const p = el.parentElement
    const pc = p && [...p.classList][0]
    return pc ? `.${pc} > ${el.tagName.toLowerCase()}` : el.tagName.toLowerCase()
}
/**
 * The element under the pointer — even the ones that let clicks through (Chonti's bubble, the
 * text under the plans, the name…): the smallest visible box there, outside the editor.
 */
function pickAt(x, y) {
    let best = null, area = Infinity
    for (const el of document.body.querySelectorAll('*')) {
        if (el.closest('.de-panel, .de-hover, .de-fab') || el.closest('svg') !== null && el.tagName !== 'svg') continue
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height || x < r.left || x > r.right || y < r.top || y > r.bottom) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
        if (el.tagName === 'CANVAS' || el.tagName === 'DIV' && el.querySelector(':scope > canvas')) continue
        const a = r.width * r.height
        if (a < area) (best = el), (area = a)
    }
    return best
}

/** The exact path to ONE element (only that one changes): tag:nth-of-type steps from the body. */
function exactFor(el) {
    const steps = []
    for (let e = el; e && e !== document.body && steps.length < 12; e = e.parentElement) {
        const p = e.parentElement
        if (!p) break
        const same = [...p.children].filter((c) => c.tagName === e.tagName)
        steps.unshift(`${e.tagName.toLowerCase()}${same.length > 1 ? `:nth-of-type(${same.indexOf(e) + 1})` : ''}`)
    }
    return 'body > ' + steps.join(' > ')
}
const chain = (el) => {
    const out = []
    for (let e = el; e && e !== document.body && out.length < 5; e = e.parentElement) if (e.classList.length || out.length === 0) out.push(e)
    return out
}

/** What the page shows now (so each field starts from the real value, not from a blank). */
const toHex = (c) => {
    if (/^rgba\(.*,\s*0\)$/.test(c?.trim() ?? '') || c === 'transparent') return '' // (no colour: transparent)
    const m = c?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    return m ? '#' + m.slice(1, 4).map((n) => (+n).toString(16).padStart(2, '0')).join('') : c?.trim()
}
function current(selector, prop) {
    if (typeof document === 'undefined') return ''
    if (prop.startsWith('--')) return getComputedStyle(document.documentElement).getPropertyValue(prop).trim()
    try {
        const el = document.querySelector(selector)
        return el ? getComputedStyle(el).getPropertyValue(prop === 'background' ? 'background-color' : prop).trim() : ''
    } catch {
        return ''
    }
}

// ── Shadows like in Figma: where it goes (x, y), how blurred, how far it spreads, colour,
// opacity, outside or inside — "Alrededor" (x = y = 0) puts it around the whole object.
const COLOR_RE = /rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/i
function parseShadow(str) {
    if (!str || str === 'none') return null
    const first = str.split(/,(?![^(]*\))/)[0] // (only the first, if there are several)
    const color = first.match(COLOR_RE)?.[0] ?? 'rgba(0,0,0,0.3)'
    const nums = first.replace(color, '').replace('inset', '').match(/-?[\d.]+/g)?.map(Number) ?? []
    let hex = '#000000', a = 1
    const m = color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/)
    if (m) (hex = '#' + m.slice(1, 4).map((n) => (+n | 0).toString(16).padStart(2, '0')).join('')), (a = m[4] != null ? +m[4] : 1)
    else if (/^#[0-9a-f]{6}$/i.test(color)) hex = color
    return { x: nums[0] ?? 0, y: nums[1] ?? 0, blur: nums[2] ?? 0, spread: nums[3] ?? 0, hex, a, inset: /inset/.test(first) }
}
function buildShadow(s, text) {
    const n = parseInt(s.hex.slice(1), 16)
    const rgba = `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${s.a})`
    return text ? `${s.x}px ${s.y}px ${s.blur}px ${rgba}` : `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`
}
function Slider({ label, min, max, step = 1, value, onChange, unit = 'px' }) {
    return (
        <div className="de-mini">
            <span>{label}</span>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
            <em>{value}{unit}</em>
        </div>
    )
}
function ShadowField({ label, prop, value, onChange, now, text }) {
    const s = parseShadow(value) ?? parseShadow(now)
    const base = s ?? { x: 0, y: text ? 2 : 0, blur: text ? 6 : 24, spread: 0, hex: '#000000', a: 0.3, inset: false }
    const set = (k, v) => onChange(prop, buildShadow({ ...base, [k]: v }, text))
    return (
        <div className="de-row">
            <label>{label}</label>
            <div className="de-chips">
                {SHADOW_PRESETS.filter(([n]) => !text || n !== 'Relieve').map(([n, p]) => (
                    <button key={n} className="de-chip" onClick={() => onChange(prop, buildShadow({ ...base, hex: '#000000', inset: false, ...p }, text))}>{n}</button>
                ))}
                <button className="de-chip" onClick={() => onChange(prop, 'none')}>Sin sombra</button>
                {value && <button className="de-chip" onClick={() => onChange(prop, '')} title="Volver a la de la página">✕</button>}
            </div>
            <div className="de-box">
                <Slider label="↔ X" min={-60} max={60} value={base.x} onChange={(v) => set('x', v)} />
                <Slider label="↕ Y" min={-60} max={60} value={base.y} onChange={(v) => set('y', v)} />
                <Slider label="Desenfoque" min={0} max={120} value={base.blur} onChange={(v) => set('blur', v)} />
                {!text && <Slider label="Extensión" min={-40} max={60} value={base.spread} onChange={(v) => set('spread', v)} />}
                <div className="de-mini">
                    <span>Color</span>
                    <input type="color" value={base.hex} onChange={(e) => set('hex', e.target.value)} />
                    <em />
                </div>
                <Slider label="Opacidad" min={0} max={1} step={0.05} unit="" value={base.a} onChange={(v) => set('a', v)} />
                {!text && (
                    <label className="de-check">
                        <input type="checkbox" checked={!!base.inset} onChange={(e) => set('inset', e.target.checked)} /> Por dentro del objeto
                    </label>
                )}
            </div>
        </div>
    )
}
// ── A background gradient: two colours and the angle
function parseGradient(str) {
    const m = str?.match(/linear-gradient\((-?[\d.]+)deg,\s*(#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/i)
    return m ? { angle: +m[1], c1: m[2], c2: m[3] } : null
}
function GradientField({ label, prop, value, onChange }) {
    const g = parseGradient(value) ?? { angle: 180, c1: '#FFFDF5', c2: '#E2A0C8' }
    const set = (k, v) => onChange(prop, (({ angle, c1, c2 }) => `linear-gradient(${angle}deg, ${c1}, ${c2})`)({ ...g, [k]: v }))
    return (
        <div className="de-row">
            <label className="de-check">
                <input type="checkbox" checked={!!value && value !== 'none'} onChange={(e) => onChange(prop, e.target.checked ? `linear-gradient(${g.angle}deg, ${g.c1}, ${g.c2})` : '')} /> {label}
            </label>
            {value && value !== 'none' && (
                <div className="de-box">
                    <div className="de-mini"><span>Color 1</span><input type="color" value={g.c1} onChange={(e) => set('c1', e.target.value)} /><em /></div>
                    <div className="de-mini"><span>Color 2</span><input type="color" value={g.c2} onChange={(e) => set('c2', e.target.value)} /><em /></div>
                    <Slider label="Ángulo" min={0} max={360} unit="°" value={g.angle} onChange={(v) => set('angle', v)} />
                </div>
            )}
        </div>
    )
}

function Field({ label, prop, kind, extra, value, onChange, now = '' }) {
    const id = useMemo(() => `de-${Math.random().toString(36).slice(2)}`, [])
    if (kind === 'shadow' || kind === 'textShadow') return <ShadowField label={label} prop={prop} value={value} onChange={onChange} now={now} text={kind === 'textShadow'} />
    if (kind === 'gradient') return <GradientField label={label} prop={prop} value={value} onChange={onChange} />
    if (kind === 'color') {
        const shown = value || toHex(now)
        const hex = /^#[0-9a-f]{6}$/i.test(shown ?? '') ? shown : '#ffffff'
        return (
            <div className="de-row">
                <label htmlFor={id}>{label}</label>
                <span className="de-color">
                    <input id={id} type="color" value={hex} onChange={(e) => onChange(prop, e.target.value)} />
                    <input type="text" value={value ?? ''} placeholder={toHex(now) || '—'} onChange={(e) => onChange(prop, e.target.value)} />
                    {value && <button className="de-x" onClick={() => onChange(prop, '')} title="Quitar">✕</button>}
                </span>
            </div>
        )
    }
    if (kind === 'select') {
        return (
            <div className="de-row">
                <label htmlFor={id}>{label}</label>
                <select id={id} value={value ?? ''} onChange={(e) => onChange(prop, e.target.value)}>
                    {Object.entries(extra).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
            </div>
        )
    }
    if (kind === 'text') {
        return (
            <div className="de-row">
                <label htmlFor={id}>{label}</label>
                <input id={id} type="text" value={value ?? ''} placeholder={now || 'ej: 1fr 1fr'} onChange={(e) => onChange(prop, e.target.value)} />
            </div>
        )
    }
    const [min, max, step, unit] = extra
    if (kind === 'move') {
        // (two sliders: left / right and up / down)
        const [mx, my] = (value || '0px 0px').split(' ').map((v) => parseFloat(v) || 0)
        return (
            <div className="de-row">
                <label>{label}</label>
                <span className="de-range">
                    <input type="range" min={min} max={max} step={step} value={mx} onChange={(e) => onChange(prop, `${e.target.value}px ${my}px`)} aria-label="Mover a los lados" />
                    <input type="range" min={min} max={max} step={step} value={my} onChange={(e) => onChange(prop, `${mx}px ${e.target.value}px`)} aria-label="Mover arriba o abajo" />
                    {value && <button className="de-x" onClick={() => onChange(prop, '')} title="Quitar">✕</button>}
                </span>
            </div>
        )
    }
    const num = parseFloat(value || now) // (NaN for words like "normal" or "auto")
    return (
        <div className="de-row">
            <label htmlFor={id}>{label}</label>
            <span className="de-range">
                <input id={id} type="range" min={min} max={max} step={step} value={Number.isFinite(num) ? num : min} onChange={(e) => onChange(prop, `${e.target.value}${unit}`)} />
                <input type="text" value={value ?? ''} placeholder={now || '—'} onChange={(e) => onChange(prop, e.target.value)} />
                {value && <button className="de-x" onClick={() => onChange(prop, '')} title="Quitar">✕</button>}
            </span>
        </div>
    )
}

/** One text of the page: what it says now, editable (empty or the same as before = the original). */
function TextField({ orig, hint, value, onChange }) {
    const [draft, setDraft] = useState(value ?? orig)
    useEffect(() => setDraft(value ?? orig), [orig]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="de-row">
            <label>{hint ? 'Texto de ayuda del campo' : orig.length > 46 ? orig.slice(0, 44) + '…' : orig}</label>
            <span className="de-color">
                <textarea className="de-css de-text" rows={Math.min(5, Math.ceil(draft.length / 34) || 1)} value={draft}
                    onChange={(e) => (setDraft(e.target.value), onChange(orig, e.target.value))} />
                {value && <button className="de-x" onClick={() => (setDraft(orig), onChange(orig, ''))} title="Volver al texto original">✕</button>}
            </span>
        </div>
    )
}
function TextEditor({ texts, design, setDesign }) {
    const set = (orig, v) => setDesign((d) => {
        const t = { ...d.texts }
        if (!v.trim() || v === orig) delete t[orig]
        else t[orig] = v
        return { ...d, texts: t }
    })
    return (
        <details className="de-sec" open>
            <summary>Texto</summary>
            {texts.map((t) => <TextField key={t.orig} orig={t.orig} hint={t.kind === 'hint'} value={design.texts[t.orig]} onChange={set} />)}
            <p className="de-note" style={{ marginTop: 8 }}>Cambia ese texto en toda la página, donde aparezca igual.</p>
        </details>
    )
}

function RuleEditor({ selector, design, setDesign }) {
    const props = design.rules[selector] ?? {}
    const change = (prop, v) => setDesign((d) => ({ ...d, rules: { ...d.rules, [selector]: { ...(d.rules[selector] ?? {}), [prop]: v } } }))
    return (
        <div className="de-rule">
            {SECTIONS.map(([title, list], i) => (
                <details key={title} className="de-sec" open={i < 2}>
                    <summary>{title}</summary>
                    {list.map(([label, prop, kind, extra]) => (
                        <Field key={selector + prop} label={label} prop={prop} kind={kind} extra={extra} value={props[prop]} onChange={change} now={current(selector.split(',')[0], prop)} />
                    ))}
                </details>
            ))}
            <details className="de-sec">
                <summary>CSS libre (para lo que no tenga control)</summary>
                <textarea className="de-css" rows={5} value={props.__css ?? ''} placeholder={'ej:\noutline: 2px dashed red;\ncursor: pointer;'} onChange={(e) => change('__css', e.target.value)} />
            </details>
            <button className="de-btn de-btn--soft" onClick={() => setDesign((d) => { const r = { ...d.rules }; delete r[selector]; return { ...d, rules: r } })}>
                Quitar los cambios de esto
            </button>
        </div>
    )
}

export default function DesignEditor() {
    const [enabled] = useState(() => typeof window !== 'undefined' && /[?&](editar|debug)\b/.test(window.location.search))
    const [open, setOpen] = useState(true)
    const [left, setLeft] = useState(false) // (the panel can sit on either side, to see what is under it)
    const [tab, setTab] = useState('tokens')
    const [design, setDesign] = useState(() => clean(load() ?? baseDesign))
    const [group, setGroup] = useState(COMPONENTS[0][1])
    const [picking, setPicking] = useState(false)
    const [picked, setPicked] = useState(null) // { options: [selector…], selector, texts }
    const hover = useRef()
    const file = useRef()

    // an element of the page chosen to edit: open the panel on it and outline it for a moment
    const choose = useRef()
    choose.current = (el) => {
        const options = [exactFor(el), ...new Set(chain(el).map(selectorFor))]
        setPicked({ options, selector: options[0], texts: textsOf(el), at: Date.now() })
        setPicking(false)
        setTab('pick')
        setOpen(true)
        const box = hover.current
        if (!box) return
        const r = el.getBoundingClientRect()
        Object.assign(box.style, { display: 'block', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` })
        clearTimeout(box._t)
        box._t = setTimeout(() => (box.style.display = 'none'), 1400)
    }

    // DOUBLE CLICK on anything of the page chooses it (no need to press "Elegir un elemento")
    useEffect(() => {
        if (!enabled) return
        const dbl = (e) => {
            if (e.target.closest?.('.de-panel, .de-fab')) return
            const el = pickAt(e.clientX, e.clientY)
            if (!el) return
            const r = el.getBoundingClientRect()
            if (r.width * r.height > window.innerWidth * window.innerHeight * 0.5) return // (the empty 3D view stays the page's)
            e.preventDefault()
            e.stopPropagation()
            window.getSelection()?.removeAllRanges() // (a double click also selects a word)
            choose.current(el)
        }
        window.addEventListener('dblclick', dbl, true)
        return () => window.removeEventListener('dblclick', dbl, true)
    }, [enabled])

    useEffect(() => {
        if (!enabled) return
        apply(design)
        try {
            localStorage.setItem(KEY, JSON.stringify(design))
        } catch {
            /* private mode */
        }
    }, [design, enabled])

    // "Elegir en la página": hover outlines, click picks (the page doesn't get that click)
    useEffect(() => {
        if (!picking) return
        const box = hover.current
        const inside = (e) => e.target.closest?.('.de-panel')
        let last = null, at = 0
        const move = (e) => {
            if (inside(e)) return (box.style.display = 'none')
            if (performance.now() - at < 50) return // (a few times a second is enough)
            at = performance.now()
            last = pickAt(e.clientX, e.clientY)
            if (!last) return
            const r = last.getBoundingClientRect()
            Object.assign(box.style, { display: 'block', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` })
        }
        const click = (e) => {
            if (inside(e)) return
            e.preventDefault()
            e.stopPropagation()
            box.style.display = 'none'
            choose.current(pickAt(e.clientX, e.clientY) ?? e.target)
        }
        window.addEventListener('pointermove', move, true)
        window.addEventListener('click', click, true)
        return () => {
            window.removeEventListener('pointermove', move, true)
            window.removeEventListener('click', click, true)
        }
    }, [picking])

    if (!enabled) return null
    const setToken = (k, v) => setDesign((d) => ({ ...d, tokens: { ...d.tokens, [k]: v } }))
    const exportIt = () => {
        const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'design.json'
        a.click()
        URL.revokeObjectURL(a.href)
    }
    const importIt = (f) => {
        const r = new FileReader()
        r.onload = () => {
            try {
                setDesign(clean(JSON.parse(r.result)))
            } catch {
                alert('Ese archivo no es un diseño válido.')
            }
        }
        r.readAsText(f)
    }

    return createPortal(
        <>
            <style>{EDITOR_CSS}</style>
            <div ref={hover} className="de-hover" />
            {!open ? (
                <button className="de-fab" onClick={() => setOpen(true)}>✎ Diseño</button>
            ) : (
                <aside className={`de-panel ${left ? 'is-left' : ''}`} aria-label="Editor de diseño">
                    <header className="de-head">
                        <strong>Editor de diseño</strong>
                        <span>
                            <button className="de-x" onClick={() => setLeft((l) => !l)} title="Pasar el panel al otro lado">⇆</button>{' '}
                            <button className="de-x" onClick={() => setOpen(false)} title="Minimizar">–</button>
                        </span>
                    </header>
                    <nav className="de-tabs">
                        {[['tokens', 'Colores y letras'], ['components', 'Componentes'], ['pick', 'Elegir en la página']].map(([k, l]) => (
                            <button key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{l}</button>
                        ))}
                    </nav>
                    <div className="de-body">
                        {tab === 'tokens' && (
                            <div className="de-rule">
                                <p className="de-note">Cambian toda la página a la vez.</p>
                                {TOKENS.map(([k, label, kind]) =>
                                    kind === 'color' ? (
                                        <Field key={k} label={label} prop={k} kind="color" value={design.tokens[k]} onChange={setToken} now={current(':root', k)} />
                                    ) : kind === 'font' ? (
                                        <Field key={k} label={label} prop={k} kind="select" extra={FONTS} value={design.tokens[k]} onChange={setToken} />
                                    ) : (
                                        <Field key={k} label={label} prop={k} kind="select" value={design.tokens[k]} onChange={setToken}
                                            extra={{ '': 'La de la página (1 px)', '0 solid transparent': 'Sin líneas', '1px solid var(--ink)': '1 px', '2px solid var(--ink)': '2 px', '3px solid var(--ink)': '3 px' }} />
                                    )
                                )}
                            </div>
                        )}
                        {tab === 'components' && (
                            <>
                                <div className="de-row">
                                    <label htmlFor="de-group">Qué editar</label>
                                    <select id="de-group" value={group} onChange={(e) => setGroup(e.target.value)}>
                                        {COMPONENTS.map(([l, s]) => <option key={s} value={s}>{l}</option>)}
                                    </select>
                                </div>
                                <RuleEditor selector={group} design={design} setDesign={setDesign} />
                            </>
                        )}
                        {tab === 'pick' && (
                            <>
                                <p className="de-note">Haz <b>doble clic</b> en cualquier cosa de la página para editarla, o usa este botón.</p>
                                <button className={`de-btn ${picking ? 'is-on' : ''}`} onClick={() => setPicking((p) => !p)}>
                                    {picking ? 'Toca un elemento de la página…' : 'Elegir un elemento'}
                                </button>
                                {picked && (
                                    <div className="de-rule" key={picked.at}>
                                        {picked.texts.length > 0 && <TextEditor texts={picked.texts} design={design} setDesign={setDesign} />}
                                        <div className="de-row">
                                            <label htmlFor="de-sel">Aplicar a</label>
                                            <select id="de-sel" value={picked.selector} onChange={(e) => setPicked((p) => ({ ...p, selector: e.target.value }))}>
                                                {picked.options.map((s, i) => <option key={s} value={s}>{i === 0 ? 'Solo este elemento' : i === 1 ? `Todos los iguales (${s})` : `Su contenedor (${s})`}</option>)}
                                            </select>
                                        </div>
                                        <p className="de-note">«Solo este elemento» cambia solo el que tocaste; «Todos los iguales», todos los que se ven igual.</p>
                                        <RuleEditor selector={picked.selector} design={design} setDesign={setDesign} />
                                    </div>
                                )}
                                {Object.keys(design.texts).length > 0 && (
                                    <details className="de-sec" style={{ marginTop: 10 }}>
                                        <summary>Textos cambiados ({Object.keys(design.texts).length})</summary>
                                        {Object.entries(design.texts).map(([from, to]) => (
                                            <div key={from} className="de-row de-changed">
                                                <span><s>{from}</s> → {to}</span>
                                                <button className="de-x" title="Volver al texto original" onClick={() => setDesign((d) => { const t = { ...d.texts }; delete t[from]; return { ...d, texts: t } })}>✕</button>
                                            </div>
                                        ))}
                                    </details>
                                )}
                            </>
                        )}
                    </div>
                    <footer className="de-foot">
                        <button className="de-btn" onClick={exportIt} title="Descarga design.json: ponlo en Assets/diseno.json para publicarlo">Exportar</button>
                        <button className="de-btn de-btn--soft" onClick={() => file.current.click()}>Importar</button>
                        <button className="de-btn de-btn--soft" onClick={() => confirm('¿Volver al diseño publicado? Se pierden los cambios de este navegador.') && setDesign(clean(baseDesign))}>Restablecer</button>
                        <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files[0] && importIt(e.target.files[0])} />
                    </footer>
                </aside>
            )}
        </>,
        document.body
    )
}

// (its own look, independent of the page's design: the edits never reach the editor)
const EDITOR_CSS = `
.de-panel{position:fixed;top:12px;right:12px;bottom:12px;width:330px;z-index:10000;display:flex;flex-direction:column;
  background:#fff;color:#1d1d1f;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.28);font:13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.de-panel.is-left{right:auto;left:12px}
.de-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid #eee}
.de-tabs{display:flex;gap:4px;padding:8px;border-bottom:1px solid #eee}
.de-tabs button{flex:1;border:0;background:#f2f2f4;border-radius:8px;padding:7px 4px;font:inherit;font-size:12px;cursor:pointer;color:#1d1d1f}
.de-tabs button.is-on{background:#1d1d1f;color:#fff}
.de-body{flex:1;overflow:auto;padding:10px 14px}
.de-rule{display:grid;gap:8px}
.de-row{display:grid;gap:4px}
.de-row label{font-size:11.5px;color:#555}
.de-row select,.de-row input[type=text]{font:inherit;border:1px solid #ddd;border-radius:7px;padding:5px 8px;background:#fff;color:#1d1d1f;min-width:0}
.de-color,.de-range{display:flex;gap:6px;align-items:center}
.de-color input[type=color]{width:34px;height:28px;border:1px solid #ddd;border-radius:6px;padding:1px;background:#fff}
.de-color input[type=text]{flex:1}
.de-range input[type=range]{flex:1;accent-color:#1d1d1f}
.de-range input[type=text]{width:70px}
.de-x{border:0;background:#f2f2f4;border-radius:6px;width:24px;height:24px;cursor:pointer;color:#1d1d1f;font-size:11px}
.de-btn{border:0;background:#1d1d1f;color:#fff;border-radius:8px;padding:8px 10px;font:inherit;cursor:pointer}
.de-btn.is-on{background:#e8590c}
.de-btn--soft{background:#f2f2f4;color:#1d1d1f}
.de-foot{display:flex;gap:6px;padding:10px 14px;border-top:1px solid #eee}
.de-foot .de-btn{flex:1}
.de-note{font-size:11.5px;color:#777;margin:0}
.de-sec{border:1px solid #eee;border-radius:9px;padding:6px 10px}
.de-sec[open]{padding-bottom:10px}
.de-sec summary{cursor:pointer;font-weight:600;font-size:12.5px;padding:2px 0}
.de-sec .de-row{margin-top:8px}
.de-css{width:100%;font:12px/1.4 ui-monospace,Consolas,monospace;border:1px solid #ddd;border-radius:7px;padding:6px 8px;margin-top:8px;resize:vertical}
.de-box{display:grid;gap:6px;background:#f7f7f9;border-radius:8px;padding:8px 10px}
.de-mini{display:grid;grid-template-columns:78px 1fr 44px;gap:8px;align-items:center;font-size:11.5px;color:#555}
.de-mini input[type=range]{width:100%;accent-color:#1d1d1f}
.de-mini input[type=color]{width:34px;height:24px;border:1px solid #ddd;border-radius:6px;padding:1px;background:#fff}
.de-mini em{font-style:normal;text-align:right;color:#1d1d1f;font-variant-numeric:tabular-nums}
.de-chips{display:flex;flex-wrap:wrap;gap:4px}
.de-chip{border:1px solid #ddd;background:#fff;border-radius:999px;padding:3px 9px;font:inherit;font-size:11.5px;cursor:pointer;color:#1d1d1f}
.de-chip:hover{background:#1d1d1f;color:#fff}
.de-check{display:flex;gap:6px;align-items:center;font-size:12px;color:#1d1d1f!important;cursor:pointer}
.de-text{margin-top:0;flex:1;font:13px/1.4 system-ui,sans-serif}
.de-changed{grid-template-columns:1fr auto;align-items:center;font-size:12px}
.de-changed s{color:#999}
.de-fab{position:fixed;right:12px;bottom:12px;z-index:10000;border:0;background:#1d1d1f;color:#fff;border-radius:999px;padding:10px 16px;font:600 13px system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.de-hover{position:fixed;z-index:9999;pointer-events:none;display:none;outline:2px solid #e8590c;background:rgba(232,89,12,.08);border-radius:4px}
`
