"use client";

import { useEffect } from "react";
import { Menu } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";

export function Topbar() {
  const { user, checkSession, isLoading } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading) {
    return (
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-right">
            <p className="font-semibold text-sm text-gray-500">Cargando...</p>
          </div>
        </div>
      </header>
    );
  }

  const storeName = user?.nombre || "Mi Tienda";
  const initial = (user?.name || "M").charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right">
          <p className="font-semibold text-sm">{storeName}</p>

          <p className="text-[#07B474] text-sm flex items-center justify-end gap-1">
            <span className="h-2 w-2 rounded-full bg-[#07B474] inline-block"></span>
            {user?.role === "admin" ? "Administrador" : "Usuario"}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
          {initial}
        </div>
      </div>
    </header>
  );
}
