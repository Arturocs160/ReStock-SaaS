"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  memberName: string;
  memberEmail: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  memberName,
  memberEmail,
}: ConfirmDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when the modal is opened or target collaborator changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen, memberEmail]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await onConfirm();
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      console.error("Error al eliminar colaborador:", err);
      setError(
        err.message ||
          "Ocurrió un error inesperado al intentar eliminar al colaborador.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-150 dark:border-gray-800 rounded-[24px] w-full max-w-md overflow-hidden relative shadow-2xl transition-all scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Cerrar"
          disabled={isLoading}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="p-6">
          {/* Warning Icon Badge */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 animate-pulse">
              <AlertTriangle size={28} strokeWidth={2} />
            </div>
          </div>

          {/* Alert Content */}
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              ¿Eliminar colaborador del equipo?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Esta acción revocará de forma inmediata todos los accesos del
              colaborador a tu negocio.
            </p>
          </div>

          {/* Member Card Summary */}
          <div className="bg-gray-55 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-850/50 rounded-xl p-4 mb-5 text-left space-y-1">
            <span className="block text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider">
              Colaborador a eliminar
            </span>
            <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {memberName || "Usuario Sin Nombre"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {memberEmail}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs text-red-650 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 cursor-pointer text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-750 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98] disabled:opacity-75 cursor-pointer text-sm flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
