"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Search,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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

interface Transacao {
  id: number;
  tipo: "entrada" | "saida";
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  status: "Concluído" | "Pendente" | "Cancelado";
  empresa?: string;
}

const transacoes: Transacao[] = [
  {
    id: 1,
    tipo: "entrada",
    descricao: "Empréstimo recebido",
    categoria: "Empréstimo",
    valor: 5000,
    data: "2025-11-08",
    status: "Concluído",
    empresa: "Cafeteria Aroma Bom",
  },
  {
    id: 2,
    tipo: "saida",
    descricao: "Resgate para conta bancária",
    categoria: "Resgate",
    valor: 3000,
    data: "2025-11-07",
    status: "Concluído",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Pagamento de parcela",
    categoria: "Pagamento",
    valor: 1200,
    data: "2025-11-05",
    status: "Concluído",
    empresa: "Restaurante Sabor & Cia",
  },
  {
    id: 4,
    tipo: "entrada",
    descricao: "Empréstimo recebido",
    categoria: "Empréstimo",
    valor: 6000,
    data: "2025-11-03",
    status: "Concluído",
    empresa: "Oficina AutoPro",
  },
  {
    id: 5,
    tipo: "saida",
    descricao: "Resgate para conta bancária",
    categoria: "Resgate",
    valor: 2500,
    data: "2025-11-01",
    status: "Concluído",
  },
  {
    id: 6,
    tipo: "entrada",
    descricao: "Pagamento de parcela",
    categoria: "Pagamento",
    valor: 1500,
    data: "2025-10-28",
    status: "Concluído",
    empresa: "Cafeteria Aroma Bom",
  },
  {
    id: 7,
    tipo: "entrada",
    descricao: "Empréstimo recebido",
    categoria: "Empréstimo",
    valor: 8000,
    data: "2025-10-25",
    status: "Concluído",
    empresa: "Loja Fashion Style",
  },
  {
    id: 8,
    tipo: "entrada",
    descricao: "Pagamento de parcela",
    categoria: "Pagamento",
    valor: 800,
    data: "2025-10-20",
    status: "Pendente",
    empresa: "Oficina AutoPro",
  },
  {
    id: 9,
    tipo: "saida",
    descricao: "Resgate para conta bancária",
    categoria: "Resgate",
    valor: 4000,
    data: "2025-10-15",
    status: "Concluído",
  },
  {
    id: 10,
    tipo: "entrada",
    descricao: "Empréstimo recebido",
    categoria: "Empréstimo",
    valor: 7500,
    data: "2025-10-10",
    status: "Concluído",
    empresa: "Restaurante Sabor & Cia",
  },
];

const fluxoMensal = [
  { mes: "Mai", entradas: 8000, saidas: 0 },
  { mes: "Jun", entradas: 6500, saidas: 1500 },
  { mes: "Jul", entradas: 8000, saidas: 2000 },
  { mes: "Ago", entradas: 9500, saidas: 2000 },
  { mes: "Set", entradas: 3000, saidas: 3500 },
  { mes: "Out", entradas: 17300, saidas: 6500 },
  { mes: "Nov", entradas: 7200, saidas: 5500 },
];

const historicoSaldo = [
  { mes: "Mai", saldo: 8000 },
  { mes: "Jun", saldo: 13000 },
  { mes: "Jul", saldo: 19000 },
  { mes: "Ago", saldo: 26500 },
  { mes: "Set", saldo: 26000 },
  { mes: "Out", saldo: 36800 },
  { mes: "Nov", saldo: 38500 },
];

export default function ExtratoMEI() {
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">(
    "todos"
  );
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | Transacao["status"]
  >("todos");
  const [busca, setBusca] = useState<string>("");
  const [periodo, setPeriodo] = useState<"7" | "30" | "90" | "365">("30");

  const totalEntradas = transacoes
    .filter((t) => t.tipo === "entrada" && t.status === "Concluído")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoes
    .filter((t) => t.tipo === "saida" && t.status === "Concluído")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoAtual = totalEntradas - totalSaidas;

  const transacoesFiltradas = transacoes.filter((t) => {
    const matchTipo = filtroTipo === "todos" || t.tipo === filtroTipo;
    const matchStatus = filtroStatus === "todos" || t.status === filtroStatus;
    const matchBusca =
      busca === "" ||
      t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      t.empresa?.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchStatus && matchBusca;
  });

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#6B21A8" }}>
            Extrato Completo
          </h1>
          <p className="text-gray-500">
            Acompanhe todas as suas movimentações financeiras
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
            <p className="text-gray-500 text-sm mb-2">Saldo Atual</p>
            <h2 className="text-3xl font-bold text-gray-800">
              R$ {saldoAtual.toLocaleString("pt-BR")}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-2xl">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Total de Entradas</p>
            <h2 className="text-3xl font-bold text-green-600">
              R$ {totalEntradas.toLocaleString("pt-BR")}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-100 rounded-2xl">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Total de Saídas</p>
            <h2 className="text-3xl font-bold text-red-600">
              R$ {totalSaidas.toLocaleString("pt-BR")}
            </h2>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fluxo de Caixa */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Fluxo de Caixa Mensal
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fluxoMensal}>
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
                  <Bar
                    dataKey="entradas"
                    fill="#10B981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar dataKey="saidas" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evolução do Saldo */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Evolução do Saldo
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicoSaldo}>
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
                    dataKey="saldo"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ fill: "#7C3AED", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Todas as Transações
            </h3>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Busca */}
              <div className="relative flex-1 lg:flex-initial lg:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar transação..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Filtro Tipo */}
              <select
                value={filtroTipo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFiltroTipo(e.target.value as "todos" | "entrada" | "saida")
                }
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition-all text-sm font-medium text-gray-700 appearance-none"
              >
                <option value="todos">Todos os tipos</option>
                <option value="entrada">Entradas</option>
                <option value="saida">Saídas</option>
              </select>

              {/* Filtro Status */}
              <select
                value={filtroStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFiltroStatus(
                    e.target.value as "todos" | Transacao["status"]
                  )
                }
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition-all text-sm font-medium text-gray-700 appearance-none"
              >
                <option value="todos">Todos os status</option>
                <option value="Concluído">Concluído</option>
                <option value="Pendente">Pendente</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              {/* Período */}
              <select
                value={periodo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPeriodo(e.target.value as "7" | "30" | "90" | "365")
                }
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition-all text-sm font-medium text-gray-700 appearance-none"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>

              {/* Botão Exportar */}
              <button className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all text-sm shadow-md hover:shadow-lg">
                <Download size={18} />
                Exportar
              </button>
            </div>
          </div>

          {/* Lista de Transações */}
          <div className="space-y-3">
            {transacoesFiltradas.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
                  <AlertCircle className="text-violet-600" size={32} />
                </div>
                <p className="text-gray-500 font-medium">
                  Nenhuma transação encontrada
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Tente ajustar os filtros
                </p>
              </div>
            ) : (
              transacoesFiltradas.map((transacao) => (
                <div
                  key={transacao.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white hover:from-violet-50 hover:to-white rounded-2xl transition-all cursor-pointer border border-gray-100 hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Ícone */}
                    <div
                      className={`p-3 rounded-xl shadow-sm ${
                        transacao.tipo === "entrada"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transacao.tipo === "entrada" ? (
                        <ArrowDownRight className="text-green-600" size={24} />
                      ) : (
                        <ArrowUpRight className="text-red-600" size={24} />
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {transacao.descricao}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {transacao.empresa || transacao.categoria}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {formatarData(transacao.data)}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                        transacao.status === "Concluído"
                          ? "bg-green-100 text-green-700"
                          : transacao.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transacao.status}
                    </span>
                  </div>

                  {/* Valor */}
                  <div className="text-right ml-6">
                    <p
                      className={`text-xl font-bold ${
                        transacao.tipo === "entrada"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transacao.tipo === "entrada" ? "+" : "-"}R${" "}
                      {transacao.valor.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginação */}
          {transacoesFiltradas.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 font-medium">
                Mostrando{" "}
                <span className="font-bold text-violet-600">
                  {transacoesFiltradas.length}
                </span>{" "}
                de <span className="font-bold">{transacoes.length}</span>{" "}
                transações
              </p>
              <div className="flex gap-2">
                <button className="px-5 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl transition-all font-semibold text-gray-700 text-sm">
                  Anterior
                </button>
                <button className="px-5 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all font-semibold text-sm shadow-md">
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
