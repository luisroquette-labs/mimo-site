import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { asset } from '@/lib/base-path'

// Range pré-configurado de inclinação (graus) ao seguir o cursor.
const MAX_TILT_Y = 22
const MAX_TILT_X = 14

export const MimoTilt: FC = (): ReactNode => {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const el = ref.current

        if (!el) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let targetX = 0
        let targetY = 0
        let curX = 0
        let curY = 0
        let frame = 0
        const start = performance.now()

        const onMove = (event: PointerEvent): void => {
            const nx = (event.clientX / window.innerWidth) * 2 - 1
            const ny = (event.clientY / window.innerHeight) * 2 - 1

            targetY = nx * MAX_TILT_Y
            targetX = -ny * MAX_TILT_X
        }

        window.addEventListener('pointermove', onMove)

        const loop = (): void => {
            frame = window.requestAnimationFrame(loop)

            curX += (targetX - curX) * 0.08
            curY += (targetY - curY) * 0.08

            const t = (performance.now() - start) / 1000
            const floatY = reduced ? 0 : Math.sin(t * 1.3) * 7
            const idleSway = reduced ? 0 : Math.sin(t * 0.6) * 2.2
            const idleTip = reduced ? 0 : Math.sin(t * 1.1) * 0.8

            el.style.transform =
                `translateY(${floatY}px) rotateX(${curX + idleTip}deg) rotateY(${curY + idleSway}deg)`
        }

        frame = window.requestAnimationFrame(loop)

        return () => {
            window.cancelAnimationFrame(frame)
            window.removeEventListener('pointermove', onMove)
        }
    }, [])

    return (
        <div className='flex h-full w-full items-center justify-center [perspective:1100px]'>
            <div ref={ref} className='will-change-transform [transform-style:preserve-3d]'>
                <img
                    src={asset('/mimo-idle.webp')}
                    alt='Mimo, o bichinho azul de orelhas arco-íris'
                    draggable={false}
                    className='w-[min(440px,76vw)] select-none [filter:drop-shadow(0_34px_42px_rgba(23,21,15,0.32))]'
                />
            </div>
        </div>
    )
}
