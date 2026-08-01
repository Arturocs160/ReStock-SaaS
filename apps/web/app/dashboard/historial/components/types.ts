export interface SalesMetrics {
  ingresosTotales: number;
  transaccionesTotales: number;
  ticketPromedio: number;
}

export interface SaleDetail {
  id: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  folio: string;
  fecha: string;
  cajero: string;
  articulos: number;
  total: number;
  detalles: SaleDetail[];
}