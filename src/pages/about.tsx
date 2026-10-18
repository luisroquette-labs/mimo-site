import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Reveal } from '@/components/generals/reveal'
import { Container } from '@/components/generals/container'
import { PixelSprite } from '@/components/generals/pixel-sprite'

import {
    ledger,
    manifesto,
    principles,
    process
} from '@/constants/about'

const About: FC = (): ReactNode => {
    return (
        <Layout indexLabel='Index / About'>
            <Seo
                title='Sobre'
                description='O Mimo é um bichinho virtual gentil: sem anúncio, sem pressa e sem conta para começar. Conheça a ideia por trás do cantinho.'
            />

            <section id='about-hero' className='relative overflow-hidden border-b border-px-hairline'>
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-80 [--paper-cell:22px] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_80%)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]'
                />

                <Container className='relative pb-[clamp(56px,10vh,120px)] pt-[clamp(128px,22vh,240px)]'>
                    <div className='grid items-end gap-[clamp(40px,6vw,80px)] min-[821px]:grid-cols-12'>
                        <div className='min-[821px]:col-span-7'>
                            <Reveal trigger='load' duration={800} distance={18}>
                                <p className='label-fixed text-px-muted'>
                                    Sobre — Mimo°
                                </p>
                            </Reveal>

                            <Reveal trigger='load' delay={120} duration={900} distance={30}>
                                <h1 className='mt-[clamp(18px,3vh,30px)] pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.8vw,68px)]'>
                                    <span className='block'>
                                        Um Cantinho
                                    </span>

                                    <span className='block'>
                                        Só De Vocês
                                    </span>
                                </h1>
                            </Reveal>

                            <Reveal trigger='load' delay={240} duration={900} distance={24}>
                                <p className='mt-[clamp(22px,4vh,38px)] max-w-[46ch] text-[14px] leading-[1.6] text-px-muted min-[821px]:text-[15px]'>
                                    Um bichinho, muitas brincadeiras e uma regra só: nada de pressa. Sem
                                    anúncio, sem energia que acaba e sem conta para começar — a diversão
                                    nunca fica atrás de um cadastro.
                                </p>
                            </Reveal>
                        </div>

                        <div className='min-[821px]:col-span-5'>
                            <Reveal trigger='load' delay={320} duration={900} mode='fade'>
                                <PixelSprite
                                    sprite={0}
                                    label='Coração em pixel'
                                    className='mx-auto w-[min(420px,78vw)] cursor-crosshair min-[821px]:ml-auto min-[821px]:mr-0'
                                />
                            </Reveal>

                            <Reveal trigger='load' delay={420} duration={900} distance={24}>
                                <p className='mt-[clamp(16px,3vh,28px)] text-right text-[12.5px] leading-[1.5] text-px-text min-[821px]:text-[clamp(12.5px,1vw,14.5px)]'>
                                    Cada desenho deste site é feito de matemática num só canvas — discos,
                                    retângulos, uma curva de coração e uma estrela. Passe o cursor por
                                    cima. Ele reage ao seu toque.
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </Container>
            </section>

            <section id='manifesto' className='border-b border-px-hairline'>
                <Container className='py-[clamp(64px,12vh,150px)]'>
                    <div className='grid gap-[clamp(32px,5vw,80px)] min-[821px]:grid-cols-12'>
                        <Reveal className='min-[821px]:col-span-4' duration={800} distance={20}>
                            <p className='label-fixed text-px-muted'>
                                01 — Manifesto
                            </p>
                        </Reveal>

                        <div className='min-[821px]:col-span-8'>
                            {manifesto.map((paragraph, index) => (
                                <Reveal key={paragraph.slice(0, 24)} delay={index * 120} duration={950}>
                                    <p className='mb-[clamp(18px,3vh,28px)] max-w-[62ch] text-[15px] leading-[1.65] text-px-text last:mb-0 min-[821px]:text-[17px]'>
                                        {paragraph}
                                    </p>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <section id='principles' className='border-b border-px-hairline'>
                <Container className='py-[clamp(64px,12vh,150px)]'>
                    <Reveal duration={800} distance={20}>
                        <p className='label-fixed text-px-muted'>
                            02 — Princípios
                        </p>
                    </Reveal>

                    <Reveal delay={100} duration={900} distance={26}>
                        <h2 className='mt-[clamp(18px,3vh,30px)] max-w-[16ch] pb-[0.12em] font-display text-[clamp(26px,7vw,38px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(30px,3.4vw,50px)]'>
                            Quatro regras que nunca quebramos
                        </h2>
                    </Reveal>

                    <ul className='mt-[clamp(36px,6vh,72px)] grid gap-px border border-px-hairline bg-px-hairline min-[821px]:grid-cols-2'>
                        {principles.map((principle, index) => (
                            <Reveal
                                key={principle.title}
                                as='li'
                                delay={index * 110}
                                duration={900}
                                distance={22}
                                className='group relative bg-px-bg p-[clamp(24px,3vw,44px)] transition-colors duration-500 hover:bg-px-text/[0.035]'
                            >
                                <span className='label-fixed block text-px-muted transition-transform duration-500 group-hover:translate-x-1'>
                                    {`0${index + 1}`}
                                </span>

                                <h3 className='mt-[clamp(14px,2vh,22px)] font-display text-[clamp(19px,2.2vw,26px)] font-medium leading-[1.2] tracking-[-0.01em] text-px-text'>
                                    {principle.title}
                                </h3>

                                <p className='mt-[clamp(10px,1.6vh,16px)] max-w-[44ch] text-[13.5px] leading-[1.6] text-px-muted transition-colors duration-500 group-hover:text-px-text'>
                                    {principle.body}
                                </p>
                            </Reveal>
                        ))}
                    </ul>
                </Container>
            </section>

            <section id='process' className='border-b border-px-hairline'>
                <Container className='py-[clamp(64px,12vh,150px)]'>
                    <Reveal duration={800} distance={20}>
                        <p className='label-fixed text-px-muted'>
                            03 — Como funciona
                        </p>
                    </Reveal>

                    <ol className='mt-[clamp(28px,5vh,56px)] border-t border-px-hairline'>
                        {process.map((item, index) => (
                            <Reveal
                                key={item.step}
                                as='li'
                                delay={index * 90}
                                duration={850}
                                distance={20}
                                className='group border-b border-px-hairline'
                            >
                                <div className='grid items-baseline gap-[clamp(8px,2vw,32px)] py-[clamp(22px,3.4vh,38px)] transition-[padding,color] duration-500 group-hover:pl-[clamp(6px,1vw,16px)] min-[821px]:grid-cols-12'>
                                    <span className='label-fixed text-px-muted min-[821px]:col-span-2'>
                                        {`Passo 0${index + 1}`}
                                    </span>

                                    <h3 className='font-display text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.2] tracking-[-0.01em] text-px-text min-[821px]:col-span-4'>
                                        {item.step}
                                    </h3>

                                    <p className='max-w-[52ch] text-[13.5px] leading-[1.6] text-px-muted transition-colors duration-500 group-hover:text-px-text min-[821px]:col-span-6'>
                                        {item.body}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </ol>
                </Container>
            </section>

            <section id='ledger' className='border-b border-px-hairline'>
                <Container className='py-[clamp(48px,9vh,110px)]'>
                    <dl className='grid grid-cols-2 gap-y-[clamp(28px,5vh,48px)] min-[821px]:grid-cols-4'>
                        {ledger.map((entry, index) => (
                            <Reveal key={entry.label} delay={index * 100} duration={850} distance={18}>
                                <dt className='font-display text-[clamp(26px,5vw,44px)] font-medium leading-none tracking-[-0.02em] text-px-text'>
                                    {entry.value}
                                </dt>

                                <dd className='label-fixed mt-[clamp(10px,1.6vh,16px)] text-px-muted'>
                                    {entry.label}
                                </dd>
                            </Reveal>
                        ))}
                    </dl>
                </Container>
            </section>

            <section id='about-cta' className='relative overflow-hidden'>
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-80 [--paper-cell:22px] [-webkit-mask-image:linear-gradient(to_top,black,transparent_80%)] [mask-image:linear-gradient(to_top,black,transparent_80%)]'
                />

                <Container className='relative py-[clamp(72px,14vh,170px)]'>
                    <div className='grid items-end gap-[clamp(28px,5vw,64px)] min-[821px]:grid-cols-12'>
                        <Reveal className='min-[821px]:col-span-8' duration={950} distance={28}>
                            <h2 className='max-w-[14ch] pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.8vw,68px)]'>
                                Pronto pra conhecer o Mimo?
                            </h2>
                        </Reveal>

                        <Reveal className='min-[821px]:col-span-4' delay={140} duration={900} distance={24}>
                            <Link
                                href='/contact'
                                className='group inline-flex items-center gap-3 border-b border-px-text pb-2 text-px-text transition-opacity duration-500 hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70'
                            >
                                <span className='label-fixed'>
                                    Falar com o Mimo
                                </span>

                                <ArrowUpRight
                                    aria-hidden='true'
                                    className='size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                                />
                            </Link>
                        </Reveal>
                    </div>
                </Container>
            </section>
        </Layout>
    )
}

export default About
