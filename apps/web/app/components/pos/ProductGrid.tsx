"use client";

import { useMemo } from "react";

import { filterProducts } from "@/app/lib/normalizeSearchText";
import { useProductsStore } from "@/app/stores/useProductsStore";

import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const products = useProductsStore((state) => state.products);
  const searchQuery = useProductsStore((state) => state.searchQuery);
  const filteredProducts = useMemo(
    () => filterProducts(products, searchQuery),
    [products, searchQuery],
  );

  if (searchQuery.trim().length > 0 && filteredProducts.length === 0) {
    return (
      <p role="status" className="py-12 text-center text-sm text-gray-500">
        No se encontraron productos coincidentes.
      </p>
    );
  }

  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
