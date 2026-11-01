import { Bebas_Neue, Poppins } from 'next/font/google'
import '@/styles/global.css'

// Typography (strict): Bebas Neue for titles only, Poppins for every reading text.
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas', display: 'swap' })
const poppins = Poppins({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-poppins', display: 'swap' })

export const metadata = {
    title: 'Bulevar Diverso',
    description: 'Museo digital y juego exploratorio del Bulevar del Río, Cali. Lugares, eventos y rutas recomendadas entre caleños.',
}

export const viewport = { themeColor: '#FFFFFF' }

export default function RootLayout({ children }) {
    return (
        <html lang="es-CO" className={`${bebas.variable} ${poppins.variable}`}>
            <head>
                {/* The intro is driven by the scroll: never let the browser restore an old scroll position */}
                <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual';scrollTo(0,0)" }} />
            </head>
            <body>{children}</body>
        </html>
    )
}
