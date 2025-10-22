"use client";
import Link from "next/link";
import { useState } from "react";
import { BriefcaseIcon, ChartBarIcon } from "@heroicons/react/24/outline"; // Ícones para as opções

interface ChoiceModalProps {
  onChoiceMade: (choice: "mei" | "investidor") => void;
}

export default function ChoiceModal({ onChoiceMade }: ChoiceModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<
    "mei" | "investidor" | null
  >(null);

  const handleChoiceClick = (choice: "mei" | "investidor") => {
    setSelectedChoice(choice);
    // onChoiceMade(choice); // Você pode ativar a transição aqui ou no botão "Continuar"
  };

  const isButtonDisabled = selectedChoice === null;

  return (
    <div className="w-full bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-black/10 border border-gray-200/75">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quem é você?</h1>
        <p className="text-sm mt-3 text-gray-500">
          Escolha uma das opções abaixo para continuar seu cadastro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Opção "Sou MEI" */}
        <div
          className={`
            flex flex-col items-center p-6 rounded-lg border-2 cursor-pointer 
            transition-all duration-200 ease-in-out
            ${
              selectedChoice === "mei"
                ? "border-violet-600 bg-violet-50 shadow-md"
                : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:shadow-sm"
            }
          `}
          onClick={() => handleChoiceClick("mei")}
        >
          <BriefcaseIcon
            className={`h-12 w-12 mb-3 ${
              selectedChoice === "mei" ? "text-violet-600" : "text-gray-500"
            }`}
          />
          <h2
            className={`text-xl font-semibold mb-2 ${
              selectedChoice === "mei" ? "text-violet-700" : "text-gray-800"
            }`}
          >
            Sou MEI
          </h2>
          <p className="text-sm text-center text-gray-600">
            Quem precisa de crédito para seu negócio ou projeto e busca
            empréstimo com taxas mais justas.
          </p>
        </div>

        {/* Opção "Investidor" */}
        <div
          className={`
            flex flex-col items-center p-6 rounded-lg border-2 cursor-pointer 
            transition-all duration-200 ease-in-out
            ${
              selectedChoice === "investidor"
                ? "border-violet-600 bg-violet-50 shadow-md"
                : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:shadow-sm"
            }
          `}
          onClick={() => handleChoiceClick("investidor")}
        >
          <ChartBarIcon
            className={`h-12 w-12 mb-3 ${
              selectedChoice === "investidor"
                ? "text-violet-600"
                : "text-gray-500"
            }`}
          />
          <h2
            className={`text-xl font-semibold mb-2 ${
              selectedChoice === "investidor"
                ? "text-violet-700"
                : "text-gray-800"
            }`}
          >
            Investidor
          </h2>
          <p className="text-sm text-center text-gray-600">
            Quem deseja aplicar dinheiro em projetos de empreendedores e receber
            rendimentos em troca.
          </p>
        </div>
      </div>

      {/* Botão "Continuar" */}
      <button
        type="button"
        onClick={() => selectedChoice && onChoiceMade(selectedChoice)}
        disabled={isButtonDisabled}
        className={`
          w-full justify-center py-3 px-4 rounded-lg shadow-md font-bold text-base text-white
          transition-all duration-300 transform 
          ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-700 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/50"
          }
        `}
      >
        Continuar
      </button>

      {/* Opcional: Link para voltar ao login */}
      <div className="mt-6 text-center text-sm">
        <p>
          <Link
            href="/login"
            className="font-semibold text-gray-600 hover:text-gray-800 hover:underline"
          >
            Já tem uma conta? Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
