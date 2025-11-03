"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import "@/app/globals.css";

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/");

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Sidebar
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
