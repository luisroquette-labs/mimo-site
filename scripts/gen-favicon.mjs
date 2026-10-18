// Gera public/favicon.svg a partir do sprite do Mimo (espelha buildMimo de src/lib/pixels/field.ts).
// Pixel-art crisp: um <rect> por run horizontal de mesma cor, recortado na bounding box.
import { writeFileSync } from 'node:fs'

const COLS = 56
const ROWS = 44
const OUTLINE = '@'

const ART = {
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
    earYellow: '#f4d86b'
}
const OUTLINE_COLOR = '#141109'

const f = new Array(COLS * ROWS).fill(null)

const rect = (x0, y0, x1, y1, c) => {
    const ax = Math.round(Math.min(x0, x1))
    const bx = Math.round(Math.max(x0, x1))
    const ay = Math.round(Math.min(y0, y1))
    const by = Math.round(Math.max(y0, y1))
    for (let y = Math.max(0, ay); y <= Math.min(ROWS - 1, by); y++)
        for (let x = Math.max(0, ax); x <= Math.min(COLS - 1, bx); x++) f[y * COLS + x] = c
}

const disc = (cx, cy, r, c) => {
    const r2 = r * r
    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(ROWS - 1, Math.ceil(cy + r)); y++)
        for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(COLS - 1, Math.ceil(cx + r)); x++) {
            const dx = x - cx
            const dy = y - cy
            if (dx * dx + dy * dy <= r2) f[y * COLS + x] = c
        }
}

const outline = () => {
    const out = f.slice()
    for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
            if (f[y * COLS + x] !== null) continue
            let touching = false
            for (let dy = -1; dy <= 1 && !touching; dy++)
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue
                    const nx = x + dx
                    const ny = y + dy
                    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue
                    if (f[ny * COLS + nx] !== null) { touching = true; break }
                }
            if (touching) out[y * COLS + x] = OUTLINE
        }
    for (let i = 0; i < out.length; i++) f[i] = out[i]
}

// --- buildMimo (idêntico a field.ts) ---
disc(24, 9, 2.2, ART.bodyShade)
disc(28, 6.5, 2.8, ART.bodyShade)
disc(32, 9, 2.2, ART.bodyShade)
disc(28, 10.5, 2.2, ART.bodyShade)

disc(11, 17, 3, ART.earBlue)
disc(10, 21, 3, ART.earViolet)
disc(9.5, 25, 2.8, ART.earMagenta)
disc(10, 28.5, 2.5, ART.earPink)
disc(11, 31.5, 2.2, ART.earOrange)
disc(12, 34, 1.8, ART.earYellow)
disc(45, 17, 3, ART.earBlue)
disc(46, 21, 3, ART.earViolet)
disc(46.5, 25, 2.8, ART.earMagenta)
disc(46, 28.5, 2.5, ART.earPink)
disc(45, 31.5, 2.2, ART.earOrange)
disc(44, 34, 1.8, ART.earYellow)

disc(28, 18, 12, ART.body)
rect(16, 18, 40, 33, ART.body)
disc(17, 33, 4, ART.body)
disc(39, 33, 4, ART.body)
disc(28, 34, 6, ART.body)

disc(40, 29, 5, ART.bodyShade)
disc(28, 37, 5, ART.bodyShade)

disc(14, 27, 2.8, ART.body)
disc(42, 27, 2.8, ART.body)

disc(28, 30, 7, ART.belly)
disc(28, 33.5, 5.5, ART.bellyShade)
disc(28, 29, 6, ART.belly)

disc(19, 21, 2.2, ART.cheek)
disc(37, 21, 2.2, ART.cheek)

const happyEye = (cx) => {
    rect(cx - 1, 16, cx + 1, 16, OUTLINE)
    rect(cx - 2, 17, cx - 2, 17, OUTLINE)
    rect(cx + 2, 17, cx + 2, 17, OUTLINE)
}
happyEye(22)
happyEye(34)

disc(28, 19.5, 1, ART.bodyDeep)
rect(26, 22, 30, 22, OUTLINE)
rect(25, 21, 25, 21, OUTLINE)
rect(31, 21, 31, 21, OUTLINE)

disc(22, 39, 3, ART.body)
disc(34, 39, 3, ART.body)
disc(22, 40, 1.1, ART.bean)
disc(34, 40, 1.1, ART.bean)
rect(20, 40, 20, 40, ART.bean)
rect(36, 40, 36, 40, ART.bean)

disc(41, 36, 1.8, ART.earYellow)
disc(23, 13, 2.4, ART.mimoHi)

outline()

// bounding box dos pixels pintados
let minX = COLS, minY = ROWS, maxX = 0, maxY = 0
for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
        if (f[y * COLS + x] !== null) {
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
        }

const pad = 1
minX -= pad; minY -= pad; maxX += pad; maxY += pad
const w = maxX - minX + 1
const h = maxY - minY + 1

const rects = []
for (let y = minY; y <= maxY; y++) {
    let x = minX
    while (x <= maxX) {
        const c = f[y * COLS + x]
        if (c === null) { x++; continue }
        const fill = c === OUTLINE ? OUTLINE_COLOR : c
        let run = 1
        while (x + run <= maxX && f[y * COLS + x + run] === c) run++
        rects.push(`<rect x="${x - minX}" y="${y - minY}" width="${run}" height="1" fill="${fill}"/>`)
        x += run
    }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects.join('')}</svg>\n`

writeFileSync(new URL('../public/favicon.svg', import.meta.url), svg)
console.log(`favicon.svg: ${w}x${h}, ${rects.length} rects, ${svg.length} bytes`)
