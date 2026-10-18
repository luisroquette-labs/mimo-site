import type { FC, ReactNode } from 'react'
import type { PixelSpriteProps } from '@/types'

import { useEffect, useRef } from 'react'

import {
    clamp01,
    COLS,
    getSprites,
    MOTION,
    OUTLINE,
    readTheme,
    ROWS,
    THEMES,
    buildNoiseFields
} from '@/lib/pixels/field'

const SPAD = 6

export const PixelSprite: FC<PixelSpriteProps> = ({ sprite, className, label }): ReactNode => {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const wrap = wrapRef.current
        const canvas = canvasRef.current

        if (!wrap || !canvas) return

        const ctx = canvas.getContext('2d')

        if (!ctx) return

        const field = getSprites()[sprite] ?? getSprites()[0]
        const { intro: introOrder } = buildNoiseFields()

        const total = COLS * ROWS
        const offX = new Float32Array(total)
        const offY = new Float32Array(total)
        const velX = new Float32Array(total)
        const velY = new Float32Array(total)

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

        let reduced = motionQuery.matches
        let theme = THEMES[readTheme()]

        let cell = 3
        let cssW = 0
        let cssH = 0
        let boxOffset = 0

        let cursorActive = false
        let cursorX = 0
        let cursorY = 0
        let lagX = 0
        let lagY = 0

        let burstX = 0
        let burstY = 0
        let burstT = 0
        let burstRising = false

        let visible = false
        let introStart = 0
        let frame = 0

        const resize = (): void => {
            const width = wrap.clientWidth || 240

            cell = Math.max(2, Math.floor(width / (COLS + SPAD * 2)))
            cssW = (COLS + SPAD * 2) * cell
            cssH = (ROWS + SPAD * 2) * cell
            boxOffset = SPAD * cell

            const dpr = Math.min(MOTION.dprCap, window.devicePixelRatio || 1)

            canvas.width = Math.round(cssW * dpr)
            canvas.height = Math.round(cssH * dpr)
            canvas.style.width = `${cssW}px`
            canvas.style.height = `${cssH}px`

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.imageSmoothingEnabled = false
        }

        const localPoint = (clientX: number, clientY: number): { x: number, y: number } => {
            const rect = canvas.getBoundingClientRect()

            return { x: clientX - rect.left, y: clientY - rect.top }
        }

        const onPointerMove = (event: PointerEvent): void => {
            if (reduced) return

            const { x, y } = localPoint(event.clientX, event.clientY)

            if (!cursorActive) {
                lagX = x
                lagY = y
            }

            cursorActive = true
            cursorX = x
            cursorY = y
        }

        const onPointerLeave = (): void => {
            cursorActive = false
        }

        const onPointerDown = (event: PointerEvent): void => {
            if (reduced) return

            const { x, y } = localPoint(event.clientX, event.clientY)

            burstX = x
            burstY = y
            burstT = 0
            burstRising = true
        }

        const loop = (): void => {
            frame = window.requestAnimationFrame(loop)

            if (!visible || document.hidden) return

            const now = performance.now()

            if (!introStart) introStart = now

            const elapsed = now - introStart
            const intro = reduced
                ? 1
                : elapsed < MOTION.introDelay
                    ? 0
                    : clamp01((elapsed - MOTION.introDelay) / MOTION.introDur)

            const gw = COLS * cell
            const gh = ROWS * cell

            ctx.clearRect(0, 0, cssW, cssH)
            ctx.lineWidth = 1

            for (let pass = 0; pass < 2; pass++) {
                ctx.strokeStyle = pass === 0 ? theme.grid : theme.gridStrong
                ctx.beginPath()

                for (let x = 0; x <= COLS; x++) {
                    if ((x % 4 === 0) !== (pass === 1)) continue

                    const px = Math.round(boxOffset + x * cell) + 0.5

                    ctx.moveTo(px, boxOffset)
                    ctx.lineTo(px, boxOffset + gh)
                }

                for (let y = 0; y <= ROWS; y++) {
                    if ((y % 4 === 0) !== (pass === 1)) continue

                    const py = Math.round(boxOffset + y * cell) + 0.5

                    ctx.moveTo(boxOffset, py)
                    ctx.lineTo(boxOffset + gw, py)
                }

                ctx.stroke()
            }

            if (!reduced && cursorActive) {
                lagX += (cursorX - lagX) * MOTION.hoverLag
                lagY += (cursorY - lagY) * MOTION.hoverLag
            }

            const hoverR = MOTION.hoverRadius * cell
            const hoverR2 = hoverR * hoverR
            const reach = MOTION.clickReach * cell
            const reach2 = reach * reach
            const maxOff = SPAD * cell
            const maxOff2 = maxOff * maxOff
            const burstOn = !reduced && (burstRising || burstT > 0.0008)

            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    const i = y * COLS + x
                    const cur = field[i]

                    if (cur === null) continue
                    if (intro < 1 && introOrder[i] > intro) continue

                    if (!reduced) {
                        let ax = -offX[i] * MOTION.hoverSpring
                        let ay = -offY[i] * MOTION.hoverSpring

                        if (cursorActive) {
                            const dx = boxOffset + (x + 0.5) * cell + offX[i] - lagX
                            const dy = boxOffset + (y + 0.5) * cell + offY[i] - lagY
                            const d2 = dx * dx + dy * dy

                            if (d2 < hoverR2 && d2 > 0.0001) {
                                const d = Math.sqrt(d2)
                                const f = (1 - d / hoverR) * (MOTION.hoverForce * cell)

                                ax += (dx / d) * f
                                ay += (dy / d) * f
                            }
                        }

                        if (burstOn) {
                            const bx = boxOffset + (x + 0.5) * cell + offX[i] - burstX
                            const by = boxOffset + (y + 0.5) * cell + offY[i] - burstY
                            const bd2 = bx * bx + by * by
                            const bd = Math.sqrt(bd2) || 1
                            const fall = 1 / (1 + bd2 / reach2)
                            const bf = MOTION.clickForce * cell * burstT * fall

                            ax += (bx / bd) * bf
                            ay += (by / bd) * bf
                        }

                        velX[i] = (velX[i] + ax) * MOTION.hoverDamp
                        velY[i] = (velY[i] + ay) * MOTION.hoverDamp
                        offX[i] += velX[i]
                        offY[i] += velY[i]

                        const o2 = offX[i] * offX[i] + offY[i] * offY[i]

                        if (o2 > maxOff2) {
                            const k = maxOff / Math.sqrt(o2)

                            offX[i] *= k
                            offY[i] *= k
                        }
                    }

                    const px = boxOffset + x * cell + offX[i]
                    const py = boxOffset + y * cell + offY[i]
                    const age = intro - introOrder[i]

                    ctx.fillStyle = cur === OUTLINE ? theme.outline : cur

                    if (intro < 1 && age < MOTION.popWidth) {
                        const sc = 1 + MOTION.popScale * (1 - age / MOTION.popWidth)
                        const grow = (sc - 1) * cell * 0.5

                        ctx.globalAlpha = clamp01(age / (MOTION.popWidth * 0.45))
                        ctx.fillRect(px - grow, py - grow, cell * sc, cell * sc)
                        ctx.globalAlpha = 1
                    } else {
                        ctx.fillRect(px, py, cell, cell)
                    }
                }
            }

            if (!reduced) {
                if (burstRising) {
                    burstT += MOTION.clickAttack

                    if (burstT >= 1) {
                        burstT = 1
                        burstRising = false
                    }
                } else if (burstT > 0.0008) {
                    burstT *= MOTION.clickDecay
                } else {
                    burstT = 0
                }
            }
        }

        resize()

        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => {
                visible = entry.isIntersecting
            }),
            { threshold: 0.05 }
        )

        observer.observe(wrap)

        const resizeObserver = new ResizeObserver(() => resize())

        resizeObserver.observe(wrap)

        const themeObserver = new MutationObserver(() => {
            theme = THEMES[readTheme()]
        })

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        })

        const onMotionChange = (): void => {
            reduced = motionQuery.matches
        }

        wrap.addEventListener('pointermove', onPointerMove)
        wrap.addEventListener('pointerleave', onPointerLeave)
        wrap.addEventListener('pointerdown', onPointerDown)
        motionQuery.addEventListener('change', onMotionChange)

        frame = window.requestAnimationFrame(loop)

        return () => {
            window.cancelAnimationFrame(frame)
            observer.disconnect()
            resizeObserver.disconnect()
            themeObserver.disconnect()
            wrap.removeEventListener('pointermove', onPointerMove)
            wrap.removeEventListener('pointerleave', onPointerLeave)
            wrap.removeEventListener('pointerdown', onPointerDown)
            motionQuery.removeEventListener('change', onMotionChange)
        }
    }, [sprite])

    return (
        <div ref={wrapRef} className={className} role='img' aria-label={label ?? 'Pixel sprite'}>
            <canvas ref={canvasRef} aria-hidden='true' className='block [image-rendering:pixelated]' />
        </div>
    )
}
