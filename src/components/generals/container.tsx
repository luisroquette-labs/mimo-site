import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = {
    children: ReactNode
    className?: string
}

export const Container: FC<ContainerProps> = ({ children, className }): ReactNode => {
    return (
        <div className={cn('mx-auto w-full max-w-[1440px] px-[clamp(18px,3vw,44px)]', className)}>
            {children}
        </div>
    )
}
