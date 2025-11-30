"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { propostaService } from "@/services/proposta";
import { saldoService } from "@/services/saldo";
import dividaService from "@/services/divida";
import { parcelaService } from "@/services/parcela";

type StatusProposta =
  | "ABERTA"
  | "EM_ANALISE"
  | "APROVADA"
  | "FINANCIADA"
  | "EM_PAGAMENTO"
  | "FINALIZADA"
  | "REJEITADA";

interface Emprestimo {
  id: number;
  empresa: string;
  valor: number;
  pago: number;
  juros: number;
  status: StatusProposta;
  dataVencimento: string;
  dataSolicitacao: string;
}

export default function DashboardMEI() {
  const [showResgatarModal, setShowResgatarModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [saldo, setSaldo] = useState<number>(0);
  const [resgatando, setResgatando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);
  const [totalDivida, setTotalDivida] = useState(0);
  const [totalPago, setTotalPago] = useState(0);

  // Busca propostas do backend
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await saldoService.buscarPorUsuario(Number(userId));
        setSaldo(response.valor);
      } catch (err) {
        console.error("Erro ao buscar saldo:", err);
      }
    };

    const fetchPropostas = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          return;
        }

        console.log("🔄 Buscando propostas do usuário...", { userId });
        const propostas = await propostaService.buscarPorUsuario(
          parseInt(userId)
        );
        console.log("✅ Propostas recebidas:", propostas);

        // Converte propostas do backend para formato do dashboard
        const emprestimosConvertidos: Emprestimo[] = propostas.map((p) => ({
          id: p.id,
          empresa: p.nomeNegocio,
          valor: p.valorSolicitado,
          pago: p.saldoInvestido,
          juros: 3.5,
          status: (p.status ?? "ABERTA") as StatusProposta, // ⭐ FIX AQUI
          dataVencimento: calcularDataVencimento(p.prazoMeses),
          dataSolicitacao: formatarData(p.dataCriacao),
        }));

        setEmprestimos(emprestimosConvertidos);

        // Busca dívidas para cálculos mais precisos
        try {
          const dividas = await dividaService.getByTomador(parseInt(userId));
          const totalDividaAtual = dividas.reduce(
            (acc, d) => acc + d.valorTotal,
            0
          );
          setTotalDivida(totalDividaAtual);

          // Busca parcelas pagas
          let totalParcelas = 0;
          for (const divida of dividas) {
            const parcelas = await parcelaService.listarPorDivida(divida.id);
            const pagas = parcelas.filter((p) => p.status === "PAGA");
            totalParcelas += pagas.reduce((acc, p) => acc + p.valor, 0);
          }
          setTotalPago(totalParcelas);
        } catch (err) {
          console.warn("⚠️ Não foi possível carregar dívidas:", err);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar propostas:", error);
      }
    };

    // Chama as duas funções
    fetchSaldo();
    fetchPropostas();
  }, []);

  // Badges estilos
  const badgeStyle = (status: StatusProposta) => {
    return {
      ABERTA: "bg-blue-100 text-blue-600",
      EM_ANALISE: "bg-yellow-100 text-yellow-700",
      APROVADA: "bg-green-100 text-green-700",
      FINANCIADA: "bg-purple-100 text-purple-700",
      EM_PAGAMENTO: "bg-violet-100 text-violet-700",
      FINALIZADA: "bg-gray-200 text-gray-700",
      REJEITADA: "bg-red-100 text-red-700",
    }[status];
  };

  // Função auxiliar para calcular data de vencimento
  const calcularDataVencimento = (prazoMeses: number): string => {
    const hoje = new Date();
    hoje.setMonth(hoje.getMonth() + prazoMeses);
    return hoje.toLocaleDateString("pt-BR");
  };

  // Função auxiliar para formatar data
  const formatarData = (data?: string): string => {
    if (!data) return new Date().toLocaleDateString("pt-BR");
    return new Date(data).toLocaleDateString("pt-BR");
  };

  // Cálculos do dashboard baseados em dados reais
  const carteiraTotal =
    totalDivida > 0
      ? totalDivida
      : emprestimos.reduce((acc, e) => acc + e.valor, 0);
  const percentualPago =
    totalDivida > 0 ? ((totalPago / totalDivida) * 100).toFixed(1) : "0.0";
  const emprestimosAtivos = emprestimos.filter(
    (e) =>
      e.status === "ABERTA" ||
      e.status === "APROVADA" ||
      e.status === "FINANCIADA"
  );

  // Dados do gráfico de pizza - distribuição dos empréstimos
  const dadosPizza = emprestimosAtivos.map((e) => ({
    name: e.empresa,
    value: e.valor,
  }));

  const totalEmprestimos = dadosPizza.reduce(
    (acc, item) => acc + item.value,
    0
  );

  // Histórico mensal - acumulação de valor ao longo do tempo
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const mesAtual = new Date().getMonth();
  const historicoMensal = meses.slice(0, mesAtual + 1).map((mes, index) => {
    if (index === mesAtual) {
      return { mes, valor: carteiraTotal };
    }
    // Simula crescimento gradual até o mês atual
    return {
      mes,
      valor: Math.floor((carteiraTotal / (mesAtual + 1)) * (index + 1)),
    };
  });

  const COLORS = [
    "#7C3AED",
    "#A78BFA",
    "#EC4899",
    "#C4B5FD",
    "#8B5CF6",
    "#D8B4FE",
  ];

  const handleResgatar = async () => {
    if (saldo <= 0) {
      setMensagem({
        tipo: "erro",
        texto: "Não há saldo disponível para resgate",
      });
      return;
    }

    setResgatando(true);
    setMensagem(null);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Usuário não encontrado");

      await saldoService.resgatar({
        valor: saldo, // Resgata todo o saldo
        usuarioId: Number(userId),
      });

      // Zera o saldo local
      setSaldo(0);

      setMensagem({
        tipo: "sucesso",
        texto:
          "Resgate realizado com sucesso! O dinheiro será transferido em até 2 dias úteis.",
      });

      // Fecha modal após 2 segundos
      setTimeout(() => {
        setShowResgatarModal(false);
        setMensagem(null);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }, 2000);
    } catch (error: unknown) {
      console.error("Erro ao resgatar:", error);
      const mensagemErro =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao processar resgate. Tente novamente.";
      setMensagem({ tipo: "erro", texto: mensagemErro });
    } finally {
      setResgatando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Notificação de sucesso */}
        {showSuccessMessage && (
          <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in">
            <CheckCircle size={24} />
            <span className="font-semibold">
              Operação realizada com sucesso!
            </span>
          </div>
        )}

        {/* Header com Portfolio Total */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-violet-500/50">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-violet-200 mb-2 text-sm">Saldo Disponível</p>
              <h1 className="text-5xl font-bold mb-2">
                R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h1>
              <p className="text-violet-100 text-sm">
                Disponível para saque e investimentos
              </p>
            </div>

            {/* Botões de Ação - Estilo Banking */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowResgatarModal(true)}
                className="flex items-center gap-2 px-8 py-4 bg-white text-violet-600 hover:bg-violet-50 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <DollarSign size={20} />
                Resgatar
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-violet-600" size={20} />
              <p className="text-gray-500 text-sm">Carteira Total</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              R${" "}
              {carteiraTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-600" size={20} />
              <p className="text-gray-500 text-sm">Percentual Pago</p>
            </div>
            <h2 className="text-2xl font-bold text-green-600">
              {percentualPago}%
            </h2>
            <p className="text-sm text-gray-500">
              R$ {totalPago.toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-blue-600" size={20} />
              <p className="text-gray-500 text-sm">Empréstimos</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {emprestimosAtivos.length}
            </h2>
            <p className="text-sm text-gray-500">ativos</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-purple-600" size={20} />
              <p className="text-gray-500 text-sm">Disponível</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              R$ {saldo.toLocaleString("pt-BR")}
            </h2>
            <p className="text-sm text-gray-500">para resgate</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Histórico de Captação */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Histórico de Captação
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="mes"
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) =>
                      `R$ ${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString("pt-BR")}`,
                      "Valor",
                    ]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "0.75rem",
                      padding: "0.75rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ fill: "#7C3AED", r: 4 }}
                    fill="url(#colorUv)"
                  />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição dos Empréstimos */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Distribuição dos Empréstimos
            </h3>
            {dadosPizza.length > 0 ? (
              <>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosPizza}
                        innerRadius={80}
                        outerRadius={120}
                        dataKey="value"
                        paddingAngle={5}
                      >
                        {dadosPizza.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          `R$ ${value.toLocaleString("pt-BR")}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {dadosPizza.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">
                          R$ {item.value.toLocaleString("pt-BR")}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {totalEmprestimos > 0
                            ? ((item.value / totalEmprestimos) * 100).toFixed(0)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  Nenhum empréstimo ativo no momento
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabela de Empréstimos Detalhados */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Empréstimos Detalhados
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                    Empresa
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                    Valor Total
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                    Valor Pago
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                    Taxa Juros
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                    Progresso
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">
                    Vencimento
                  </th>
                </tr>
              </thead>
              <tbody>
                {emprestimos.map((emp) => {
                  const progresso = (emp.pago / emp.valor) * 100;
                  return (
                    <tr
                      key={emp.id}
                      className="border-b border-gray-100 hover:bg-violet-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-800">
                          {emp.empresa}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle(
                            emp.status
                          )}`}
                        >
                          {emp.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-800">
                        R$ {emp.valor.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        R$ {emp.pago.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{emp.juros}%</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-600 rounded-full transition-all"
                              style={{ width: `${progresso}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-12">
                            {progresso.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {emp.dataVencimento}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Resgatar */}
        {showResgatarModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setShowResgatarModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Resgatar Dinheiro
                </h3>
                <button
                  onClick={() => {
                    setShowResgatarModal(false);
                    setMensagem(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Saldo Disponível</p>
                  <h2 className="text-4xl font-bold text-gray-800">
                    R${" "}
                    {saldo.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </h2>
                  <p className="text-xs text-violet-600 mt-2 font-medium">
                    Todo o saldo será resgatado
                  </p>
                </div>

                {mensagem && (
                  <div
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      mensagem.tipo === "sucesso"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {mensagem.tipo === "sucesso" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
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

                <button
                  onClick={handleResgatar}
                  disabled={
                    resgatando || mensagem?.tipo === "sucesso" || saldo <= 0
                  }
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-105 button-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DollarSign size={20} />
                  {resgatando
                    ? "Processando..."
                    : mensagem?.tipo === "sucesso"
                    ? "Resgate Confirmado!"
                    : "Confirmar Resgate Total"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  O dinheiro será transferido em até 2 dias úteis
                </p>
              </div>
            </div>
          </div>
        )}

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
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }

          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
