"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, BellRing, CheckCircle2, Package } from "lucide-react";
import { alertasApi } from "../../lib/api";
import { Alerta } from "../../types/alertas";
import { useToastStore } from "../../store/toastStore";

export function CentroAlertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolviendoId, setResolviendoId] = useState<string | null>(null);
  const toast = useToastStore();

  const fetchAlertas = async () => {
    try {
      setLoading(true);
      const res = await alertasApi.getAll();
      setAlertas(res.alertas || []);
    } catch (err) {
      console.error("Error cargando alertas:", err);
      toast.error(
        err instanceof Error ? err.message : "Error al cargar las alertas.",
        { title: "ERROR" },
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const pendientes = useMemo(
    () => alertas.filter((a) => !a.resuelta),
    [alertas],
  );
  const resueltas = useMemo(
    () => alertas.filter((a) => a.resuelta),
    [alertas],
  );

  const handleResolver = async (alerta: Alerta) => {
    try {
      setResolviendoId(alerta.id_alerta);
      await alertasApi.resolve(alerta.id_alerta);
      toast.success(`Alerta resuelta para: ${alerta.producto.nombre}`, {
        title: "ALERTA RESUELTA",
      });
      await fetchAlertas();
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Error al resolver la alerta.",
        { title: "ERROR" },
      );
    } finally {
      setResolviendoId(null);
    }
  };

  const formatFecha = (fecha: string) => {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <BellRing size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{pendientes.length}</p>
            <p className="text-xs text-gray-500 font-medium">Alertas pendientes</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-[#00a365]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{resueltas.length}</p>
            <p className="text-xs text-gray-500 font-medium">Alertas resueltas</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{alertas.length}</p>
            <p className="text-xs text-gray-500 font-medium">Total de alertas</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#00a365] rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500 font-medium animate-pulse">
            Cargando alertas...
          </p>
        </div>
      ) : pendientes.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={24} className="text-[#00a365]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              Sin alertas pendientes
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-md">
              Todos tus productos están por encima de su stock mínimo. Las
              alertas aparecerán aquí cuando un producto quede por debajo del
              mínimo establecido.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Alertas pendientes */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Pendientes ({pendientes.length})
            </h3>
            <div className="space-y-3">
              {pendientes.map((alerta) => (
                <div
                  key={alerta.id_alerta}
                  className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-red-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {alerta.producto.nombre}
                        </p>
                        {alerta.producto.codigo_barras && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Código: {alerta.producto.codigo_barras}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Emitida el {formatFecha(alerta.fecha_emision)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">
                          Stock actual
                        </p>
                        <p
                          className={`font-bold text-lg ${alerta.producto.stock_actual === 0
                            ? "text-red-600"
                            : "text-amber-600"
                            }`}
                        >
                          {alerta.producto.stock_actual}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">
                          Mínimo
                        </p>
                        <p className="font-bold text-lg text-gray-700">
                          {alerta.producto.stock_minimo_sugerido}
                        </p>
                      </div>

                      <button
                        onClick={() => handleResolver(alerta)}
                        disabled={resolviendoId === alerta.id_alerta}
                        className="bg-[#00a365] hover:bg-[#008c54] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {resolviendoId === alerta.id_alerta ? (
                          <>
                            <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Resolviendo...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            Marcar resuelta
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historial resuelto */}
          {resueltas.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Resueltas ({resueltas.length})
              </h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-400">
                      <th className="px-4 py-3 font-semibold">Producto</th>
                      <th className="px-4 py-3 font-semibold">Fecha de emisión</th>
                      <th className="px-4 py-3 font-semibold">Resuelta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resueltas.map((alerta) => (
                      <tr
                        key={alerta.id_alerta}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-3 font-medium text-gray-700">
                          {alerta.producto.nombre}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {formatFecha(alerta.fecha_emision)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00a365] bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                            <CheckCircle2 size={12} />
                            Resuelta
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
