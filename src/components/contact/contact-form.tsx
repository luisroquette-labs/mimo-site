import type { ChangeEvent, FC, FormEvent, ReactNode } from 'react'
import type { ContactStatus } from '@/types'

import { useState } from 'react'
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { topics } from '@/constants/contact'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const initialValues = {
    name: '',
    email: '',
    company: '',
    topic: topics[0],
    message: '',
    website: ''
}

const fieldClass =
    'mt-3 w-full border-b bg-transparent pb-3 text-[15px] text-px-text outline-none transition-colors duration-500 placeholder:text-px-muted/70 focus:border-px-text'

export const ContactForm: FC = (): ReactNode => {
    const [values, setValues] = useState(initialValues)
    const [status, setStatus] = useState<ContactStatus>('idle')
    const [message, setMessage] = useState<string>('')
    const [invalidField, setInvalidField] = useState<string>('')

    const update = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
        const { name, value } = event.target

        setValues((prev) => ({ ...prev, [name]: value }))

        if (invalidField === name) {
            setInvalidField('')
            setMessage('')
            setStatus('idle')
        }
    }

    const validate = (): { field: string, text: string } | null => {
        if (values.name.trim().length < 2) return { field: 'name', text: 'Escreva o seu nome, por favor.' }
        if (!emailPattern.test(values.email.trim())) return { field: 'email', text: 'Esse e-mail não parece certo.' }
        if (values.message.trim().length < 10) return { field: 'message', text: 'Conta um pouquinho mais — pelo menos dez caracteres.' }

        return null
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        const problem = validate()

        if (problem) {
            setInvalidField(problem.field)
            setMessage(problem.text)
            setStatus('error')

            return
        }

        // Mockup: o site publicado é estático, sem backend. A ligação do envio
        // (e-mail/banco) é feita depois no Lovable — ver LEIA-ME.txt.
        setMessage('')
        setInvalidField('')
        setValues(initialValues)
        setStatus('success')
    }

    if (status === 'success') {
        return (
            <div className='border border-px-hairline p-[clamp(28px,4vw,52px)]'>
                <span className='flex size-9 items-center justify-center border border-px-text text-px-text'>
                    <Check aria-hidden='true' className='size-4' />
                </span>

                <h3 className='mt-[clamp(18px,3vh,28px)] font-display text-[clamp(22px,2.6vw,32px)] font-medium leading-[1.2] tracking-[-0.01em] text-px-text'>
                    Mensagem recebida
                </h3>

                <p className='mt-4 max-w-[46ch] text-[14px] leading-[1.6] text-px-muted'>
                    Já está na caixa de entrada do Mimo. Você recebe uma resposta direta em até um
                    dia útil, de uma pessoa de verdade — nada de resposta automática.
                </p>

                <button
                    type='button'
                    onClick={() => setStatus('idle')}
                    className='label-fixed mt-[clamp(24px,4vh,40px)] border-b border-px-text pb-2 text-px-text transition-opacity duration-500 hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70'
                >
                    Enviar outra
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} noValidate className='w-full'>
            <div className='grid gap-[clamp(24px,3.5vh,40px)] min-[821px]:grid-cols-2'>
                <div>
                    <label htmlFor='name' className='label-fixed text-px-muted'>
                        Seu nome
                    </label>

                    <input
                        id='name'
                        name='name'
                        type='text'
                        value={values.name}
                        onChange={update}
                        autoComplete='name'
                        placeholder='Ada Lovelace'
                        aria-invalid={invalidField === 'name'}
                        className={cn(fieldClass, invalidField === 'name' ? 'border-[#cf3f4d]' : 'border-px-hairline')}
                    />
                </div>

                <div>
                    <label htmlFor='email' className='label-fixed text-px-muted'>
                        Email
                    </label>

                    <input
                        id='email'
                        name='email'
                        type='email'
                        value={values.email}
                        onChange={update}
                        autoComplete='email'
                        placeholder='voce@email.com'
                        aria-invalid={invalidField === 'email'}
                        className={cn(fieldClass, invalidField === 'email' ? 'border-[#cf3f4d]' : 'border-px-hairline')}
                    />
                </div>

                <div>
                    <label htmlFor='company' className='label-fixed text-px-muted'>
                        Apelido <span className='normal-case tracking-normal'>(opcional)</span>
                    </label>

                    <input
                        id='company'
                        name='company'
                        type='text'
                        value={values.company}
                        onChange={update}
                        autoComplete='organization'
                        placeholder='Como te chamam'
                        className={cn(fieldClass, 'border-px-hairline')}
                    />
                </div>

                <div className='relative'>
                    <label htmlFor='topic' className='label-fixed text-px-muted'>
                        Sobre o que é
                    </label>

                    <select
                        id='topic'
                        name='topic'
                        value={values.topic}
                        onChange={update}
                        className={cn(fieldClass, 'appearance-none border-px-hairline pr-8')}
                    >
                        {topics.map((topic) => (
                            <option key={topic} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        aria-hidden='true'
                        className='pointer-events-none absolute bottom-4 right-0 size-4 text-px-muted'
                    />
                </div>
            </div>

            <div className='mt-[clamp(24px,3.5vh,40px)]'>
                <label htmlFor='message' className='label-fixed text-px-muted'>
                    Sua mensagem
                </label>

                <textarea
                    id='message'
                    name='message'
                    rows={5}
                    value={values.message}
                    onChange={update}
                    placeholder='O que aconteceu, em que aparelho e, se for um bug, o que você estava fazendo.'
                    aria-invalid={invalidField === 'message'}
                    className={cn(
                        fieldClass,
                        'resize-none leading-[1.6]',
                        invalidField === 'message' ? 'border-[#cf3f4d]' : 'border-px-hairline'
                    )}
                />
            </div>

            <div className='hidden' aria-hidden='true'>
                <label htmlFor='website'>
                    Leave this empty
                </label>

                <input
                    id='website'
                    name='website'
                    type='text'
                    tabIndex={-1}
                    autoComplete='off'
                    value={values.website}
                    onChange={update}
                />
            </div>

            <div className='mt-[clamp(28px,4.5vh,48px)] flex flex-wrap items-center gap-x-[clamp(16px,3vw,32px)] gap-y-4'>
                <button
                    type='submit'
                    disabled={status === 'submitting'}
                    className={cn(
                        'label-fixed group inline-flex items-center gap-3 border border-px-text px-[clamp(20px,3vw,32px)] py-4',
                        'text-px-text transition-colors duration-500 hover:bg-px-text hover:text-px-bg',
                        'focus-visible:bg-px-text focus-visible:text-px-bg focus-visible:outline-none',
                        'disabled:cursor-wait disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-px-text'
                    )}
                >
                    <span>
                        {status === 'submitting' ? 'Enviando' : 'Enviar mensagem'}
                    </span>

                    <ArrowUpRight
                        aria-hidden='true'
                        className='size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                    />
                </button>

                <p
                    aria-live='polite'
                    className={cn(
                        'min-h-[1.2em] text-[13px] leading-[1.5] transition-colors duration-500',
                        status === 'error' ? 'text-[#cf3f4d]' : 'text-px-muted'
                    )}
                >
                    {status === 'error' ? message : ''}
                </p>
            </div>
        </form>
    )
}
