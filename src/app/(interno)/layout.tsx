"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import "@/app/globals.css";
import { userService } from "@/services/users";

type UserProfile = {
  type: "TOMADOR" | "INVESTIDOR";
  name: string;
  document: string;
};

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/");
  const [currentProfile, setCurrentProfile] = useState<UserProfile>({
    type: "TOMADOR",
    name: "",
    document: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("🔍 Verificando userId no localStorage:", userId);

        if (!userId) {
          console.warn(
            "⚠️ userId não encontrado. Redirecionando para login..."
          );
          window.location.href = "/login";
          return;
        }

        console.log("🔄 Buscando dados do usuário no backend...");
        const userData = await userService.getById(userId);

        console.log("✅ Dados do usuário carregados:", {
          id: userData.id,
          nome: userData.nome,
          tipo: userData.tipo,
        });

        setCurrentProfile({
          type: userData.tipo,
          name: userData.nome,
          document: userData.cpf || "",
        });
      } catch (err: any) {
        console.error("❌ Erro ao carregar dados do usuário:", {
          status: err?.response?.status,
          statusText: err?.response?.statusText,
          data: err?.response?.data,
          message: err?.message,
        });

        let errorMessage = "Erro ao carregar dados do usuário.";

        if (err?.response) {
          const status = err.response.status;
          if (status === 401 || status === 404) {
            errorMessage = "Usuário não encontrado ou sessão expirada.";
          } else if (status === 500) {
            errorMessage =
              "Erro no servidor. Tente novamente em alguns instantes.";
          }
        } else if (err?.request) {
          errorMessage = "Sem resposta do servidor. Verifique sua conexão.";
        }

        setError(errorMessage);

        // Aguarda 2 segundos para mostrar a mensagem antes de redirecionar
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Atualiza a rota baseada no tipo de perfil
    if (currentProfile.type === "TOMADOR") {
      setActiveRoute("/dashboard");
    } else {
      setActiveRoute("/carteira");
    }
  }, [currentProfile.type]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-violet-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">
            Carregando dados do usuário...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-violet-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <p className="text-gray-500 text-xs">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Sidebar
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userType={currentProfile.type}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
