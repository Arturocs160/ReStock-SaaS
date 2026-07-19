import { createVentaTransactionModel } from "../models/ventaModel";
import { CreateVentaInput } from "../schemas/ventaSchema";

export async function createVentaService(
  id_negocio: string,
  userid: string,
  data: CreateVentaInput
) {
  return await createVentaTransactionModel(id_negocio, userid, data.items);
}
