"use client";

import { useState, useMemo } from "react";
import {
    Plus,
    CheckCircle2,
    X,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";

// Import components
import { Filters } from "../../components/inventario/Filters";
import { ProductTable } from "../../components/inventario/ProductTable";
import { AddProductModal } from "../../components/inventario/AddProductModal";
import { EditProductModal } from "../../components/inventario/EditProductModal";
import { AddLoteModal } from "../../components/inventario/AddLoteModal";
import { EditLoteModal } from "../../components/inventario/EditLoteModal";
import { DeleteProductModal } from "../../components/inventario/DeleteProductModal";
import { DeleteLoteModal } from "../../components/inventario/DeleteLoteModal";

// interfaces
export interface Producto {
    id_producto: string; // UUID
    id_negocio: string;
    codigo_barras: string | null;
    nombre: string;
    precio_actual: number;
    stock_minimo_sugerido: number;
    categoria: string;
}

export interface LoteInventario {
    id_lote: string; // UUID
    id_producto: string;
    codigo_lote: string;
    fecha_ingreso: string; // YYYY-MM-DD
    fecha_caducidad: string | null;
    cantidad_inicial: number;
    cantidad_actual: number; // Stock disponible en este lote
}

export interface ProductoConStock extends Producto {
    stock_actual: number; // cantidad_actual sumada de todos sus lotes
    lotes: LoteInventario[];
}

export const SIMULATED_TODAY = new Date("2026-06-14");

export const INITIAL_PRODUCTS: ProductoConStock[] = [
    {
        id_producto: "p1",
        id_negocio: "n1",
        codigo_barras: "7501055300075",
        nombre: "Coca-Cola Original 600ml",
        precio_actual: 18.00,
        stock_minimo_sugerido: 25,
        categoria: "Bebidas",
        stock_actual: 30,
        lotes: [
            {
                id_lote: "l1",
                id_producto: "p1",
                codigo_lote: "L-COKE-01",
                fecha_ingreso: "2026-05-10",
                fecha_caducidad: "2026-10-15",
                cantidad_inicial: 25,
                cantidad_actual: 25
            },
            {
                id_lote: "l2",
                id_producto: "p1",
                codigo_lote: "L-COKE-02",
                fecha_ingreso: "2026-06-01",
                fecha_caducidad: "2026-06-18",
                cantidad_inicial: 10,
                cantidad_actual: 5
            }
        ]
    },
    {
        id_producto: "p2",
        id_negocio: "n1",
        codigo_barras: "7501020513103",
        nombre: "Leche Entera Lala 1L",
        precio_actual: 26.50,
        stock_minimo_sugerido: 15,
        categoria: "Lácteos",
        stock_actual: 15,
        lotes: [
            {
                id_lote: "l3",
                id_producto: "p2",
                codigo_lote: "L-LALA-01",
                fecha_ingreso: "2026-06-01",
                fecha_caducidad: "2026-06-12",
                cantidad_inicial: 10,
                cantidad_actual: 3
            },
            {
                id_lote: "l4",
                id_producto: "p2",
                codigo_lote: "L-LALA-02",
                fecha_ingreso: "2026-06-10",
                fecha_caducidad: "2026-07-01",
                cantidad_inicial: 15,
                cantidad_actual: 12
            }
        ]
    },
    {
        id_producto: "p3",
        id_negocio: "n1",
        codigo_barras: "7501000111206",
        nombre: "Pan Blanco Bimbo Grande",
        precio_actual: 45.00,
        stock_minimo_sugerido: 12,
        categoria: "Panadería",
        stock_actual: 8,
        lotes: [
            {
                id_lote: "l5",
                id_producto: "p3",
                codigo_lote: "L-BIMBO-01",
                fecha_ingreso: "2026-06-08",
                fecha_caducidad: "2026-06-25",
                cantidad_inicial: 10,
                cantidad_actual: 8
            }
        ]
    },
    {
        id_producto: "p4",
        id_negocio: "n1",
        codigo_barras: "7501032900014",
        nombre: "Huevos San Juan 30 pzas",
        precio_actual: 85.00,
        stock_minimo_sugerido: 8,
        categoria: "Abarrotes",
        stock_actual: 6,
        lotes: [
            {
                id_lote: "l6",
                id_producto: "p4",
                codigo_lote: "L-HUEV-01",
                fecha_ingreso: "2026-06-05",
                fecha_caducidad: "2026-07-10",
                cantidad_inicial: 10,
                cantidad_actual: 6
            }
        ]
    },
    {
        id_producto: "p5",
        id_negocio: "n1",
        codigo_barras: "7501006579307",
        nombre: "Detergente Líquido Ariel 1L",
        precio_actual: 39.00,
        stock_minimo_sugerido: 10,
        categoria: "Limpieza",
        stock_actual: 15,
        lotes: [
            {
                id_lote: "l7",
                id_producto: "p5",
                codigo_lote: "L-ARIEL-01",
                fecha_ingreso: "2026-05-15",
                fecha_caducidad: "2027-12-30",
                cantidad_inicial: 15,
                cantidad_actual: 15
            }
        ]
    },
    {
        id_producto: "p6",
        id_negocio: "n1",
        codigo_barras: "7501003301055",
        nombre: "Atún Herdez en Agua 130g",
        precio_actual: 21.00,
        stock_minimo_sugerido: 20,
        categoria: "Enlatados",
        stock_actual: 34,
        lotes: [
            {
                id_lote: "l8",
                id_producto: "p6",
                codigo_lote: "L-ATUN-01",
                fecha_ingreso: "2026-04-10",
                fecha_caducidad: "2026-05-01",
                cantidad_inicial: 10,
                cantidad_actual: 4
            },
            {
                id_lote: "l9",
                id_producto: "p6",
                codigo_lote: "L-ATUN-02",
                fecha_ingreso: "2026-06-02",
                fecha_caducidad: "2028-03-15",
                cantidad_inicial: 30,
                cantidad_actual: 30
            }
        ]
    },
    {
        id_producto: "p7",
        id_negocio: "n1",
        codigo_barras: "7501017004034",
        nombre: "Jabón Zote Blanco 400g",
        precio_actual: 24.50,
        stock_minimo_sugerido: 15,
        categoria: "Limpieza",
        stock_actual: 18,
        lotes: [
            {
                id_lote: "l10",
                id_producto: "p7",
                codigo_lote: "L-ZOTE-01",
                fecha_ingreso: "2026-06-01",
                fecha_caducidad: null,
                cantidad_inicial: 20,
                cantidad_actual: 18
            }
        ]
    },
    {
        id_producto: "p8",
        id_negocio: "n1",
        codigo_barras: "7501011115637",
        nombre: "Papitas Sabritas Sal 110g",
        precio_actual: 19.50,
        stock_minimo_sugerido: 25,
        categoria: "Snacks",
        stock_actual: 5,
        lotes: [
            {
                id_lote: "l11",
                id_producto: "p8",
                codigo_lote: "L-SABR-01",
                fecha_ingreso: "2026-06-05",
                fecha_caducidad: "2026-08-20",
                cantidad_inicial: 10,
                cantidad_actual: 5
            }
        ]
    }
];

export const getExpirationStatus = (expiryDateStr: string | null) => {
    if (!expiryDateStr) {
        return {
            label: "Sin caducidad",
            color: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
            level: "ok" as const
        }
    }
    const expiry = new Date(expiryDateStr)
    const diffTime = expiry.getTime() - SIMULATED_TODAY.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
        return {
            label: `Caducado hace ${Math.abs(diffDays)}d`,
            color: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
            level: "caducado" as const
        }
    } else if (diffDays <= 30) {
        return {
            label: `Caduca en ${diffDays}d`,
            color: "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50",
            level: "por_caducar" as const
        }
    } else if (diffDays <= 90) {
        return {
            label: `Caduca en ${diffDays}d`,
            color: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
            level: "cercano" as const
        }
    } else {
        return {
            label: `Vigente (${diffDays}d)`,
            color: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50",
            level: "ok" as const
        }
    }
}

export default function LotesPage() {
    const [productos, setProductos] = useState<ProductoConStock[]>(INITIAL_PRODUCTS);
    const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

    // --- Estados de Formularios y Modales ---
    const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("Todas");

    // Nuevo Producto
    const [showAddProductModal, setShowAddProductModal] = useState(false);

    // Nuevo Lote
    const [showAddLoteModal, setShowAddLoteModal] = useState(false);
    const [selectedProductIdForLote, setSelectedProductIdForLote] = useState("");

    // Editar Producto
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState<ProductoConStock | null>(null);

    // Editar Lote
    const [showEditLoteModal, setShowEditLoteModal] = useState(false);
    const [selectedLoteForEdit, setSelectedLoteForEdit] = useState<LoteInventario | null>(null);
    const [selectedProductForLoteEdit, setSelectedProductForLoteEdit] = useState<string>("");

    // Estados para Modal de Confirmación de Eliminación
    const [activeModal, setActiveModal] = useState<"deleteProduct" | "deleteLote" | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductoConStock | null>(null);
    const [selectedLote, setSelectedLote] = useState<LoteInventario | null>(null);

    const showToastMsg = (message: string, type: "success" | "info" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const categorias = useMemo(() => {
        const cats = new Set(productos.map(p => p.categoria));
        return ["Todas", ...Array.from(cats)];
    }, [productos]);

    // Filtrado de Inventario
    const filteredProducts = useMemo(() => {
        return productos.filter(p => {
            const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.codigo_barras && p.codigo_barras.includes(searchQuery));
            const matchesCategory = categoryFilter === "Todas" || p.categoria === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [productos, searchQuery, categoryFilter]);

    // --- Manejadores de acciones ---

    const handleToggleProduct = (id: string) => {
        setExpandedProducts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Agregar Producto Nuevo
    const handleAddProduct = (
        name: string,
        barcode: string,
        category: string,
        priceNum: number,
        minStockNum: number
    ) => {
        if (!name || isNaN(priceNum) || isNaN(minStockNum)) {
            showToastMsg("Por favor, llena los campos requeridos.", "error");
            return;
        }

        const newProd: ProductoConStock = {
            id_producto: `p_${Date.now()}`,
            id_negocio: "n1",
            codigo_barras: barcode || null,
            nombre: name,
            precio_actual: priceNum,
            stock_minimo_sugerido: minStockNum,
            categoria: category,
            stock_actual: 0,
            lotes: []
        };

        setProductos(prev => [newProd, ...prev]);
        setShowAddProductModal(false);
        showToastMsg("¡Producto registrado con éxito!", "success");
    };

    // Eliminar Producto (Abre el modal de confirmación)
    const handleDeleteProduct = (id: string) => {
        const target = productos.find(p => p.id_producto === id);
        if (target) {
            setSelectedProduct(target);
            setActiveModal("deleteProduct");
        }
    };

    const handleDeleteProductConfirm = () => {
        if (selectedProduct) {
            setProductos(prev => prev.filter(p => p.id_producto !== selectedProduct.id_producto));
            showToastMsg("Producto eliminado permanentemente.", "info");
            setActiveModal(null);
            setSelectedProduct(null);
        }
    };

    // Editar Producto
    const openEditProductModal = (product: ProductoConStock) => {
        setSelectedProductForEdit(product);
        setShowEditProductModal(true);
    };

    const handleEditProduct = (
        name: string,
        barcode: string,
        category: string,
        priceNum: number,
        minStockNum: number
    ) => {
        if (!selectedProductForEdit || !name || isNaN(priceNum) || isNaN(minStockNum)) {
            showToastMsg("Por favor, llena los campos requeridos.", "error");
            return;
        }

        setProductos(prev => {
            return prev.map(p => {
                if (p.id_producto === selectedProductForEdit.id_producto) {
                    return {
                        ...p,
                        nombre: name,
                        codigo_barras: barcode || null,
                        categoria: category,
                        precio_actual: priceNum,
                        stock_minimo_sugerido: minStockNum
                    };
                }
                return p;
            });
        });

        setShowEditProductModal(false);
        showToastMsg("¡Producto actualizado con éxito!", "success");
    };

    // Agregar Lote a Producto Existente
    const openAddLoteModal = (productId: string) => {
        setSelectedProductIdForLote(productId);
        setShowAddLoteModal(true);
    };

    const handleAddLote = (code: string, qtyNum: number, expiry: string) => {
        if (!code || isNaN(qtyNum) || qtyNum <= 0) {
            showToastMsg("Ingresa código de lote y cantidad válidos.", "error");
            return;
        }

        const targetProduct = productos.find(p => p.id_producto === selectedProductIdForLote);
        if (!targetProduct) {
            showToastMsg("Producto no encontrado.", "error");
            return;
        }

        const newLote: LoteInventario = {
            id_lote: `l_${Date.now()}`,
            id_producto: selectedProductIdForLote,
            codigo_lote: code,
            fecha_ingreso: SIMULATED_TODAY.toISOString().split("T")[0],
            fecha_caducidad: expiry || null,
            cantidad_inicial: qtyNum,
            cantidad_actual: qtyNum
        };

        setProductos(prev => {
            return prev.map(p => {
                if (p.id_producto === selectedProductIdForLote) {
                    const updatedLotes = [newLote, ...p.lotes];
                    const updatedStock = updatedLotes.reduce((sum, l) => sum + l.cantidad_actual, 0);
                    return {
                        ...p,
                        lotes: updatedLotes,
                        stock_actual: updatedStock
                    };
                }
                return p;
            });
        });

        setShowAddLoteModal(false);
        showToastMsg(`Lote registrado para: ${targetProduct.nombre}`, "success");
    };

    // Editar Lote
    const openEditLoteModal = (productId: string, lote: LoteInventario) => {
        setSelectedProductForLoteEdit(productId);
        setSelectedLoteForEdit(lote);
        setShowEditLoteModal(true);
    };

    const handleEditLote = (code: string, qtyNum: number, expiry: string) => {
        if (!selectedLoteForEdit || !code || isNaN(qtyNum) || qtyNum < 0) {
            showToastMsg("Por favor, llena los campos requeridos correctamente.", "error");
            return;
        }

        setProductos(prev => {
            return prev.map(p => {
                if (p.id_producto === selectedProductForLoteEdit) {
                    const updatedLotes = p.lotes.map(l => {
                        if (l.id_lote === selectedLoteForEdit.id_lote) {
                            return {
                                ...l,
                                codigo_lote: code,
                                cantidad_actual: qtyNum,
                                fecha_caducidad: expiry || null
                            };
                        }
                        return l;
                    });
                    return {
                        ...p,
                        lotes: updatedLotes,
                        stock_actual: updatedLotes.reduce((sum, l) => sum + l.cantidad_actual, 0)
                    };
                }
                return p;
            });
        });

        setShowEditLoteModal(false);
        showToastMsg("¡Lote actualizado con éxito!", "success");
    };

    // Eliminar un Lote Específico (Abre el modal de confirmación)
    const handleDeleteLote = (productId: string, loteId: string) => {
        const targetProd = productos.find(p => p.id_producto === productId);
        const targetLote = targetProd?.lotes.find(l => l.id_lote === loteId);
        if (targetProd && targetLote) {
            setSelectedProduct(targetProd);
            setSelectedLote(targetLote);
            setActiveModal("deleteLote");
        }
    };

    const handleDeleteLoteConfirm = () => {
        if (selectedProduct && selectedLote) {
            setProductos(prev => {
                return prev.map(p => {
                    if (p.id_producto === selectedProduct.id_producto) {
                        const updatedLotes = p.lotes.filter(l => l.id_lote !== selectedLote.id_lote);
                        return {
                            ...p,
                            lotes: updatedLotes,
                            stock_actual: updatedLotes.reduce((sum, l) => sum + l.cantidad_actual, 0)
                        };
                    }
                    return p;
                });
            });
            showToastMsg("Lote eliminado.", "info");
            setActiveModal(null);
            setSelectedLote(null);
            setSelectedProduct(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-gray-900">
            <Sidebar />

            <div className="flex-1">
                <Topbar />

                <main className="p-6">
                    {/* Toast Notification */}
                    {toast && (
                        <div className="fixed top-5 right-5 z-50 animate-scale-up">
                            <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border backdrop-blur-md ${toast.type === "success"
                                ? "bg-[#eafaf1]/95 text-[#00a365] border-[#00a365]/30"
                                : toast.type === "error"
                                    ? "bg-red-50/95 text-red-700 border-red-200"
                                    : "bg-blue-50/95 text-blue-700 border-blue-200"
                                }`}>
                                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                                {toast.type === "error" && <AlertTriangle className="w-5 h-5 shrink-0" />}
                                {toast.type === "info" && <Clock className="w-5 h-5 shrink-0" />}
                                <span className="text-sm font-semibold">{toast.message}</span>
                                <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: INVENTARIO POR LOTES */}
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario por Lotes</h2>
                                <p className="text-sm text-gray-500">Administra tus productos y desglosa sus lotes para gestionar vencimientos e ingresos.</p>
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
                    </div>

                    {/* MODAL: REGISTRAR PRODUCTO */}
                    {showAddProductModal && (
                        <AddProductModal
                            onClose={() => setShowAddProductModal(false)}
                            onConfirm={handleAddProduct}
                        />
                    )}

                    {/* MODAL: REGISTRAR LOTE */}
                    {showAddLoteModal && (
                        <AddLoteModal
                            onClose={() => setShowAddLoteModal(false)}
                            productName={productos.find(p => p.id_producto === selectedProductIdForLote)?.nombre || ""}
                            onConfirm={handleAddLote}
                        />
                    )}

                    {/* MODAL: EDITAR PRODUCTO */}
                    {showEditProductModal && selectedProductForEdit && (
                        <EditProductModal
                            onClose={() => setShowEditProductModal(false)}
                            product={selectedProductForEdit}
                            onConfirm={handleEditProduct}
                        />
                    )}

                    {/* MODAL: EDITAR LOTE */}
                    {showEditLoteModal && selectedLoteForEdit && (
                        <EditLoteModal
                            onClose={() => setShowEditLoteModal(false)}
                            productName={productos.find(p => p.id_producto === selectedProductForLoteEdit)?.nombre || ""}
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