// ============================================
// marketplace/[id]/page.tsx - DETALHES DO INVESTIMENTO
// ============================================
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Users,
  Shield,
  FileText,
  Calculator,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ============================================
// 1. TIPOS E INTERFACES
// ============================================
type RiskLevel = "Muito Baixo" | "Baixo" | "Médio" | "Alto";

interface InvestmentDetails {
  id: string;
  meiName: string;
  businessName: string;
  description: string;
  fullDescription: string;
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
  documents: Array<{ name: string; type: string }>;
  businessInfo: {
    cnpj: string;
    foundedYear: number;
    employees: number;
    monthlyRevenue: number;
  };
}

// ============================================
// 2. DADOS MOCK (depois buscar do backend)
// ============================================
const MOCK_DETAILS: Record<string, InvestmentDetails> = {
  "1": {
    id: "1",
    meiName: "Maria Silva",
    businessName: "Cafeteria Aroma Bom",
    description: "Expansão da cafeteria com novos equipamentos e área externa",
    fullDescription:
      "A Cafeteria Aroma Bom está em operação há 5 anos no bairro Centro e conquistou uma base sólida de clientes fiéis. Com o crescimento da demanda, buscamos investimento para expandir nossa área de atendimento com uma nova varanda climatizada e adquirir equipamentos profissionais de última geração. O investimento permitirá aumentar nossa capacidade de atendimento em 60% e diversificar nosso cardápio com produtos premium.",
    totalValue: 50000,
    currentValue: 32500,
    progress: 65,
    interestRate: 1.8,
    duration: 36,
    minInvestment: 1000,
    risk: "Baixo",
    type: "Empréstimo",
    category: "Alimentação",
    investors: 12,
    daysLeft: 15,
    documents: [
      { name: "Plano de Negócios", type: "PDF" },
      { name: "Demonstrativo Financeiro 2024", type: "PDF" },
      { name: "Certidão Negativa de Débitos", type: "PDF" },
      { name: "Contrato Social", type: "PDF" },
    ],
    businessInfo: {
      cnpj: "12.345.678/0001-90",
      foundedYear: 2019,
      employees: 8,
      monthlyRevenue: 45000,
    },
  },
  "2": {
    id: "2",
    meiName: "João Santos",
    businessName: "Loja Fashion Style",
    description: "Ampliação do estoque para a temporada de verão",
    fullDescription:
      "A Fashion Style é uma loja de moda feminina com forte presença no shopping local. Buscamos capital para ampliar nosso estoque visando a temporada de verão, nosso período de maior movimento. O investimento será aplicado na compra de coleções de fornecedores renomados, aumentando nossa margem de lucro em 40%.",
    totalValue: 120000,
    currentValue: 50400,
    progress: 42,
    interestRate: 1.2,
    duration: 84,
    minInvestment: 5000,
    risk: "Baixo",
    type: "Financiamento",
    category: "Varejo",
    investors: 8,
    daysLeft: 22,
    documents: [
      { name: "Plano de Negócios", type: "PDF" },
      { name: "Balanço Patrimonial", type: "PDF" },
      { name: "Contrato de Locação", type: "PDF" },
    ],
    businessInfo: {
      cnpj: "98.765.432/0001-10",
      foundedYear: 2018,
      employees: 12,
      monthlyRevenue: 85000,
    },
  },
  // Adicione os outros conforme necessário...
};

// ============================================
// 3. FUNÇÕES AUXILIARES
// ============================================
const getRiskColor = (risk: RiskLevel): string => {
  const colors = {
    "Muito Baixo": "bg-emerald-100 text-emerald-700 border-emerald-300",
    Baixo: "bg-blue-100 text-blue-700 border-blue-300",
    Médio: "bg-amber-100 text-amber-700 border-amber-300",
    Alto: "bg-red-100 text-red-700 border-red-300",
  };
  return colors[risk] || "bg-gray-100 text-gray-700 border-gray-300";
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
export default function DetalhesInvestimentoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // ← Pega o ID da URL

  // Estados
  const [investimento, setInvestimento] = useState<InvestmentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [valorSimulacao, setValorSimulacao] = useState("");
  const [erroMinimo, setErroMinimo] = useState("");
  const [tentouConfirmar, setTentouConfirmar] = useState(false);
  const [showModalInvestir, setShowModalInvestir] = useState(false);

  // ============================================
  // 5. BUSCAR DADOS (useEffect)
  // ============================================
  useEffect(() => {
    buscarDetalhes();
  }, [id]);

  const buscarDetalhes = async () => {
    try {
      // SIMULAÇÃO DE DELAY (para parecer requisição real)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // MOCK: Busca dados locais
      const dados = MOCK_DETAILS[id];

      if (!dados) {
        // Se não encontrar, volta para marketplace
        router.push("/marketplace");
        return;
      }

      setInvestimento(dados);

      // TODO: Depois trocar por requisição real:
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investimentos/${id}`);
      // const dados = await response.json();
      // setInvestimento(dados);
    } catch (erro) {
      console.error("Erro ao buscar detalhes:", erro);
      router.push("/marketplace");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 6. SIMULADOR DE RENDIMENTO
  // ============================================
  // Função para formatar valor para BRL

  // Função para obter valor numérico do texto formatado
  function parseBRL(valor: string) {
    return Number(
      valor
        .replace(/\./g, "")
        .replace(/,/g, ".")
        .replace(/[^\d.]/g, "")
    );
  }

  const calcularRendimento = () => {
    if (!investimento) return { total: 0, lucro: 0 };

    const meses = investimento.duration;
    const taxaMensal = investimento.interestRate / 100;
    const valor = parseBRL(valorSimulacao);

    if (!valorSimulacao || valor < investimento.minInvestment) {
      return { total: 0, lucro: 0 };
    }

    // Juros compostos: M = C * (1 + i)^t
    const montante = valor * Math.pow(1 + taxaMensal, meses);
    const lucro = montante - valor;

    return {
      total: montante,
      lucro: lucro,
    };
  };

  const rendimento = calcularRendimento();

  // ============================================
  // 7. LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // 8. NOT FOUND STATE
  // ============================================
  if (!investimento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Investimento não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O investimento que você procura não existe ou foi removido.
          </p>
          <button
            onClick={() => router.push("/marketplace")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Voltar para Marketplace
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // 9. RENDER PRINCIPAL
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Botão Voltar */}
        <button
          onClick={() => router.push("/marketplace")}
          className="flex items-center gap-2 text-violet-600 hover:text-violet-800 mb-6 font-medium transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para Marketplace
        </button>

        {/* Layout de 2 Colunas - RESPONSIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* COLUNA ESQUERDA - Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Header com Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${getCategoryColor(
                    investimento.category
                  )}`}
                >
                  {investimento.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${getRiskColor(
                    investimento.risk
                  )}`}
                >
                  <Shield className="w-3 h-3 inline mr-1" />
                  Risco {investimento.risk}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                  {investimento.type}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {investimento.businessName}
              </h1>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Proprietário:</span>{" "}
                {investimento.meiName}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                CNPJ: {investimento.businessInfo.cnpj} • Fundada em{" "}
                {investimento.businessInfo.foundedYear}
              </p>

              {/* Métricas Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  icon={Target}
                  label="Meta Total"
                  value={`R$ ${(investimento.totalValue / 1000).toFixed(0)}k`}
                  color="violet"
                />
                <MetricCard
                  icon={TrendingUp}
                  label="Retorno"
                  value={`${investimento.interestRate}% a.m.`}
                  color="green"
                />
                <MetricCard
                  icon={Clock}
                  label="Prazo"
                  value={`${investimento.duration} meses`}
                  color="blue"
                />
                <MetricCard
                  icon={Users}
                  label="Investidores"
                  value={investimento.investors.toString()}
                  color="purple"
                />
              </div>

              {/* Barra de Progresso */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Progresso do Financiamento
                  </span>
                  <span className="text-lg font-bold text-violet-600">
                    {investimento.progress}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${investimento.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-semibold">
                    R$ {investimento.currentValue.toLocaleString("pt-BR")}
                  </span>
                  <span>
                    Faltam R${" "}
                    {(
                      investimento.totalValue - investimento.currentValue
                    ).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-orange-600">
                    {investimento.daysLeft} dias restantes
                  </span>
                </div>
              </div>

              {/* Descrição Completa */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Sobre o Projeto
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {investimento.fullDescription}
                </p>
              </div>
            </div>

            {/* Informações do Negócio */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informações do Negócio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Funcionários"
                  value={`${investimento.businessInfo.employees} colaboradores`}
                />
                <InfoItem
                  label="Faturamento Mensal"
                  value={`R$ ${investimento.businessInfo.monthlyRevenue.toLocaleString(
                    "pt-BR"
                  )}`}
                />
                <InfoItem
                  label="Tempo de Mercado"
                  value={`${
                    new Date().getFullYear() -
                    investimento.businessInfo.foundedYear
                  } anos`}
                />
                <InfoItem label="Categoria" value={investimento.category} />
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-violet-600" />
                Documentos Disponíveis
              </h2>
              <div className="space-y-3">
                {investimento.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-violet-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-violet-100 p-2 rounded-lg group-hover:bg-violet-200 transition">
                        <FileText className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <span className="text-violet-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Ver →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA - Sidebar Fixa */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Card de Ação */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Investimento Mínimo
                  </p>
                  <p className="text-3xl font-bold text-violet-600">
                    R${" "}
                    {investimento.minInvestment.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <button
                  onClick={() => setShowModalInvestir(true)}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mb-3"
                >
                  Investir Agora
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Investimento seguro e auditado</span>
                </div>
              </div>

              {/* Simulador */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-violet-600" />
                  Simulador de Rendimento
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Investimento
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      R$
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9.,]*"
                      value={valorSimulacao}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        let raw = e.target.value.replace(/[^\d]/g, "");
                        if (raw.length === 0) {
                          setValorSimulacao("");
                          setErroMinimo("");
                          return;
                        }
                        const valorNumerico = Number(raw) / 100;
                        const formatado = valorNumerico.toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        );
                        setValorSimulacao(formatado);
                        if (valorNumerico < investimento.minInvestment) {
                          setErroMinimo(
                            `O valor mínimo para investir é R$ ${investimento.minInvestment.toLocaleString(
                              "pt-BR"
                            )}`
                          );
                        } else {
                          setErroMinimo("");
                        }
                      }}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-semibold text-gray-800 bg-slate-100"
                      maxLength={15}
                    />
                  </div>
                  {erroMinimo ? (
                    <p className="text-xs text-red-500 mt-1">{erroMinimo}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo: R${" "}
                      {investimento.minInvestment.toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <SimulacaoItem
                    label="Prazo"
                    value={`${investimento.duration} meses`}
                  />
                  <SimulacaoItem
                    label="Taxa Mensal"
                    value={`${investimento.interestRate}%`}
                  />
                  <SimulacaoItem
                    label="Lucro Estimado"
                    value={`R$ ${rendimento.lucro.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                    highlight
                  />
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                  <p className="text-sm text-green-700 mb-1 font-semibold">
                    Valor Total ao Final
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    R${" "}
                    {rendimento.total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Investir (Placeholder) */}
      {showModalInvestir && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-md w-full overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold leading-tight">
                  Confirmar Investimento
                </h3>
                <p className="text-sm opacity-80">
                  Revise os dados antes de confirmar
                </p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4 text-lg font-semibold text-center">
                Você está prestes a investir em{" "}
                <span className="text-violet-700">
                  {investimento.businessName}
                </span>
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-2 text-center">
                <span className="text-gray-500 text-sm">
                  Valor do Investimento
                </span>
                <span className="text-2xl font-bold text-violet-700">
                  R$ {valorSimulacao || "0,00"}
                </span>
                <span className="text-gray-500 text-sm">Taxa Mensal</span>
                <span className="font-semibold text-green-600">
                  {investimento.interestRate}% a.m.
                </span>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModalInvestir(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (
                      !valorSimulacao ||
                      parseBRL(valorSimulacao) < investimento.minInvestment
                    ) {
                      setTentouConfirmar(true);
                      setErroMinimo(
                        `Informe um valor para investir igual ou maior que R$ ${investimento.minInvestment.toLocaleString(
                          "pt-BR"
                        )}`
                      );
                      return;
                    }
                    setShowModalInvestir(false);
                    setErroMinimo("");
                    setTentouConfirmar(false);
                    router.push("/marketplace");
                  }}
                  className={`flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold shadow-lg transition ${
                    !valorSimulacao ||
                    parseBRL(valorSimulacao) < investimento.minInvestment
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  Confirmar
                </button>
                {tentouConfirmar && erroMinimo && (
                  <p className="w-full text-center text-xs text-red-500 mt-2">
                    {erroMinimo}
                  </p>
                )}
              </div>
            </div>
          </div>
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
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.2s ease;
            }
            .animate-scale-in {
              animation: scale-in 0.25s cubic-bezier(0.4, 2, 0.6, 1);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

// ============================================
// 10. COMPONENTES AUXILIARES
// ============================================

// Card de Métrica
interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function MetricCard({ icon: Icon, label, value, color }: MetricCardProps) {
  const colorClasses: Record<string, string> = {
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <div
      className={`rounded-xl p-4 border-2 ${
        colorClasses[color] || colorClasses.violet
      }`}
    >
      <Icon className="w-5 h-5 mb-2" />
      <p className="text-xs font-semibold mb-1 opacity-80">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

// Item de Informação
interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Item de Simulação
interface SimulacaoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function SimulacaoItem({ label, value, highlight }: SimulacaoItemProps) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        highlight ? "border-t-2 border-gray-200 pt-3" : ""
      }`}
    >
      <span
        className={`text-sm ${
          highlight ? "font-bold text-gray-900" : "text-gray-600"
        }`}
      >
        {label}
      </span>
      <span
        className={`${
          highlight
            ? "text-lg font-bold text-green-600"
            : "font-semibold text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
