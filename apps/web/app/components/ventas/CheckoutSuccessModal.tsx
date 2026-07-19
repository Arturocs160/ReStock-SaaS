'use client';

import React from 'react';
import { CheckCircle2, Receipt, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { CartItem } from '../../types/ventas';

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPaid: number;
  totalItems: number;
  items: CartItem[];
}

export function CheckoutSuccessModal({ isOpen, onClose, totalPaid, totalItems, items }: CheckoutSuccessModalProps) {
  const { clearCart } = useCartStore();

  if (!isOpen) return null;

  const handleNewSale = () => {
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-inner shrink-0">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-1 shrink-0">¡Venta Registrada!</h2>
        <p className="text-slate-500 mb-4 text-sm shrink-0">
          El inventario ha sido actualizado correctamente.
        </p>

        {/* Lista de Productos Vendidos */}
        <div className="text-left bg-white border border-slate-200 rounded-xl mb-4 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center shrink-0">
            <Package size={16} className="text-slate-400 mr-2" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Productos Vendidos</span>
          </div>
          <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
            {items.map((item) => (
              <div key={item.loteId} className="flex justify-between items-center p-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.nombre_producto}</p>
                  <p className="text-[11px] text-slate-400">Lote: {item.codigo_lote} &times; {item.cantidad}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-700">${item.subtotal.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-sm flex items-center">
              <Receipt size={16} className="mr-1.5" />
              Artículos Totales
            </span>
            <span className="font-semibold text-slate-700">{totalItems} uds.</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-slate-600 font-medium">Total cobrado</span>
            <span className="text-xl font-black text-emerald-600">${totalPaid.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleNewSale}
          className="w-full py-3.5 px-4 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-900 transition-all flex items-center justify-center group shrink-0"
        >
          Iniciar nueva venta
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
