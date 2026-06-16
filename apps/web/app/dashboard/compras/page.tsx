import { Sidebar } from "../../dashboard-components/Sidebar";
import { Topbar } from "../../dashboard-components/Topbar";

export default function LotesPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Inventario compras
          </h1>

          <p className="text-gray-500 mt-2">
            Página simulada para administrar compras.
          </p>
        </main>
      </div>
    </div>
  );
}