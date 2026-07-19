import type { Product } from "@/app/types/product";

const DIACRITIC_REGEX = /[\u0300-\u036f]/g;

export function normalizeSearchText(text: string): string {
  return text.normalize("NFD").replace(DIACRITIC_REGEX, "").toLowerCase().trim();
}

export function filterProducts(products: Product[], query: string): Product[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const normalizedName = normalizeSearchText(product.nombre);
    const normalizedCode = normalizeSearchText(product.codigo);

    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedCode.includes(normalizedQuery)
    );
  });
}
