"use client";
import { Package, Clock, TrendingUp, ShieldCheck } from "lucide-react";

export function RegisterBenefitPanel() {
  const benefits = [
    {
      icon: Package,
      title: "Control por lotes",
      description:
        "Gestiona inventario con fechas de vencimiento y seguimiento preciso por lote de producto.",
    },
    {
      icon: Clock,
      title: "Alertas preventivas",
      description:
        "Recibe notificaciones automáticas antes de que tus productos caduquen o se queden sin stock.",
    },
    {
      icon: TrendingUp,
      title: "Ventas y Métricas",
      description:
        "Registra transacciones rápidamente desde el punto de venta integrado y analiza el rendimiento.",
    },
    {
      icon: ShieldCheck,
      title: "Acceso instantáneo",
      description:
        "Configura tu negocio en segundos y empieza a optimizar tu stock.",
    },
  ];

  return (
    <div className="bg-linear-to-b from-white/80 to-gray-50 dark:from-black/60 dark:to-black/40 border border-gray-100 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-zinc-850">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Todo lo que necesitas
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Lleva el control total de tu tienda o negocio.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="flex gap-4 items-start">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/20 text-[#00a365] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
