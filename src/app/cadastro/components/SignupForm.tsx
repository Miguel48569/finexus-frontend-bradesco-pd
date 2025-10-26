"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface SignupFormProps {
  userType: "mei" | "investidor";
  onBack: () => void;
}

export default function SignupForm({ userType, onBack }: SignupFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
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
      <div className="space-y-3.5 sm:space-y-4 md:space-y-5">
        {/* Nome Completo */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Seu Nome Completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Seu nome completo"
          />
          {errors.name && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Seu Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="seu@email.com"
          />
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
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Seu CPF *
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                errors.cpf ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.cpf}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Seu Telefone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="(00) 00000-0000"
            />
            {errors.phone && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Senha */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Crie uma Senha *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all pr-10 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirmar Senha */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Confirme a Senha *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all pr-10 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Digite a senha novamente"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.confirmPassword}
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
