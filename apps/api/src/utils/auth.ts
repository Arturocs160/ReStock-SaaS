import { betterAuth } from "better-auth";
import pool from "@/config/db";
import { jwt, emailOTP } from "better-auth/plugins";
import { redisStorage } from "@better-auth/redis-storage";
import redisClient from "@/config/redis";
import { hashPassword, verifyPassword } from "./password";
import { sendVerificationOTP } from "@/services/mailService";
import { handleUserCreation, beforeAuthMiddleware } from "@/services/authHooks";

import "dotenv/config";

export const auth = betterAuth({
  database: pool,
  secondaryStorage: redisStorage({
    client: redisClient,
  }),
  hooks: {
    before: beforeAuthMiddleware,
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
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
      sendVerificationOTP,
    }),
  ],
  trustedOrigins: [
    process.env.FRONTEND_URL as string
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.NODE_ENV === "development" ? "localhost" : "restock.website",
    }
  }
});
