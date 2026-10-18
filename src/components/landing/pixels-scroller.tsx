import type { FC, ReactNode } from 'react'
import type { Field } from '@/types'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { asset } from '@/lib/base-path'
import { Reveal } from '@/components/generals/reveal'
import { offerings } from '@/constants/offerings'

import {
    clamp01,
    COLS,
    getSprites,
    MOTION,
    OUTLINE,
    PAD,
    readTheme,
    ROWS,
    TEAR_MAX,
    THEMES,
    buildNoiseFields
} from '@/lib/pixels/field'

const PLAY_URL = 'https://mimooo.lovable.app/play'
const AUTH_URL = 'https://mimooo.lovable.app/auth'

export const PixelsScroller: FC = (): ReactNode => {
    const sectionRef = useRef<HTMLElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const videoRef = useRef<HTMLImageElement | null>(null)
    const ctaRef = useRef<HTMLDivElement | null>(null)
    const lineRef = useRef<HTMLDivElement | null>(null)
    const headRefs = useRef<Array<HTMLDivElement | null>>([])
    const descRefs = useRef<Array<HTMLDivElement | null>>([])

    useEffect(() => {
        const section = sectionRef.current
        const canvas = canvasRef.current
        const line = lineRef.current

        if (!section || !canvas || !line) return

        const ctx = canvas.getContext('2d')

        if (!ctx) return

        const N = offerings.length
        // Cena 01 fica vazia no canvas — o vídeo do Mimo entra sobreposto no lugar dela.
        const empty: Field = new Array(COLS * ROWS).fill(null)
        const sprites: Field[] = [empty, ...getSprites()]
        const { yjit, tear, intro: introOrder } = buildNoiseFields()

        const total = COLS * ROWS
        const offX = new Float32Array(total)
        const offY = new Float32Array(total)
        const velX = new Float32Array(total)
        const velY = new Float32Array(total)

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const mobileQuery = window.matchMedia('(max-width: 820px)')

        let reduced = motionQuery.matches
        let mobile = mobileQuery.matches
        let theme = THEMES[readTheme()]

        let cell = 4
        let cssW = 0
        let cssH = 0
        let boxOffset = 0
        let sectionH = 0

        let pos = 0
        let target = 0
        let prevPos = 0
        let vel = 0

        let over = false
        let wheelLock = false
        let lockTimer = 0
        let cursorActive = false
        let cursorX = 0
        let cursorY = 0
        let lagX = 0
        let lagY = 0
        let prevTouchY = 0

        let burstX = 0
        let burstY = 0
        let burstT = 0
        let burstRising = false

        let visible = false
        let introStart = 0
        let frame = 0

        const headHeights = new Array<number>(N).fill(0)
        const descHeights = new Array<number>(N).fill(0)

        const measure = (): void => {
            headRefs.current.forEach((el, i) => {
                if (el) headHeights[i] = el.offsetHeight
            })

            descRefs.current.forEach((el, i) => {
                if (el) descHeights[i] = el.offsetHeight
            })
        }

        const resize = (): void => {
            sectionH = section.clientHeight

            const availW = section.clientWidth * (mobile ? 0.82 : 0.46)
            const availH = sectionH * (mobile ? 0.46 : 0.56)

            cell = Math.max(4, Math.floor(Math.min(availW / COLS, availH / ROWS)))
            cssW = (COLS + 2 * PAD) * cell
            cssH = (ROWS + 2 * PAD) * cell
            boxOffset = PAD * cell

            const dpr = Math.min(MOTION.dprCap, window.devicePixelRatio || 1)

            canvas.width = Math.round(cssW * dpr)
            canvas.height = Math.round(cssH * dpr)
            canvas.style.width = `${cssW}px`
            canvas.style.height = `${cssH}px`

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.imageSmoothingEnabled = false

            measure()
        }

        // Scroll magnético (tipo PPT): um gesto avança/volta UMA cena inteira e
        // trava até a transição assentar — nunca descansa no meio.
        const step = (dir: number): void => {
            if (wheelLock) return

            const next = Math.max(0, Math.min(N - 1, Math.round(target) + dir))

            if (next === target) return

            target = next
            wheelLock = true

            window.clearTimeout(lockTimer)
            lockTimer = window.setTimeout(() => {
                wheelLock = false
            }, 700)
        }

        const localPoint = (clientX: number, clientY: number): { x: number, y: number } => {
            const rect = canvas.getBoundingClientRect()

            return { x: clientX - rect.left, y: clientY - rect.top }
        }

        const insideBox = (x: number, y: number): boolean =>
            x >= boxOffset &&
            x <= boxOffset + COLS * cell &&
            y >= boxOffset &&
            y <= boxOffset + ROWS * cell

        const onEnter = (): void => {
            over = true
        }

        const onLeave = (): void => {
            over = false
            cursorActive = false
        }

        const onWheel = (event: WheelEvent): void => {
            if (!over) return

            event.preventDefault()

            if (Math.abs(event.deltaY) < 2) return

            step(event.deltaY > 0 ? 1 : -1)
        }

        const onTouchStart = (event: TouchEvent): void => {
            over = true
            prevTouchY = event.touches[0]?.clientY ?? 0
        }

        const onTouchMove = (event: TouchEvent): void => {
            if (!over) return

            event.preventDefault()

            const y = event.touches[0]?.clientY ?? prevTouchY
            const dy = prevTouchY - y

            if (Math.abs(dy) > 24) {
                step(dy > 0 ? 1 : -1)
                prevTouchY = y
            }
        }

        const onPointerMove = (event: PointerEvent): void => {
            over = true

            if (reduced) return

            const { x, y } = localPoint(event.clientX, event.clientY)
            const active = insideBox(x, y)

            if (active && !cursorActive) {
                lagX = x
                lagY = y
            }

            cursorActive = active
            cursorX = x
            cursorY = y
        }

        const onPointerDown = (event: PointerEvent): void => {
            if (reduced) return

            const { x, y } = localPoint(event.clientX, event.clientY)

            if (!insideBox(x, y)) return

            burstX = x
            burstY = y
            burstT = 0
            burstRising = true
        }

        const drawStage = (
            aIdx: number,
            bIdx: number,
            frontierY: number,
            boxTop: number,
            intro: number,
            smearAlpha: number
        ): void => {
            const A = sprites[aIdx]
            const B = sprites[bIdx]
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
            const maxOff = MOTION.hoverMax * cell
            const maxOff2 = maxOff * maxOff
            const burstOn = !reduced && (burstRising || burstT > 0.0008)

            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    const i = y * COLS + x
                    const a = A[i]
                    const b = B[i]

                    if (a === null && b === null) continue
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

                    const cellY = boxTop + (y + 0.5) * cell + yjit[i] * cell
                    const cur = frontierY < cellY ? b : a
                    const px = boxOffset + x * cell + offX[i]
                    const py = boxOffset + y * cell + offY[i]

                    if (cur !== null) {
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

                    if (smearAlpha > 0 && a !== b && Math.abs(frontierY - cellY) < cell * 2.4) {
                        const smear = b ?? a

                        if (smear !== null) {
                            ctx.globalAlpha = smearAlpha
                            ctx.fillStyle = smear === OUTLINE ? theme.outline : smear
                            ctx.fillRect(px, py, cell * tear[i], cell)

                            if (tear[i] === TEAR_MAX) {
                                ctx.globalAlpha = smearAlpha * 0.5
                                ctx.fillStyle = theme.scan
                                ctx.fillRect(px, py + cell * 0.4, cell * tear[i], Math.max(1, cell * 0.16))
                            }

                            ctx.globalAlpha = 1
                        }
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

        const revealText = (
            els: Array<HTMLDivElement | null>,
            heights: number[],
            anchor: number,
            fromBottom: boolean,
            aIdx: number,
            bIdx: number,
            frontierY: number
        ): void => {
            for (let i = 0; i < els.length; i++) {
                const el = els[i]

                if (!el) continue

                if (i !== aIdx && i !== bIdx) {
                    el.style.opacity = '0'
                    continue
                }

                el.style.opacity = '1'

                const h = heights[i] || 1
                const top = fromBottom ? anchor - h : anchor
                const local = clamp01((frontierY - top) / h)

                if (bIdx === aIdx) el.style.clipPath = 'none'
                else if (i === aIdx) el.style.clipPath = `inset(0 0 ${(1 - local) * 100}% 0)`
                else el.style.clipPath = `inset(${local * 100}% 0 0 0)`
            }
        }

        const loop = (): void => {
            frame = window.requestAnimationFrame(loop)

            if (reduced) pos = target
            else pos += (target - pos) * MOTION.ease

            vel = pos - prevPos
            prevPos = pos

            if (!visible || document.hidden) return

            const now = performance.now()

            if (!introStart) introStart = now

            const elapsed = now - introStart
            const intro = reduced
                ? 1
                : elapsed < MOTION.introDelay
                    ? 0
                    : clamp01((elapsed - MOTION.introDelay) / MOTION.introDur)

            const aIdx = Math.min(N - 1, Math.floor(pos))
            const frac = pos - aIdx
            const bIdx = Math.min(aIdx + 1, N - 1)

            const boxTop = (sectionH - ROWS * cell) / 2
            const gap = cell * 3
            const headTop = sectionH * (mobile ? 0.13 : 0.16)
            const descBot = sectionH * (1 - (mobile ? 0.11 : 0.13))
            const sweepTop = headTop - gap
            const sweepBottom = descBot + gap
            const frontierY = sweepBottom + (sweepTop - sweepBottom) * frac

            const transitioning = frac > 0.001 && frac < 0.999
            const smearAlpha =
                !reduced && transitioning ? clamp01(0.25 + Math.abs(vel) * 6) * 0.7 : 0

            drawStage(aIdx, bIdx, frontierY, boxTop, intro, smearAlpha)
            revealText(headRefs.current, headHeights, headTop, false, aIdx, bIdx, frontierY)
            revealText(descRefs.current, descHeights, descBot, true, aIdx, bIdx, frontierY)

            line.style.transform = `translateY(${frontierY}px)`

            const edge = Math.min(frac, 1 - frac)

            line.style.opacity = `${clamp01(edge / 0.07) * 0.5}`

            // Vídeo do Mimo visível só na cena 01; some ao rolar para a 02.
            const vid = videoRef.current

            if (vid) vid.style.opacity = `${clamp01(1 - pos / 0.85)}`

            const cta = ctaRef.current

            if (cta) {
                const ctaOpacity = clamp01(1 - pos / 0.7)

                cta.style.opacity = `${ctaOpacity}`
                cta.style.pointerEvents = ctaOpacity > 0.6 ? 'auto' : 'none'
            }
        }

        resize()

        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => {
                visible = entry.isIntersecting
            }),
            { threshold: 0.05 }
        )

        observer.observe(section)

        const resizeObserver = new ResizeObserver(() => resize())

        resizeObserver.observe(section)

        const themeObserver = new MutationObserver(() => {
            theme = THEMES[readTheme()]
        })

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        })

        const onMobileChange = (): void => {
            mobile = mobileQuery.matches
            resize()
        }

        const onMotionChange = (): void => {
            reduced = motionQuery.matches

            if (reduced) target = Math.round(target)
        }

        section.addEventListener('pointerenter', onEnter)
        section.addEventListener('pointerleave', onLeave)
        section.addEventListener('pointermove', onPointerMove)
        section.addEventListener('pointerdown', onPointerDown)
        section.addEventListener('wheel', onWheel, { passive: false })
        section.addEventListener('touchstart', onTouchStart, { passive: true })
        section.addEventListener('touchmove', onTouchMove, { passive: false })
        mobileQuery.addEventListener('change', onMobileChange)
        motionQuery.addEventListener('change', onMotionChange)

        if (document.fonts) document.fonts.ready.then(measure).catch(() => undefined)

        frame = window.requestAnimationFrame(loop)

        return () => {
            window.cancelAnimationFrame(frame)
            window.clearTimeout(lockTimer)
            observer.disconnect()
            resizeObserver.disconnect()
            themeObserver.disconnect()
            section.removeEventListener('pointerenter', onEnter)
            section.removeEventListener('pointerleave', onLeave)
            section.removeEventListener('pointermove', onPointerMove)
            section.removeEventListener('pointerdown', onPointerDown)
            section.removeEventListener('wheel', onWheel)
            section.removeEventListener('touchstart', onTouchStart)
            section.removeEventListener('touchmove', onTouchMove)
            mobileQuery.removeEventListener('change', onMobileChange)
            motionQuery.removeEventListener('change', onMotionChange)
        }
    }, [])

    return (
        <section
            id='pixels'
            ref={sectionRef}
            aria-label='O que o Mimo faz'
            className='relative h-[100svh] w-full touch-none select-none overflow-hidden bg-px-bg text-px-text'
        >
            <div className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                <Reveal mode='fade' trigger='load' duration={900}>
                    <canvas
                        ref={canvasRef}
                        aria-hidden='true'
                        className='block [image-rendering:pixelated]'
                    />
                </Reveal>

                <img
                    ref={videoRef}
                    src={asset('/mimo-dance.webp')}
                    alt='Mimo, o bichinho azul, dançando'
                    className='pointer-events-none absolute left-1/2 top-1/2 w-[46%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 object-contain'
                />
            </div>

            <div
                ref={lineRef}
                aria-hidden='true'
                className='pointer-events-none absolute left-0 top-0 z-10 h-px w-full bg-px-text opacity-0'
            />

            <Reveal
                trigger='load'
                delay={250}
                duration={900}
                distance={30}
                className={cn(
                    'pointer-events-none absolute z-20 overflow-visible',
                    'left-[18px] top-[13svh] w-[82vw]',
                    'min-[821px]:left-[clamp(24px,4vw,60px)] min-[821px]:top-[16svh] min-[821px]:w-[min(46vw,560px)]'
                )}
            >
                <div className='relative'>
                    {offerings.map((offering, index) => (
                        <div
                            key={offering.title.join(' ')}
                            ref={(el) => {
                                headRefs.current[index] = el
                            }}
                            style={{ opacity: index === 0 ? 1 : 0 }}
                            className='absolute left-0 top-0 w-full will-change-[clip-path,opacity]'
                        >
                            <p className='mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-px-muted min-[821px]:mb-[14px]'>
                                {`0${index + 1}`}
                            </p>

                            <h2 className='m-0 pb-[0.12em] font-display text-[clamp(30px,9vw,46px)] font-medium leading-[1.16] tracking-[-0.02em] text-px-text min-[821px]:text-[clamp(36px,4.8vw,68px)]'>
                                {offering.title.map((lineText) => (
                                    <span key={lineText} className='block'>
                                        {lineText}
                                    </span>
                                ))}
                            </h2>
                        </div>
                    ))}
                </div>
            </Reveal>

            <div
                ref={ctaRef}
                className={cn(
                    'absolute z-30 will-change-[opacity]',
                    'left-[18px] top-[58svh] w-[82vw]',
                    'min-[821px]:left-[clamp(24px,4vw,60px)] min-[821px]:top-[47svh] min-[821px]:w-[min(46vw,560px)]'
                )}
            >
                <div className='flex flex-wrap items-center gap-4'>
                    <a
                        href={PLAY_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='pixel-btn pixel-btn--primary px-[clamp(22px,3vw,34px)] py-[17px] text-[clamp(14px,1.8vw,17px)]'
                    >
                        Jogar com o Mimo
                    </a>

                    <a
                        href={AUTH_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='pixel-btn pixel-btn--ghost'
                    >
                        Criar conta
                    </a>
                </div>

                <p className='label-chrome mt-4 text-px-muted'>
                    Seu cantinho começa sem conta
                </p>
            </div>

            <Reveal
                trigger='load'
                delay={350}
                duration={900}
                distance={30}
                className={cn(
                    'pointer-events-none absolute z-20 overflow-visible',
                    'bottom-[11svh] right-[18px] w-[72vw]',
                    'min-[821px]:bottom-[13svh] min-[821px]:right-[clamp(24px,4vw,60px)] min-[821px]:w-[min(30vw,380px)]'
                )}
            >
                <div className='relative'>
                    {offerings.map((offering, index) => (
                        <div
                            key={offering.body}
                            ref={(el) => {
                                descRefs.current[index] = el
                            }}
                            style={{ opacity: index === 0 ? 1 : 0 }}
                            className='absolute bottom-0 left-0 w-full will-change-[clip-path,opacity]'
                        >
                            <p className='text-right text-[12.5px] leading-[1.5] text-px-text min-[821px]:text-[clamp(12.5px,1vw,14.5px)]'>
                                {offering.body}
                            </p>
                        </div>
                    ))}
                </div>
            </Reveal>

            <ul className='sr-only'>
                {offerings.map((offering) => (
                    <li key={offering.body}>
                        {`${offering.title.join(' ')} — ${offering.body}`}
                    </li>
                ))}
            </ul>
        </section>
    )
}
