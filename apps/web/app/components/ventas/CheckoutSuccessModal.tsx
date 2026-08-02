"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Receipt, ArrowRight, Package, X } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { CartItem } from "../../types/ventas";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPaid: number;
  totalItems: number;
  items: CartItem[];
}

export function CheckoutSuccessModal({
  isOpen,
  onClose,
  totalPaid,
  totalItems,
  items,
}: CheckoutSuccessModalProps) {
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleNewSale = () => {
    clearCart();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Modal Content */}
      <div className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-3 border-b border-slate-100 shrink-0 text-left">
          <div>
            <h2 className="text-[1.35rem] font-bold text-gray-900 leading-tight">
              Venta Registrada
            </h2>
            <p className="text-gray-500 text-[13px] mt-1">
              El inventario y el historial de ventas han sido actualizados con éxito.
            </p>
          </div>
          <button
            onClick={handleNewSale}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 pt-5 flex flex-col flex-1 overflow-hidden min-h-0 text-center items-center">
          
          {/* Success Icon */}
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-inner shrink-0 animate-bounce-short">
            <CheckCircle2 size={28} className="text-emerald-500" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-4 shrink-0">
            ¡Venta completada con éxito!
          </h3>

          {/* Lista de Productos Vendidos */}
          <div className="w-full text-left bg-white border border-slate-200 rounded-xl mb-4 flex flex-col max-h-[160px] shrink-0">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center shrink-0">
              <Package size={14} className="text-slate-400 mr-2" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Productos Vendidos
              </span>
            </div>
            <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
              {items.map((item) => (
                <div
                  key={item.loteId}
                  className="flex justify-between items-center p-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {item.nombre_producto}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Lote: {item.codigo_lote} &times; {item.cantidad}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-700">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="w-full bg-slate-50 rounded-xl p-3.5 mb-5 border border-slate-100 shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 text-sm flex items-center">
                <Receipt size={16} className="mr-1.5" />
                Artículos Totales
              </span>
              <span className="font-semibold text-slate-700">
                {totalItems} uds.
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-600 font-medium">Total cobrado</span>
              <span className="text-xl font-black text-emerald-600">
                ${totalPaid.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleNewSale}
            className="w-full py-3 px-4 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-900 transition-all flex items-center justify-center group shrink-0 cursor-pointer"
          >
            Iniciar nueva venta
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
