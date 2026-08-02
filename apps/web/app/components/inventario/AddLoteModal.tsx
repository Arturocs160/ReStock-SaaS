"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createLoteSchema } from "../../lib/validationsInventario";

interface AddLoteModalProps {
  onClose: () => void;
  productName: string;
  onConfirm: (code: string, qty: number, expiry: string) => void;
}

export function AddLoteModal({
  onClose,
  productName,
  onConfirm,
}: AddLoteModalProps) {
  const [code, setCode] = useState(
    () => `L-${Date.now().toString().slice(-6)}`,
  );
  const [qty, setQty] = useState("");
  const [expiry, setExpiry] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const todayStr = getTodayString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const qtyNum = parseInt(qty);

    const result = createLoteSchema.safeParse({
      codigo_lote: code,
      cantidad_inicial: qtyNum,
      fecha_ingreso: todayStr,
      fecha_caducidad: expiry || null,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    onConfirm(code, qtyNum, expiry);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-855 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 animate-scale-up">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Registrar Lote de Producto
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 truncate max-w-80">
              Para: {productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-655 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Código del Lote *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: L-689554"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setFieldErrors((prev) => ({ ...prev, codigo_lote: "" }));
              }}
              className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                fieldErrors.codigo_lote
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-800"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white`}
            />
            {fieldErrors.codigo_lote && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                {fieldErrors.codigo_lote}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Cantidad Ingresada *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="15"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setFieldErrors((prev) => ({ ...prev, cantidad_inicial: "" }));
              }}
              className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                fieldErrors.cantidad_inicial
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-800"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white`}
            />
            {fieldErrors.cantidad_inicial && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                {fieldErrors.cantidad_inicial}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
              <span>Fecha de Caducidad</span>
              <span className="text-[10px] text-gray-400 font-normal italic">
                Opcional
              </span>
            </label>
            <input
              type="date"
              placeholder="YYYY-MM-DD"
              min={todayStr}
              value={expiry}
              onChange={(e) => {
                setExpiry(e.target.value);
                setFieldErrors((prev) => ({ ...prev, fecha_caducidad: "" }));
              }}
              className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                fieldErrors.fecha_caducidad
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-800"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white cursor-pointer`}
            />
            {fieldErrors.fecha_caducidad && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                {fieldErrors.fecha_caducidad}
              </p>
            )}
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white font-semibold rounded-xl text-sm transition cursor-pointer"
            >
              Registrar Lote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
