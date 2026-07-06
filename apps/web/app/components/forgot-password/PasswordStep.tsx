'use client';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { passwordResetSchema } from './schemas';

interface PasswordStepProps {
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onSubmit: (password: string) => void;
}

export function PasswordStep({
  isLoading,
  error,
  setError,
  onSubmit,
}: PasswordStepProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado de validación de los requisitos de contraseña
  const passwordValidations = {
    length: password.length >= 8 && password.length <= 50,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    match: password !== '' && password === confirmPassword,
  };

  const isPasswordValid = 
    passwordValidations.length && 
    passwordValidations.hasUppercase && 
    passwordValidations.hasLowercase && 
    passwordValidations.hasNumber && 
    passwordValidations.hasSpecial && 
    passwordValidations.match;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = passwordResetSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div className="space-y-4">
        {/* Entrada para la nueva contraseña */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nueva Contraseña
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu nueva contraseña"
              className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Entrada para confirmar la nueva contraseña */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de verificación interactiva de los requisitos de contraseña */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-zinc-800/80 space-y-2">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Requisitos de la contraseña:
        </p>
        <ul className="text-xs space-y-1.5">
          <li className="flex items-center gap-2">
            {passwordValidations.length ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-gray-600 shrink-0">
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            <span className={passwordValidations.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}>
              Entre 8 y 50 caracteres
            </span>
          </li>
          <li className="flex items-center gap-2">
            {passwordValidations.hasUppercase ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-gray-600 shrink-0">
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            <span className={passwordValidations.hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}>
              Al menos una letra mayúscula (A-Z)
            </span>
          </li>
          <li className="flex items-center gap-2">
            {passwordValidations.hasLowercase ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-gray-600 shrink-0">
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            <span className={passwordValidations.hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}>
              Al menos una letra minúscula (a-z)
            </span>
          </li>
          <li className="flex items-center gap-2">
            {passwordValidations.hasNumber ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-gray-600 shrink-0">
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            <span className={passwordValidations.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}>
              Al menos un número (0-9)
            </span>
          </li>
          <li className="flex items-center gap-2">
            {passwordValidations.hasSpecial ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-gray-600 shrink-0">
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            <span className={passwordValidations.hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}>
              Al menos un carácter especial (ej: @, $, !, #, %, *)
            </span>
          </li>
          <li className="flex items-center gap-2 border-t border-gray-100 dark:border-zinc-800/80 pt-2 mt-2">
            {passwordValidations.match ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-gray-600 shrink-0">
                <X className="w-2.5 h-2.5" />
              </span>
            )}
            <span className={passwordValidations.match ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>
              Las contraseñas coinciden
            </span>
          </li>
        </ul>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !isPasswordValid}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm hover:shadow transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Restableciendo contraseña...
          </>
        ) : (
          'Restablecer contraseña'
        )}
      </button>
    </form>
  );
}
