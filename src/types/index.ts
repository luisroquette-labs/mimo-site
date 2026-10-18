import type { ReactNode } from 'react'

export type SiteConfig = {
    name: string
    description: string
    url: string
    ogImage?: string
    links?: {
        twitter?: string
        github?: string
    }
}

export type LayoutProps = {
    children: ReactNode
    indexLabel?: string
    fixed?: boolean
}

export type LogoProps = {
    width?: number
    height?: number
    className?: string
}

export type SeoProps = {
    title?: string
    description?: string
    ogImage?: string
}

/* ------------------------------------------------------------------
   Pixel field
------------------------------------------------------------------ */

export type Cell = string | null

export type Field = Cell[]

export type ThemeName = 'light' | 'dark'

export type PixelTheme = {
    bg: string
    text: string
    muted: string
    hairline: string
    grid: string
    gridStrong: string
    outline: string
    scan: string
}

export type Offering = {
    title: string[]
    body: string
}

/* ------------------------------------------------------------------
   Chrome & content
------------------------------------------------------------------ */

export type NavItem = {
    label: string
    href: string
}

export type FooterCell = {
    label: string
    href?: string
}

export type RevealProps = {
    children: ReactNode
    as?: 'div' | 'section' | 'span' | 'li' | 'p' | 'header' | 'footer' | 'article'
    mode?: 'rise' | 'fade' | 'clip'
    trigger?: 'scroll' | 'load'
    delay?: number
    duration?: number
    distance?: number
    threshold?: number
    className?: string
    id?: string
}

export type PixelSpriteProps = {
    sprite: number
    className?: string
    cell?: number
    label?: string
}

export type ContactStatus = 'idle' | 'submitting' | 'success' | 'error'
