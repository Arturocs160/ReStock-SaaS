"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, CheckCircle2, X, Clock, AlertTriangle } from "lucide-react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import { productsApi, lotesApi } from "../../lib/api";

// Import components
import { Filters } from "../../components/inventario/Filters";
import { ProductTable } from "../../components/inventario/ProductTable";
import { AddProductModal } from "../../components/inventario/AddProductModal";
import { EditProductModal } from "../../components/inventario/EditProductModal";
import { AddLoteModal } from "../../components/inventario/AddLoteModal";
import { EditLoteModal } from "../../components/inventario/EditLoteModal";
import { DeleteProductModal } from "../../components/inventario/DeleteProductModal";
import { DeleteLoteModal } from "../../components/inventario/DeleteLoteModal";

import {
  Producto,
  LoteInventario,
  ProductoConStock,
  Categoria,
} from "../../types/inventario";

export const SIMULATED_TODAY = (() => {
  const today = new Date();
  return new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
})();

export const getExpirationStatus = (expiryDateStr: string | null) => {
  if (!expiryDateStr) {
    return {
      label: "Sin caducidad",
      color:
        "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      level: "ok" as const,
    };
  }
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry.getTime() - SIMULATED_TODAY.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Caducado hace ${Math.abs(diffDays)}d`,
      color:
        "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
      level: "caducado" as const,
    };
  } else if (diffDays <= 30) {
    return {
      label: `Caduca en ${diffDays}d`,
      color:
        "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50",
      level: "por_caducar" as const,
    };
  } else if (diffDays <= 90) {
    return {
      label: `Caduca en ${diffDays}d`,
      color:
        "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
      level: "cercano" as const,
    };
  } else {
    return {
      label: `Vigente (${diffDays}d)`,
      color:
        "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50",
      level: "ok" as const,
    };
  }
};

export default function LotesPage() {
  const [productos, setProductos] = useState<ProductoConStock[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  // --- Estados de Formularios y Modales ---
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  // Nuevo Producto
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Nuevo Lote
  const [showAddLoteModal, setShowAddLoteModal] = useState(false);
  const [selectedProductIdForLote, setSelectedProductIdForLote] = useState("");

  // Editar Producto
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<ProductoConStock | null>(null);

  // Editar Lote
  const [showEditLoteModal, setShowEditLoteModal] = useState(false);
  const [selectedLoteForEdit, setSelectedLoteForEdit] =
    useState<LoteInventario | null>(null);
  const [selectedProductForLoteEdit, setSelectedProductForLoteEdit] =
    useState<string>("");

  // Estados para Modal de Confirmación de Eliminación
  const [activeModal, setActiveModal] = useState<
    "deleteProduct" | "deleteLote" | null
  >(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoConStock | null>(null);
  const [selectedLote, setSelectedLote] = useState<LoteInventario | null>(null);

  const showToastMsg = (
    message: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [prods, catsData] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories(),
      ]);
      setCategories(catsData);

      const populated = await Promise.all(
        prods.map(async (p: Producto) => {
          let lotes: LoteInventario[] = [];
          try {
            const fetchedLotes = await lotesApi.getByProduct(p.id_producto);
            lotes = fetchedLotes.map((l: LoteInventario) => ({
              ...l,
              fecha_ingreso: l.fecha_ingreso
                ? l.fecha_ingreso.split("T")[0]
                : "",
              fecha_caducidad: l.fecha_caducidad
                ? l.fecha_caducidad.split("T")[0]
                : null,
              cantidad_actual:
                l.cantidad_actual !== undefined
                  ? l.cantidad_actual
                  : l.cantidad_inicial,
            }));
          } catch (err) {
            console.error(
              `Error loading lotes for product ${p.id_producto}:`,
              err,
            );
          }
          const stock_actual = lotes.reduce(
            (sum, l) => sum + l.cantidad_actual,
            0,
          );
          return {
            ...p,
            categoria: p.categoria || "General",
            lotes,
            stock_actual,
          };
        }),
      );
      setProductos(populated);
    } catch (err) {
      console.error("Error loading inventory:", err);
      showToastMsg(
        "Error al cargar el inventario de la base de datos.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categorias = useMemo(() => {
    const cats = new Set(productos.map((p) => p.categoria));
    return ["Todas", ...Array.from(cats)];
  }, [productos]);

  // Filtrado de Inventario
  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      const matchesSearch =
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.codigo_barras && p.codigo_barras.includes(searchQuery));
      const matchesCategory =
        categoryFilter === "Todas" || p.categoria === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [productos, searchQuery, categoryFilter]);

  // --- Manejadores de acciones ---

  const handleToggleProduct = (id: string) => {
    setExpandedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Agregar Producto Nuevo
  const handleAddProduct = async (
    name: string,
    barcode: string,
    id_categoria: string | null,
    priceNum: number,
    minStockNum: number,
  ) => {
    if (!name || isNaN(priceNum) || isNaN(minStockNum)) {
      showToastMsg("Por favor, llena los campos requeridos.", "error");
      return;
    }

    try {
      await productsApi.create({
        codigo_barras: barcode || null,
        nombre: name,
        precio_actual: priceNum,
        stock_minimo_sugerido: minStockNum,
        id_categoria: id_categoria,
      });
      setShowAddProductModal(false);
      showToastMsg("¡Producto registrado con éxito!", "success");
      await fetchInventory();
    } catch (err) {
      console.error(err);
      showToastMsg(
        err instanceof Error ? err.message : "Error al registrar el producto.",
        "error",
      );
    }
  };

  // Eliminar Producto (Abre el modal de confirmación)
  const handleDeleteProduct = (id: string) => {
    const target = productos.find((p) => p.id_producto === id);
    if (target) {
      setSelectedProduct(target);
      setActiveModal("deleteProduct");
    }
  };

  const handleDeleteProductConfirm = async () => {
    if (selectedProduct) {
      try {
        await productsApi.delete(selectedProduct.id_producto);
        showToastMsg("Producto eliminado permanentemente.", "info");
        setActiveModal(null);
        setSelectedProduct(null);
        await fetchInventory();
      } catch (err) {
        console.error(err);
        showToastMsg(
          err instanceof Error ? err.message : "Error al eliminar el producto.",
          "error",
        );
      }
    }
  };

  // Editar Producto
  const openEditProductModal = (product: ProductoConStock) => {
    setSelectedProductForEdit(product);
    setShowEditProductModal(true);
  };

  const handleEditProduct = async (
    name: string,
    barcode: string,
    id_categoria: string | null,
    priceNum: number,
    minStockNum: number,
  ) => {
    if (
      !selectedProductForEdit ||
      !name ||
      isNaN(priceNum) ||
      isNaN(minStockNum)
    ) {
      showToastMsg("Por favor, llena los campos requeridos.", "error");
      return;
    }

    try {
      await productsApi.update(selectedProductForEdit.id_producto, {
        codigo_barras: barcode || null,
        nombre: name,
        precio_actual: priceNum,
        stock_minimo_sugerido: minStockNum,
        id_categoria: id_categoria,
      });
      setShowEditProductModal(false);
      showToastMsg("¡Producto actualizado con éxito!", "success");
      await fetchInventory();
    } catch (err) {
      console.error(err);
      showToastMsg(
        err instanceof Error ? err.message : "Error al actualizar el producto.",
        "error",
      );
    }
  };

  // Agregar Lote a Producto Existente
  const openAddLoteModal = (productId: string) => {
    setSelectedProductIdForLote(productId);
    setShowAddLoteModal(true);
  };

  const handleAddLote = async (
    code: string,
    qtyNum: number,
    expiry: string,
  ) => {
    if (!code || isNaN(qtyNum) || qtyNum <= 0) {
      showToastMsg("Ingresa código de lote y cantidad válidos.", "error");
      return;
    }

    const targetProduct = productos.find(
      (p) => p.id_producto === selectedProductIdForLote,
    );
    if (!targetProduct) {
      showToastMsg("Producto no encontrado.", "error");
      return;
    }

    try {
      await lotesApi.create({
        id_producto: selectedProductIdForLote,
        codigo_lote: code,
        fecha_ingreso: SIMULATED_TODAY.toISOString().split("T")[0],
        fecha_caducidad: expiry || null,
        cantidad_inicial: qtyNum,
      });
      setShowAddLoteModal(false);
      showToastMsg(`Lote registrado para: ${targetProduct.nombre}`, "success");
      await fetchInventory();
    } catch (err) {
      console.error(err);
      showToastMsg(
        err instanceof Error ? err.message : "Error al registrar el lote.",
        "error",
      );
    }
  };

  // Editar Lote
  const openEditLoteModal = (productId: string, lote: LoteInventario) => {
    setSelectedProductForLoteEdit(productId);
    setSelectedLoteForEdit(lote);
    setShowEditLoteModal(true);
  };

  const handleEditLote = async (
    code: string,
    qtyNum: number,
    expiry: string,
  ) => {
    if (!selectedLoteForEdit || !code || isNaN(qtyNum) || qtyNum < 0) {
      showToastMsg(
        "Por favor, llena los campos requeridos correctamente.",
        "error",
      );
      return;
    }

    try {
      await lotesApi.update(selectedLoteForEdit.id_lote, {
        codigo_lote: code,
        fecha_ingreso: selectedLoteForEdit.fecha_ingreso
          ? selectedLoteForEdit.fecha_ingreso.split("T")[0]
          : SIMULATED_TODAY.toISOString().split("T")[0],
        fecha_caducidad: expiry || null,
        cantidad_inicial: qtyNum,
      });
      setShowEditLoteModal(false);
      showToastMsg("¡Lote actualizado con éxito!", "success");
      await fetchInventory();
    } catch (err) {
      console.error(err);
      showToastMsg(
        err instanceof Error ? err.message : "Error al actualizar el lote.",
        "error",
      );
    }
  };

  // Eliminar un Lote Específico (Abre el modal de confirmación)
  const handleDeleteLote = (productId: string, loteId: string) => {
    const targetProd = productos.find((p) => p.id_producto === productId);
    const targetLote = targetProd?.lotes.find((l) => l.id_lote === loteId);
    if (targetProd && targetLote) {
      setSelectedProduct(targetProd);
      setSelectedLote(targetLote);
      setActiveModal("deleteLote");
    }
  };

  const handleDeleteLoteConfirm = async () => {
    if (selectedProduct && selectedLote) {
      try {
        await lotesApi.delete(selectedLote.id_lote);
        showToastMsg("Lote eliminado.", "info");
        setActiveModal(null);
        setSelectedLote(null);
        setSelectedProduct(null);
        await fetchInventory();
      } catch (err) {
        console.error(err);
        showToastMsg(
          err instanceof Error ? err.message : "Error al eliminar el lote.",
          "error",
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6">
          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-5 right-5 z-100 animate-scale-up">
              <div
                className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border backdrop-blur-md ${
                  toast.type === "success"
                    ? "bg-[#eafaf1]/95 text-[#00a365] border-[#00a365]/30"
                    : toast.type === "error"
                      ? "bg-red-50/95 text-red-700 border-red-200"
                      : "bg-blue-50/95 text-blue-700 border-blue-200"
                }`}
              >
                {toast.type === "success" && (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                {toast.type === "error" && (
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                )}
                {toast.type === "info" && (
                  <Clock className="w-5 h-5 shrink-0" />
                )}
                <span className="text-sm font-semibold">{toast.message}</span>
                <button
                  onClick={() => setToast(null)}
                  className="ml-2 hover:opacity-70 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTARIO POR LOTES */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Inventario por Lotes
                </h2>
                <p className="text-sm text-gray-500">
                  Administra tus productos y desglosa sus lotes para gestionar
                  vencimientos e ingresos.
                </p>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-[#00a365] hover:bg-[#008c54] text-white font-medium text-sm px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2 self-start sm:self-center cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Registrar Producto
              </button>
            </div>

            {/* Filtros de Inventario */}
            <Filters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categorias={categorias}
            />

            {/* Tabla de Inventario */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-[#00a365] rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                  Cargando inventario y lotes...
                </p>
              </div>
            ) : (
              <ProductTable
                products={filteredProducts}
                expandedProducts={expandedProducts}
                onToggleProduct={handleToggleProduct}
                onAddLote={openAddLoteModal}
                onEditProduct={openEditProductModal}
                onDeleteProduct={handleDeleteProduct}
                onEditLote={openEditLoteModal}
                onDeleteLote={handleDeleteLote}
              />
            )}
          </div>

          {/* MODAL: REGISTRAR PRODUCTO */}
          {showAddProductModal && (
            <AddProductModal
              onClose={() => setShowAddProductModal(false)}
              categories={categories}
              onConfirm={handleAddProduct}
            />
          )}

          {/* MODAL: REGISTRAR LOTE */}
          {showAddLoteModal && (
            <AddLoteModal
              onClose={() => setShowAddLoteModal(false)}
              productName={
                productos.find(
                  (p) => p.id_producto === selectedProductIdForLote,
                )?.nombre || ""
              }
              onConfirm={handleAddLote}
            />
          )}

          {/* MODAL: EDITAR PRODUCTO */}
          {showEditProductModal && selectedProductForEdit && (
            <EditProductModal
              onClose={() => setShowEditProductModal(false)}
              product={selectedProductForEdit}
              categories={categories}
              onConfirm={handleEditProduct}
            />
          )}

          {/* MODAL: EDITAR LOTE */}
          {showEditLoteModal && selectedLoteForEdit && (
            <EditLoteModal
              onClose={() => setShowEditLoteModal(false)}
              productName={
                productos.find(
                  (p) => p.id_producto === selectedProductForLoteEdit,
                )?.nombre || ""
              }
              lote={selectedLoteForEdit}
              onConfirm={handleEditLote}
            />
          )}

          {/* MODAL: ELIMINAR PRODUCTO */}
          {activeModal === "deleteProduct" && selectedProduct && (
            <DeleteProductModal
              isOpen={activeModal === "deleteProduct"}
              onClose={() => setActiveModal(null)}
              productName={selectedProduct.nombre}
              onConfirm={handleDeleteProductConfirm}
            />
          )}

          {/* MODAL: ELIMINAR LOTE */}
          {activeModal === "deleteLote" && selectedLote && selectedProduct && (
            <DeleteLoteModal
              isOpen={activeModal === "deleteLote"}
              onClose={() => setActiveModal(null)}
              loteCode={selectedLote.codigo_lote}
              productName={selectedProduct.nombre}
              onConfirm={handleDeleteLoteConfirm}
            />
          )}
        </main>
      </div>
    </div>
  );
}
