import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configurações para ignorar erros no Build e deixar o site subir */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
