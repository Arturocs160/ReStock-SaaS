import {
  DollarSign,
  Layers3,
  AlertTriangle,
  Clock3,
} from "lucide-react";

export function MetricsCards() {
  const inventoryValue = 3645;
  const totalItems = 131;
  const lowStock = 3;
  const expiredProducts = 7;

  const metrics = [
    {
      title: "VALOR DE INVENTARIO",
      value: `$${inventoryValue.toLocaleString()}`,
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
      subtitle: "Distribuidos en 8 productos",
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
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;

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
                className={`text-[10px] md:text-[11px] mt-1 font-medium whitespace-nowrap ${metric.subtitleColor}`}
              >
                {metric.subtitle}
              </p>
            </div>

            <div
              className={`
                flex-shrink-0
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
          </div>
        );
      })}
    </div>
  );
}