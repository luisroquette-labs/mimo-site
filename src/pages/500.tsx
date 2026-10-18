import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Reveal } from '@/components/generals/reveal'
import { Container } from '@/components/generals/container'

const ServerError: FC = (): ReactNode => {
    return (
        <Layout indexLabel='Index / 500'>
            <Seo title='Something went wrong' description='The page could not be rendered.' />

            <section id='server-error' className='relative overflow-hidden'>
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-80 [--paper-cell:22px] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_80%)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]'
                />

                <Container className='relative flex min-h-[100svh] flex-col justify-center py-[clamp(120px,20vh,220px)]'>
                    <Reveal trigger='load' duration={800} distance={18}>
                        <p className='label-fixed text-px-muted'>
                            Error 500
                        </p>
                    </Reveal>

                    <Reveal trigger='load' delay={120} duration={900} distance={30}>
                        <h1 className='mt-[clamp(18px,3vh,30px)] max-w-[14ch] pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.8vw,68px)]'>
                            Something broke on our side
                        </h1>
                    </Reveal>

                    <Reveal trigger='load' delay={240} duration={900} distance={24}>
                        <p className='mt-[clamp(22px,4vh,38px)] max-w-[44ch] text-[14px] leading-[1.6] text-px-muted min-[821px]:text-[15px]'>
                            Not your doing. Try again in a moment, or tell us what you were reaching for
                            and we will look into it.
                        </p>
                    </Reveal>

                    <Reveal trigger='load' delay={340} duration={900} distance={20}>
                        <div className='mt-[clamp(28px,5vh,48px)] flex flex-wrap items-center gap-x-[clamp(20px,4vw,44px)] gap-y-4'>
                            <Link
                                href='/'
                                className='group inline-flex items-center gap-3 border-b border-px-text pb-2 text-px-text transition-opacity duration-500 hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70'
                            >
                                <span className='label-fixed'>
                                    Back to the library
                                </span>

                                <ArrowUpRight
                                    aria-hidden='true'
                                    className='size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                                />
                            </Link>

                            <Link
                                href='/contact'
                                className='label-fixed link-underline text-px-muted transition-colors duration-500 hover:text-px-text focus-visible:text-px-text focus-visible:outline-none'
                            >
                                Tell us about it
                            </Link>
                        </div>
                    </Reveal>
                </Container>
            </section>
        </Layout>
    )
}

export default ServerError
