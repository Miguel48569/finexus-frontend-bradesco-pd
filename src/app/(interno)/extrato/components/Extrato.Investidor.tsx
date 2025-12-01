


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react";
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

import {
  investimentoService,
  InvestimentoResponse,
} from "@/services/investimento";
import dividaService from "@/services/divida";
import { parcelaService, ParcelaResponse } from "@/services/parcela";
import { saldoService, SaldoResponse } from "@/services/saldo";

// --- Tipos auxiliares para transações da UI ---
type UITransaction = {
  id: string | number;
  type: "investment" | "return";
  title: string;
  description: string;
  date: string; // ISO
  amount: number;
  status: string;
};

export default function InvestorStatement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saldo, setSaldo] = useState<SaldoResponse | null>(null);
  const [investments, setInvestments] = useState<InvestimentoResponse[]>([]);
  const [transactions, setTransactions] = useState<UITransaction[]>([]);

  // filtros / UI
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos os tipos");
  const [statusFilter, setStatusFilter] = useState("Todos os status");
  const [periodFilter, setPeriodFilter] = useState("Últimos 30 dias");

  // Totais calculados
  const totalInvested = useMemo(() => {
    return investments.reduce((acc, it) => acc + (it.valorInvestido ?? 0), 0);
  }, [investments]);

  const totalReturns = useMemo(() => {
    return transactions
      .filter((t) => t.type === "return")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const portfolioValue = useMemo(() => {
    const s = saldo?.valor ?? 0;
    return s + totalInvested + totalReturns;
  }, [saldo, totalInvested, totalReturns]);

  // charts
  const [cashFlowData, setCashFlowData] = useState<
    { month: string; investimentos: number; retornos: number }[]
  >([]);

  const [portfolioData, setPortfolioData] = useState<
    { month: string; value: number }[]
  >([]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError(null);

      try {
        const raw =
          localStorage.getItem("userId") ??
          localStorage.getItem("usuarioId") ??
          localStorage.getItem("id");

        if (!raw) throw new Error("Usuário não encontrado no localStorage.");

        const userId = Number(raw);
        if (Number.isNaN(userId)) throw new Error("ID do usuário inválido.");

        // saldo
        try {
          const s = await saldoService.buscarPorUsuario(userId);
          setSaldo(s);
        } catch (err) {
          console.warn("Erro ao buscar saldo", err);
        }

        // investimentos do usuário
        const invs = await investimentoService.listarPorInvestidor(userId);
        setInvestments(invs || []);

        // coletar ids de propostas únicas
        const propostaIds = Array.from(
          new Set(invs.map((i) => i.proposta?.id).filter(Boolean))
        );

        const propostasData = await Promise.all(
          propostaIds.map(async (pid) => {
            try {
              const divida = await dividaService.getByProposta(pid);
              if (!divida || (divida as any).id === undefined) {
                return {
                  pid,
                  divida: null,
                  parcelas: [] as ParcelaResponse[],
                  investimentosProposta: [] as InvestimentoResponse[],
                };
              }

              const dividaId = (divida as any).id ?? null;

              let parcelas: ParcelaResponse[] = [];
              if (dividaId) {
                parcelas = await parcelaService.listarPorDivida(dividaId);
              }

              const investimentosProposta =
                await investimentoService.listarPorProposta(pid);

              return { pid, divida, parcelas, investimentosProposta };
            } catch (err) {
              console.warn("Erro carregando dados da proposta", pid, err);
              return {
                pid,
                divida: null,
                parcelas: [] as ParcelaResponse[],
                investimentosProposta: [] as InvestimentoResponse[],
              };
            }
          })
        );

        // montar transações
        const uiTxns: UITransaction[] = [];

        // investimentos
        for (const inv of invs) {
          uiTxns.push({
            id: `inv-${inv.id}`,
            type: "investment",
            title: "Investimento realizado",
            description: inv.proposta?.nomeNegocio ?? "Proposta",
            date: inv.dataInvestimento ?? new Date().toISOString(),
            amount: -(inv.valorInvestido ?? 0),
            status: inv.status ?? "Concluído",
          });
        }

        // retornos
        for (const pd of propostasData) {
          const { pid, parcelas, investimentosProposta } = pd;

          if (!parcelas.length) continue;

          const somaTotal = investimentosProposta.reduce(
            (s, it) => s + (it.valorInvestido ?? 0),
            0
          );

          const myInvest = investimentosProposta.find(
            (it) =>
              it.investidor?.id ===
              Number(
                localStorage.getItem("userId") ??
                  localStorage.getItem("usuarioId") ??
                  localStorage.getItem("id")
              )
          );
          if (!myInvest) continue;

          const share = somaTotal
            ? (myInvest.valorInvestido ?? 0) / somaTotal
            : 0;

          for (const p of parcelas) {
            const st = (p.status ?? "").toUpperCase();
            if (st === "PAGA" || st === "PAGO") {
              const valor = (p.valor ?? 0) * share;

              uiTxns.push({
                id: `ret-${pid}-${p.id}`,
                type: "return",
                title: "Retorno recebido",
                description: `Parcela #${p.numeroParcela} - Proposta ${pid}`,
                date:
                  p.dataPagamento ??
                  p.vencimento ??
                  new Date().toISOString(),
                amount: Number(valor.toFixed(2)),
                status: "Concluído",
              });
            }
          }
        }

        uiTxns.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(uiTxns);

        // CHARTS
        const monthKey = (iso: string) => {
          const d = new Date(iso);
          if (isNaN(d.getTime())) return "Unknown";
          return d.toLocaleString("pt-BR", {
            month: "short",
            year: "numeric",
          });
        };

        const monthMap = new Map<
          string,
          { investimentos: number; retornos: number }
        >();

        const portfolioMap = new Map<string, number>();

        let cumulative = 0;
        const chronological = [...uiTxns].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        for (const tx of chronological) {
          const key = monthKey(tx.date);
          if (!monthMap.has(key))
            monthMap.set(key, { investimentos: 0, retornos: 0 });

          if (tx.type === "investment") {
            monthMap.get(key)!.investimentos += Math.abs(tx.amount);
            cumulative += Math.abs(tx.amount);
          } else {
            monthMap.get(key)!.retornos += tx.amount;
            cumulative += tx.amount;
          }

          portfolioMap.set(key, (saldo?.valor ?? 0) + cumulative);
        }

        const sortedMonths = Array.from(monthMap.keys()).sort(
          (a, b) => new Date("1 " + a).getTime() - new Date("1 " + b).getTime()
        );

        setCashFlowData(
          sortedMonths.map((k) => ({
            month: k.split(" ")[0],
            investimentos: Math.round(monthMap.get(k)!.investimentos),
            retornos: Math.round(monthMap.get(k)!.retornos),
          }))
        );

        setPortfolioData(
          sortedMonths.map((k) => ({
            month: k.split(" ")[0],
            value: Math.round(portfolioMap.get(k) ?? 0),
          }))
        );

        setLoading(false);
      } catch (err: any) {
        setError(err.message ?? "Erro ao carregar extrato.");
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  // filtros
  const filteredTransactions = transactions.filter((t) => {
    const q = searchTerm.trim().toLowerCase();

    if (
      q &&
      !(
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    )
      return false;

    if (typeFilter === "Investimentos" && t.type !== "investment") return false;
    if (typeFilter === "Retornos" && t.type !== "return") return false;

    if (statusFilter === "Concluído" && t.status !== "Concluído") return false;
    if (statusFilter === "Pendente" && t.status !== "Pendente") return false;

    if (periodFilter.startsWith("Últimos")) {
      const days = Number(periodFilter.match(/\d+/)?.[0] ?? 30);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      if (new Date(t.date) < cutoff) return false;
    }

    return true;
  });

  // --- EXPORTAÇÃO CSV ---
  function exportCSV() {
    const rows = [
      ["Tipo", "Título", "Descrição", "Data", "Valor", "Status"],
      ...transactions.map((t) => [
        t.type,
        t.title,
        t.description,
        new Date(t.date).toLocaleString(),
        t.amount.toFixed(2),
        t.status,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows
        .map((row) =>
          row
            .map((col) => `"${String(col).replace(/"/g, '""')}"`)
            .join(";")
        )
        .join("\n");

    const encoded = encodeURI(csvContent);

    const link = document.createElement("a");
    link.href = encoded;
    link.download = "extrato.csv";
    link.click();
  }

  function formatCurrency(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4">Carregando seu extrato...</div>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p>Tente limpar o localStorage ou confirmar que o usuário está logado.</p>
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
          <p className="text-gray-500">Acompanhe todos os seus investimentos e retornos</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-violet-100 rounded-2xl">
                <DollarSign className="text-violet-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Portfólio Total</p>
            <h2 className="text-3xl font-bold text-gray-800">{formatCurrency(portfolioValue)}</h2>
            <p className="text-xs text-gray-400 mt-1">Saldo: {saldo ? formatCurrency(saldo.valor) : "—"}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-2xl">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Total Investido</p>
            <h2 className="text-3xl font-bold text-blue-600">{formatCurrency(totalInvested)}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-100 rounded-2xl">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-2">Total em Retornos</p>
            <h2 className="text-3xl font-bold text-green-600">{formatCurrency(totalReturns)}</h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fluxo Mensal */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Fluxo Mensal</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="investimentos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="retornos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evolução do Portfólio */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Evolução do Portfólio</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transações */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Todas as Transações</h3>
            <div className="flex items-center gap-3">
              <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
                <Download size={18} />
                Exportar
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto mb-6">
            <input
              type="text"
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
            />

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
              <option>Todos os tipos</option>
              <option>Investimentos</option>
              <option>Retornos</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
              <option>Todos os status</option>
              <option>Concluído</option>
              <option>Pendente</option>
            </select>

            <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
              <option>Últimos 30 dias</option>
              <option>Últimos 60 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>

          {/* Lista de Transações */}
          <div className="space-y-3">
            {filteredTransactions.length === 0 && <div className="text-gray-500 p-4">Nenhuma transação encontrada.</div>}

            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white hover:from-violet-50 hover:to-white rounded-2xl transition-all cursor-pointer border border-gray-100 hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-xl shadow-sm ${transaction.type === "investment" ? "bg-blue-100" : "bg-green-100"}`}>
                    {transaction.type === "investment" ? (
                      <TrendingUp className="text-blue-600" size={24} />
                    ) : (
                      <TrendingDown className="text-green-600" size={24} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">{transaction.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{transaction.description}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${transaction.status === "Concluído" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {transaction.status}
                  </span>
                </div>

                <div className="text-right ml-6">
                  <p className={`text-xl font-bold ${transaction.amount > 0 ? "text-green-600" : "text-blue-600"}`}>
                    {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
