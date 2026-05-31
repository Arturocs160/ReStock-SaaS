'use client';
import {
  AlertTriangle,
  Package,
  BarChart3,
  CalendarClock,
  Bell,
  TrendingUp,
  ShieldCheck,
  Check,
} from "lucide-react";

export function Features() {

  const features = [
    { icon: CalendarClock, title: "Control por lotes y caducidad", text: "Registra cada lote con su fecha. ReStock te avisa antes de que se vuelvan pérdida." },
    { icon: Bell, title: "Alertas preventivas", text: "Notificaciones cuando un producto está por agotarse o por caducar." },
    { icon: TrendingUp, title: "Análisis de patrones", text: "Detecta picos de venta y te sugiere cuándo y cuánto comprar." },
    { icon: ShieldCheck, title: "Recomendaciones automáticas", text: "Listas de compra generadas con datos reales, no con intuición." },
  ]

  const benefits = [
    "Reduce hasta 80% las pérdidas por caducidad",
    "Aumenta tus ventas evitando faltantes de productos clave",
    "Ahorra horas semanales en conteo y planeación manual",
    "Toma decisiones de compra basadas en datos reales",
  ]

  const stats = [
    { n: "80%", l: "menos mermas" },
    { n: "5h", l: "ahorradas/semana" },
    { n: "+22%", l: "en ventas" },
    { n: "24/7", l: "monitoreo activo" },
  ]

  return (
    <>
      <section id="problema" className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-[#00a365] uppercase tracking-widest">El problema</p>
            <h2 className="mt-3 text-3xl md:text-[42px] font-extrabold text-gray-950 leading-[1.15] tracking-tight">
              Adivinar cuánto comprar te está costando dinero.
            </h2>
            <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">
              Las tiendas de abarrotes, farmacias y mini-súpers pierden hasta el 15% de su inventario
              por mala gestión. Revisar a ojo y a mano ya no alcanza.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { icon: AlertTriangle, title: "Productos caducados", text: "Lotes que vencen sin que nadie se entere hasta que ya no se pueden vender.", bgIcon: "bg-[#fff4ec]", textIcon: "text-[#f97316]" },
              { icon: Package, title: "Faltantes constantes", text: "Compras insuficientes que dejan estantes vacíos y clientes insatisfechos.", bgIcon: "bg-[#f0fdf4]", textIcon: "text-[#00a365]" },
              { icon: BarChart3, title: "Sin datos de venta", text: "Decisiones de compra basadas en intuición, no en patrones reales.", bgIcon: "bg-[#eff6ff]", textIcon: "text-[#3b82f6]" },
            ].map((p) => (
              <div key={p.title} className="p-8 rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <span className={`grid place-items-center w-12 h-12 rounded-xl ${p.bgIcon} ${p.textIcon}`}>
                  <p.icon className="w-5 h-5" />
                </span>
                <h3 className="mt-5 font-bold text-lg text-gray-900">{p.title}</h3>
                <p className="mt-2 text-gray-500 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solucion" className="py-24 px-6 bg-[#f4fbf7]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold text-[#00a365] uppercase tracking-widest">La solución</p>
            <h2 className="mt-3 text-3xl md:text-[42px] font-extrabold text-gray-950 leading-[1.15] tracking-tight">
              Un sistema que piensa por tu inventario.
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed">
              ReStock combina control por lotes, alertas inteligentes y análisis de ventas en una
              plataforma simple — pensada para negocios pequeños.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-7 rounded-2xl bg-white border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_25px_rgba(0,163,101,0.06)] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#00a365] text-white shrink-0 shadow-sm shadow-[#00a365]/20">
                    <f.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{f.title}</h3>
                    <p className="mt-1.5 text-gray-500 text-sm leading-relaxed">{f.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold text-[#00a365] uppercase tracking-widest">Beneficios</p>
            <h2 className="mt-3 text-3xl md:text-[42px] font-extrabold text-gray-950 leading-[1.15] tracking-tight">
              Resultados que se notan desde la primera semana.
            </h2>
            <ul className="mt-8 space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm md:text-base text-gray-700 font-medium">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-[#e6f6ee] text-[#00a365] mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-3" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.l}
                className="p-8 rounded-2xl bg-white border border-gray-100/90 text-center shadow-[0_4px_25px_rgba(0,0,0,0.02)]"
              >
                <p className="text-4xl md:text-5xl font-black text-[#00a365] tracking-tight">{s.n}</p>
                <p className="mt-2 text-xs md:text-sm font-medium text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}