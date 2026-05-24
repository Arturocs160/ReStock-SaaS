# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api ./apps/api

RUN npm install -g pnpm@11.2.2 && \
    pnpm install --frozen-lockfile

# Build
WORKDIR /app/apps/api
RUN pnpm run build

# Production
FROM node:24-alpine AS production

WORKDIR /app/apps/api

COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules

# Environment variables
ENV NODE_ENV=production
EXPOSE 3010

CMD ["node", "dist/index.js"]

# Development
FROM node:24-alpine AS development

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api ./apps/api

RUN npm install -g pnpm@11.2.2 && \
    pnpm install

WORKDIR /app/apps/api

ENV NODE_ENV=development
EXPOSE 3010

CMD ["pnpm", "run", "dev"]
