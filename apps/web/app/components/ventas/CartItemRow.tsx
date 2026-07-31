"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../../types/ventas";
import { useCartStore } from "../../store/cartStore";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { incrementQuantity, decrementQuantity, updateQuantity, removeLote } =
    useCartStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      updateQuantity(item.loteId, val);
    }
  };

  const isAtMax = item.cantidad >= item.stock_disponible;
  const isAtMin = item.cantidad <= 1;

  return (
    <div className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-lg">
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-sm font-bold text-slate-800 truncate">
          {item.nombre_producto}
        </h4>
        <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
          Lote: {item.codigo_lote}
        </span>
        <span className="text-xs font-bold text-slate-800 block mt-1">
          ${item.precio_unitario.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-slate-200 rounded-full bg-white shadow-sm overflow-hidden h-8">
          <button
            onClick={() => decrementQuantity(item.loteId)}
            disabled={isAtMin}
            className={`w-8 h-full flex items-center justify-center ${
              isAtMin
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Minus size={12} />
          </button>

          <input
            type="text"
            inputMode="numeric"
            value={item.cantidad}
            onChange={handleInputChange}
            className="w-8 h-full text-center text-xs font-bold text-slate-800 bg-transparent outline-none border-x border-slate-100"
          />

          <button
            onClick={() => incrementQuantity(item.loteId)}
            disabled={isAtMax}
            className={`w-8 h-full flex items-center justify-center ${
              isAtMax
                ? "text-slate-300 cursor-not-allowed opacity-50"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Plus size={12} />
          </button>
        </div>

        <button
          onClick={() => removeLote(item.loteId)}
          className="text-red-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
