"use client";

import { ProductGrid } from "@/app/components/pos/ProductGrid";
import { SearchBar } from "@/app/components/pos/SearchBar";

export default function PosPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Punto de venta
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Busca productos por nombre o codigo para agregarlos a la venta.
          </p>
        </header>

        <SearchBar />
        <ProductGrid />
      </div>
    </main>
  );
}
