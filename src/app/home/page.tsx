"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar";
import {
  TrendingDown,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Calculator,
  ChevronRight,
  Bell,
  User,
  Menu,
} from "lucide-react";

// Mock Data
const mockData = {
  summary: {
    saldoDevedor: 34729167,
    pagamentoMensal: 1820,
    totalPago: 21630,
    contratosAtivos: 2,
  },
  emprestimosAtivos: [
    {
      id: 1,
      nome: "Empréstimo Pessoal",
      status: "Ativo",
      valorRestante: 10000,
      progresso: 33,
      parcelas: "8/24",
      parcelaMensal: 650,
      taxaJuros: "1.5% a.m.",
      proximoVencimento: "14/11/2025",
    },
    {
      id: 2,
      nome: "Financiamento Veículo",
      status: "Ativo",
      valorRestante: 24062.5,
      progresso: 31,
      parcelas: "15/48",
      parcelaMensal: 890,
      taxaJuros: "1.2% a.m.",
      proximoVencimento: "19/11/2025",
    },
    {
      id: 3,
      nome: "Crédito Consignado",
      status: "Em Atraso",
      valorRestante: 10000,
      progresso: 33,
      parcelas: "8/24",
      parcelaMensal: 280,
      taxaJuros: "0.9% a.m.",
      proximoVencimento: "24/10/2025",
    },
  ],
  novasOpcoes: [
    {
      id: 1,
      nome: "Empréstimo Pessoal",
      descricao: "Crédito rápido para suas necessidades pessoais",
      valor: "R$ 1.000 - R$ 50.000",
      taxa: "1.8% a.m.",
      prazo: "36 meses",
    },
    {
      id: 2,
      nome: "Crédito Consignado",
      descricao: "Taxas reduzidas com desconto em folha",
      valor: "R$ 2.000 - R$ 100.000",
      taxa: "1.2% a.m.",
      prazo: "84 meses",
    },
    {
      id: 3,
      nome: "Financiamento Imobiliário",
      descricao: "Realize o sonho da casa própria",
      valor: "R$ 50.000 - R$ 800.000",
      taxa: "0.8% a.m.",
      prazo: "420 meses",
    },
    {
      id: 4,
      nome: "Capital de Giro",
      descricao: "Para impulsionar seu negócio",
      valor: "R$ 5.000 - R$ 200.000",
      taxa: "2.1% a.m.",
      prazo: "18 meses",
    },
  ],
};

export default function HomePage() {
  const [user] = useState({ nome: "Ana Souza", tipo: "Cliente Premium" });
  const [activeRoute, setActiveRoute] = useState("emprestimos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-violet-50">
      {/* Sidebar - FIXO */}
      <Sidebar
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content - SÓ ELE ROLA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - FIXO */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-violet-100 shadow-sm flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-violet-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-violet-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-violet-900">
                    Empréstimos
                  </h1>
                  <p className="text-sm text-violet-600 hidden sm:block">
                    Gerencie seus empréstimos e solicite novos créditos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-violet-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5 text-violet-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2 bg-violet-100 px-4 py-2 rounded-full">
                  <User className="w-5 h-5 text-violet-600" />
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-violet-900">
                      {user.nome}
                    </p>
                    <p className="text-xs text-violet-600">{user.tipo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content - SÓ ESSA PARTE ROLA */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Summary Cards */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <motion.div
                variants={item}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-violet-100 border border-violet-100 hover:shadow-xl hover:shadow-violet-200 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-violet-600 font-medium">
                    Saldo Devedor
                  </p>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-red-600 mb-1">
                  {formatCurrency(mockData.summary.saldoDevedor)}
                </p>
                <p className="text-xs text-violet-500">Total pendente</p>
              </motion.div>

              <motion.div
                variants={item}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-violet-100 border border-violet-100 hover:shadow-xl hover:shadow-violet-200 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-violet-600 font-medium">
                    Pagamento Mensal
                  </p>
                  <Calendar className="w-5 h-5 text-violet-500" />
                </div>
                <p className="text-3xl font-bold text-violet-900 mb-1">
                  {formatCurrency(mockData.summary.pagamentoMensal)}
                </p>
                <p className="text-xs text-violet-500">Soma das parcelas</p>
              </motion.div>

              <motion.div
                variants={item}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-violet-100 border border-violet-100 hover:shadow-xl hover:shadow-violet-200 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-violet-600 font-medium">
                    Total Pago
                  </p>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {formatCurrency(mockData.summary.totalPago)}
                </p>
                <p className="text-xs text-violet-500">Até o momento</p>
              </motion.div>

              <motion.div
                variants={item}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-violet-100 border border-violet-100 hover:shadow-xl hover:shadow-violet-200 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-violet-600 font-medium">
                    Contratos Ativos
                  </p>
                  <FileText className="w-5 h-5 text-violet-500" />
                </div>
                <p className="text-3xl font-bold text-violet-900 mb-1">
                  {mockData.summary.contratosAtivos}
                </p>
                <p className="text-xs text-violet-500">Em andamento</p>
              </motion.div>
            </motion.div>

            {/* Active Loans */}
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="bg-white rounded-2xl p-6 shadow-lg shadow-violet-100 border border-violet-100 mb-8"
            >
              <h2 className="text-xl font-bold text-violet-900 mb-6">
                Empréstimos Ativos
              </h2>

              <div className="space-y-4">
                {mockData.emprestimosAtivos.map((emprestimo) => (
                  <div
                    key={emprestimo.id}
                    className="border border-violet-100 rounded-xl p-5 hover:border-violet-300 transition-all hover:shadow-lg hover:shadow-violet-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {emprestimo.status === "Ativo" ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="font-semibold text-violet-900">
                            {emprestimo.nome}
                          </h3>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              emprestimo.status === "Ativo"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {emprestimo.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-violet-900">
                          {formatCurrency(emprestimo.valorRestante)}
                        </p>
                        <p className="text-xs text-violet-600">restante</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-violet-600">
                          Progresso do pagamento
                        </p>
                        <p className="text-sm font-semibold text-violet-900">
                          {emprestimo.parcelas} parcelas
                        </p>
                      </div>
                      <div className="w-full bg-violet-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${emprestimo.progresso}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-2.5 rounded-full ${
                            emprestimo.status === "Ativo"
                              ? "bg-gradient-to-r from-violet-500 to-violet-600"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-violet-600 mb-1">Parcela mensal</p>
                        <p className="font-semibold text-violet-900">
                          {formatCurrency(emprestimo.parcelaMensal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-violet-600 mb-1">Taxa de juros</p>
                        <p className="font-semibold text-green-600">
                          {emprestimo.taxaJuros}
                        </p>
                      </div>
                      <div>
                        <p className="text-violet-600 mb-1">
                          Próximo vencimento
                        </p>
                        <p className="font-semibold text-violet-900">
                          {emprestimo.proximoVencimento}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* New Loan Options */}
            <motion.div variants={item} initial="hidden" animate="show">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-violet-900">
                    Solicite Novos Empréstimos
                  </h2>
                  <p className="text-sm text-violet-600 mt-1">
                    Encontre as melhores taxas do mercado
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {mockData.novasOpcoes.map((opcao) => (
                  <div
                    key={opcao.id}
                    className="bg-white rounded-2xl p-6 shadow-lg shadow-violet-100 border border-violet-100 hover:shadow-xl hover:shadow-violet-200 hover:border-violet-300 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-violet-900 text-lg mb-1">
                          {opcao.nome}
                        </h3>
                        <p className="text-sm text-violet-600">
                          {opcao.descricao}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-violet-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-violet-600">Valor</span>
                        <span className="font-semibold text-violet-900">
                          {opcao.valor}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-violet-600">Taxa</span>
                        <span className="font-semibold text-green-600">
                          {opcao.taxa}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-violet-600">Prazo máximo</span>
                        <span className="font-semibold text-violet-900">
                          {opcao.prazo}
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all transform group-hover:scale-[1.02] shadow-lg shadow-red-500/20">
                      Solicitar Empréstimo
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="bg-violet-900 hover:bg-violet-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-violet-900/20">
                  <Calculator className="w-5 h-5" />
                  Simular Empréstimo
                </button>
                <button className="bg-white hover:bg-violet-50 text-violet-900 font-semibold py-4 rounded-xl border-2 border-violet-200 flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-100">
                  <TrendingUp className="w-5 h-5" />
                  Antecipar Parcela
                </button>
                <button className="bg-white hover:bg-violet-50 text-violet-900 font-semibold py-4 rounded-xl border-2 border-violet-200 flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-100">
                  <TrendingDown className="w-5 h-5" />
                  Quitar Empréstimo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
