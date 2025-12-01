"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Search,
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

// --------- IMPORT DOS SERVICES QUE VOCÊ ENVIOU ----------
import { propostaService, PropostaResponse } from "@/services/proposta";
import dividaService, { DividaResponse } from "@/services/divida";
import { parcelaService, ParcelaResponse } from "@/services/parcela";
import { saldoService, SaldoResponse } from "@/services/saldo";
// -------------------------------------------------------

type TipoTransacao = "entrada" | "saida";

interface Transacao {
  id: string | number;
  tipo: TipoTransacao;
  descricao: string;
  categoria: string;
  valor: number;
  data: string; // ISO
  status: "Concluído" | "Pendente" | "Cancelado";
  empresa?: string;
  origem?: string; // por exemplo: "proposta" ou "parcela"
}

function formatarDataISO(dateStr: string | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

function monthKeyFromISO(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function ExtratoMEI() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [fluxoMensal, setFluxoMensal] = useState<any[]>([]);
  const [historicoSaldo, setHistoricoSaldo] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [saldoBackend, setSaldoBackend] = useState(0);

  // filtros UI
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">(
    "todos"
  );
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | Transacao["status"]
  >("todos");
  const [busca, setBusca] = useState<string>("");
  const [periodo, setPeriodo] = useState<"7" | "30" | "90" | "365">("30");

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro(null);

      try {
        // pega userId do localStorage (salvo no login)
        const rawId = localStorage.getItem("userId");
        if (!rawId)
          throw new Error("Usuário não autenticado (userId ausente).");
        const userId = Number(rawId);

        // 1) Buscar propostas do usuário => mapear propostas FINANCIADAS como "Empréstimo recebido"
        const propostas: PropostaResponse[] =
          await propostaService.buscarPorUsuario(userId);

        const propostasFinanciadas = propostas.filter(
          (p) =>
            p.status === "FINANCIADA" ||
            (p.status && p.status.toUpperCase() === "FINANCIADA")
        );

        const entradasDePropostas: Transacao[] = propostasFinanciadas.map(
          (p) => ({
            id: `proposta-${p.id}`,
            tipo: "entrada",
            descricao: `Empréstimo recebido - ${p.nomeNegocio}`,
            categoria: "Empréstimo",
            valor: p.valorSolicitado ?? 0,
            data: formatarDataISO(p.dataCriacao ?? new Date().toISOString()),
            status: "Concluído",
            empresa: p.nomeNegocio ?? undefined,
            origem: "proposta",
          })
        );

        // 2) Buscar dívidas do tomador
        const dividas: DividaResponse[] = await dividaService.getByTomador(
          userId
        );

        // 3) Para cada dívida, buscar parcelas e filtrar PARCELAS PAGA
        const parcelasPromises = dividas.map(async (d) => {
          const lista: ParcelaResponse[] = await parcelaService.listarPorDivida(
            d.id
          );
          // filtrar só PAGA
          const pagas = lista.filter((pa) => pa.status === "PAGA");

          // Buscar nome do negócio da proposta relacionada
          let nomeNegocio = "Negócio";
          if (d.proposta?.id) {
            try {
              const proposta = await propostaService.buscarPorId(d.proposta.id);
              nomeNegocio = proposta.nomeNegocio || "Negócio";
            } catch (err) {
              console.warn("Erro ao buscar nome do negócio:", err);
            }
          }

          // mapear para Transacao (saída do tomador)
          const trans = pagas.map<Transacao>((pa) => ({
            id: `parcela-${pa.id}`,
            tipo: "saida",
            descricao: `Pagamento ${nomeNegocio}`,
            categoria: `Parcela ${pa.numeroParcela ?? ""}/${lista.length}`,
            valor: pa.valor,
            data: formatarDataISO(pa.dataPagamento ?? pa.vencimento),
            status: "Concluído",
            empresa: nomeNegocio,
            origem: "parcela",
          }));
          return trans;
        });

        const parcelasPorDivida = await Promise.all(parcelasPromises);
        const todasParcelasPagas = parcelasPorDivida.flat();

        // 4) (Opcional) buscar saldo atual para exibir — não usado nas transações diretas, mas útil
        // após buscar saldo
        let saldo: SaldoResponse | null = null;
        try {
          saldo = await saldoService.buscarPorUsuario(userId);
        } catch (e) {
          saldo = null;
        }

        setSaldoBackend(saldo?.valor ?? 0);

        // 5) Combinar transações (entradas de propostas + parcelas pagas)
        const todasTransacoes: Transacao[] = [
          ...entradasDePropostas,
          ...todasParcelasPagas,
        ];

        // ordenar por data desc
        todasTransacoes.sort((a, b) => {
          const da = new Date(a.data).getTime();
          const db = new Date(b.data).getTime();
          return db - da;
        });

        setTransacoes(todasTransacoes);

        // 6) Montar fluxoMensal e historicoSaldo a partir das transacoes
        // Agrupar por mês (YYYY-MM) e somar entradas/saidas
        const mapMes = new Map<
          string,
          { entradas: number; saidas: number; saldo: number }
        >();

        // Inicial: pega últimos 12 meses até hoje
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          mapMes.set(key, { entradas: 0, saidas: 0, saldo: 0 });
        }

        // Preencher
        for (const t of todasTransacoes) {
          const key = monthKeyFromISO(t.data);
          if (!mapMes.has(key)) {
            mapMes.set(key, { entradas: 0, saidas: 0, saldo: 0 });
          }
          const cur = mapMes.get(key)!;
          if (t.tipo === "entrada") cur.entradas += t.valor;
          else cur.saidas += t.valor;
          cur.saldo = cur.entradas - cur.saidas;
        }

        // Transformar para arrays ordenados por mês
        const fluxoArr: { mes: string; entradas: number; saidas: number }[] =
          [];
        const saldoArr: { mes: string; saldo: number }[] = [];

        // sort keys ascending month
        const keysSorted = Array.from(mapMes.keys()).sort();
        for (const key of keysSorted) {
          const { entradas, saidas, saldo: s } = mapMes.get(key)!;
          // format month label "Nov/2025" -> "Nov"
          const [y, m] = key.split("-");
          const dateLabel = new Date(
            Number(y),
            Number(m) - 1,
            1
          ).toLocaleString("pt-BR", { month: "short" });
          fluxoArr.push({
            mes: dateLabel,
            entradas: Math.round(entradas),
            saidas: Math.round(saidas),
          });
          saldoArr.push({ mes: dateLabel, saldo: Math.round(s) });
        }

        setFluxoMensal(fluxoArr);
        setHistoricoSaldo(saldoArr);
      } catch (err: any) {
        console.error(err);
        setErro(err?.message || "Erro ao carregar extrato.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // cálculo para cards
  const totalEntradas = transacoes
    .filter((t) => t.tipo === "entrada" && t.status === "Concluído")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoes
    .filter((t) => t.tipo === "saida" && t.status === "Concluído")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoAtual = saldoBackend;

  // filtros locais (ui)
  const transacoesFiltradas = transacoes.filter((t) => {
    const matchTipo = filtroTipo === "todos" || t.tipo === filtroTipo;
    const matchStatus = filtroStatus === "todos" || t.status === filtroStatus;
    const matchBusca =
      !busca ||
      t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      (t.empresa && t.empresa.toLowerCase().includes(busca.toLowerCase()));
    return matchTipo && matchStatus && matchBusca;
  });

  const formatarData = (data: string) => {
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) return data;
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-violet-600 font-semibold animate-pulse">
          Carregando extrato...
        </span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-700">Erro</h2>
          <p className="text-red-600 mt-2">{erro}</p>
        </div>
      </div>
    );
  }

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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <div className="p-3 bg-violet-100 rounded-2xl mb-3">
              <DollarSign className="text-violet-600" size={24} />
            </div>
            <p className="text-gray-500 text-sm mb-2">Saldo Atual</p>
            <h2 className="text-3xl font-bold text-gray-800">
              R$ {saldoAtual.toLocaleString("pt-BR")}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
            <div className="p-3 bg-green-100 rounded-2xl mb-3">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <p className="text-gray-500 text-sm mb-2">Total de Entradas</p>
            <h2 className="text-3xl font-bold text-green-600">
              R$ {totalEntradas.toLocaleString("pt-BR")}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100">
            <div className="p-3 bg-red-100 rounded-2xl mb-3">
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <p className="text-gray-500 text-sm mb-2">Total de Saídas</p>
            <h2 className="text-3xl font-bold text-red-600">
              R$ {totalSaidas.toLocaleString("pt-BR")}
            </h2>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-violet-200/50 border border-violet-100">
            <h3 className="text-xl font-bold mb-4">Fluxo de Caixa Mensal</h3>
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
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar dataKey="saidas" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-violet-200/50 border border-violet-100">
            <h3 className="text-xl font-bold mb-4">Evolução do Saldo</h3>
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
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#8b5cf6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filtros e Lista */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Todas as Transações
            </h3>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial lg:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar transação..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="todos">Todos os tipos</option>
                <option value="entrada">Entradas</option>
                <option value="saida">Saídas</option>
              </select>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="todos">Todos os status</option>
                <option value="Concluído">Concluído</option>
                <option value="Pendente">Pendente</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold">
                <Download size={18} />
                Exportar
              </button>
            </div>
          </div>

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
              transacoesFiltradas.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl transition-all cursor-pointer border border-gray-100 hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-xl shadow-sm ${
                        t.tipo === "entrada" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {t.tipo === "entrada" ? (
                        <ArrowDownRight className="text-green-600" size={24} />
                      ) : (
                        <ArrowUpRight className="text-red-600" size={24} />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {t.descricao}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {t.empresa || t.categoria}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {formatarData(t.data)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                        t.status === "Concluído"
                          ? "bg-green-100 text-green-700"
                          : t.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="text-right ml-6">
                    <p
                      className={`text-xl font-bold ${
                        t.tipo === "entrada" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.tipo === "entrada" ? "+" : "-"}R${" "}
                      {t.valor.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
