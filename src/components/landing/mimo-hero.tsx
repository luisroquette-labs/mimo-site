import type { FC, ReactNode } from 'react'

import { Reveal } from '@/components/generals/reveal'

const PLAY_URL = 'https://mimooo.lovable.app/play'
const AUTH_URL = 'https://mimooo.lovable.app/auth'

export const MimoHero: FC = (): ReactNode => {
    return (
        <section
            id='hero'
            aria-label='Mimo — seu melhor amigo virtual'
            className='relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-px-bg px-5 text-center text-px-text'
        >
            <div
                aria-hidden='true'
                className='paper-grid pointer-events-none absolute inset-0 opacity-70 [--paper-cell:22px] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]'
            />

            <div className='relative flex flex-col items-center'>
                <Reveal trigger='load' duration={800} distance={14}>
                    <p className='label-fixed text-px-muted'>
                        Pequenos momentos, grandes carinhos
                    </p>
                </Reveal>

                <Reveal trigger='load' delay={120} duration={900} mode='fade'>
                    <video
                        src='/mimo-dance-loop.mp4'
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-label='Mimo, o bichinho azul, dançando'
                        className='my-1 aspect-square w-[min(340px,72vw)] object-contain'
                    />
                </Reveal>

                <Reveal trigger='load' delay={220} duration={900} distance={22}>
                    <h1 className='font-display text-[clamp(44px,12vw,92px)] font-medium leading-[0.95] tracking-[-0.03em]'>
                        Mimo
                    </h1>
                </Reveal>

                <Reveal trigger='load' delay={300} duration={900} distance={20}>
                    <p className='mt-2 text-[clamp(15px,2.4vw,20px)] font-medium text-px-text'>
                        Seu melhor amigo virtual
                    </p>
                </Reveal>

                <Reveal trigger='load' delay={400} duration={900} distance={20}>
                    <div className='mt-7 flex flex-wrap items-center justify-center gap-4'>
                        <a
                            href={PLAY_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='pixel-btn pixel-btn--primary'
                        >
                            Jogar com o Mimo
                        </a>

                        <a
                            href={AUTH_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='pixel-btn pixel-btn--ghost'
                        >
                            Criar conta
                        </a>
                    </div>
                </Reveal>

                <Reveal trigger='load' delay={500} duration={900} distance={16}>
                    <p className='mt-5 label-chrome text-px-muted'>
                        Seu cantinho começa sem conta
                    </p>
                </Reveal>
            </div>
        </section>
    )
}
