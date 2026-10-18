import type { ThemeName } from '@/types'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pixels-theme'

export const useTheme = (): { theme: ThemeName, toggle: () => void } => {
    const [theme, setTheme] = useState<ThemeName>('light')

    useEffect(() => {
        const current = document.documentElement.getAttribute('data-theme')

        setTheme(current === 'dark' ? 'dark' : 'light')
    }, [])

    const toggle = useCallback((): void => {
        setTheme((prev) => {
            const next: ThemeName = prev === 'dark' ? 'light' : 'dark'

            document.documentElement.setAttribute('data-theme', next)

            try {
                localStorage.setItem(STORAGE_KEY, next)
            } catch {
                /* storage unavailable — the choice simply does not persist */
            }

            return next
        })
    }, [])

    return { theme, toggle }
}
