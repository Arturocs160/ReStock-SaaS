import pool from "../config/db";
import { randomUUID, randomBytes } from "node:crypto";
import { PoolClient } from "pg";
import { ItemOrdenCompraInput } from "../schemas/comprasSchema";

export async function getStockConsolidadoPorProductoModel(id_negocio: string) {
  const res = await pool.query(
    `
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
        WHERE p.id_negocio = $1
          AND p.activo = true
        GROUP BY p.id_producto, p.nombre, p.stock_minimo_sugerido
        ORDER BY p.nombre ASC;
    `,
    [id_negocio]
  );

  return res.rows;
}

function generarCodigoLote(): string {
  const fecha = new Date();
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");

  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(4);
  let aleatorio = "";
  for (let i = 0; i < 4; i++) {
    aleatorio += caracteres[bytes[i] % caracteres.length];
  }

  return `LOTE-${yyyy}${mm}${dd}-${aleatorio}`;
}

async function generarCodigoLoteUnico(client: PoolClient): Promise<string> {
  for (let intento = 0; intento < 5; intento++) {
    const codigo_lote = generarCodigoLote();
    const existeRes = await client.query(
      `SELECT 1 FROM public.lote_inventario WHERE codigo_lote = $1 LIMIT 1;`,
      [codigo_lote]
    );
    if (existeRes.rowCount === 0) {
      return codigo_lote;
    }
  }
  throw new Error("No se pudo generar un código de lote único.");
}

export async function createOrdenCompraTransactionModel(
  id_negocio: string,
  items: ItemOrdenCompraInput[]
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lotes = [];

    for (const item of items) {
      // 1. Verificar que el producto existe, está activo y pertenece al negocio (Multi-tenant)
      const productoRes = await client.query(
        `
        SELECT id_producto, nombre
        FROM public.producto
        WHERE id_producto = $1 AND id_negocio = $2 AND activo = true
        FOR UPDATE;
        `,
        [item.id_producto, id_negocio]
      );

      if (productoRes.rowCount === 0) {
        const error = new Error(
          `El producto con ID ${item.id_producto} no existe, está inactivo o no pertenece a tu negocio.`
        );
        (error as any).statusCode = 404;
        throw error;
      }

      // 2. Crear el lote de inventario por el producto comprado
      const id_lote = randomUUID();
      const codigo_lote = await generarCodigoLoteUnico(client);

      const insertLoteRes = await client.query(
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
        VALUES ($1, $2, $3, CURRENT_DATE, NULL, $4, true)
        RETURNING *;
        `,
        [id_lote, item.id_producto, codigo_lote, item.cantidad]
      );

      lotes.push(insertLoteRes.rows[0]);
    }

    await client.query("COMMIT");
    return lotes;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
