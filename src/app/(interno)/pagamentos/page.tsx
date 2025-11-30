"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  DollarSign,
  PieChart,
} from "lucide-react";
import { parcelaService, ParcelaResponse } from "@/services/parcela";

interface EmprestimoAtivo {
  id: number;
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
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
  const [emprestimo, setEmprestimo] = useState<EmprestimoAtivo>({
    id: 1, // aqui você pode colocar o ID real do empréstimo
    valorTotal: 0,
    valorPago: 0,
    progresso: 0,
    parcelas: [],
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // ✅ Controle de atualização
  const [pagamentoSucesso, setPagamentoSucesso] = useState(false); // ✅ Modal de sucesso
  const [pagamentoErro, setPagamentoErro] = useState<string | null>(null); // ✅ Mensagem de erro
  const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState(false); // ✅ Estado de confirmação
  const [metodoPagamento, setMetodoPagamento] = useState<
    "pix" | "boleto" | null
  >(null); // ✅ Método escolhido

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
    setAguardandoConfirmacao(true); // ✅ Ativa modo de confirmação
    setTimeout(() => setPixCopiado(false), 3000);
  };

  const pagarParcela = async () => {
    if (!selectedParcela || isUpdating) return; // ✅ Previne múltiplas chamadas

    setIsUpdating(true);
    setPagamentoErro(null);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("Usuário não logado");
      }

      await parcelaService.pagar(selectedParcela.id, Number(userId));

      // Atualiza UI localmente
      setEmprestimo((prev) => {
        const parcelasAtualizadas = prev.parcelas.map((p) =>
          p.id === selectedParcela.id ? { ...p, status: "PAGA" as const } : p
        );

        const valorPago = parcelasAtualizadas
          .filter((p) => p.status === "PAGA")
          .reduce((acc, p) => acc + p.valor, 0);

        const progresso = Math.round((valorPago / prev.valorTotal) * 100);

        return {
          ...prev,
          parcelas: parcelasAtualizadas,
          valorPago,
          progresso,
        };
      });

      // ✅ Exibe modal de sucesso
      setPagamentoSucesso(true);

      // Fecha modal de pagamento após 2 segundos
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
    if (!selectedParcela || isUpdating) return; // ✅ Previne múltiplas execuções

    setPagamentoErro(null);

    try {
      const blob = await parcelaService.gerarBoleto(selectedParcela.id);
      const url = URL.createObjectURL(blob);
      setBoletoUrl(url);
      window.open(url, "_blank");

      setMetodoPagamento("boleto");
      setAguardandoConfirmacao(true); // ✅ Ativa modo de confirmação
    } catch (err) {
      console.error("Erro ao gerar boleto:", err);
      setPagamentoErro("Erro ao gerar boleto. Tente novamente.");
    }
  };

  // ✅ Confirmar pagamento após usuário clicar em "Confirmar"
  const confirmarPagamento = async () => {
    await pagarParcela();
  };

  // ✅ Cancelar e voltar ao modal inicial
  const cancelarPagamento = () => {
    setAguardandoConfirmacao(false);
    setMetodoPagamento(null);
    setPagamentoErro(null);
  };
  // Pegar próximas parcelas do backend
  useEffect(() => {
    let isMounted = true; // ✅ Previne atualizações após desmontagem

    const fetchParcelas = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId || !isMounted) return;

        // Substitua pelo ID da dívida que você quer buscar
        const idDivida = 1;
        const parcelas = await parcelaService.listarPorDivida(idDivida);

        if (!isMounted) return; // ✅ Verifica novamente antes de atualizar

        const valorPago = parcelas
          .filter((p) => p.status === "PAGA")
          .reduce((acc, p) => acc + p.valor, 0);

        const valorTotal = parcelas.reduce((acc, p) => acc + p.valor, 0);

        const progresso = Math.round((valorPago / valorTotal) * 100);

        if (isMounted) {
          setEmprestimo({
            id: idDivida,
            valorTotal,
            valorPago,
            progresso,
            parcelas,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar parcelas:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchParcelas();

    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, []);

  if (loading) return <p className="p-6 text-center">Carregando parcelas...</p>;

  // Pega a próxima parcela que precisa ser paga
  const proximaParcela = emprestimo.parcelas.find(
    (p) => p.status === "VENCIDA" || p.status === "PENDENTE"
  );

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
              <p className="text-indigo-200 text-sm font-medium mb-1">
                Próximo Vencimento
              </p>
              <h2 className="text-3xl font-bold">
                R$ {proximaParcela?.valor.toFixed(2)}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-indigo-100 bg-indigo-800/50 px-3 py-1 rounded-full w-fit">
                <Calendar size={16} />
                <span className="text-sm font-medium">
                  {proximaParcela?.vencimento}
                </span>
                {proximaParcela?.status === "VENCIDA" && (
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
                  {Number(emprestimo.progresso).toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-violet-900 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${emprestimo.progresso}%` }}
                ></div>
              </div>
              <p className="text-xs text-white  font-medium mt-2 text-right">
                R$ {Number(emprestimo.valorPago).toFixed(2)} de R${" "}
                {Number(emprestimo.valorTotal).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* 2. LISTA DE PARCELAS */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-violet-800" />
            Histórico de Parcelas
          </h3>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {emprestimo.parcelas.map((parcela) => (
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
                      Parcela #{parcela.id}
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

      {/* 3. MODAL DE PAGAMENTO (PIX) */}
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

            {/* ✅ CARD DE SUCESSO */}
            {pagamentoSucesso ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pagamento Confirmado!
                </h3>
                <p className="text-gray-600 mb-4">
                  Parcela #{selectedParcela.id} foi paga com sucesso.
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
              /* ✅ CARD DE CONFIRMAÇÃO */
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
                    Parcela #{selectedParcela.id}
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
                {/* ✅ CARD DE ERRO */}
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
                    Parcela #{selectedParcela.id} - Vencimento{" "}
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
