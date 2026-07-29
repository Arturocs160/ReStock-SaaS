import { Suspense } from "react";
import { Logo } from "../../components/logo";
import { RegisterBenefitPanel } from "../../components/registerBenefitPanel";
import { InvitationRegisterForm } from "../../components/InvitationRegisterForm";

export default function InvitationRegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <main className="mx-auto w-full px-4 py-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 sm:py-12">
          <div className="lg:col-span-12 flex justify-center">
            <Logo />
          </div>

          <section className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold">Completa tu registro</h1>

            <p className="text-muted-foreground mt-2">
              Has sido invitado a colaborar en un negocio de ReStock.
            </p>

            <div className="mt-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <InvitationRegisterForm />
              </Suspense>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <RegisterBenefitPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}
