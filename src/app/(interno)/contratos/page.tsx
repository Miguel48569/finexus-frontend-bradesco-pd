"use client";

import { useEffect, useState } from "react";
import ContratosMEI from "./components/Contratos.MEI";
import ContratosInvestidor from "./components/Contratos.Investidor";

export default function ContratosPage() {
  const [userType, setUserType] = useState<"MEI" | "Investidor" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved === "MEI" || saved === "Investidor") setUserType(saved);
    else setUserType("MEI");
  }, []);

  if (!userType) return null;

  return userType === "MEI" ? <ContratosMEI /> : <ContratosInvestidor />;
}
