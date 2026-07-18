import pool from "../config/db";

export async function createLoteModel(
  id_lote: string,
  id_producto: string,
  codigo_lote: string,
  fecha_ingreso: string, // YYYY-MM-DD
  fecha_caducidad: string | null,
  cantidad_inicial: number
) {
  const res = await pool.query(
    `
        INSERT INTO public.lote_inventario (
            id_lote, 
            id_producto, 
            codigo_lote, 
            fecha_ingreso, 
            fecha_caducidad, 
            cantidad_inicial,
            activo
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, true) 
        RETURNING *;
    `,
    [id_lote, id_producto, codigo_lote, fecha_ingreso, fecha_caducidad, cantidad_inicial]
  );

  return res.rows[0];
}

export async function getLotesByProductIdModel(id_producto: string, id_negocio: string) {
  const res = await pool.query(
    `
        SELECT l.* FROM public.lote_inventario l
        INNER JOIN public.producto p ON l.id_producto = p.id_producto
        WHERE l.id_producto = $1 
          AND p.id_negocio = $2 
          AND p.activo = true 
          AND l.activo = true
        ORDER BY l.fecha_ingreso DESC;
    `,
    [id_producto, id_negocio]
  );

  return res.rows;
}

export async function getLoteByIdModel(id_lote: string, id_negocio: string) {
  const res = await pool.query(
    `
        SELECT l.* FROM public.lote_inventario l
        INNER JOIN public.producto p ON l.id_producto = p.id_producto
        WHERE l.id_lote = $1 
          AND p.id_negocio = $2 
          AND p.activo = true 
          AND l.activo = true;
    `,
    [id_lote, id_negocio]
  );

  return res.rows[0] || null;
}

export async function updateLoteModel(
  id_lote: string,
  id_negocio: string,
  codigo_lote: string,
  fecha_ingreso: string,
  fecha_caducidad: string | null,
  cantidad_inicial: number
) {
  const res = await pool.query(
    `
        UPDATE public.lote_inventario SET 
            codigo_lote = $3,
            fecha_ingreso = $4,
            fecha_caducidad = $5,
            cantidad_inicial = $6
        WHERE id_lote = $1 
          AND activo = true
          AND id_producto IN (
              SELECT id_producto FROM public.producto WHERE id_negocio = $2 AND activo = true
          )
        RETURNING *;
    `,
    [id_lote, id_negocio, codigo_lote, fecha_ingreso, fecha_caducidad, cantidad_inicial]
  );

  return res.rows[0] || null;
}

export async function deleteLoteModel(id_lote: string, id_negocio: string) {
  const res = await pool.query(
    `
        UPDATE public.lote_inventario 
        SET activo = false
        WHERE id_lote = $1 
          AND activo = true
          AND id_producto IN (
              SELECT id_producto FROM public.producto WHERE id_negocio = $2 AND activo = true
          );
    `,
    [id_lote, id_negocio]
  );

  return res.rowCount;
}
