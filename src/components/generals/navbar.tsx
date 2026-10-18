import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { Reveal } from '@/components/generals/reveal'
import { navItems } from '@/constants/navigation'

export const Navbar: FC = (): ReactNode => {
    const router = useRouter()
    const { theme, toggle } = useTheme()
    const [scrolled, setScrolled] = useState<boolean>(false)

    useEffect(() => {
        const onScroll = (): void => setScrolled(window.scrollY > 8)

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const isActive = (href: string): boolean => {
        const path = href.split('#')[0]

        if (path === '/') return router.pathname === '/'

        return router.pathname === path
    }

    return (
        <Reveal
            as='header'
            trigger='load'
            delay={350}
            duration={800}
            distance={-16}
            className='fixed inset-x-0 top-0 z-40'
        >
            <nav
                aria-label='Primary'
                className={cn(
                    'grid grid-cols-6 items-center transition-[background-color,border-color] duration-500',
                    'gap-x-[clamp(4px,1.5vw,16px)] px-[clamp(12px,3vw,44px)] py-[clamp(12px,2.2vh,22px)]',
                    'border-b border-transparent',
                    scrolled && 'border-px-hairline bg-px-bg/85 backdrop-blur-md'
                )}
            >
                {navItems.map((item, index) => {
                    const isLogo = index === 0

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive(item.href) ? 'page' : undefined}
                            aria-label={isLogo ? 'Mimo — início' : undefined}
                            style={isLogo ? { fontFamily: 'var(--font-chewy)' } : undefined}
                            className={cn(
                                'w-fit transition-colors duration-500',
                                isLogo
                                    ? 'justify-self-start text-left font-normal leading-none text-px-text text-[clamp(22px,2.6vw,30px)]'
                                    : cn(
                                        'label-chrome link-underline justify-self-center text-center',
                                        isActive(item.href) ? 'text-px-text' : 'text-px-muted',
                                        'hover:text-px-text focus-visible:text-px-text'
                                    ),
                                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-px-text focus-visible:ring-offset-4 focus-visible:ring-offset-px-bg'
                            )}
                        >
                            {isLogo ? (
                                <>
                                    Mimo
                                    <span className='text-[#e0574a]'>.</span>
                                </>
                            ) : (
                                item.label
                            )}
                        </Link>
                    )
                })}

                <button
                    type='button'
                    onClick={toggle}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    className={cn(
                        'label-chrome group flex w-fit items-center gap-2 justify-self-end text-right',
                        'text-px-muted transition-colors duration-500 hover:text-px-text',
                        'focus-visible:text-px-text focus-visible:outline-none focus-visible:ring-1',
                        'focus-visible:ring-px-text focus-visible:ring-offset-4 focus-visible:ring-offset-px-bg'
                    )}
                >
                    <span
                        aria-hidden='true'
                        className={cn(
                            'size-[7px] border border-current transition-[background-color,transform] duration-500',
                            'group-hover:scale-125',
                            theme === 'dark' ? 'bg-current' : 'bg-transparent'
                        )}
                    />

                    <span>
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                </button>
            </nav>
        </Reveal>
    )
}
