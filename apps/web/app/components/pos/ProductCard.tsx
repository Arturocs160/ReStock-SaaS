import type { Product } from "@/app/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#00a365]">
        {product.codigo}
      </p>
      <h3 className="mt-2 text-base font-bold text-gray-900">{product.nombre}</h3>
      <p className="mt-3 text-lg font-extrabold text-gray-800">
        ${product.precio.toFixed(2)}
      </p>
    </article>
  );
}
