import { SaleDetail } from "./types";

interface SaleDetailsProps {
  details: SaleDetail[];
}

export function SaleDetails({ details }: SaleDetailsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="bg-slate-50 border-t border-gray-200 px-6 py-5">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Producto
              </th>

              <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cantidad
              </th>

              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Precio Unitario
              </th>

              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody>
            {details.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="py-3 font-medium text-gray-700">
                  {item.producto}
                </td>

                <td className="py-3 text-center text-gray-600">
                  {item.cantidad}
                </td>

                <td className="py-3 text-right text-gray-600">
                  {formatCurrency(item.precioUnitario)}
                </td>

                <td className="py-3 text-right font-semibold text-[#07B474]">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}