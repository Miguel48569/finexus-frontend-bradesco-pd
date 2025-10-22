// src/app/components/stats.tsx
export default function Stats() {
  return (
    <section className="bg-violet-900 text-white py-20">
      <div className="container mx-auto px-4 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl md:text-5xl font-bold text-violet-400 mb-2">
              R$ 120M+
            </p>
            <p className="text-gray-400">Volume Investido</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-violet-400 mb-2">
              850+
            </p>
            <p className="text-gray-400">Investidores Ativos</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-violet-400 mb-2">
              98%
            </p>
            <p className="text-gray-400">Taxa de Sucesso</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-violet-400 mb-2">
              12.5%
            </p>
            <p className="text-gray-400">Retorno Médio a.a.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
