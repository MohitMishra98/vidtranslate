/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Must match the image URL protocol
        hostname: 'plus.unsplash.com', // Just the hostname, no https:// or path
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'fuzzy-enigma-4jjqp75xg5prcjpx9-3000.app.github.dev', // Your exact current codespace
        '*.app.github.dev' // Wildcard so it works even if your codespace name changes
      ],
    },
  },
};

export default nextConfig;
