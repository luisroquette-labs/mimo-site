'use client'

import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { asset } from '@/lib/base-path'

// Frames de UM giro natural do Seedance (tronco+pescoço), ordenados esquerda→centro→direita.
// O cursor controla o quadro = a cabeça acompanha. Sem cortes: cada quadro é o bicho inteiro.
const FRAMES = 21
// +1: olha pro lado do cursor. Inverter (-1) troca o lado.
const DIR = 1
const EASE = 9

const frameSrc = (i: number): string =>
    asset(`/mimo-look/f${String(i).padStart(2, '0')}.webp`)

export const MimoLook: FC = (): ReactNode => {
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
            const size = Math.min(rect.width, rect.height)

            canvas.width = Math.round(size * dpr)
            canvas.height = Math.round(size * dpr)
        }

        const render = (): void => {
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const i = Math.max(0, Math.min(FRAMES - 1, Math.round(current)))
            const img = images[i]

            if (img && img.complete && img.naturalWidth) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
        }

        const loop = (t: number): void => {
            const dt = Math.min((t - last) / 1000, 0.05)

            last = t
            current += (target - current) * Math.min(EASE * dt, 1)
            render()

            if (Math.abs(target - current) < 0.08) {
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
                aria-label='Mimo em 3D — a cabeça acompanha o cursor'
                className='aspect-square w-[min(74vw,620px)] max-h-[82svh]'
                style={{ touchAction: 'none' }}
            />
        </div>
    )
}
