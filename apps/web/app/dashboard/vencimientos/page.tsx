import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { ExpirationPanel } from "../../components/vencimientos/ExpirationPanel";

export default function VencimientosPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <Topbar />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Control de Vencimientos
            </h1>
            <p className="text-gray-500 mt-2">
              Listado consolidado de todos los lotes con stock disponibles en tienda, ordenados por fecha de expiración para evitar mermas.
            </p>
          </div>

          <ExpirationPanel />
        </main>
      </div>
    </div>
  );
}