"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function FormLogin() {
  const router = useRouter();
  const [showSenha, setShowSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    cpf: "",
    senha: "",
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

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
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
      console.log("Dados do login:", formData);
      router.push("/dashboard");
    }, 1000);

    // TODO: Quando criar a API, descomente o código abaixo:
    /*
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/home");
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "CPF ou senha incorretos" });
      }
    } catch (error) {
      setErrors({ submit: "Erro ao conectar com o servidor" });
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <>
      {/* Cabeçalho do Card */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Login</h1>
        <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-gray-500">
          Bem-vindo de volta! Acesse sua conta.
        </p>
      </div>

      {/* Formulário */}
      <div className="space-y-4 sm:space-y-5">
        {/* Campo CPF */}
        <div>
          <label
            htmlFor="cpf"
            className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
          >
            CPF <span className="text-red-500">*</span>
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
              className={`block w-full rounded-lg border-transparent bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.cpf ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {errors.cpf && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.cpf}</p>
          )}
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
              placeholder="••••••••"
              className={`block w-full rounded-lg border-transparent bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-10 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
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
          className="w-full justify-center py-2.5 sm:py-3 px-4 rounded-lg shadow-md font-bold text-sm sm:text-base text-white bg-violet-700 hover:bg-violet-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      {/* Links Inferiores */}
      <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm space-y-2">
        <p>
          <Link
            href="/esqueci-senha"
            className="font-semibold text-violet-700 hover:text-violet-500 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </p>
        <p className="text-gray-500">
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-semibold text-violet-700 hover:text-violet-500 hover:underline"
          >
            Crie aqui!
          </Link>
        </p>
      </div>
    </>
  );
}
