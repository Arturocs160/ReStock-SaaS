import { ForgotPassword } from "../components/forgotPassword";
import { Logo } from "../components/logo";

export const metadata = {
  title: "Recuperar Contraseña - ReStock",
  description:
    "Recupera el acceso a tu cuenta de ReStock de forma segura mediante un código de verificación.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Gradientes decorativos de fondo */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <main className="mx-auto w-full px-4 relative z-10 py-12">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          {/* Contenedor de la tarjeta */}
          <section className="w-full bg-white/90 dark:bg-black/60 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md backdrop-blur-md animate-scale-up">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recuperación de contraseña
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sigue los pasos para restablecer tu contraseña.
              </p>
            </div>

            {/* Componente interactivo del asistente */}
            <ForgotPassword />
          </section>

          {/* Pie de página con enlace de ayuda */}
          <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            ¿Tienes problemas con la recuperación?{" "}
            <a
              href="mailto:soporte@restock.com"
              className="text-primary hover:underline font-semibold"
            >
              Contactar a soporte
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
