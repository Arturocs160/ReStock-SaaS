"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Sale } from "./types";
import { SaleDetails } from "./SaleDetails";

interface SaleRowProps {
  sale: Sale;
}

export function SaleRow({ sale }: SaleRowProps) {
  const [expanded, setExpanded] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 font-semibold text-gray-900">
          {sale.folio}
        </td>

        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
          {sale.fecha}
        </td>

        <td className="px-6 py-4 text-gray-700">
          {sale.cajero}
        </td>

        <td className="px-6 py-4 text-center text-gray-700">
          {sale.articulos}
        </td>

        <td className="px-6 py-4 text-right font-semibold text-[#07B474]">
          {formatCurrency(sale.total)}
        </td>

        <td className="px-6 py-4 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              font-medium
              text-[#07B474]
              hover:bg-[#DFF9E6]
              transition-colors
              cursor-pointer
            "
          >
            {expanded ? (
              <>
                Ocultar
                <ChevronUp size={18} />
              </>
            ) : (
              <>
                Ver artículos
                <ChevronDown size={18} />
              </>
            )}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <SaleDetails details={sale.detalles} />
          </td>
        </tr>
      )}
    </>
  );
}