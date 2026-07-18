'use client';

import React from 'react';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { CartItemRow } from './CartItemRow';

export function CartPanel() {
  const { items, total } = useCartStore();

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <aside className="w-full md:w-[350px] lg:w-[400px] bg-white border border-slate-200 rounded-2xl flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center text-emerald-600 mb-1">
          <ShoppingCart className="mr-2" size={22} />
          <h2 className="font-bold text-lg text-slate-800">Carrito de Compra</h2>
        </div>
        <p className="text-xs text-slate-400 font-medium">Registrando salida de inventario por venta</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <ShoppingCart size={48} strokeWidth={1} className="text-slate-200" />
            <p className="text-sm font-medium">El carrito está vacío</p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <CartItemRow key={item.loteId} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Footer / Summary */}
      <div className="bg-slate-50 p-5 rounded-b-2xl">
        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="text-slate-500 font-medium">Items Totales:</span>
          <span className="font-bold text-slate-800">{totalItems} uds.</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-800 font-bold">Total a cobrar:</span>
          <span className="text-2xl font-black text-emerald-600">
            ${total.toFixed(2)} M.N.
          </span>
        </div>

        <button
          disabled={items.length === 0}
          className="w-full py-3.5 px-4 bg-emerald-500 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <CheckCircle2 size={20} className="mr-2" />
          Confirmar y Descontar Stock
        </button>
      </div>
    </aside>
  );
}
