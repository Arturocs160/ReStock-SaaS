import {
  getStockConsolidadoPorProductoModel,
  createOrdenCompraTransactionModel,
} from "../models/comprasModel";
import { ItemOrdenCompraInput } from "../schemas/comprasSchema";

const MULTIPLO_REABASTECIMIENTO = 5;

export async function getSugerenciasReabastecimientoService(id_negocio: string) {
  const productos = await getStockConsolidadoPorProductoModel(id_negocio);

  return productos
    .filter((producto: any) => producto.stock_actual < producto.stock_minimo_sugerido)
    .map((producto: any) => {
      const deficit = producto.stock_minimo_sugerido - producto.stock_actual;
      const baseReabastecimiento = Math.max(deficit, producto.ventas_ultimos_7_dias);
      return {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        stock_actual: producto.stock_actual,
        stock_minimo_sugerido: producto.stock_minimo_sugerido,
        ventas_ultimos_7_dias: producto.ventas_ultimos_7_dias,
        deficit,
        cantidad_sugerida:
          Math.ceil(baseReabastecimiento / MULTIPLO_REABASTECIMIENTO) * MULTIPLO_REABASTECIMIENTO,
      };
    });
}

export async function createOrdenCompraService(id_negocio: string, items: ItemOrdenCompraInput[]) {
  return await createOrdenCompraTransactionModel(id_negocio, items);
}
