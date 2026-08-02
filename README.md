# ReStock-SaaS

Sistema inteligente de gestión de inventario para pequeños negocios.

## Descripción

Los establecimientos pequeños, como tiendas de abarrotes, farmacias, etc., tienen dificultad para llevar una gestión adecuada de sus inventarios, en especial en el reabastecimiento de productos. Suelen lidiar con problemas relacionados con fechas de caducidad y compras insuficientes, provocando pérdidas económicas significativas.

ReStock-SaaS es una solución integral que resuelve estos problemas proporcionando:

- Control de inventario por lotes
- Gestión de fechas de caducidad
- Análisis de patrones de consumo
- Alertas preventivas de reabastecimiento
- Recomendaciones automáticas de compra

## Stack Tecnológico

| Componente                         | Tecnología                                              |
| ---------------------------------- | ------------------------------------------------------- |
| **Frontend**                       | React, Next.js, Tailwind CSS, Zustand                   |
| **Backend**                        | Node.js, Express, TypeScript, Zod                       |
| **Base de Datos & Almacenamiento** | PostgreSQL (Supabase), Redis                            |
| **Autenticación**                  | better-auth (Cookies seguras HTTP-Only, RBAC)           |
| **Infraestructura & DevOps**       | Docker, Vercel, Cloudflare                              |
| **Pruebas (Testing)**              | Jest (Unitarias/Integración), Cypress (E2E), K6 (Carga) |
| **CI/CD**                          | GitHub Actions                                          |

## Instalación y Ejecución

### Requisitos Previos

- **Git**
- **Node.js 24+** y **npm** (para ejecución local y hooks de commits)
- **Docker y Docker Compose** (para ejecución mediante contenedores, recomendado)
- **PostgreSQL 18+** y **Redis** (solo si se prefiere ejecución local nativa sin contenedores)

---

### Opción 1: Docker (Recomendado para Desarrollo Rápido)

Esta opción es la más sencilla y recomendada, ya que levanta todos los servicios (frontend, backend, base de datos e in-memory store) con soporte para recarga en vivo (hot-reload) e inicializa la base de datos automáticamente mediante el archivo `init.sql`.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Arturocs160/ReStock-SaaS.git
   cd ReStock-SaaS
   ```

2. **Configurar el archivo de entorno raíz:**
   Copia el archivo de ejemplo de la raíz a `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Este archivo define la contraseña de desarrollo de la base de datos `DATABASE_PASSWORD_DEV`, requerida por `docker-compose.dev.yml`)*.

3. **Configurar variables de entorno de las aplicaciones:**
   Dado que los archivos `.env` reales están en `.gitignore`, copia los archivos `.env.example` provistos para habilitar el enlace interno en Docker:
   - **Backend:** Copia [apps/api/.env.example](./apps/api/.env.example) a `apps/api/.env.development`:
     ```bash
     cp apps/api/.env.example apps/api/.env.development
     ```
     *(Por defecto ya viene configurado para conectarse con los contenedores `postgres` y `redis`)*:
     ```env
     FRONTEND_URL=http://localhost:3000
     DATABASE_URL=postgresql://postgres:examplePassword@postgres:5432/postgres
     BETTER_AUTH_SECRET=MopgvE2RRzk5IGFld8n2FxulVAbMfphi # Generar con: openssl rand -base64 32
     BETTER_AUTH_URL=http://localhost:3010
     RESEND_API_KEY=tu_api_key_de_resend
     REDIS_URL=redis://redis:6379
     ```
   - **Frontend:** Copia [apps/web/.env.example](./apps/web/.env.example) a `apps/web/.env.development`:
     ```bash
     cp apps/web/.env.example apps/web/.env.development
     ```
     *(Por defecto ya viene configurado para conectarse con la API REST)*:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3010
     ```

4. **Levantar el entorno de desarrollo:**
   Ejecuta Docker Compose indicando el archivo de desarrollo para compilar e iniciar los contenedores:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

5. **Acceso a los servicios:**
   - **Frontend (Interfaz Web):** [http://localhost:3000](http://localhost:3000)
   - **Backend (API REST):** [http://localhost:3010](http://localhost:3010) (Verificar estado en: [http://localhost:3010/health](http://localhost:3010/health))
   - **Base de datos (PostgreSQL):** Conexión en `localhost:5432` (Usuario: `postgres`, Contraseña: la definida en `.env` (ej. `examplePassword`), BD: `postgres`)
   - **Redis (Caché):** Conexión en `localhost:6379`

---

### Opción 2: Instalación Local (Directamente en la Máquina Host)

Si deseas levantar únicamente las bases de datos en contenedores Docker y ejecutar las aplicaciones de Node.js y Next.js de manera nativa:

1. **Instalar dependencias y activar Git Hooks (Husky):**
   Desde la raíz del proyecto, instala para configurar commitlint y hooks:
   ```bash
   npm install
   ```

2. **Instalar dependencias de cada aplicación:**
   ```bash
   # Instalar dependencias del backend
   cd apps/api && npm install
   
   # Instalar dependencias del frontend
   cd ../web && npm install
   
   # Regresar a la raíz
   cd ../..
   ```

3. **Iniciar Base de Datos y Redis usando Docker:**
   Puedes iniciar solo los contenedores de PostgreSQL y Redis utilizando la configuración de desarrollo:
   ```bash
   docker compose -f docker-compose.dev.yml up -d postgres redis
   ```
   *Esto inicializará automáticamente el esquema de tablas usando el archivo [init.sql](./init.sql) en el puerto `5432` y levantará Redis en el `6379` de localhost.*

4. **Configurar las variables de entorno locales:**
   Como la API correrá de forma nativa en tu máquina host (fuera de la red virtual de Docker), debes crear el archivo de entorno y configurarlo para apuntar a `localhost` en lugar de a los alias internos de Docker (`postgres` y `redis`).

   - **Backend (`apps/api/.env.development`):**
     Copia el archivo de ejemplo:
     ```bash
     cp apps/api/.env.example apps/api/.env.development
     ```
     Y edítalo en [apps/api/.env.development](./apps/api/.env.development) para usar las rutas locales en localhost:
     ```env
     FRONTEND_URL=http://localhost:3000
     DATABASE_URL=postgresql://postgres:examplePassword@localhost:5432/postgres
     BETTER_AUTH_SECRET=MopgvE2RRzk5IGFld8n2FxulVAbMfphi # Generar con: openssl rand -base64 32
     BETTER_AUTH_URL=http://localhost:3010
     RESEND_API_KEY=tu_api_key_de_resend
     REDIS_URL=redis://localhost:6379
     ```

   - **Frontend (`apps/web/.env.development`):**
     Copia el archivo de ejemplo:
     ```bash
     cp apps/web/.env.example apps/web/.env.development
     ```
     *(Por defecto ya viene configurado apuntando a la API en `http://localhost:3010`)*.

5. **Ejecutar los servidores en modo desarrollo:**
   - **Backend (API):**
     ```bash
     cd apps/api && npm run dev
     ```
   - **Frontend (Web):**
     ```bash
     cd apps/web && npm run dev
     ```

---

## Husky y Conventional Commits

Este repositorio usa Husky desde la raíz para centralizar validaciones antes de cada commit.

- `pre-commit` ejecuta `npm run check`, que corre lint en `apps/web` y compila `apps/web` y `apps/api`.
- `commit-msg` usa Commitlint para validar que el mensaje siga Conventional Commits.
- Se permiten tipos como `feat`, `fix`, `chore`, `docs`, `refactor` y `test`.

Para mantenerlo:

- Si agregas nuevas validaciones, actualiza `check` en [package.json](./package.json).
- Si necesitas nuevos tipos de commit, ajusta [commitlint.config.cjs](./commitlint.config.cjs).
- Si los hooks dejan de ejecutarse, vuelve a correr `npm install` en la raíz para reactivar Husky.

## Estructura del Proyecto

```
ReStock-SaaS/
│
├── apps/
│   ├── api/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/
│       ├── app/
│       ├── public/
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml
├── .env
├── CONTRIBUTING.md
└── README.md
```

### Descripción de Directorios

**apps/api**

- API REST en Node.js
- Manejo de inventario, ventas y alertas
- Integración con PostgreSQL y Redis

**apps/web**

- Interfaz de usuario interactiva en Next.js
- Dashboard y gestión de inventario
- Consumo de API REST

## Pruebas y Control de Calidad

El repositorio incluye comandos centralizados en la raíz para facilitar las pruebas y validación del código:

```bash
# Ejecutar pruebas unitarias/integración del backend
npm run test:backend

# Ejecutar pruebas unitarias/integración del frontend
npm run test:frontend

# Ejecutar todas las pruebas del proyecto
npm run test:all

# Validar linting y compilación (mismo chequeo ejecutado en CI y pre-commits)
npm run check
```

## Contribución

Por favor, lee [CONTRIBUTING.md](./CONTRIBUTING.md) para entender el proceso de contribución.

## Licencia

Este proyecto está bajo licencia MIT.
