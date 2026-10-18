'use client'

import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { asset } from '@/lib/base-path'

// Giro expressivo do Seedance (olhos abrindo/piscando + boca), quadro inteiro — sem corte.
const FRAMES = 61
const FPS = 12
const SRC = 480

// Inclinação do bicho inteiro seguindo o cursor (pivô nos pés → "vira pra te olhar").
const PIVOT_X = 240
const PIVOT_Y = 442
const MAX_ANGLE = 0.1 // rad (~6°)
const MAX_SHIFT = 10 // px (fonte)
const EASE = 7

const frameSrc = (i: number): string =>
    asset(`/mimo-anim/f${String(i).padStart(2, '0')}.webp`)

export const MimoAnim: FC<{ className?: string }> = ({ className }): ReactNode => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        const ctx = canvas.getContext('2d')

        if (!ctx) return

        const images: HTMLImageElement[] = []

        for (let i = 0; i < FRAMES; i++) {
            const img = new Image()

            img.src = frameSrc(i)
            images[i] = img
        }

        let scale = 1
        let targetNx = 0
        let curAngle = 0
        let curShift = 0
        let raf = 0
        let last = 0
        let t0 = 0

        const resize = (): void => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
            const rect = canvas.getBoundingClientRect()
            const size = Math.min(rect.width, rect.height)

            canvas.width = Math.round(size * dpr)
            canvas.height = Math.round(size * dpr)
            scale = (size * dpr) / SRC
        }

        const onPointer = (e: PointerEvent): void => {
            const half = window.innerWidth / 2

            targetNx = Math.max(-1, Math.min(1, (e.clientX - half) / half))
        }

        // ping-pong p/ loop sem salto
        const frameAt = (elapsed: number): number => {
            const span = FRAMES - 1
            const pos = Math.floor(elapsed * FPS) % (span * 2)

            return pos <= span ? pos : span * 2 - pos
        }

        const draw = (t: number): void => {
            if (!t0) t0 = t

            const dt = Math.min((t - last) / 1000, 0.05)

            last = t

            const k = Math.min(EASE * dt, 1)

            curAngle += (targetNx * MAX_ANGLE - curAngle) * k
            curShift += (targetNx * MAX_SHIFT - curShift) * k

            const img = images[frameAt((t - t0) / 1000)]

            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (img && img.complete && img.naturalWidth) {
                ctx.setTransform(scale, 0, 0, scale, 0, 0)
                ctx.translate(PIVOT_X + curShift, PIVOT_Y)
                ctx.rotate(curAngle)
                ctx.translate(-PIVOT_X, -PIVOT_Y)
                ctx.drawImage(img, 0, 0, SRC, SRC, 0, 0, SRC, SRC)
            }

            raf = requestAnimationFrame(draw)
        }

        resize()
        window.addEventListener('resize', resize, { passive: true })
        window.addEventListener('pointermove', onPointer, { passive: true })
        raf = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', onPointer)
        }
    }, [])

    return (
        <div className='flex size-full items-center justify-center'>
            <canvas
                ref={canvasRef}
                aria-label='Mimo — pisca, mexe a boca e acompanha o cursor'
                className={className ?? 'aspect-square w-[min(74vw,620px)] max-h-[82svh]'}
                style={{ touchAction: 'none' }}
            />
        </div>
    )
}
