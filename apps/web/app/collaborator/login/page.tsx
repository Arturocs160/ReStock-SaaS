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
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

          <div className="col-span-full flex justify-center mb-2">
            <Logo />
          </div>

          <section className="w-full max-w-md mx-auto bg-white/90 dark:bg-black/60 border border-gray-100 dark:border-zinc-800 rounded-2xl p-8 shadow-md">

            <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-semibold px-4 py-2">
              PORTAL DE COLABORADOR
            </span>

            <h1 className="mt-5 text-4xl font-bold text-gray-900 dark:text-white">
              Ingresa a tu equipo
            </h1>

            <p className="mt-3 text-gray-500 dark:text-zinc-400">
              Accede para registrar ventas y gestionar el stock de la tienda.
            </p>

            <div className="mt-8">
              <LoginForm
                emailLabel="Correo del colaborador"
                passwordLabel="Contraseña"
                submitText="Ingresar como colaborador"
                forgotPasswordText="Recuperar contraseña"
              />
            </div>

            <hr className="my-8 border-gray-200 dark:border-zinc-800" />

            <p className="text-sm text-gray-600 dark:text-zinc-400">
              ¿Eres el dueño del negocio?{" "}
              <a
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Inicia sesión como administrador
              </a>
            </p>
          </section>

          <aside className="w-full max-w-md mx-auto">
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