"use client";

import React from "react";
import {
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  DollarSign,
  Store,
  Package,
  Truck,
  Coffee,
  Scissors,
  Users,
} from "lucide-react";

interface Investment {
  id: string;
  meiName: string;
  businessName: string;
  category: string;
  icon: React.ReactNode;
  type: "Empréstimo" | "Financiamento";
  investedAmount: number;
  currentValue: number;
  interestRate: number;
  duration: number;
  progress: number;
  returnPercentage: number;
  status: "Ativo" | "Finalizado" | "Em Andamento";
}

interface AllocationItem {
  category: string;
  percentage: number;
  color: string;
}

const MinhaCarteira = () => {
  const portfolioData = {
    totalEquity: 78900.0,
    totalReturn: 57.8,
    monthlyReturn: 4.2,
    monthlyDividends: 892.5,
    investedValue: 50000,
    investedChange: 12.5,
    volatility: 8.2,
    volatilityChange: 1.3,
    sharpeRatio: 1.85,
    sharpeChange: 0.15,
    diversification: "Alta",
    diversificationClasses: 5,
    activeInvestments: 8,
    completedInvestments: 3,
  };

  const investments: Investment[] = [
    {
      id: "1",
      meiName: "Maria Silva",
      businessName: "Cafeteria Aroma Bom",
      category: "Alimentação",
      icon: <Coffee className="w-5 h-5" />,
      type: "Empréstimo",
      investedAmount: 5000,
      currentValue: 5684,
      interestRate: 1.8,
      duration: 36,
      progress: 65,
      returnPercentage: 13.68,
      status: "Ativo",
    },
    {
      id: "2",
      meiName: "João Santos",
      businessName: "Loja de Roupas Fashion",
      category: "Varejo",
      icon: <Store className="w-5 h-5" />,
      type: "Financiamento",
      investedAmount: 8000,
      currentValue: 8847,
      interestRate: 1.5,
      duration: 48,
      progress: 42,
      returnPercentage: 10.59,
      status: "Ativo",
    },
    {
      id: "3",
      meiName: "Ana Costa",
      businessName: "Delivery Express",
      category: "Logística",
      icon: <Truck className="w-5 h-5" />,
      type: "Empréstimo",
      investedAmount: 6500,
      currentValue: 6945,
      interestRate: 1.2,
      duration: 24,
      progress: 88,
      returnPercentage: 6.85,
      status: "Ativo",
    },
    {
      id: "4",
      meiName: "Carlos Oliveira",
      businessName: "Salão Corte & Estilo",
      category: "Beleza",
      icon: <Scissors className="w-5 h-5" />,
      type: "Financiamento",
      investedAmount: 4500,
      currentValue: 4860,
      interestRate: 1.6,
      duration: 30,
      progress: 73,
      returnPercentage: 8.01,
      status: "Ativo",
    },
    {
      id: "5",
      meiName: "Paula Ferreira",
      businessName: "Empório Natural",
      category: "Alimentação",
      icon: <Package className="w-5 h-5" />,
      type: "Empréstimo",
      investedAmount: 3500,
      currentValue: 3640,
      interestRate: 1.4,
      duration: 18,
      progress: 56,
      returnPercentage: 4.0,
      status: "Ativo",
    },
  ];

  const allocation: AllocationItem[] = [
    { category: "Alimentação", percentage: 35, color: "#8b5cf6" },
    { category: "Varejo", percentage: 25, color: "#a78bfa" },
    { category: "Logística", percentage: 20, color: "#c4b5fd" },
    { category: "Beleza", percentage: 15, color: "#ddd6fe" },
    { category: "Outros", percentage: 5, color: "#ede9fe" },
  ];

  const performanceData = [
    { month: "Jan", value: 50000 },
    { month: "Fev", value: 51500 },
    { month: "Mar", value: 51200 },
    { month: "Abr", value: 53800 },
    { month: "Mai", value: 56200 },
    { month: "Jun", value: 59400 },
    { month: "Jul", value: 62100 },
    { month: "Ago", value: 65800 },
    { month: "Set", value: 69500 },
    { month: "Out", value: 73200 },
    { month: "Nov", value: 78900 },
  ];

  const totalInvestedValue = investments.reduce(
    (acc, inv) => acc + inv.investedAmount,
    0
  );
  const totalCurrentValue = investments.reduce(
    (acc, inv) => acc + inv.currentValue,
    0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-700";
      case "Finalizado":
        return "bg-blue-100 text-blue-700";
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Alimentação":
        return "bg-violet-100 text-violet-700 border-violet-200";
      case "Varejo":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Logística":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Beleza":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Minha Carteira
              </h1>
              <p className="text-gray-600">
                Acompanhe seus investimentos em MEIs e retornos
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-violet-100">
              <Users className="w-5 h-5 text-violet-600" />
              <div>
                <p className="text-xs text-gray-500">MEIs Apoiados</p>
                <p className="text-lg font-bold text-gray-900">
                  {investments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Stats Card */}
        <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 rounded-3xl p-8 mb-6 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Patrimônio Total
              </p>
              <p className="text-3xl font-bold">
                R${" "}
                {portfolioData.totalEquity.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Rentabilidade Total
              </p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">
                  +{portfolioData.totalReturn}%
                </p>
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Rentabilidade Mensal
              </p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">
                  +{portfolioData.monthlyReturn}%
                </p>
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Retornos Este Mês
              </p>
              <p className="text-3xl font-bold">
                R${" "}
                {portfolioData.monthlyDividends.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Valor Investido */}
          <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />+
                {portfolioData.investedChange}%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Valor Investido</p>
            <p className="text-2xl font-bold text-gray-900">
              R$ {portfolioData.investedValue.toLocaleString("pt-BR")}
            </p>
          </div>

          {/* Investimentos Ativos */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 text-sm font-semibold bg-purple-50 px-3 py-1 rounded-full">
                Ativos
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Investimentos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">
              {portfolioData.activeInvestments}
            </p>
          </div>

          {/* Sharpe Ratio */}
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />+{portfolioData.sharpeChange}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Índice de Retorno</p>
            <p className="text-2xl font-bold text-gray-900">
              {portfolioData.sharpeRatio}
            </p>
          </div>

          {/* Diversificação */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <PieChart className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />+
                {portfolioData.diversificationClasses} setores
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Diversificação</p>
            <p className="text-2xl font-bold text-gray-900">
              {portfolioData.diversification}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-violet-100 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              Evolução do Patrimônio
            </h3>
            <div className="relative h-64">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 250"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                <line
                  x1="0"
                  y1="200"
                  x2="800"
                  y2="200"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="150"
                  x2="800"
                  y2="150"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="100"
                  x2="800"
                  y2="100"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="50"
                  x2="800"
                  y2="50"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                {/* Area fill */}
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop
                      offset="100%"
                      stopColor="#a78bfa"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>

                <path
                  d={`M 0 ${
                    250 - performanceData[0].value / 800
                  } ${performanceData
                    .map(
                      (d, i) =>
                        `L ${(i * 800) / (performanceData.length - 1)} ${
                          250 - d.value / 800
                        }`
                    )
                    .join(" ")} L 800 250 L 0 250 Z`}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <path
                  d={`M 0 ${
                    250 - performanceData[0].value / 800
                  } ${performanceData
                    .map(
                      (d, i) =>
                        `L ${(i * 800) / (performanceData.length - 1)} ${
                          250 - d.value / 800
                        }`
                    )
                    .join(" ")}`}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                />
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {performanceData.map((d) => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
                <span>80k</span>
                <span>60k</span>
                <span>40k</span>
                <span>20k</span>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Allocation Donut Chart */}
          <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-violet-600" />
              Diversificação por Setor
            </h3>
            <div className="flex flex-col items-center justify-center mb-6">
              <svg width="180" height="180" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#ede9fe"
                  strokeWidth="40"
                />
                {allocation.map((item, index) => {
                  const prevPercentage = allocation
                    .slice(0, index)
                    .reduce((sum, i) => sum + i.percentage, 0);
                  const startAngle = (prevPercentage / 100) * 360 - 90;
                  const endAngle = startAngle + (item.percentage / 100) * 360;

                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = 100 + 80 * Math.cos(startRad);
                  const y1 = 100 + 80 * Math.sin(startRad);
                  const x2 = 100 + 80 * Math.cos(endRad);
                  const y2 = 100 + 80 * Math.sin(endRad);

                  const largeArc = item.percentage > 50 ? 1 : 0;

                  return (
                    <path
                      key={item.category}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={item.color}
                    />
                  );
                })}
                <circle cx="100" cy="100" r="50" fill="white" />
              </svg>
            </div>
            <div className="space-y-3">
              {allocation.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investments Table */}
        <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Store className="w-5 h-5 text-violet-600" />
            Meus Investimentos em MEIs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-violet-100">
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">
                    Negócio
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">
                    MEI
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">
                    Categoria
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">
                    Tipo
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700">
                    Investido
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700">
                    Valor Atual
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-gray-700">
                    Progresso
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700">
                    Retorno
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr
                    key={investment.id}
                    className="border-b border-gray-100 hover:bg-violet-50/50 transition-colors"
                  >
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getCategoryColor(
                            investment.category
                          )}`}
                        >
                          {investment.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {investment.businessName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {investment.interestRate}% a.m. •{" "}
                            {investment.duration} meses
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-sm text-gray-700 font-medium">
                      {investment.meiName}
                    </td>
                    <td className="py-5 px-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(
                          investment.category
                        )}`}
                      >
                        {investment.category}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-violet-100 text-violet-700 border border-violet-200">
                        {investment.type}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-sm text-gray-700 text-right font-medium">
                      R${" "}
                      {investment.investedAmount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-5 px-4 text-sm font-bold text-gray-900 text-right">
                      R${" "}
                      {investment.currentValue.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${investment.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-violet-600">
                          {investment.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <span className="text-sm font-bold text-green-600 flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4" />+
                        {investment.returnPercentage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          investment.status
                        )}`}
                      >
                        {investment.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gradient-to-r from-violet-50 to-purple-50 font-bold">
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-right text-sm text-gray-900"
                  >
                    Totais:
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 text-right">
                    R${" "}
                    {totalInvestedValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 text-right font-bold">
                    R${" "}
                    {totalCurrentValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            Análise de Risco e Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2 font-semibold">
                Taxa de Sucesso
              </p>
              <p className="text-4xl font-bold text-blue-900 mb-1">96.5%</p>
              <p className="text-xs text-blue-600">MEIs pagando em dia</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-green-700 mb-2 font-semibold">
                Retorno Médio
              </p>
              <p className="text-4xl font-bold text-green-900 mb-1">+8.6%</p>
              <p className="text-xs text-green-600">Acima do CDI</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <p className="text-sm text-purple-700 mb-2 font-semibold">
                Risco Médio
              </p>
              <p className="text-4xl font-bold text-purple-900 mb-1">Baixo</p>
              <p className="text-xs text-purple-600">Carteira diversificada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaCarteira;
