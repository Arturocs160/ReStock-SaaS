"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Topbar } from "../../components/dashboard/Topbar";
import CategoriasPanel from "../../components/dashboard/CategoriasPanel";
import { productsApi } from "../../lib/api";
import { Categoria } from "../../types/inventario";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { categoriaSchema } from "../../lib/validationsInventario";
import { useToastStore } from "../../store/toastStore";

export default function CategoriasPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "cashier") {
      router.replace("/dashboard/ventas");
    }
  }, [user, router]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const globalToast = useToastStore();

  // Estados para Modales
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(
    null,
  );

  // Campos de formulario
  const [newCatNombre, setNewCatNombre] = useState("");
  const [newCatDescripcion, setNewCatDescripcion] = useState("");
  const [editCatNombre, setEditCatNombre] = useState("");
  const [editCatDescripcion, setEditCatDescripcion] = useState("");

  // Errores de validación de campos
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // showToastMsg is centralized via globalToast

  // Inicialización y sincronización con el backend
  useEffect(() => {
    const initCategories = async () => {
      try {
        setLoading(true);
        // Obtener categorías desde la base de datos (pasando true para incluir inactivas)
        const apiCats = await productsApi.getCategories(true);
        setCategorias(apiCats);
      } catch (err) {
        console.warn("Error al obtener categorías de la API:", err);
        globalToast.error("Error al cargar las categorías", { title: "ERROR" });
      } finally {
        setLoading(false);
      }
    };

    initCategories();
  }, []);

  // Crear nueva categoría en el backend
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validar con Zod en el frontend
    const result = categoriaSchema.safeParse({
      nombre: newCatNombre,
      descripcion: newCatDescripcion,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {
      const newCategory = await productsApi.createCategory({
        nombre: newCatNombre.trim(),
        descripcion: newCatDescripcion.trim() || null,
      });

      setCategorias([newCategory, ...categorias]);
      setNewCatNombre("");
      setNewCatDescripcion("");
      setFieldErrors({});
      setShowAddCategoryModal(false);
      globalToast.success("Categoría creada con éxito", { title: "CATEGORÍA CREADA" });
    } catch (err: any) {
      console.error(err);
      globalToast.error(err.message || "Error al crear la categoría", { title: "ERROR" });
    }
  };

  // Abrir modal de edición
  const openEditCategoryModal = (cat: Categoria) => {
    setSelectedCategory(cat);
    setEditCatNombre(cat.nombre);
    setEditCatDescripcion(cat.descripcion || "");
    setFieldErrors({});
    setShowEditCategoryModal(true);
  };

  // Guardar edición de categoría en el backend
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setFieldErrors({});

    // Validar con Zod en el frontend
    const result = categoriaSchema.safeParse({
      nombre: editCatNombre,
      descripcion: editCatDescripcion,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {
      const updatedCategory = await productsApi.updateCategory(
        selectedCategory.id_categoria,
        {
          nombre: editCatNombre.trim(),
          descripcion: editCatDescripcion.trim() || null,
        },
      );

      setCategorias(
        categorias.map((cat) =>
          cat.id_categoria === selectedCategory.id_categoria
            ? updatedCategory
            : cat,
        ),
      );
      setShowEditCategoryModal(false);
      setSelectedCategory(null);
      setFieldErrors({});
      globalToast.success("Categoría actualizada con éxito", { title: "CATEGORÍA ACTUALIZADA" });
    } catch (err: any) {
      console.error(err);
      globalToast.error(err.message || "Error al actualizar la categoría", { title: "ERROR" });
    }
  };

  // Activar/Desactivar (Soft-Delete y Restaurar) en el backend
  const handleToggleCategoryActive = async (id: string) => {
    const target = categorias.find((c) => c.id_categoria === id);
    if (!target) return;

    try {
      const updatedCategory = await productsApi.toggleCategoryActive(id);
      setCategorias(
        categorias.map((cat) =>
          cat.id_categoria === id ? updatedCategory : cat,
        ),
      );

      if (target.activo) {
        globalToast.success("Categoría eliminada con éxito (Soft Delete)", { title: "CATEGORÍA ELIMINADA" });
      } else {
        globalToast.success("Categoría restaurada con éxito", { title: "CATEGORÍA RESTAURADA" });
      }
    } catch (err: any) {
      console.warn(err);
      globalToast.error(
        err.message || "Error al cambiar el estado de la categoría",
        { title: "ERROR" }
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6">
          {/* Toast Notification centralized */}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#00a365] rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-gray-500 font-medium animate-pulse">
                Cargando categorías...
              </p>
            </div>
          ) : (
            <CategoriasPanel
              categorias={categorias}
              handleToggleCategoryActive={handleToggleCategoryActive}
              setShowAddCategoryModal={(show) => {
                setShowAddCategoryModal(show);
                if (show) setFieldErrors({});
              }}
              openEditCategoryModal={openEditCategoryModal}
            />
          )}

          {/* MODAL: NUEVA CATEGORÍA */}
          {showAddCategoryModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white border border-gray-100 rounded-[24px] w-full max-w-md p-6 shadow-xl space-y-4 animate-scale-up">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Nueva Categoría
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setNewCatNombre("");
                      setNewCatDescripcion("");
                      setFieldErrors({});
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Bebidas, Limpieza, Farmacia"
                      value={newCatNombre}
                      onChange={(e) => setNewCatNombre(e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${
                        fieldErrors.nombre
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:ring-primary"
                      } rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white`}
                    />
                    {fieldErrors.nombre && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {fieldErrors.nombre}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Descripción (Opcional)
                    </label>
                    <textarea
                      placeholder="Breve descripción sobre los productos que pertenecen a esta categoría..."
                      value={newCatDescripcion}
                      onChange={(e) => setNewCatDescripcion(e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${
                        fieldErrors.descripcion
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:ring-primary"
                      } rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white min-h-[100px] resize-none`}
                    />
                    {fieldErrors.descripcion && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {fieldErrors.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCategoryModal(false);
                        setNewCatNombre("");
                        setNewCatDescripcion("");
                        setFieldErrors({});
                      }}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      Crear Categoría
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: EDITAR CATEGORÍA */}
          {showEditCategoryModal && selectedCategory && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white border border-gray-100 rounded-[24px] w-full max-w-md p-6 shadow-xl space-y-4 animate-scale-up">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Editar Categoría
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditCategoryModal(false);
                      setSelectedCategory(null);
                      setFieldErrors({});
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleEditCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Bebidas, Limpieza, Farmacia"
                      value={editCatNombre}
                      onChange={(e) => setEditCatNombre(e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${
                        fieldErrors.nombre
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:ring-primary"
                      } rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white`}
                    />
                    {fieldErrors.nombre && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {fieldErrors.nombre}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Descripción (Opcional)
                    </label>
                    <textarea
                      placeholder="Breve descripción sobre los productos que pertenecen a esta categoría..."
                      value={editCatDescripcion}
                      onChange={(e) => setEditCatDescripcion(e.target.value)}
                      className={`w-full px-4 py-2.5 bg-gray-50 border ${
                        fieldErrors.descripcion
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:ring-primary"
                      } rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white min-h-[100px] resize-none`}
                    />
                    {fieldErrors.descripcion && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {fieldErrors.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditCategoryModal(false);
                        setSelectedCategory(null);
                        setFieldErrors({});
                      }}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#00a365] hover:bg-[#008c54] text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
