// ============================================
// mei/solicitar-emprestimo/page.tsx
// ============================================
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Etapa1 from "./components/Etapa1";
import Etapa2 from "./components/Etapa2";
import Etapa3 from "./components/Etapa3";
import Etapa4Sucesso from "./components/Etapa4Sucesso";
// importações de constantes removidas pois são usadas apenas nos componentes

// ============================================
// 1. TIPOS E INTERFACES
// ============================================
interface FormData {
  // Etapa 1: Dados do Negócio
  nomeNegocio: string;
  cnpj: string;
  categoria: string;
  descricaoNegocio: string;
  tempoAtuacao: string;
  faturamentoMensal: string;

  // Etapa 2: Dados do Empréstimo
  valorSolicitado: string;
  prazo: string;
  finalidade: string;
  descricaoFinalidade: string;

  // Etapa 3: Documentos (placeholder)
  documentos: File[];
}

interface FormErrors {
  [key: string]: string;
}

type Etapa = 1 | 2 | 3 | 4;

// ============================================
// 2. DADOS AUXILIARES
// ============================================

// ============================================
// 3. FUNÇÕES AUXILIARES
// ============================================
const formatarCNPJ = (valor: string): string => {
  const numeros = valor.replace(/\D/g, "");
  return numeros
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const formatarMoeda = (valor: string): string => {
  const numeros = valor.replace(/\D/g, "");
  const valorNumerico = Number(numeros) / 100;
  return valorNumerico.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const calcularSimulacao = (valor: number, prazo: number) => {
  const taxaMensal = 1.5 / 100; // 1.5% a.m. (exemplo)
  const montante = valor * Math.pow(1 + taxaMensal, prazo);
  const parcelaMensal = montante / prazo;

  return {
    valorTotal: montante,
    parcelaMensal: parcelaMensal,
    totalJuros: montante - valor,
    taxaMensal: 1.5,
  };
};

// ============================================
// 4. COMPONENTE PRINCIPAL
// ============================================
export default function SolicitarEmprestimoPage() {
  const router = useRouter();

  // Estados
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nomeNegocio: "",
    cnpj: "",
    categoria: "",
    descricaoNegocio: "",
    tempoAtuacao: "",
    faturamentoMensal: "",
    valorSolicitado: "",
    prazo: "36",
    finalidade: "",
    descricaoFinalidade: "",
    documentos: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // ============================================
  // 5. HANDLERS
  // ============================================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let valorFormatado = value;

    // Formatações específicas
    if (name === "cnpj") {
      valorFormatado = formatarCNPJ(value);
    } else if (name === "valorSolicitado" || name === "faturamentoMensal") {
      valorFormatado = formatarMoeda(value);
    }

    setFormData((prev) => ({ ...prev, [name]: valorFormatado }));

    // Limpa erro do campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => {
      const novosDocs = [...prev.documentos, ...files];
      // Limpa erro se anexou pelo menos 1 documento
      if (novosDocs.length > 0 && errors.documentos) {
        setErrors((prev) => ({ ...prev, documentos: "" }));
      }
      return {
        ...prev,
        documentos: novosDocs,
      };
    });
  };

  const removerArquivo = (index: number) => {
    setFormData((prev) => {
      const novosDocs = prev.documentos.filter((_, i) => i !== index);
      // Limpa erro se ainda restar pelo menos 1 documento
      if (novosDocs.length > 0 && errors.documentos) {
        setErrors((prev) => ({ ...prev, documentos: "" }));
      }
      return {
        ...prev,
        documentos: novosDocs,
      };
    });
  };

  // ============================================
  // 6. VALIDAÇÕES
  // ============================================
  const validarEtapa1 = (): boolean => {
    const novosErros: FormErrors = {};

    if (!formData.nomeNegocio.trim()) {
      novosErros.nomeNegocio = "Nome do negócio é obrigatório";
    }

    if (!formData.cnpj.trim()) {
      novosErros.cnpj = "CNPJ é obrigatório";
    } else if (formData.cnpj.replace(/\D/g, "").length !== 14) {
      novosErros.cnpj = "CNPJ inválido";
    }

    if (!formData.categoria) {
      novosErros.categoria = "Selecione uma categoria";
    }

    if (!formData.descricaoNegocio.trim()) {
      novosErros.descricaoNegocio = "Descrição é obrigatória";
    } else if (formData.descricaoNegocio.length < 50) {
      novosErros.descricaoNegocio =
        "Descrição deve ter no mínimo 50 caracteres";
    }

    if (!formData.tempoAtuacao) {
      novosErros.tempoAtuacao = "Tempo de atuação é obrigatório";
    }

    if (!formData.faturamentoMensal) {
      novosErros.faturamentoMensal = "Faturamento é obrigatório";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa2 = (): boolean => {
    const novosErros: FormErrors = {};

    if (!formData.valorSolicitado) {
      novosErros.valorSolicitado = "Valor é obrigatório";
    } else {
      const valor = parseFloat(
        formData.valorSolicitado.replace(/\./g, "").replace(",", ".")
      );
      if (valor < 1000) {
        novosErros.valorSolicitado = "Valor mínimo: R$ 1.000,00";
      } else if (valor > 500000) {
        novosErros.valorSolicitado = "Valor máximo: R$ 500.000,00";
      }
    }

    if (!formData.finalidade) {
      novosErros.finalidade = "Selecione a finalidade";
    }

    if (!formData.descricaoFinalidade.trim()) {
      novosErros.descricaoFinalidade = "Descreva como usará o recurso";
    } else if (formData.descricaoFinalidade.length < 30) {
      novosErros.descricaoFinalidade =
        "Descrição deve ter no mínimo 30 caracteres";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa3 = (): boolean => {
    const novosErros: FormErrors = {};

    if (formData.documentos.length === 0) {
      novosErros.documentos = "Envie pelo menos 1 documento";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // ============================================
  // 7. NAVEGAÇÃO ENTRE ETAPAS
  // ============================================
  const proximaEtapa = () => {
    let valido = false;

    if (etapaAtual === 1) {
      valido = validarEtapa1();
    } else if (etapaAtual === 2) {
      valido = validarEtapa2();
    } else if (etapaAtual === 3) {
      valido = validarEtapa3();
    }

    if (valido && etapaAtual < 4) {
      setEtapaAtual((prev) => (prev + 1) as Etapa);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual((prev) => (prev - 1) as Etapa);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ============================================
  // 8. SUBMISSÃO FINAL
  // ============================================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validarEtapa3()) return;

    setLoading(true);

    try {
      // SIMULAÇÃO DE ENVIO
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Enviar para backend
      // const formDataToSend = new FormData();
      // formDataToSend.append("nomeNegocio", formData.nomeNegocio);
      // ... adicionar todos os campos
      // formData.documentos.forEach(doc => formDataToSend.append("documentos", doc));

      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emprestimos`, {
      //   method: "POST",
      //   body: formDataToSend,
      // });

      console.log("Dados enviados:", formData);

      // Vai para página de sucesso
      setEtapaAtual(4);
    } catch (erro: unknown) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao enviar solicitação";
      setErrors({ geral: mensagem });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 9. CÁLCULO DA SIMULAÇÃO
  // ============================================
  const valorNumerico =
    parseFloat(formData.valorSolicitado.replace(/\./g, "").replace(",", ".")) ||
    0;
  const prazoNumerico = parseInt(formData.prazo) || 36;
  const simulacao = calcularSimulacao(valorNumerico, prazoNumerico);

  // ============================================
  // 10. RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-violet-600 hover:text-violet-800 mb-6 font-medium transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para Dashboard
        </button>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Solicitar Empréstimo
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Preencha os dados para análise e receba propostas de investidores
          </p>
        </div>

        {/* Stepper - Indicador de Etapas */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { num: 1, label: "Negócio" },
              { num: 2, label: "Empréstimo" },
              { num: 3, label: "Documentos" },
              { num: 4, label: "Revisão" },
            ].map((etapa, index) => (
              <div key={etapa.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      etapaAtual >= etapa.num
                        ? "bg-violet-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {etapaAtual > etapa.num ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      etapa.num
                    )}
                  </div>
                  <span
                    className={`text-xs md:text-sm mt-2 font-medium ${
                      etapaAtual >= etapa.num
                        ? "text-violet-600"
                        : "text-gray-500"
                    }`}
                  >
                    {etapa.label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      etapaAtual > etapa.num ? "bg-violet-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* ETAPA 1: Dados do Negócio */}
            {etapaAtual === 1 && (
              <Etapa1
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {/* ETAPA 2: Dados do Empréstimo */}
            {etapaAtual === 2 && (
              <Etapa2
                formData={formData}
                errors={errors}
                onChange={handleChange}
                simulacao={simulacao}
              />
            )}

            {/* ETAPA 3: Documentos */}
            {etapaAtual === 3 && (
              <Etapa3
                formData={formData}
                errors={errors}
                onFileUpload={handleFileUpload}
                onRemoveFile={removerArquivo}
              />
            )}

            {/* ETAPA 4: Revisão */}
            {etapaAtual === 4 && (
              <Etapa4Sucesso
                formData={formData}
                onVoltar={() => setEtapaAtual(3)}
              />
            )}

            {/* Botões de Navegação */}
            {etapaAtual < 4 && (
              <div className="flex flex-col-reverse md:flex-row gap-4 mt-8">
                {etapaAtual > 1 && (
                  <button
                    type="button"
                    onClick={etapaAnterior}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Voltar
                  </button>
                )}

                {etapaAtual < 3 ? (
                  <button
                    type="button"
                    onClick={proximaEtapa}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Solicitação
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
