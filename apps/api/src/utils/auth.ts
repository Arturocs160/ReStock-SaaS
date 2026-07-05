import { betterAuth } from "better-auth";
import pool from "@/config/db";
import { jwt } from "better-auth/plugins";
import { redisStorage } from "@better-auth/redis-storage";
import { Redis } from "ioredis";
import { hashPassword, verifyPassword } from "./password";
import { randomUUID } from "node:crypto";
import logger from "./logger";

import "dotenv/config";

const redisClient = new Redis(process.env.REDIS_URL as string);

export const auth = betterAuth({
  database: pool,
  secondaryStorage: redisStorage({
    client: redisClient,
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        return await hashPassword(password);
      },
      verify: async ({ password, hash }) => {
        return await verifyPassword({ password, hash });
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "admin",
      },
      id_usuario_creador: {
        type: "string",
        required: false,
      },
      id_negocio: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
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
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
      strategy: "jwt",
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 60,
    customRules: {
      "/api/auth/sign-in/email": {
        window: 60,
        max: 5,
      },
      "/api/auth/sign-up/email": {
        window: 60,
        max: 5,
      },
      "/api/auth/request-password-reset": {
        window: 60,
        max: 5,
      },
      "/api/auth/change-password": {
        window: 60,
        max: 5,
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        expiresIn: "15m",
        definePayload: ({ user }) => {
          return {
            id: user.id,
            email: user.email,
          };
        },
      },
    }),
  ],
  trustedOrigins: ["http://localhost:3000", process.env.FRONTEND_URL as string],
});
