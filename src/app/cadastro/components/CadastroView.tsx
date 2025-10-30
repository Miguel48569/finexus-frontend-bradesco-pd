"use client";

import Image from "next/image";
import { useState } from "react";
import ChoiceModal from "./ChoiceModal";
import SignupForm from "./SignupForm";

export default function CadastroView() {
  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState<"mei" | "investidor" | null>(null);

  const handleChoiceMade = (choice: "mei" | "investidor") => {
    setUserType(choice);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setUserType(null);
  };

  return (
    <main className="min-h-screen flex bg-slate-50">
      {/* Coluna do Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col items-center p-4 sm:p-6 lg:p-8 py-6 sm:py-8 overflow-y-auto">
        {/* Logo no topo - RESPONSIVO */}
        <div className="w-full max-w-lg mb-6 sm:mb-8 lg:mb-12 flex-shrink-0">
          <Image
            src="/logo-finexus-df.png"
            alt="Finexus Logo"
            width={200}
            height={40}
            priority
            className="mx-auto w-40 sm:w-48 md:w-56 h-auto"
          />
        </div>

        {/* Container do Card - CENTRALIZADO */}
        <div className="w-full max-w-lg flex-shrink-0">
          {!showForm ? (
            <ChoiceModal onChoiceMade={handleChoiceMade} />
          ) : (
            <SignupForm userType={userType!} onBack={handleBack} />
          )}
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
          className="w-full max-w-md"
        />
      </div>
    </main>
  );
}
