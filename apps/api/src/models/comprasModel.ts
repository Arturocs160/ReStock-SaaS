import pool from "../config/db";

const STOCK_CONSOLIDADO_SELECT = `
        SELECT
            p.id_producto,
            p.nombre,
            p.stock_minimo_sugerido,
            COALESCE(SUM(
                l.cantidad_inicial -
                COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0)
            ), 0)::integer AS stock_actual,
            COALESCE((
                SELECT SUM(d.cantidad_sold)
                FROM public.detalle_va_venta d
                INNER JOIN public.lote_inventario l2 ON d.id_lote = l2.id_lote
                INNER JOIN public.venta v ON d.id_venta = v.id_venta
                WHERE l2.id_producto = p.id_producto
                  AND v.fecha_transaccion >= NOW() - INTERVAL '7 days'
            ), 0)::integer AS ventas_ultimos_7_dias
        FROM public.producto p
        LEFT JOIN public.lote_inventario l
            ON l.id_producto = p.id_producto
            AND l.activo = true
`;

export async function getStockConsolidadoPorProductoModel(id_negocio: string) {
  const res = await pool.query(
    `
        ${STOCK_CONSOLIDADO_SELECT}
        WHERE p.id_negocio = $1
          AND p.activo = true
        GROUP BY p.id_producto, p.nombre, p.stock_minimo_sugerido
        ORDER BY p.nombre ASC;
    `,
    [id_negocio]
  );

  return res.rows;
}

export async function getProductosReabastecimientoPorIdsModel(
  id_negocio: string,
  ids_producto: string[]
) {
  const res = await pool.query(
    `
        ${STOCK_CONSOLIDADO_SELECT}
        WHERE p.id_negocio = $1
          AND p.activo = true
          AND p.id_producto = ANY($2::uuid[])
        GROUP BY p.id_producto, p.nombre, p.stock_minimo_sugerido
        ORDER BY p.nombre ASC;
    `,
    [id_negocio, ids_producto]
  );

  return res.rows;
}
