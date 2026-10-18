import type { FC, ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'

import { Reveal } from '@/components/generals/reveal'
import { Container } from '@/components/generals/container'

const AUTH_URL = 'https://mimooo.lovable.app/auth'

export const MimoRhythm: FC = (): ReactNode => {
    return (
        <section id='ritmo' className='border-y border-px-hairline bg-px-text/[0.025]'>
            <Container className='py-[clamp(56px,10vh,120px)]'>
                <div className='grid items-center gap-[clamp(32px,6vw,80px)] min-[821px]:grid-cols-2'>
                    <Reveal duration={900} mode='fade'>
                        <div className='flex items-end justify-center gap-4'>
                            <img
                                src='/mimo-sleeping.png'
                                alt='Mimo descansando'
                                width={200}
                                height={200}
                                loading='lazy'
                                className='aspect-square w-[42%] max-w-[200px] object-contain [filter:drop-shadow(0_12px_18px_rgba(23,21,15,0.14))]'
                            />

                            <img
                                src='/mimo-celebrating.png'
                                alt='Mimo comemorando'
                                width={220}
                                height={220}
                                loading='lazy'
                                className='aspect-square w-[46%] max-w-[220px] object-contain [filter:drop-shadow(0_12px_18px_rgba(23,21,15,0.14))]'
                            />
                        </div>
                    </Reveal>

                    <div>
                        <Reveal duration={800} distance={18}>
                            <h2 className='font-display text-[clamp(26px,4.4vw,44px)] font-medium leading-[1.14] tracking-[-0.02em] text-px-text'>
                                Seu Mimo, no seu ritmo
                            </h2>
                        </Reveal>

                        <Reveal delay={120} duration={900} distance={20}>
                            <p className='mt-[clamp(16px,3vh,26px)] max-w-[48ch] text-[14px] leading-[1.65] text-px-muted min-[821px]:text-[15px]'>
                                Jogue neste aparelho ou crie uma conta para guardar uma cópia do
                                progresso na nuvem. Sem pressa — o cadastro é só para quem quiser
                                levar o cantinho para outro lugar.
                            </p>
                        </Reveal>

                        <Reveal delay={220} duration={900} distance={18}>
                            <a
                                href={AUTH_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group mt-[clamp(22px,4vh,34px)] inline-flex items-center gap-3 border-b border-px-text pb-2 text-px-text transition-opacity duration-500 hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70'
                            >
                                <span className='label-fixed'>
                                    Criar minha conta
                                </span>

                                <ArrowUpRight
                                    aria-hidden='true'
                                    className='size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                                />
                            </a>
                        </Reveal>
                    </div>
                </div>
            </Container>
        </section>
    )
}
