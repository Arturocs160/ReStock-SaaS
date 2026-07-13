"use client";
import { Mail, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { emailSchema } from "./schemas";

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailStep({
  email,
  setEmail,
  isLoading,
  error,
  setError,
  onSubmit,
}: EmailStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Correo Electrónico
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </span>
          <input
            type="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-gray-900 dark:text-white"
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Ingresa la dirección de correo asociada a tu cuenta para recibir un
          código de verificación.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <a
          href="/login"
          className="flex-1 flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </a>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="flex-[1.5] flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm hover:shadow transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando código...
            </>
          ) : (
            "Enviar código"
          )}
        </button>
      </div>
    </form>
  );
}
