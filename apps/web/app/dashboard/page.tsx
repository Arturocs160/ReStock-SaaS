import { Sidebar } from "../components/dashboard/Sidebar";
import { Topbar } from "../components/dashboard/Topbar";
import { MetricsCards } from "../components/dashboard/MetricsCards";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { RecentSales } from "../components/dashboard/RecentSales";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Resumen Operativo
            </h1>

            <p className="text-gray-500 mt-1">
              Métricas clave e información de inventario de tu negocio al día de hoy.
            </p>
          </div>

          <MetricsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <AlertsPanel />
            </div>

            <div>
              <RecentSales />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}