'use client';
import { useState } from "react";
import { Check, AlertCircle, Loader } from "lucide-react";
import { interestSchema } from "../lib/validationsCTA";

export function CTA() {
  const [form, setForm] = useState({ nombre: "", negocio: "", telefono: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(() => {
    if (typeof window === "undefined") return 127;
    return Number(localStorage.getItem("restock_signups") ?? 127);
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const result = interestSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';
      const response = await fetch(`${apiUrl}/cta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al registrar el interés');
      }

      const next = count + 1;
      setCount(next);
      localStorage.setItem("restock_signups", next.toString());
      setSubmitted(true);
      setForm({ nombre: "", negocio: "", telefono: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="px-6 pb-24 pt-8 bg-white">
      <div
        className="mx-auto max-w-5xl rounded-3xl p-10 md:p-16 text-white relative overflow-hidden bg-[#00a365] shadow-[0_10px_40px_rgba(0,163,101,0.15)]"
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        
        <div className="relative grid md:grid-cols-2 gap-12 items-center z-10">
          <div>
            <h2 className="text-3xl md:text-[44px] font-extrabold leading-[1.1] tracking-tight">
              Empieza a cuidar tu inventario hoy.
            </h2>
            <p className="mt-5 text-base md:text-lg text-white/90 leading-relaxed">
              Déjanos tus datos y te contactaremos para darte acceso anticipado a ReStock.
            </p>
            <p className="mt-8 text-sm text-white/80 font-medium">
              <span className="font-bold underline decoration-white/40">No pierdas esta oportunidad</span> registrate ahora 
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-[#fcfdfd] text-gray-900 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl border border-white/20"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="cta-nombre" className="text-sm font-bold text-gray-800">
                Nombre
              </label>
              <input
                id="cta-nombre"
                required
                type="text"
                value={form.nombre}
                onChange={onChange("nombre")}
                placeholder="Tu nombre"
                className={`w-full h-11 px-4 rounded-xl border ${fieldErrors.nombre ? 'border-red-500' : 'border-gray-200/90'} bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a365] focus:ring-1 focus:ring-[#00a365] transition shadow-sm`}
              />
              {fieldErrors.nombre && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.nombre}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="cta-negocio" className="text-sm font-bold text-gray-800">
                Negocio
              </label>
              <input
                id="cta-negocio"
                required
                type="text"
                value={form.negocio}
                onChange={onChange("negocio")}
                placeholder="Abarrotes Don Pepe"
                className={`w-full h-11 px-4 rounded-xl border ${fieldErrors.negocio ? 'border-red-500' : 'border-gray-200/90'} bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a365] focus:ring-1 focus:ring-[#00a365] transition shadow-sm`}
              />
              {fieldErrors.negocio && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.negocio}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="cta-telefono" className="text-sm font-bold text-gray-800">
                Número de teléfono
              </label>
              <input
                id="cta-telefono"
                type="tel"
                required
                value={form.telefono}
                onChange={onChange("telefono")}
                placeholder="+52 5551234567"
                className={`w-full h-11 px-4 rounded-xl border ${fieldErrors.telefono ? 'border-red-500' : 'border-gray-200/90'} bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a365] focus:ring-1 focus:ring-[#00a365] transition shadow-sm`}
              />
              {fieldErrors.telefono && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.telefono}
                </p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 rounded-xl bg-[#00a365] hover:bg-[#008c54] disabled:bg-gray-400 text-white font-bold text-sm tracking-wide transition shadow-md shadow-[#00a365]/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Registrando...
                </>
              ) : (
                'Reservar mi lugar'
              )}
            </button>
            
            {submitted && (
              <p className="text-sm text-emerald-600 font-semibold flex items-center gap-2 mt-2 justify-center bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                <Check className="w-4 h-4 stroke-3" /> ¡Gracias! Te contactaremos pronto.
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600 font-semibold flex items-center gap-2 mt-2 justify-center bg-red-50 py-2 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}