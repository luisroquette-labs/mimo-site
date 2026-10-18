import type { FC, ReactNode } from 'react'

import { Heart, Gamepad2, Armchair } from 'lucide-react'

import { Reveal } from '@/components/generals/reveal'
import { Container } from '@/components/generals/container'

const features = [
    {
        icon: Heart,
        title: 'Carinho todo dia',
        body: 'Comidinhas, banho e uma boa soneca para cuidar do Mimo.'
    },
    {
        icon: Gamepad2,
        title: 'Hora de brincar',
        body: 'Cinco minijogos, recordes e MimoCoins para conquistar.'
    },
    {
        icon: Armchair,
        title: 'Do seu jeitinho',
        body: 'Móveis e acessórios para deixar o cantinho com a sua cara.'
    }
]

export const MimoFeatures: FC = (): ReactNode => {
    return (
        <section id='cantinho' className='border-t border-px-hairline'>
            <Container className='py-[clamp(64px,12vh,150px)]'>
                <Reveal duration={800} distance={18}>
                    <p className='label-fixed text-center text-px-muted'>
                        Pequenos momentos, grandes carinhos
                    </p>
                </Reveal>

                <Reveal delay={100} duration={900} distance={26}>
                    <h2 className='mx-auto mt-[clamp(14px,2.4vh,24px)] max-w-[18ch] text-center font-display text-[clamp(26px,7vw,40px)] font-medium leading-[1.14] tracking-[-0.02em] text-px-text'>
                        Um cantinho só de vocês
                    </h2>
                </Reveal>

                <ul className='mt-[clamp(40px,7vh,80px)] grid gap-px border border-px-hairline bg-px-hairline min-[821px]:grid-cols-3'>
                    {features.map((feature, index) => {
                        const Icon = feature.icon

                        return (
                            <Reveal
                                key={feature.title}
                                as='li'
                                delay={index * 110}
                                duration={900}
                                distance={22}
                                className='group bg-px-bg p-[clamp(28px,3.4vw,48px)] text-center transition-colors duration-500 hover:bg-px-text/[0.035]'
                            >
                                <Icon
                                    aria-hidden='true'
                                    className='mx-auto size-7 text-[#e0574a] transition-transform duration-500 group-hover:-translate-y-0.5'
                                    strokeWidth={2}
                                />

                                <h3 className='mt-[clamp(14px,2vh,20px)] font-display text-[clamp(18px,2vw,24px)] font-medium leading-[1.2] tracking-[-0.01em] text-px-text'>
                                    {feature.title}
                                </h3>

                                <p className='mx-auto mt-[clamp(8px,1.4vh,14px)] max-w-[32ch] text-[13.5px] leading-[1.6] text-px-muted transition-colors duration-500 group-hover:text-px-text'>
                                    {feature.body}
                                </p>
                            </Reveal>
                        )
                    })}
                </ul>
            </Container>
        </section>
    )
}
