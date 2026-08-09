import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { CentroAlertas } from "../../components/alertas/CentroAlertas";

export default function AlertasPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <Topbar />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Centro de Alertas</h1>
            <p className="text-gray-500 mt-2">
              Alerta generadas automáticamente cuando un producto queda por
              debajo de su stock mínimo. Revísalas y márcalas como resueltas
              para mantener tu inventario al día.
            </p>
          </div>

          <CentroAlertas />
        </main>
      </div>
    </div>
  );
}
