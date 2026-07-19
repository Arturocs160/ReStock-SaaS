'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '../lib/validationsAuth';
import { useAuthStore } from '../store/authStore';

interface LoginFormProps {
  emailLabel?: string;
  passwordLabel?: string;
  submitText?: string;
  forgotPasswordText?: string;
}

export function LoginForm({
  emailLabel = "Correo",
  passwordLabel = "Contraseña",
  submitText = "Iniciar sesión",
  forgotPasswordText = "Olvidé mi contraseña",
}: LoginFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { login } = useAuthStore();
  const isCollaboratorPath = pathname?.includes('/collaborator');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFieldErrors({});
    setGeneralError(null);

    // Validación del formulario controlada con Zod antes del envío (DoD)
    const result = loginSchema.safeParse({
      email,
      password,
    });

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
      // Redirección exitosa al dashboard general (Criterio de Aceptación)
      router.push('/dashboard');
    } catch (err: any) {
      // 🔒 Mensaje genérico por motivos de seguridad: no revela si falló correo o contraseña
      setGeneralError('El correo electrónico o la contraseña son incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;

      if (detail?.email) {
        setEmail(detail.email);
        setFieldErrors((prev) => ({
          ...prev,
          email: '',
        }));
      }

      if (detail?.password) {
        setPassword(detail.password);
        setFieldErrors((prev) => ({
          ...prev,
          password: '',
        }));
      }

      emailRef.current?.focus();
    };

    window.addEventListener('fill-demo', handler as EventListener);

    return () => {
      window.removeEventListener('fill-demo', handler as EventListener);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {emailLabel}
        </label>

        <input
          ref={emailRef}
          type="email"
          value={email}
          placeholder="admin@negocio.com"
          disabled={isLoading}
          required
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => ({
              ...prev,
              email: '',
            }));
          }}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.email
              ? 'border-red-500 focus:ring-red-500 dark:border-red-500/50'
              : 'border-gray-200 dark:border-zinc-800 focus:ring-primary'
          } bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-100 px-3 py-3 text-sm shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 disabled:opacity-50`}
        />

        {fieldErrors.email && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Contraseña</label>
        <div className="relative mt-1">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: '' }));
            }}
            placeholder="Tu contraseña"
            required
            disabled={isLoading}
            className={`block w-full rounded-lg border ${
              fieldErrors.password 
                ? 'border-red-500 focus:ring-red-500 dark:border-red-500/50' 
                : 'border-gray-200 dark:border-zinc-800 focus:ring-primary'
            } bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-100 pl-3 pr-10 py-3 text-sm shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 disabled:opacity-50`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between xs:gap-0">
        <label className="inline-flex cursor-pointer items-center text-sm text-gray-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={remember}
            disabled={isLoading}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-white text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-offset-zinc-950"
          />
          <span className="ml-2 select-none">Recordarme</span>
        </label>

        <a
          href="#"
          className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {forgotPasswordText}
        </a>
      </div>

      {/* Renderizado de errores visuales devueltos por la API (DoD) */}
      {generalError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4" />
          {generalError}
        </div>
      )}

      {/* Indicador de carga dinámico durante el fetch (Criterio de Aceptación) */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-75"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          submitText
        )}
      </button>

      {!isCollaboratorPath && (
        <div className="text-sm text-gray-600 dark:text-zinc-400 mt-2">
          ¿Eres colaborador?{' '}
          <a
            href="/collaborator/login"
            className="text-primary font-semibold hover:underline"
          >
            Inicia sesión aquí
          </a>
        </div>
      )}
    </form>
  );
}