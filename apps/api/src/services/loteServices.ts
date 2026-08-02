import { randomUUID } from "node:crypto";
import {
  createLoteModel,
  deleteLoteModel,
  getLoteByIdModel,
  getLotesExpiracionModel,
  getLotesByProductIdModel,
  updateLoteModel,
  createMermaTransactionModel,
} from "../models/loteModel";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function getUtcStartOfDay(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function calcularClasificacionVencimiento(fecha_caducidad: string | null) {
  if (!fecha_caducidad) {
    return { dias_para_caducar: null, clasificacion_vencimiento: "sin_fecha" };
  }

  const fechaCaducidad = new Date(`${fecha_caducidad}T00:00:00.000Z`);
  const hoy = getUtcStartOfDay(new Date());
  const diasParaCaducar = Math.ceil((getUtcStartOfDay(fechaCaducidad) - hoy) / MS_PER_DAY);

  if (diasParaCaducar < 0) {
    return { dias_para_caducar: diasParaCaducar, clasificacion_vencimiento: "vencido" };
  }

  if (diasParaCaducar <= 7) {
    return { dias_para_caducar: diasParaCaducar, clasificacion_vencimiento: "critico" };
  }

  if (diasParaCaducar <= 30) {
    return { dias_para_caducar: diasParaCaducar, clasificacion_vencimiento: "proximo" };
  }

  return { dias_para_caducar: diasParaCaducar, clasificacion_vencimiento: "vigente" };
}

export async function createLoteService(
  id_producto: string,
  codigo_lote: string,
  fecha_ingreso: string,
  fecha_caducidad: string | null,
  cantidad_inicial: number
) {
  const id_lote = randomUUID();
  return await createLoteModel(
    id_lote,
    id_producto,
    codigo_lote,
    fecha_ingreso,
    fecha_caducidad,
    cantidad_inicial
  );
}

export async function getLotesByProductIdService(id_producto: string, id_negocio: string) {
  return await getLotesByProductIdModel(id_producto, id_negocio);
}

export async function getLotesExpiracionService(id_negocio: string) {
  const rows = await getLotesExpiracionModel(id_negocio);

  return rows.map((row) => {
    const vencimiento = calcularClasificacionVencimiento(row.fecha_caducidad);

    return {
      id_lote: row.id_lote,
      id_producto: row.id_producto,
      codigo_lote: row.codigo_lote,
      fecha_ingreso: row.fecha_ingreso,
      fecha_caducidad: row.fecha_caducidad,
      cantidad_inicial: Number(row.cantidad_inicial),
      cantidad_actual: Number(row.cantidad_actual),
      dias_para_caducar: vencimiento.dias_para_caducar,
      clasificacion_vencimiento: vencimiento.clasificacion_vencimiento,
      producto: {
        id_producto: row.id_producto,
        id_negocio: row.id_negocio,
        codigo_barras: row.codigo_barras,
        nombre: row.producto_nombre,
        precio_actual: Number(row.precio_actual),
        stock_minimo_sugerido: Number(row.stock_minimo_sugerido),
        id_categoria: row.id_categoria,
      },
    };
  });
}

export async function getLoteByIdService(id_lote: string, id_negocio: string) {
  return await getLoteByIdModel(id_lote, id_negocio);
}
export async function updateLoteService(
  id_lote: string,
  id_negocio: string,
  codigo_lote: string,
  fecha_ingreso: string,
  fecha_caducidad: string | null,
  cantidad_inicial: number
) {
  return await updateLoteModel(
    id_lote,
    id_negocio,
    codigo_lote,
    fecha_ingreso,
    fecha_caducidad,
    cantidad_inicial
  );
}
export async function deleteLoteService(id_lote: string, id_negocio: string) {
  return await deleteLoteModel(id_lote, id_negocio);
}

export async function createMermaService(
  id_lote: string,
  id_negocio: string,
  cantidad: number,
  motivo: string,
  id_usuario: string
) {
  return await createMermaTransactionModel(id_lote, id_negocio, cantidad, motivo, id_usuario);
}
