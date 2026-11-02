import { useEffect } from 'react'

/**
 * Phones: nothing on top of anything, whatever the size of the screen and of what is open. Every
 * piece is measured and stacked, with room between them so no shadow falls on the next one:
 *   from the bottom up · the hint text · the plans + "Volver al mapa" · the card / sheet
 *   from the top down  · the island clock · the card of a route stop
 *   (Chonti's bubble sits by him, above his hat — GuideChonti publishes --bubble-bottom)
 * (Chonti stands on the highest of the bottom pieces and gets smaller when the room above it is
 * short: GuideChonti. The island fits in the gap that is left: CameraRig.)
 * Published as CSS variables: --bubble-top, --filters-bottom, --sheet-bottom, --top-free.
 */
export const STACK_GAP = 16 // px between two pieces (more than the reach of a card's shadow)

const visible = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).opacity !== '0'

export default function ScreenLayout() {
    useEffect(() => {
        const html = document.documentElement
        const set = (name, value) => {
            if (html.style.getPropertyValue(name) !== value) html.style.setProperty(name, value)
        }
        const place = () => {
            let top = 0
            for (const el of document.querySelectorAll('.sky, .hud__actions')) if (visible(el)) top = Math.max(top, el.getBoundingClientRect().bottom)
            // (the clock's shadow falls in the gap, never over the bubble)
            set('--bubble-top', `${Math.round(top + STACK_GAP + 4)}px`)
            if (window.innerWidth >= 800) {
                for (const name of ['--filters-bottom', '--sheet-bottom', '--top-free']) html.style.removeProperty(name)
                return
            }
            // (Chonti's bubble is down by him, above his hat — it no longer takes room at the top)
            set('--top-free', `${Math.round(top + STACK_GAP)}px`)
            // the hint text at the very bottom: the plans sit right above whatever height it has
            const hint = document.querySelector('.stage-hint')
            const hintH = visible(hint) && hint.textContent.trim() ? hint.getBoundingClientRect().height : 0
            set('--filters-bottom', `${Math.round(hintH ? 4 + hintH + 8 : 14)}px`)
            const filters = document.querySelector('.filters')
            if (visible(filters)) set('--sheet-bottom', `${Math.round(window.innerHeight - filters.getBoundingClientRect().top + STACK_GAP)}px`)
        }
        place()
        const id = setInterval(place, 200)
        window.addEventListener('resize', place)
        return () => {
            clearInterval(id)
            window.removeEventListener('resize', place)
        }
    }, [])
    return null
}
