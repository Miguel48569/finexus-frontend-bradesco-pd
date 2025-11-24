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
  taxaJuros: number;
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
  // 1. Criar proposta
  criar: async (dados: PropostaRequest): Promise<PropostaResponse> => {
    const { data } = await api.post("/propostas", dados);
    return data;
  },

  // 2. Listar todas
  listar: async (): Promise<PropostaResponse[]> => {
    const { data } = await api.get("/propostas");
    return data;
  },

  // 3. Listar apenas abertas
  listarAbertas: async (): Promise<PropostaResponse[]> => {
    const { data } = await api.get("/propostas/abertas");
    return data;
  },

  // 4. Buscar por ID
  buscarPorId: async (id: number): Promise<PropostaResponse> => {
    const { data } = await api.get(`/propostas/${id}`);
    return data;
  },

  // 5. Buscar por usuário
  buscarPorUsuario: async (
    idUsuario: number
  ): Promise<PropostaResponse[]> => {
    const { data } = await api.get(`/propostas/usuario/${idUsuario}`);
    return data;
  },

  // 6. Atualizar status
  atualizarStatus: async (
    id: number,
    dados: AtualizarStatusRequest
  ): Promise<PropostaResponse> => {
    const { data } = await api.put(`/propostas/${id}/status`, dados);
    return data;
  },

  // 7. Deletar
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/propostas/${id}`);
  },
};
