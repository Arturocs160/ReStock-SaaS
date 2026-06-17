export interface Categoria {
  id_categoria: string;
  id_negocio: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface Producto {
  id_producto: string; // UUID
  id_negocio: string;
  codigo_barras: string | null;
  nombre: string;
  precio_actual: number;
  stock_minimo_sugerido: number;
  categoria?: string;
  id_categoria?: string | null;
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
  categoria: string; // enforce as required in page/filters
  stock_actual: number; // cantidad_actual sumada de todos sus lotes
  lotes: LoteInventario[];
}

export interface CreateProductInput {
  codigo_barras: string | null;
  nombre: string;
  precio_actual: number;
  stock_minimo_sugerido: number;
  id_categoria?: string | null;
}

export interface CreateLoteInput {
  id_producto: string;
  codigo_lote: string;
  fecha_ingreso: string;
  fecha_caducidad: string | null;
  cantidad_inicial: number;
}

export interface UpdateLoteInput {
  codigo_lote: string;
  fecha_ingreso: string;
  fecha_caducidad: string | null;
  cantidad_inicial: number;
}
