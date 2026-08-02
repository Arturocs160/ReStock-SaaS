import {
  createVentaTransactionModel,
  getVentasHistorialModel,
  getVentasMetricasModel,
} from "../models/ventaModel";
import { CreateVentaInput } from "../schemas/ventaSchema";

export async function createVentaService(
  id_negocio: string,
  userid: string,
  data: CreateVentaInput
) {
  return await createVentaTransactionModel(id_negocio, userid, data.items);
}

export async function getVentasMetricasService(id_negocio: string, userId?: string) {
  const metricas = await getVentasMetricasModel(id_negocio, userId);

  return {
    ingresos: Number(metricas.ingresos),
    transacciones: Number(metricas.transacciones),
    ticket_promedio: Number(metricas.ticket_promedio),
  };
}

export async function getVentasHistorialService(id_negocio: string, q?: string, userId?: string) {
  const rows = await getVentasHistorialModel(id_negocio, q, userId);
  const ventasMap = new Map<string, any>();

  for (const row of rows) {
    if (!ventasMap.has(row.id_venta)) {
      ventasMap.set(row.id_venta, {
        id_venta: row.id_venta,
        id_negocio: row.id_negocio,
        userid: row.userid,
        fecha_transaccion: row.fecha_transaccion,
        cajero: {
          id: row.userid,
          nombre: row.cajero_nombre,
          email: row.cajero_email,
        },
        total: 0,
        detalles: [],
      });
    }

    const venta = ventasMap.get(row.id_venta);
    const subtotal = Number(row.subtotal);

    venta.total += subtotal;
    venta.detalles.push({
      id_detalle: row.id_detalle,
      id_lote: row.id_lote,
      codigo_lote: row.codigo_lote,
      cantidad_sold: Number(row.cantidad_sold),
      precio_unitario: Number(row.precio_unitario),
      subtotal,
      producto: {
        id_producto: row.id_producto,
        nombre: row.producto_nombre,
        codigo_barras: row.codigo_barras,
      },
    });
  }

  return Array.from(ventasMap.values());
}
