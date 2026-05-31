'use client';
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#e2f6e9] min-h-[85vh] flex items-center">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center w-full">
        
        <div className="flex flex-col justify-center">
          <div className="w-fit">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#00a365]" />
              Inventario inteligente para tu negocio
            </span>
          </div>
          
          <h1 className="mt-6 text-4xl md:text-[56px] font-extrabold leading-[1.1] text-gray-950 tracking-tight">
            Deja de perder dinero por <span className="text-[#00a365]">productos caducados</span>.
          </h1>
          
          <p className="mt-6 text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
            ReStock predice cuánto comprar, te avisa antes de que algo caduque y mantiene tu tienda
            siempre abastecida — sin hojas de cálculo, sin adivinar.
          </p>
          
          <div className="mt-8 flex flex-row items-center gap-4">
            <a 
              href="#cta" 
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#00a365] hover:bg-[#008c54] text-white font-medium text-sm transition shadow-sm"
            >
              Quiero acceso <ArrowRight className="w-4 h-4" />
            </a>
            
            <a 
              href="#solucion" 
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-medium text-sm transition border border-gray-200 shadow-sm"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>

        <div className="relative flex justify-center items-center lg:p-6">
          <div className="relative w-full max-w-135">
            <img
              src="/hero-image.jpg"
              alt="Dueña de tienda gestionando inventario con ReStock"
              width={1280}
              height={960}
              className="rounded-3xl shadow-xl w-full object-cover"
            />
            
            <div className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-3.5 flex items-center gap-3 max-w-60 animate-fade-in">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-[#eafaf1] text-[#00a365] shrink-0">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">+38% ventas</p>
                <p className="text-gray-500 text-xs leading-tight mt-0.5">Coca-Cola 600ml esta semana</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-3.5 flex items-center gap-3 max-w-60 animate-fade-in">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-[#fff4ec] text-[#f97316] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">3 lotes caducan</p>
                <p className="text-gray-500 text-xs leading-tight mt-0.5">en los próximos 5 días</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}