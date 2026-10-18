import type { FC, ReactNode } from 'react'
import type { LayoutProps } from '@/types'

import { cn } from '@/lib/utils'
import { Navbar } from '@/components/generals/navbar'
import { Footer } from '@/components/generals/footer'

export const Layout: FC<LayoutProps> = ({ children, indexLabel, fixed = false }): ReactNode => {
    return (
        <div
            className={cn(
                'relative flex flex-col bg-px-bg text-px-text',
                fixed ? 'h-[100svh] overflow-hidden' : 'min-h-[100svh]'
            )}
        >
            <Navbar />

            <main className='flex-1'>
                {children}
            </main>

            <Footer overlay={fixed} indexLabel={indexLabel} />
        </div>
    )
}
