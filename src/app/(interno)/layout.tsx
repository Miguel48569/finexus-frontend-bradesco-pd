"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import "@/app/globals.css";

type UserProfile = {
  type: "MEI" | "Investidor";
  name: string;
  document: string;
};

// Mock de perfis
const mockProfiles: Record<string, UserProfile> = {
  MEI: {
    type: "MEI",
    name: "João Silva",
    document: "123.456.789-00",
  },
  Investidor: {
    type: "Investidor",
    name: "Maria Santos",
    document: "987.654.321-00",
  },
};

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/");
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(
    mockProfiles.MEI
  );

  useEffect(() => {
    // Carrega o tipo de perfil do localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile === "MEI" || savedProfile === "Investidor") {
      setCurrentProfile(mockProfiles[savedProfile]);
    }
  }, []);

  useEffect(() => {
    // Atualiza a rota baseada no tipo de perfil
    if (currentProfile.type === "MEI") {
      setActiveRoute("/dashboard");
    } else {
      setActiveRoute("/carteira");
    }
  }, [currentProfile.type]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Sidebar
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userType={currentProfile.type}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
