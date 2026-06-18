import pool from "../config/db";

export async function createProductModel(
    id_producto: string,
    id_negocio: string,
    codigo_barras: string | null,
    nombre: string,
    precio_actual: number,
    stock_minimo_sugerido: number,
    id_categoria?: string | null
) {
    const res = await pool.query(`
        INSERT INTO public.producto (
            id_producto, 
            id_negocio, 
            codigo_barras, 
            nombre, 
            precio_actual, 
            stock_minimo_sugerido,
            id_categoria,
            activo
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, true) 
        RETURNING *;
    `, [id_producto, id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido, id_categoria || null]);

    return res.rows[0];
}

export async function getAllProductsServiceByTenantIdModel(id_negocio: string) {
    const res = await pool.query(`
        SELECT p.*, c.nombre AS categoria 
        FROM public.producto p
        LEFT JOIN public.categoria c ON p.id_categoria = c.id_categoria
        WHERE p.id_negocio = $1 AND p.activo = true
        ORDER BY p.nombre ASC;
    `, [id_negocio]);

    return res.rows;
}

export async function getProductsPaginationModel(id_negocio: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const res = await pool.query(`
        SELECT p.*, c.nombre AS categoria 
        FROM public.producto p
        LEFT JOIN public.categoria c ON p.id_categoria = c.id_categoria
        WHERE p.id_negocio = $1 AND p.activo = true 
        ORDER BY p.nombre ASC
        LIMIT $2 OFFSET $3;
    `, [id_negocio, limit, offset]);

    return res.rows;
}

export async function getProductsByIdModel(id_negocio: string, id_producto: string) {
    const res = await pool.query(`
        SELECT p.*, c.nombre AS categoria 
        FROM public.producto p
        LEFT JOIN public.categoria c ON p.id_categoria = c.id_categoria
        WHERE p.id_negocio = $1 AND p.id_producto = $2 AND p.activo = true;
    `, [id_negocio, id_producto]);

    return res.rows[0] || null;
}

export async function getProductByBarCodeModel(id_negocio: string, codigo_barras: string) {
    const res = await pool.query(`
        SELECT p.*, c.nombre AS categoria 
        FROM public.producto p
        LEFT JOIN public.categoria c ON p.id_categoria = c.id_categoria
        WHERE p.id_negocio = $1 AND p.codigo_barras = $2 AND p.activo = true;
    `, [id_negocio, codigo_barras]);

    return res.rows[0] || null;
}

export async function updateProductModel(
    id_producto: string,
    id_negocio: string,
    codigo_barras: string | null,
    nombre: string,
    precio_actual: number,
    stock_minimo_sugerido: number,
    id_categoria?: string | null
) {
    const res = await pool.query(`
        UPDATE public.producto SET 
            codigo_barras = $3,
            nombre = $4,
            precio_actual = $5,
            stock_minimo_sugerido = $6,
            id_categoria = $7
        WHERE id_producto = $1 AND id_negocio = $2 AND activo = true
        RETURNING *;
    `, [id_producto, id_negocio, codigo_barras, nombre, precio_actual, stock_minimo_sugerido, id_categoria || null]);

    return res.rows[0] || null;
}

export async function deleteProductModel(id_producto: string, id_negocio: string) {
    const res = await pool.query(`
        UPDATE public.producto 
        SET activo = false 
        WHERE id_producto = $1 AND id_negocio = $2 AND activo = true;
    `, [id_producto, id_negocio]);

    return res.rowCount;
}

export async function getAllCategoriesModel(id_negocio: string) {
    const res = await pool.query(`
        SELECT * FROM public.categoria 
        WHERE id_negocio = $1 AND activo = true
        ORDER BY nombre ASC;
    `, [id_negocio]);

    return res.rows;
}