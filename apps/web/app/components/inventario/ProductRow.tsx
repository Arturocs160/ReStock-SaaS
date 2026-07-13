"use client";

import { ChevronUp, ChevronDown, Plus, Edit3, Trash2 } from "lucide-react";
import { ProductoConStock, LoteInventario } from "../../types/inventario";
import { getExpirationStatus } from "../../dashboard/inventario/page";

interface ProductRowProps {
  producto: ProductoConStock;
  isExpanded: boolean;
  onToggle: () => void;
  onAddLote: () => void;
  onEditProduct: () => void;
  onDeleteProduct: () => void;
  onEditLote: (lote: LoteInventario) => void;
  onDeleteLote: (loteId: string) => void;
}

export function ProductRow({
  producto,
  isExpanded,
  onToggle,
  onAddLote,
  onEditProduct,
  onDeleteProduct,
  onEditLote,
  onDeleteLote,
}: ProductRowProps) {
  const isLowStock = producto.stock_actual < producto.stock_minimo_sugerido;

  return (
    <>
      {/* Fila Principal */}
      <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-all">
        <td className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              {producto.nombre}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/20">
                {producto.categoria}
              </span>
              {producto.codigo_barras && (
                <span className="text-[10px] text-gray-400">
                  CB: {producto.codigo_barras}
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          ${producto.precio_actual.toFixed(2)}
        </td>
        <td className="px-6 py-4 font-medium whitespace-nowrap">
          {producto.stock_minimo_sugerido} uds.
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
              isLowStock
                ? "bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400"
                : "bg-[#eafaf1] text-[#00a365] border border-[#00a365]/20 dark:bg-[#00a365]/10"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isLowStock ? "bg-red-500" : "bg-[#00a365]"}`}
            ></span>
            {producto.stock_actual} uds.
          </span>
        </td>
        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
          <button
            onClick={onAddLote}
            className="inline-flex items-center gap-1.5 text-xs text-[#00a365] font-bold hover:underline py-1 px-2.5 rounded-lg hover:bg-[#eafaf1] dark:hover:bg-[#00a365]/10 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Lote
          </button>
          <button
            onClick={onEditProduct}
            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition inline-block cursor-pointer"
            title="Editar producto"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDeleteProduct}
            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition inline-block cursor-pointer"
            title="Eliminar producto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>

      {/* Fila Expandida de Lotes */}
      {isExpanded && (
        <tr>
          <td
            colSpan={5}
            className="bg-gray-50/50 dark:bg-gray-900/10 px-8 py-4 border-b border-gray-100 dark:border-gray-900"
          >
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Desglose de lotes para este producto:
              </h4>
              {producto.lotes.length > 0 ? (
                <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-x-auto bg-white dark:bg-[#0c0c0c]">
                  <table className="w-full min-w-[650px] text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-900/80 text-[10px] uppercase font-bold text-gray-400">
                      <tr>
                        <th className="px-4 py-2.5">Código Lote</th>
                        <th className="px-4 py-2.5">Ingresado</th>
                        <th className="px-4 py-2.5">Caducidad</th>
                        <th className="px-4 py-2.5">Cantidad inicial</th>
                        <th className="px-4 py-2.5">Stock actual</th>
                        <th className="px-4 py-2.5">Estado</th>
                        <th className="px-4 py-2.5 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                      {producto.lotes.map((l) => {
                        const expStatus = getExpirationStatus(
                          l.fecha_caducidad,
                        );
                        return (
                          <tr
                            key={l.id_lote}
                            className="hover:bg-gray-50/30 dark:hover:bg-gray-900/5 transition"
                          >
                            <td className="px-4 py-2.5 font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {l.codigo_lote}
                            </td>
                            <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                              {new Date(l.fecha_ingreso).toLocaleDateString(
                                "es-MX",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                  timeZone: "UTC",
                                },
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                              {l.fecha_caducidad
                                ? new Date(
                                    l.fecha_caducidad,
                                  ).toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    timeZone: "UTC",
                                  })
                                : "Sin caducidad"}
                            </td>
                            <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                              {l.cantidad_inicial} uds.
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                              {l.cantidad_actual} uds.
                            </td>
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${expStatus.color}`}
                              >
                                {expStatus.label}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => onEditLote(l)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded transition inline-block cursor-pointer"
                                title="Editar lote"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteLote(l.id_lote)}
                                className="text-red-500 hover:text-red-700 p-1 rounded transition inline-block cursor-pointer"
                                title="Eliminar lote"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 bg-white dark:bg-[#0c0c0c] border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className="text-xs text-gray-400 italic">
                    No hay lotes ingresados para este producto. Registra uno
                    nuevo para darle stock.
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
