import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Reveal } from '@/components/generals/reveal'
import { Container } from '@/components/generals/container'

const NotFound: FC = (): ReactNode => {
    return (
        <Layout indexLabel='Index / 404'>
            <Seo title='Page not found' description='That page is not part of the library.' />

            <section id='not-found' className='relative overflow-hidden'>
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-80 [--paper-cell:22px] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_80%)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]'
                />

                <Container className='relative flex min-h-[100svh] flex-col justify-center py-[clamp(120px,20vh,220px)]'>
                    <Reveal trigger='load' duration={800} distance={18}>
                        <p className='label-fixed text-px-muted'>
                            Error 404
                        </p>
                    </Reveal>

                    <Reveal trigger='load' delay={120} duration={900} distance={30}>
                        <h1 className='mt-[clamp(18px,3vh,30px)] max-w-[14ch] pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.8vw,68px)]'>
                            This one never shipped
                        </h1>
                    </Reveal>

                    <Reveal trigger='load' delay={240} duration={900} distance={24}>
                        <p className='mt-[clamp(22px,4vh,38px)] max-w-[44ch] text-[14px] leading-[1.6] text-px-muted min-[821px]:text-[15px]'>
                            The page you asked for is not in the library. Everything that made the cut is
                            one scroll away.
                        </p>
                    </Reveal>

                    <Reveal trigger='load' delay={340} duration={900} distance={20}>
                        <Link
                            href='/'
                            className='group mt-[clamp(28px,5vh,48px)] inline-flex items-center gap-3 border-b border-px-text pb-2 text-px-text transition-opacity duration-500 hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70'
                        >
                            <span className='label-fixed'>
                                Back to the library
                            </span>

                            <ArrowUpRight
                                aria-hidden='true'
                                className='size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                            />
                        </Link>
                    </Reveal>
                </Container>
            </section>
        </Layout>
    )
}

export default NotFound
