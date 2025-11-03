"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  FileText,
  Wallet,
  Bell,
  User,
  CheckCircle,
  AlertCircle,
  Calculator,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function DashboardMEI() {
  const [user] = useState({ nome: "Ana Souza", tipo: "Cliente Premium" });

  const mockData = {
    resumo: {
      saldoDisponivel: 2780.5,
      saldoDevedor: 34729.16,
      pagamentoMensal: 1820,
      totalPago: 21630,
      contratosAtivos: 2,
    },
    emprestimosAtivos: [
      {
        id: 1,
        nome: "Capital de Giro",
        status: "Ativo",
        valorEmprestado: 20000,
        valorRestante: 13000,
        progresso: 35,
        parcelas: "10/24",
        parcelaMensal: 650,
        taxaJuros: "1.2% a.m.",
        proximoVencimento: "14/11/2025",
      },
      {
        id: 2,
        nome: "Compra de Maquinário",
        status: "Em Atraso",
        valorEmprestado: 30000,
        valorRestante: 18000,
        progresso: 40,
        parcelas: "12/36",
        parcelaMensal: 890,
        taxaJuros: "1.4% a.m.",
        proximoVencimento: "19/11/2025",
      },
    ],
    emprestimosFinalizados: [
      {
        id: 3,
        nome: "Compra de Estoque",
        status: "Quitado",
        valorEmprestado: 10000,
        valorPago: 10000,
        progresso: 100,
        parcelas: "24/24",
        taxaJuros: "1.5% a.m.",
      },
    ],
    graficos: {
      distribuicao: [
        { name: "Compra de Estoque", value: 40 },
        { name: "Compra de Maquinário", value: 30 },
        { name: "Capital de Giro", value: 30 },
      ],
      historicoPagamentos: [
        { mes: "Mai", valor: 1200 },
        { mes: "Jun", valor: 1500 },
        { mes: "Jul", valor: 1800 },
        { mes: "Ago", valor: 1900 },
        { mes: "Set", valor: 2000 },
        { mes: "Out", valor: 2200 },
      ],
      comparativo: [
        { nome: "Compra de Estoque", emprestado: 20000, pago: 7000 },
        { nome: "Compra de Maquinário", emprestado: 30000, pago: 12000 },
        { nome: "Capital de Giro", emprestado: 10000, pago: 10000 },
      ],
    },
  };

  const COLORS = ["#7C3AED", "#22C55E", "#F97316"];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

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
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-violet-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Painel do MEI</h1>
          <p className="text-sm text-violet-600">
            Acompanhe seus empréstimos e saldo financeiro
          </p>
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
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 w-full max-w-7xl mx-auto box-border">
        {/* Resumo */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {/* Cards */}
          {[
            {
              label: "Saldo disponível",
              value: mockData.resumo.saldoDisponivel,
              icon: <Wallet className="w-5 h-5 text-green-500" />,
              color: "text-green-600",
            },
            {
              label: "Saldo devedor",
              value: mockData.resumo.saldoDevedor,
              icon: <TrendingDown className="w-5 h-5 text-red-500" />,
              color: "text-red-600",
            },
            {
              label: "Pagamento mensal",
              value: mockData.resumo.pagamentoMensal,
              icon: <Calendar className="w-5 h-5 text-violet-500" />,
              color: "text-violet-700",
            },
            {
              label: "Total pago",
              value: mockData.resumo.totalPago,
              icon: <TrendingUp className="w-5 h-5 text-green-500" />,
              color: "text-green-700",
            },
            {
              label: "Contratos ativos",
              value: mockData.resumo.contratosAtivos,
              icon: <FileText className="w-5 h-5 text-violet-500" />,
              color: "text-violet-700",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between mb-2">
                <p className="text-sm text-violet-600 font-medium">
                  {card.label}
                </p>
                {card.icon}
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>
                {card.label === "Contratos ativos"
                  ? String(card.value)
                  : formatCurrency(card.value)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Botão de Resgate */}
        <div className="mb-10 flex justify-end">
          <button className="bg-gradient-to-r from-violet-600 to-violet-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-all">
            Resgatar Saldo
          </button>
        </div>

        {/* Empréstimos Ativos */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 mb-8"
        >
          <h2 className="text-xl font-bold text-violet-900 mb-6">
            Empréstimos Ativos
          </h2>
          <div className="space-y-5">
            {mockData.emprestimosAtivos.map((emp) => (
              <div
                key={emp.id}
                className="border border-violet-100 rounded-xl p-5 hover:shadow-lg hover:shadow-violet-100 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {emp.status === "Ativo" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <h3 className="font-semibold text-violet-900">
                        {emp.nome}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          emp.status === "Ativo"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-violet-900 text-lg">
                      {formatCurrency(emp.valorRestante)}
                    </p>
                    <p className="text-xs text-violet-600">Restante</p>
                  </div>
                </div>

                <div className="w-full bg-violet-100 h-2.5 rounded-full mb-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${emp.progresso}%` }}
                    transition={{ duration: 1 }}
                    className={`h-2.5 rounded-full ${
                      emp.status === "Ativo"
                        ? "bg-gradient-to-r from-violet-500 to-violet-600"
                        : "bg-red-500"
                    }`}
                  ></motion.div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-violet-600">Parcelas</p>
                    <p className="font-semibold text-violet-900">
                      {emp.parcelas}
                    </p>
                  </div>
                  <div>
                    <p className="text-violet-600">Parcela Mensal</p>
                    <p className="font-semibold text-violet-900">
                      {formatCurrency(emp.parcelaMensal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-violet-600">Taxa</p>
                    <p className="font-semibold text-green-600">
                      {emp.taxaJuros}
                    </p>
                  </div>
                  <div>
                    <p className="text-violet-600">Próx. Vencimento</p>
                    <p className="font-semibold text-violet-900">
                      {emp.proximoVencimento}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gráficos */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Distribuição */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-4">
              Distribuição dos Empréstimos
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockData.graficos.distribuicao}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {mockData.graficos.distribuicao.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-4">
              Histórico de Pagamentos
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockData.graficos.historicoPagamentos}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#7C3AED"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Comparativo */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-4">
              Comparativo: Emprestado x Pago
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockData.graficos.comparativo}>
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="emprestado" fill="#7C3AED" />
                <Bar dataKey="pago" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button className="bg-violet-700 hover:bg-violet-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg">
            <Calculator className="w-5 h-5" />
            Simular Empréstimo
          </button>
          <button className="bg-white hover:bg-violet-50 text-violet-900 font-semibold py-4 rounded-xl border-2 border-violet-200 flex items-center justify-center gap-2 shadow-lg">
            <TrendingUp className="w-5 h-5" />
            Antecipar Parcela
          </button>
          <button className="bg-white hover:bg-violet-50 text-violet-900 font-semibold py-4 rounded-xl border-2 border-violet-200 flex items-center justify-center gap-2 shadow-lg">
            <TrendingDown className="w-5 h-5" />
            Quitar Empréstimo
          </button>
        </div>
      </div>
    </div>
  );
}
