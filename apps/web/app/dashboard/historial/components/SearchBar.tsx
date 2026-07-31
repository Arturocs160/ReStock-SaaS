"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full md:max-w-sm">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar ventas por ID, cajero o producto vendido..."
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          py-2.5
          pl-10
          pr-4
          text-sm
          outline-none
          transition
          focus:border-[#07B474]
          focus:ring-2
          focus:ring-[#07B474]/20
        "
      />
    </div>
  );
}