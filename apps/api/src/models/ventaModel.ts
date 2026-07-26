import pool from "../config/db";
import { randomUUID } from "node:crypto";
import { CreateVentaItemInput } from "../schemas/ventaSchema";

export async function createVentaTransactionModel(
  id_negocio: string,
  userid: string,
  items: CreateVentaItemInput[]
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Crear el registro principal de la venta
    const id_venta = randomUUID();
    const insertVentaRes = await client.query(
      `
      INSERT INTO public.venta (id_venta, id_negocio, userid, fecha_transaccion)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
      `,
      [id_venta, id_negocio, userid]
    );

    const venta = insertVentaRes.rows[0];

    // 2. Validar stock e insertar cada detalle
    for (const item of items) {
      const stockQuery = `
        SELECT 
            l.id_lote,
            l.codigo_lote,
            l.cantidad_inicial,
            p.nombre AS producto_nombre,
            (l.cantidad_inicial - 
             COALESCE((SELECT SUM(d.cantidad_sold) FROM public.detalle_va_venta d WHERE d.id_lote = l.id_lote), 0) - 
             COALESCE((SELECT SUM(m.cantidad) FROM public.merma m WHERE m.id_lote = l.id_lote), 0))::integer AS cantidad_actual
        FROM public.lote_inventario l
        INNER JOIN public.producto p ON l.id_producto = p.id_producto
        WHERE l.id_lote = $1 AND p.id_negocio = $2 AND l.activo = true AND p.activo = true
        FOR UPDATE;
      `;

      const stockRes = await client.query(stockQuery, [item.id_lote, id_negocio]);

      if (stockRes.rowCount === 0) {
        throw new Error(
          `El lote con ID ${item.id_lote} no existe, está inactivo o no pertenece a tu negocio.`
        );
      }

      const lote = stockRes.rows[0];

      if (lote.cantidad_actual < item.cantidad_sold) {
        throw new Error(
          `Stock insuficiente para el producto "${lote.producto_nombre}" (Lote: ${lote.codigo_lote}). Disponible: ${lote.cantidad_actual}, solicitado: ${item.cantidad_sold}.`
        );
      }

      // 3. Insertar el detalle de la venta
      const id_detalle = randomUUID();
      await client.query(
        `
        INSERT INTO public.detalle_va_venta (id_detalle, id_venta, id_lote, cantidad_sold, precio_unitario)
        VALUES ($1, $2, $3, $4, $5);
        `,
        [id_detalle, id_venta, item.id_lote, item.cantidad_sold, item.precio_unitario]
      );
    }

    await client.query("COMMIT");

    // Obtener los detalles recién guardados para retornar
    const detailsRes = await client.query(
      `
      SELECT d.*, l.codigo_lote, p.nombre AS producto_nombre 
      FROM public.detalle_va_venta d
      INNER JOIN public.lote_inventario l ON d.id_lote = l.id_lote
      INNER JOIN public.producto p ON l.id_producto = p.id_producto
      WHERE d.id_venta = $1;
      `,
      [id_venta]
    );

    return {
      ...venta,
      items: detailsRes.rows,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
