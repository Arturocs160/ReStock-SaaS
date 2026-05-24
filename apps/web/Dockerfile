# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web ./apps/web

RUN npm install -g pnpm@11.2.2 && \
    pnpm install --frozen-lockfile

# Build Next.js
WORKDIR /app/apps/web
RUN pnpm run build

# Production
FROM node:24-alpine AS production

WORKDIR /app/apps/web

COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]


# Development
FROM node:24-alpine AS development

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web ./apps/web

RUN npm install -g pnpm@11.2.2 && \
    pnpm install

WORKDIR /app/apps/web

ENV NODE_ENV=development
EXPOSE 3000

CMD ["pnpm", "run", "dev"]
