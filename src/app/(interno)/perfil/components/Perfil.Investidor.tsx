"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, CreditCard, Save, AlertCircle } from "lucide-react";
import { userService } from "@/services/users";

export default function PerfilInvestidor() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
  });

  const [originalData, setOriginalData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
  });

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  // Função para formatar Telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return numbers
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Usuário não encontrado. Faça login novamente.");
          return;
        }

        console.log("🔄 Buscando dados do usuário...", { userId });
        const userData = await userService.getById(userId);
        console.log("✅ Dados recebidos:", userData);

        const data = {
          nome: userData.nome || "",
          email: userData.email || "",
          cpf: userData.cpf || "",
          telefone: userData.telefone || "",
        };

        setFormData(data);
        setOriginalData(data);
      } catch (error: any) {
        console.error("❌ Erro ao buscar dados:", error);
        setError("Erro ao carregar dados do perfil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const formatted = formatCPF(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "telefone") {
      const formatted = formatTelefone(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Usuário não encontrado.");
        return;
      }

      // Validação de email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        setError(
          "Email inválido. Use apenas letras, números e caracteres permitidos (. _ -)"
        );
        setIsSaving(false);
        return;
      }

      // Remove formatação do telefone antes de enviar
      const telefoneLimpo = formData.telefone.replace(/\D/g, "");

      const dadosAtualizacao = {
        nome: formData.nome,
        email: formData.email,
        telefone: telefoneLimpo,
      };

      console.log("📤 Atualizando perfil...", dadosAtualizacao);

      await userService.update(userId, dadosAtualizacao);

      console.log("✅ Perfil atualizado com sucesso!");

      // Atualiza localStorage
      localStorage.setItem("userName", formData.nome);
      localStorage.setItem("userEmail", formData.email);

      setOriginalData(formData);
      setSuccess("Perfil atualizado com sucesso!");
      setIsEditing(false);

      // Remove mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("❌ Erro ao atualizar:", error);
      let mensagem = "Erro ao atualizar perfil.";

      if (error?.response?.data?.message) {
        mensagem = error.response.data.message;
      } else if (error?.response?.status === 400) {
        mensagem = "Dados inválidos. Verifique as informações.";
      } else if (error?.response?.status === 409) {
        mensagem = "Email já está em uso.";
      }

      setError(mensagem);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-violet-600">
            Meu Perfil - Investidor
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>

        {/* Mensagens de Sucesso/Erro */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-700">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors bg-gray-50 text-gray-600 ${
                  isEditing
                    ? "border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors text-gray-600 bg-gray-50 ${
                  isEditing
                    ? "border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    : "bg-gray-50 border-gray-200 cursor-not-allowed"
                }`}
                required
              />
            </div>
          </div>

          {/* CPF e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPF (não editável) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CPF
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-200  rounded-lg cursor-not-allowed bg-gray-400 text-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                CPF não pode ser alterado
              </p>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors bg-gray-50 text-gray-600 ${
                    isEditing
                      ? "border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                      : "bg-gray-50 border-gray-200 cursor-not-allowed"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
