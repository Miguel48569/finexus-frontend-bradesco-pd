import api from "@/lib/api";

// --- INTERFACES ---

export interface Solicitante {
  id: number;
}

export interface PropostaRequest {
  nomeNegocio: string;
  categoria: string;
  descricaoNegocio: string;
  cnpj: string;
  tempoAtuacaoMeses: number;
  faturamentoMensal: number;
  valorSolicitado: number;
  saldoInvestido: number;
  prazoMeses: number;
  motivoEmprestimo: string;
  descricaoUsoRecurso: string;
  solicitante: Solicitante;
}

export interface PropostaResponse {
  id: number;
  nomeNegocio: string;
  categoria: string;
  descricaoNegocio: string;
  cnpj: string;
  tempoAtuacaoMeses: number;
  faturamentoMensal: number;
  valorSolicitado: number;
  saldoInvestido: number;
  prazoMeses: number;
  motivoEmprestimo: string;
  descricaoUsoRecurso: string;
  solicitante: Solicitante;
  status?: string;
  dataCriacao?: string;
}

export interface AtualizarStatusRequest {
  status: string;
}

// --- SERVIÇO ---

export const propostaService = {
  // 1. CRIAR PROPOSTA (POST /propostas)
  criar: async (dados: PropostaRequest): Promise<PropostaResponse> => {
    const response = await api.post("/propostas", dados);
    return response.data;
  },

  // 2. LISTAR TODAS AS PROPOSTAS (GET /propostas)
  listar: async (): Promise<PropostaResponse[]> => {
    const response = await api.get("/propostas");
    return response.data;
  },

  // 3. BUSCAR PROPOSTA POR ID (GET /propostas/{id})
  buscarPorId: async (id: number): Promise<PropostaResponse> => {
    const response = await api.get(`/propostas/${id}`);
    return response.data;
  },

  // 4. BUSCAR PROPOSTAS POR USUÁRIO (GET /propostas/usuario/{idUsuario})
  buscarPorUsuario: async (idUsuario: number): Promise<PropostaResponse[]> => {
    const response = await api.get(`/propostas/usuario/${idUsuario}`);
    return response.data;
  },

  // 5. ATUALIZAR STATUS (PUT /propostas/{id}/status)
  atualizarStatus: async (
    id: number,
    dados: AtualizarStatusRequest
  ): Promise<PropostaResponse> => {
    const response = await api.put(`/propostas/${id}/status`, dados);
    return response.data;
  },

  // 6. DELETAR PROPOSTA (DELETE /propostas/{id})
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/propostas/${id}`);
  },
};
