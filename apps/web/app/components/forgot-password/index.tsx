'use client';
import { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import { Check } from 'lucide-react';
import { EmailStep } from './EmailStep';
import { OtpStep } from './OtpStep';
import { PasswordStep } from './PasswordStep';
import { SuccessStep } from './SuccessStep';

export function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Manejar paso 1: Solicitar código
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      if (error) {
        setError(error.message || 'Error al enviar el código de verificación.');
      } else {
        setStep(2);
        setSuccessMsg(`Hemos enviado un código de recuperación al correo: ${email}`);
      }
    } catch (err) {
      setError((err as { message?: string })?.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar paso 2: Verificación del código OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fullOtp = otp.join('');
    
    if (fullOtp.length < 6) {
      setError('Por favor, ingresa los 6 dígitos del código.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.emailOtp.checkVerificationOtp({
        email,
        otp: fullOtp,
        type: "forget-password",
      });

      if (error) {
        setError(error.message || 'El código ingresado es incorrecto o ha expirado.');
      } else {
        setSuccessMsg(null);
        setStep(3);
      }
    } catch (err) {
      setError((err as { message?: string })?.message || 'Error al verificar el código.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar paso 3: Restablecer contraseña
  const handleResetPassword = async (password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const fullOtp = otp.join('');
      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp: fullOtp,
        password: password,
      });

      if (error) {
        setError(error.message || 'Error al restablecer la contraseña. Verifica si el código expiró.');
      } else {
        setStep(4);
      }
    } catch (err) {
      setError((err as { message?: string })?.message || 'Ocurrió un error al intentar restablecer la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar reenvío del código OTP
  const handleResendCode = async (): Promise<boolean> => {
    setError(null);
    setOtp(Array(6).fill(''));
    setIsLoading(true);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      if (error) {
        setError(error.message || 'Error al reenviar el código.');
        return false;
      } else {
        setSuccessMsg("Código reenviado con éxito");
        return true;
      }
    } catch (err) {
      setError((err as { message?: string })?.message || 'Error al reenviar el código.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full transition-all duration-300">
      {step === 1 && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          isLoading={isLoading}
          error={error}
          setError={setError}
          onSubmit={handleRequestCode}
        />
      )}

      {step === 2 && (
        <OtpStep
          email={email}
          otp={otp}
          setOtp={setOtp}
          isLoading={isLoading}
          error={error}
          setError={setError}
          onSubmit={handleVerifyOtp}
          onResend={handleResendCode}
          onBack={() => {
            setError(null);
            setStep(1);
          }}
        />
      )}

      {step === 3 && (
        <PasswordStep
          isLoading={isLoading}
          error={error}
          setError={setError}
          onSubmit={handleResetPassword}
        />
      )}

      {step === 4 && (
        <SuccessStep />
      )}

      {/* Mensajes de estado */}
      {successMsg && step === 2 && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs text-emerald-600 dark:text-emerald-450 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
