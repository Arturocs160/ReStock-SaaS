import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { ProductCatalog } from "../../components/ventas/ProductCatalog";
import { CartPanel } from "../../components/ventas/CartPanel";

export default function VentasPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-hidden flex flex-row p-6 gap-6">
          <main className="flex-1 min-w-0 h-full">
            <ProductCatalog />
          </main>
          
          <div className="hidden md:block h-full">
            <CartPanel />
          </div>
        </div>
      </div>
    </div>
  );
}