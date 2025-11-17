import { ChangeEvent } from "react";
import {
  DollarSign,
  AlertCircle,
  Calculator,
  Clock,
  TrendingUp,
  Target,
  Info,
} from "lucide-react";
import { FINALIDADES, PRAZOS } from "../constants";

interface FormData {
  valorSolicitado: string;
  prazo: string;
  finalidade: string;
  descricaoFinalidade: string;
}

interface FormErrors {
  [key: string]: string;
}

interface Etapa2Props {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  simulacao: any;
}

export default function Etapa2({
  formData,
  errors,
  onChange,
  simulacao,
}: Etapa2Props) {
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
                className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-12 pr-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-semibold ${
                  errors.valorSolicitado ? "ring-2 ring-red-500" : ""
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
                    } as React.ChangeEvent<any>)
                  }
                  className={`block w-full rounded-lg border font-semibold shadow-sm py-2.5 sm:py-3 px-4 text-sm sm:text-base transition-all focus:outline-none focus:ring-2 focus:ring-violet-500
                    ${
                      formData.prazo === prazo.valor
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 bg-slate-100 text-gray-800 hover:border-violet-300"
                    }
                  `}
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
              className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 px-4 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                errors.finalidade ? "ring-2 ring-red-500" : ""
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
              className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 px-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none ${
                errors.descricaoFinalidade ? "ring-2 ring-red-500" : ""
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-600" />
                    <span className="text-sm text-gray-600">Prazo</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formData.prazo} meses
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-600" />
                    <span className="text-sm text-gray-600">Taxa Mensal</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {simulacao.taxaMensal}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-violet-600" />
                    <span className="text-sm text-gray-600">
                      Total de Juros
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    R${" "}
                    {simulacao.totalJuros.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
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
