"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Store,
  Target,
} from "lucide-react";

type RiskLevel = "Muito Baixo" | "Baixo" | "Médio" | "Alto";

interface Opportunity {
  id: number;
  meiName: string;
  businessName: string;
  description: string;
  totalValue: number;
  currentValue: number;
  progress: number;
  interestRate: number;
  duration: number;
  minInvestment: number;
  risk: RiskLevel;
  type: string;
  category: string;
  investors: number;
  daysLeft: number;
}

const Marketplace = () => {
  const [selectedRisk, setSelectedRisk] = useState("Todos os riscos");
  const [selectedValue, setSelectedValue] = useState("Todos os valores");
  const [selectedRate, setSelectedRate] = useState("Todas as taxas");
  const [showRiskDropdown, setShowRiskDropdown] = useState(false);
  const [showValueDropdown, setShowValueDropdown] = useState(false);
  const [showRateDropdown, setShowRateDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const riskOptions = [
    "Todos os riscos",
    "Muito Baixo",
    "Baixo",
    "Médio",
    "Alto",
  ];
  const valueOptions = [
    "Todos os valores",
    "Até R$ 50.000",
    "R$ 50.000 - R$ 100.000",
    "Acima de R$ 100.000",
  ];
  const rateOptions = ["Todas as taxas", "Até 1%", "1% - 2%", "Acima de 2%"];

  const opportunities: Opportunity[] = [
    {
      id: 1,
      meiName: "Maria Silva",
      businessName: "Cafeteria Aroma Bom",
      description:
        "Expansão da cafeteria com novos equipamentos e área externa",
      totalValue: 50000.0,
      currentValue: 32500.0,
      progress: 65,
      interestRate: 1.8,
      duration: 36,
      minInvestment: 1000.0,
      risk: "Baixo",
      type: "Empréstimo",
      category: "Alimentação",
      investors: 12,
      daysLeft: 15,
    },
    {
      id: 2,
      meiName: "João Santos",
      businessName: "Loja Fashion Style",
      description: "Ampliação do estoque para a temporada de verão",
      totalValue: 120000.0,
      currentValue: 50400.0,
      progress: 42,
      interestRate: 1.2,
      duration: 84,
      minInvestment: 5000.0,
      risk: "Baixo",
      type: "Financiamento",
      category: "Varejo",
      investors: 8,
      daysLeft: 22,
    },
    {
      id: 3,
      meiName: "Carlos Oliveira",
      businessName: "Salão Beleza Total",
      description: "Reforma completa e aquisição de novos equipamentos",
      totalValue: 80000.0,
      currentValue: 70400.0,
      progress: 88,
      interestRate: 1.5,
      duration: 84,
      minInvestment: 2000.0,
      risk: "Muito Baixo",
      type: "Empréstimo",
      category: "Beleza",
      investors: 18,
      daysLeft: 5,
    },
    {
      id: 4,
      meiName: "Ana Costa",
      businessName: "Delivery Express",
      description: "Compra de veículos para expandir área de entregas",
      totalValue: 150000.0,
      currentValue: 34500.0,
      progress: 23,
      interestRate: 0.8,
      duration: 420,
      minInvestment: 10000.0,
      risk: "Médio",
      type: "Financiamento",
      category: "Logística",
      investors: 5,
      daysLeft: 30,
    },
    {
      id: 5,
      meiName: "Paula Ferreira",
      businessName: "Empório Natural",
      description: "Abertura de nova unidade e expansão da linha de produtos",
      totalValue: 90000.0,
      currentValue: 45000.0,
      progress: 50,
      interestRate: 1.6,
      duration: 48,
      minInvestment: 3000.0,
      risk: "Baixo",
      type: "Empréstimo",
      category: "Alimentação",
      investors: 10,
      daysLeft: 18,
    },
    {
      id: 6,
      meiName: "Roberto Lima",
      businessName: "TechFix Assistência",
      description: "Compra de equipamentos de diagnóstico e ferramentas",
      totalValue: 60000.0,
      currentValue: 54000.0,
      progress: 90,
      interestRate: 1.4,
      duration: 36,
      minInvestment: 2500.0,
      risk: "Muito Baixo",
      type: "Financiamento",
      category: "Serviços",
      investors: 15,
      daysLeft: 3,
    },
  ];

  const getRiskColor = (risk: RiskLevel): string => {
    switch (risk) {
      case "Muito Baixo":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Baixo":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Médio":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Alto":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return "#10b981";
    if (progress >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Alimentação":
        return "bg-violet-100 text-violet-700";
      case "Varejo":
        return "bg-purple-100 text-purple-700";
      case "Logística":
        return "bg-indigo-100 text-indigo-700";
      case "Beleza":
        return "bg-pink-100 text-pink-700";
      case "Serviços":
        return "bg-cyan-100 text-cyan-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filter opportunities based on search query
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      searchQuery === "" ||
      opp.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.meiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    totalOpportunities: filteredOpportunities.length,
    totalValue: filteredOpportunities.reduce(
      (sum, opp) => sum + opp.totalValue,
      0
    ),
    avgReturn: 1.4,
    activeInvestors: 68,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Marketplace
              </h1>
              <p className="text-gray-600">
                Explore oportunidades de investimento e diversifique sua
                carteira
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-violet-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Oportunidades</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOpportunities}
                  </p>
                </div>
                <div className="bg-violet-100 p-3 rounded-lg">
                  <Store className="w-5 h-5 text-violet-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Volume Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {(stats.totalValue / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Retorno Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgReturn}% a.m.
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-pink-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Investidores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeInvestors}
                  </p>
                </div>
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar oportunidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white shadow-sm transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Risk Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRiskDropdown(!showRiskDropdown);
                setShowValueDropdown(false);
                setShowRateDropdown(false);
              }}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-violet-500 transition-all shadow-sm"
            >
              <span className="text-gray-700 font-medium">{selectedRisk}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
            {showRiskDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                {riskOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedRisk(option);
                      setShowRiskDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-violet-50 transition-colors font-medium text-gray-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Value Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowValueDropdown(!showValueDropdown);
                setShowRiskDropdown(false);
                setShowRateDropdown(false);
              }}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-violet-500 transition-all shadow-sm"
            >
              <span className="text-gray-700 font-medium">{selectedValue}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
            {showValueDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                {valueOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedValue(option);
                      setShowValueDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-violet-50 transition-colors font-medium text-gray-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rate Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRateDropdown(!showRateDropdown);
                setShowRiskDropdown(false);
                setShowValueDropdown(false);
              }}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-violet-500 transition-all shadow-sm"
            >
              <span className="text-gray-700 font-medium">{selectedRate}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
            {showRateDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                {rateOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedRate(option);
                      setShowRateDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-violet-50 transition-colors font-medium text-gray-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 inline-block">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Nenhuma oportunidade encontrada
                </h3>
                <p className="text-sm text-gray-600">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
              </div>
            </div>
          ) : (
            filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all hover:scale-105 border border-gray-100 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColor(
                          opportunity.category
                        )}`}
                      >
                        {opportunity.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRiskColor(
                          opportunity.risk
                        )}`}
                      >
                        {opportunity.risk}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                      {opportunity.businessName}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      {opportunity.meiName}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {opportunity.description}
                    </p>
                  </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-3 border border-violet-100">
                    <p className="text-xs text-violet-600 mb-1 font-semibold flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Meta Total
                    </p>
                    <p className="text-base font-bold text-violet-700">
                      R$ {(opportunity.totalValue / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs text-green-600 mb-1 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Retorno
                    </p>
                    <p className="text-base font-bold text-green-700">
                      {opportunity.interestRate}% a.m.
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 font-semibold">
                      Progresso do Financiamento
                    </span>
                    <span className="text-xs font-bold text-violet-600">
                      {opportunity.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                      style={{ width: `${opportunity.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>
                      R$ {(opportunity.currentValue / 1000).toFixed(1)}k
                      arrecadado
                    </span>
                    <span>{opportunity.duration} meses</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Users className="w-4 h-4 text-violet-500" />
                    <span className="font-semibold">
                      {opportunity.investors}
                    </span>{" "}
                    investidores
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold">
                      {opportunity.daysLeft}
                    </span>{" "}
                    dias restantes
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Investimento Mínimo
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      R${" "}
                      {opportunity.minInvestment.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105">
                    Investir
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
