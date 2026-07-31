# 🧪 Guía de Pruebas - ReStock-SaaS

Este documento describe cómo ejecutar y mantener todas las pruebas del proyecto (Jest para backend/frontend y k6 para performance).

---

## 📋 Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Configuración de .env](#configuración-de-env)
3. [Pruebas Backend](#pruebas-backend)
4. [Pruebas Frontend](#pruebas-frontend)
5. [Pruebas de Rendimiento (k6)](#pruebas-de-rendimiento-k6)
6. [Ejecutar Todo](#ejecutar-todo)
7. [Ejemplos de Salida](#ejemplos-de-salida)
8. [Troubleshooting](#troubleshooting)

---

## Setup Inicial

### Dependencias Requeridas

El proyecto incluye todas las dependencias necesarias. Después de `npm install` en cada directorio, tienes:

**Backend (apps/api):**
- Jest, Supertest, ts-jest

**Frontend (apps/web):**
- Jest, @testing-library/react, babel presets

**Performance:**
- k6 (instalación separada recomendada)

### Instalar k6

**Opción 1: Gestor de paquetes (Windows con Chocolatey)**
```powershell
choco install k6
```

**Opción 2: Descarga directa**
Visita https://k6.io/docs/getting-started/installation/

**Opción 3: Docker**
```powershell
docker pull grafana/k6
```

---

## Configuración de .env

### Para Backend (apps/api/.env.test)

Crea archivo `apps/api/.env.test`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=restock_test

# Server
PORT=3010
NODE_ENV=test

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000

# API Keys (si aplica)
JWT_SECRET=test_secret_key_do_not_use_in_production
```

### Para Frontend (apps/web/.env.test)

Crea archivo `apps/web/.env.test`:

```env
# API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:3010
NODE_ENV=test
```

### Para k6 (tests/k6/.env)

Crea archivo `tests/k6/.env`:

```env
BASE_URL=http://localhost:3010
VU_COUNT=50
DURATION=45s
RAMP_UP=10s
```

**Nota:** k6 no lee .env automáticamente, usa:
```powershell
$env:BASE_URL="http://localhost:3010"
k6 run tests/k6/cta-endpoints.js
```

---

## Pruebas Backend

### ⚡ Quick Start

```powershell
cd apps/api
npm install
npm run test
```

### Paso a Paso: Ejecutar Jest Backend

**Paso 1: Acceder al directorio**
```powershell
cd apps/api
```

**Paso 2: Verificar que Jest está instalado**
```powershell
npm list jest
# Debería mostrar: jest@X.X.X
```

**Paso 3: Ejecutar todas las pruebas**
```powershell
npm run test
```

**Resultado esperado:**
```
 PASS  src/__tests__/routes/cta.test.ts
 PASS  src/__tests__/services/ctaServices.test.ts
 PASS  src/__tests__/schemas/ctaSchema.test.ts

Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        2.345 s
```

### Opciones Adicionales

**Modo watch (reinicia automáticamente en cambios):**
```powershell
npm run test:watch
```

**Ver cobertura de código:**
```powershell
npm run test:coverage
```

**Salida esperada:**
```
----------|---------|---------|---------|---------|---
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|---------|---------|---------|---
All files |   70.15 |   65.42  |   72.30 |   70.15 |
 schemas  |   80.00 |   75.00  |   85.00 |   80.00 |
 services |   75.00 |   70.00  |   80.00 |   75.00 |
 routes   |   60.00 |   55.00  |   65.00 |   60.00 |
----------|---------|---------|---------|---------|---
```

**Solo un archivo específico:**
```powershell
npm run test -- src/__tests__/routes/cta.test.ts
```

**Modo verbose (más detalles):**
```powershell
npm run test -- --verbose
```

### Qué se prueba en Backend

✅ **Rutas (routes/cta.test.ts)**
- POST /cta con datos válidos → Status 200
- POST /cta con email inválido → Status 400
- POST /cta con campos faltantes → Status 400
- POST /cta con error de BD → Status 500

✅ **Servicios (services/ctaServices.test.ts)**
- createInterest() exitoso → registra en BD
- createInterest() con email duplicado → lanza error
- createInterest() con error de BD → maneja excepción

✅ **Esquemas (schemas/ctaSchema.test.ts)**
- Email válido pasa validación
- Email inválido rechazado
- Campos requeridos validados

---

## Pruebas Frontend

### ⚡ Quick Start

```powershell
cd apps/web
npm install
npm run test
```

### Paso a Paso: Ejecutar Jest Frontend

**Paso 1: Acceder al directorio**
```powershell
cd apps/web
```

**Paso 2: Verificar dependencias**
```powershell
npm list jest @testing-library/react
# Debe mostrar ambas instaladas
```

**Paso 3: Ejecutar todas las pruebas**
```powershell
npm run test
```

**Resultado esperado:**
```
 PASS  __tests__/lib/validationsCTA.test.ts (2.145 s)
 PASS  __tests__/components/cta.test.tsx (3.021 s)

Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        5.166 s
```

### Opciones Adicionales

**Modo watch (desarrollo interactivo):**
```powershell
npm run test:watch
```

**Ver cobertura de código:**
```powershell
npm run test:coverage
```

**Salida esperada:**
```
----------|---------|---------|---------|---------|---
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|---------|---------|---------|---
All files |   65.40 |   58.20  |   70.10 |   65.40 |
 cta.tsx  |   72.50 |   65.00  |   75.00 |   72.50 |
 validCTA |   58.30 |   51.60  |   65.20 |   58.30 |
----------|---------|---------|---------|---------|---
```

**Solo un componente específico:**
```powershell
npm run test -- cta.test.tsx
```

**Modo verbose:**
```powershell
npm run test -- --verbose
```

**Actualizar snapshots:**
```powershell
npm run test -- -u
```

### Qué se prueba en Frontend

✅ **Componentes (components/cta.test.tsx)**
- Renderizado correcto del formulario CTA
- Campos visibles: nombre, negocio, teléfono
- Submit del formulario
- Validación de campos en tiempo real
- Manejo de errores y mensajes

✅ **Validaciones (lib/validationsCTA.test.ts)**
- Nombre válido (2-100 caracteres, solo letras)
- Nombre inválido (muy corto, caracteres especiales)
- Negocio válido y validaciones
- Teléfono con prefijo +52 correcto
- Campos requeridos

---

## Pruebas de Rendimiento (k6)

### ⚡ Quick Start

```powershell
# Terminal 1: Iniciar backend
cd apps/api
npm run dev

# Terminal 2: Ejecutar k6
cd C:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS
k6 run tests/k6/health-check.js
```

### Paso a Paso: Instalar k6

**Opción 1: Windows con Chocolatey (Recomendado)**
```powershell
# Si tienes Chocolatey instalado
choco install k6

# Verificar instalación
k6 version
```

**Opción 2: Descarga directa**
1. Visita https://k6.io/docs/getting-started/installation/
2. Descarga el ejecutable Windows
3. Agrega a PATH o usa ruta completa

**Opción 3: Docker**
```powershell
docker pull grafana/k6
docker run --rm -i grafana/k6 version
```

### Paso a Paso: Ejecutar Health Check

**Paso 1: Verificar que el backend está corriendo**
```powershell
# En una terminal nueva
cd apps/api
npm run dev

# Debería mostrar: "Server is running on port 3010"
```

**Paso 2: Acceder al directorio del proyecto**
```powershell
cd C:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS
```

**Paso 3: Ejecutar el health check**
```powershell
k6 run tests/k6/health-check.js
```

**Salida esperada:**
```
     vus........: 10 (min: 0, max: 10)
     duration...: 40s

     checks........................: 99.5% ✓ 401 ✗ 1
     http_req_blocked..............: avg=1.24ms  min=0s     max=15.23ms p(90)=2.15ms   p(95)=3.42ms
     http_req_connecting...........: avg=0.89ms  min=0s     max=8.75ms  p(90)=1.85ms   p(95)=2.91ms
     http_req_duration.............: avg=48.39ms min=32ms   max=185ms   p(90)=78.25ms  p(95)=95.12ms
     http_req_failed...............: 0.25%    ✓ 0     ✗ 402
     http_req_receiving............: avg=0.15ms  min=0s     max=3.15ms  p(90)=0.25ms   p(95)=0.42ms
     http_req_sending.............: avg=0.12ms  min=0s     max=2.84ms  p(90)=0.18ms   p(95)=0.31ms
     http_req_tls_handshaking......: avg=0ms     min=0s     max=0s      p(90)=0s       p(95)=0s
     http_req_waiting.............: avg=48.12ms min=31ms   max=184ms   p(90)=77.89ms  p(95)=94.65ms
     http_reqs.....................: 402     10.05/s
     iteration_duration...........: avg=1.12s   min=1.03s  max=1.18s   p(90)=1.15s    p(95)=1.16s
     iterations....................: 402     10.05/s
```

### Paso a Paso: Ejecutar CTA Endpoints Load Test

**Paso 1: Asegúrate que el backend está corriendo**
```powershell
# Terminal 1
cd apps/api
npm run dev
```

**Paso 2: Ejecutar el test de carga**
```powershell
# Terminal 2
cd C:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS
k6 run tests/k6/cta-endpoints.js
```

**Salida esperada:**
```
     vus........: 50   (min: 0, max: 50)
     duration...: 45s

     checks........................: 97.25% ✓ 1947 ✗ 53
     cta_errors....................: 2.75% ✓ 55
     cta_latency....................: avg=245.31ms min=87ms   max=612ms   p(90)=410.12ms p(95)=485.23ms
     http_req_duration.............: avg=251.84ms min=82ms   max=618ms   p(90)=420.15ms p(95)=495.45ms
     http_req_failed...............: 2.73%    ✓ 0      ✗ 2000
     http_reqs.....................: 2000    44.44/s
     iterations....................: 2000    44.44/s

=== CTA Endpoints Load Test Summary ===

HTTP Requests:
  Total: 2000
  Failed: 55
  Success Rate: 97.25%

Response Times (ms):
  Min: 82
  Max: 618
  Avg: 251.84
  p95: 495.45
  p99: 587.23

CTA Metrics:
  Error Rate: 2.75%
  Avg Latency: 245.31ms
  p95 Latency: 485.23ms

=====================================
```

### Variables de Entorno para k6

```powershell
# Cambiar URL del servidor
$env:BASE_URL="http://mi-servidor.com:3010"
k6 run tests/k6/cta-endpoints.js

# Windows PowerShell permanente en sesión
$env:BASE_URL="http://localhost:3010"

# Para fijar permanentemente (requiere reiniciar):
[Environment]::SetEnvironmentVariable("BASE_URL", "http://localhost:3010", "User")
```

### Con Docker

```powershell
# Health check
docker run --rm -i grafana/k6 run - < tests/k6/health-check.js

# CTA endpoints
docker run --rm -i grafana/k6 run - < tests/k6/cta-endpoints.js -e BASE_URL=http://host.docker.internal:3010
```

### Generar Reporte JSON

```powershell
k6 run tests/k6/cta-endpoints.js --out json=results.json

# Ver resultados
cat results.json | findstr "metric"
```

---

## Ejecutar Todo

### Desde la raíz del proyecto

```powershell
# Todas las pruebas (Jest)
npm run test:all

# Solo backend
npm run test:backend

# Solo frontend
npm run test:frontend

# Performance (requiere k6 instalado)
npm run test:k6        # CTA endpoints
npm run test:k6:health # Health check
```

---

## 📊 Ejemplos de Salida

### Salida Completa: Jest Backend

```powershell
PS C:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS\apps\api> npm run test

> api@1.0.0 test
> jest

 PASS  src/__tests__/schemas/ctaSchema.test.ts
  CTA Schema
    ✓ should validate correct schema (15 ms)
    ✓ should reject invalid email (8 ms)
    ✓ should reject missing email (5 ms)
    ✓ should accept nombre with special Spanish characters (6 ms)
    ✓ should reject negocio exceeding 100 characters (4 ms)
    ✓ should accept valid telefono with space (3 ms)

 PASS  src/__tests__/services/ctaServices.test.ts
  CTA Services
    ✓ should create interest successfully (12 ms)
    ✓ should handle duplicate email error (8 ms)
    ✓ should handle database error (6 ms)

 PASS  src/__tests__/routes/cta.test.ts
  CTA Routes
    ✓ POST /cta should return 200 on success (18 ms)
    ✓ POST /cta should return 400 on invalid email (14 ms)
    ✓ POST /cta should return 400 on missing email (10 ms)

Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        4.235 s
```

### Salida Completa: Jest Frontend

```powershell
PS C:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS\apps\web> npm run test

> web@0.1.0 test
> jest

 PASS  __tests__/lib/validationsCTA.test.ts (2.456 s)
  interestSchema Validation
    Nombre field validations
      ✓ should accept valid nombre (18 ms)
      ✓ should reject nombre with less than 2 characters (12 ms)
      ✓ should reject nombre exceeding 100 characters (8 ms)
      ✓ should reject nombre with invalid characters (10 ms)
      ✓ should accept nombre with special Spanish characters (6 ms)
    Negocio field validations
      ✓ should accept valid negocio (5 ms)
      ✓ should reject negocio with less than 2 characters (4 ms)
      ✓ should reject negocio exceeding 100 characters (3 ms)
    Telefono field validations
      ✓ should accept valid telefono with space (4 ms)
      ✓ should accept valid telefono without space (3 ms)
      ✓ should reject telefono with invalid prefix (2 ms)

 PASS  __tests__/components/cta.test.tsx (3.125 s)
  CTA Component
    Component Rendering
      ✓ should render the CTA form (25 ms)
      ✓ should render all input fields (18 ms)
    Form Validation
      ✓ should show error for invalid email (22 ms)
      ✓ should accept valid submission (19 ms)
    Error Handling
      ✓ should handle API errors gracefully (24 ms)

Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        5.581 s
```

### Salida Completa: k6 Health Check

```powershell
PS C:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS> k6 run tests/k6/health-check.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: tests/k6/health-check.js
     output: -

  scenarios: (100.00%) 1 scenario, 10 max VUs, 40s total duration (incl. 10s gracefulStop)

     ✓ scenario completed successfully

     checks........................: 99.50% ✓ 401   ✗ 1
     data_received..................: 186 kB  4.7 kB/s
     data_sent.......................: 32 kB   812 B/s
     http_req_blocked................: avg=1.23ms   min=0s       max=15.24ms  p(90)=2.15ms   p(95)=3.42ms
     http_req_connecting.............: avg=0.88ms   min=0s       max=8.74ms   p(90)=1.85ms   p(95)=2.91ms
     http_req_duration..............: avg=48.39ms  min=32ms     max=185ms    p(90)=78.25ms  p(95)=95.12ms
     http_req_failed................: 0.25%   ✓ 0      ✗ 402
     http_req_receiving.............: avg=0.15ms   min=0s       max=3.15ms   p(90)=0.25ms   p(95)=0.42ms
     http_req_sending...............: avg=0.12ms   min=0s       max=2.84ms   p(90)=0.18ms   p(95)=0.31ms
     http_req_tls_handshaking.......: avg=0ms      min=0s       max=0s       p(90)=0s       p(95)=0s
     http_req_waiting...............: avg=48.12ms  min=31ms     max=184ms    p(90)=77.89ms  p(95)=94.65ms
     http_reqs......................: 402     10.05/s
     iteration_duration.............: avg=1.12s    min=1.03s    max=1.18s    p(90)=1.15s    p(95)=1.16s
     iterations.....................: 402     10.05/s
     vus............................: 1       min=0     max=10
     vus_max........................: 10      min=10    max=10
```

### Salida Completa: k6 CTA Endpoints Load Test

```powershell
PS C:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS> k6 run tests/k6/cta-endpoints.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: tests/k6/cta-endpoints.js
     output: -

  scenarios: (100.00%) 1 scenario, 50 max VUs, 45s total duration

     ✓ CTA: status is 200 or 201
     ✓ CTA: response time < 200ms
     ✓ CTA: response time < 500ms
     ✓ CTA: no 5xx errors

     checks........................: 97.25% ✓ 1947 ✗ 53
     cta_errors.....................: 2.75% ✓ 55
     cta_latency....................: avg=245.31ms min=87ms    max=612ms    p(90)=410.12ms p(95)=485.23ms
     data_received..................: 245 kB  5.4 kB/s
     data_sent.......................: 287 kB  6.4 kB/s
     http_req_duration.............: avg=251.84ms min=82ms    max=618ms    p(90)=420.15ms p(95)=495.45ms
     http_req_failed...............: 2.73%  ✓ 0     ✗ 2000
     http_reqs.....................: 2000   44.44/s
     iteration_duration............: avg=1.24s   min=1.08s   max=1.61s    p(90)=1.41s    p(95)=1.52s
     iterations....................: 2000   44.44/s
     vus............................: 50     min=50   max=50
     vus_max........................: 50     min=50   max=50

=== CTA Endpoints Load Test Summary ===

HTTP Requests:
  Total: 2000
  Failed: 55
  Success Rate: 97.25%

Response Times (ms):
  Min: 82
  Max: 618
  Avg: 251.84
  p95: 495.45
  p99: 587.23

CTA Metrics:
  Error Rate: 2.75%
  Avg Latency: 245.31ms
  p95 Latency: 485.23ms

=====================================
```

---

## Métricas Explicadas

### Métricas k6

| Métrica | Significado |
|---------|---|
| `vus` | Virtual Users (usuarios virtuales activos) |
| `checks` | Validaciones que pasaron/fallaron |
| `http_req_duration` | Tiempo total de respuesta |
| `http_req_failed` | Porcentaje de requests fallidos |
| `p(95)` | Percentil 95 (95% de requests más rápidos) |
| `p(99)` | Percentil 99 (99% de requests más rápidos) |
| `iterations` | Número de veces que se ejecutó el script |

### Interpretación de Resultados

**✅ BUENO:**
- checks > 95%
- http_req_failed < 1%
- http_req_duration p(95) < 200ms
- cta_errors < 1%

**⚠️ ACEPTABLE:**
- checks 90-95%
- http_req_failed 1-5%
- http_req_duration p(95) 200-500ms
- cta_errors 1-5%

**❌ MALO:**
- checks < 90%
- http_req_failed > 5%
- http_req_duration p(95) > 1000ms
- cta_errors > 5%

---

## Troubleshooting

### Jest - Import errors

**Error:** `Cannot find module '@/...'`

**Solución:**
```powershell
# Verificar tsconfig.json tiene baseUrl y paths configurados
cat apps/api/tsconfig.json
cat apps/web/tsconfig.json
```

### Jest - JSX syntax errors (Frontend)

**Error:** `Support for experimental syntax 'jsx' isn't enabled`

**Solución:**
```powershell
cd apps/web
npm install --save-dev @babel/preset-react babel-jest
# Verificar babel.config.js existe
cat babel.config.js
```

### Jest - No tests found

**Error:** `No tests found matching /...`

**Solución:**
- Verificar archivos están en `__tests__/` y terminan en `.test.ts` o `.test.tsx`
- Ejecutar: `npm run test -- --listTests`

### k6 - Connection refused

**Error:** `dial tcp [::1]:3010: connect: connection refused`

**Solución:**
1. Asegúrate que el backend está corriendo: `npm run dev` en `apps/api`
2. Verifica puerto 3010: `netstat -ano | findstr :3010` (Windows)
3. Usa variable de entorno: `$env:BASE_URL="http://localhost:3010"`

### k6 - No results

**Error:** `No results received`

**Solución:**
```powershell
# Verificar k6 está instalado
k6 version

# Usar ruta absoluta
k6 run "C:\Users\...\ReStock-SaaS\tests\k6\health-check.js"
```

---

## 📈 Mejorando Cobertura

### Backend

1. Añadir tests para casos edge
2. Mockear eventos de base de datos
3. Probar middleware de errores

### Frontend

1. Tests de integración para flujos completos
2. Validar mensajes de error específicos
3. Probar estados loading/error

### Performance

1. Ejecutar k6 regularmente en CI/CD
2. Establecer baselines de rendimiento
3. Alertas si TTFB > 500ms

---

## 🔄 CI/CD Integration

Ejemplo para GitHub Actions:

```yaml
- name: Run Jest Tests
  run: npm run test:all

- name: Run k6 Health Check
  if: always()
  run: k6 run tests/k6/health-check.js
```

---

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [Supertest Docs](https://github.com/visionmedia/supertest)
- [k6 Guide](https://k6.io/docs/)
- [Testing Library](https://testing-library.com/)

---

**Última actualización:** 2024-06-14
