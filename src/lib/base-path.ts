// Prefixa assets de /public com o basePath (GitHub Pages em /<repo>).
// Vazio em dev e no Lovable; preenchido só no build de produção via env.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const asset = (path: string): string => `${basePath}${path}`
