import Link from "next/link";
import {
  DollarSign,
  Layers3,
  AlertTriangle,
  Clock3,
} from "lucide-react";
import { ProductoConStock } from "../../types/inventario";

export function MetricsCards({ products }: { products: ProductoConStock[] }) {
  const today = (() => {
    const t = new Date();
    return new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
  })();

  // 1. inventoryValue: Sum of (product.precio_actual * lote.cantidad_actual)
  const inventoryValue = products.reduce((totalVal, p) => {
    const pValue = p.lotes.reduce((sum, l) => sum + (p.precio_actual * l.cantidad_actual), 0);
    return totalVal + pValue;
  }, 0);

  // 2. totalItems: Sum of cantidad_actual of all lotes
  const totalItems = products.reduce((sum, p) => sum + p.stock_actual, 0);

  // 3. lowStock: Count of products where stock_actual < stock_minimo_sugerido
  const lowStock = products.filter(p => p.stock_actual < p.stock_minimo_sugerido).length;

  // 4. expiredProducts: Sum of cantidad_actual of expired lotes
  const expiredProducts = products.reduce((sum, p) => {
    const expiredQty = p.lotes.reduce((loteSum, l) => {
      if (l.fecha_caducidad) {
        const expiry = new Date(l.fecha_caducidad);
        if (expiry < today) {
          return loteSum + l.cantidad_actual;
        }
      }
      return loteSum;
    }, 0);
    return sum + expiredQty;
  }, 0);

  const metrics = [
    {
      title: "VALOR DE INVENTARIO",
      value: `$${inventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: "Valorizado a precio actual de venta",
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-gray-900",
      subtitleColor: "text-gray-400",
    },
    {
      title: "ARTÍCULOS TOTALES",
      value: totalItems,
      subtitle: `Distribuidos en ${products.length} productos`,
      icon: Layers3,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-gray-900",
      subtitleColor: "text-gray-400",
    },
    {
      title: "BAJO STOCK",
      value: lowStock,
      subtitle: "Requieren atención inmediata ↗",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
      subtitleColor: "text-red-500",
      href: "/dashboard/inventario",
    },
    {
      title: "PRODUCTOS CADUCADOS",
      value: expiredProducts,
      subtitle: "Encontrar mermas ↗",
      icon: Clock3,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
      subtitleColor: "text-red-500",
      href: "/dashboard/inventario",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isClickable = !!metric.href;

        const cardContent = (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {metric.title}
              </p>

              <h3
                className={`text-3xl md:text-[38px] font-bold leading-none mt-2 ${metric.valueColor}`}
              >
                {metric.value}
              </h3>

              <p
                className={`text-[10px] md:text-[11px] mt-1 font-medium ${metric.subtitleColor} ${isClickable ? "group-hover:underline" : ""
                  }`}
              >
                {metric.subtitle}
              </p>
            </div>

            <div
              className={`
                shrink-0
                w-12
                h-12
                rounded-2xl
                flex
                items-center
                justify-center
                ml-3
                ${metric.iconBg}
              `}
            >
              <Icon
                size={22}
                className={metric.iconColor}
              />
            </div>
          </>
        );

        if (isClickable && metric.href) {
          return (
            <Link
              key={metric.title}
              href={metric.href}
              className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition cursor-pointer group"
            >
              {cardContent}
            </Link>
          );
        }

        return (
          <div
            key={metric.title}
            className="
              bg-white
              border
              border-gray-200
              rounded-[24px]
              px-5
              py-4
              shadow-sm
              flex
              items-center
              justify-between
              min-h-[112px]
            "
          >
            {cardContent}
          </div>
        );
      })}
    </div>
  );
}