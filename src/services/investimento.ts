import api from "@/lib/api";

// --- INTERFACES ---

export interface Investidor {
  id: number;
}

export interface PropostaResumo {
  id: number;
  nomeNegocio: string;
  categoria: string;
  valorSolicitado: number;
  saldoInvestido: number;
  taxaJuros: number;
  prazoMeses: number;
}

export interface InvestimentoRequest {
  idProposta: number;
  idInvestidor: number;
  valor: number;
}

export interface InvestimentoResponse {
  id: number;
  valorInvestido: number;
  dataInvestimento: string;
  rendimentoEsperado: number;
  status: string;
  qrCodeUrl: string;

  investidor: {
    id: number;
    nome?: string;
  };

  proposta: {
    id: number;
    nomeNegocio?: string;
    valorSolicitado?: number;
    saldoInvestido?: number;
    taxaJuros?: number;
    prazoMeses?: number;
  };
}

// --- SERVIÇO ---

export const investimentoService = {
  // 1. Criar investimento (POST /investimentos)
  criar: async (dados: InvestimentoRequest): Promise<InvestimentoResponse> => {
    const response = await api.post("/investimentos", dados);
    return response.data;
  },

  // 2. Confirmar pagamento (PUT /investimentos/{id}/confirmar)
  confirmar: async (id: number): Promise<string> => {
    const response = await api.put(`/investimentos/${id}/confirmar`);
    return response.data;
  },

  // 3. Gerar boleto (GET /investimentos/{id}/boleto)
  gerarBoleto: async (id: number): Promise<Blob> => {
    const response = await api.get(`/investimentos/${id}/boleto`, {
      responseType: "blob",
    });
    return response.data;
  },

  // 4. Listar investimentos por proposta (GET /investimentos/proposta/{idProposta})
  listarPorProposta: async (
    idProposta: number
  ): Promise<InvestimentoResponse[]> => {
    const response = await api.get(`/investimentos/proposta/${idProposta}`);
    return response.data;
  },

  // 5. Listar investimentos por investidor (GET /investimentos/investidor/{idInvestidor})
  listarPorInvestidor: async (
    idInvestidor: number
  ): Promise<InvestimentoResponse[]> => {
    const response = await api.get(`/investimentos/investidor/${idInvestidor}`);
    return response.data;
  },
};
