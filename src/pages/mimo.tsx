import type { FC, ReactNode } from 'react'

import { asset } from '@/lib/base-path'
import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Reveal } from '@/components/generals/reveal'

const Mimo3D: FC = (): ReactNode => {
    return (
        <Layout fixed indexLabel='Index / O Mimo'>
            <Seo
                title='O Mimo'
                description='Conheça o Mimo — seu bichinho virtual sempre de bom humor. Cuide, brinque e deixe o cantinho com a sua cara.'
            />

            <section
                id='mimo-3d'
                aria-label='O Mimo, seu bichinho virtual'
                className='relative h-[100svh] w-full overflow-hidden bg-px-bg text-px-text'
            >
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-60 [--paper-cell:22px] [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)] [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)]'
                />

                <div className='absolute inset-0 z-0 flex items-center justify-center'>
                    <img
                        src={asset('/mimo-dance.webp')}
                        alt='Mimo, o bichinho azul, dançando'
                        className='w-[min(66vw,460px)] object-contain'
                    />
                </div>

                <Reveal
                    trigger='load'
                    duration={900}
                    distance={18}
                    className='pointer-events-none absolute z-10 left-[18px] top-[14svh] w-[82vw] min-[821px]:left-[clamp(24px,4vw,60px)] min-[821px]:top-[16svh] min-[821px]:w-[min(40vw,520px)]'
                >
                    <p className='label-fixed text-px-muted'>
                        Mimo 3D — Mimo°
                    </p>

                    <h1 className='mt-[clamp(14px,2.4vh,24px)] pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.12] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.6vw,64px)]'>
                        <span className='block'>
                            Ele te
                        </span>

                        <span className='block'>
                            acompanha
                        </span>
                    </h1>
                </Reveal>

                <Reveal
                    trigger='load'
                    delay={300}
                    duration={900}
                    distance={14}
                    className='pointer-events-none absolute bottom-[12svh] left-1/2 z-10 -translate-x-1/2'
                >
                    <p className='label-chrome text-center text-px-muted'>
                        Seu melhor amigo virtual
                    </p>
                </Reveal>
            </section>
        </Layout>
    )
}

export default Mimo3D
