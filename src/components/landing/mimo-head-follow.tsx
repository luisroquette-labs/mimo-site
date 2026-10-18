'use client'

import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { asset } from '@/lib/base-path'

// Strip linear: frame 0 = cabeça virada p/ esquerda, FRAMES-1 = p/ direita, meio = frente.
const FRAMES = 21
// +1: cabeça segue o cursor. Inverter (-1) espelha o lado.
const DIR = 1
const EASE = 9

const frameSrc = (i: number): string =>
    asset(`/mimo-head/f${String(i).padStart(2, '0')}.webp`)

export const MimoHeadFollow: FC = (): ReactNode => {
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

        const mid = (FRAMES - 1) / 2
        let target = mid
        let current = mid
        let raf = 0
        let last = 0
        let running = false

        const resize = (): void => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
            const rect = canvas.getBoundingClientRect()

            canvas.width = Math.round(rect.width * dpr)
            canvas.height = Math.round(rect.height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const render = (): void => {
            const rect = canvas.getBoundingClientRect()

            ctx.clearRect(0, 0, rect.width, rect.height)

            const i = Math.max(0, Math.min(FRAMES - 1, Math.round(current)))
            const img = images[i]

            if (img && img.complete && img.naturalWidth) {
                const size = Math.min(rect.width, rect.height)
                const dx = (rect.width - size) / 2
                const dy = (rect.height - size) / 2

                ctx.drawImage(img, dx, dy, size, size)
            }
        }

        const loop = (t: number): void => {
            const dt = Math.min((t - last) / 1000, 0.05)

            last = t
            current += (target - current) * Math.min(EASE * dt, 1)

            render()

            // Para o loop quando estabiliza — sem repaint ocioso.
            if (Math.abs(target - current) < 0.2) {
                current = target
                render()
                running = false

                return
            }

            raf = requestAnimationFrame(loop)
        }

        const start = (): void => {
            if (running) return

            running = true
            last = performance.now()
            raf = requestAnimationFrame(loop)
        }

        const onPointer = (e: PointerEvent): void => {
            const half = window.innerWidth / 2
            const nx = Math.max(-1, Math.min(1, (e.clientX - half) / half))

            target = mid + DIR * nx * mid
            start()
        }

        resize()
        render()
        window.addEventListener('resize', resize, { passive: true })
        window.addEventListener('pointermove', onPointer, { passive: true })

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
                aria-label='Mimo em 3D — a cabeça segue o cursor'
                className='aspect-square w-[min(74vw,620px)] max-h-[82svh]'
                style={{ touchAction: 'none' }}
            />
        </div>
    )
}
