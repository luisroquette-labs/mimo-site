import type { FC, ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'

import { asset } from '@/lib/base-path'
import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Reveal } from '@/components/generals/reveal'
import { Container } from '@/components/generals/container'

const PLAY_URL = 'https://mimooo.lovable.app/play'

const shots = [
    {
        n: '01',
        label: 'Cuidar',
        body: 'Comidinha, banho e soneca. Cinco indicadores pra manter o Mimo feliz, saudável e de bem com a vida.'
    },
    {
        n: '02',
        label: 'Brincar',
        body: 'Cinco minijogos — Chuva de Orvalho, Pares do Jardim, Vagalume Veloz e mais — rendem recordes e MimoCoins.'
    },
    {
        n: '03',
        label: 'Personalizar',
        body: 'Gaste as moedas na loja: comidas, móveis e acessórios pra deixar o cantinho com a sua cara.'
    }
]

const Jogo: FC = (): ReactNode => {
    return (
        <Layout indexLabel='Index / O jogo'>
            <Seo
                title='O jogo'
                description='Veja o Mimo em ação: cuidar do bichinho, cinco minijogos e uma loja pra deixar o cantinho do seu jeito. Comece a jogar sem conta.'
            />

            <section id='jogo-hero' className='relative overflow-hidden border-b border-px-hairline'>
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-80 [--paper-cell:22px] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_80%)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]'
                />

                <Container className='relative pb-[clamp(44px,8vh,96px)] pt-[clamp(128px,22vh,240px)]'>
                    <Reveal trigger='load' duration={800} distance={18}>
                        <p className='label-fixed text-px-muted'>
                            O jogo — Mimo°
                        </p>
                    </Reveal>

                    <Reveal trigger='load' delay={120} duration={900} distance={30}>
                        <h1 className='mt-[clamp(18px,3vh,30px)] max-w-[14ch] pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.8vw,68px)]'>
                            Veja o Mimo em ação
                        </h1>
                    </Reveal>

                    <Reveal trigger='load' delay={240} duration={900} distance={24}>
                        <p className='mt-[clamp(20px,4vh,34px)] max-w-[52ch] text-[14px] leading-[1.6] text-px-muted min-[821px]:text-[15px]'>
                            Não é uma promessa num banner — é o jogo de verdade. Cuidar, brincar e
                            montar o cantinho, direto do aparelho e sem precisar de conta pra começar.
                        </p>
                    </Reveal>
                </Container>
            </section>

            <section id='telas' className='border-b border-px-hairline'>
                <Container className='py-[clamp(56px,10vh,120px)]'>
                    <div className='grid items-center gap-[clamp(36px,6vw,88px)] min-[821px]:grid-cols-[minmax(0,1fr)_minmax(0,320px)]'>
                        <ol className='order-2 min-[821px]:order-1'>
                            {shots.map((shot, index) => (
                                <Reveal
                                    key={shot.label}
                                    as='li'
                                    delay={index * 110}
                                    duration={850}
                                    distance={20}
                                    className='group border-b border-px-hairline py-[clamp(18px,2.6vh,28px)] first:border-t'
                                >
                                    <div className='flex items-baseline gap-4'>
                                        <span className='label-fixed text-px-muted'>
                                            {shot.n}
                                        </span>

                                        <h3 className='font-display text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.2] tracking-[-0.01em] text-px-text'>
                                            {shot.label}
                                        </h3>
                                    </div>

                                    <p className='mt-2 max-w-[46ch] pl-[calc(0.12em+2.6em)] text-[13.5px] leading-[1.6] text-px-muted'>
                                        {shot.body}
                                    </p>
                                </Reveal>
                            ))}
                        </ol>

                        <Reveal mode='fade' duration={900} className='order-1 min-[821px]:order-2'>
                            <div className='relative mx-auto w-[min(300px,74vw)] overflow-hidden border border-px-hairline bg-px-grid/40 p-[clamp(14px,2vw,22px)]'>
                                <div
                                    aria-hidden='true'
                                    className='paper-grid pointer-events-none absolute inset-0 opacity-60 [--paper-cell:16px]'
                                />

                                <video
                                    src={asset('/jogo/gameplay-demo.mp4')}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    aria-label='Demonstração do jogo Mimo: cuidar, banho, minijogos e loja'
                                    className='relative block w-full border border-px-hairline'
                                />
                            </div>

                            <p className='mt-4 text-center label-chrome text-px-muted'>
                                Gameplay real — sem conta
                            </p>
                        </Reveal>
                    </div>
                </Container>
            </section>

            <section id='jogo-cta' className='relative overflow-hidden'>
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-80 [--paper-cell:22px] [-webkit-mask-image:linear-gradient(to_top,black,transparent_80%)] [mask-image:linear-gradient(to_top,black,transparent_80%)]'
                />

                <Container className='relative py-[clamp(64px,12vh,150px)]'>
                    <div className='flex flex-col items-start gap-[clamp(22px,4vh,36px)]'>
                        <Reveal duration={900} distance={26}>
                            <h2 className='max-w-[16ch] pb-[0.12em] font-display text-[clamp(26px,7vw,40px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(30px,3.6vw,52px)]'>
                                Seu cantinho começa sem conta
                            </h2>
                        </Reveal>

                        <Reveal delay={140} duration={900} distance={20}>
                            <a
                                href={PLAY_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='pixel-btn pixel-btn--primary px-[clamp(22px,3vw,34px)] py-[17px] text-[clamp(14px,1.8vw,17px)]'
                            >
                                Jogar com o Mimo
                            </a>
                        </Reveal>
                    </div>
                </Container>
            </section>
        </Layout>
    )
}

export default Jogo
