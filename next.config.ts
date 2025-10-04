import type { NextConfig } from 'next';
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'code-bin.46004302832b6f1022cd321a40462869.r2.cloudflarestorage.com',
                pathname: '/**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
