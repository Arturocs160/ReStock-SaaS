import { randomUUID } from "node:crypto";
import pool from "@/config/db";
import logger from "@/utils/logger";
import { User } from "better-auth";

export async function handleUserCreation(user: User, context: any): Promise<void> {
  if (!context || !context.request) return;

  const body = (await context.request.json().catch(() => ({}))) as { nombre?: string };

  const nombreNegocio = body?.nombre || `Negocio de ${user.name}`;

  const subdominio = nombreNegocio
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  const idNegocio = randomUUID();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertNegocioQuery = `
            INSERT INTO public.negocio (id_negocio, nombre, subdominio, activo)
            VALUES ($1, $2, $3, $4);
        `;
    await client.query(insertNegocioQuery, [idNegocio, nombreNegocio, subdominio, true]);

    const updateUserQuery = `
            UPDATE public.user
            SET id_negocio = $1, role = 'admin'
            WHERE id = $2;
        `;
    await client.query(updateUserQuery, [idNegocio, user.id]);

    await client.query("COMMIT");
  } catch (error) {
    logger.error("Error en la transacción de registro automatizado:" + error);

    throw new Error("No se pudo completar el registro del negocio.");
  } finally {
    client.release();
  }
}
