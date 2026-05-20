import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bez tego Next potrafi wziąć lockfile z katalogu wyżej (np. ~/pnpm-lock.yaml)
  // i indeksować cały profil — obciążenie CPU/RAM.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
    ],
  },
}

export default nextConfig
