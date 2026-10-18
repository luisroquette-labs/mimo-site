import type { FC, ReactNode } from 'react'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { Reveal } from '@/components/generals/reveal'
import { Container } from '@/components/generals/container'
import { PixelSprite } from '@/components/generals/pixel-sprite'
import { ContactForm } from '@/components/contact/contact-form'

import { nextSteps } from '@/constants/contact'
import { contactDetails } from '@/constants/site'

const Contact: FC = (): ReactNode => {
    const details = [
        { label: 'Email', value: contactDetails.email, href: `mailto:${contactDetails.email}` },
        { label: 'Tempo de resposta', value: contactDetails.reply },
        { label: 'Horário', value: contactDetails.hours },
        { label: 'Onde joga', value: contactDetails.location }
    ]

    return (
        <Layout indexLabel='Index / Contato'>
            <Seo
                title='Contato'
                description='Conte o que rolou com o Mimo — uma sugestão, um bug ou uma dúvida de conta. Resposta em até um dia útil, de uma pessoa de verdade.'
            />

            <section id='contact-hero' className='relative overflow-hidden border-b border-px-hairline'>
                <div
                    aria-hidden='true'
                    className='paper-grid pointer-events-none absolute inset-0 opacity-80 [--paper-cell:22px] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_80%)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]'
                />

                <Container className='relative pb-[clamp(56px,10vh,120px)] pt-[clamp(128px,22vh,240px)]'>
                    <div className='grid items-end gap-[clamp(40px,6vw,80px)] min-[821px]:grid-cols-12'>
                        <div className='min-[821px]:col-span-7'>
                            <Reveal trigger='load' duration={800} distance={18}>
                                <p className='label-fixed text-px-muted'>
                                    Contato — Mimo°
                                </p>
                            </Reveal>

                            <Reveal trigger='load' delay={120} duration={900} distance={30}>
                                <h1 className='mt-[clamp(18px,3vh,30px)] pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.8vw,68px)]'>
                                    <span className='block'>
                                        Fale Com
                                    </span>

                                    <span className='block'>
                                        O Mimo
                                    </span>
                                </h1>
                            </Reveal>

                            <Reveal trigger='load' delay={240} duration={900} distance={24}>
                                <p className='mt-[clamp(22px,4vh,38px)] max-w-[46ch] text-[14px] leading-[1.6] text-px-muted min-[821px]:text-[15px]'>
                                    Uma ideia para o jogo, um bug que apareceu ou uma dúvida sobre conta e
                                    sincronização. Um parágrafo já basta para começar.
                                </p>
                            </Reveal>
                        </div>

                        <div className='min-[821px]:col-span-5'>
                            <Reveal trigger='load' delay={320} duration={900} mode='fade'>
                                <PixelSprite
                                    sprite={0}
                                    label='Coração em pixel'
                                    className='mx-auto w-[min(400px,74vw)] cursor-crosshair min-[821px]:ml-auto min-[821px]:mr-0'
                                />
                            </Reveal>
                        </div>
                    </div>
                </Container>
            </section>

            <section id='contact-form' className='border-b border-px-hairline'>
                <Container className='py-[clamp(64px,12vh,150px)]'>
                    <div className='grid gap-[clamp(48px,6vw,96px)] min-[821px]:grid-cols-12'>
                        <div className='min-[821px]:col-span-7'>
                            <Reveal duration={800} distance={20}>
                                <p className='label-fixed text-px-muted'>
                                    01 — Sua mensagem
                                </p>
                            </Reveal>

                            <Reveal delay={120} duration={900} distance={24} className='mt-[clamp(28px,5vh,52px)]'>
                                <ContactForm />
                            </Reveal>
                        </div>

                        <div className='min-[821px]:col-span-5'>
                            <Reveal duration={800} distance={20}>
                                <p className='label-fixed text-px-muted'>
                                    02 — Direto
                                </p>
                            </Reveal>

                            <dl className='mt-[clamp(28px,5vh,52px)] border-t border-px-hairline'>
                                {details.map((detail, index) => (
                                    <Reveal
                                        key={detail.label}
                                        delay={index * 90}
                                        duration={850}
                                        distance={18}
                                        className='group flex items-baseline justify-between gap-6 border-b border-px-hairline py-[clamp(14px,2.4vh,22px)]'
                                    >
                                        <dt className='label-fixed text-px-muted'>
                                            {detail.label}
                                        </dt>

                                        <dd className='text-right text-[14px] leading-[1.5] text-px-text'>
                                            {detail.href ? (
                                                <a
                                                    href={detail.href}
                                                    className='link-underline transition-opacity duration-500 hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70'
                                                >
                                                    {detail.value}
                                                </a>
                                            ) : (
                                                detail.value
                                            )}
                                        </dd>
                                    </Reveal>
                                ))}
                            </dl>

                            <Reveal delay={200} duration={900} distance={22} className='mt-[clamp(36px,6vh,64px)]'>
                                <p className='max-w-[38ch] text-[13.5px] leading-[1.6] text-px-muted'>
                                    Tudo o que você manda cai na caixa de entrada do Mimo e em nenhum outro
                                    lugar. Sem newsletter, sem sequência de e-mails, sem ninguém espiando por cima.
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </Container>
            </section>

            <section id='next-steps'>
                <Container className='py-[clamp(64px,12vh,150px)]'>
                    <Reveal duration={800} distance={20}>
                        <p className='label-fixed text-px-muted'>
                            03 — O que acontece depois
                        </p>
                    </Reveal>

                    <ol className='mt-[clamp(28px,5vh,56px)] grid gap-px border border-px-hairline bg-px-hairline min-[821px]:grid-cols-3'>
                        {nextSteps.map((step, index) => (
                            <Reveal
                                key={step.title}
                                as='li'
                                delay={index * 110}
                                duration={900}
                                distance={22}
                                className='group bg-px-bg p-[clamp(24px,3vw,44px)] transition-colors duration-500 hover:bg-px-text/[0.035]'
                            >
                                <span className='label-fixed block text-px-muted transition-transform duration-500 group-hover:translate-x-1'>
                                    {`0${index + 1}`}
                                </span>

                                <h2 className='mt-[clamp(14px,2vh,22px)] font-display text-[clamp(19px,2.2vw,26px)] font-medium leading-[1.2] tracking-[-0.01em] text-px-text'>
                                    {step.title}
                                </h2>

                                <p className='mt-[clamp(10px,1.6vh,16px)] max-w-[40ch] text-[13.5px] leading-[1.6] text-px-muted transition-colors duration-500 group-hover:text-px-text'>
                                    {step.body}
                                </p>
                            </Reveal>
                        ))}
                    </ol>
                </Container>
            </section>
        </Layout>
    )
}

export default Contact
