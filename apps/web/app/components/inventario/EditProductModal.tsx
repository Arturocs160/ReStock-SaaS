"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Categoria, ProductoConStock } from "../../types/inventario";
import { productoSchema } from "../../lib/validationsInventario";

interface EditProductModalProps {
  onClose: () => void;
  product: ProductoConStock;
  categories: Categoria[];
  onConfirm: (
    name: string,
    barcode: string,
    id_categoria: string | null,
    price: number,
    minStock: number,
  ) => void;
}

export function EditProductModal({
  onClose,
  product,
  categories,
  onConfirm,
}: EditProductModalProps) {
  const [name, setName] = useState(product.nombre);
  const [barcode, setBarcode] = useState(product.codigo_barras || "");
  const [idCategoria, setIdCategoria] = useState(product.id_categoria || "");
  const [price, setPrice] = useState(product.precio_actual.toString());
  const [minStock, setMinStock] = useState(
    product.stock_minimo_sugerido.toString(),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const priceNum = parseFloat(price);
    const minStockNum = parseInt(minStock);

    const result = productoSchema.safeParse({
      nombre: name,
      codigo_barras: barcode,
      id_categoria: idCategoria === "" ? null : idCategoria,
      precio_actual: priceNum,
      stock_minimo_sugerido: minStockNum,
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

    onConfirm(
      name,
      barcode,
      idCategoria === "" ? null : idCategoria,
      priceNum,
      minStockNum,
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-855 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 animate-scale-up">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-850 pb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Editar Producto
          </h3>
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
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Sabritas Limón 110g"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, nombre: "" }));
              }}
              className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                fieldErrors.nombre
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-800"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white`}
            />
            {fieldErrors.nombre && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                {fieldErrors.nombre}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Código de Barras
            </label>
            <input
              type="text"
              placeholder="Ej: 7501011115637"
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value);
                setFieldErrors((prev) => ({ ...prev, codigo_barras: "" }));
              }}
              className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                fieldErrors.codigo_barras
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-800"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white`}
            />
            {fieldErrors.codigo_barras && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                {fieldErrors.codigo_barras}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex justify-between items-center">
                <span>Categoría</span>
                {categories.length === 0 && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold normal-case">
                    ⚠️ Ninguna registrada
                  </span>
                )}
              </label>
              <select
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                  categories.length === 0
                    ? "border-amber-300 dark:border-amber-900/50"
                    : "border-gray-200 dark:border-gray-800"
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white cursor-pointer`}
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 leading-tight">
                  No tienes categorías. Te recomendamos{" "}
                  <a
                    href="/dashboard/categorias"
                    className="underline hover:text-amber-750 dark:hover:text-amber-300 font-semibold transition"
                  >
                    crear una primero
                  </a>
                  .
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Precio de Venta ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                placeholder="19.50"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, precio_actual: "" }));
                }}
                className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                  fieldErrors.precio_actual
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 dark:border-gray-800"
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white`}
              />
              {fieldErrors.precio_actual && (
                <p className="text-xs font-semibold text-red-500 mt-1">
                  {fieldErrors.precio_actual}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Stock Mínimo Sugerido *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="20"
              value={minStock}
              onChange={(e) => {
                setMinStock(e.target.value);
                setFieldErrors((prev) => ({
                  ...prev,
                  stock_minimo_sugerido: "",
                }));
              }}
              className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border ${
                fieldErrors.stock_minimo_sugerido
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-800"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white`}
            />
            {fieldErrors.stock_minimo_sugerido && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                {fieldErrors.stock_minimo_sugerido}
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
              Actualizar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
