"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar ventas por ID, cajero o producto vendido..."
        className="
          w-full
          rounded-2xl
          border
          border-gray-200/80
          bg-gray-50/60
          py-3.5
          pl-11
          pr-10
          text-sm
          text-gray-700
          placeholder:text-gray-400
          placeholder:font-normal
          outline-none
          transition-all
          focus:bg-white
          focus:border-[#07B474]
          focus:ring-2
          focus:ring-[#07B474]/15
          shadow-xs
        "
      />

      
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-200/60 hover:text-gray-600 transition"
          aria-label="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}