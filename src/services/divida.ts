import api from "@/lib/api";


export interface DividaResponse {
  id: number;
  proposta: any;
  tomador: any;
  valorTotal: number;
  parcelas: number;
  valorParcela: number;
  investidoresIds: number[];
}

/* ================================
      SERVICE DE DÍVIDAS
================================ */

const dividaService = {
  // Buscar dívida pela proposta
  async getByProposta(idProposta: number): Promise<DividaResponse> {
    const response = await api.get(`/dividas/proposta/${idProposta}`);
    return response.data;
  },

  // Buscar dívida por tomador
  async getByTomador(idUsuario: number): Promise<DividaResponse[]> {
    const response = await api.get(`/dividas/tomador/${idUsuario}`);
    return response.data;
  },

  // Criar dívida
  async criarDivida(data: Partial<DividaResponse>): Promise<DividaResponse> {
    const response = await api.post(`/dividas`, data);
    return response.data;
  },

  // Atualizar dívida
  async atualizarDivida(id: number, data: Partial<DividaResponse>): Promise<DividaResponse> {
    const response = await api.put(`/dividas/${id}`, data);
    return response.data;
  },

  // Adicionar investidor
  async adicionarInvestidor(idDivida: number, idInvestidor: number): Promise<DividaResponse> {
    const response = await api.post(`/dividas/${idDivida}/investidor/${idInvestidor}`);
    return response.data;
  },

  // Deletar uma dívida
  async deletar(id: number): Promise<void> {
    await api.delete(`/dividas/${id}`);
  }
};

export default dividaService;