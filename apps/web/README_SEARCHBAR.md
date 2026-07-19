# SearchBar del POS (HUF-06)

Componente de busqueda para el punto de venta de ReStock-SaaS. Permite al cajero filtrar el catalogo de productos por **nombre** o **codigo** en tiempo real.

## Archivos involucrados

| Archivo | Responsabilidad |
|---------|-----------------|
| `app/components/pos/SearchBar.tsx` | Input controlado, boton de limpiar y debounce de 300 ms |
| `app/components/pos/ProductGrid.tsx` | Cuadricula que consume productos filtrados del store |
| `app/components/pos/ProductCard.tsx` | Tarjeta individual de producto (HUF-05) |
| `app/stores/useProductsStore.ts` | Estado global de productos y consulta de busqueda |
| `app/lib/normalizeSearchText.ts` | Normalizacion de texto y logica de filtrado |
| `app/types/product.ts` | Tipo `Product` compartido |

## Como funciona

### 1. Entrada del usuario (`SearchBar`)

- El input es **controlado** con estado local (`inputValue`) para responder al instante mientras el usuario escribe.
- Cada cambio se envia al store (`searchQuery`) con un **debounce de 300 ms** para no recalcular el filtro en cada tecla cuando el catalogo es grande.
- El boton **X** aparece cuando hay texto. Al pulsarlo:
  - Limpia el input local.
  - Llama a `clearSearch()` en el store, que restablece `searchQuery` a `""`.

### 2. Normalizacion de texto

La funcion `normalizeSearchText` prepara cadenas para comparacion insensible a:

- **Mayusculas/minusculas** (`toLowerCase()`).
- **Acentos y diacriticos** (`normalize("NFD")` + regex que elimina marcas combinadas).

Ejemplo: `"Café"` y `"CAFE"` se normalizan a `"cafe"`.

### 3. Filtrado en el store

`useProductsStore` mantiene:

- `products`: catalogo completo.
- `searchQuery`: texto de busqueda activo.

El selector `selectFilteredProducts` aplica `filterProducts(products, searchQuery)`, que busca coincidencias parciales en `nombre` y `codigo`.

Si `searchQuery` esta vacio, se devuelve el catalogo completo sin filtrar.

### 4. Cuadricula de productos (`ProductGrid`)

`ProductGrid` suscribe al store (`products` y `searchQuery`) y calcula los resultados con `useMemo` + `filterProducts`. Esto evita re-renderizados infinitos al no suscribirse directamente a un selector que devuelve un arreglo nuevo en cada evaluacion.

Cuando hay texto de busqueda y el resultado es un arreglo vacio, muestra:

```text
No se encontraron productos coincidentes.
```

## Integracion con HUF-05 (listado de productos)

HUF-05 define la cuadricula de productos; HUF-06 la alimenta con resultados filtrados.

### Paso 1: Cargar productos en el store

```tsx
import { useProductsStore } from "@/app/stores/useProductsStore";

function PosLayout({ products }) {
  const setProducts = useProductsStore((state) => state.setProducts);

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  return (/* ... */);
}
```

### Paso 2: Montar SearchBar y ProductGrid

```tsx
import { SearchBar } from "@/app/components/pos/SearchBar";
import { ProductGrid } from "@/app/components/pos/ProductGrid";

export default function PosPage() {
  return (
    <main>
      <SearchBar />
      <ProductGrid />
    </main>
  );
}
```

`SearchBar` no recibe props: lee y escribe directamente en `useProductsStore`. `ProductGrid` solo renderiza `selectFilteredProducts`; no necesita conocer la logica de busqueda.

### Paso 3: Pagina de referencia

La ruta `/pos` (`app/pos/page.tsx`) incluye un ejemplo funcional con productos de muestra.

## Pruebas

Ejecutar desde `apps/web`:

```bash
npm test
```

Cobertura principal:

| Prueba | Archivo |
|--------|---------|
| Normalizacion y filtrado por nombre/codigo | `app/lib/normalizeSearchText.test.ts` |
| Debounce, empty state y restauracion al limpiar | `app/components/pos/SearchBar.test.tsx` |

