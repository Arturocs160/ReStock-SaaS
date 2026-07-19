import { create } from "zustand";

import { filterProducts } from "@/app/lib/normalizeSearchText";
import type { Product } from "@/app/types/product";

export const SAMPLE_PRODUCTS: Product[] = [
  { id: "1", nombre: "Café Molido", codigo: "CAF001", precio: 45.5 },
  { id: "2", nombre: "Leche Entera", codigo: "LEC002", precio: 22 },
  { id: "3", nombre: "Pan Dulce", codigo: "PAN003", precio: 15 },
  { id: "4", nombre: "Agua Mineral", codigo: "AGU004", precio: 12 },
  { id: "5", nombre: "Atún en Lata", codigo: "ATU005", precio: 28 },
];

interface ProductsState {
  products: Product[];
  searchQuery: string;
  setProducts: (products: Product[]) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: SAMPLE_PRODUCTS,
  searchQuery: "",
  setProducts: (products) => set({ products }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "" }),
}));

export const selectFilteredProducts = (state: ProductsState) =>
  filterProducts(state.products, state.searchQuery);
