import { LoginForm } from "../components/loginForm";
import { DemoPanel } from "../components/demoPanel";
import { Logo } from "../components/logo";

export const metadata = {
  title: "Inicio de Sesión - ReStock",
  description:
    "Inicia sesión en ReStock para gestionar tu inventario de forma inteligente.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <main className="mx-auto w-full px-4 py-6 sm:py-12">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start py-6 sm:py-12 md:py-16 justify-items-center">
          <div className="col-span-full flex justify-center mb-2 animate-fade-in">
            <Logo />
          </div>

          <section className="w-full max-w-md bg-white/90 dark:bg-black/60 border border-gray-100 dark:border-zinc-800/80 backdrop-blur-md rounded-2xl p-5 sm:p-8 shadow-md shadow-black/3 dark:shadow-none animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
              Inicia sesión
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              Accede a tu cuenta para probar ReStock.
            </p>

            <div className="mt-6">
              <LoginForm />
            </div>

            <div className="mt-6 text-sm text-gray-600 dark:text-zinc-400">
              <p>
                ¿No tienes cuenta?{" "}
                <a
                  href="/register"
                  className="text-[#00a365] font-medium hover:underline"
                >
                  Regístrate gratis
                </a>
              </p>
            </div>
          </section>

          <aside className="w-full max-w-md animate-fade-in">
            <DemoPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}
