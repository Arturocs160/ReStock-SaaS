# Base de todo
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api ./apps/api

# Desarrollo
FROM base AS development
WORKDIR /app/apps/api
RUN npm install
ENV NODE_ENV=development
EXPOSE 3010
CMD ["npm", "run", "dev"]

# Construcción de producción
FROM base AS build-stage
WORKDIR /app/apps/api
RUN npm install --frozen-lockfile
RUN npm run build
RUN npm prune --prod

# Produccion
FROM node:24-alpine AS production
WORKDIR /app/apps/api

# Copiamos desde 'build-stage' para romper el ciclo
COPY --from=build-stage /app/apps/api/package.json ./
COPY --from=build-stage /app/apps/api/dist ./dist
COPY --from=build-stage /app/apps/api/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3010
# Seguridad: Ejecutar como usuario sin privilegios
USER node

CMD ["node", "dist/index.js"]