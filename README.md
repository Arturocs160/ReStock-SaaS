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

### Justificación del Stack

La selección tecnológica para el desarrollo de este proyecto SaaS se ha diseñado buscando un equilibrio óptimo entre rendimiento, alta escalabilidad, seguridad robusta y una curva de aprendizaje adecuada para la experiencia previa del equipo.

- **Ecosistema Frontend**: Se optó por una arquitectura monolítica utilizando **React** en conjunto con **Next.js**. Esta decisión se fundamenta en la capacidad de Next.js para facilitar la creación de interfaces altamente dinámicas y un enrutamiento intuitivo, apoyado por una amplia comunidad. El diseño visual se realiza con **Tailwind CSS**, lo que permite un desarrollo ágil y responsivo mediante clases utilitarias, manteniendo la consistencia en todas las vistas sin sobrecargar los estilos. Además, la gestión del estado global recae en **Zustand**, una herramienta ligera y directa indispensable para manejar en memoria los datos del negocio, como las alertas de caducidad y las sesiones de los usuarios, minimizando re-renderizados innecesarios y optimizando el rendimiento en los dispositivos de los clientes.
- **Núcleo del Backend**: Operará sobre un backend construido con **Node.js** y **Express**, tipado de manera estricta mediante **TypeScript**. La adopción de TypeScript es una decisión estratégica para la prevención de errores en tiempo de desarrollo y la creación de un código más predecible y auto-documentado. Al seguir un modelo de arquitectura por capas, el sistema garantiza un mantenimiento a largo plazo mucho más sencillo. Para asegurar que los datos procesados sean correctos desde el origen, se integra **Zod**, proporcionando una capa de validación estricta y sanitización de entradas que previene fallos internos antes de que interactúen con los servicios pesados, como el cálculo de reabastecimiento o el análisis de ventas.
- **Persistencia y Gestión de Datos**: La arquitectura exige un modelo relacional robusto debido a la naturaleza de las transacciones de inventario, por lo que **PostgreSQL** alojado en **Supabase** fue la elección ideal. Supabase no solo ofrece un entorno optimizado para PostgreSQL, sino que aporta capacidades nativas de pooling de conexiones y respaldos automáticos, lo que reduce costos operativos y de infraestructura. Para manejar la concurrencia y optimizar la escalabilidad del modelo multi-tenant, se introduce **Redis** como almacenamiento en memoria, asumiendo la carga de gestionar las sesiones activas y la caché de tokens, liberando a la base de datos principal de operaciones repetitivas. Todo esto se integra de forma transparente con **better-auth**, un marco centralizado que gestiona la autenticación de los tenants mediante cookies seguras (HTTP-Only, SameSite=Strict), protegiendo al sistema de vulnerabilidades de sesión y aplicando un estricto control de acceso basado en roles (RBAC).
- **Infraestructura y Ciclo de Vida**: Diseñados para maximizar la seguridad, la disponibilidad y la automatización. El frontend se apoya en la CDN global de **Vercel** para una entrega de contenido casi instantánea, mientras que el backend corre aislado y de forma reproducible en contenedores de **Docker**. En la capa perimetral, **Cloudflare** actúa como un escudo vital, proporcionando mitigación de ataques DDoS, un firewall de aplicaciones web (WAF) y resolución dinámica de subdominios para cada negocio. Para garantizar la fiabilidad del código antes de llegar a producción, se diseñó un esquema integral de pruebas automatizado enteramente a través de **GitHub Actions** con pruebas unitarias e integración (**Jest**), E2E (**Cypress**) y rendimiento (**K6**).

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
