"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  History,
} from "lucide-react";

import { MetricCard } from "./MetricCard";
import { MetricsSkeleton } from "./MetricsSkeleton";
import { SearchBar } from "./SearchBar";
import { mockMetrics } from "./mockMetrics";
import { SalesMetrics } from "./types";
import { SalesTable } from "./SalesTable";
import { mockSales } from "./mockSales";

export function HistoryPanel() {
  const [metrics, setMetrics] = useState<SalesMetrics>(mockMetrics);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simulación mientras el endpoint aún no está en dev
    const timer = setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Historial de Ventas
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulta el desempeño general de las ventas del negocio.
        </p>
      </div>

      {loading ? (
        <MetricsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="INGRESOS TOTALES"
            value={
              <h2 className="text-3xl font-bold text-[#07B474]">
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
                <span className="text-3xl font-bold text-gray-900">
                  {metrics.transaccionesTotales}
                </span>

                <span className="mb-1 text-sm text-gray-400">
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
              <h2 className="text-3xl font-bold text-[#D97706]">
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
      <div className="flex justify-end">
        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Tabla */}
      <SalesTable sales={mockSales} />
    </section>
  );
}