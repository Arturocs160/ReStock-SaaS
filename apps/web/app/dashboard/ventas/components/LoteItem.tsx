"use client";

import { LoteInventario } from "../../../types/inventario";

interface Props {
  lote: LoteInventario;
}

export default function LoteItem({ lote }: Props) {
  
  // Calcula dinámicamente el estado y los días de vencimiento
  const getDiasRestantesLabel = (fechaCaducidad: string | null) => {
    if (!fechaCaducidad) {
      return { text: "Sin caducidad", className: "bg-gray-100 text-gray-700" };
    }
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const caducidad = new Date(fechaCaducidad);
    caducidad.setHours(0, 0, 0, 0);
    
    const diffTime = caducidad.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        text: `Caducado hace ${Math.abs(diffDays)}d`, 
        className: "bg-red-50 text-red-600 border border-red-200" 
      };
    } else if (diffDays <= 7) {
      return { 
        text: `Caduca en ${diffDays}d`, 
        className: "bg-orange-50 text-orange-600 border border-orange-200" 
      };
    } else {
      return { 
        text: `Vigente (${diffDays}d)`, 
        className: "bg-emerald-50 text-emerald-600 border border-emerald-200" 
      };
    }
  };

  const badge = getDiasRestantesLabel(lote.fecha_caducidad);

  return (
    <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl">
      <div className="flex flex-col space-y-1">
        <span className="text-xs font-semibold text-gray-700">
          {lote.codigo_lote}{" "}
          <span className="text-gray-400 font-normal">({lote.cantidad_actual} uds)</span>
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium inline-block self-start ${badge.className}`}>
          {badge.text}
        </span>
      </div>
      
      <button
        type="button"
        onClick={() => console.log(`Agregar al carrito: Lote ${lote.id_lote}`)}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
      >
        + Agregar
      </button>
    </div>
  );
}