"use client";

import { useEffect, useState } from "react";
import TOMADOR from "./components/Perfil.MEI";
import Investidor from "./components/Perfil.Investidor";

export default function PerfilPage() {
  const [userType, setUserType] = useState<"TOMADOR" | "INVESTIDOR" | null>(
    null
  );

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    console.log("UserProfile from localStorage:", saved);
    if (saved === "TOMADOR" || saved === "INVESTIDOR") {
      setUserType(saved);
    }
  }, []);

  if (!userType) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return userType === "TOMADOR" ? <TOMADOR /> : <Investidor />;
}
