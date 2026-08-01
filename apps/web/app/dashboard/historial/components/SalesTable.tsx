"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function SalesTable({ sales, loading }: { sales: any[]; loading: boolean }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(val);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50/70 text-gray-400 font-bold text-xs tracking-wider uppercase border-b border-gray-100">
              <th className="py-4 px-6">ID VENTA</th>
              <th className="py-4 px-6">FECHA Y HORA</th>
              <th className="py-4 px-6">CAJERO</th>
              <th className="py-4 px-6">ARTÍCULOS</th>
              <th className="py-4 px-6">TOTAL</th>
              <th className="py-4 px-6 text-right">DETALLE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                  Cargando historial de ventas...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-500 font-medium text-sm">
                  No se encontraron transacciones para la búsqueda.
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const isExpanded = expandedRow === sale.id;
                return (
                  <React.Fragment key={sale.id}>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {sale.folio}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {new Date(sale.fecha).toLocaleString("es-MX", {
                          dateStyle: "medium",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {sale.cajero}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          {sale.articulos} uds.
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-[#07B474]">
                        {formatCurrency(sale.total)} M.N.
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => toggleExpand(sale.id)}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            isExpanded
                              ? "bg-blue-50 text-blue-600"
                              : "text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" /> Ocultar
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" /> Ver detalle
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Desplegable de artículos */}
                    {isExpanded && (
                      <tr className="bg-gray-50/50 border-t border-b border-gray-100">
                        <td colSpan={6} className="py-5 px-8">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              ARTÍCULOS VENDIDOS EN ESTE TICKET:
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              Tipo de Pago: <strong className="text-gray-700">{sale.tipoPago || "Efectivo"}</strong>
                            </span>
                          </div>

                          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="bg-gray-50/70 text-gray-400 font-semibold border-b border-gray-100 uppercase">
                                  <th className="py-3 px-6">PRODUCTO</th>
                                  <th className="py-3 px-6">CANTIDAD</th>
                                  <th className="py-3 px-6">PRECIO UNITARIO</th>
                                  <th className="py-3 px-6 text-right">SUBTOTAL</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-gray-700">
                                {sale.detalles && sale.detalles.length > 0 ? (
                                  sale.detalles.map((det: any, idx: number) => (
                                    <tr key={det.id || idx} className="hover:bg-gray-50/30">
                                      <td className="py-3 px-6 font-semibold text-gray-900">
                                        {det.producto}
                                      </td>
                                      <td className="py-3 px-6 text-gray-600">
                                        {det.cantidad} uds.
                                      </td>
                                      <td className="py-3 px-6 text-gray-600">
                                        {formatCurrency(det.precioUnitario)}
                                      </td>
                                      <td className="py-3 px-6 text-right font-bold text-gray-900">
                                        {formatCurrency(det.subtotal)}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="py-4 text-center text-gray-400 italic">
                                      Sin detalle de productos registrado.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}