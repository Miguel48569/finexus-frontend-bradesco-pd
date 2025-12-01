"use client";

import React, { useState, useEffect } from "react";
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
  ArrowDownToLine,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { saldoService } from "@/services/saldo";
import { investimentoService } from "@/services/investimento";

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

const MinhaCarteira = () => {
  const [saldoDisponivel, setSaldoDisponivel] = useState(0);
  const [portfolioTotal, setPortfolioTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalResgateOpen, setModalResgateOpen] = useState(false);
  const [resgatando, setResgatando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);

  // Cálculos dinâmicos baseados nos investimentos reais
  const totalInvestedValue = investments.reduce(
    (acc, inv) => acc + inv.investedAmount,
    0
  );
  const totalCurrentValue = investments.reduce(
    (acc, inv) => acc + inv.currentValue,
    0
  );
  const totalReturn =
    totalInvestedValue > 0
      ? ((totalCurrentValue - totalInvestedValue) / totalInvestedValue) * 100
      : 0;
  const activeInvestments = investments.filter(
    (inv) => inv.status === "Ativo"
  ).length;
  const completedInvestments = investments.filter(
    (inv) => inv.status === "Finalizado"
  ).length;

  const portfolioData = {
    totalEquity: portfolioTotal,
    totalReturn: totalReturn,
    investedValue: totalInvestedValue,
    currentValue: totalCurrentValue,
    diversificationClasses: [...new Set(investments.map((inv) => inv.category))]
      .length,
    activeInvestments: activeInvestments,
    completedInvestments: completedInvestments,
  };

  // Cálculo dinâmico de distribuição por categoria
  // Cálculo de distribuição por categoria (não usado mais, mas pode ser útil no futuro)
  // const calcularDistribuicaoPorCategoria = (): AllocationItem[] => { ... }

  // Gerar dados de evolução baseado nos investimentos reais
  const performanceData = (() => {
    if (investments.length === 0) {
      return [
        { month: "Jan", value: 0 },
        { month: "Fev", value: 0 },
        { month: "Mar", value: 0 },
        { month: "Abr", value: 0 },
        { month: "Mai", value: 0 },
        { month: "Jun", value: 0 },
        { month: "Jul", value: 0 },
        { month: "Ago", value: 0 },
        { month: "Set", value: 0 },
        { month: "Out", value: 0 },
        { month: "Nov", value: 0 },
      ];
    }

    // Simula crescimento gradual até o valor atual
    const incremento = totalCurrentValue / 11;
    return [
      { month: "Jan", value: incremento * 1 },
      { month: "Fev", value: incremento * 2 },
      { month: "Mar", value: incremento * 3 },
      { month: "Abr", value: incremento * 4 },
      { month: "Mai", value: incremento * 5 },
      { month: "Jun", value: incremento * 6 },
      { month: "Jul", value: incremento * 7 },
      { month: "Ago", value: incremento * 8 },
      { month: "Set", value: incremento * 9 },
      { month: "Out", value: incremento * 10 },
      { month: "Nov", value: totalCurrentValue },
    ];
  })();

  // Função auxiliar para obter ícone por categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Alimentação":
        return <Coffee className="w-5 h-5" />;
      case "Varejo":
        return <Store className="w-5 h-5" />;
      case "Logística":
        return <Truck className="w-5 h-5" />;
      case "Beleza":
        return <Scissors className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

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

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userProfile = localStorage.getItem("userProfile");

        console.log("🔍 Dados do localStorage:", { userId, userProfile });

        if (!userId) {
          console.error("❌ Usuário não encontrado no localStorage");
          // Mesmo sem userId, mostra a página com valores zerados
          setSaldoDisponivel(0);
          setPortfolioTotal(0);
          setInvestments([]);
          setLoading(false);
          return;
        }

        console.log("🔍 Carregando dados para userId:", userId);

        // Inicializa com valores padrão
        let investimentosList: Investment[] = [];
        let saldoValor = 0;

        // Tenta carregar saldo do usuário
        try {
          const saldoData = await saldoService.buscarPorUsuario(Number(userId));
          console.log("✅ Saldo recebido:", saldoData);
          saldoValor = saldoData.valor || 0;
          setSaldoDisponivel(saldoValor);
        } catch (saldoError: any) {
          const statusCode = saldoError?.response?.status;
          console.warn(
            `⚠️ Saldo não encontrado (${statusCode}). Usando valor padrão 0.`
          );
          setSaldoDisponivel(0);
        }

        // Tenta carregar investimentos
        try {
          const investimentosData =
            await investimentoService.listarPorInvestidor(Number(userId));

          console.log("✅ Investimentos recebidos:", investimentosData);

          if (
            Array.isArray(investimentosData) &&
            investimentosData.length > 0
          ) {
            // Converte investimentos do backend para o formato do frontend
            investimentosList = investimentosData.map((inv) => {
              const categoria = inv.proposta?.categoria || "Outros";
              const valorAtual =
                inv.valorInvestido + (inv.rendimentoEsperado || 0);
              const retorno =
                inv.valorInvestido > 0
                  ? ((valorAtual - inv.valorInvestido) / inv.valorInvestido) *
                    100
                  : 0;

              // Calcula progresso (se tiver data de investimento, calcula baseado no prazo)
              const dataInv = new Date(inv.dataInvestimento);
              const hoje = new Date();
              const mesesDecorridos = Math.floor(
                (hoje.getTime() - dataInv.getTime()) /
                  (1000 * 60 * 60 * 24 * 30)
              );
              const prazo = inv.proposta?.prazoMeses || 12;
              const progresso = Math.min(
                Math.floor((mesesDecorridos / prazo) * 100),
                100
              );

              return {
                id: String(inv.id),
                meiName: inv.investidor?.nome || "MEI",
                businessName: inv.proposta?.nomeNegocio || "Negócio",
                category: categoria,
                icon: getCategoryIcon(categoria),
                type: "Empréstimo",
                investedAmount: inv.valorInvestido,
                currentValue: valorAtual,
                interestRate: inv.proposta?.taxaJuros || 0,
                duration: prazo,
                progress: progresso,
                returnPercentage: retorno,
                status: inv.status === "CONFIRMADO" ? "Ativo" : "Em Andamento",
              };
            });

            setInvestments(investimentosList);

            const totalInvestido = investimentosData.reduce(
              (acc, inv) => acc + inv.valorInvestido,
              0
            );
            setPortfolioTotal(saldoValor + totalInvestido);
          } else {
            console.log("📊 Array de investimentos vazio");
            setInvestments([]);
            setPortfolioTotal(saldoValor);
          }
        } catch (invError: any) {
          const statusCode = invError?.response?.status;
          console.warn(
            `⚠️ Investimentos não encontrados (${statusCode}). Lista vazia.`
          );

          if (statusCode === 404) {
            console.log("ℹ️ Nenhum investimento encontrado para este usuário");
          } else {
            console.error(
              "❌ Erro ao carregar investimentos:",
              invError?.response?.data
            );
          }

          setInvestments([]);
          setPortfolioTotal(saldoValor);
        }
      } catch (error) {
        console.error("❌ Erro geral ao carregar dados:", error);
        setInvestments([]);
        setSaldoDisponivel(0);
        setPortfolioTotal(0);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleResgatar = async () => {
    if (saldoDisponivel <= 0) {
      setMensagem({ tipo: "erro", texto: "Saldo insuficiente para resgate" });
      return;
    }

    setResgatando(true);
    setMensagem(null);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Usuário não encontrado");

      await saldoService.resgatar({
        valor: saldoDisponivel, // Resgata todo o saldo disponível
        usuarioId: Number(userId),
      });

      // Atualiza saldo local para 0
      setSaldoDisponivel(0);
      setPortfolioTotal((prev) => prev - saldoDisponivel);

      setMensagem({
        tipo: "sucesso",
        texto:
          "Resgate solicitado com sucesso! O dinheiro será transferido em até 2 dias úteis.",
      });

      // Fecha modal após 3 segundos
      setTimeout(() => {
        setModalResgateOpen(false);
        setMensagem(null);
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao resgatar:", error);
      const mensagemErro =
        error?.response?.data?.message ||
        "Erro ao processar resgate. Tente novamente.";
      setMensagem({ tipo: "erro", texto: mensagemErro });
    } finally {
      setResgatando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 flex items-center justify-center">
        <p className="text-violet-600 font-semibold">Carregando carteira...</p>
      </div>
    );
  }

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

        {/* Mensagem de feedback temporária */}
        {mensagem && !modalResgateOpen && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              mensagem.tipo === "sucesso"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {mensagem.tipo === "sucesso" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p
              className={`text-sm font-medium ${
                mensagem.tipo === "sucesso" ? "text-green-800" : "text-red-800"
              }`}
            >
              {mensagem.texto}
            </p>
          </div>
        )}

        {/* Card de Portfólio com Saldo Disponível */}
        <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 rounded-3xl p-8 mb-6 text-white shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-violet-100 text-sm mb-2">Saldo Disponível</p>
              <p className="text-5xl font-bold">
                R${" "}
                {saldoDisponivel.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-violet-200 text-sm mt-1">
                Total em movimentação: R${" "}
                {portfolioTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <button
              onClick={() => {
                if (saldoDisponivel <= 0) {
                  setMensagem({
                    tipo: "erro",
                    texto:
                      "Investidores não possuem saldo para resgate. Investimentos são realizados via PIX/Boleto.",
                  });
                  setTimeout(() => setMensagem(null), 3000);
                  return;
                }
                setModalResgateOpen(true);
              }}
              disabled={saldoDisponivel <= 0}
              className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${
                saldoDisponivel <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-violet-600 hover:bg-violet-50 hover:scale-105"
              }`}
              title={
                saldoDisponivel <= 0
                  ? "Investidores não possuem saldo para resgate"
                  : "Resgatar saldo"
              }
            >
              <ArrowDownToLine size={20} />
              Resgatar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2">Carteira Total</p>
              <p className="text-2xl font-bold">
                R${" "}
                {(portfolioTotal - saldoDisponivel).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-violet-200 text-xs mt-1">Investido em MEIs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2">Investimentos</p>
              <p className="text-2xl font-bold">{investments.length}</p>
              <p className="text-violet-200 text-xs mt-1">Total realizados</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2">Variação Total</p>
              <p className="text-2xl font-bold">
                +
                {totalInvestedValue > 0
                  ? (
                      ((totalCurrentValue - totalInvestedValue) /
                        totalInvestedValue) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-violet-200 text-xs mt-1">
                R${" "}
                {(totalCurrentValue - totalInvestedValue).toLocaleString(
                  "pt-BR",
                  { minimumFractionDigits: 2 }
                )}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2">Disponível</p>
              <p className="text-2xl font-bold">
                R${" "}
                {saldoDisponivel.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-violet-200 text-xs mt-1">Para resgate</p>
            </div>
          </div>
        </div>

        {/* Top Stats Card - REMOVIDO, substituído pelo card acima */}
        <div className="hidden bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 rounded-3xl p-8 mb-6 text-white shadow-2xl">
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
                Retorno Total
              </p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">
                  +{portfolioData.totalReturn.toFixed(1)}%
                </p>
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <p className="text-violet-100 text-sm mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Lucro Atual
              </p>
              <p className="text-3xl font-bold">
                R${" "}
                {(
                  portfolioData.currentValue - portfolioData.investedValue
                ).toLocaleString("pt-BR", {
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
              <span className="text-violet-600 text-sm font-semibold bg-violet-50 px-3 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Valor Investido</p>
            <p className="text-2xl font-bold text-gray-900">
              R${" "}
              {portfolioData.investedValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Investimentos Ativos */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                {portfolioData.activeInvestments} ativos
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Retorno Atual</p>
            <p className="text-2xl font-bold text-gray-900">
              R${" "}
              {(
                portfolioData.currentValue - portfolioData.investedValue
              ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Valor Total Atual */}
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />+
                {portfolioData.totalReturn.toFixed(1)}%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Valor Total Atual</p>
            <p className="text-2xl font-bold text-gray-900">
              R${" "}
              {portfolioData.currentValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Diversificação */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <PieChart className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-pink-600 text-sm font-semibold bg-pink-50 px-3 py-1 rounded-full">
                {portfolioData.diversificationClasses}{" "}
                {portfolioData.diversificationClasses === 1
                  ? "setor"
                  : "setores"}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Diversificação</p>
            <p className="text-2xl font-bold text-gray-900">
              {portfolioData.diversificationClasses === 0
                ? "Nenhum"
                : portfolioData.diversificationClasses >= 3
                ? "Alta"
                : "Baixa"}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-violet-100 shadow-xl shadow-violet-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                Evolução do Patrimônio
              </h3>
              <div className="text-right">
                <p className="text-xs text-gray-500">Valor Atual</p>
                <p className="text-xl font-bold text-violet-600">
                  R$ {Math.round(totalCurrentValue).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>

            {investments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <TrendingUp className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-sm font-medium">Nenhum dado ainda</p>
                <p className="text-xs mt-1">
                  Faça investimentos para ver a evolução
                </p>
              </div>
            ) : (
              <div className="relative pl-16">
                <div className="h-64">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 256"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8b5cf6"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#a78bfa"
                          stopOpacity="0.05"
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid */}
                    {[0, 64, 128, 192, 256].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="800"
                        y2={y}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Área */}
                    <path
                      d={`M 0 ${
                        256 -
                        Math.min(
                          (performanceData[0].value /
                            Math.max(totalCurrentValue, 1)) *
                            256,
                          256
                        )
                      } ${performanceData
                        .map(
                          (d, i) =>
                            `L ${(i * 800) / (performanceData.length - 1)} ${
                              256 -
                              Math.min(
                                (d.value / Math.max(totalCurrentValue, 1)) *
                                  256,
                                256
                              )
                            }`
                        )
                        .join(" ")} L 800 256 L 0 256 Z`}
                      fill="url(#areaGradient)"
                    />

                    {/* Linha */}
                    <path
                      d={`M 0 ${
                        256 -
                        Math.min(
                          (performanceData[0].value /
                            Math.max(totalCurrentValue, 1)) *
                            256,
                          256
                        )
                      } ${performanceData
                        .map(
                          (d, i) =>
                            `L ${(i * 800) / (performanceData.length - 1)} ${
                              256 -
                              Math.min(
                                (d.value / Math.max(totalCurrentValue, 1)) *
                                  256,
                                256
                              )
                            }`
                        )
                        .join(" ")}`}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))"
                    />

                    {/* Pontos */}
                    {performanceData.map((d, i) => {
                      const x = (i * 800) / (performanceData.length - 1);
                      const y =
                        256 -
                        Math.min(
                          (d.value / Math.max(totalCurrentValue, 1)) * 256,
                          256
                        );
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#8b5cf6"
                          stroke="white"
                          strokeWidth="2"
                          filter="drop-shadow(0 2px 3px rgba(139, 92, 246, 0.4))"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Labels dos meses */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {performanceData.map((d) => (
                    <span key={d.month}>{d.month}</span>
                  ))}
                </div>

                {/* Eixo Y */}
                <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-600">
                  <span>
                    R$ {(Math.round(totalCurrentValue) / 1000).toFixed(0)}k
                  </span>
                  <span>
                    R${" "}
                    {(Math.round(totalCurrentValue * 0.75) / 1000).toFixed(0)}k
                  </span>
                  <span>
                    R$ {(Math.round(totalCurrentValue * 0.5) / 1000).toFixed(0)}
                    k
                  </span>
                  <span>
                    R${" "}
                    {(Math.round(totalCurrentValue * 0.25) / 1000).toFixed(0)}k
                  </span>
                  <span>R$ 0</span>
                </div>
              </div>
            )}
          </div>

          {/* Últimos Investimentos */}
          <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-xl shadow-violet-200/50">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-600" />
              Últimos Investimentos
            </h3>
            {investments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Activity className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-sm font-medium">Nenhum investimento ainda</p>
                <p className="text-xs mt-1">Comece a investir em MEIs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {investments.slice(0, 3).map((inv) => {
                  const getCategoryBadgeColor = (cat: string) => {
                    const colors: Record<string, string> = {
                      Alimentação:
                        "bg-violet-50 text-violet-700 border border-violet-200",
                      Varejo:
                        "bg-purple-50 text-purple-700 border border-purple-200",
                      Logística:
                        "bg-indigo-50 text-indigo-700 border border-indigo-200",
                      Beleza: "bg-pink-50 text-pink-700 border border-pink-200",
                      Outros: "bg-gray-50 text-gray-700 border border-gray-200",
                    };
                    return (
                      colors[cat] ||
                      "bg-gray-50 text-gray-700 border border-gray-200"
                    );
                  };

                  return (
                    <div
                      key={inv.id}
                      className="p-3 rounded-lg bg-gradient-to-r from-white to-violet-50/30 border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md text-sm">
                            {inv.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm group-hover:text-violet-600 transition-colors">
                              {inv.businessName}
                            </p>
                            <span
                              className={`inline-block text-xs px-2 py-0.5 rounded-md font-semibold mt-0.5 ${getCategoryBadgeColor(
                                inv.category
                              )}`}
                            >
                              {inv.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Investido</p>
                          <p className="text-base font-bold text-gray-900">
                            R${" "}
                            {inv.investedAmount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-violet-100">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Taxa</p>
                          <p className="text-sm font-bold text-violet-600">
                            {inv.interestRate}% a.m.
                          </p>
                        </div>
                        <div className="text-center border-x border-violet-100">
                          <p className="text-xs text-gray-500">Prazo</p>
                          <p className="text-sm font-bold text-indigo-600">
                            {inv.duration} meses
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Retorno</p>
                          <p className="text-sm font-bold text-green-600">
                            +{inv.returnPercentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {investments.length > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      E mais{" "}
                      <span className="font-semibold text-violet-600">
                        {investments.length - 3}
                      </span>{" "}
                      investimento{investments.length - 3 > 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            )}
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
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-violet-100 p-4 rounded-full">
                          <Store className="w-8 h-8 text-violet-600" />
                        </div>
                        <p className="text-gray-600 font-medium">
                          Você ainda não possui investimentos
                        </p>
                        <p className="text-sm text-gray-400">
                          Explore o marketplace para começar a investir em MEIs
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
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
                    {investments.length > 0 && (
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
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            Resumo dos Investimentos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2 font-semibold">
                Total Investido
              </p>
              <p className="text-4xl font-bold text-blue-900 mb-1">
                R${" "}
                {portfolioData.investedValue.toLocaleString("pt-BR", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-blue-600">
                Em{" "}
                {portfolioData.activeInvestments +
                  portfolioData.completedInvestments}{" "}
                investimentos
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-green-700 mb-2 font-semibold">
                Retorno Total
              </p>
              <p className="text-4xl font-bold text-green-900 mb-1">
                +{portfolioData.totalReturn.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600">
                R${" "}
                {(
                  portfolioData.currentValue - portfolioData.investedValue
                ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <p className="text-sm text-purple-700 mb-2 font-semibold">
                Investimentos Ativos
              </p>
              <p className="text-4xl font-bold text-purple-900 mb-1">
                {portfolioData.activeInvestments}
              </p>
              <p className="text-xs text-purple-600">
                {portfolioData.completedInvestments} finalizados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resgate */}
      {modalResgateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setModalResgateOpen(false);
                setMensagem(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDownToLine className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Resgatar Dinheiro
              </h3>
              <p className="text-gray-500 mt-1">Saldo Disponível</p>
              <p className="text-3xl font-bold text-violet-600 mt-2">
                R${" "}
                {saldoDisponivel.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-violet-600 mt-2 font-medium">
                Todo o saldo será resgatado
              </p>
            </div>

            {mensagem && (
              <div
                className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
                  mensagem.tipo === "sucesso"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {mensagem.tipo === "sucesso" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <p
                  className={`text-sm font-medium ${
                    mensagem.tipo === "sucesso"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {mensagem.texto}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleResgatar}
                disabled={
                  resgatando ||
                  mensagem?.tipo === "sucesso" ||
                  saldoDisponivel <= 0
                }
                className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
              >
                {resgatando ? (
                  "Processando..."
                ) : mensagem?.tipo === "sucesso" ? (
                  <>
                    <CheckCircle2 size={20} />
                    Resgate Confirmado!
                  </>
                ) : (
                  <>
                    <DollarSign size={20} />
                    Confirmar Resgate Total
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                O dinheiro será transferido em até 2 dias úteis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhaCarteira;
