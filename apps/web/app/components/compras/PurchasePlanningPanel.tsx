"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Search,
  X,
  ShoppingCart,
  Plus,
  Check,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Minus,
} from "lucide-react";
import { ProductoConStock } from "../../types/inventario";

import { productsApi } from "../../lib/api";

export function PurchasePlanningPanel() {
  const [catalog, setCatalog] = useState<ProductoConStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [shoppingList, setShoppingList] = useState<
    { product: ProductoConStock; quantity: number }[]
  >([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper para mostrar notificaciones
  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMessage({ text: message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    productsApi
      .getPosCatalog()
      .then((data) => {
        const mapped = (data || []).map((p) => ({
          ...p,
          stock_actual: p.stock_actual !== undefined ? p.stock_actual : (p.lotes || []).reduce(
            (sum, l) => sum + (l.cantidad_actual || 0),
            0
          ),
        }));
        setCatalog(mapped);
      })
      .catch((err) => {
        console.error("Error cargando catálogo", err);
        showToast("Error cargando catálogo", "error");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();
    return catalog.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        (p.categoria && p.categoria.toLowerCase().includes(term)) ||
        (p.codigo_barras && p.codigo_barras.toLowerCase().includes(term)),
    );
  }, [searchTerm, catalog]);

  const lowStockProducts = useMemo(() => {
    return catalog.filter((p) => p.stock_actual < p.stock_minimo_sugerido);
  }, [catalog]);

  const handleAdd = (product: ProductoConStock, quantity = 5) => {
    if (
      !shoppingList.find(
        (item) => item.product.id_producto === product.id_producto,
      )
    ) {
      setShoppingList([...shoppingList, { product, quantity }]);
      showToast(`${product.nombre} añadido a la lista`);
    }
  };

  const handleUpdateQuantity = (id_producto: string, delta: number) => {
    setShoppingList((prev) =>
      prev.map((item) => {
        if (item.product.id_producto === id_producto) {
          const newQuantity = item.quantity + delta;
          if (newQuantity >= 1) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }),
    );
  };

  const handleRemoveProduct = (id_producto: string) => {
    setShoppingList((prev) =>
      prev.filter((item) => item.product.id_producto !== id_producto),
    );
    showToast("Producto removido de la lista de compras");
  };

  const handleClearList = () => {
    if (shoppingList.length > 0) {
      setShoppingList([]);
      showToast("Lista de compras vaciada");
    }
  };

  const handleExecutePurchase = async () => {
    if (shoppingList.length === 0) {
      showToast("La lista de compras está vacía.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = shoppingList.map((item) => ({
        id_producto: item.product.id_producto,
        cantidad: item.quantity,
      }));

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
      const response = await fetch(`${API_URL}/compras/orden`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Intentar leer el mensaje de error del backend
        let errorMessage = "Error en el servidor";
        try {
          const errorData = await response.json();
          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage = errorData.details
              .map((d: any) => d.message)
              .join(". ");
          } else {
            errorMessage = errorData.error || errorData.message || errorMessage;
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }

      // Éxito: Descargar el PDF generado
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Obtener el nombre del archivo de los headers si es posible, o usar un default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "lista-reabastecimiento.pdf";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Vaciar carrito y notificar
      setShoppingList([]);
      showToast("Orden registrada y PDF descargado correctamente.", "success");
    } catch (error: any) {
      console.error(error);
      showToast(
        error.message ||
          "Error al registrar la orden. Por favor intente más tarde.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const diferentesProductos = shoppingList.length;
  const totalUnidades = shoppingList.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const presupuestoTotal = shoppingList.reduce(
    (acc, item) => acc + item.product.precio_actual * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-white ${toastMessage.type === "error" ? "bg-red-600" : "bg-gray-900"}`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-white" />
            )}
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Main Content: Search & Results */}
      <div className="flex-1 space-y-8">
        {/* Sección de Sugerencias Automáticas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Sugerencias de reabastecimiento
            </h2>
            {isLoading ? (
              <span className="text-sm text-gray-500">Cargando...</span>
            ) : (
              lowStockProducts.length > 0 && (
                <span className="flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lowStockProducts.length} críticos
                </span>
              )
            )}
          </div>

          <div className="p-0 sm:p-5">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4">
                  <CheckCircle className="h-7 w-7 text-green-500" />
                </div>
                <p className="text-gray-600 font-medium text-lg">
                  ¡No se requiere reabastecimiento!
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Todos tus productos cumplen con la meta de stock mínimo
                  sugerido.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Producto</th>
                      <th className="px-4 py-3 font-medium hidden md:table-cell">
                        Categoría
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Stock
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Mínimo
                      </th>
                      <th className="px-4 py-3 font-medium text-center text-red-600">
                        Déficit
                      </th>
                      <th className="px-4 py-3 font-medium text-center text-green-600">
                        Sugerido
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lowStockProducts.map((product) => {
                      const deficit =
                        product.stock_minimo_sugerido - product.stock_actual;
                      const suggestedQuantity = Math.ceil(deficit / 5) * 5;
                      const cartItem = shoppingList.find(
                        (item) =>
                          item.product.id_producto === product.id_producto,
                      );
                      const isInList = !!cartItem;

                      return (
                        <tr
                          key={product.id_producto}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {product.nombre}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                              {product.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-gray-700">
                            {product.stock_actual}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-500">
                            {product.stock_minimo_sugerido}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-red-600">
                            -{deficit}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-green-600 bg-green-50/30">
                            +{suggestedQuantity} uds.
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() =>
                                handleAdd(product, suggestedQuantity)
                              }
                              disabled={isInList}
                              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${
                                  isInList
                                    ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-default"
                                    : "bg-[#00a365] text-white hover:bg-[#008c54] hover:shadow-md active:scale-[0.97]"
                                }`}
                            >
                              {isInList ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  En lista ({cartItem?.quantity} en lista)
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  Añadir a lista
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-10 pr-10 py-3.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#00a365] focus:border-[#00a365] sm:text-sm transition-all shadow-sm"
            placeholder="Buscar manualmente por nombre, categoría o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none"
              title="Limpiar búsqueda"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results Section */}
        {searchResults !== null && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-200">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-800">
                Resultados de búsqueda manual
              </h2>
            </div>

            <div className="p-5 bg-white">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {searchResults.map((product) => {
                    const cartItem = shoppingList.find(
                      (item) =>
                        item.product.id_producto === product.id_producto,
                    );
                    const isInList = !!cartItem;

                    return (
                      <div
                        key={product.id_producto}
                        className="flex flex-col p-4 rounded-xl border border-gray-100 hover:border-[#00a365]/30 hover:shadow-md transition-all bg-white relative group"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <span className="text-xs font-medium px-2.5 py-1 bg-[#00a365]/10 text-[#00a365] rounded-md">
                            {product.categoria}
                          </span>
                        </div>
                        <h3
                          className="font-semibold text-gray-800 mt-1 line-clamp-2"
                          title={product.nombre}
                        >
                          {product.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 mb-5 mt-1">
                          Stock actual:{" "}
                          <span className="font-medium text-gray-700">
                            {product.stock_actual} unid.
                          </span>
                        </p>

                        <div className="mt-auto">
                          <button
                            onClick={() => handleAdd(product, 5)}
                            disabled={isInList}
                            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                              ${
                                isInList
                                  ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-default"
                                  : "bg-[#00a365] text-white hover:bg-[#008c54] hover:shadow-md active:scale-[0.98]"
                              }`}
                          >
                            {isInList ? (
                              <>
                                <Check className="w-4 h-4" />
                                En lista ({cartItem?.quantity} en lista)
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Añadir (+5)
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No se encontraron productos para tu búsqueda.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Side Panel: Shopping List Summary */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6 overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
        >
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#00a365]/5">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#00a365]" />
              <h2 className="text-lg font-semibold text-gray-800">
                Lista de compras
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {diferentesProductos > 0 && (
                <>
                  <span className="bg-[#eafaf1] text-[#00a365] text-xs font-bold px-2.5 py-1 rounded-full">
                    {diferentesProductos} prod.
                  </span>
                  <button
                    onClick={handleClearList}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Vaciar lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/20">
            {shoppingList.length === 0 ? (
              <div className="py-12 text-center px-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3 border border-gray-100">
                  <ShoppingCart className="h-5 w-5 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm">
                  Empieza a añadir productos para tu planificación.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {shoppingList.map((item) => (
                  <div
                    key={item.product.id_producto}
                    className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-3 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="pr-3 flex-1">
                        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                          {item.product.nombre}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ${item.product.precio_actual.toFixed(2)} / ud.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveProduct(item.product.id_producto)
                        }
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.id_producto, -1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-l-md transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.id_producto, 1)
                          }
                          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-r-md transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        $
                        {(item.quantity * item.product.precio_actual).toFixed(
                          2,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-5 bg-white shrink-0">
            {shoppingList.length > 0 ? (
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Unidades totales</span>
                  <span className="font-medium text-gray-800">
                    {totalUnidades} uds.
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Productos diferentes</span>
                  <span className="font-medium text-gray-800">
                    {diferentesProductos}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-gray-600 font-semibold">
                    Presupuesto total
                  </span>
                  <span className="text-2xl font-black text-[#00a365]">
                    ${presupuestoTotal.toFixed(2)}{" "}
                    <span className="text-sm font-medium text-gray-500">
                      M.N.
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-end mb-5">
                <span className="text-gray-600 font-semibold">
                  Presupuesto total
                </span>
                <span className="text-2xl font-black text-gray-400">
                  $0.00 <span className="text-sm font-medium">M.N.</span>
                </span>
              </div>
            )}

            <button
              onClick={handleExecutePurchase}
              disabled={shoppingList.length === 0 || isSubmitting}
              className="w-full bg-[#00a365] text-white rounded-xl py-3 font-medium hover:bg-[#008c54] disabled:opacity-50 disabled:hover:bg-[#00a365] transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Registrando...
                </>
              ) : (
                "Confirmar y registrar orden"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
