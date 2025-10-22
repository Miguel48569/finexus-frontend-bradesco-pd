"use client"; // Componente de cliente, pois usa o hook useState

import { useState } from "react";
import Link from "next/link";
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function FormLogin() {
  // Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* 1. Cabeçalho do Card */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        <p className="text-sm mt-3 text-gray-500">
          Bem-vindo de volta! Acesse sua conta.
        </p>
      </div>

      {/* 2. Formulário */}
      <form action="/api/login" method="POST" className="space-y-5">
        <div>
          <label
            htmlFor="cpfOrCnpj"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            CPF/CNPJ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="cpfOrCnpj"
              name="cpfOrCnpj"
              placeholder="Digite seu CPF ou CNPJ"
              required
              className="block w-full rounded-lg border-transparent bg-slate-100 py-3 pl-10 pr-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Senha <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              required
              className="block w-full rounded-lg border-transparent bg-slate-100 py-3 pl-10 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full justify-center py-3 px-4 rounded-lg shadow-md font-bold text-base text-white bg-violet-700 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
        >
          Entrar
        </button>
      </form>

      {/* 3. Links Inferiores */}
      <div className="mt-6 text-center text-sm space-y-2">
        <p>
          <Link
            href="/recuperar-senha"
            className="font-semibold text-violet-700 hover:text-violet-500 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </p>
        <p>
          <span className="text-gray-500">Não tem conta? </span>
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
