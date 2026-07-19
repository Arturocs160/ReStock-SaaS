import { LoginForm } from "../../components/loginForm";
import { DemoPanel } from "../../components/demoPanel";
import { Logo } from "../../components/logo";

export const metadata = {
  title: "Portal del Colaborador - ReStock",
  description:
    "Accede para registrar ventas y gestionar el stock de la tienda.",
};

export default function CollaboratorLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <main className="mx-auto w-full px-4 py-6 sm:py-12">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start py-6 sm:py-12 md:py-16 justify-items-center">

          <div className="col-span-full flex justify-center mb-2 animate-fade-in">
            <Logo />
          </div>

          <section className="w-full max-w-md bg-white/90 dark:bg-black/60 border border-gray-100 dark:border-zinc-800/80 backdrop-blur-md rounded-2xl p-5 sm:p-8 shadow-md shadow-black/3 dark:shadow-none animate-fade-in">
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-semibold px-4 py-1.5 mb-4">
              PORTAL DE COLABORADOR
            </span>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
              Ingresa a tu equipo
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              Accede para registrar ventas y gestionar el stock de la tienda.
            </p>

            <div className="mt-6">
              <LoginForm
                emailLabel="Correo del colaborador"
                passwordLabel="Contraseña"
                submitText="Ingresar como colaborador"
                forgotPasswordText="Recuperar contraseña"
              />
            </div>

            <hr className="my-6 border-gray-200 dark:border-zinc-800/80" />

            <div className="text-sm text-gray-600 dark:text-zinc-400">
              <p>
                ¿Eres el dueño del negocio?{" "}
                <a
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Inicia sesión como administrador
                </a>
              </p>
            </div>
          </section>

          <aside className="w-full max-w-md animate-fade-in">
            <DemoPanel
              title="Demo"
              subtitle={
                <>
                  Usa estas credenciales para probar la demo como{" "}
                  <span className="font-semibold text-primary">
                    Colaborador (Empleado)
                  </span>
                  .
                </>
              }
              email="sofia@mitienda.com"
              password="Colaborador123@"
              sectionTitle="Capacidades del rol"
              features={[
                "Acceso al punto de venta (POS) para registrar ventas.",
                "Control y visualización de fechas de vencimiento de lotes.",
                "Visualización general del stock y productos.",
                "Acceso restringido a configuraciones críticas.",
              ]}
            />
          </aside>

        </div>
      </main>
    </div>
  );
}