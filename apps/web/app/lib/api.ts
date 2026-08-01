import {
  Producto,
  LoteInventario,
  CreateProductInput,
  CreateLoteInput,
  UpdateLoteInput,
  Categoria,
  ProductoConStock,
} from "../types/inventario";
import { UsuarioTeam, InvitacionTeam } from "../types/team";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${path}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Ha ocurrido un error en el servidor";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Ignorar si la respuesta no es un JSON válido
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const productsApi = {
  getAll: () => apiFetch<Producto[]>("/products"),
  getCategories: (all?: boolean) =>
    apiFetch<Categoria[]>(`/categories${all ? "?all=true" : ""}`),
  createCategory: (data: { nombre: string; descripcion: string | null }) =>
    apiFetch<Categoria>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (
    id: string,
    data: { nombre: string; descripcion: string | null },
  ) =>
    apiFetch<Categoria>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggleCategoryActive: (id: string) =>
    apiFetch<Categoria>(`/categories/${id}/toggle`, {
      method: "PATCH",
    }),
  create: (data: CreateProductInput) =>
    apiFetch<Producto>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: CreateProductInput) =>
    apiFetch<Producto>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/products/${id}`, {
      method: "DELETE",
    }),
  getPosCatalog: () => apiFetch<ProductoConStock[]>("/products/pos/catalog"),
};

export const lotesApi = {
  getByProduct: (productId: string) =>
    apiFetch<LoteInventario[]>(`/lote/product/${productId}`),
  create: (data: CreateLoteInput) =>
    apiFetch<LoteInventario>("/lote", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateLoteInput) =>
    apiFetch<LoteInventario>(`/lote/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/lote/${id}`, {
      method: "DELETE",
    }),
  reportMerma: (id: string, cantidad: number, motivo: string) =>
    apiFetch<any>(`/lote/${id}/merma`, {
      method: "POST",
      body: JSON.stringify({ cantidad, motivo }),
    }),
};

export const salesApi = {
  create: (data: {
    items: {
      id_lote: string;
      cantidad_sold: number;
      precio_unitario: number;
    }[];
  }) =>
    apiFetch<any>("/sales", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMetrics: () =>
    apiFetch<{
      metricas: {
        ingresos: number;
        transacciones: number;
        ticket_promedio: number;
      };
    }>("/sales/metricas"),

  getHistory: async () => {
    const res = await apiFetch<any>("/sales/historial");
    
    // Log para depuración directa en consola
    console.log("Respuesta cruda de GET /sales/historial:", res);

    if (Array.isArray(res)) {
      return { ventas: res };
    }
    
    const ventas = res?.ventas || res?.historial || res?.data || res?.result || [];
    return { ventas };
  },
};

export const teamApi = {
  getMembers: (idNegocio: string) =>
    apiFetch<any[]>(`/negocio/${idNegocio}/usuarios`),
  getInvitations: () => apiFetch<any[]>(`/invitations`),
  createInvitation: (data: { email_invitado: string; role_asignado: string }) =>
    apiFetch<any>("/invitations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteInvitation: (id: string) =>
    apiFetch<void>(`/invitations/${id}`, {
      method: "DELETE",
    }),
  updateMemberRole: (idNegocio: string, idUsuario: string, role: string) =>
    apiFetch<void>(`/negocio/${idNegocio}/usuarios/${idUsuario}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),
  removeMember: (idNegocio: string, idUsuario: string) =>
    apiFetch<void>(`/negocio/${idNegocio}/usuarios/${idUsuario}`, {
      method: "DELETE",
    }),
};