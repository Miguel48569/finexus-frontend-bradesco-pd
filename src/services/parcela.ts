import api from "@/lib/api";

// --- INTERFACES ---

export interface ParcelaRequest {
  dividaId: number;
  numeroParcela: number;
  valor: number;
  vencimento: string; // YYYY-MM-DD
}

export interface ParcelaResponse {
  id: number;
  dividaId: number;
  numeroParcela: number;
  valor: number;
  vencimento: string;
  status: "PENDENTE" | "ABERTA" | "PAGA" | "VENCIDA";
  dataPagamento?: string;
}

// --- SERVIÇO ---

export const parcelaService = {
  // 1. Buscar parcelas de uma dívida
  listarPorDivida: async (idDivida: number): Promise<ParcelaResponse[]> => {
    const { data } = await api.get(`/parcelas/divida/${idDivida}`);
    return data;
  },

  // 2. Buscar parcela por ID
  buscarPorId: async (id: number): Promise<ParcelaResponse> => {
    const { data } = await api.get(`/parcelas/${id}`);
    return data;
  },

  // 3. Pagar parcela (usando saldo do tomador)
  pagar: async (idParcela: number, idTomador: number): Promise<string> => {
    const { data } = await api.put(`/parcelas/${idParcela}/pagar/${idTomador}`);
    return data;
  },

  // 4. Gerar boleto da parcela
  gerarBoleto: async (idParcela: number): Promise<Blob> => {
    const { data } = await api.get(`/parcelas/${idParcela}/boleto`, {
      responseType: "blob",
    });
    return data;
  },
};
