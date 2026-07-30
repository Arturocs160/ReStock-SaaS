"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

interface SuccessStepProps {
  loginUrl?: string;
}

export function SuccessStep({ loginUrl = "/login" }: SuccessStepProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      router.push(loginUrl);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router, loginUrl]);

  return (
    <div className="text-center py-6 space-y-6 animate-scale-up">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/25">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          ¡Contraseña reestablecida!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-450">
          Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar
          sesión con tus nuevas credenciales.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800 text-xs text-gray-500 dark:text-gray-450">
        Redireccionando al inicio de sesión en{" "}
        <span className="font-semibold text-primary text-sm inline-block w-4">
          {countdown}
        </span>{" "}
        segundos...
      </div>

      <a
        href={loginUrl}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm hover:shadow transition cursor-pointer"
      >
        Ir a Iniciar Sesión
      </a>
    </div>
  );
}
