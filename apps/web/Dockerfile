# Base de todo
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web ./apps/web

# Desarrollo
FROM base AS development
WORKDIR /app/apps/web
RUN npm install
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]


# Construcción de producción
FROM base AS build-stage
WORKDIR /app/apps/web
RUN npm install --frozen-lockfile
RUN npm run build
RUN npm prune --prod

# Produccion
FROM node:24-alpine AS production
WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1 

# Copiamos la estructura necesaria desde 'build-stage'
COPY --from=build-stage /app/apps/web/package.json ./
COPY --from=build-stage /app/apps/web/public ./public
COPY --from=build-stage /app/apps/web/.next ./.next
COPY --from=build-stage /app/apps/web/node_modules ./node_modules

# Seguridad: Ejecutar como usuario sin privilegios
USER node

EXPOSE 3000
CMD ["npm", "start"]