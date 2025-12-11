import { ChangeEvent } from "react";
import { FileText, Upload, CheckCircle, AlertCircle, Info } from "lucide-react";

interface FormData {
  documentos: File[];
}

interface FormErrors {
  [key: string]: string;
}

interface Etapa3Props {
  formData: FormData;
  errors: FormErrors;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export default function Etapa3({
  formData,
  errors,
  onFileUpload,
  onRemoveFile,
}: Etapa3Props) {
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
          <Info className="w-5 h-5" /> Documentos Recomendados
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
          Anexar Documentos <span className="text-gray-400">(Opcional)</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-500 transition cursor-pointer bg-slate-100">
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileUpload}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
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
      {formData.documentos && formData.documentos.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Arquivos Anexados ({formData.documentos.length})
          </h3>
          <div className="space-y-2">
            {formData.documentos.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border border-gray-200 shadow-sm"
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
