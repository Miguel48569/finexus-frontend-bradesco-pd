"use client";

import { useState, useEffect, ChangeEvent } from "react";

import {
  propostaService,
  PropostaRequest,
  PropostaResponse,
} from "@/services/proposta";
import {
  investimentoService,
  InvestimentoResponse,
} from "@/services/investimento";
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
  const [userId, setUserId] = useState<number | null>(null);
  const [valorSimulacao, setValorSimulacao] = useState("");
  const [erroMinimo, setErroMinimo] = useState("");
  const [tentouConfirmar, setTentouConfirmar] = useState(false);
  const [showModalInvestir, setShowModalInvestir] = useState(false);
  const [showModalResultado, setShowModalResultado] = useState(false);
  const [resultadoInvestimento, setResultadoInvestimento] = useState<{
    sucesso: boolean;
    mensagem: string;
  } | null>(null);

  // 🆕 NOVO: Estado para armazenar o investimento criado
  const [investimentoCriado, setInvestimentoCriado] =
    useState<InvestimentoResponse | null>(null);
  const [criandoInvestimento, setCriandoInvestimento] = useState(false);

  // 🆕 NOVA FUNÇÃO: Criar investimento (chamada pelo botão "Investir Agora")
  const criarInvestimento = async () => {
    if (!userId) {
      setResultadoInvestimento({
        sucesso: false,
        mensagem: "Usuário não identificado. Faça login novamente.",
      });
      setShowModalResultado(true);
      return;
    }

    if (!investimento) {
      setResultadoInvestimento({
        sucesso: false,
        mensagem: "Proposta não encontrada.",
      });
      setShowModalResultado(true);
      return;
    }

    const valor = parseBRL(valorSimulacao);

    if (valor < investimento.minInvestment) {
      setErroMinimo(
        `O valor mínimo para investir é R$ ${investimento.minInvestment.toLocaleString(
          "pt-BR"
        )}`
      );
      return;
    }

    // Validação do valor máximo disponível na proposta
    const saldoDisponivel = investimento.totalValue - investimento.currentValue;
    if (valor > saldoDisponivel) {
      setErroMinimo(
        `O valor máximo disponível para investimento é R$ ${saldoDisponivel.toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits: 2,
          }
        )}`
      );
      return;
    }

    try {
      setCriandoInvestimento(true);

      const payload = {
        idInvestidor: userId,
        idProposta: Number(investimento.id),
        valor: valor,
      };

      console.log("📤 Criando investimento:", payload);

      // Cria o investimento e armazena a resposta
      const response = await investimentoService.criar(payload);

      console.log("✅ Investimento criado:", response);

      setInvestimentoCriado(response);
      setShowModalInvestir(true); // Abre o modal com os dados do investimento
    } catch (err: any) {
      console.error("Erro ao criar investimento:", err);
      const mensagemErro =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Erro ao criar investimento. Tente novamente.";
      setResultadoInvestimento({
        sucesso: false,
        mensagem: mensagemErro,
      });
      setShowModalResultado(true);
    } finally {
      setCriandoInvestimento(false);
    }
  };

  // 🔄 FUNÇÃO MODIFICADA: Confirmar investimento (chamada pelo botão "Confirmar" no modal)
  const confirmarInvestimento = async () => {
    if (!investimentoCriado) {
      setResultadoInvestimento({
        sucesso: false,
        mensagem: "Nenhum investimento foi criado ainda.",
      });
      setShowModalResultado(true);
      setShowModalInvestir(false);
      return;
    }

    try {
      console.log("📤 Confirmando investimento ID:", investimentoCriado.id);

      await investimentoService.confirmar(investimentoCriado.id);

      setResultadoInvestimento({
        sucesso: true,
        mensagem:
          "Investimento confirmado com sucesso! Você pode visualizá-lo na sua Carteira.",
      });
      setShowModalResultado(true);
      setShowModalInvestir(false);

      // Redireciona após 3 segundos
      setTimeout(() => {
        router.push("/carteira");
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao confirmar investimento:", err);
      const mensagemErro =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Erro ao confirmar investimento. Tente novamente.";
      setResultadoInvestimento({
        sucesso: false,
        mensagem: mensagemErro,
      });
      setShowModalResultado(true);
      setShowModalInvestir(false);
    }
  };

  useEffect(() => {
    const idLocal = localStorage.getItem("userId");
    console.log("🟣 userId carregado na page:", idLocal);

    if (idLocal) {
      setUserId(Number(idLocal));
    }
  }, []);

  // ============================================
  // 5. BUSCAR DADOS (useEffect)
  // ============================================
  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        const dados = await propostaService.buscarPorId(Number(id));

        // Buscar número real de investidores
        let numeroInvestidores = 0;
        try {
          const investimentos = await investimentoService.listarPorProposta(
            Number(id)
          );
          numeroInvestidores = investimentos.length;
        } catch (error) {
          console.error("Erro ao buscar investidores:", error);
        }

        // Calcular dias restantes baseado na data de criação (30 dias de prazo)
        let diasRestantes = 30;
        if (dados.dataCriacao) {
          const dataCriacao = new Date(dados.dataCriacao);
          const dataLimite = new Date(dataCriacao);
          dataLimite.setDate(dataLimite.getDate() + 30);
          const hoje = new Date();
          const diffTime = dataLimite.getTime() - hoje.getTime();
          diasRestantes = Math.max(
            0,
            Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          );
        }

        // Calcular ano de fundação baseado no tempo de atuação
        const anoAtual = new Date().getFullYear();
        const anoFundacao =
          anoAtual - Math.floor((dados.tempoAtuacaoMeses || 12) / 12);

        // Calcular risco baseado na taxa de juros
        let risco: RiskLevel = "Médio";
        if (dados.taxaJuros <= 1) {
          risco = "Baixo";
        } else if (dados.taxaJuros <= 1.5) {
          risco = "Médio";
        } else {
          risco = "Alto";
        }

        // Calcular investimento mínimo (menor valor entre 100 e o que falta)
        const valorRestante = dados.valorSolicitado - dados.saldoInvestido;
        const investimentoMinimo = Math.min(100, valorRestante);

        const investimentoConvertido: InvestmentDetails = {
          id: String(dados.id),
          meiName: dados.solicitante?.nome || "MEI",
          businessName: dados.nomeNegocio,
          description: dados.descricaoNegocio,
          fullDescription: dados.descricaoUsoRecurso || dados.descricaoNegocio,
          totalValue: dados.valorSolicitado,
          currentValue: dados.saldoInvestido,
          progress: Math.floor(
            (dados.saldoInvestido / dados.valorSolicitado) * 100
          ),
          interestRate: dados.taxaJuros,
          duration: dados.prazoMeses,
          minInvestment: investimentoMinimo,
          risk: risco,
          category: dados.categoria,
          type: "Empréstimo",
          investors: numeroInvestidores,
          daysLeft: diasRestantes,
          documents: [],
          businessInfo: {
            cnpj: dados.cnpj,
            foundedYear: anoFundacao,
            employees: 1,
            monthlyRevenue: dados.faturamentoMensal,
          },
        };

        setInvestimento(investimentoConvertido);
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [id]);

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

    const valor = parseBRL(valorSimulacao);

    if (!valorSimulacao || valor < investimento.minInvestment) {
      return { total: 0, lucro: 0 };
    }

    // A taxaJuros do backend é a taxa TOTAL do período (não mensal)
    // Exemplo: 8.42% significa 8.42% de lucro sobre todo o período
    const taxaTotal = investimento.interestRate / 100;
    const lucro = valor * taxaTotal;
    const montante = valor + lucro;

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
  // 9. COMPONENTES AUXILIARES
  // ============================================
  const SimulacaoItem = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <div
      className={`flex justify-between items-center ${
        highlight ? "font-bold" : ""
      }`}
    >
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? "text-green-600" : "text-gray-900"}>
        {value}
      </span>
    </div>
  );

  // ============================================
  // 10. RENDER PRINCIPAL
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/marketplace")}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar para Marketplace
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUNA ESQUERDA - Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Cabeçalho */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                        investimento.category
                      )}`}
                    >
                      {investimento.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {investimento.type}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {investimento.businessName}
                  </h1>
                  <p className="text-gray-600">{investimento.description}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl border-2 ${getRiskColor(
                    investimento.risk
                  )}`}
                >
                  <p className="text-xs font-semibold">Risco</p>
                  <p className="text-sm font-bold">{investimento.risk}</p>
                </div>
              </div>

              {/* Progresso */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Progresso do Investimento
                  </span>
                  <span className="text-sm font-bold text-violet-600">
                    {investimento.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${investimento.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-gray-600">
                    R${" "}
                    {investimento.currentValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="font-semibold text-gray-900">
                    R${" "}
                    {investimento.totalValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                  label="Taxa de Retorno"
                  value={`${investimento.interestRate}% a.m.`}
                />
                <MetricCard
                  icon={<Clock className="w-5 h-5 text-blue-600" />}
                  label="Prazo"
                  value={`${investimento.duration} meses`}
                />
                <MetricCard
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                  label="Investidores"
                  value={investimento.investors.toString()}
                />
                <MetricCard
                  icon={<Target className="w-5 h-5 text-orange-600" />}
                  label="Dias Restantes"
                  value={investimento.daysLeft.toString()}
                />
              </div>

              {/* Descrição Completa */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-600" />
                  Sobre o Negócio
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {investimento.fullDescription}
                </p>
              </div>
            </div>

            {/* Informações do Negócio */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                Informações do Negócio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="CNPJ" value={investimento.businessInfo.cnpj} />
                <InfoItem
                  label="Ano de Fundação"
                  value={investimento.businessInfo.foundedYear.toString()}
                />
                <InfoItem
                  label="Funcionários"
                  value={investimento.businessInfo.employees.toString()}
                />
                <InfoItem
                  label="Faturamento Mensal"
                  value={`R$ ${investimento.businessInfo.monthlyRevenue.toLocaleString(
                    "pt-BR"
                  )}`}
                />
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-600" />
                Documentos Disponíveis
              </h3>
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

                {/* 🔄 BOTÃO MODIFICADO: Agora chama criarInvestimento */}
                <button
                  onClick={criarInvestimento}
                  disabled={
                    criandoInvestimento ||
                    !valorSimulacao ||
                    parseBRL(valorSimulacao) < investimento.minInvestment
                  }
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mb-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {criandoInvestimento ? "Criando..." : "Investir Agora"}
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
                        const raw = e.target.value.replace(/[^\d]/g, "");
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

                        // Valida valor mínimo
                        if (valorNumerico < investimento.minInvestment) {
                          setErroMinimo(
                            `O valor mínimo para investir é R$ ${investimento.minInvestment.toLocaleString(
                              "pt-BR",
                              { minimumFractionDigits: 2 }
                            )}`
                          );
                        }
                        // Valida valor máximo disponível
                        else {
                          const saldoDisponivel =
                            investimento.totalValue - investimento.currentValue;
                          if (valorNumerico > saldoDisponivel) {
                            setErroMinimo(
                              `O valor máximo disponível é R$ ${saldoDisponivel.toLocaleString(
                                "pt-BR",
                                { minimumFractionDigits: 2 }
                              )}`
                            );
                          } else {
                            setErroMinimo("");
                          }
                        }
                      }}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-semibold text-gray-800 bg-slate-100"
                      maxLength={15}
                    />
                  </div>
                  {erroMinimo ? (
                    <p className="text-xs text-red-500 mt-1">{erroMinimo}</p>
                  ) : (
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        Mínimo: R${" "}
                        {investimento.minInvestment.toLocaleString("pt-BR")}
                      </span>
                      <span>
                        Disponível: R${" "}
                        {(
                          investimento.totalValue - investimento.currentValue
                        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
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

      {/* 🔄 MODAL MODIFICADO: Agora exibe dados do investimento criado e botão confirma o pagamento */}
      {showModalInvestir && investimentoCriado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-md w-full overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold leading-tight">
                  Confirmar Pagamento
                </h3>
                <p className="text-sm opacity-80">
                  Investimento criado com sucesso
                </p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4 text-lg font-semibold text-center">
                Seu investimento em{" "}
                <span className="text-violet-700">
                  {investimento.businessName}
                </span>{" "}
                foi criado!
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    ID do Investimento
                  </span>
                  <span className="font-semibold text-gray-900">
                    #{investimentoCriado.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Valor Investido</span>
                  <span className="text-2xl font-bold text-violet-700">
                    R${" "}
                    {investimentoCriado.valorInvestido.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    Rendimento Esperado
                  </span>
                  <span className="font-semibold text-green-600">
                    R${" "}
                    {investimentoCriado.rendimentoEsperado.toLocaleString(
                      "pt-BR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    {investimentoCriado.status}
                  </span>
                </div>
              </div>

              {/* Exibe QR Code se disponível */}
              {investimentoCriado.qrCodeUrl && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm text-gray-600 mb-3">Pague com PIX</p>
                  <img
                    src={investimentoCriado.qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              )}

              <p className="text-sm text-gray-600 text-center mb-6">
                Clique em "Confirmar Pagamento" após realizar o pagamento para
                finalizar o investimento.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModalInvestir(false);
                    setInvestimentoCriado(null);
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarInvestimento}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold shadow-lg transition"
                >
                  Confirmar Pagamento
                </button>
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

      {/* Modal de Resultado */}
      {showModalResultado && resultadoInvestimento && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-md w-full overflow-hidden animate-scale-in">
            <div
              className={`${
                resultadoInvestimento.sucesso
                  ? "bg-gradient-to-r from-green-600 to-emerald-600"
                  : "bg-gradient-to-r from-red-600 to-rose-600"
              } p-6 text-white flex items-center gap-3`}
            >
              {resultadoInvestimento.sucesso ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
              <div>
                <h3 className="text-2xl font-bold leading-tight">
                  {resultadoInvestimento.sucesso ? "Sucesso!" : "Ops!"}
                </h3>
                <p className="text-sm opacity-80">
                  {resultadoInvestimento.sucesso
                    ? "Investimento confirmado"
                    : "Não foi possível processar"}
                </p>
              </div>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-700 text-lg mb-6">
                {resultadoInvestimento.mensagem}
              </p>
              {resultadoInvestimento.sucesso ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => router.push("/carteira")}
                    className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition"
                  >
                    Ir para Carteira
                  </button>
                  <button
                    onClick={() => router.push("/marketplace")}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                  >
                    Voltar ao Marketplace
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowModalResultado(false);
                    setShowModalInvestir(false);
                    setInvestimentoCriado(null);
                  }}
                  className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition"
                >
                  Tentar Novamente
                </button>
              )}
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
// COMPONENTES AUXILIARES
// ============================================
const MetricCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
    <div className="flex items-center gap-2 mb-2">{icon}</div>
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);
