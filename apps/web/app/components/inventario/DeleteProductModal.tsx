"use client";

import { Trash2 } from "lucide-react";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onConfirm: () => void;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  productName,
  onConfirm,
}: DeleteProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Trash2 className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            ¿Eliminar producto?
          </h3>
          <p className="mt-2.5 text-xs text-gray-500 leading-relaxed">
            Estás a punto de eliminar el producto{" "}
            <span className="font-extrabold text-gray-850">{productName}</span>{" "}
            y todos sus lotes asociados. Esta acción no se puede deshacer.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-xs font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              Confirmar Eliminación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
