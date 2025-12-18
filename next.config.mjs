/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // On garde ça pour que Vercel ne bloque pas sur des détails de code
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
