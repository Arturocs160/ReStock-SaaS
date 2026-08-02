import { randomUUID } from "node:crypto";
import {
  createProductModel,
  deleteProductModel,
  getAllProductsServiceByTenantIdModel,
  getProductByBarCodeModel,
  getProductsByIdModel,
  getProductsPaginationModel,
  updateProductModel,
  getAllCategoriesModel,
  getPosCatalogModel,
} from "../models/productsModels";

export async function getAllProductsServiceByTenantId(id_negocio: string) {
  const products = await getAllProductsServiceByTenantIdModel(id_negocio);
  return products;
}

export async function getProductsPaginationService(
  id_negocio: string,
  page: number,
  limit: number
) {
  const products = await getProductsPaginationModel(id_negocio, page, limit);
  return products;
}

export async function getProductsByIdService(id_negocio: string, id_producto: string) {
  const product = await getProductsByIdModel(id_negocio, id_producto);
  return product;
}

export async function getProductByBarCodeService(id_negocio: string, codigo_barras: string) {
  const product = await getProductByBarCodeModel(id_negocio, codigo_barras);
  return product;
}

export async function createProductService(data: {
  id_negocio: string;
  codigo_barras: string | null;
  nombre: string;
  precio_actual: number;
  stock_minimo_sugerido: number;
  id_categoria?: string | null;
}) {
  const { id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido, id_categoria } =
    data;
  const id_producto = randomUUID();
  const product = await createProductModel(
    id_producto,
    id_negocio,
    codigo_barras,
    nombre,
    precio_actual,
    stock_minimo_sugerido,
    id_categoria
  );
  return product;
}

export async function updateProductService(data: {
  id_producto: string;
  id_negocio: string;
  codigo_barras: string | null;
  nombre: string;
  precio_actual: number;
  stock_minimo_sugerido: number;
  id_categoria?: string | null;
}) {
  const {
    id_producto,
    id_negocio,
    codigo_barras,
    nombre,
    precio_actual,
    stock_minimo_sugerido,
    id_categoria,
  } = data;
  const product = await updateProductModel(
    id_producto,
    id_negocio,
    codigo_barras,
    nombre,
    precio_actual,
    stock_minimo_sugerido,
    id_categoria
  );
  return product;
}

export async function deleteProductService(id_producto: string, id_negocio: string) {
  const product = await deleteProductModel(id_producto, id_negocio);
  return product;
}

export async function getAllCategoriesService(id_negocio: string) {
  return await getAllCategoriesModel(id_negocio);
}

export async function getPosCatalogService(id_negocio: string) {
  const rows = await getPosCatalogModel(id_negocio);
  const productsMap = new Map<string, any>();

  for (const row of rows) {
    if (!productsMap.has(row.id_producto)) {
      productsMap.set(row.id_producto, {
        id_producto: row.id_producto,
        id_negocio: row.id_negocio,
        codigo_barras: row.codigo_barras,
        nombre: row.producto_nombre,
        precio_actual: row.precio_actual,
        stock_minimo_sugerido: row.stock_minimo_sugerido,
        activo: row.producto_activo,
        id_categoria: row.id_categoria,
        categoria: row.categoria || "General",
        stock_actual: 0,
        lotes: [],
      });
    }

    if (row.id_lote) {
      const cantidad_actual = Number(row.cantidad_actual);
      productsMap.get(row.id_producto).lotes.push({
        id_lote: row.id_lote,
        id_producto: row.id_producto,
        codigo_lote: row.codigo_lote,
        fecha_ingreso: row.fecha_ingreso,
        fecha_caducidad: row.fecha_caducidad,
        cantidad_inicial: row.cantidad_inicial,
        cantidad_actual,
        activo: row.lote_activo,
      });
      productsMap.get(row.id_producto).stock_actual += cantidad_actual;
    }
  }

  return Array.from(productsMap.values());
}
