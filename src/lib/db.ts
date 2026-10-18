type ColumnKind = 'boolean' | 'date' | 'timestamp' | 'json' | 'string'

type DatabaseAnswer = {
    success?: boolean
    message?: string
    errors?: Array<{ message?: string }>
    rows?: Array<Record<string, unknown>>
    result?: Array<{ results?: Array<Record<string, unknown>>, meta?: { changes?: number } }>
}

type QueryResult<T> = {
    rows: T[]
    rowCount: number
}

const COLUMN_KINDS: Record<string, ColumnKind> = {
    created_at: 'timestamp',
    updated_at: 'timestamp'
}

const toParam = (value: unknown): unknown => {
    if (value === undefined || value === null) return null
    if (typeof value === 'boolean') return value ? 1 : 0
    if (value instanceof Date) return value.toISOString()
    if (typeof value === 'bigint') return value.toString()
    if (typeof value === 'object') return JSON.stringify(value)

    return value
}

const toUtcDate = (value: string): Date => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number)

    return new Date(Date.UTC(year, month - 1, day))
}

const fromColumn = (kind: ColumnKind | undefined, value: unknown): unknown => {
    if (value === null || value === undefined || !kind) return value
    if (kind === 'boolean') return value === 1 || value === true || value === '1'
    if (kind === 'timestamp') return new Date(String(value))
    if (kind === 'date') return toUtcDate(String(value))
    if (kind === 'json') return typeof value === 'string' ? JSON.parse(value) : value

    return String(value)
}

const restore = <T>(row: Record<string, unknown>): T => {
    const restored: Record<string, unknown> = {}

    for (const key of Object.keys(row)) restored[key] = fromColumn(COLUMN_KINDS[key], row[key])

    return restored as T
}

const query = async <T = any>(text: string, params: unknown[] = []): Promise<QueryResult<T>> => {
    const url = process.env.DATABASE_URL
    const token = process.env.DATABASE_TOKEN

    if (!url || !token) throw new Error('DATABASE_URL and DATABASE_TOKEN are required.')

    const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: text, params: params.map(toParam) })
    })

    const answer = await response.json().catch(() => null) as DatabaseAnswer | null

    if (!response.ok || !answer || answer.success === false) {
        throw new Error(answer?.message || answer?.errors?.[0]?.message || `The database answered ${response.status}.`)
    }

    const rows = (answer.rows ?? answer.result?.[0]?.results ?? []).map(row => restore<T>(row))
    const isWrite = /^\s*(insert|update|delete|replace)\b/i.test(text)

    return {
        rows,
        rowCount: isWrite ? answer.result?.[0]?.meta?.changes ?? rows.length : rows.length
    }
}

const pool = { query }

export const getPool = () => pool
