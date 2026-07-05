'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { loginSchema } from '../lib/validationsAuth';
import { useAuthStore } from '../store/authStore';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    const result = loginSchema.safeParse({ email, password });
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
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const error = err as Error;
      setGeneralError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.email) {
        setEmail(d.email);
        setFieldErrors((prev) => ({ ...prev, email: '' }));
      }
      if (d?.password) {
        setPassword(d.password);
        setFieldErrors((prev) => ({ ...prev, password: '' }));
      }
      if (emailRef.current) emailRef.current.focus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('fill-demo', handler as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('fill-demo', handler as EventListener);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => ({ ...prev, email: '' }));
          }}
          ref={emailRef}
          placeholder="tucorreo@dominio.com"
          required
          disabled={isLoading}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.email 
              ? 'border-red-500 focus:ring-red-500 dark:border-red-500/50' 
              : 'border-gray-200 dark:border-zinc-800 focus:ring-primary'
          } bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-100 px-3 py-3 text-sm shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 disabled:opacity-50`}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((prev) => ({ ...prev, password: '' }));
          }}
          placeholder="Tu contraseña"
          required
          disabled={isLoading}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.password 
              ? 'border-red-500 focus:ring-red-500 dark:border-red-500/50' 
              : 'border-gray-200 dark:border-zinc-800 focus:ring-primary'
          } bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-100 px-3 py-3 text-sm shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 disabled:opacity-50`}
        />
        {fieldErrors.password && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between xs:gap-0">
        <label className="inline-flex items-center text-sm text-gray-600 dark:text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary focus:ring-primary dark:focus:ring-offset-zinc-950"
          />
          <span className="ml-2 select-none">Recordarme</span>
        </label>

        <a href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">Olvidé mi contraseña</a>
      </div>

      {generalError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {generalError}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-hover transition disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </div>
    </form>
  );
}

