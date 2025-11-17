"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, User, Lock } from "lucide-react";

interface SignupFormProps {
  userType: "mei" | "investidor";
  onBack: () => void;
}

export default function SignupForm({ userType, onBack }: SignupFormProps) {
  const router = useRouter();
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    telefone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulação: Por enquanto apenas redireciona (substitua pela sua API depois)
    setTimeout(() => {
      console.log("Dados do cadastro:", { ...formData, userType });
      router.push("/login");
    }, 1000);

    // TODO: Quando criar a API, descomente o código abaixo:
    /*
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "Erro ao cadastrar" });
      }
    } catch (error) {
      setErrors({ submit: "Erro ao conectar com o servidor" });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const isMei = userType === "mei";

  return (
    <div className="w-full bg-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl shadow-black/10 border border-gray-200/75">
      {/* Header */}
      <div className="mb-5 sm:mb-6 md:mb-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm font-medium">Voltar</span>
        </button>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Cadastro {isMei ? "MEI" : "Investidor"}
        </h1>
        <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 text-gray-500">
          {isMei
            ? "Preencha seus dados pessoais para criar sua conta. Os dados da empresa serão solicitados depois."
            : "Preencha seus dados pessoais para criar sua conta."}
        </p>
      </div>

      {/* Formulário */}
      <div className="space-y-4 sm:space-y-5">
        {/* Campo Nome */}
        <div>
          <label
            htmlFor="nome"
            className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
          >
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.nome ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {errors.nome && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.nome}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
          >
            Seu Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* CPF e Telefone em Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <label
              htmlFor="cpf"
              className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
            >
              Seu CPF <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.cpf ? "ring-2 ring-red-500" : ""
                }`}
              />
            </div>
            {errors.cpf && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.cpf}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
            >
              Seu Telefone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.telefone ? "ring-2 ring-red-500" : ""
                }`}
              />
            </div>
            {errors.telefone && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.telefone}
              </p>
            )}
          </div>
        </div>

        {/* Campo Senha */}
        <div>
          <label
            htmlFor="senha"
            className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
          >
            Senha <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type={showSenha ? "text" : "password"}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-10 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.senha ? "ring-2 ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showSenha ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.senha && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.senha}
            </p>
          )}
        </div>

        {/* Campo Confirmar Senha */}
        <div>
          <label
            htmlFor="confirmarSenha"
            className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
          >
            Confirmar Senha <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmarSenha ? "text" : "password"}
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-10 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.confirmarSenha ? "ring-2 ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showConfirmarSenha ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmarSenha && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.confirmarSenha}
            </p>
          )}
        </div>

        {/* Erro geral de submit */}
        {errors.submit && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Botão de Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-2.5 sm:py-3 px-4 bg-violet-700 hover:bg-violet-600 disabled:bg-gray-400 text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? "Cadastrando..." : "Criar Conta"}
        </button>
      </div>
    </div>
  );
}
