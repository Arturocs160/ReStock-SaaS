"use client";
import { useRef, useEffect } from "react";
import { Key, Loader2, AlertCircle } from "lucide-react";
import { otpSchema } from "./schemas";

interface OtpStepProps {
  email: string;
  otp: string[];
  setOtp: (otp: string[]) => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => Promise<boolean>;
  onBack: () => void;
}

export function OtpStep({
  email,
  otp,
  setOtp,
  isLoading,
  error,
  setError,
  onSubmit,
  onResend,
  onBack,
}: OtpStepProps) {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Enfocar el primer campo al montar el componente
  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return; // Permitir únicamente un solo dígito numérico

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Enfocar el siguiente campo al escribir
    if (val !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      // Enfocar el campo anterior al borrar si el actual está vacío
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return; // Asegurar que sean exactamente 6 dígitos

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    otpRefs.current[5]?.focus();
  };

  const handleResendClick = async () => {
    const success = await onResend();
    if (success) {
      otpRefs.current[0]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = otpSchema.safeParse(otp.join(""));
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Key className="w-6 h-6" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Hemos enviado un código a{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {email}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              required
              disabled={isLoading}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              onPaste={idx === 0 ? handleOtpPaste : undefined}
              ref={(el) => {
                otpRefs.current[idx] = el;
              }}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4 pt-2">
        <button
          type="submit"
          disabled={isLoading || otp.join("").length < 6}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm hover:shadow transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar código"
          )}
        </button>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          ¿No recibiste el código?{" "}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleResendClick}
            className="text-primary hover:underline font-semibold cursor-pointer disabled:opacity-50"
          >
            Reenviar código
          </button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition cursor-pointer"
        >
          Cambiar correo electrónico
        </button>
      </div>
    </form>
  );
}
