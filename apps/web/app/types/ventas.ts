import { z } from 'zod';
import { Producto, LoteInventario } from './inventario';

export const CartItemSchema = z.object({
  loteId: z.string(),
  productoId: z.string(),
  codigo_lote: z.string(),
  nombre_producto: z.string(),
  precio_unitario: z.number(),
  cantidad: z.number().min(1, "La cantidad mínima es 1"),
  stock_disponible: z.number().min(0, "El stock no puede ser negativo"),
  subtotal: z.number().min(0),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export interface CartStore {
  items: CartItem[];
  total: number;
  addLote: (lote: LoteInventario, producto: Producto) => void;
  incrementQuantity: (loteId: string) => void;
  decrementQuantity: (loteId: string) => void;
  updateQuantity: (loteId: string, cantidad: number) => void;
  removeLote: (loteId: string) => void;
  clearCart: () => void;
}
