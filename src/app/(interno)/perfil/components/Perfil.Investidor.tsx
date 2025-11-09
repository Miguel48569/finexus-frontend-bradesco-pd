import React from "react";

export default function PerfilInvestidor() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-violet-900">
        Perfil Investidor
      </h1>
      <div className="bg-violet-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-violet-800">
          Informações do Investidor
        </h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Tipo de Perfil: <span className="font-semibold">Investidor</span>
          </p>
          <p className="text-gray-700">
            Status:{" "}
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Ativo
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
