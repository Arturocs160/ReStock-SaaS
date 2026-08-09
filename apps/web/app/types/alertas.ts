export interface AlertaProducto {
  id_producto: string;
  nombre: string;
  codigo_barras: string | null;
  stock_actual: number;
  stock_minimo_sugerido: number;
}

export interface Alerta {
  id_alerta: string;
  id_producto: string;
  id_tipo_alerta: string;
  fecha_emision: string;
  resuelta: boolean;
  tipo_alerta: string;
  tipo_alerta_descripcion: string | null;
  producto: AlertaProducto;
}

export interface AlertasResponse {
  alertas: Alerta[];
}
