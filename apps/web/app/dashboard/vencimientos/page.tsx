import { Sidebar } from "../../dashboard-components/Sidebar";
import { Topbar } from "../../dashboard-components/Topbar";

export default function VencimientosPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Fechas de Vencimiento
          </h1>

          <p className="text-gray-500 mt-2">
            Página simulada para productos próximos a caducar.
          </p>
        </main>
      </div>
    </div>
  );
}