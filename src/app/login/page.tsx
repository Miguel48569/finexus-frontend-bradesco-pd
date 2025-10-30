import Image from "next/image";
import FormLogin from "./components/formLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://localhost:3000") /* your base URL */,
  title: "Login - Finexus",
  description: "Faça login na plataforma Finexus",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-slate-50">
      {/* Coluna do Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col items-center p-4 sm:p-6 lg:p-8 py-6 sm:py-8 overflow-y-auto">
        {/* Logo no topo - RESPONSIVO */}
        <div className="w-full max-w-sm mb-6 sm:mb-8 lg:mb-12 flex-shrink-0">
          <Image
            src="/logo-finexus-df.png"
            alt="Finexus Logo"
            width={200}
            height={40}
            priority
            className="mx-auto w-40 sm:w-48 md:w-56 h-auto"
          />
        </div>

        {/* Card do Formulário */}
        <div className="w-full max-w-sm flex-shrink-0">
          <div className="w-full bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl shadow-black/10 border border-gray-200/75">
            <FormLogin />
          </div>
        </div>

        {/* Espaçamento inferior para mobile */}
        <div className="h-6 sm:h-8 flex-shrink-0" />
      </div>

      {/* Coluna da Imagem - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 to-violet-700 items-center justify-center p-12">
        <Image
          src="/login-image.png"
          alt="Ilustração de pessoas analisando gráficos e investimentos"
          width={500}
          height={500}
          className="w-full max-w-md"
        />
      </div>
    </main>
  );
}
