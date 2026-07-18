import {
  Producto,
  LoteInventario,
  CreateProductInput,
  CreateLoteInput,
  UpdateLoteInput,
  Categoria
} from "../types/inventario";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = 'Ha ocurrido un error en el servidor';
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
  getAll: () => apiFetch<Producto[]>('/products'),
  getCategories: () => apiFetch<Categoria[]>('/products/categories'),
  create: (data: CreateProductInput) =>
    apiFetch<Producto>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: CreateProductInput) =>
    apiFetch<Producto>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/products/${id}`, {
      method: 'DELETE',
    }),
};

export const lotesApi = {
  getByProduct: (productId: string) =>
    apiFetch<LoteInventario[]>(`/lote/product/${productId}`),
  create: (data: CreateLoteInput) =>
    apiFetch<LoteInventario>('/lote', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateLoteInput) =>
    apiFetch<LoteInventario>(`/lote/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/lote/${id}`, {
      method: 'DELETE',
    }),
};
