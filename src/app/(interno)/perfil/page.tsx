"use client";

import { useEffect, useState } from "react";
import MEI from "./components/Perfil.MEI";
import Investidor from "./components/Perfil.Investidor";

export default function PerfilPage() {
  const [userType, setUserType] = useState<"MEI" | "Investidor">("MEI");

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    console.log("UserProfile from localStorage:", saved); // Debug log
    if (saved === "MEI" || saved === "Investidor") {
      setUserType(saved);
    }
  }, []);

  // Se não houver userType, mostra mensagem de carregamento em vez de null
  if (!userType) return <div>Carregando...</div>;

  return userType === "MEI" ? <MEI /> : <Investidor />;
}
