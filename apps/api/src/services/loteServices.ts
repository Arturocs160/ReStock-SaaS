import { randomUUID } from "node:crypto";
import {
  createLoteModel,
  deleteLoteModel,
  getLoteByIdModel,
  getLotesByProductIdModel,
  updateLoteModel,
  createMermaTransactionModel,
} from "../models/loteModel";

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
