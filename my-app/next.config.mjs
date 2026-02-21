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
};

export default nextConfig;
