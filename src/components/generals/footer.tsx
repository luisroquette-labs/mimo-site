import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Reveal } from '@/components/generals/reveal'
import { footerCells } from '@/constants/navigation'

type FooterProps = {
    overlay?: boolean
    indexLabel?: string
}

export const Footer: FC<FooterProps> = ({ overlay = false, indexLabel = 'Index 04' }): ReactNode => {
    const cells = [...footerCells, { label: indexLabel }]

    const alignment = (index: number): string => {
        if (index === 0) return 'justify-self-start text-left'
        if (index === cells.length - 1) return 'justify-self-end text-right'

        return 'justify-self-center text-center'
    }

    return (
        <Reveal
            as='footer'
            trigger={overlay ? 'load' : 'scroll'}
            delay={overlay ? 350 : 0}
            duration={overlay ? 800 : 900}
            distance={16}
            className={cn(
                'z-30 w-full',
                overlay ? 'absolute inset-x-0 bottom-0' : 'relative mt-auto'
            )}
        >
            <div
                className={cn(
                    'grid grid-cols-4 items-center border-t border-px-hairline',
                    'gap-x-[clamp(4px,1.5vw,16px)] px-[clamp(12px,3vw,44px)] py-[clamp(10px,1.8vh,18px)]'
                )}
            >
                {cells.map((cell, index) =>
                    cell.href ? (
                        <Link
                            key={cell.label}
                            href={cell.href}
                            className={cn(
                                'label-chrome-sm link-underline w-fit text-px-muted transition-colors duration-500',
                                'hover:text-px-text focus-visible:text-px-text focus-visible:outline-none',
                                alignment(index)
                            )}
                        >
                            {cell.label}
                        </Link>
                    ) : (
                        <span
                            key={cell.label}
                            className={cn('label-chrome-sm text-px-muted', alignment(index))}
                        >
                            {cell.label}
                        </span>
                    )
                )}
            </div>
        </Reveal>
    )
}
