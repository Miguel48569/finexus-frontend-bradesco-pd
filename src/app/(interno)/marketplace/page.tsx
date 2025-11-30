// ============================================
// marketplace/page.tsx - LISTA DE OPORTUNIDADES
// ============================================
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propostaService, PropostaResponse } from "@/services/proposta";
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

// ============================================
// 1. TIPOS E INTERFACES
// ============================================
type RiskLevel = "Muito Baixo" | "Baixo" | "Médio" | "Alto";

interface Opportunity {
  id: string; // ← Mudei de number para string (melhor para URLs)
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

interface FilterState {
  risk: string;
  value: string;
  rate: string;
  search: string;
}

// ============================================
// 2. DADOS MOCK (depois virá do backend)
// ============================================

// ============================================
// 3. FUNÇÕES AUXILIARES
// ============================================
const getRiskColor = (risk: RiskLevel): string => {
  const colors = {
    "Muito Baixo": "bg-emerald-100 text-emerald-700 border-emerald-200",
    Baixo: "bg-blue-100 text-blue-700 border-blue-200",
    Médio: "bg-amber-100 text-amber-700 border-amber-200",
    Alto: "bg-red-100 text-red-700 border-red-200",
  };
  return colors[risk] || "bg-gray-100 text-gray-700 border-gray-200";
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Alimentação: "bg-violet-100 text-violet-700",
    Varejo: "bg-purple-100 text-purple-700",
    Logística: "bg-indigo-100 text-indigo-700",
    Beleza: "bg-pink-100 text-pink-700",
    Serviços: "bg-cyan-100 text-cyan-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

// ============================================
// 4. COMPONENTE PRINCIPAL
// ============================================
export default function MarketplacePage() {
  const router = useRouter();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ Previne atualizações após desmontagem

    const carregarPropostas = async () => {
      try {
        const propostas = await propostaService.listarAbertas();

        if (!isMounted) return; // ✅ Verifica se ainda está montado

        const convertidas: Opportunity[] = propostas.map((p) => ({
          id: String(p.id),
          meiName: "MEI",
          businessName: p.nomeNegocio,
          description: p.descricaoNegocio,
          totalValue: p.valorSolicitado,
          currentValue: p.saldoInvestido,
          progress: Math.floor((p.saldoInvestido / p.valorSolicitado) * 100),
          interestRate: p.taxaJuros,
          duration: p.prazoMeses,
          minInvestment: 100,
          risk: "Médio",
          type: "Empréstimo",
          category: p.categoria,
          investors: 0,
          daysLeft: 30,
        }));

        if (isMounted) {
          setOpportunities(convertidas);
        }
      } catch (error) {
        console.error("Erro ao carregar propostas:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    carregarPropostas();

    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, []);

  // Estados dos filtros
  const [filters, setFilters] = useState<FilterState>({
    risk: "Todos os riscos",
    value: "Todos os valores",
    rate: "Todas as taxas",
    search: "",
  });

  // Estados dos dropdowns
  const [dropdowns, setDropdowns] = useState({
    risk: false,
    value: false,
    rate: false,
  });

  // Opções dos filtros
  const filterOptions = {
    risk: ["Todos os riscos", "Muito Baixo", "Baixo", "Médio", "Alto"],
    value: [
      "Todos os valores",
      "Até R$ 50.000",
      "R$ 50.000 - R$ 100.000",
      "Acima de R$ 100.000",
    ],
    rate: ["Todas as taxas", "Até 1%", "1% - 2%", "Acima de 2%"],
  };

  // ============================================
  // 5. LÓGICA DE FILTRAGEM
  // ============================================
  const filteredOpportunities = opportunities.filter((opp) => {
    // Filtro de busca
    const matchesSearch =
      filters.search === "" ||
      opp.businessName.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.meiName.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.description.toLowerCase().includes(filters.search.toLowerCase());

    // Filtro de risco
    const matchesRisk =
      filters.risk === "Todos os riscos" || opp.risk === filters.risk;

    // Filtro de valor
    let matchesValue = true;
    if (filters.value === "Até R$ 50.000") {
      matchesValue = opp.totalValue <= 50000;
    } else if (filters.value === "R$ 50.000 - R$ 100.000") {
      matchesValue = opp.totalValue > 50000 && opp.totalValue <= 100000;
    } else if (filters.value === "Acima de R$ 100.000") {
      matchesValue = opp.totalValue > 100000;
    }

    // Filtro de taxa
    let matchesRate = true;
    if (filters.rate === "Até 1%") {
      matchesRate = opp.interestRate <= 1;
    } else if (filters.rate === "1% - 2%") {
      matchesRate = opp.interestRate > 1 && opp.interestRate <= 2;
    } else if (filters.rate === "Acima de 2%") {
      matchesRate = opp.interestRate > 2;
    }

    return matchesSearch && matchesRisk && matchesValue && matchesRate;
  });

  // Estatísticas calculadas
  const stats = {
    totalOpportunities: filteredOpportunities.length,
    totalValue: filteredOpportunities.reduce(
      (sum, opp) => sum + opp.totalValue,
      0
    ),
    avgReturn: 1.4,
    activeInvestors: 68,
  };

  // ============================================
  // 6. HANDLERS
  // ============================================
  const toggleDropdown = (dropdown: keyof typeof dropdowns) => {
    setDropdowns({
      risk: false,
      value: false,
      rate: false,
      [dropdown]: !dropdowns[dropdown],
    });
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setDropdowns({ risk: false, value: false, rate: false });
  };

  // ← FUNÇÃO PRINCIPAL: Navega para detalhes
  const handleVerDetalhes = (id: string) => {
    router.push(`/marketplace/${id}`);
  };

  // ============================================
  // 7. RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Marketplace
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Explore oportunidades de investimento e diversifique sua
                carteira
              </p>
            </div>
          </div>

          {/* Stats Cards - RESPONSIVO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <StatCard
              icon={Store}
              label="Oportunidades"
              value={stats.totalOpportunities.toString()}
              color="violet"
            />
            <StatCard
              icon={DollarSign}
              label="Volume Total"
              value={`R$ ${(stats.totalValue / 1000).toFixed(0)}k`}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Retorno Médio"
              value={`${stats.avgReturn}% a.m.`}
              color="indigo"
            />
            <StatCard
              icon={Users}
              label="Investidores"
              value={stats.activeInvestors.toString()}
              color="pink"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar oportunidades..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white shadow-sm transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Filters - RESPONSIVO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FilterDropdown
            label={filters.risk}
            options={filterOptions.risk}
            isOpen={dropdowns.risk}
            onToggle={() => toggleDropdown("risk")}
            onSelect={(value) => handleFilterChange("risk", value)}
          />
          <FilterDropdown
            label={filters.value}
            options={filterOptions.value}
            isOpen={dropdowns.value}
            onToggle={() => toggleDropdown("value")}
            onSelect={(value) => handleFilterChange("value", value)}
          />
          <FilterDropdown
            label={filters.rate}
            options={filterOptions.rate}
            isOpen={dropdowns.rate}
            onToggle={() => toggleDropdown("rate")}
            onSelect={(value) => handleFilterChange("rate", value)}
          />
        </div>

        {/* Opportunities Grid - RESPONSIVO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredOpportunities.length === 0 ? (
            <EmptyState />
          ) : (
            filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onViewDetails={() => handleVerDetalhes(opportunity.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 8. COMPONENTES AUXILIARES
// ============================================

// Card de Estatísticas
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-3 md:p-4 border border-${color}-100 shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`bg-${color}-100 p-2 md:p-3 rounded-lg`}>
          <Icon className={`w-4 h-4 md:w-5 md:h-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
}

// Dropdown de Filtro
interface FilterDropdownProps {
  label: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

function FilterDropdown({
  label,
  options,
  isOpen,
  onToggle,
  onSelect,
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 md:py-4 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-violet-500 transition-all shadow-sm"
      >
        <span className="text-sm md:text-base text-gray-700 font-medium">
          {label}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className="w-full px-4 py-3 text-left text-sm md:text-base hover:bg-violet-50 transition-colors font-medium text-gray-700"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Card de Oportunidade
interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: () => void;
}

function OpportunityCard({ opportunity, onViewDetails }: OpportunityCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-2xl transition-all hover:scale-105 border border-gray-100 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`px-2 md:px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColor(
                opportunity.category
              )}`}
            >
              {opportunity.category}
            </span>
            <span
              className={`px-2 md:px-3 py-1 rounded-lg text-xs font-bold border ${getRiskColor(
                opportunity.risk
              )}`}
            >
              {opportunity.risk}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
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
          <p className="text-sm md:text-base font-bold text-violet-700">
            R$ {(opportunity.totalValue / 1000).toFixed(0)}k
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs text-green-600 mb-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Retorno
          </p>
          <p className="text-sm md:text-base font-bold text-green-700">
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
            R$ {(opportunity.currentValue / 1000).toFixed(1)}k arrecadado
          </span>
          <span>{opportunity.duration} meses</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Users className="w-4 h-4 text-violet-500" />
          <span className="font-semibold">{opportunity.investors}</span>{" "}
          investidores
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="font-semibold">{opportunity.daysLeft}</span> dias
          restantes
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">
            Investimento Mínimo
          </p>
          <p className="text-sm md:text-base font-bold text-gray-900">
            R${" "}
            {opportunity.minInvestment.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <button
          onClick={onViewDetails}
          className="px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
        >
          Ver Detalhes
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Estado Vazio
function EmptyState() {
  return (
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
  );
}
