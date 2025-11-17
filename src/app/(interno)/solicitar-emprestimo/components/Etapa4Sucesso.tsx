import { CheckCircle, FileText, Building2, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface RevisaoProps {
  formData: {
    nomeNegocio: string;
    cnpj: string;
    categoria: string;
    descricaoNegocio: string;
    tempoAtuacao: string;
    faturamentoMensal: string;
    valorSolicitado: string;
    prazo: string;
    finalidade: string;
    descricaoFinalidade: string;
    documentos: File[];
  };
  onVoltar: () => void;
}

export default function Etapa4Sucesso({ formData, onVoltar }: RevisaoProps) {
  const router = useRouter();

  function handleConfirmar() {
    // Salva o empréstimo no localStorage para o dashboard ler
    const novoEmprestimo = {
      id: Date.now(),
      empresa: formData.nomeNegocio,
      valor: Number(
        String(formData.valorSolicitado).replace(/\./g, "").replace(",", ".")
      ),
      pago: 0,
      juros: 3.2, // valor mockado, pode ajustar
      status: "Ativo",
      dataVencimento: "15/12/2026", // mock
      dataSolicitacao: new Date().toLocaleDateString("pt-BR"),
    };
    const salvos = localStorage.getItem("emprestimosMock");
    let lista = [];
    try {
      lista = salvos ? JSON.parse(salvos) : [];
    } catch {
      lista = [];
    }
    lista.push(novoEmprestimo);
    localStorage.setItem("emprestimosMock", JSON.stringify(lista));
    router.push("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Botões de ação */}
      <div className="flex flex-col-reverse md:flex-row gap-4 mt-8">
        <button
          type="button"
          onClick={onVoltar}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleConfirmar}
          className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
        >
          Confirmar
        </button>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-100 p-3 rounded-lg">
          <CheckCircle className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Revisão dos Dados
          </h2>
          <p className="text-sm text-gray-600">
            Confira as informações antes de enviar
          </p>
        </div>
      </div>

      {/* Bloco Negócio */}
      <div className="bg-slate-100 rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-violet-600" />
          <span className="font-semibold text-gray-800">Negócio</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Nome:</span> {formData.nomeNegocio}
          </div>
          <div>
            <span className="font-semibold">CNPJ:</span> {formData.cnpj}
          </div>
          <div>
            <span className="font-semibold">Categoria:</span>{" "}
            {formData.categoria}
          </div>
          <div>
            <span className="font-semibold">Tempo de Atuação:</span>{" "}
            {formData.tempoAtuacao}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Descrição:</span>{" "}
            {formData.descricaoNegocio}
          </div>
          <div>
            <span className="font-semibold">Faturamento Mensal:</span> R${" "}
            {formData.faturamentoMensal}
          </div>
        </div>
      </div>

      {/* Bloco Empréstimo */}
      <div className="bg-slate-100 rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-violet-600" />
          <span className="font-semibold text-gray-800">Empréstimo</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Valor Solicitado:</span> R${" "}
            {formData.valorSolicitado}
          </div>
          <div>
            <span className="font-semibold">Prazo:</span> {formData.prazo} meses
          </div>
          <div>
            <span className="font-semibold">Finalidade:</span>{" "}
            {formData.finalidade}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Descrição da Finalidade:</span>{" "}
            {formData.descricaoFinalidade}
          </div>
        </div>
      </div>

      {/* Bloco Documentos */}
      <div className="bg-slate-100 rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-violet-600" />
          <span className="font-semibold text-gray-800">
            Documentos Anexados
          </span>
        </div>
        <ul className="space-y-1 text-sm text-gray-700">
          {formData.documentos && formData.documentos.length > 0 ? (
            formData.documentos.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-500" />
                <span>{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-400">Nenhum documento anexado</li>
          )}
        </ul>
      </div>
    </div>
  );
}
