import { RegisterForm } from "../components/registerForm";
import { RegisterBenefitPanel } from "../components/registerBenefitPanel";
import { Logo } from "../components/logo";

export const metadata = {
  title: "Registro de Cuenta - ReStock",
  description:
    "Crea tu cuenta de ReStock para optimizar y controlar tu inventario por lotes de forma rápida y sencilla.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <main className="mx-auto w-full px-4 py-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 sm:py-12 justify-items-stretch">
          <div className="lg:col-span-12 flex justify-center mb-2 lg:mb-4">
            <Logo />
          </div>

          <section className="lg:col-span-7 bg-white/90 dark:bg-black/60 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Crea tu cuenta
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Regístrate en ReStock para comenzar a gestionar tu negocio de
              forma inteligente.
            </p>

            <div className="mt-6">
              <RegisterForm />
            </div>

            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              <p>
                ¿Ya tienes cuenta?{" "}
                <a
                  href="/login"
                  className="text-[#00a365] hover:underline font-medium"
                >
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </section>

          <aside className="lg:col-span-5 w-full order-first lg:order-last">
            <RegisterBenefitPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}
