// src/app/components/features.tsx
export default function Features() {
  return (
    <section className="bg-violet-600 text-white py-20 relative">
      <div
        className="absolute top-0 left-0 w-full h-20 bg-white"
        style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
      ></div>

      <div className="container mx-auto px-4 md:px-16 relative z-10 mt-10">
        <div className="text-center md:text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher a gente?
          </h2>
          <p className="max-w-2xl mx-auto md:mx-0 text-lg">
            Nossa plataforma oferece segurança, transparência e oportunidades
            únicas de investimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
            {/* Ícone Rentabilidade SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-violet-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">Rentabilidade Atrativa</h3>
            <p className="text-gray-600">
              Oportunidades de investimento com potencial de retorno superior ao
              mercado tradicional.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
            {/* Ícone Segurança SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-violet-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 3.044a12.02 12.02 0 009-3.044 12.02 12.02 0 00-2.382-9.984z"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">Segurança Garantida</h3>
            <p className="text-gray-600">
              Todas as empresas passam por rigorosa análise de crédito e due
              diligence.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
            {/* Ícone Suporte SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-violet-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">Suporte Especializado</h3>
            <p className="text-gray-600">
              Equipe de especialistas para ajudar em todas as etapas do seu
              investimento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
