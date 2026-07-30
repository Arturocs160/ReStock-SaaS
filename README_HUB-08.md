# HUB-08: lotes por fecha de caducidad

## Ruta

`GET /api/lotes/expiracion`

Devuelve los lotes activos con existencia disponible para el negocio del usuario autenticado. La respuesta incluye los datos del lote, su producto asociado y una clasificacion calculada con base en la fecha de caducidad.

## Autorizacion y aislamiento de datos

La ruta usa el intermediario de autenticacion del servidor. Si la sesion no es valida, responde con estado `401`.

La consulta filtra siempre por `id_negocio` tomado del usuario autenticado. El cliente no puede enviar un identificador de negocio para consultar datos de otro negocio.

## Consulta de datos

La informacion se obtiene con una union entre `producto` y `lote_inventario`.

Condiciones aplicadas:

- El producto pertenece al `id_negocio` del usuario autenticado.
- El producto esta activo.
- El lote esta activo.
- La cantidad actual del lote es mayor a cero.
- La cantidad actual se calcula restando ventas y mermas a la cantidad inicial.

## Ordenamiento

Los lotes se ordenan por `fecha_caducidad` de forma ascendente. Los lotes sin fecha de caducidad se colocan al final.

## Reglas de clasificacion

La clasificacion se calcula con la diferencia en dias entre la fecha actual y `fecha_caducidad`.

- `vencido`: la fecha de caducidad ya paso.
- `critico`: caduca hoy o dentro de los siguientes 7 dias.
- `proximo`: caduca entre 8 y 30 dias.
- `vigente`: caduca en mas de 30 dias.
- `sin_fecha`: el lote no tiene fecha de caducidad.

## Ejemplo de respuesta exitosa

Estado `200`.

```json
{
  "lotes": [
    {
      "id_lote": "b7b7b7b7-1111-4444-8888-aaaaaaaaaaaa",
      "id_producto": "a1a1a1a1-2222-4444-8888-bbbbbbbbbbbb",
      "codigo_lote": "L-2026-001",
      "fecha_ingreso": "2026-07-01",
      "fecha_caducidad": "2026-08-02",
      "cantidad_inicial": 24,
      "cantidad_actual": 18,
      "dias_para_caducar": 7,
      "clasificacion_vencimiento": "critico",
      "producto": {
        "id_producto": "a1a1a1a1-2222-4444-8888-bbbbbbbbbbbb",
        "id_negocio": "c1c1c1c1-3333-4444-8888-cccccccccccc",
        "codigo_barras": "750000000001",
        "nombre": "Leche entera",
        "precio_actual": 25.5,
        "stock_minimo_sugerido": 5,
        "id_categoria": "d1d1d1d1-4444-4444-8888-dddddddddddd"
      }
    }
  ]
}
```

## Respuestas de error

Estado `401` cuando no existe una sesion valida.

```json
{
  "error": "Sesion invalida o expirada",
  "message": "No autorizado. Inicia sesion primero."
}
```

Estado `500` si ocurre un error no controlado al consultar o procesar la informacion.

```json
{
  "error": "Error interno del servidor"
}
```
