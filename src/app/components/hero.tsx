// src/app/components/hero.tsx

import Link from "next/link";

const StoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 text-violet-600 mb-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21M3 7.5l6.75-5.25L16.5 7.5M21 13.5V21a2.25 2.25 0 01-2.25 2.25H15"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 text-violet-600 mb-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
    />
  </svg>
);

export default function Hero() {
  return (
    <>
      {/* --- Seção Hero (tela cheia) --- */}
      <section
        className="relative h-screen flex items-center justify-center text-white bg-cover bg-center md:bg-top"
        style={{ backgroundImage: "url('/fundoPage.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 container mx-auto text-left px-4 md:px-16 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Invista no Futuro das <br /> Empresas Brasileiras
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Conectamos investidores a oportunidades de crescimento em empresas
            promissoras, gerando valor para todos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#sobre"
              className="bg-violet-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
              Saiba Mais
            </Link>
            <button className="bg-transparent border border-white text-white font-semibold py-3 px-6 rounded-md hover:bg-white hover:text-black transition-colors">
              Acesse meu Portfólio
            </button>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-white py-24">
        <div className="container mx-auto px-4 md:px-16 text-center max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            O Futuro do Crédito é Colaborativo
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-16">
            A Finexus nasceu para resolver um grande desafio: simplificar o
            acesso ao crédito para pequenos negócios e, ao mesmo tempo, criar
            oportunidades de investimento com impacto real e retorno atrativo.
          </p>

          {/* Cards de Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Card para Empreendedores */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <StoreIcon />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Para Empreendedores
              </h3>
              <p className="text-gray-600">
                Acesse o capital que seu negócio precisa para crescer, sem a
                burocracia dos bancos tradicionais. Oferecemos um processo ágil,
                taxas competitivas e uma comunidade de investidores pronta para
                acreditar no seu potencial.
              </p>
            </div>

            {/* Card para Investidores */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <ChartIcon />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Para Investidores
              </h3>
              <p className="text-gray-600">
                Diversifique sua carteira com investimentos de impacto. Tenha
                acesso a projetos promissores, com transparência total sobre
                riscos e rentabilidade, e ajude a impulsionar a economia real.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
