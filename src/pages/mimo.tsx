import type { FC, ReactNode } from 'react'

import dynamic from 'next/dynamic'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Reveal } from '@/components/generals/reveal'

const MimoScene = dynamic(
    () => import('@/components/landing/mimo-turn-follow').then((m) => m.MimoTurnFollow),
    { ssr: false }
)

const Mimo3D: FC = (): ReactNode => {
    return (
        <Layout fixed indexLabel='Index / Mimo 3D'>
            <Seo
                title='Mimo 3D'
                description='Conheça o Mimo em 3D — mova o cursor e ele acompanha você. Seu melhor amigo virtual, agora em três dimensões.'
            />

            <section
                id='mimo-3d'
                aria-label='Mimo em 3D que segue o cursor'
                className='relative h-[100svh] w-full overflow-hidden bg-px-bg text-px-text'
            >
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-60 [--paper-cell:22px] [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)] [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)]'
                />

                <div className='absolute inset-0 z-0'>
                    <MimoScene />
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
                        Mova o cursor — o Mimo segue você
                    </p>
                </Reveal>
            </section>
        </Layout>
    )
}

export default Mimo3D
