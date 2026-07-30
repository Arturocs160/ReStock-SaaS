"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useUiStore } from "@/app/store/uiStore";

import {
  Package,
  TrendingUp,
  ShoppingCart,
  Layers,
  Clock,
  History,
  Store,
  LogOut,
  Calendar,
  X,
  Users,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    setSidebarOpen(false);
    router.push("/login");
  };

  const getToday = () => {
    const today = new Date();
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    } as const;
    return today.toLocaleDateString("es-CO", options);
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-4 transition-all duration-300 ease-out md:translate-x-0 md:sticky md:top-0 md:h-screen flex flex-col justify-between ${
          sidebarOpen
            ? "translate-x-0 visible"
            : "-translate-x-full invisible md:visible"
        } overflow-y-auto overflow-x-hidden`}
      >
        <div className="flex flex-col">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#07B474] flex items-center justify-center text-white">
                <Package size={20} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-xl">ReStock</h1>

                  <span className="px-2 py-0.5 rounded-full bg-[#DFF9E6] text-[#07B474] text-xs">
                    SaaS
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  Inventario Inteligente para tu Negocio
                </p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-[10px] font-bold text-gray-400 mb-3 tracking-wider uppercase">
            MÓDULOS
          </p>

          <nav
            className="space-y-2 text-sm"
            onClick={() => setSidebarOpen(false)}
          >
            {mounted && user?.role === "cashier" ? (
              <>
                <Link
                  href="/dashboard/ventas"
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
                    pathname === "/dashboard/ventas"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ShoppingCart size={18} />
                  Generar venta
                </Link>

                <Link
                  href="/dashboard/historial"
                  className={`w-full flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-xl ${
                    pathname === "/dashboard/historial"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <History size={18} />
                  Historial de ventas
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-xl font-medium ${
                    pathname === "/dashboard"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp size={18} />
                    Vista general
                  </span>
                </Link>

                <Link
                  href="/dashboard/ventas"
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
                    pathname === "/dashboard/ventas"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ShoppingCart size={18} />
                  Generar venta
                </Link>

                <Link
                  href="/dashboard/inventario"
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
                    pathname === "/dashboard/inventario"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Layers size={18} />
                  Inventario por lotes
                </Link>

                <Link
                  href="/dashboard/categorias"
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
                    pathname === "/dashboard/categorias"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Tag size={18} />
                  Categorías
                </Link>

                <Link
                  href="/dashboard/vencimientos"
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-xl ${
                    pathname === "/dashboard/vencimientos"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    Fechas de vencimiento
                  </span>
                </Link>

                <Link
                  href="/dashboard/compras"
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
                    pathname === "/dashboard/compras"
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <TrendingUp size={18} />
                  Planificación de compras
                </Link>

                <Link
                  href="/dashboard/historial"
                  className={`w-full flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-xl ${
                    pathname === "/dashboard/historial"
                      ? "bg-[#DFF9E6] text-[#07B474]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <History size={18} />
                  Historial de ventas
                </Link>

                {mounted && user?.role === "admin" && (
                  <>
                    <Link
                      href="/dashboard/configuracion"
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
                        pathname === "/dashboard/configuracion"
                          ? "bg-[#DFF9E6] text-[#07B474]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Store size={18} />
                      Configuración
                    </Link>

                    <Link
                      href="/dashboard/equipo"
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
                        pathname === "/dashboard/equipo"
                          ? "bg-[#DFF9E6] text-[#07B474]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Users size={18} />
                      Equipo
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="mt-8 border-t pt-6 text-sm">
          <div className="border rounded-xl p-3 bg-gray-50/50">
            <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider">
              Fecha actual
            </p>

            <div className="flex items-center gap-2 mt-1.5">
              <Calendar size={18} className="text-[#07B474]" />
              <span className="font-semibold text-gray-700 text-xs">
                {mounted ? getToday() : ""}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
