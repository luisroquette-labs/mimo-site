import type { Field, PixelTheme, ThemeName } from '@/types'

/* ------------------------------------------------------------------
   The field — one fixed pixel grid shared by every sprite.
------------------------------------------------------------------ */

export const RES = 2
export const COLS = 28 * RES
export const ROWS = 22 * RES
export const CX = COLS / 2
export const CY = ROWS / 2
export const PAD = 32
export const OUTLINE = '@'

export const s = (n: number): number => n * RES

export const hash01 = (n: number): number => {
    const v = Math.sin(n) * 43758.5453
    return v - Math.floor(v)
}

export const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n)

/* ------------------------------------------------------------------
   Palettes
------------------------------------------------------------------ */

export const THEMES: Record<ThemeName, PixelTheme> = {
    light: {
        bg: '#f5f4f0',
        text: '#17150f',
        muted: '#a29d90',
        hairline: '#e3e1d9',
        grid: '#e7e5dd',
        gridStrong: '#dcd9cf',
        outline: '#141109',
        scan: '#ffffff'
    },
    dark: {
        bg: '#010101',
        text: '#f3f0e8',
        muted: '#6d685d',
        hairline: '#2a2723',
        grid: '#211f1b',
        gridStrong: '#292621',
        outline: '#efe9dd',
        scan: '#fff4dc'
    }
}

const ART = {
    eyeW: '#f4f1ea',
    heart: '#cf3f4d',
    heartHi: '#eda6ac',
    star: '#d3a13c',
    starHi: '#efd58c',
    // Mimo — paleta amostrada dos renders oficiais do personagem
    mimoHi: '#a6eef0',
    body: '#5fcbe6',
    bodyShade: '#36a3ce',
    bodyDeep: '#2b82b0',
    belly: '#f6eccf',
    bellyShade: '#e4d1a2',
    cheek: '#f0a0c0',
    bean: '#f4d06b',
    earBlue: '#4f93d8',
    earViolet: '#7b56c6',
    earMagenta: '#b057bd',
    earPink: '#d873a0',
    earOrange: '#ef9f4f',
    earYellow: '#f4d86b',
    // cantinho — poltrona aconchegante
    chair: '#df7a4a',
    chairHi: '#f0a876',
    cushion: '#f3e8cf',
    wood: '#8a5a3a'
}

/* ------------------------------------------------------------------
   Primitives — every graphic is computed, no image assets anywhere.
------------------------------------------------------------------ */

const emptyField = (): Field => new Array(COLS * ROWS).fill(null)

const rect = (f: Field, x0: number, y0: number, x1: number, y1: number, c: string | null): void => {
    const ax = Math.round(Math.min(x0, x1))
    const bx = Math.round(Math.max(x0, x1))
    const ay = Math.round(Math.min(y0, y1))
    const by = Math.round(Math.max(y0, y1))

    for (let y = Math.max(0, ay); y <= Math.min(ROWS - 1, by); y++) {
        for (let x = Math.max(0, ax); x <= Math.min(COLS - 1, bx); x++) {
            f[y * COLS + x] = c
        }
    }
}

const disc = (f: Field, cx: number, cy: number, r: number, c: string | null): void => {
    const r2 = r * r

    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(ROWS - 1, Math.ceil(cy + r)); y++) {
        for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(COLS - 1, Math.ceil(cx + r)); x++) {
            const dx = x - cx
            const dy = y - cy

            if (dx * dx + dy * dy <= r2) f[y * COLS + x] = c
        }
    }
}

const heart = (f: Field, cx: number, cy: number, size: number, c: string | null): void => {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const u = (x - cx) / size
            const v = (cy - y) / size
            const k = u * u + v * v - 1

            if (k * k * k - u * u * v * v * v <= 0) f[y * COLS + x] = c
        }
    }
}

const star = (
    f: Field,
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    points: number,
    rotDeg: number,
    c: string | null
): void => {
    const rot = (rotDeg * Math.PI) / 180
    const verts: Array<[number, number]> = []

    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? rOuter : rInner
        const a = rot + (i * Math.PI) / points

        verts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            let inside = false

            for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
                const [xi, yi] = verts[i]
                const [xj, yj] = verts[j]
                const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

                if (hit) inside = !inside
            }

            if (inside) f[y * COLS + x] = c
        }
    }
}

const outline = (f: Field): void => {
    const out = f.slice()

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (f[y * COLS + x] !== null) continue

            let touching = false

            for (let dy = -1; dy <= 1 && !touching; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue

                    const nx = x + dx
                    const ny = y + dy

                    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue
                    if (f[ny * COLS + nx] !== null) {
                        touching = true
                        break
                    }
                }
            }

            if (touching) out[y * COLS + x] = OUTLINE
        }
    }

    for (let i = 0; i < out.length; i++) f[i] = out[i]
}

/* ------------------------------------------------------------------
   The four sprites
------------------------------------------------------------------ */

const buildMimo = (): Field => {
    const f = emptyField()

    // crista de espinhos no topo da cabeça
    disc(f, 24, 9, 2.2, ART.bodyShade)
    disc(f, 28, 6.5, 2.8, ART.bodyShade)
    disc(f, 32, 9, 2.2, ART.bodyShade)
    disc(f, 28, 10.5, 2.2, ART.bodyShade)

    // orelhas caídas com faixas de arco-íris (esquerda, topo→ponta)
    disc(f, 11, 17, 3, ART.earBlue)
    disc(f, 10, 21, 3, ART.earViolet)
    disc(f, 9.5, 25, 2.8, ART.earMagenta)
    disc(f, 10, 28.5, 2.5, ART.earPink)
    disc(f, 11, 31.5, 2.2, ART.earOrange)
    disc(f, 12, 34, 1.8, ART.earYellow)
    // direita (espelho)
    disc(f, 45, 17, 3, ART.earBlue)
    disc(f, 46, 21, 3, ART.earViolet)
    disc(f, 46.5, 25, 2.8, ART.earMagenta)
    disc(f, 46, 28.5, 2.5, ART.earPink)
    disc(f, 45, 31.5, 2.2, ART.earOrange)
    disc(f, 44, 34, 1.8, ART.earYellow)

    // corpo + cabeça — massa redonda única
    disc(f, 28, 18, 12, ART.body)
    rect(f, 16, 18, 40, 33, ART.body)
    disc(f, 17, 33, 4, ART.body)
    disc(f, 39, 33, 4, ART.body)
    disc(f, 28, 34, 6, ART.body)

    // sombra sutil (base e lado direito)
    disc(f, 40, 29, 5, ART.bodyShade)
    disc(f, 28, 37, 5, ART.bodyShade)

    // bracinhos
    disc(f, 14, 27, 2.8, ART.body)
    disc(f, 42, 27, 2.8, ART.body)

    // barriga creme
    disc(f, 28, 30, 7, ART.belly)
    disc(f, 28, 33.5, 5.5, ART.bellyShade)
    disc(f, 28, 29, 6, ART.belly)

    // bochechas rosadas
    disc(f, 19, 21, 2.2, ART.cheek)
    disc(f, 37, 21, 2.2, ART.cheek)

    // olhos fechados e felizes (arco pra cima)
    const happyEye = (cx: number): void => {
        rect(f, cx - 1, 16, cx + 1, 16, OUTLINE)
        rect(f, cx - 2, 17, cx - 2, 17, OUTLINE)
        rect(f, cx + 2, 17, cx + 2, 17, OUTLINE)
    }
    happyEye(22)
    happyEye(34)

    // narizinho + sorriso
    disc(f, 28, 19.5, 1, ART.bodyDeep)
    rect(f, 26, 22, 30, 22, OUTLINE)
    rect(f, 25, 21, 25, 21, OUTLINE)
    rect(f, 31, 21, 31, 21, OUTLINE)

    // pés com coxinhas douradas
    disc(f, 22, 39, 3, ART.body)
    disc(f, 34, 39, 3, ART.body)
    disc(f, 22, 40, 1.1, ART.bean)
    disc(f, 34, 40, 1.1, ART.bean)
    rect(f, 20, 40, 20, 40, ART.bean)
    rect(f, 36, 40, 36, 40, ART.bean)

    // rabinho com ponta amarela
    disc(f, 41, 36, 1.8, ART.earYellow)

    // brilho na testa
    disc(f, 23, 13, 2.4, ART.mimoHi)

    outline(f)

    return f
}

const buildArmchair = (): Field => {
    const f = emptyField()
    const cy = CY + s(1)

    // encosto + corpo da poltrona
    rect(f, CX - s(6.5), cy - s(6.5), CX + s(6.5), cy + s(2.5), ART.chair)
    disc(f, CX - s(6.5), cy - s(6.5), s(2), ART.chair)
    disc(f, CX + s(6.5), cy - s(6.5), s(2), ART.chair)

    // braços
    rect(f, CX - s(8.6), cy - s(1.5), CX - s(5.5), cy + s(5), ART.chair)
    rect(f, CX + s(5.5), cy - s(1.5), CX + s(8.6), cy + s(5), ART.chair)
    disc(f, CX - s(8.6), cy - s(1.5), s(1.5), ART.chairHi)
    disc(f, CX + s(8.6), cy - s(1.5), s(1.5), ART.chairHi)

    // assento / almofada creme
    rect(f, CX - s(5.2), cy + s(0.5), CX + s(5.2), cy + s(4.5), ART.cushion)
    disc(f, CX, cy + s(1), s(2), ART.cushion)

    // pezinhos de madeira
    rect(f, CX - s(7.5), cy + s(5), CX - s(5.6), cy + s(7.2), ART.wood)
    rect(f, CX + s(5.6), cy + s(5), CX + s(7.5), cy + s(7.2), ART.wood)

    outline(f)

    return f
}

const buildHeart = (): Field => {
    const f = emptyField()

    heart(f, CX, CY - s(0.5), s(7.2), ART.heart)
    disc(f, CX - s(3.2), CY - s(2.4), s(1), ART.heartHi)

    outline(f)

    return f
}

const buildStar = (): Field => {
    const f = emptyField()

    star(f, CX, CY, s(8.4), s(3.5), 5, -90, ART.star)
    disc(f, CX - s(0.1), CY - s(4), s(0.95), ART.starHi)

    outline(f)

    return f
}

let cached: Field[] | null = null

export const getSprites = (): Field[] => {
    if (!cached) cached = [buildHeart(), buildStar(), buildArmchair()]

    return cached
}

/* ------------------------------------------------------------------
   Per-cell deterministic fields (fray, tear length, intro order)
------------------------------------------------------------------ */

export const TEAR_MAX = 3

export const buildNoiseFields = (): {
    yjit: Float32Array
    tear: Uint8Array
    intro: Float32Array
} => {
    const yjit = new Float32Array(COLS * ROWS)
    const tear = new Uint8Array(COLS * ROWS)
    const intro = new Float32Array(COLS * ROWS)

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const i = y * COLS + x

            yjit[i] =
                (hash01(y * 13.13 + 2.1) - 0.5) * 1.2 + (hash01(x * 7.71 + y * 131.7) - 0.5) * 0.7
            tear[i] = 1 + Math.floor(hash01(x * 3.3 + y * 9.7) * TEAR_MAX)
            intro[i] = hash01((x + 1) * 12.98 + (y + 1) * 78.23)
        }
    }

    return { yjit, tear, intro }
}

/* ------------------------------------------------------------------
   Motion configuration
------------------------------------------------------------------ */

export const MOTION = {
    wheelSens: 0.0026,
    maxLead: 1.1,
    ease: 0.16,
    hoverRadius: 5 * RES,
    hoverForce: 0.25 * RES,
    hoverSpring: 0.045,
    hoverDamp: 0.86,
    hoverLag: 0.2,
    hoverMax: 16 * RES,
    clickForce: 0.28 * RES,
    clickAttack: 0.05,
    clickDecay: 0.965,
    clickReach: 10 * RES,
    introDelay: 250,
    introDur: 1300,
    popWidth: 0.16,
    popScale: 0.85,
    dprCap: 2.5
}

export const readTheme = (): ThemeName => {
    if (typeof document === 'undefined') return 'light'

    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}
