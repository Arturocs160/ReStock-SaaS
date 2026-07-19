"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useProductsStore } from "@/app/stores/useProductsStore";

const DEBOUNCE_MS = 300;

export function SearchBar() {
  const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
  const clearSearch = useProductsStore((state) => state.clearSearch);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(inputValue);
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [inputValue, setSearchQuery]);

  const handleClear = () => {
    setInputValue("");
    clearSearch();
  };

  return (
    <div className="relative w-full">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Buscar por nombre o código..."
        aria-label="Buscar productos"
        className="h-11 w-full rounded-xl border border-gray-200/90 bg-white py-2 pl-11 pr-11 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-[#00a365] focus:outline-none focus:ring-1 focus:ring-[#00a365]"
      />
      {inputValue.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar busqueda"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
