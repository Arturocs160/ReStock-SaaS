import {
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export function AlertsPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-600" />
          Análisis Estadístico y Alertas
        </h2>

        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded font-semibold">
          ACTUALIZADO
        </span>
      </div>

      {/* Alerta crítica */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <AlertTriangle
              size={16}
              className="text-orange-500"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              Merma potencial inminente
            </h3>

            <p className="text-xs text-gray-600 mt-1">
              Tienes 31 unidades de productos por caducar
              en los próximos 30 días (principalmente
              Lala 1L y Pan Bimbo). Sugerimos crear una
              promoción de venta rápida.
            </p>

            <button className="text-orange-600 text-xs font-semibold mt-2">
              Ver lotes críticos →
            </button>
          </div>
        </div>
      </div>

      {/* Recomendación */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingUp
              size={16}
              className="text-green-600"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              Sugerencia estadística de abastecimiento
            </h3>

            <p className="text-xs text-gray-600 mt-1">
              Hay 3 productos por debajo del stock mínimo
              recomendado para evitar quiebres de
              inventario. El análisis estadístico estima
              que necesitas comprar mercancía pronto.
            </p>

            <button className="text-green-600 text-xs font-semibold mt-2">
              Ver planeador de compras →
            </button>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase mb-3">
          Distribución de stock por categorías
        </p>

        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Bebidas", stock: "30 uds." },
            { name: "Lácteos", stock: "15 uds." },
            { name: "Panadería", stock: "8 uds." },
            { name: "Limpieza", stock: "33 uds." },
          ].map((item) => (
            <div
              key={item.name}
              className="border border-gray-200 rounded-xl p-4 text-center"
            >
              <p className="text-xs text-gray-500">
                {item.name}
              </p>

              <p className="font-bold text-xl mt-2 text-gray-800">
                {item.stock}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}