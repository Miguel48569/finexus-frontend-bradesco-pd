import axios, { AxiosInstance, AxiosError } from "axios";
import { parseCookies, destroyCookie } from "nookies"; // 1. Importamos o nookies

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://finexus-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos
});

// --- INTERCEPTOR DE REQUISIÇÃO (Envia o Token) ---
api.interceptors.request.use((config) => {
  console.log("📤 Requisição:", {
    method: config.method?.toUpperCase(),
    url: `${config.baseURL}${config.url}`,
    headers: config.headers,
  });

  // 2. Pega todos os cookies e extrai apenas o token
  // 'finexus.token' deve ser O MESMO NOME que você usou no setCookie na tela de login
  const { "finexus.token": token } = parseCookies();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --- INTERCEPTOR DE RESPOSTA (Trata Erros) ---
api.interceptors.response.use(
  (response) => {
    console.log("✅ Resposta:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error("❌ Erro na requisição:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      // 3. Se o token venceu, apaga o cookie
      destroyCookie(null, "finexus.token");

      // Redireciona para o login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
