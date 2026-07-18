'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { registerSchema, RegisterFormValues } from '../lib/validationsAuth';
import { useAuthStore } from '../store/authStore';

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState<RegisterFormValues>({
    nombre: '',
    apellidos: '',
    negocio: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const onChange = (key: keyof RegisterFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${form.nombre} ${form.apellidos}`.trim();
      await register(fullName, form.email, form.password, form.negocio);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGeneralError(err.message || 'Error al crear la cuenta');
      } else {
        setGeneralError('Error al crear la cuenta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[!@#$%^&*]/.test(form.password),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <input
            type="text"
            value={form.nombre}
            onChange={onChange('nombre')}
            placeholder="Ej: Juan"
            required
            disabled={isLoading || isSuccess}
            className={`w-full h-11 px-3 rounded-lg border ${fieldErrors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'
              } bg-white dark:bg-zinc-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50`}
          />
          {fieldErrors.nombre && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.nombre}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Apellidos
          </label>
          <input
            type="text"
            value={form.apellidos}
            onChange={onChange('apellidos')}
            placeholder="Ej: Pérez"
            required
            disabled={isLoading || isSuccess}
            className={`w-full h-11 px-3 rounded-lg border ${fieldErrors.apellidos ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'
              } bg-white dark:bg-zinc-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50`}
          />
          {fieldErrors.apellidos && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.apellidos}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre del negocio
        </label>
        <input
          type="text"
          value={form.negocio}
          onChange={onChange('negocio')}
          placeholder="Ej: Abarrotes Don Pepe"
          required
          disabled={isLoading || isSuccess}
          className={`w-full h-11 px-3 rounded-lg border ${fieldErrors.negocio ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'
            } bg-white dark:bg-zinc-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50`}
        />
        {fieldErrors.negocio && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.negocio}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Correo electrónico
        </label>
        <input
          type="email"
          value={form.email}
          onChange={onChange('email')}
          placeholder="tucorreo@dominio.com"
          required
          disabled={isLoading || isSuccess}
          className={`w-full h-11 px-3 rounded-lg border ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'
            } bg-white dark:bg-zinc-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50`}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Contraseña
          </label>
          <input
            type="password"
            value={form.password}
            onChange={onChange('password')}
            placeholder="Introduce tu contraseña"
            required
            disabled={isLoading || isSuccess}
            className={`w-full h-11 px-3 rounded-lg border ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'
              } bg-white dark:bg-zinc-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50`}
          />
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-1 text-[11px]">
            <span className={`flex items-center gap-1.5 transition-colors duration-200 ${checks.length ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400 dark:text-zinc-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${checks.length ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-zinc-600'}`} />
              8+ carac.
            </span>
            <span className={`flex items-center gap-1.5 transition-colors duration-200 ${checks.uppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400 dark:text-zinc-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${checks.uppercase ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-zinc-600'}`} />
              Mayúscula
            </span>
            <span className={`flex items-center gap-1.5 transition-colors duration-200 ${checks.lowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400 dark:text-zinc-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${checks.lowercase ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-zinc-600'}`} />
              Minúscula
            </span>
            <span className={`flex items-center gap-1.5 transition-colors duration-200 ${checks.number ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400 dark:text-zinc-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${checks.number ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-zinc-600'}`} />
              Número
            </span>
            <span className={`flex items-center gap-1.5 transition-colors duration-200 ${checks.special ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400 dark:text-zinc-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${checks.special ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-zinc-600'}`} />
              Especial
            </span>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar contraseña
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={onChange('confirmPassword')}
            placeholder="Repite tu contraseña"
            required
            disabled={isLoading || isSuccess}
            className={`w-full h-11 px-3 rounded-lg border ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'
              } bg-white dark:bg-zinc-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50`}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {generalError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {generalError}
        </div>
      )}

      {isSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-sm text-emerald-600 flex items-center gap-2">
          <Check className="w-4 h-4" /> Cuenta creada exitosamente. Redirigiendo...
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-hover transition disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-primary/10"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creando cuenta...
            </>
          ) : isSuccess ? (
            '¡Listo!'
          ) : (
            'Crear cuenta'
          )}
        </button>
      </div>
    </form>
  );
}
