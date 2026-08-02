"use client";

import React, { useState } from "react";
import { ShoppingCart, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { CartItemRow } from "./CartItemRow";
import { CheckoutSuccessModal } from "./CheckoutSuccessModal";
import { salesApi } from "../../lib/api";

interface CartPanelProps {
  onSaleCompleted?: () => void;
}

export function CartPanel({ onSaleCompleted }: CartPanelProps) {
  const { items, total } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [completedItems, setCompletedItems] = useState(items);

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const payload = {
        items: items.map((item) => ({
          id_lote: item.loteId,
          cantidad_sold: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
      };

      await salesApi.create(payload);

      setCompletedItems([...items]);
      setIsCheckingOut(false);
      onSaleCompleted?.();
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Error cargando venta:", err);
      setError(
        err?.message || "Ha ocurrido un error inesperado al procesar la venta.",
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <aside className="w-full md:w-[350px] lg:w-[400px] bg-white border border-slate-200 rounded-2xl flex flex-col h-full shadow-sm relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center text-emerald-600 mb-1">
            <ShoppingCart className="mr-2" size={22} />
            <h2 className="font-bold text-lg text-slate-800">
              Carrito de Compra
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Registrando salida de inventario por venta
          </p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <ShoppingCart
                size={48}
                strokeWidth={1}
                className="text-slate-200"
              />
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
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

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
            onClick={handleCheckout}
            disabled={items.length === 0 || isCheckingOut}
            className="w-full py-3.5 px-4 bg-emerald-500 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isCheckingOut ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} className="mr-2" />
                Confirmar y Descontar Stock
              </>
            )}
          </button>
        </div>
      </aside>

      <CheckoutSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalPaid={total}
        totalItems={totalItems}
        items={completedItems}
      />
    </>
  );
}
