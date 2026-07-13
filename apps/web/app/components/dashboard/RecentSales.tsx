import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function RecentSales() {
  const sales = [
    {
      id: 1,
      time: "04:30 a.m.",
      total: "$102.50 M.N.",
      products: [
        {
          name: "Coca-Cola Original 600ml",
          qty: 2,
        },
        {
          name: "Leche Entera Lala 1L",
          qty: 1,
        },
        {
          name: "Papitas Sabritas Sal 110g",
          qty: 2,
        },
      ],
    },
    {
      id: 2,
      time: "10:45 a.m.",
      total: "$215.00 M.N.",
      products: [
        {
          name: "Huevos San Juan 30 pzas",
          qty: 2,
        },
        {
          name: "Pan Blanco Bimbo Grande",
          qty: 1,
        },
      ],
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={18} className="text-green-600" />
          Últimas Ventas
        </h2>

        <Link
          href="/dashboard/ventas"
          className="text-green-600 text-sm font-semibold hover:text-green-700 hover:underline"
        >
          Vender
        </Link>
      </div>

      {/* Lista de ventas */}
      <div className="space-y-4">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
          >
            {/* Hora y total */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-400">{sale.time}</span>

              <span className="font-bold text-green-600 text-sm">
                {sale.total}
              </span>
            </div>

            {/* Productos */}
            <div className="space-y-1">
              {sale.products.map((product) => (
                <div
                  key={product.name}
                  className="flex justify-between items-center"
                >
                  <span className="text-xs text-gray-700">{product.name}</span>

                  <span className="text-xs text-gray-400 font-medium">
                    x{product.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-4 text-[11px] text-gray-400">
              <span>ID: V{sale.id}</span>
              <span>Atendió: Arturo (Admin)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
