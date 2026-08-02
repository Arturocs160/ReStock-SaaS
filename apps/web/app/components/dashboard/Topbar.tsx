"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";

export function Topbar() {
  const { user, checkSession, isLoading } = useAuthStore();
  const { toggleSidebar } = useUiStore();
  const [storeName, setStoreName] = useState("Mi Tienda");

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
        const response = await fetch(`${apiUrl}/negocio`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.nombre) {
            setStoreName(data.nombre);
          }
        }
      } catch (err) {
        console.error("Error al obtener el nombre del negocio:", err);
      }
    };

    if (user) {
      fetchStoreName();
    }
  }, [user]);

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
          <p className="font-semibold text-sm text-gray-900 leading-tight">{storeName}</p>
          <p className="text-xs text-gray-500 leading-tight mt-0.5">{user?.name}</p>

          <p className="text-[#07B474] text-[11px] flex items-center justify-end gap-1 mt-1 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#07B474] inline-block animate-pulse"></span>
            {user?.role === "admin"
              ? "Administrador"
              : user?.role === "cashier"
                ? "Cajero"
                : "Empleado"}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
          {initial}
        </div>
      </div>
    </header>
  );
}
