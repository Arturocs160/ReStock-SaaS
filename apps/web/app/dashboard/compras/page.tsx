import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { PurchasePlanningPanel } from "../../components/compras/PurchasePlanningPanel";

export default function ComprasPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Planificación de Compras
            </h1>
            <p className="text-gray-500 mt-2">
              Busca y añade productos preventivamente a tu lista de compras.
            </p>
          </div>

          <PurchasePlanningPanel />
        </main>
      </div>
    </div>
  );
}
