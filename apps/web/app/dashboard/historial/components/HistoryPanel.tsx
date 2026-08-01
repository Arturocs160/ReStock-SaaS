"use client";

import { useEffect, useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  History,
} from "lucide-react";

import { salesApi } from "@/app/lib/api";
import { MetricCard } from "./MetricCard";
import { MetricsSkeleton } from "./MetricsSkeleton";
import { SearchBar } from "./SearchBar";
import { SalesMetrics, Sale } from "./types";
import { SalesTable } from "./SalesTable";

// Acentos y mayúsculas 
const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function HistoryPanel() {
  const [metrics, setMetrics] = useState<SalesMetrics>({
    ingresosTotales: 0,
    transaccionesTotales: 0,
    ticketPromedio: 0,
  });
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [search, setSearch] = useState("");

  // Cargar Métricas 
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoadingMetrics(true);
        
        const response: any = await salesApi.getMetrics();

        
        const data = response?.metricas || response?.data || response || {};

        setMetrics({
          ingresosTotales: Number(
            data.ingresos ?? data.ingresosTotales ?? data.ingresos_totales ?? 0
          ),
          transaccionesTotales: Number(
            data.transacciones ?? data.transaccionesTotales ?? data.transacciones_totales ?? 0
          ),
          ticketPromedio: Number(
            data.ticket_promedio ?? data.ticketPromedio ?? 0
          ),
        });
      } catch (error) {
        console.error("Error al cargar métricas (HUF-17):", error);
        setMetrics({
          ingresosTotales: 0,
          transaccionesTotales: 0,
          ticketPromedio: 0,
        });
      } finally {
        setLoadingMetrics(false);
      }
    };

    loadMetrics();
  }, []);

  
  useEffect(() => {
    const loadSalesHistory = async () => {
      try {
        setLoadingSales(true);
        const response: any = await salesApi.getHistory();

        const salesList: any[] = Array.isArray(response)
          ? response
          : response?.ventas || response?.data || [];

        const formattedSales: Sale[] = salesList.map((v: any, index: number) => {
          const ventaId = String(v.id || v.id_venta || v._id || `V${index + 1}`);
          const detallesList = v.detalles || v.detalle_va_venta || v.items || [];

          
          let cajeroNombre = "Cajero";
          const rawCajero = v.cajero || v.usuario || v.vendedor || v.user;

          if (typeof rawCajero === "object" && rawCajero !== null) {
            const nombre =
              rawCajero.nombre ||
              rawCajero.name ||
              rawCajero.email?.split("@")[0] ||
              "Cajero";
            const rolRaw = rawCajero.rol || rawCajero.role || rawCajero.tipo;

            let rolFormatted = "";
            if (rolRaw) {
              const rolLower = String(rolRaw).toLowerCase();
              if (rolLower.includes("admin") || rolLower.includes("owner")) {
                rolFormatted = " (Admin)";
              } else if (
                rolLower.includes("colaborador") ||
                rolLower.includes("staff")
              ) {
                rolFormatted = " (Colaborador)";
              } else {
                rolFormatted = ` (${rolRaw})`;
              }
            }
            cajeroNombre = `${nombre}${rolFormatted}`;
          } else if (typeof rawCajero === "string" && rawCajero.trim() !== "") {
            cajeroNombre = rawCajero;
          }

          return {
            id: ventaId,
            folio:
              v.folio ||
              v.codigo ||
              `#${ventaId.startsWith("#") ? ventaId.slice(1) : ventaId}`,
            fecha:
              v.fecha ||
              v.fecha_transaccion ||
              v.createdAt ||
              new Date().toISOString(),
            cajero: cajeroNombre,
            articulos: v.articulos ?? v.total_articulos ?? detallesList.length,
            total: Number(v.total) || Number(v.monto_total) || 0,
            tipoPago: v.metodo_pago || v.tipo_pago || "Efectivo",
            detalles: detallesList.map((d: any) => {
              const cant = Number(d.cantidad ?? d.cantidad_sold ?? 0);
              const precio = Number(
                d.precioUnitario ?? d.precio_unitario ?? d.precio ?? 0
              );

              let prodNombre = "Producto sin nombre";
              const rawProd = d.producto || d.producto_nombre || d.nombre;

              if (typeof rawProd === "object" && rawProd !== null) {
                prodNombre =
                  rawProd.nombre || rawProd.name || "Producto sin nombre";
              } else if (typeof rawProd === "string") {
                prodNombre = rawProd;
              }

              return {
                id: String(d.id || d.id_detalle || "det-id"),
                producto: prodNombre,
                cantidad: cant,
                precioUnitario: precio,
                subtotal: Number(d.subtotal) || cant * precio,
              };
            }),
          };
        });

        setSales(formattedSales);
      } catch (error) {
        console.error("Error al cargar historial de ventas:", error);
        setSales([]);
      } finally {
        setLoadingSales(false);
      }
    };

    loadSalesHistory();
  }, []);

  
  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;

    const query = normalizeText(search);

    return sales.filter((sale) => {
      
      const matchId = normalizeText(sale.id).includes(query);
      const matchFolio = normalizeText(sale.folio).includes(query);

      
      const matchCajero = normalizeText(sale.cajero).includes(query);

      
      const matchProducto = sale.detalles.some((detalle) =>
        normalizeText(detalle.producto).includes(query)
      );

      return matchId || matchFolio || matchCajero || matchProducto;
    });
  }, [sales, search]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <section className="space-y-6 w-full">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Historial de ventas
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Consulta el registro de transacciones completadas en tu punto de venta en tiempo real.
        </p>
      </div>

      {/* Tarjetas de Métricas*/}
      {loadingMetrics ? (
        <MetricsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="INGRESOS TOTALES"
            value={
              <h2 className="text-3xl font-extrabold text-[#07B474]">
                {formatCurrency(metrics.ingresosTotales)}
              </h2>
            }
            description="Acumulado de transacciones"
            icon={<DollarSign size={24} />}
            iconContainerClassName="bg-[#E8F8EF]"
            iconClassName="text-[#07B474]"
          />

          <MetricCard
            title="TRANSACCIONES TOTALES"
            value={
              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  {metrics.transaccionesTotales}
                </span>

                <span className="mb-1 text-sm text-gray-400 font-normal">
                  ventas
                </span>
              </div>
            }
            description="Ventas realizadas correctamente"
            icon={<History size={24} />}
            iconContainerClassName="bg-[#EEF3FF]"
            iconClassName="text-[#2563EB]"
          />

          <MetricCard
            title="TICKET PROMEDIO"
            value={
              <h2 className="text-3xl font-extrabold text-[#D97706]">
                {formatCurrency(metrics.ticketPromedio)}
              </h2>
            }
            description="Monto promedio por compra"
            icon={<TrendingUp size={24} />}
            iconContainerClassName="bg-[#FFF4E8]"
            iconClassName="text-[#D97706]"
          />
        </div>
      )}

      {/* Buscador */}
      <div className="w-full">
        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Tabla con ventas*/}
      <SalesTable sales={filteredSales} loading={loadingSales} />
    </section>
  );
}