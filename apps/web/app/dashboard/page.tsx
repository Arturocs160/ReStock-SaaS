"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Topbar } from "../components/dashboard/Topbar";
import { MetricsCards } from "../components/dashboard/MetricsCards";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { RecentSales } from "../components/dashboard/RecentSales";
import { productsApi, lotesApi } from "../lib/api";
import {
  LoteInventario,
  ProductoConStock,
  Producto,
} from "../types/inventario";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<ProductoConStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "cashier") {
      router.replace("/dashboard/ventas");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const prods = await productsApi.getAll();
        const populated = await Promise.all(
          prods.map(async (p: Producto) => {
            let lotes: LoteInventario[] = [];
            try {
              const fetchedLotes = await lotesApi.getByProduct(p.id_producto);
              lotes = fetchedLotes.map((l: LoteInventario) => ({
                ...l,
                fecha_ingreso: l.fecha_ingreso
                  ? l.fecha_ingreso.split("T")[0]
                  : "",
                fecha_caducidad: l.fecha_caducidad
                  ? l.fecha_caducidad.split("T")[0]
                  : null,
                cantidad_actual:
                  l.cantidad_actual !== undefined
                    ? l.cantidad_actual
                    : l.cantidad_inicial,
              }));
            } catch (err) {
              console.error(
                `Error loading lotes for product ${p.id_producto}:`,
                err,
              );
            }
            const stock_actual = lotes.reduce(
              (sum, l) => sum + l.cantidad_actual,
              0,
            );
            return {
              ...p,
              categoria: p.categoria || "General",
              lotes,
              stock_actual,
            };
          }),
        );
        setProducts(populated);
      } catch (err) {
        console.error("Error loading inventory on dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Resumen Operativo
            </h1>

            <p className="text-gray-500 mt-1">
              Métricas clave e información de inventario de tu negocio al día de
              hoy.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between min-h-[100px] animate-pulse"
                >
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-2.5 bg-gray-150 rounded-full w-32"></div>
                  </div>
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-gray-100"></div>
                </div>
              ))}
            </div>
          ) : (
            <MetricsCards products={products} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full space-y-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded-full w-48"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-24 bg-gray-50 rounded-xl"></div>
                  <div className="h-24 bg-gray-50 rounded-xl"></div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-gray-200 rounded-full w-36"></div>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-16 bg-gray-50 border border-gray-200 rounded-xl"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <AlertsPanel products={products} />
              )}
            </div>

            <div>
              <RecentSales />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
