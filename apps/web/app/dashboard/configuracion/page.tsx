import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";

export default function ConfiguracionPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>

          <p className="text-gray-500 mt-2">
            Página simulada de configuración del sistema.
          </p>
        </main>
      </div>
    </div>
  );
}
