"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  ChevronLeft, // ✅ Importação do ChevronLeft
  DollarSign,
  PieChart,
} from "lucide-react";
import { parcelaService, ParcelaResponse } from "@/services/parcela";
import dividaService, { DividaResponse } from "@/services/divida";

interface EmprestimoAtivo {
  id: number;
  nome: string; // ✅ Nome da dívida (vem do backend)
  valorTotal: number;
  valorPago: number;
  progresso: number;
  parcelas: ParcelaResponse[];
}

export default function PagamentosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParcela, setSelectedParcela] =
    useState<ParcelaResponse | null>(null);
  const [pixCopiado, setPixCopiado] = useState(false);

  // ✅ ESTADOS PRINCIPAIS
  const [emprestimos, setEmprestimos] = useState<EmprestimoAtivo[]>([]);
  const [currentEmprestimoIndex, setCurrentEmprestimoIndex] = useState(0); // ✅ NOVO: Rastreia qual dívida está ativa

  const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pagamentoSucesso, setPagamentoSucesso] = useState(false);
  const [pagamentoErro, setPagamentoErro] = useState<string | null>(null);
  const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<
    "pix" | "boleto" | null
  >(null);

  // ❌ REMOVIDO o estado 'emprestimo' fixo, pois estava causando o problema.

  // --- Funções de Navegação ---
  const goToNextEmprestimo = () => {
    setCurrentEmprestimoIndex((prevIndex) =>
      Math.min(prevIndex + 1, emprestimos.length - 1)
    );
  };

  const goToPrevEmprestimo = () => {
    setCurrentEmprestimoIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // Função para abrir o modal de pagamento
  const handlePagar = (parcela: ParcelaResponse) => {
    setSelectedParcela(parcela);
    setModalOpen(true);
    setPixCopiado(false);
    setPagamentoSucesso(false);
    setPagamentoErro(null);
    setAguardandoConfirmacao(false);
    setMetodoPagamento(null);
  };

  // Copiar PIX e aguardar confirmação
  const copiarPix = () => {
    navigator.clipboard.writeText(
      "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Finexus P2P6008BRASILIA62070503***6304"
    );
    setPixCopiado(true);
    setMetodoPagamento("pix");
    setAguardandoConfirmacao(true);
    setTimeout(() => setPixCopiado(false), 3000);
  };

  const pagarParcela = async () => {
    if (!selectedParcela || isUpdating) return;

    setIsUpdating(true);
    setPagamentoErro(null);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("Usuário não logado");
      }

      await parcelaService.pagar(selectedParcela.id, Number(userId));

      // ✅ Atualiza UI localmente no array 'emprestimos'
      setEmprestimos((prevEmprestimos) => {
        return prevEmprestimos.map((emp) => {
          // Garante que apenas a dívida correta seja atualizada
          if (emp.id !== selectedParcela.dividaId) return emp;

          const parcelasAtualizadas = emp.parcelas.map((p) =>
            p.id === selectedParcela.id ? { ...p, status: "PAGA" as const } : p
          );

          const valorPago = parcelasAtualizadas
            .filter((p) => p.status === "PAGA")
            .reduce((acc, p) => acc + p.valor, 0);

          const valorTotal = emp.valorTotal;

          const progresso =
            valorTotal > 0 ? Math.round((valorPago / valorTotal) * 100) : 0;

          return {
            ...emp,
            parcelas: parcelasAtualizadas,
            valorPago,
            progresso,
          };
        });
      });

      setPagamentoSucesso(true);

      setTimeout(() => {
        setModalOpen(false);
        setPagamentoSucesso(false);
      }, 2500);
    } catch (err) {
      console.error("Erro ao pagar parcela:", err);
      setPagamentoErro(
        err instanceof Error ? err.message : "Erro ao processar pagamento"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const abrirBoleto = async () => {
    if (!selectedParcela || isUpdating) return;

    setPagamentoErro(null);

    try {
      const blob = await parcelaService.gerarBoleto(selectedParcela.id);
      const url = URL.createObjectURL(blob);
      setBoletoUrl(url);
      window.open(url, "_blank");

      setMetodoPagamento("boleto");
      setAguardandoConfirmacao(true);
    } catch (err) {
      console.error("Erro ao gerar boleto:", err);
      setPagamentoErro("Erro ao gerar boleto. Tente novamente.");
    }
  };

  const confirmarPagamento = async () => {
    await pagarParcela();
  };

  const cancelarPagamento = () => {
    setAguardandoConfirmacao(false);
    setMetodoPagamento(null);
    setPagamentoErro(null);
  };

  // Pegar próximas parcelas do backend
  useEffect(() => {
    const fetchDividas = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) return;

        const dividas = await dividaService.getByTomador(userId);

        const emprestimosFormatados: EmprestimoAtivo[] = [];

        for (const divida of dividas) {
          const parcelas = await parcelaService.listarPorDivida(divida.id);

          const valorPago = parcelas
            .filter((p) => p.status === "PAGA")
            .reduce((acc, p) => acc + p.valor, 0);

          const valorTotal = parcelas.reduce((acc, p) => acc + p.valor, 0);

          const progresso =
            valorTotal > 0 ? Math.round((valorPago / valorTotal) * 100) : 0;

          // ✅ Busca o nome da proposta do backend
          const nomeDivida =
            divida.proposta?.nomeNegocio || `Empréstimo #${divida.id}`;

          emprestimosFormatados.push({
            id: divida.id,
            nome: nomeDivida, // ✅ Nome vindo do backend
            valorTotal,
            valorPago,
            progresso,
            parcelas,
          });
        }

        setEmprestimos(emprestimosFormatados);
        // Se a lista de empréstimos mudar, resetamos o índice para 0
        setCurrentEmprestimoIndex(0);
      } catch (err) {
        console.error("Erro ao carregar dívidas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDividas();
  }, []);

  if (loading) return <p className="p-6 text-center">Carregando parcelas...</p>;

  // ✅ Usar o índice para selecionar a dívida ATIVA
  const activeEmprestimo = emprestimos[currentEmprestimoIndex];
  const totalEmprestimos = emprestimos.length;

  if (!activeEmprestimo)
    return <p className="p-6 text-center">Nenhuma dívida ativa encontrada.</p>;

  // Pega a próxima parcela que precisa ser paga (usando o activeEmprestimo)
  const proximaParcela = activeEmprestimo.parcelas.find(
    (p) =>
      p.status === "VENCIDA" || p.status === "PENDENTE" || p.status === "ABERTA"
  );

  const valorProximaParcela = proximaParcela
    ? proximaParcela.valor.toFixed(2)
    : "0.00";
  const vencimentoProximaParcela = proximaParcela
    ? proximaParcela.vencimento
    : "N/A";
  const statusProximaParcela = proximaParcela ? proximaParcela.status : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER SIMPLES */}
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-violet-700">Pagamentos</h1>
        <p className="text-violet-600 text-sm mt-1">
          Gerencie as parcelas do seu empréstimo ativo.
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* 1. CARD DE RESUMO (DESTAQUE) */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          {/* Bolhas decorativas de fundo */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              {/* ✅ Exibe o NOME da dívida vindo do backend */}
              <p className="text-indigo-200 text-sm font-medium mb-1">
                {activeEmprestimo.nome}
              </p>
              <h2 className="text-3xl font-bold">R$ {valorProximaParcela}</h2>
              <div className="flex items-center gap-2 mt-2 text-indigo-100 bg-indigo-800/50 px-3 py-1 rounded-full w-fit">
                <Calendar size={16} />
                <span className="text-sm font-medium">
                  {vencimentoProximaParcela}
                </span>
                {statusProximaParcela === "VENCIDA" && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    VENCIDA
                  </span>
                )}
              </div>
            </div>

            {/* Barra de Progresso do Empréstimo */}
            <div className="w-full md:w-1/3 bg-violet-500 shadow-lg p-4 rounded-xl backdrop-blur-sm border border-violet-600/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-medium">
                  Empréstimo Quitado
                </span>
                <span className="font-bold">
                  {/* ✅ Usa activeEmprestimo */}
                  {Number(activeEmprestimo.progresso).toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-violet-900 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${activeEmprestimo.progresso}%` }}
                ></div>
              </div>
              <p className="text-xs text-white  font-medium mt-2 text-right">
                R$ {Number(activeEmprestimo.valorPago).toFixed(2)} de R${" "}
                {/* ✅ Usa activeEmprestimo */}
                {Number(activeEmprestimo.valorTotal).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* 2. LISTA DE PARCELAS */}
        <div>
          {/* ✅ NOVA ESTRUTURA: NOME DO HISTÓRICO + NAVEGAÇÃO */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <PieChart size={20} className="text-violet-800" />
              Histórico de Parcelas
            </h3>

            {/* ✅ BOTÕES DE NAVEGAÇÃO MOVIDOS */}
            {totalEmprestimos > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 hidden sm:block">
                  Dívida {currentEmprestimoIndex + 1} de {totalEmprestimos}
                </span>
                <button
                  onClick={goToPrevEmprestimo}
                  disabled={currentEmprestimoIndex === 0}
                  className="p-1.5 rounded-full text-violet-600 border border-violet-200 hover:bg-violet-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Dívida anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goToNextEmprestimo}
                  disabled={currentEmprestimoIndex === totalEmprestimos - 1}
                  className="p-1.5 rounded-full text-violet-600 border border-violet-200 hover:bg-violet-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Próxima dívida"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* ✅ Itera sobre as parcelas do activeEmprestimo */}
            {activeEmprestimo.parcelas.map((parcela) => (
              <div
                key={parcela.id}
                className={`flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition-colors ${
                  parcela.status === "VENCIDA"
                    ? "bg-red-50 hover:bg-red-100/50"
                    : ""
                }`}
              >
                {/* Lado Esquerdo: Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                    ${
                      parcela.status === "PAGA"
                        ? "bg-green-100 text-green-600"
                        : parcela.status === "VENCIDA"
                        ? "bg-red-100 text-red-600"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {parcela.status === "PAGA" ? (
                      <CheckCircle2 size={20} />
                    ) : parcela.status === "VENCIDA" ? (
                      <AlertCircle size={20} />
                    ) : (
                      <DollarSign size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      Parcela #{parcela.numeroParcela}
                    </p>
                    <p
                      className={`text-sm ${
                        parcela.status === "VENCIDA"
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Vence em {parcela.vencimento}
                    </p>
                  </div>
                </div>

                {/* Lado Direito: Valor e Ação */}
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700 hidden sm:block">
                    R$ {parcela.valor.toFixed(2)}
                  </span>

                  {parcela.status === "PAGA" ? (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full border border-gray-200">
                      PAGO
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePagar(parcela)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          parcela.status === "VENCIDA"
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200 shadow-md"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-md"
                        }`}
                    >
                      Pagar
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MODAL DE PAGAMENTO (PIX) - Sem alterações de layout */}
      {modalOpen && selectedParcela && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={isUpdating}
            >
              ✕
            </button>

            {/* CARD DE SUCESSO */}
            {pagamentoSucesso ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pagamento Confirmado!
                </h3>
                <p className="text-gray-600 mb-4">
                  Parcela #{selectedParcela.numeroParcela} foi paga com sucesso.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ Valor: R$ {selectedParcela.valor.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    O comprovante foi enviado para seu email.
                  </p>
                </div>
              </div>
            ) : aguardandoConfirmacao ? (
              /* CARD DE CONFIRMAÇÃO */
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Confirmar Pagamento
                </h3>
                <p className="text-gray-600 mb-4">
                  {metodoPagamento === "pix"
                    ? "Você copiou o código PIX. Deseja confirmar o pagamento?"
                    : "Você baixou o boleto. Deseja confirmar o pagamento?"}
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-indigo-700 font-medium">
                    Parcela #{selectedParcela.numeroParcela}
                  </p>
                  <p className="text-2xl font-bold text-indigo-900 mt-2">
                    R$ {selectedParcela.valor.toFixed(2)}
                  </p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Vencimento: {selectedParcela.vencimento}
                  </p>
                </div>

                {pagamentoErro && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle
                      size={20}
                      className="text-red-600 shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-red-700 font-medium">
                      {pagamentoErro}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={cancelarPagamento}
                    disabled={isUpdating}
                    className="flex-1 py-3.5 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarPagamento}
                    disabled={isUpdating}
                    className="flex-1 py-3.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Confirmando..." : "Confirmar Pagamento"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* CARD DE ERRO */}
                {pagamentoErro && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle
                      size={20}
                      className="text-red-600 shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-red-700 font-medium">
                      {pagamentoErro}
                    </p>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <CreditCard size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Realizar Pagamento
                  </h3>
                  <p className="text-gray-500">
                    Parcela #{selectedParcela.numeroParcela} - Vencimento{" "}
                    {selectedParcela.vencimento}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex flex-col items-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Escaneie o QR Code
                  </p>
                  {/* Placeholder do QR Code */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BOLETO-${selectedParcela.id}`}
                    alt="QR Code"
                    className="w-48 h-48 rounded-lg border-2 border-indigo-100 mb-4"
                  />
                  <div className="text-2xl font-bold text-gray-800">
                    R$ {selectedParcela.valor.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={abrirBoleto}
                  disabled={isUpdating}
                  className="w-full mt-4 py-3.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Processando..." : "Abrir Boleto (PDF)"}
                </button>

                <button
                  onClick={copiarPix}
                  disabled={isUpdating}
                  className={`w-full mt-3 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      pixCopiado
                        ? "bg-green-500 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                    }`}
                >
                  {isUpdating ? (
                    "Processando..."
                  ) : pixCopiado ? (
                    <>
                      <CheckCircle2 size={20} />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      Copiar Código PIX
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                  O pagamento pode levar até 30 minutos para ser processado.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
