"use client";

import { useState, useEffect, useMemo } from "react";
import { productsApi, lotesApi } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { ProductoConStock, LoteInventario } from "../../types/inventario";
import {
  AlertTriangle,
  Clock,
  CalendarDays,
  CheckCircle2,
  Package,
  Trash2,
  Box,
} from "lucide-react";

// Normalización de la fecha actual a media noche UTC
export const SIMULATED_TODAY = (() => {
  const today = new Date();
  return new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
})();

export const getExpirationStatus = (expiryDateStr: string | null) => {
  if (!expiryDateStr) {
    return {
      label: "Sin caducidad",
      color: "bg-gray-100 text-gray-700 border border-gray-200",
      level: "ok" as const,
    };
  }

  // Parseo seguro de fecha evitando desfases de zona horaria local
  const [year, month, day] = expiryDateStr.split("T")[0].split("-").map(Number);
  const expiry = new Date(Date.UTC(year, month - 1, day));
  
  const diffTime = expiry.getTime() - SIMULATED_TODAY.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Caducado hace ${Math.abs(diffDays)}d`,
      color: "bg-red-100 text-red-700 border border-red-200",
      level: "caducado" as const,
    };
  } else if (diffDays <= 10) {
    return {
      label: `Crítico (${diffDays}d)`,
      color: "bg-orange-100 text-orange-700 border border-orange-200",
      level: "critico" as const,
    };
  } else if (diffDays <= 20) {
    return {
      label: `Cercano (${diffDays}d)`,
      color: "bg-amber-100 text-amber-700 border border-amber-200",
      level: "cercano" as const,
    };
  } else {
    return {
      label: `Vigente (${diffDays}d)`,
      color: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      level: "vigente" as const,
    };
  }
};

type LoteWithProduct = LoteInventario & { producto: ProductoConStock };

const FILTER_OPTIONS = [
  { key: "all", label: "Todos los lotes" },
  { key: "caducado", label: "Caducados" },
  { key: "critico", label: "Críticos (≤10 días)" },
  { key: "cercano", label: "Cercanos (≤20 días)" },
] as const;

export function ExpirationPanel() {
  const { user } = useAuthStore();
  const [productos, setProductos] = useState<ProductoConStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "caducado" | "critico" | "cercano"
  >("all");

  const globalToast = useToastStore();

  const loadData = async () => {
    if (!user?.id_negocio) return;
    setLoading(true);
    try {
      const prods = await productsApi.getAll();
      const populated = await Promise.all(
        prods.map(async (p: any) => {
          let lotes: LoteInventario[] = [];
          try {
            lotes = await lotesApi.getByProduct(p.id_producto);
          } catch (e) {
            console.error("Error fetching lotes for product", p.id_producto, e);
          }
          return { ...p, lotes };
        }),
      );
      setProductos(populated);
      setError("");
    } catch (err: any) {
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const allLotes: LoteWithProduct[] = useMemo(() => {
    const lotes: LoteWithProduct[] = [];
    productos.forEach((p) => {
      p.lotes.forEach((l) => {
        if (l.cantidad_actual > 0 && l.fecha_caducidad) {
          lotes.push({ ...l, producto: p });
        }
      });
    });

    return lotes.sort((a, b) => {
      const dateA = new Date(a.fecha_caducidad!).getTime();
      const dateB = new Date(b.fecha_caducidad!).getTime();
      return dateA - dateB;
    });
  }, [productos]);

  const filteredLotes = useMemo(() => {
    if (filter === "all") return allLotes;

    return allLotes.filter((lote) => {
      const status = getExpirationStatus(lote.fecha_caducidad);
      return status.level === filter;
    });
  }, [allLotes, filter]);

  const handleDeleteLote = async (id_lote: string) => {
    setDeleteLoading(id_lote);
    try {
      await lotesApi.delete(id_lote);
      globalToast.success("Lote dado de baja (Merma) correctamente", { title: "LOTE DADO DE BAJA" });
      await loadData();
    } catch (err: any) {
      globalToast.error(err.message || "Error al dar de baja el lote", { title: "ERROR" });
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const getFilterBtnStyles = (key: string, isSelected: boolean) => {
    if (isSelected) {
      switch (key) {
        case "all":
          return "bg-slate-900 text-white border-slate-900";
        case "caducado":
          return "bg-red-600 text-white border-red-600";
        case "critico":
          return "bg-orange-500 text-white border-orange-500";
        case "cercano":
          return "bg-amber-500 text-white border-amber-500";
        default:
          return "bg-slate-900 text-white border-slate-900";
      }
    }

    switch (key) {
      case "caducado":
        return "bg-orange-50/50 text-red-600 border-transparent hover:bg-orange-100/50";
      case "critico":
        return "bg-orange-50/50 text-orange-700 border-transparent hover:bg-orange-100/50";
      case "cercano":
        return "bg-orange-50/50 text-amber-700 border-transparent hover:bg-orange-100/50";
      default:
        return "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification centralized */}

      {/* Botones del filtro */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {FILTER_OPTIONS.map((item) => {
          const isSelected = filter === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as typeof filter)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${getFilterBtnStyles(
                item.key,
                isSelected
              )}`}
            >
              {!isSelected && item.key === "caducado" && (
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              )}
              {!isSelected && item.key === "critico" && (
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              )}
              {!isSelected && item.key === "cercano" && (
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      {filteredLotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm px-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 text-center">
            ¡Excelente control de caducidades!
          </h2>
          <p className="mt-2 text-slate-500 text-center max-w-md">
            No hay lotes que coincidan con la criticidad filtrada.
          </p>
        </div>
      ) : (
        /* Grid Responsivo de Tarjetas */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLotes.map((lote) => {
            const status = getExpirationStatus(lote.fecha_caducidad);
            
            return (
              <div key={lote.id_lote} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md min-w-0">
                {/* Header Status Bar */}
                <div className={`px-4 py-2 flex items-center justify-between border-b ${status.color.replace('border', 'border-b')} ${status.color.split(' ')[0]}`}>
                  <div className="flex items-center gap-1.5 font-medium text-sm truncate">
                    {status.level === "caducado" || status.level === "critico" ? (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{status.label}</span>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col min-w-0">
                  <div className="flex items-start justify-between mb-3 min-w-0">
                    <div className="w-full min-w-0">
                      <h3
                        className="font-semibold text-slate-900 truncate"
                        title={lote.producto.nombre}
                      >
                        {lote.producto.nombre}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 truncate">
                        Categoría: {lote.producto.categoria}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 mt-auto">
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                        <Box className="h-3.5 w-3.5" /> Lote
                      </span>
                      <span className="font-medium text-slate-700 truncate">{lote.codigo_lote || "Sin código"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                        <CalendarDays className="h-3.5 w-3.5" /> Caducidad
                      </span>
                      <span className="font-medium text-slate-700 shrink-0">
                        {formatDate(lote.fecha_caducidad!)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                        <Package className="h-3.5 w-3.5" /> Stock disponible
                      </span>
                      <span className="font-bold text-slate-900 shrink-0">
                        {lote.cantidad_actual} uds.
                      </span>
                    </div>
                  </div>
                  
                  {/* Botón de Merma (Solo para caducados) */}
                  {status.level === "caducado" && (
                    <button
                      onClick={() => handleDeleteLote(lote.id_lote)}
                      disabled={deleteLoading === lote.id_lote}
                      className="w-full mt-2 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === lote.id_lote ? (
                        <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="h-4 w-4 shrink-0" />
                      )}
                      <span>Dar de baja (Merma)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}