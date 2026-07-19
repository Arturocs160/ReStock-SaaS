import { randomUUID } from "node:crypto";
import pool from "@/config/db";
import logger from "@/utils/logger";
import { User } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { signInSchema } from "@/schemas/authSchema";
import { verifyPassword } from "@/utils/password";

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

export const beforeAuthMiddleware = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-in/email") {
    const body = ctx.body as any;

    // 1. Validar el formato del correo y contraseña.
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue: any) => ({
        message: issue.message,
      }));
      return new Response(
        JSON.stringify({
          error: "Datos invalidos",
          message: "Datos invalidos",
          details: errorMessages,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password } = parsed.data;

    // 2. Consultar el usuario y su hash en la base de datos.
    const userResult = await pool.query(
      `SELECT u.id, u.id_negocio, u.role, a.password AS password_hash
       FROM public."user" u
       LEFT JOIN public.account a ON a."userId" = u.id
       WHERE u.email = $1
       LIMIT 1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return new Response(
        JSON.stringify({
          error: "UNAUTHORIZED",
          message: "Correo o contraseña incorrectos"
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = userResult.rows[0];

    // 3. Si el usuario existe pero la contraseña es incorrecta, retornar 401
    if (!user.password_hash) {
      return new Response(
        JSON.stringify({
          error: "UNAUTHORIZED",
          message: "Correo o contraseña incorrectos"
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isPasswordValid = await verifyPassword({
      password,
      hash: user.password_hash,
    });

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          error: "UNAUTHORIZED",
          message: "Correo o contraseña incorrectos"
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. Si el usuario no tiene id_negocio asignado, retornar 403 Forbidden
    if (!user.id_negocio) {
      return new Response(
        JSON.stringify({
          error: "NO_TENANT_ASSIGNED",
          message: "El usuario no tiene un negocio asignado.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 5. Si el negocio del usuario no está activo, retornar 403 Forbidden
    const negocioResult = await pool.query(
      `SELECT activo FROM public.negocio WHERE id_negocio = $1`,
      [user.id_negocio]
    );

    if (negocioResult.rows.length === 0 || negocioResult.rows[0].activo === false) {
      return new Response(
        JSON.stringify({
          error: "TENANT_INACTIVE",
          message: "El entorno o negocio al que pertenece se encuentra desactivado.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
});
