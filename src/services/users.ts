import api from "@/lib/api";
import axios from "axios";

// --- INTERFACES (Os Tipos de Dados) ---

// O que o backend espera receber no Login
export interface LoginRequest {
  cpf: string;
  senha: string;
}

// O que o backend devolve no Login (Geralmente Token + Dados do Usuário)
export interface LoginResponse {
  token: string;
  usuario: {
    id: number; // Ou string, verifique no seu banco
    nome: string;
    email: string;
    tipo: "TOMADOR" | "INVESTIDOR";
  };
}

// O que mandamos no Cadastro (Baseado na sua tela)
export interface CadastroRequest {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  tipo: "TOMADOR" | "INVESTIDOR";
}

// O que podemos atualizar (PUT). Usamos 'Partial' pois nem sempre atualizamos tudo.
export interface AtualizarUsuarioRequest {
  nome?: string;
  telefone?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
}

// --- O SERVIÇO (As Funções) ---

export const userService = {
  // 1. LOGIN (POST /usuarios/login)
  login: async (dados: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/usuarios/login", dados);
    return response.data;
  },

  // 2. CADASTRO (POST /usuarios/cadastro)
  cadastro: async (dados: CadastroRequest): Promise<void> => {
    await api.post("/usuarios/cadastro", dados);
  },

  // 3. BUSCAR PERFIL (GET /usuarios/{id})
  // Atenção: Você precisará passar o ID que guardou no Cookie
  getById: async (id: number | string) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // 3.1 BUSCAR USUÁRIO POR CPF (GET /usuarios/cpf/{cpf})
  // Atenção: Este endpoint usa proxy direto sem /api
  getByCpf: async (cpf: string) => {
  const response = await api.get(`/usuarios/cpf/${cpf}`);
  return response.data;
},

  // 4. ATUALIZAR DADOS (PUT /usuarios/{id})
  update: async (id: number | string, dados: AtualizarUsuarioRequest) => {
    const response = await api.put(`/usuarios/${id}`, dados);
    return response.data;
  },

  // 5. EXCLUIR CONTA (DELETE /usuarios/{id})
  delete: async (id: number | string) => {
    await api.delete(`/usuarios/${id}`);
  },
};
