import React from "react";

export default function SettingsMEI() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-violet-900">
        Configurações MEI
      </h1>
      <div className="bg-violet-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-violet-800">
          Preferências do Sistema
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-700">
              Perfil Atual: <span className="font-semibold">MEI</span>
            </p>
            <p className="text-gray-700">
              Notificações:{" "}
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Ativadas
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
