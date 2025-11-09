"use client";

import { useEffect, useState } from "react";
import SettingsMEI from "./components/Settings.MEI";
import SettingsInvestidor from "./components/Settings.Investidor";

export default function SettingsPage() {
  const [userType, setUserType] = useState<"MEI" | "Investidor" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved === "MEI" || saved === "Investidor") setUserType(saved);
    else setUserType("MEI");
  }, []);

  if (!userType) return null;

  return userType === "MEI" ? <SettingsMEI /> : <SettingsInvestidor />;
}
