// ============================================
// mei/solicitar-emprestimo/page.tsx
// ============================================
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  Target,
  Info,
  Calculator,
} from "lucide-react";

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
const CATEGORIAS = [
  "Alimentação",
  "Varejo",
  "Serviços",
  "Beleza",
  "Logística",
  "Tecnologia",
  "Saúde",
  "Educação",
  "Construção",
  "Outro",
];

const FINALIDADES = [
  "Compra de Equipamentos",
  "Expansão do Negócio",
  "Capital de Giro",
  "Reforma/Adequação",
  "Marketing e Divulgação",
  "Contratação de Pessoal",
  "Estoque",
  "Outro",
];

const PRAZOS = [
  { valor: "12", label: "12 meses" },
  { valor: "24", label: "24 meses" },
  { valor: "36", label: "36 meses" },
  { valor: "48", label: "48 meses" },
];

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
    setFormData((prev) => ({
      ...prev,
      documentos: [...prev.documentos, ...files],
    }));
  };

  const removerArquivo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index),
    }));
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
          onClick={() => router.push("/mei/dashboard")}
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

            {/* ETAPA 4: Sucesso */}
            {etapaAtual === 4 && <Etapa4Sucesso />}

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

// ============================================
// 11. COMPONENTES DAS ETAPAS
// ============================================

// ETAPA 1: Dados do Negócio
interface Etapa1Props {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

function Etapa1({ formData, errors, onChange }: Etapa1Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-100 p-3 rounded-lg">
          <Building2 className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dados do Seu Negócio
          </h2>
          <p className="text-sm text-gray-600">Conte-nos sobre sua empresa</p>
        </div>
      </div>

      {/* Nome do Negócio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome do Negócio <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nomeNegocio"
          value={formData.nomeNegocio}
          onChange={onChange}
          placeholder="Ex: Cafeteria Aroma Bom"
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
            errors.nomeNegocio ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.nomeNegocio && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.nomeNegocio}
          </p>
        )}
      </div>

      {/* CNPJ e Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CNPJ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={onChange}
            placeholder="00.000.000/0000-00"
            maxLength={18}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
              errors.cnpj ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.cnpj && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.cnpj}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Categoria <span className="text-red-500">*</span>
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={onChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
              errors.categoria ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Selecione...</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.categoria}
            </p>
          )}
        </div>
      </div>

      {/* Descrição do Negócio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descrição do Negócio <span className="text-red-500">*</span>
        </label>
        <textarea
          name="descricaoNegocio"
          value={formData.descricaoNegocio}
          onChange={onChange}
          rows={4}
          placeholder="Conte sobre sua empresa, tempo de mercado, diferenciais, público-alvo..."
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none ${
            errors.descricaoNegocio ? "border-red-500" : "border-gray-200"
          }`}
        />
        <div className="flex justify-between mt-1">
          <div>
            {errors.descricaoNegocio && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.descricaoNegocio}
              </p>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {formData.descricaoNegocio.length}/500
          </span>
        </div>
      </div>

      {/* Tempo de Atuação e Faturamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tempo de Atuação <span className="text-red-500">*</span>
          </label>
          <select
            name="tempoAtuacao"
            value={formData.tempoAtuacao}
            onChange={onChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
              errors.tempoAtuacao ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Selecione...</option>
            <option value="menos-1">Menos de 1 ano</option>
            <option value="1-2">1 a 2 anos</option>
            <option value="2-5">2 a 5 anos</option>
            <option value="mais-5">Mais de 5 anos</option>
          </select>
          {errors.tempoAtuacao && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.tempoAtuacao}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Faturamento Mensal <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              R$
            </span>
            <input
              type="text"
              name="faturamentoMensal"
              value={formData.faturamentoMensal}
              onChange={onChange}
              placeholder="0,00"
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
                errors.faturamentoMensal ? "border-red-500" : "border-gray-200"
              }`}
            />
          </div>
          {errors.faturamentoMensal && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.faturamentoMensal}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ETAPA 2: Dados do Empréstimo
interface Etapa2Props {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  simulacao: ReturnType<typeof calcularSimulacao>;
}

function Etapa2({ formData, errors, onChange, simulacao }: Etapa2Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-100 p-3 rounded-lg">
          <DollarSign className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dados do Empréstimo
          </h2>
          <p className="text-sm text-gray-600">
            Quanto você precisa e para quê?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Formulário */}
        <div className="lg:col-span-2 space-y-6">
          {/* Valor Solicitado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Valor Solicitado <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
                R$
              </span>
              <input
                type="text"
                name="valorSolicitado"
                value={formData.valorSolicitado}
                onChange={onChange}
                placeholder="0,00"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-lg font-semibold ${
                  errors.valorSolicitado ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.valorSolicitado ? (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.valorSolicitado}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Mínimo: R$ 1.000,00 | Máximo: R$ 500.000,00
              </p>
            )}
          </div>

          {/* Prazo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prazo de Pagamento <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRAZOS.map((prazo) => (
                <button
                  key={prazo.valor}
                  type="button"
                  onClick={() =>
                    onChange({
                      target: { name: "prazo", value: prazo.valor },
                    } as any)
                  }
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition ${
                    formData.prazo === prazo.valor
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  {prazo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Finalidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Finalidade do Empréstimo <span className="text-red-500">*</span>
            </label>
            <select
              name="finalidade"
              value={formData.finalidade}
              onChange={onChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
                errors.finalidade ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">Selecione...</option>
              {FINALIDADES.map((fin) => (
                <option key={fin} value={fin}>
                  {fin}
                </option>
              ))}
            </select>
            {errors.finalidade && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.finalidade}
              </p>
            )}
          </div>

          {/* Descrição da Finalidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descreva como usará o recurso{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descricaoFinalidade"
              value={formData.descricaoFinalidade}
              onChange={onChange}
              rows={4}
              placeholder="Exemplo: Comprar uma máquina de café expresso profissional para aumentar a produção..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none ${
                errors.descricaoFinalidade
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.descricaoFinalidade && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.descricaoFinalidade}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formData.descricaoFinalidade.length}/300
              </span>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Simulação */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border-2 border-violet-200">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-violet-600" />
              <h3 className="font-bold text-gray-900">Simulação</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Valor Solicitado</p>
                <p className="text-2xl font-bold text-violet-600">
                  R$ {formData.valorSolicitado || "0,00"}
                </p>
              </div>

              <div className="h-px bg-violet-200" />

              <div className="space-y-3">
                <SimItem
                  icon={Clock}
                  label="Prazo"
                  value={`${formData.prazo} meses`}
                />
                <SimItem
                  icon={TrendingUp}
                  label="Taxa Mensal"
                  value={`${simulacao.taxaMensal}%`}
                />
                <SimItem
                  icon={Target}
                  label="Total de Juros"
                  value={`R$ ${simulacao.totalJuros.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`}
                />
              </div>

              <div className="h-px bg-violet-200" />

              <div className="bg-white rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Parcela Mensal</p>
                <p className="text-2xl font-bold text-green-600">
                  R${" "}
                  {simulacao.parcelaMensal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="bg-violet-600 text-white rounded-xl p-4">
                <p className="text-xs opacity-90 mb-1">Total a Pagar</p>
                <p className="text-xl font-bold">
                  R${" "}
                  {simulacao.valorTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Os valores são estimados. A taxa final dependerá da análise
                  dos investidores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ETAPA 3: Documentos
interface Etapa3Props {
  formData: FormData;
  errors: FormErrors;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

function Etapa3({ formData, errors, onFileUpload, onRemoveFile }: Etapa3Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-100 p-3 rounded-lg">
          <FileText className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Documentos Necessários
          </h2>
          <p className="text-sm text-gray-600">
            Envie os documentos para análise
          </p>
        </div>
      </div>

      {/* Lista de Documentos Recomendados */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Documentos Recomendados
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            Comprovante de Inscrição do CNPJ (Cartão CNPJ)
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            Extrato bancário dos últimos 3 meses
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            Certidão Negativa de Débitos (CND)
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            Demonstrativo financeiro (se disponível)
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            Fotos do estabelecimento/equipamentos
          </li>
        </ul>
      </div>

      {/* Upload de Arquivos */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Anexar Documentos <span className="text-red-500">*</span>
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-500 transition cursor-pointer">
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileUpload}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-1">
              Clique para enviar ou arraste arquivos
            </p>
            <p className="text-sm text-gray-500">
              PDF, JPG, PNG até 10MB por arquivo
            </p>
          </label>
        </div>

        {errors.documentos && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.documentos}
          </p>
        )}
      </div>

      {/* Lista de Arquivos Enviados */}
      {formData.documentos.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Arquivos Anexados ({formData.documentos.length})
          </h3>
          <div className="space-y-2">
            {formData.documentos.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-violet-600" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ETAPA 4: Sucesso
function Etapa4Sucesso() {
  const router = useRouter();

  return (
    <div className="text-center py-8">
      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Solicitação Enviada com Sucesso!
      </h2>

      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Sua solicitação de empréstimo foi recebida e está em análise. Os
        investidores interessados entrarão em contato em até{" "}
        <span className="font-semibold">48 horas úteis</span>. Você pode
        acompanhar o status na sua dashboard.
      </p>

      <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-6 max-w-md mx-auto mb-8">
        <h3 className="font-bold text-violet-900 mb-3">Próximos Passos:</h3>
        <ul className="space-y-2 text-sm text-violet-800 text-left">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Análise dos documentos pela nossa equipe</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Publicação no marketplace para investidores</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Recebimento de propostas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Aprovação e liberação do recurso</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => router.push("/mei/dashboard")}
          className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl font-semibold transition"
        >
          Ir para Dashboard
        </button>
        <button
          onClick={() => router.push("/mei/emprestimos")}
          className="px-8 py-3 border-2 border-violet-500 text-violet-600 hover:bg-violet-50 rounded-xl font-semibold transition"
        >
          Ver Minhas Solicitações
        </button>
      </div>
    </div>
  );
}

// ============================================
// 12. COMPONENTE AUXILIAR - Item de Simulação
// ============================================
interface SimItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function SimItem({ icon: Icon, label, value }: SimItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-violet-600" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}
