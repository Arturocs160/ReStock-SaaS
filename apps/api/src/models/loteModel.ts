import pool from "../config/db";
import { randomUUID } from "node:crypto";
import logger from "../utils/logger";

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
        SELECT l.*,
            (l.cantidad_inicial - 
             COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0) - 
             COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0))::integer AS cantidad_actual
        FROM public.lote_inventario l
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
        SELECT l.*,
            (l.cantidad_inicial - 
             COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0) - 
             COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0))::integer AS cantidad_actual
        FROM public.lote_inventario l
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

export async function createMermaTransactionModel(
  id_lote: string,
  id_negocio: string,
  cantidad: number,
  motivo: string,
  id_usuario: string
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Obtener lote locked FOR UPDATE y verificar negocio
    const loteRes = await client.query(
      `
      SELECT l.*, p.id_negocio, p.nombre AS producto_nombre,
          (l.cantidad_inicial - 
           COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0) - 
           COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0))::integer AS cantidad_actual
      FROM public.lote_inventario l
      INNER JOIN public.producto p ON l.id_producto = p.id_producto
      WHERE l.id_lote = $1 AND l.activo = true AND p.activo = true
      FOR UPDATE;
      `,
      [id_lote]
    );

    if (loteRes.rowCount === 0) {
      const error = new Error(
        "El lote no existe o está inactivo o no pertenece a un producto activo."
      );
      (error as any).statusCode = 404;
      throw error;
    }

    const lote = loteRes.rows[0];

    // Verificar tenant isolation (Seguridad Multi-tenant)
    if (lote.id_negocio !== id_negocio) {
      const error = new Error("No tienes permisos para acceder a este lote.");
      (error as any).statusCode = 403;
      throw error;
    }

    // Validar stock disponible
    if (cantidad <= 0 || cantidad > lote.cantidad_actual) {
      const error = new Error("Cantidad de merma inválida o supera el stock disponible.");
      (error as any).statusCode = 400;
      throw error;
    }

    // 2. Insertar merma
    const id_merma = randomUUID();
    const insertMermaRes = await client.query(
      `
      INSERT INTO public.merma (id_merma, id_lote, id_producto, cantidad, motivo, id_usuario, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
      `,
      [id_merma, id_lote, lote.id_producto, cantidad, motivo, id_usuario]
    );

    const newCantidadActual = lote.cantidad_actual - cantidad;

    // 3. Bitácora si cantidad_actual llega a 0
    if (newCantidadActual === 0) {
      logger.warn(
        { id_lote, codigo_lote: lote.codigo_lote, id_producto: lote.id_producto },
        "El lote ha quedado sin existencias (cantidad_actual = 0) debido a un reporte de merma."
      );
    }

    await client.query("COMMIT");
    return insertMermaRes.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
