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

## Instalación

### Requisitos Previos

- Docker y Docker Compose instalados
- Git
- Node.js 24+

### Opción 1: Docker (Recomendado)

1. Clona el repositorio:

```bash
git clone https://github.com/Arturocs160/ReStock-SaaS.git
cd ReStock-SaaS
```

2. Configura `.env` con tus valores:

```env

# --- Variables de Entorno del Sistema ---
# Conexión a la base de datos (PostgreSQL / Supabase)
DATABASE_URL=postgresql://restock:restock123@localhost:5432/restock

# Conexión a Redis
REDIS_URL=redis://localhost:6379

# URLs de los servicios
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3010

```

4. Inicia los servicios:

```bash
docker-compose up --build
```

5. Accede a la aplicación:

- Interfaz web: http://localhost:3000
- API: http://localhost:3010

### Opción 2: Instalación Local

1. Instala las dependencias raíz para activar Husky y la validación de commits:

```bash
npm install
```

2. Instala dependencias de cada aplicación:

```bash
cd apps/api && npm install
cd ../web && npm install
```

3. Configura PostgreSQL y crea la base de datos

4. Inicia los servidores en desarrollo:

```bash
# Terminal 1 - Backend
cd apps/api && npm run dev

# Terminal 2 - Frontend
cd apps/web && npm run dev
```

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
- Integración con PostgreSQL

**apps/web**

- Interfaz de usuario con Next.js
- Dashboard y gestión de inventario
- Consumo de API REST

## Configuración

### Variables de Entorno

| Variable              | Descripción                                | Requerida |
| --------------------- | ------------------------------------------ | --------- |
| `DATABASE_URL`        | URL de conexión para PostgreSQL / Supabase | Sí        |
| `REDIS_URL`           | URL de conexión para Redis                 | Sí        |
| `FRONTEND_URL`        | URL del frontend (CORS y Auth)             | Sí        |
| `NEXT_PUBLIC_API_URL` | URL del API consumida por el frontend      | Sí        |

## Desarrollo

### Comandos Disponibles

```bash
# Backend
cd apps/api
npm run dev        # Inicia en modo desarrollo
npm run build      # Compila para producción
npm test           # Ejecuta pruebas

# Frontend
cd apps/web
npm run dev        # Inicia en modo desarrollo
npm run build      # Compila para producción
npm test           # Ejecuta pruebas
```

## Contribución

Por favor, lee [CONTRIBUTING.md](./CONTRIBUTING.md) para entender el proceso de contribución.

## Licencia

Este proyecto está bajo licencia MIT.
