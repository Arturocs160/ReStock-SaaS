import { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  FolderKanban,
} from "lucide-react";
import { Categoria } from "../../types/inventario";

interface CategoriasPanelProps {
  categorias: Categoria[];
  handleToggleCategoryActive: (id: string) => void;
  setShowAddCategoryModal: (show: boolean) => void;
  openEditCategoryModal: (cat: Categoria) => void;
}

export default function CategoriasPanel({
  categorias,
  handleToggleCategoryActive,
  setShowAddCategoryModal,
  openEditCategoryModal,
}: CategoriasPanelProps) {
  // --- Estados de Filtros y Búsqueda ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "todas" | "activas" | "eliminadas"
  >("activas");

  // --- Categorías Filtradas ---
  const filteredCategorias = useMemo(() => {
    return categorias.filter((c) => {
      const matchesSearch =
        c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.descripcion || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "todas" ||
        (statusFilter === "activas" && c.activo) ||
        (statusFilter === "eliminadas" && !c.activo);

      return matchesSearch && matchesStatus;
    });
  }, [categorias, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categorías de Productos
          </h2>
          <p className="text-sm text-gray-500">
            Administra las categorías de tu inventario. Las categorías
            eliminadas se pueden restaurar en cualquier momento.
          </p>
        </div>
        <button
          onClick={() => setShowAddCategoryModal(true)}
          className="bg-[#00a365] hover:bg-[#008c54] text-white text-sm font-semibold px-4 py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Nueva Categoría
        </button>
      </div>

      {/* Controles de Búsqueda, Filtrado y Tabla */}
      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-900 rounded-2xl shadow-sm overflow-hidden space-y-4 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Barra de Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categoría por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
            />
          </div>

          {/* Filtro de Estado */}
          <div className="flex border border-gray-200 dark:border-gray-800 p-0.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 self-start md:self-auto">
            <button
              onClick={() => setStatusFilter("activas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === "activas" ? "bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-xs" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
            >
              Activas
            </button>
            <button
              onClick={() => setStatusFilter("eliminadas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === "eliminadas" ? "bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-xs" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
            >
              Eliminadas
            </button>
            <button
              onClick={() => setStatusFilter("todas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === "todas" ? "bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-xs" : "text-gray-500 hover:text-gray-950 dark:hover:text-gray-200"}`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-900">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm text-gray-500">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold uppercase text-gray-400 border-b border-gray-100 dark:border-gray-900">
              <tr>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Fecha Creación</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
              {filteredCategorias.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FolderKanban className="w-8 h-8 text-gray-300" />
                      <p className="font-semibold text-sm">
                        No se encontraron categorías
                      </p>
                      <p className="text-xs">
                        Prueba ajustando los filtros o crea una nueva categoría.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategorias.map((cat) => {
                  return (
                    <tr
                      key={cat.id_categoria}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${cat.activo ? "bg-green-50 text-[#00a365] border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50" : "bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-750"}`}
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <p className="text-sm font-bold">{cat.nombre}</p>
                            <p className="text-[10px] text-gray-400 font-mono font-normal">
                              ID: {cat.id_categoria}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 max-w-xs truncate font-medium text-gray-600 dark:text-gray-400"
                        title={cat.descripcion || ""}
                      >
                        {cat.descripcion || (
                          <span className="italic text-gray-400 text-xs">
                            Sin descripción
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        {new Date(
                          cat.createdAt || new Date(),
                        ).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            cat.activo
                              ? "bg-green-50 text-[#00a365] border border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50"
                              : "bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cat.activo ? "bg-[#00a365]" : "bg-red-500"}`}
                          ></span>
                          {cat.activo ? "Activa" : "Eliminada"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        {cat.activo ? (
                          <>
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition inline-flex items-center justify-center cursor-pointer"
                              title="Editar categoría"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleCategoryActive(cat.id_categoria)
                              }
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition inline-flex items-center justify-center cursor-pointer"
                              title="Eliminar (Soft Delete)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              handleToggleCategoryActive(cat.id_categoria)
                            }
                            className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 transition inline-flex items-center justify-center gap-1 cursor-pointer text-xs font-semibold"
                            title="Restaurar categoría"
                          >
                            <RotateCcw className="w-4 h-4" /> Restaurar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
