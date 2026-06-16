'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-72 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
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

            <p className="text-xs text-gray-500 whitespace-nowrap">
              Inventario Inteligente para tu Negocio
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-400 mb-4">
        MÓDULOS
      </p>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium ${pathname === "/dashboard"
            ? "bg-[#DFF9E6] text-[#07B474]"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          <span className="flex items-center gap-2">
            <TrendingUp size={18} />
            Vista general
          </span>

          <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">
            3
          </span>
        </Link>

        <Link
          href="/dashboard/ventas"
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl ${pathname === "/dashboard/ventas"
            ? "bg-[#DFF9E6] text-[#07B474]"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          <ShoppingCart size={18} />
          Generar venta
        </Link>

        <Link
          href="/dashboard/inventario"
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl ${pathname === "/dashboard/inventario"
            ? "bg-[#DFF9E6] text-[#07B474]"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          <Layers size={18} />
          Inventario por lotes
        </Link>

        <Link
          href="/dashboard/vencimientos"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${pathname === "/dashboard/vencimientos"
            ? "bg-[#DFF9E6] text-[#07B474]"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          <span className="flex items-center gap-2">
            <Clock size={18} />
            Fechas de vencimiento
          </span>

          <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">
            7
          </span>
        </Link>

        <Link
          href="/dashboard/compras"
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl ${pathname === "/dashboard/compras"
            ? "bg-orange-50 text-orange-500"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          <TrendingUp size={18} />
          Planificación de compras
        </Link>

        <Link
          href="/dashboard/historial"
          className={`w-full flex items-center gap-2 px-4 py-3 whitespace-nowrap rounded-xl ${pathname === "/dashboard/historial"
            ? "bg-[#DFF9E6] text-[#07B474]"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          <History size={18} />
          Historial de ventas
        </Link>

        <Link
          href="/dashboard/configuracion"
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl ${pathname === "/dashboard/configuracion"
            ? "bg-[#DFF9E6] text-[#07B474]"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          <Store size={18} />
          Configuración
        </Link>
      </nav>

      <div className="mt-20 border-t pt-6">
        <div className="border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Fecha Simulación:
          </p>

          <div className="flex items-center gap-2 mt-2">
            <Calendar
              size={18}
              className="text-[#07B474]"
            />
            <span className="font-semibold">
              14 Jun, 2026
            </span>
          </div>
        </div>

        <button className="mt-8 flex items-center gap-2 text-gray-500 cursor-pointer hover:text-red-500">
          <LogOut size={18} />
          Cerrar Sesión (Demo)
        </button>
      </div>
    </aside>
  );
}