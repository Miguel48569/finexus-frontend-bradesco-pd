"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Wallet,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Plus,
  ArrowUpRight,
  Clock,
  AlertCircle,
  X,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Emprestimo {
  id: number;
  empresa: string;
  valor: number;
  pago: number;
  juros: number;
  status: "Ativo" | "Quitado" | "Atrasado";
  dataVencimento: string;
  dataSolicitacao: string;
}

const emprestimos: Emprestimo[] = [
  {
    id: 1,
    empresa: "Cafeteria Aroma Bom",
    valor: 5000,
    pago: 3000,
    juros: 3.2,
    status: "Ativo",
    dataVencimento: "15/12/2025",
    dataSolicitacao: "15/06/2025",
  },
  {
    id: 2,
    empresa: "Loja Fashion Style",
    valor: 8000,
    pago: 8000,
    juros: 2.8,
    status: "Quitado",
    dataVencimento: "01/11/2025",
    dataSolicitacao: "01/05/2025",
  },
  {
    id: 3,
    empresa: "Oficina AutoPro",
    valor: 6000,
    pago: 1500,
    juros: 4.1,
    status: "Ativo",
    dataVencimento: "20/01/2026",
    dataSolicitacao: "20/07/2025",
  },
  {
    id: 4,
    empresa: "Restaurante Sabor & Cia",
    valor: 7500,
    pago: 4500,
    juros: 3.7,
    status: "Ativo",
    dataVencimento: "10/02/2026",
    dataSolicitacao: "10/08/2025",
  },
];

const historicoMensal = [
  { mes: "Jan", valor: 0 },
  { mes: "Fev", valor: 0 },
  { mes: "Mar", valor: 0 },
  { mes: "Abr", valor: 0 },
  { mes: "Mai", valor: 8000 },
  { mes: "Jun", valor: 13000 },
  { mes: "Jul", valor: 19000 },
  { mes: "Ago", valor: 26500 },
  { mes: "Set", valor: 26500 },
  { mes: "Out", valor: 26500 },
  { mes: "Nov", valor: 26500 },
];

const COLORS = ["#7C3AED", "#A78BFA", "#EC4899", "#C4B5FD"];

export default function DashboardMEI() {
  const [showResgatarModal, setShowResgatarModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const saldoDisponivel = 17000;
  const saldoBloqueado = 9500;
  const totalRecebido = 26500;
  const portfolioTotal = saldoDisponivel + saldoBloqueado;
  const variacao = 37.8;
  const variacaoValor = 21589.99;
  const emprestimosAtivos = emprestimos.filter((e) => e.status === "Ativo");
  const proximoVencimento = emprestimosAtivos[0]?.dataVencimento || "Nenhum";

  const dadosPizza = emprestimos
    .filter((e) => e.status === "Ativo")
    .map((e) => ({
      name: e.empresa,
      value: e.valor,
    }));

  const handleSolicitarInvestimento = () => {
    console.log("Navegar para tela de solicitação");
  };

  const handleResgatar = () => {
    setShowResgatarModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-100">
      {/* Notificação de sucesso */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in">
          <CheckCircle size={24} />
          <span className="font-semibold">Operação realizada com sucesso!</span>
        </div>
      )}

      {/* Header com Portfolio Total */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-violet-200 mb-2 text-sm">Portfolio Total</p>
            <h1 className="text-5xl font-bold mb-2">
              R${" "}
              {portfolioTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h1>
            <p className="text-violet-100 text-sm">
              Saldo disponível para movimentação
            </p>
          </div>

          {/* Botões de Ação - Estilo Banking */}
          <div className="flex gap-3">
            <button
              onClick={handleSolicitarInvestimento}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all border border-white/20 hover:border-white/40"
            >
              <Plus size={20} />
              Solicitar
            </button>

            <button
              onClick={() => setShowResgatarModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-violet-600 hover:bg-violet-50 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <DollarSign size={20} />
              Resgatar
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-violet-600" size={20} />
            <p className="text-gray-500 text-sm">Carteira Total</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            R${" "}
            {totalRecebido.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <p className="text-gray-500 text-sm">Variação Total</p>
          </div>
          <h2 className="text-2xl font-bold text-green-600">+{variacao}%</h2>
          <p className="text-sm text-gray-500">
            +R$ {variacaoValor.toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-blue-600" size={20} />
            <p className="text-gray-500 text-sm">Empréstimos</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {emprestimosAtivos.length}
          </h2>
          <p className="text-sm text-gray-500">ativos</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-purple-600" size={20} />
            <p className="text-gray-500 text-sm">Disponível</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            R$ {saldoDisponivel.toLocaleString("pt-BR")}
          </h2>
          <p className="text-sm text-gray-500">para resgate</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance vs Meta */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Histórico de Captação
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  dot={{ fill: "#7C3AED", r: 4 }}
                  fill="url(#colorUv)"
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alocação de Ativos */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Distribuição dos Empréstimos
          </h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPizza}
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                  paddingAngle={5}
                >
                  {dadosPizza.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR")}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {dadosPizza.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {(
                    (item.value /
                      emprestimosAtivos.reduce((acc, e) => acc + e.valor, 0)) *
                    100
                  ).toFixed(0)}
                  %
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Empréstimos Detalhados */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Empréstimos Detalhados
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                  Empresa
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                  Valor Total
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                  Valor Pago
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                  Taxa Juros
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                  Progresso
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                  Vencimento
                </th>
              </tr>
            </thead>
            <tbody>
              {emprestimos.map((emp) => {
                const progresso = (emp.pago / emp.valor) * 100;
                return (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-100 hover:bg-violet-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-800">
                        {emp.empresa}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          emp.status === "Ativo"
                            ? "bg-violet-100 text-violet-700"
                            : emp.status === "Quitado"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">
                      R$ {emp.valor.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      R$ {emp.pago.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{emp.juros}%</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-600 rounded-full transition-all"
                            style={{ width: `${progresso}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-12">
                          {progresso.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {emp.dataVencimento}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Resgatar */}
      {showResgatarModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowResgatarModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Resgatar Dinheiro
              </h3>
              <button
                onClick={() => setShowResgatarModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Saldo Disponível</p>
                <h2 className="text-4xl font-bold text-gray-800">
                  R$ {saldoDisponivel.toLocaleString("pt-BR")}
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dados Bancários
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Banco"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Agência"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Conta"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleResgatar}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <DollarSign size={20} />
                Confirmar Resgate
              </button>

              <p className="text-xs text-gray-500 text-center">
                O dinheiro será transferido em até 2 dias úteis
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
