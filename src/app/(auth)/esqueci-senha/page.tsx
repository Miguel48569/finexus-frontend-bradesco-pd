"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============================================
// 1. TIPOS E INTERFACES (Type Safety)
// ============================================
interface FormData {
  cpf: string;
  senha: string;
  confirmarSenha: string;
}

interface FormErrors {
  cpf?: string;
  senha?: string;
  confirmarSenha?: string;
  geral?: string;
}

// ============================================
// 2. UTILS - Funções auxiliares reutilizáveis
// ============================================
const formatarCPF = (valor: string): string => {
  // Remove tudo que não é número
  const numeros = valor.replace(/\D/g, "");

  // Aplica máscara: 000.000.000-00
  return numeros
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const validarCPF = (cpf: string): boolean => {
  const numeros = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos e não é sequência repetida
  if (numeros.length !== 11 || /^(\d)\1+$/.test(numeros)) {
    return false;
  }

  // Aqui você poderia adicionar validação completa do CPF
  // (cálculo dos dígitos verificadores)
  return true;
};

const validarSenha = (
  senha: string
): { valida: boolean; mensagem?: string } => {
  if (senha.length < 8) {
    return { valida: false, mensagem: "Senha deve ter no mínimo 8 caracteres" };
  }

  if (!/[A-Z]/.test(senha)) {
    return {
      valida: false,
      mensagem: "Senha deve conter ao menos 1 letra maiúscula",
    };
  }

  if (!/[0-9]/.test(senha)) {
    return { valida: false, mensagem: "Senha deve conter ao menos 1 número" };
  }

  return { valida: true };
};

// ============================================
// 3. COMPONENTE PRINCIPAL
// ============================================
import Image from "next/image";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function EsqueciSenhaPage() {
  const router = useRouter();

  // Estados separados para cada responsabilidade
  const [formData, setFormData] = useState<FormData>({
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Handler unificado para todos os inputs (DRY - Don't Repeat Yourself)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatarCPF(value) : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validação completa do formulário
  const validarFormulario = (): boolean => {
    const novosErros: FormErrors = {};
    if (!formData.cpf) {
      novosErros.cpf = "CPF é obrigatório";
    } else if (!validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido";
    }
    if (!formData.senha) {
      novosErros.senha = "Senha é obrigatória";
    } else {
      const resultadoValidacao = validarSenha(formData.senha);
      if (!resultadoValidacao.valida) {
        novosErros.senha = resultadoValidacao.mensagem;
      }
    }
    if (!formData.confirmarSenha) {
      novosErros.confirmarSenha = "Confirmação é obrigatória";
    } else if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem";
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Chamada à API (integração com backend)
  const redefinirSenha = async (cpf: string, novaSenha: string) => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${cpfLimpo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senha: novaSenha }),
      }
    );
    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.message || "Erro ao redefinir senha");
    }
    return response.json();
  };

  // Submit do formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return;
    }
    setIsLoading(true);
    try {
      await redefinirSenha(formData.cpf, formData.senha);
      alert("Senha redefinida com sucesso!");
      router.push("/login");
    } catch (erro: unknown) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Erro ao redefinir senha. Tente novamente.";
      setErrors({ geral: mensagemErro });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-slate-50">
      {/* Coluna do Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col items-center p-4 sm:p-6 lg:p-8 py-6 sm:py-8 overflow-y-auto">
        {/* Logo no topo - RESPONSIVO */}
        <div className="w-full max-w-sm mb-6 sm:mb-8 lg:mb-12 flex-shrink-0">
          <Image
            src="/logo-finexus-df.png"
            alt="Finexus Logo"
            width={200}
            height={40}
            priority
            className="mx-auto w-40 sm:w-48 md:w-56 h-auto"
          />
        </div>

        {/* Card do Formulário */}
        <div className="w-full max-w-sm flex-shrink-0">
          <div className="w-full bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl shadow-black/10 border border-gray-200/75">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Redefinir Senha
              </h1>
              <p className="text-gray-600 text-sm">
                Digite seu CPF e escolha uma nova senha
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Erro Geral */}
              {errors.geral && (
                <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {errors.geral}
                </div>
              )}

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
                    id="cpf"
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      errors.cpf ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.cpf && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {errors.cpf}
                  </p>
                )}
              </div>

              {/* Campo Nova Senha */}
              <div>
                <label
                  htmlFor="senha"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  Nova Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-10 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      errors.senha ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {mostrarSenha ? (
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
                <p className="mt-1 text-xs text-gray-500">
                  Use no mínimo 8 caracteres com letras maiúsculas e números
                </p>
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
                    id="confirmarSenha"
                    type={mostrarSenha ? "text" : "password"}
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Digite a senha novamente"
                    className={`block w-full rounded-lg border border-gray-200 shadow-sm bg-slate-100 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-10 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      errors.confirmarSenha ? "ring-2 ring-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {mostrarSenha ? (
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

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full justify-center py-2.5 sm:py-3 px-4 rounded-lg shadow-md font-bold text-sm sm:text-base text-white bg-violet-700 hover:bg-violet-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {isLoading ? "Redefinindo..." : "Redefinir Senha"}
              </button>
            </form>
            {/* Link Voltar para Login */}
            <div className="text-center mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-800 font-medium transition text-sm justify-center"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para o Login
              </Link>
            </div>
          </div>
        </div>

        {/* Espaçamento inferior para mobile */}
        <div className="h-6 sm:h-8 flex-shrink-0" />
      </div>

      {/* Coluna da Imagem - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 to-violet-700 items-center justify-center p-12">
        <Image
          src="/login-image.png"
          alt="Ilustração de pessoas analisando gráficos e investimentos"
          width={500}
          height={500}
          className="w-full max-w-md animate-pulse"
        />
      </div>
    </main>
  );
}
