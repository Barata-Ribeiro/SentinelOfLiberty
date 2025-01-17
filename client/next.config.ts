import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    reactStrictMode: true,
    trailingSlash: false,
    skipTrailingSlashRedirect: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                port: ""
            }
        ]
    },
    experimental: {
        optimizePackageImports: [ "tailwindcss", "@headlessui/react" ]
    }
}

export default nextConfig
