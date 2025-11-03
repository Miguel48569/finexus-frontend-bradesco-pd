"use client";

import Link from "next/link";
import { useState } from "react";
import { Briefcase, TrendingUp } from "lucide-react";

interface ChoiceModalProps {
  onChoiceMade: (choice: "mei" | "investidor") => void;
}

export default function ChoiceModal({ onChoiceMade }: ChoiceModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<
    "mei" | "investidor" | null
  >(null);

  const handleChoiceClick = (choice: "mei" | "investidor") => {
    setSelectedChoice(choice);
  };

  const handleContinue = () => {
    if (selectedChoice) {
      onChoiceMade(selectedChoice);
    }
  };

  return (
    <div className="w-full bg-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl shadow-black/10 border border-gray-200/75">
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Quem é você?
        </h1>
        <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-gray-500">
          Escolha uma das opções abaixo para continuar seu cadastro.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
        {/* Opção "Sou MEI" */}
        <button
          type="button"
          onClick={() => handleChoiceClick("mei")}
          className={`
            flex flex-col items-center p-4 sm:p-5 md:p-6 rounded-lg border-2 
            transition-all duration-200 ease-in-out
            ${
              selectedChoice === "mei"
                ? "border-violet-600 bg-violet-50 shadow-md"
                : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:shadow-sm"
            }
          `}
        >
          <Briefcase
            className={`h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 mb-2 sm:mb-3 ${
              selectedChoice === "mei" ? "text-violet-600" : "text-gray-500"
            }`}
          />
          <h2
            className={`text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 ${
              selectedChoice === "mei" ? "text-violet-700" : "text-gray-800"
            }`}
          >
            Sou MEI
          </h2>
          <p className="text-xs sm:text-sm text-center text-gray-600 leading-relaxed">
            Quem precisa de crédito para seu negócio ou projeto e busca
            empréstimo com taxas mais justas.
          </p>
        </button>

        {/* Opção "Investidor" */}
        <button
          type="button"
          onClick={() => handleChoiceClick("investidor")}
          className={`
            flex flex-col items-center p-4 sm:p-5 md:p-6 rounded-lg border-2 
            transition-all duration-200 ease-in-out
            ${
              selectedChoice === "investidor"
                ? "border-violet-600 bg-violet-50 shadow-md"
                : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:shadow-sm"
            }
          `}
        >
          <TrendingUp
            className={`h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 mb-2 sm:mb-3 ${
              selectedChoice === "investidor"
                ? "text-violet-600"
                : "text-gray-500"
            }`}
          />
          <h2
            className={`text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 ${
              selectedChoice === "investidor"
                ? "text-violet-700"
                : "text-gray-800"
            }`}
          >
            Investidor
          </h2>
          <p className="text-xs sm:text-sm text-center text-gray-600 leading-relaxed">
            Quem deseja aplicar dinheiro em projetos de empreendedores e receber
            rendimentos em troca.
          </p>
        </button>
      </div>

      {/* Botão "Continuar" */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!selectedChoice}
        className={`
          w-full justify-center py-2.5 sm:py-3 px-4 rounded-lg shadow-md font-bold text-sm sm:text-base text-white
          transition-all duration-300 transform 
          ${
            !selectedChoice
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-700 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/50"
          }
        `}
      >
        Continuar
      </button>

      {/* Link para login */}
      <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm">
        <p className="text-gray-600">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-600 hover:text-violet-700 hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
