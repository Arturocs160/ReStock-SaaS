# Guía de Contribución

Esta guía te ayudará a entender cómo participar en el proyecto.

## Tabla de Contenidos

1. [Cómo Reportar Problemas](#cómo-reportar-problemas)
2. [Cómo Sugerir Mejoras](#cómo-sugerir-mejoras)
3. [Proceso de Desarrollo](#proceso-de-desarrollo)
4. [Estándares de Código](#estándares-de-código)
5. [Commits](#commits)
6. [Pull Requests](#pull-requests)


## Cómo Reportar Problemas

Si encuentras un bug o tienes un problema:

1. Verifica que el problema no esté ya reportado en Issues
2. Abre un nuevo issue describiendo:
   - Título claro y descriptivo
   - Descripción detallada del problema
   - Pasos para reproducir el error
   - Comportamiento esperado vs comportamiento actual
   - Screenshots si es relevante
   - Tu entorno (OS, navegador, versión de Node.js, etc.)

### Ejemplo de Issue

```
Título: [BUG] El sistema no calcula correctamente el reabastecimiento

Descripción:
Al intentar calcular la cantidad recomendada de reabastecimiento, el sistema muestra valores negativos cuando no debería.

Pasos para reproducir:
1. Crear un producto con inventario actual = 50 unidades
2. Establecer demanda promedio = 100 unidades/semana
3. Ver recomendación de reabastecimiento
4. Se muestra -50 en lugar de una cantidad positiva

Comportamiento esperado:
Se debe mostrar la cantidad correcta de reabastecimiento basada en la demanda.

Comportamiento actual:
Se muestran valores negativos.

Entorno:
- OS: Windows 11
- Node.js: 18.16.0
- Navegador: Chrome 120
```

## Cómo Sugerir Mejoras

Para proponer una mejora:

1. Abre un nuevo issue con el título prefijado con "[FEATURE]"
2. Describe la mejora propuesta y su caso de uso
3. Explica los beneficios y el impacto esperado
4. Proporciona ejemplos si es posible

### Ejemplo de Sugerencia

```
Título: [FEATURE] Exportar reportes de inventario a Excel

Descripción:
Sería útil poder exportar los reportes de inventario a formato Excel para análisis offline.

Caso de uso:
Los gerentes podrían analizar los datos en Excel sin necesidad de estar conectados.

Beneficios:
- Mayor flexibilidad en el análisis de datos
- Mejor integración con herramientas de oficina
```

## Proceso de Desarrollo

### 1. Fork del Repositorio

```bash
# En GitHub, haz clic en "Fork" para crear tu propia copia
git clone https://github.com/tu-usuario/ReStock-SaaS.git
cd ReStock-SaaS
git remote add upstream https://github.com/Arturocs160/ReStock-SaaS.git
```

### 2. Crear una Rama

```bash
# Actualiza tu rama main
git fetch upstream
git checkout main
git merge upstream/main

# Crea una nueva rama para tu feature/fix
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 3. Realizar Cambios

- Instala las dependencias: `npm install`
- Realiza tus cambios en el código
- Prueba localmente: `npm run dev`
- Ejecuta los tests: `npm test`

### 4. Sincronizar con Main

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push a tu Fork

```bash
git push origin feature/nombre-descriptivo
```

## Estándares de Código

### General

- Usa nombres descriptivos para variables, funciones y clases
- Mantén el código DRY (Don't Repeat Yourself)
- Escribe código legible sobre código inteligente
- Agrega comentarios solo cuando sea necesario para aclarar la lógica compleja

### JavaScript/TypeScript

- Usa `const` por defecto, `let` si necesitas reasignar
- Evita `var`
- Usa funciones de flecha cuando sea apropiado
- Respeta el format existente del proyecto

### Ejemplo

```javascript
// Bien
const calculateReorderQuantity = (currentStock, averageDemand) => {
  const safetyStock = averageDemand * 0.2;
  return Math.max(0, safetyStock - currentStock);
};

// Evitar
var result = cs - ad;
```

### Backend (Node.js)

- Estructura MVC o similar según convenga
- Manejo de errores consistente
- Validación de entrada
- Logs informativos en funciones críticas

### Frontend (Next.js/React)

- Componentes funcionales con hooks
- Naming convenciones: `PascalCase` para componentes
- Props validadas
- Estilos organizados y reutilizables

## Commits

### Mensaje de Commit

Usa mensajes descriptivos siguiendo esta estructura. El hook `commit-msg` valida que el mensaje cumpla Conventional Commits:

```
<tipo>: Descripción breve
```

### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de un bug
- `refactor`: Cambios de código sin alterar funcionalidad
- `docs`: Cambios en documentación
- `test`: Agregar o actualizar pruebas
- `chore`: Cambios de dependencias, configuración, etc.

Tipos permitidos por la configuración actual de Commitlint:

- `feat`
- `fix`
- `chore`
- `docs`
- `refactor`
- `test`

El hook `pre-commit` ejecuta validaciones automáticas desde la raíz del repo. Si agregas nuevas validaciones, actualiza el script `check` en [package.json](./package.json) para que el hook las use.

### Ejemplos

```bash
git commit -m "feat: Agregar cálculo automático de reabastecimiento"
git commit -m "fix: Corregir validación de fechas de caducidad"
git commit -m "docs: Actualizar guía de instalación"
git commit -m "test: Agregar pruebas para el módulo de alertas"
```

## Pull Requests

### Antes de Abrir un PR

1. Asegúrate de que tu rama está actualizada con `main`
2. Ejecuta tests: `npm test`
3. Verifica que no hay errores de linting
4. Prueba localmente tu cambio
5. Actualiza la documentación si es necesario

### Cómo Abrir un PR

1. Ve a tu fork en GitHub
2. Haz clic en "Compare & pull request"
3. Completa el template del PR con:
   - Descripción clara de los cambios
   - Referencia al issue si aplica (Closes #123)
   - Cambios realizados (lista de puntos)
   - Pruebas realizadas
   - Screenshots

### Template de PR

```markdown
## Descripción

Breve descripción de los cambios realizados.

## Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Cambio en documentación

## Cambios Realizados

- Cambio 1
- Cambio 2
- Cambio 3

## Cierra

Closes #123

## Testing

Se realizó prueba manual en:
- Backend: [describe]
- Frontend: [describe]

## Screenshots

Agrega screenshots de los cambios visuales.
```

## Desarrollo Local

### Setup Inicial

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/ReStock-SaaS.git
cd ReStock-SaaS

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servicios
docker-compose up --build
```

### Ejecutar Pruebas

```bash
# Backend
cd apps/api && npm test

# Frontend
cd apps/web && npm test
```

### Linting

```bash
# Backend
cd apps/api && npm run lint

# Frontend
cd apps/web && npm run lint
```

