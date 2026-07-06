import { betterAuth } from "better-auth";
import pool from "@/config/db";
import { jwt, emailOTP } from "better-auth/plugins";
import { redisStorage } from "@better-auth/redis-storage";
import redisClient from "@/config/redis";
import { hashPassword, verifyPassword } from "./password";
import { sendVerificationOTP } from "@/services/mailService";
import { handleUserCreation } from "@/services/authHooks";

import "dotenv/config";

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
