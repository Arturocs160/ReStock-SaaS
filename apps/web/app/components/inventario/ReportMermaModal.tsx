"use client";

import { AlertTriangle } from "lucide-react";

interface ReportMermaModalProps {
  isOpen: boolean;
  onClose: () => void;
  loteCode: string;
  productName: string;
  cantidad: number;
  onConfirm: () => void;
}

export function ReportMermaModal({
  isOpen,
  onClose,
  loteCode,
  productName,
  cantidad,
  onConfirm,
}: ReportMermaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-655 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertTriangle className="w-5 h-5 animate-pulse text-red-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">¿Dar de baja por Merma?</h3>
          <p className="mt-2.5 text-xs text-gray-500 leading-relaxed">
            Estás a punto de registrar una merma por caducidad para el lote{" "}
            <span className="font-extrabold font-mono text-gray-800">
              {loteCode || "Sin código"}
            </span>{" "}
            del producto{" "}
            <span className="font-extrabold text-gray-800">{productName}</span>.
          </p>
          <p className="mt-2 text-xs text-red-600 font-semibold bg-red-50 py-1.5 px-3 rounded-lg inline-block">
            Se registrarán {cantidad} unidades como pérdida (merma).
          </p>
          <p className="mt-2.5 text-[10px] text-gray-400">
            Esta acción descontará el stock disponible y no se puede deshacer.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-xs font-semibold text-gray-655 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
            >
              Confirmar Merma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
