"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; 
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import ProductGrid from "../../components/ventas/ProductGrid";
import ProductCard from "../../components/ventas/ProductCard";
import LoadingState from "../../components/ventas/LoadingState";
import EmptyState from "../../components/ventas/EmptyState";
import ErrorState from "../../components/ventas/ErrorState";
import { CartPanel } from "../../components/ventas/CartPanel";
import { productsApi, lotesApi } from "../../lib/api";
import { Producto, LoteInventario, ProductoConStock } from "../../types/inventario";

export default function VentasPage() {
  const [productos, setProductos] = useState<ProductoConStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const isMounted = useRef(true);
  const router = useRouter(); 

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError("");

      const catalog = await productsApi.getPosCatalog();
      
      if (!isMounted.current) return;

      const populated: ProductoConStock[] = catalog.map((p) => {
        const lotes = (p.lotes || []).map((l: LoteInventario) => ({
          ...l,
          fecha_caducidad: l.fecha_caducidad ? l.fecha_caducidad.split("T")[0] : null,
        }));

        return {
          ...p,
          categoria: p.categoria ?? "General",
          lotes,
          stock_actual: lotes.reduce((total, lote) => total + lote.cantidad_actual, 0),
        };
      });

      if (isMounted.current) {
        setProductos(populated.filter((producto) => producto.lotes.length > 0));
      }

    } catch (err: any) {
      console.error("Error cargando catálogo POS:", err);
      if (isMounted.current) {
        if (err?.response?.status === 401 || err?.message?.includes("Sesión inválida")) {
          router.push("/login");
        } else {
          setError("No fue posible cargar los productos disponibles.");
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchCatalog();

    return () => {
      isMounted.current = false;
    };
  }, []);

  
  const filteredProducts = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.codigo_barras && p.codigo_barras.includes(searchQuery))
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        
        <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Generar Venta</h1>
              <p className="mt-1 text-sm text-gray-500">
                Busca el producto y selecciona el lote específico del cual quieres descontar stock para realizar la venta.
              </p>
            </div>

            {/* Barra de búsqueda */}
            {!loading && !error && (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Busca por nombre de producto o escanea código de barras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm"
                />
              </div>
            )}

            {loading && <LoadingState />}

            {error && <ErrorState message={error} onRetry={fetchCatalog} />}

            {!loading && !error && filteredProducts.length === 0 && <EmptyState />}

            {!loading && !error && filteredProducts.length > 0 && (
              <ProductGrid>
                {filteredProducts.map((producto) => (
                  <ProductCard key={producto.id_producto} producto={producto} />
                ))}
              </ProductGrid>
            )}
          </div>

          {/* Carrito de Venta */}
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-112px)] flex">
            <CartPanel onSaleCompleted={fetchCatalog} />
          </div>

        </main>
      </div>
    </div>
  );
}