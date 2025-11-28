import api from "@/lib/api";

export interface SaldoResponse {
  id: number;
  valor: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface ResgateRequest {
  valor: number;
  usuarioId: number;
}

export const saldoService = {
  buscarPorUsuario: async (id: number): Promise<SaldoResponse> => {
    const response = await api.get(`/saldos/usuario/${id}`);
    return response.data;
  },

  resgatar: async (dados: ResgateRequest): Promise<void> => {
    // Endpoint correto do backend para sacar saldo
    await api.put(`/saldos/sacar/${dados.usuarioId}`, {
      valor: dados.valor,
    });
  },
};
