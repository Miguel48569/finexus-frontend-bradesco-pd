"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Home,
  DollarSign,
  FileCheck,
  Settings,
  LogOut,
  User,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  activeRoute: string;
  onRouteChange: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userType?: "MEI" | "Investidor";
}

export default function Sidebar({
  activeRoute,
  onRouteChange,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  userType = "MEI",
}: SidebarProps) {
  const pathname = usePathname();

  const getMenuItems = () => {
    const commonItems = [
      { id: "extrato", label: "Extrato", icon: DollarSign, route: "/extrato" },
      {
        id: "contratos",
        label: "Contratos",
        icon: FileCheck,
        route: "/contratos",
      },
      { id: "perfil", label: "Meu Perfil", icon: User, route: "/perfil" },
      {
        id: "settings",
        label: "Configurações",
        icon: Settings,
        route: "/settings",
      },
    ];

    if (userType === "Investidor") {
      return [
        { id: "carteira", label: "Carteira", icon: Home, route: "/carteira" },
        {
          id: "marketplace",
          label: "Marketplace",
          icon: DollarSign,
          route: "/marketplace",
        },
        ...commonItems,
      ];
    }

    // Usuário MEI: adicionar "Solicitar Empréstimo"
    return [
      { id: "dashboard", label: "Dashboard", icon: Home, route: "/dashboard" },
      {
        id: "solicitar-emprestimo",
        label: "Solicitar Empréstimo",
        icon: DollarSign,
        route: "/solicitar-emprestimo",
      },
      ...commonItems,
    ];
  };

  const menuItems = getMenuItems();

  // Atualiza o item ativo baseado na URL atual
  React.useEffect(() => {
    const currentItem = menuItems.find((item) => item.route === pathname);
    if (currentItem) {
      onRouteChange(currentItem.id);
    }
    // menuItems e onRouteChange são incluídos nas deps para satisfazer o eslint
  }, [pathname, menuItems, onRouteChange]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          bg-gradient-to-b from-violet-700 via-violet-800 to-violet-900
          z-50 flex flex-col
          shadow-2xl shadow-violet-900/50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo + Toggle Button */}
        <div className="p-6 border-b border-violet-600/30 relative">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 overflow-hidden transition-all ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
              }`}
            >
              <Image
                src="/logo-finexus-df.png"
                alt="Finexus"
                width={150}
                height={40}
                className="h-10 w-auto brightness-0 invert"
                priority
              />
            </div>

            {/* Close button (mobile only) */}
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:bg-violet-600 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toggle Collapse Button (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-violet-800 hover:bg-violet-600 text-white p-1.5 rounded-full shadow-lg transition-all z-10 border-2 border-violet-600"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;

            return (
              <Link
                key={item.id}
                href={item.route}
                onClick={() => {
                  onRouteChange(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-white text-violet-700 shadow-lg shadow-violet-900/20"
                      : "text-violet-100 hover:bg-violet-600/50"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-violet-600" : "text-violet-200"
                  }`}
                />
                <span
                  className={`font-medium whitespace-nowrap overflow-hidden transition-all ${
                    isCollapsed ? "opacity-0 w-0" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-violet-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-violet-600/30">
          <Link
            href="/"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-violet-100 hover:bg-red-500/20 hover:text-red-200 transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`font-medium whitespace-nowrap overflow-hidden transition-all ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Sair
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
