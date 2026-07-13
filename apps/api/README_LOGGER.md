# Logger en ReStock-SaaS

Este documento explica cómo usar **Pino** para logging estructurado en el backend de ReStock-SaaS.

## Configuración

El logger está centralizado en `src/utils/logger.ts` y se exporta como una instancia lista para usar en toda la aplicación.

### Características

- **Nivel por defecto**: `info`
- **Desarrollo**: Salida legible con colores (pino-pretty)
- **Producción**: JSON estructurado
- **Timestamp**: ISO 8601 con zona horaria
- **Service name**: `ReStock-API` en todos los logs

## Uso básico

```typescript
import logger from "../utils/logger";

// Información general
logger.info("Usuario registrado correctamente");

// Información con contexto
logger.info({ userId: 123, email: "user@example.com" }, "Usuario creado");

// Advertencias
logger.warn({ userId }, "Intento de acceso no autorizado");

// Errores
logger.error(err, "Error crítico en servicio de inventario");

// Errores con contexto adicional
logger.error({ err, productId: 456, action: "update" }, "Fallo al actualizar producto");

// Debug (útil en desarrollo)
logger.debug({ data }, "Datos procesados");

// Trace (información más detallada)
logger.trace({ requestBody }, "Request recibido");
```

## Niveles de logging

Los niveles disponibles en orden de severidad son:

- **trace** (10): Información muy detallada, útil para debugging profundo
- **debug** (20): Información de debugging
- **info** (30): Información general, eventos importantes
- **warn** (40): Advertencias, situaciones inesperadas pero recuperables
- **error** (50): Errores, fallos de operaciones
- **fatal** (60): Errores críticos que requieren detención inmediata

## Cambiar nivel de logging

Por variable de entorno:

```bash
LOG_LEVEL=debug npm run dev
LOG_LEVEL=trace npm run dev
```

## Ejemplos en servicios

### En un servicio

```typescript
// src/services/ctaServices.ts
import logger from "../utils/logger";

export const createCTA = async (data: any) => {
  try {
    logger.info({ data }, "Iniciando creación de CTA");

    // Lógica del servicio
    const result = await db.create(data);

    logger.info({ ctaId: result.id }, "CTA creado exitosamente");
    return result;
  } catch (error) {
    logger.error({ error, data }, "Error al crear CTA");
    throw error;
  }
};
```

### En un controlador

```typescript
// src/controllers/ctaController.ts
import logger from "../utils/logger";

export const handleCreateCTA = async (req: any, res: any) => {
  try {
    logger.info({ body: req.body }, "CTA create request recibido");

    const result = await createCTA(req.body);

    logger.info({ ctaId: result.id }, "CTA creado y retornado al cliente");
    res.json(result);
  } catch (error) {
    logger.error({ error, url: req.url }, "Error en handleCreateCTA");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
```

### En middleware

```typescript
// src/middlewares/verifyData.ts
import logger from "../utils/logger";

export const verifyData = (req: any, res: any, next: any) => {
  try {
    logger.debug({ headers: req.headers }, "Verificando datos de request");

    // Lógica de verificación

    next();
  } catch (error) {
    logger.warn({ error, url: req.url }, "Verificación de datos falló");
    res.status(400).json({ error: "Invalid data" });
  }
};
```

## Salida en desarrollo

En desarrollo con `pino-pretty`, los logs se ven así:

```
[13:45:22.123] INFO: Incoming request
    method: GET
    url: /api/ctas
    ip: 127.0.0.1
```

## Salida en producción

En producción, los logs son JSON estructurado:

```json
{
  "level": 30,
  "time": "2024-06-14T13:45:22.123Z",
  "pid": 1234,
  "hostname": "api-server",
  "service": "ReStock-API",
  "method": "GET",
  "url": "/api/ctas",
  "ip": "127.0.0.1",
  "msg": "Incoming request"
}
```

## Logging automático

El servidor ya incluye logging automático para:

- **Requests entrantes**: Se registran método, URL e IP
- **Errores no capturados**: Se registran con stack trace completo
- **Arranque del servidor**: Se registra puerto y timestamp

## Variables de entorno

```bash
# Nivel de logging (default: info)
LOG_LEVEL=debug

# NODE_ENV determina formato de salida
NODE_ENV=development  # Usa pino-pretty
NODE_ENV=production   # Usa JSON estructurado
```

## Buenas prácticas

1. **Siempre registra contexto importante**: usuario, ID de recurso, acción realizada
2. **Usa el nivel apropiado**: No todo es `info`
3. **No loguees datos sensibles**: Passwords, tokens, información personal
4. **Estructura tus logs**: Usa objetos para facilitar búsqueda
5. **Log temprano, log a menudo**: Pero sin exceso de ruido

## Monitoreo

Los logs JSON en producción pueden integrarse con sistemas de monitoreo como:

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog
- CloudWatch (AWS)
- Stackdriver (Google Cloud)
- Sentry (para errores)

---

**Versión**: 1.0  
**Última actualización**: 2024-06-14
