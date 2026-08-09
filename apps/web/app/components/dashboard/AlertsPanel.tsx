import Link from "next/link";
import { AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { ProductoConStock } from "../../types/inventario";

export function AlertsPanel({ products }: { products: ProductoConStock[] }) {
  const today = (() => {
    const t = new Date();
    return new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
  })();

  // 1. Calculate soon-to-expire metrics
  let warningQty = 0;
  const soonExpiringProducts: string[] = [];
  products.forEach((p) => {
    let productExpiringQty = 0;
    p.lotes.forEach((l) => {
      if (l.fecha_caducidad) {
        const expiry = new Date(l.fecha_caducidad);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 30) {
          warningQty += l.cantidad_actual;
          productExpiringQty += l.cantidad_actual;
        }
      }
    });
    if (productExpiringQty > 0) {
      soonExpiringProducts.push(p.nombre);
    }
  });

  // 2. Calculate low stock metrics
  const lowStockProds = products.filter(
    (p) => p.stock_actual < p.stock_minimo_sugerido,
  );

  // 3. Category distribution
  const categoryStock: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.categoria || "General";
    categoryStock[cat] = (categoryStock[cat] || 0) + p.stock_actual;
  });

  const categoryItems = Object.entries(categoryStock).map(([name, stock]) => ({
    name,
    stock: `${stock} uds.`,
  }));

  // Render top 4 categories
  const displayedCategories =
    categoryItems.length > 0
      ? categoryItems.slice(0, 4)
      : [{ name: "General", stock: "0 uds." }];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#07B474]" />
            Análisis de Inventario y Alertas
          </h2>

          <span className="bg-emerald-50 text-[#00a365] text-[10px] px-2 py-1 rounded-lg font-bold border border-emerald-250">
            ACTUALIZADO
          </span>
        </div>

        {/* Alerta crítica de merma */}
        {warningQty > 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-3 animate-fade-in">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-orange-500" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Merma potencial inminente
                </h3>

                <p className="text-xs text-gray-600 mt-1">
                  Tienes {warningQty} unidades de productos por caducar en los
                  próximos 30 días (
                  {soonExpiringProducts.slice(0, 2).join(", ")}
                  {soonExpiringProducts.length > 2
                    ? ` y ${soonExpiringProducts.length - 2} más`
                    : ""}
                  ). Sugerimos crear una promoción de venta rápida.
                </p>

                <Link
                  href="/dashboard/inventario"
                  className="text-orange-600 text-xs font-semibold mt-2 inline-block hover:underline"
                >
                  Ver lotes críticos →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-3 flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-[#00a365]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Sin alertas de vencimiento
              </h3>
              <p className="text-xs text-gray-600">
                No tienes productos programados para caducar en los siguientes
                30 días. ¡Excelente gestión de inventario!
              </p>
            </div>
          </div>
        )}

        {/* Recomendación de abastecimiento */}
        {lowStockProds.length > 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-red-500" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Sugerencia de abastecimiento
                </h3>

                <p className="text-xs text-gray-600 mt-1">
                  Hay {lowStockProds.length} productos por debajo del stock
                  mínimo recomendado para evitar quiebres de inventario (
                  {lowStockProds
                    .slice(0, 2)
                    .map((p) => p.nombre)
                    .join(" y ")}
                  ). Te sugerimos realizar un pedido de reposición pronto.
                </p>

                <div className="flex flex-wrap gap-4 mt-2">
                  <Link
                    href="/dashboard/alertas"
                    className="text-red-600 text-xs font-semibold inline-block hover:underline"
                  >
                    Ver alertas de stock bajo →
                  </Link>
                  <Link
                    href="/dashboard/inventario"
                    className="text-red-600 text-xs font-semibold inline-block hover:underline"
                  >
                    Ir al inventario →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4 flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-[#00a365]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Stock balanceado
              </h3>
              <p className="text-xs text-gray-600">
                Todos tus productos están por encima del stock mínimo
                establecido. No requieres compras de urgencia.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Categorías */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase mb-3">
          Distribución de stock por categorías
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {displayedCategories.map((item) => (
            <div
              key={item.name}
              className="border border-gray-200 rounded-2xl p-3 text-center bg-gray-50/50"
            >
              <p className="text-[10px] text-gray-450 truncate font-semibold">
                {item.name}
              </p>

              <p className="font-bold text-lg mt-1 text-gray-850">
                {item.stock}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
