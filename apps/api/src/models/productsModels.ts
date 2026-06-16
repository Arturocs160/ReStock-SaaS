import pool from "../config/db";

export async function createProductModel(
    id_producto: string,
    id_negocio: string,
    codigo_barras: string,
    nombre: string,
    precio_actual: number,
    stock_minimo_sugerido: number
) {
    const res = await pool.query(`
        INSERT INTO public.producto (
            id_producto, 
            id_negocio, 
            codigo_barras, 
            nombre, 
            precio_actual, 
            stock_minimo_sugerido,
            activo
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, true) 
        RETURNING *;
    `, [id_producto, id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido]);

    return res.rows[0];
}

export async function getAllProductsServiceByTenantIdModel(id_negocio: string) {
    const res = await pool.query(`
        SELECT * FROM public.producto 
        WHERE id_negocio = $1 AND activo = true
        ORDER BY nombre ASC
    `, [id_negocio]);

    return res.rows;
}

export async function getProductsPaginationModel(id_negocio: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const res = await pool.query(`
        SELECT * FROM public.producto 
        WHERE id_negocio = $1 AND activo = true 
        ORDER BY nombre ASC
        LIMIT $2 OFFSET $3
    `, [id_negocio, limit, offset]);

    return res.rows;
}

export async function getProductsByIdModel(id_negocio: string, id_producto: string) {
    const res = await pool.query(`
        SELECT * FROM public.producto 
        WHERE id_negocio = $1 AND id_producto = $2 AND activo = true
    `, [id_negocio, id_producto]);

    return res.rows[0] || null;
}

export async function getProductByBarCodeModel(id_negocio: string, codigo_barras: string) {
    const res = await pool.query(`
        SELECT * FROM public.producto 
        WHERE id_negocio = $1 AND codigo_barras = $2 AND activo = true
    `, [id_negocio, codigo_barras]);

    return res.rows[0] || null;
}

export async function updateProductModel(
    id_producto: string,
    id_negocio: string,
    codigo_barras: string,
    nombre: string,
    precio_actual: number,
    stock_minimo_sugerido: number
) {
    const res = await pool.query(`
        UPDATE public.producto SET 
            codigo_barras = $3,
            nombre = $4,
            precio_actual = $5,
            stock_minimo_sugerido = $6
        WHERE id_producto = $1 AND id_negocio = $2 AND activo = true
        RETURNING *;
    `, [id_producto, id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido]);

    return res.rows[0] || null;
}

export async function deleteProductModel(id_producto: string, id_negocio: string) {
    const res = await pool.query(`
        UPDATE public.producto 
        SET activo = false 
        WHERE id_producto = $1 AND id_negocio = $2 AND activo = true
    `, [id_producto, id_negocio]);

    return res.rowCount;
}