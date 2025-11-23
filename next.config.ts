import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://finexus-backend.onrender.com/:path*",
      },
      {
        source: "/usuarios/cpf/:cpf",
        destination: "https://finexus-backend.onrender.com/usuarios/cpf/:cpf",
      },
    ];
  },
};

export default nextConfig;
