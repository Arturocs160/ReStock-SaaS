"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Calendar, Plus } from "lucide-react";
import { salesApi } from "../../lib/api";

interface SaleProduct {
  name: string;
  qty: number;
}

interface FormattedSale {
  id: string;
  folio: string;
  fecha: string;
  cajero: string;
  total: number;
  tipoPago: string;
  products: SaleProduct[];
}

export function RecentSales() {
  const [sales, setSales] = useState<FormattedSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        setLoading(true);
        const response: any = await salesApi.getHistory();
        const salesList: any[] = Array.isArray(response)
          ? response
          : response?.ventas || response?.data || [];

        const formatted: FormattedSale[] = salesList.map((v: any, index: number) => {
          const ventaId = String(v.id || v.id_venta || v._id || `V${index + 1}`);
          const detallesList = v.detalles || v.detalle_va_venta || v.items || [];

          let cajeroNombre = "Cajero";
          const rawCajero = v.cajero || v.usuario || v.vendedor || v.user;

          if (typeof rawCajero === "object" && rawCajero !== null) {
            cajeroNombre = rawCajero.nombre || rawCajero.name || rawCajero.email?.split("@")[0] || "Cajero";
          } else if (typeof rawCajero === "string" && rawCajero.trim() !== "") {
            cajeroNombre = rawCajero;
          }

          return {
            id: ventaId,
            folio: v.folio || v.codigo || `#${ventaId.slice(-6).toUpperCase()}`,
            fecha: v.fecha || v.fecha_transaccion || v.createdAt || new Date().toISOString(),
            cajero: cajeroNombre,
            total: Number(v.total) || Number(v.monto_total) || 0,
            tipoPago: v.metodo_pago || v.tipo_pago || "Efectivo",
            products: detallesList.map((d: any) => {
              let prodNombre = "Producto sin nombre";
              const rawProd = d.producto || d.producto_nombre || d.nombre;
              if (typeof rawProd === "object" && rawProd !== null) {
                prodNombre = rawProd.nombre || rawProd.name || "Producto sin nombre";
              } else if (typeof rawProd === "string") {
                prodNombre = rawProd;
              }
              return {
                name: prodNombre,
                qty: Number(d.cantidad ?? d.cantidad_sold ?? 0),
              };
            }),
          };
        });

        // Tomar las 5 ventas más recientes
        setSales(formatted.slice(0, 5));
      } catch (err) {
        console.error("Error cargando últimas ventas en dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSales();
  }, []);

  const formatSaleTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Hace un momento";
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} hr`;

      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
      }) + ` ${date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return "Hace un momento";
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-800 flex items-center gap-2.5 text-lg">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <ShoppingCart size={18} className="text-[#00a365]" />
          </div>
          Últimas Ventas
        </h2>

        <Link
          href="/dashboard/ventas"
          className="bg-[#00a365] hover:bg-[#008c54] text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition duration-200 shadow-sm flex items-center gap-1 hover:shadow active:scale-[0.98] cursor-pointer"
        >
          <Plus size={14} /> Nueva Venta
        </Link>
      </div>

      {/* Listado de Ventas */}
      <div className="flex-1 space-y-4 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
        {loading ? (
          /* Esqueleto de Carga */
          [1, 2, 3].map((n) => (
            <div
              key={n}
              className="border border-gray-100 rounded-2xl p-4 space-y-3 animate-pulse bg-gray-50/50"
            >
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                <div className="h-4 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 bg-gray-200 rounded-full w-full"></div>
                <div className="h-2.5 bg-gray-200 rounded-full w-2/3"></div>
              </div>
              <div className="h-2 bg-gray-150 rounded-full w-32 pt-1"></div>
            </div>
          ))
        ) : sales.length === 0 ? (
          /* Estado Vacío */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Sin ventas hoy</p>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
              Las ventas que realices en el punto de venta aparecerán aquí en tiempo real.
            </p>
          </div>
        ) : (
          /* Ventas Reales */
          sales.map((sale) => (
            <div
              key={sale.id}
              className="bg-gray-50/40 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-2xl p-4.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Metadatos superiores */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] md:text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Calendar size={12} className="opacity-80" />
                  {formatSaleTime(sale.fecha)}
                </span>

                <span className="font-bold text-[#00a365] text-sm md:text-base">
                  {formatCurrency(sale.total)}
                </span>
              </div>

              {/* Productos de la Venta */}
              <div className="space-y-2 mb-3 border-b border-gray-100 pb-3">
                {sale.products.map((product, idx) => (
                  <div
                    key={`${product.name}-${idx}`}
                    className="flex justify-between items-start gap-3"
                  >
                    <span className="text-xs text-gray-700 font-medium line-clamp-1">
                      {product.name}
                    </span>

                    <span className="text-xs text-gray-400 font-semibold shrink-0">
                      x{product.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Info inferior */}
              <div className="flex justify-between items-center text-[10px] md:text-xs text-gray-450 font-medium">
                <span className="flex items-center gap-1">
                  <User size={12} className="opacity-70" />
                  {sale.cajero}
                </span>

                <span className="text-[10px] text-gray-450 font-bold bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                  {sale.folio}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
