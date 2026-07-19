"use client";

import { ProductoConStock } from "../../../types/inventario";
import LoteItem from "./LoteItem";

interface Props {
  producto: ProductoConStock;
}

export default function ProductCard({ producto }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
      <div>
        {/* Categoría e Indicador de Stock Global */}
        <div className="flex items-center justify-between mb-2">
          <span className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
            {producto.categoria}
          </span>
          <span className="text-sm font-semibold text-emerald-600">
            Stock total: {producto.stock_actual}
          </span>
        </div>

        {/* Detalles del Producto */}
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {producto.nombre}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Código: {producto.codigo_barras || "N/A"}
        </p>

        {/* Precio Unitario */}
        <div className="flex items-baseline justify-between mt-4 mb-3 border-b border-gray-100 pb-3">
          <span className="text-sm text-gray-400">Precio unitario:</span>
          <span className="text-xl font-extrabold text-gray-900">
            ${producto.precio_actual.toFixed(2)}
          </span>
        </div>

        {/* Listado de Lotes  */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider block uppercase">
            Lotes Disponibles:
          </span>
          {producto.lotes.map((lote) => (
            <LoteItem key={lote.id_lote} lote={lote} />
          ))}
        </div>
      </div>
    </div>
  );
}