"use client";

import { useState } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  DollarSign,
  PieChart,
} from "lucide-react";

// --- MOCK DATA (Simulando o que viria do seu users.ts) ---
const emprestimoAtivo = {
  id: "EMP-2024-001",
  valorTotal: 5000,
  valorPago: 1500,
  progresso: 30, // 30% pago
  parcelas: [
    { id: 1, valor: 500, vencimento: "20/10/2024", status: "paga" },
    { id: 2, valor: 500, vencimento: "20/11/2024", status: "paga" },
    { id: 3, valor: 500, vencimento: "20/12/2024", status: "paga" },
    { id: 4, valor: 500, vencimento: "20/01/2025", status: "vencida" },
    { id: 5, valor: 500, vencimento: "20/02/2025", status: "aberta" },
    { id: 6, valor: 500, vencimento: "20/03/2025", status: "aberta" },
    { id: 7, valor: 500, vencimento: "20/04/2025", status: "pendente" },
    { id: 8, valor: 500, vencimento: "20/05/2025", status: "pendente" },
    { id: 9, valor: 500, vencimento: "20/06/2025", status: "aberta" },
    { id: 10, valor: 500, vencimento: "20/07/2025", status: "aberta" },
  ],
};

export default function PagamentosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState<any>(null);
  const [pixCopiado, setPixCopiado] = useState(false);

  // Função para abrir o modal de pagamento
  const handlePagar = (parcela: any) => {
    setSelectedParcela(parcela);
    setModalOpen(true);
    setPixCopiado(false);
  };

  // Simula cópia do PIX
  const copiarPix = () => {
    navigator.clipboard.writeText(
      "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Finexus P2P6008BRASILIA62070503***6304"
    );
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 3000);
  };

  // Pega a próxima parcela que precisa ser paga (A primeira que não está paga)
  const proximaParcela = emprestimoAtivo.parcelas.find(
    (p) => p.status === "vencida" || p.status === "aberta"
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER SIMPLES */}
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-violet-700">Pagamentos</h1>
        <p className="text-violet-600 text-sm mt-1">
          Gerencie as parcelas do seu empréstimo ativo.
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* 1. CARD DE RESUMO (DESTAQUE) */}
        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          {/* Bolhas decorativas de fundo */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">
                Próximo Vencimento
              </p>
              <h2 className="text-3xl font-bold">
                R$ {proximaParcela?.valor.toFixed(2)}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-indigo-100 bg-indigo-800/50 px-3 py-1 rounded-full w-fit">
                <Calendar size={16} />
                <span className="text-sm font-medium">
                  {proximaParcela?.vencimento}
                </span>
                {proximaParcela?.status === "ATRASADO" && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    ATRASADO
                  </span>
                )}
              </div>
            </div>

            {/* Barra de Progresso do Empréstimo */}
            <div className="w-full md:w-1/3 bg-indigo-800/50 p-4 rounded-xl backdrop-blur-sm border border-indigo-700/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-indigo-200">Empréstimo Quitado</span>
                <span className="font-bold">{emprestimoAtivo.progresso}%</span>
              </div>
              <div className="w-full bg-indigo-950 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${emprestimoAtivo.progresso}%` }}
                ></div>
              </div>
              <p className="text-xs text-indigo-300 mt-2 text-right">
                R$ {emprestimoAtivo.valorPago} de R${" "}
                {emprestimoAtivo.valorTotal}
              </p>
            </div>
          </div>
        </div>

        {/* 2. LISTA DE PARCELAS */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-indigo-600" />
            Histórico de Parcelas
          </h3>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {emprestimoAtivo.parcelas.map((parcela) => (
              <div
                key={parcela.id}
                className={`flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition-colors ${
                  parcela.status === "ATRASADO"
                    ? "bg-red-50 hover:bg-red-100/50"
                    : ""
                }`}
              >
                {/* Lado Esquerdo: Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                    ${
                      parcela.status === "PAGO"
                        ? "bg-green-100 text-green-600"
                        : parcela.status === "ATRASADO"
                        ? "bg-red-100 text-red-600"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {parcela.status === "PAGO" ? (
                      <CheckCircle2 size={20} />
                    ) : parcela.status === "ATRASADO" ? (
                      <AlertCircle size={20} />
                    ) : (
                      <DollarSign size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      Parcela #{parcela.id}
                    </p>
                    <p
                      className={`text-sm ${
                        parcela.status === "ATRASADO"
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Vence em {parcela.vencimento}
                    </p>
                  </div>
                </div>

                {/* Lado Direito: Valor e Ação */}
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700 hidden sm:block">
                    R$ {parcela.valor.toFixed(2)}
                  </span>

                  {parcela.status === "PAGO" ? (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full border border-gray-200">
                      PAGO
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePagar(parcela)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          parcela.status === "ATRASADO"
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200 shadow-md"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-md"
                        }`}
                    >
                      Pagar
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MODAL DE PAGAMENTO (PIX) */}
      {modalOpen && selectedParcela && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Realizar Pagamento
              </h3>
              <p className="text-gray-500">
                Parcela #{selectedParcela.id} - Vencimento{" "}
                {selectedParcela.vencimento}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Escaneie o QR Code</p>
              {/* Placeholder do QR Code */}
              <div className="w-48 h-48 bg-white border-2 border-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <div className="grid grid-cols-6 gap-1 opacity-20">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-black rounded-sm"></div>
                  ))}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                R$ {selectedParcela.valor.toFixed(2)}
              </div>
            </div>

            <button
              onClick={copiarPix}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                ${
                  pixCopiado
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                }`}
            >
              {pixCopiado ? (
                <>
                  <CheckCircle2 size={20} />
                  Código Copiado!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copiar Código PIX
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
              O pagamento pode levar até 30 minutos para ser processado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
