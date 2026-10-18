import type { SiteConfig } from '@/types'
import { getOrigin } from '@/lib/window'

export const siteConfig: SiteConfig = {
    name: 'Mimo',
    description:
        'Mimo é o seu bichinho virtual: cuide, brinque e deixe o cantinho com a sua cara. Comece a jogar sem conta.',
    url: getOrigin()
}

export const contactDetails = {
    email: 'oi@mimo.pet',
    reply: 'Respondo em até um dia útil',
    location: 'Joga em qualquer aparelho',
    hours: 'Seg a Sex, 09:00 – 18:00'
}
