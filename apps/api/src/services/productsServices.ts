import { randomUUID } from "node:crypto";
import { createProductModel, deleteProductModel, getAllProductsServiceByTenantIdModel, getProductByBarCodeModel, getProductsByIdModel, getProductsPaginationModel, updateProductModel } from "../models/productsModels";

export async function getAllProductsServiceByTenantId(id_negocio: string) {
    const products = await getAllProductsServiceByTenantIdModel(id_negocio);
    return products;
}

export async function getProductsPaginationService(id_negocio: string, page: number, limit: number) {
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

export async function createProductService(data: { id_negocio: string, codigo_barras: string, nombre: string, precio_actual: number, stock_minimo_sugerido: number }) {
    const { id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido } = data;
    const id_producto = randomUUID();
    const product = await createProductModel(id_producto, id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido);
    return product;
}

export async function updateProductService(data: { id_producto: string, id_negocio: string, codigo_barras: string, nombre: string, precio_actual: number, stock_minimo_sugerido: number }) {
    const { id_producto, id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido } = data;
    const product = await updateProductModel(id_producto, id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido);
    return product;
}

export async function deleteProductService(id_producto: string, id_negocio: string) {
    const product = await deleteProductModel(id_producto, id_negocio);
    return product;
}
