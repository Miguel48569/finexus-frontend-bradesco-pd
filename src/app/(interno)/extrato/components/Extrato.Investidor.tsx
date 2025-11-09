import React from "react";

export default function ExtratoInvestidor() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-violet-900">
        Extrato Investidor
      </h1>
      <div className="bg-violet-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-violet-800">
          Movimentações Recentes
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-700">
              Tipo de Conta: <span className="font-semibold">Investidor</span>
            </p>
            <p className="text-gray-700">
              Última Atualização: <span className="text-violet-600">Hoje</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
