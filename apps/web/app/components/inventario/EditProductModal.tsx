"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ProductoConStock } from "../../dashboard/inventario/page";

interface EditProductModalProps {
    onClose: () => void;
    product: ProductoConStock;
    onConfirm: (
        name: string,
        barcode: string,
        category: string,
        price: number,
        minStock: number
    ) => void;
}

export function EditProductModal({ onClose, product, onConfirm }: EditProductModalProps) {
    const [name, setName] = useState(product.nombre);
    const [barcode, setBarcode] = useState(product.codigo_barras || "");
    const [category, setCategory] = useState(product.categoria);
    const [price, setPrice] = useState(product.precio_actual.toString());
    const [minStock, setMinStock] = useState(product.stock_minimo_sugerido.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(price);
        const minStockNum = parseInt(minStock);

        onConfirm(name, barcode, category, priceNum, minStockNum);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-855 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 animate-scale-up">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-850 pb-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Editar Producto</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-655 transition cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre del Producto *</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Sabritas Limón 110g"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Código de Barras</label>
                        <input
                            type="text"
                            placeholder="Ej: 7501011115637"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Categoría</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white cursor-pointer"
                            >
                                <option value="Bebidas">Bebidas</option>
                                <option value="Lácteos">Lácteos</option>
                                <option value="Panadería">Panadería</option>
                                <option value="Abarrotes">Abarrotes</option>
                                <option value="Limpieza">Limpieza</option>
                                <option value="Enlatados">Enlatados</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Precio de Venta ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="19.50"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Stock Mínimo Sugerido *</label>
                        <input
                            type="number"
                            required
                            placeholder="20"
                            value={minStock}
                            onChange={(e) => setMinStock(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:text-white"
                        />
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
