import '@/styles/globals.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import { Geist, Geist_Mono, Poppins, Chewy } from 'next/font/google'

const geistSans = Geist({
    variable: '--font-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

const poppins = Poppins({
    variable: '--font-poppins',
    weight: ['400', '500', '600'],
    subsets: ['latin']
})

const chewy = Chewy({
    variable: '--font-chewy',
    weight: '400',
    subsets: ['latin']
})

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${chewy.variable} h-full font-sans antialiased`}>
            <Component {...pageProps} />
        </div>
    )
}

export default App
