"use client";

import { useEffect, useState } from "react";
import ExtratoMEI from "./components/Extrato.MEI";
import ExtratoInvestidor from "./components/Extrato.Investidor";

export default function ExtratoPage() {
  const [userType, setUserType] = useState<"MEI" | "Investidor" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved === "MEI" || saved === "Investidor") setUserType(saved);
    else setUserType("MEI");
  }, []);

  if (!userType) return null;

  return userType === "MEI" ? <ExtratoMEI /> : <ExtratoInvestidor />;
}
