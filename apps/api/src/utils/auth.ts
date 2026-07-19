import { betterAuth } from "better-auth";
import pool from "@/config/db";
import { jwt, emailOTP } from "better-auth/plugins";
import { redisStorage } from "@better-auth/redis-storage";
import redisClient from "@/config/redis";
import { hashPassword, verifyPassword } from "./password";
import { sendVerificationOTP } from "@/services/mailService";
import { handleUserCreation } from "@/services/authHooks";
import { createAuthMiddleware } from "better-auth/api";
import { signInSchema } from "@/schemas/authSchema";

import "dotenv/config";

export const auth = betterAuth({
  database: pool,
  secondaryStorage: redisStorage({
    client: redisClient,
  }),
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
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
    }),
  },
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
        after: handleUserCreation,
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
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendVerificationOTP({ email, otp, type });
      },
    }),
  ],
  trustedOrigins: ["http://localhost:3000", process.env.FRONTEND_URL as string],
});
