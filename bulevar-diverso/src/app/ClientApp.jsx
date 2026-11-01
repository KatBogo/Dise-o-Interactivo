'use client'

import dynamic from 'next/dynamic'

// WebGL, ScrollTrigger, Web Speech and canvas textures are browser-only:
// load the experience on the client only (no SSR), as a single-page app.
const BulevarApp = dynamic(() => import('@/BulevarApp.jsx'), {
    ssr: false,
    loading: () => <div className="boot" aria-label="Cargando Bulevar Diverso" />,
})

export default function ClientApp() {
    return <BulevarApp />
}
