"use client";

import { useState, useEffect, useMemo } from "react";
import { productsApi, lotesApi } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
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

// Utilizamos la misma lógica de getExpirationStatus que en inventario
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
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry.getTime() - SIMULATED_TODAY.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Caducado hace ${Math.abs(diffDays)}d`,
      color: "bg-red-100 text-red-700 border border-red-200",
      level: "caducado" as const,
    };
  } else if (diffDays <= 7) {
    return {
      label: `Crítico (${diffDays}d)`,
      color: "bg-orange-100 text-orange-700 border border-orange-200",
      level: "critico" as const,
    };
  } else if (diffDays <= 30) {
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

export function ExpirationPanel() {
  const { user } = useAuthStore();
  const [productos, setProductos] = useState<ProductoConStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

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
            console.error("Error fetching lotes for product", p.id_producto);
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
        // Solo lotes con cantidad mayor a 0 y que tengan fecha de caducidad
        if (l.cantidad_actual > 0) {
          if (l.fecha_caducidad) {
            lotes.push({ ...l, producto: p });
          }
        }
      });
    });

    // Ordenar de más cercano a vencer (o más vencido) al más lejano
    lotes.sort((a, b) => {
      const dateA = new Date(a.fecha_caducidad!).getTime();
      const dateB = new Date(b.fecha_caducidad!).getTime();
      return dateA - dateB;
    });

    return lotes;
  }, [productos]);

  const handleDeleteLote = async (id_lote: string) => {
    setDeleteLoading(id_lote);
    try {
      await lotesApi.delete(id_lote);
      showToast("Lote dado de baja (Merma) correctamente", "success");
      // Refrescar los datos para recalcular stock
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Error al dar de baja el lote", "error");
    } finally {
      setDeleteLoading(null);
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

  if (allLotes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">
          No hay lotes con fecha de caducidad en el inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          <p className="font-medium text-sm">{toast.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allLotes.map((lote) => {
          const status = getExpirationStatus(lote.fecha_caducidad);

          return (
            <div
              key={lote.id_lote}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md"
            >
              {/* Header Status Bar */}
              <div
                className={`px-4 py-2 flex items-center justify-between border-b ${status.color.replace("border", "border-b")} ${status.color.split(" ")[0]}`}
              >
                <div className="flex items-center gap-1.5 font-medium text-sm">
                  {status.level === "caducado" || status.level === "critico" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {status.label}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3
                      className="font-semibold text-slate-900 truncate"
                      title={lote.producto.nombre}
                    >
                      {lote.producto.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cód:{" "}
                      {lote.producto.codigo_barras || lote.producto.id_producto}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 mt-auto">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Box className="h-3.5 w-3.5" /> Lote
                    </span>
                    <span className="font-medium text-slate-700">
                      {lote.codigo_lote || "Sin código"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" /> Caducidad
                    </span>
                    <span className="font-medium text-slate-700">
                      {new Date(lote.fecha_caducidad!).toLocaleDateString(
                        "es-ES",
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" /> Cantidad
                    </span>
                    <span className="font-bold text-slate-900">
                      {lote.cantidad_actual}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        {lote.producto.categoria}
                      </span>
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
                      <Trash2 className="h-4 w-4" />
                    )}
                    Dar de baja (Merma)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
