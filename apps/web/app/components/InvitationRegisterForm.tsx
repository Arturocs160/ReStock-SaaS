'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, Check } from 'lucide-react';

import {
  invitationRegisterSchema,
  InvitationRegisterValues,
} from '../lib/validationsAuth';

import { invitationApi } from '../lib/invitationApi';

export function InvitationRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const [form, setForm] = useState<InvitationRegisterValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    token,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onChange =
    (key: keyof InvitationRegisterValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

      setFieldErrors((prev) => ({
        ...prev,
        [key]: '',
      }));

      setGeneralError(null);
    };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setFieldErrors({});
    setGeneralError(null);

    const values = {
      ...form,
      token,
    };

    const result = invitationRegisterSchema.safeParse(values);

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
      await invitationApi.register({
        token,
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setIsSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err: any) {
      setGeneralError(err.message ?? 'Error al registrar.');
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

  if (!token) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Invitación inválida o expirada.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <div className="flex flex-col gap-1.5">

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre
        </label>

        <input
          type="text"
          value={form.name}
          onChange={onChange('name')}
          placeholder="Tu nombre"
          disabled={isLoading || isSuccess}
          className={`w-full h-11 px-3 rounded-lg border ${
            fieldErrors.name
              ? 'border-red-500'
              : 'border-gray-200'
          }`}
        />

        {fieldErrors.name && (
          <p className="text-xs text-red-500 flex gap-1 items-center">
            <AlertCircle className="w-3 h-3" />
            {fieldErrors.name}
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
          placeholder="correo@ejemplo.com"
          disabled={isLoading || isSuccess}
          className={`w-full h-11 px-3 rounded-lg border ${
            fieldErrors.email
              ? 'border-red-500'
              : 'border-gray-200'
          }`}
        />

        {fieldErrors.email && (
          <p className="text-xs text-red-500 flex gap-1 items-center">
            <AlertCircle className="w-3 h-3" />
            {fieldErrors.email}
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
            placeholder="********"
            disabled={isLoading || isSuccess}
            className={`w-full h-11 px-3 rounded-lg border ${
              fieldErrors.password
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
          />

          <div className="flex flex-wrap gap-2 text-xs mt-2">

            <span className={checks.length ? "text-green-600" : "text-gray-400"}>
              • 8 caracteres
            </span>

            <span className={checks.uppercase ? "text-green-600" : "text-gray-400"}>
              • Mayúscula
            </span>

            <span className={checks.lowercase ? "text-green-600" : "text-gray-400"}>
              • Minúscula
            </span>

            <span className={checks.number ? "text-green-600" : "text-gray-400"}>
              • Número
            </span>

            <span className={checks.special ? "text-green-600" : "text-gray-400"}>
              • Especial
            </span>

          </div>

        </div>

        <div className="flex flex-col gap-1.5">

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar contraseña
          </label>

          <input
            type="password"
            value={form.confirmPassword}
            onChange={onChange('confirmPassword')}
            placeholder="********"
            disabled={isLoading || isSuccess}
            className={`w-full h-11 px-3 rounded-lg border ${
              fieldErrors.confirmPassword
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
          />

          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-500 flex gap-1 items-center">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.confirmPassword}
            </p>
          )}

        </div>

      </div>

      {generalError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 flex gap-2 items-center">
          <AlertCircle className="w-4 h-4" />
          {generalError}
        </div>
      )}

      {isSuccess && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 flex gap-2 items-center">
          <Check className="w-4 h-4" />
          Cuenta creada correctamente. Redirigiendo...
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || isSuccess}
        className="w-full h-12 rounded-full bg-primary text-white hover:bg-primary-hover transition"
      >

        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Registrando...
          </>
        ) : isSuccess ? (
          '¡Listo!'
        ) : (
          'Aceptar invitación'
        )}

      </button>

    </form>
  );
}