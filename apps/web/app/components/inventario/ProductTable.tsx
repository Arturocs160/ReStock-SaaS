"use client";

import { Package } from "lucide-react";
import { ProductRow } from "./ProductRow";
import { ProductoConStock, LoteInventario } from "../../types/inventario";

interface ProductTableProps {
  products: ProductoConStock[];
  expandedProducts: Record<string, boolean>;
  onToggleProduct: (id: string) => void;
  onAddLote: (productId: string) => void;
  onEditProduct: (product: ProductoConStock) => void;
  onDeleteProduct: (productId: string) => void;
  onEditLote: (productId: string, lote: LoteInventario) => void;
  onDeleteLote: (productId: string, loteId: string) => void;
}

export function ProductTable({
  products,
  expandedProducts,
  onToggleProduct,
  onAddLote,
  onEditProduct,
  onDeleteProduct,
  onEditLote,
  onDeleteLote,
}: ProductTableProps) {
  return (
    <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm text-gray-500">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold uppercase text-gray-400 border-b border-gray-100 dark:border-gray-900">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock sugerido</th>
              <th className="px-6 py-4">Stock actual</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
            {products.length > 0 ? (
              products.map((p) => (
                <ProductRow
                  key={p.id_producto}
                  producto={p}
                  isExpanded={!!expandedProducts[p.id_producto]}
                  onToggle={() => onToggleProduct(p.id_producto)}
                  onAddLote={() => onAddLote(p.id_producto)}
                  onEditProduct={() => onEditProduct(p)}
                  onDeleteProduct={() => onDeleteProduct(p.id_producto)}
                  onEditLote={(lote) => onEditLote(p.id_producto, lote)}
                  onDeleteLote={(loteId) => onDeleteLote(p.id_producto, loteId)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="font-semibold text-sm">
                    No se encontraron productos registrados
                  </p>
                  <p className="text-xs">
                    Intenta modificando los filtros de búsqueda o agrega un
                    nuevo producto.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
