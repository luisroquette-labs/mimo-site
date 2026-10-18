import type { FC, ReactNode } from 'react'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { PixelsScroller } from '@/components/landing/pixels-scroller'
import { offerings } from '@/constants/offerings'

const Home: FC = (): ReactNode => {
    return (
        <Layout fixed indexLabel={`Index 0${offerings.length}`}>
            <Seo description='Mimo é o seu bichinho virtual: cuide, brinque e deixe o cantinho com a sua cara. Comece a jogar sem conta.' />

            <PixelsScroller />
        </Layout>
    )
}

export default Home
