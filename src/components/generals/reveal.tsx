import type { CSSProperties, ElementType, FC, ReactNode } from 'react'
import type { RevealProps } from '@/types'

import { useEffect, useRef } from 'react'

export const Reveal: FC<RevealProps> = ({
    children,
    as = 'div',
    mode = 'rise',
    trigger = 'scroll',
    delay = 0,
    duration,
    distance,
    className,
    id
}): ReactNode => {
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const el = ref.current

        if (!el) return

        const show = (): void => el.setAttribute('data-reveal', 'in')

        if (trigger === 'load' || typeof IntersectionObserver === 'undefined') {
            const timer = window.setTimeout(show, 60)

            return () => window.clearTimeout(timer)
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return

                    show()
                    observer.disconnect()
                })
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0 }
        )

        observer.observe(el)

        return () => observer.disconnect()
    }, [trigger])

    const Tag = as as ElementType

    const style = {
        '--reveal-delay': `${delay}ms`,
        ...(duration ? { '--reveal-duration': `${duration}ms` } : {}),
        ...(distance !== undefined ? { '--reveal-y': `${distance}px` } : {})
    } as CSSProperties

    return (
        <Tag
            ref={ref}
            id={id}
            data-reveal='out'
            data-reveal-mode={mode === 'rise' ? undefined : mode}
            style={style}
            className={className}
        >
            {children}
        </Tag>
    )
}
