import type { NextConfig } from 'next'

// Gated base path: só em build de produção com NEXT_PUBLIC_BASE_PATH (GitHub Pages
// em /<repo>). Em dev e no Lovable (sem a env) fica vazio -> roda na raiz.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
    output: 'export',
    basePath: basePath || undefined,
    assetPrefix: basePath || undefined,
    images: {
        unoptimized: true
    },
    poweredByHeader: false,
    devIndicators: false,
    typescript: {
        ignoreBuildErrors: true
    },
    productionBrowserSourceMaps: false,
    experimental: {
        optimizePackageImports: ['lucide-react'],
        cpus: 1,
        workerThreads: false
    }
}

export default nextConfig
