import type { FC, ReactNode } from 'react'

import {
    Html,
    Head,
    Main,
    NextScript
} from 'next/document'

const themeScript = `(function(){try{var t=localStorage.getItem('pixels-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const Document: FC = (): ReactNode => {
    return (
        <Html lang='pt-BR' data-theme='light'>
            <Head>
                <link rel='icon' type='image/svg+xml' href={`${base}/favicon.svg`} />
                <link rel='icon' type='image/png' sizes='32x32' href={`${base}/favicon-32.png`} />
                <link rel='icon' href={`${base}/favicon.ico`} sizes='any' />
                <link rel='apple-touch-icon' href={`${base}/apple-touch-icon.png`} />
                <meta name='theme-color' content='#f5f4f0' />

                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </Head>

            <body className='min-h-full flex flex-col'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
