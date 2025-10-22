import Image from "next/image";
import FormLogin from "./components/formLogin";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-slate-50">
      {/* Coluna do Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 relative">
        <div className="absolute top-12 left-0 right-0 mx-auto w-full max-w-sm text-center">
          <Image
            src="/logo-finexus-df.png"
            alt="Finexus Logo"
            width={240}
            height={48}
            priority
            className="mx-auto"
          />
        </div>

        <div className="w-full max-w-sm">
          <div className="w-full bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-black/10 border border-gray-200/75 hover:scale-105 transition-transform duration-300">
            <FormLogin />
          </div>
        </div>
      </div>

      {/* Coluna da Imagem com BORDER RADIUS APLICADO 👇 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 to-violet-700 items-center justify-center p-12 rounded-tl-3xl rounded-bl-3xl">
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
