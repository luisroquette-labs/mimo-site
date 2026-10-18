'use client'

import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { asset } from '@/lib/base-path'

const FRAMES = 48
// Range pré-configurado: frente ao centro, ±SPREAD frames conforme o cursor (nunca mostra as costas).
const SPREAD = 12
// Direção do giro em relação ao cursor. Inverter o sinal troca o lado.
const DIR = 1
const EASE = 7

const frameSrc = (i: number): string =>
    asset(`/mimo-turn/f${String(i).padStart(2, '0')}.webp`)

export const MimoTurnFollow: FC = (): ReactNode => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        const ctx = canvas.getContext('2d')

        if (!ctx) return

        const images: HTMLImageElement[] = []
        let loaded = 0

        for (let i = 0; i < FRAMES; i++) {
            const img = new Image()

            img.onload = () => {
                loaded++
            }
            img.src = frameSrc(i)
            images[i] = img
        }

        let target = 0
        let current = 0
        let raf = 0
        let last = 0

        const onPointer = (e: PointerEvent): void => {
            const rect = canvas.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            // -1 (esquerda) .. 1 (direita), relativo ao centro do palco.
            const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)))

            target = DIR * nx * SPREAD
        }

        const wrap = (n: number): number => ((n % FRAMES) + FRAMES) % FRAMES

        const resize = (): void => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const rect = canvas.getBoundingClientRect()

            canvas.width = Math.round(rect.width * dpr)
            canvas.height = Math.round(rect.height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const draw = (t: number): void => {
            const dt = Math.min((t - last) / 1000, 0.05)

            last = t
            current += (target - current) * Math.min(EASE * dt, 1)

            const rect = canvas.getBoundingClientRect()

            ctx.clearRect(0, 0, rect.width, rect.height)

            const img = images[wrap(Math.round(current))]

            if (img && img.complete && img.naturalWidth) {
                const bob = Math.sin(t / 900) * (rect.height * 0.012)
                const size = Math.min(rect.width, rect.height) * 0.92
                const dx = (rect.width - size) / 2
                const dy = (rect.height - size) / 2 + bob

                ctx.drawImage(img, dx, dy, size, size)
            }

            raf = requestAnimationFrame(draw)
        }

        resize()
        window.addEventListener('resize', resize)
        window.addEventListener('pointermove', onPointer, { passive: true })
        raf = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', onPointer)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-label='Mimo em 3D que gira seguindo o cursor'
            className='size-full'
            style={{ touchAction: 'none' }}
        />
    )
}
