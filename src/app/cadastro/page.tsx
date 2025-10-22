"use client";

import Image from "next/image";
import { useState } from "react";
import ChoiceModal from "./components/ChoiceModal";

export default function CadastroPage() {
  const [cadastroStep, setCadastroStep] = useState<
    "choice" | "form_mei" | "form_investidor"
  >("choice");
  const [_userChoice, setUserChoice] = useState<"mei" | "investidor" | null>(
    null
  );

  const handleChoiceMade = (choice: "mei" | "investidor") => {
    setUserChoice(choice);
    if (choice === "mei") {
      setCadastroStep("form_mei");
    } else {
      setCadastroStep("form_investidor");
    }
  };

  return (
    <main className="min-h-screen flex bg-slate-50">
      {/* Coluna do Formulário (centralizada em telas menores) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 relative">
        <div className="absolute top-12 left-0 right-0 mx-auto w-full max-w-sm text-center">
          <Image
            src="/logo-finexus-df.png"
            alt="Finexus Logo"
            width={240}
            height={48}
            priority
            className="mx-auto"
          />
        </div>

        {/* Container do Card (max-w-lg para acomodar as 2 opções) */}
        <div className="w-full max-w-lg">
          {cadastroStep === "choice" && (
            <ChoiceModal onChoiceMade={handleChoiceMade} />
          )}
          {cadastroStep === "form_mei" && (
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/75">
              <h2 className="text-2xl font-bold text-center mb-4">
                Formulário de Cadastro MEI
              </h2>
              <p className="text-center text-gray-600">
                Este é o próximo formulário para MEI.
              </p>
              <button
                onClick={() => setCadastroStep("choice")}
                className="mt-4 text-violet-600 hover:underline"
              >
                Voltar
              </button>
            </div>
          )}
          {cadastroStep === "form_investidor" && (
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/75">
              <h2 className="text-2xl font-bold text-center mb-4">
                Formulário de Cadastro Investidor
              </h2>
              <p className="text-center text-gray-600">
                Este é o próximo formulário para Investidor.
              </p>
              <button
                onClick={() => setCadastroStep("choice")}
                className="mt-4 text-violet-600 hover:underline"
              >
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Coluna da Imagem (IDÊNTICA A DE LOGIN) 👇 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 to-violet-700 items-center justify-center p-12 rounded-tl-3xl rounded-bl-3xl">
        <Image
          src="/login-image.png" // 1. Imagem de login
          alt="Ilustração de pessoas analisando gráficos e investimentos" // 2. Alt text de login
          width={500} // 3. Tamanho de login
          height={500} // 4. Tamanho de login
          className="w-full max-w-md" // 5. Tamanho de login
        />
      </div>
    </main>
  );
}
