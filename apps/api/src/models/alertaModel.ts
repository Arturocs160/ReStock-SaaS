import pool from "../config/db";
import { randomUUID } from "node:crypto";

export const TIPO_ALERTA_STOCK_BAJO = {
  id: "00000000-0000-4000-8000-000000000001",
  nombre: "stock_bajo",
  descripcion: "El stock del producto está por debajo del mínimo establecido.",
};

export async function ensureTipoAlertaStockBajoModel(): Promise<string> {
  const res = await pool.query(
    `
    INSERT INTO public.tipo_alerta (id_tipo_alerta, nombre, descripcion)
    VALUES ($1, $2, $3)
    ON CONFLICT (id_tipo_alerta) DO UPDATE
      SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion
    RETURNING id_tipo_alerta;
    `,
    [TIPO_ALERTA_STOCK_BAJO.id, TIPO_ALERTA_STOCK_BAJO.nombre, TIPO_ALERTA_STOCK_BAJO.descripcion]
  );

  return res.rows[0].id_tipo_alerta;
}

export async function getProductosBajoMinimoModel(id_negocio: string) {
  const res = await pool.query(
    `
    SELECT
      p.id_producto,
      p.nombre,
      p.codigo_barras,
      p.stock_minimo_sugerido,
      COALESCE(SUM(
        l.cantidad_inicial
        - COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0)
        - COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0)
      ), 0)::integer AS stock_actual
    FROM public.producto p
    LEFT JOIN public.lote_inventario l ON l.id_producto = p.id_producto AND l.activo = true
    WHERE p.id_negocio = $1 AND p.activo = true
    GROUP BY p.id_producto, p.nombre, p.codigo_barras, p.stock_minimo_sugerido
    HAVING COALESCE(SUM(
        l.cantidad_inicial
        - COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0)
        - COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0)
      ), 0) < p.stock_minimo_sugerido
    ORDER BY p.nombre ASC;
    `,
    [id_negocio]
  );

  return res.rows;
}

export async function createAlertaIfNotOpenModel(id_producto: string, id_tipo_alerta: string) {
  const id_alerta = randomUUID();

  const res = await pool.query(
    `
    INSERT INTO public.alerta (id_alerta, id_producto, id_tipo_alerta, fecha_emision, resuelta)
    SELECT $1, $2, $3, CURRENT_DATE, false
    WHERE NOT EXISTS (
      SELECT 1 FROM public.alerta
      WHERE id_producto = $2 AND id_tipo_alerta = $3 AND resuelta = false
    )
    RETURNING *;
    `,
    [id_alerta, id_producto, id_tipo_alerta]
  );

  return res.rows[0] || null;
}

export async function getAlertasModel(id_negocio: string) {
  const res = await pool.query(
    `
    SELECT
      a.id_alerta,
      a.id_producto,
      a.id_tipo_alerta,
      a.fecha_emision::text AS fecha_emision,
      a.resuelta,
      p.nombre AS producto_nombre,
      p.codigo_barras,
      p.stock_minimo_sugerido,
      t.nombre AS tipo_alerta,
      t.descripcion AS tipo_alerta_descripcion,
      COALESCE(SUM(
        l.cantidad_inicial
        - COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0)
        - COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0)
      ), 0)::integer AS stock_actual
    FROM public.alerta a
    INNER JOIN public.producto p ON a.id_producto = p.id_producto
    INNER JOIN public.tipo_alerta t ON a.id_tipo_alerta = t.id_tipo_alerta
    LEFT JOIN public.lote_inventario l ON l.id_producto = p.id_producto AND l.activo = true
    WHERE p.id_negocio = $1 AND p.activo = true
    GROUP BY
      a.id_alerta, a.id_producto, a.id_tipo_alerta, a.fecha_emision, a.resuelta,
      p.nombre, p.codigo_barras, p.stock_minimo_sugerido, t.nombre, t.descripcion
    ORDER BY a.resuelta ASC, a.fecha_emision DESC, p.nombre ASC;
    `,
    [id_negocio]
  );

  return res.rows;
}

export async function getAlertasPendientesModel(id_negocio: string) {
  const res = await pool.query(
    `
    SELECT
      a.id_alerta,
      a.id_producto,
      a.id_tipo_alerta,
      a.fecha_emision::text AS fecha_emision,
      a.resuelta,
      p.nombre AS producto_nombre,
      p.codigo_barras,
      p.stock_minimo_sugerido,
      t.nombre AS tipo_alerta,
      t.descripcion AS tipo_alerta_descripcion,
      COALESCE(SUM(
        l.cantidad_inicial
        - COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0)
        - COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0)
      ), 0)::integer AS stock_actual
    FROM public.alerta a
    INNER JOIN public.producto p ON a.id_producto = p.id_producto
    INNER JOIN public.tipo_alerta t ON a.id_tipo_alerta = t.id_tipo_alerta
    LEFT JOIN public.lote_inventario l ON l.id_producto = p.id_producto AND l.activo = true
    WHERE p.id_negocio = $1 AND p.activo = true AND a.resuelta = false
    GROUP BY
      a.id_alerta, a.id_producto, a.id_tipo_alerta, a.fecha_emision, a.resuelta,
      p.nombre, p.codigo_barras, p.stock_minimo_sugerido, t.nombre, t.descripcion
    ORDER BY a.fecha_emision DESC, p.nombre ASC;
    `,
    [id_negocio]
  );

  return res.rows;
}

export async function resolveAlertaModel(id_alerta: string, id_negocio: string) {
  const res = await pool.query(
    `
    UPDATE public.alerta a
    SET resuelta = true
    FROM public.producto p
    WHERE a.id_producto = p.id_producto
      AND p.id_negocio = $2
      AND a.id_alerta = $1
    RETURNING a.*;
    `,
    [id_alerta, id_negocio]
  );

  return res.rows[0] || null;
}
