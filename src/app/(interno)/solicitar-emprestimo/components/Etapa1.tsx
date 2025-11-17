import { ChangeEvent } from "react";
import { Building2, AlertCircle } from "lucide-react";
import { CATEGORIAS } from "../constants";

interface FormData {
  nomeNegocio: string;
  cnpj: string;
  categoria: string;
  descricaoNegocio: string;
  tempoAtuacao: string;
  faturamentoMensal: string;
}

interface FormErrors {
  [key: string]: string;
}

interface Etapa1Props {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export default function Etapa1({ formData, errors, onChange }: Etapa1Props) {
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
          className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 px-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
            errors.nomeNegocio ? "ring-2 ring-red-500" : ""
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
            className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 px-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
              errors.cnpj ? "ring-2 ring-red-500" : ""
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
            className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 px-4 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
              errors.categoria ? "ring-2 ring-red-500" : ""
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
          className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 px-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none ${
            errors.descricaoNegocio ? "ring-2 ring-red-500" : ""
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
            className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 px-4 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
              errors.tempoAtuacao ? "ring-2 ring-red-500" : ""
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
              className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-12 pr-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                errors.faturamentoMensal ? "ring-2 ring-red-500" : ""
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
