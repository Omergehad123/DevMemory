// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.47'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig