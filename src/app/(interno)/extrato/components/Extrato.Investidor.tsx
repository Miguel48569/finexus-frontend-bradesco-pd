import React, { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InvestorStatement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos os tipos");
  const [statusFilter, setStatusFilter] = useState("Todos os status");
  const [periodFilter, setPeriodFilter] = useState("Últimos 30 dias");

  // Dados mockados para o fluxo mensal
  const cashFlowData = [
    { month: "Mai", investimentos: 8000, retornos: 0 },
    { month: "Jun", investimentos: 1500, retornos: 800 },
    { month: "Jul", investimentos: 8000, retornos: 2100 },
    { month: "Ago", investimentos: 9500, retornos: 2400 },
    { month: "Set", investimentos: 3000, retornos: 3500 },
    { month: "Out", investimentos: 18000, retornos: 6800 },
    { month: "Nov", investimentos: 7500, retornos: 5200 },
  ];

  // Dados mockados para evolução do portfólio
  const portfolioData = [
    { month: "Mai", value: 8000 },
    { month: "Jun", value: 13500 },
    { month: "Jul", value: 19400 },
    { month: "Ago", value: 27900 },
    { month: "Set", value: 37200 },
    { month: "Out", value: 48400 },
    { month: "Nov", value: 58500 },
  ];

  // Transações mockadas
  const transactions = [
    {
      id: 1,
      type: "investment",
      title: "Investimento realizado",
      description: "Cafeteria Aroma Bom",
      date: "07 de nov. de 2025",
      amount: -5000,
      status: "Concluído",
    },
    {
      id: 2,
      type: "return",
      title: "Retorno recebido",
      description: "Loja Fashion Style",
      date: "06 de nov. de 2025",
      amount: 3200,
      status: "Concluído",
    },
    {
      id: 3,
      type: "investment",
      title: "Investimento realizado",
      description: "Salão Beleza Total",
      date: "04 de nov. de 2025",
      amount: -2000,
      status: "Concluído",
    },
    {
      id: 4,
      type: "return",
      title: "Retorno recebido",
      description: "Oficina AutoPro",
      date: "02 de nov. de 2025",
      amount: 6500,
      status: "Concluído",
    },
    {
      id: 5,
      type: "investment",
      title: "Investimento realizado",
      description: "Restaurante Sabor & Cia",
      date: "31 de out. de 2025",
      amount: -8000,
      status: "Concluído",
    },
    {
      id: 6,
      type: "return",
      title: "Retorno recebido",
      description: "Cafeteria Aroma Bom",
      date: "27 de out. de 2025",
      amount: 1500,
      status: "Concluído",
    },
    {
      id: 7,
      type: "investment",
      title: "Investimento realizado",
      description: "Pet Shop Amigo Fiel",
      date: "25 de out. de 2025",
      amount: -3500,
      status: "Concluído",
    },
    {
      id: 8,
      type: "return",
      title: "Retorno recebido",
      description: "Loja Fashion Style",
      date: "20 de out. de 2025",
      amount: 8000,
      status: "Concluído",
    },
  ];

  const filteredTransactions = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#6B21A8" }}>
            Extrato Completo
          </h1>
          <p className="text-gray-500">
            Acompanhe todos os seus investimentos e retornos
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-violet-100 rounded-2xl">
                <DollarSign className="text-violet-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Portfólio Total</p>
            <h2 className="text-3xl font-bold text-gray-800">R$ 58.500</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-2xl">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Total Investido</p>
            <h2 className="text-3xl font-bold text-blue-600">R$ 55.500</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-100 rounded-2xl">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Total em Retornos</p>
            <h2 className="text-3xl font-bold text-green-600">R$ 28.400</h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fluxo Mensal */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Fluxo Mensal
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="investimentos"
                    fill="#10B981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="retornos"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evolução do Portfólio */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Evolução do Portfólio
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
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
                    dataKey="value"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ fill: "#7C3AED", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transações */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Todas as Transações
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
              <Download size={18} />
              Exportar
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto mb-6">
            <input
              type="text"
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
            >
              <option>Todos os tipos</option>
              <option>Investimentos</option>
              <option>Retornos</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
            >
              <option>Todos os status</option>
              <option>Concluído</option>
              <option>Pendente</option>
            </select>

            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
            >
              <option>Últimos 30 dias</option>
              <option>Últimos 60 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>

          {/* Lista de Transações */}
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white hover:from-violet-50 hover:to-white rounded-2xl transition-all cursor-pointer border border-gray-100 hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-3 rounded-xl shadow-sm ${
                      transaction.type === "investment"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    {transaction.type === "investment" ? (
                      <TrendingUp className="text-blue-600" size={24} />
                    ) : (
                      <TrendingDown className="text-green-600" size={24} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">
                      {transaction.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {transaction.description}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {transaction.date}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                      transaction.status === "Concluído"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>

                <div className="text-right ml-6">
                  <p
                    className={`text-xl font-bold ${
                      transaction.amount > 0
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}R${" "}
                    {Math.abs(transaction.amount).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
