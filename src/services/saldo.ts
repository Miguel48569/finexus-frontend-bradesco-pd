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
export const saldoService = {
  buscarPorUsuario: async (id: number): Promise<SaldoResponse> => {
    const response = await api.get(`/saldos/usuario/${id}`);
    return response.data;
  }
};
