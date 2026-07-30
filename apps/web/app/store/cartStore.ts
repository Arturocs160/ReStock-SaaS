import { create } from "zustand";
import { CartStore, CartItem } from "../types/ventas";

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.subtotal, 0);
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,

  addLote: (lote, producto) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.loteId === lote.id_lote,
      );

      if (existingItemIndex >= 0) {
        // Lote ya existe, incrementar si hay stock
        const newItems = [...state.items];
        const item = newItems[existingItemIndex];

        if (item.cantidad < item.stock_disponible) {
          item.cantidad += 1;
          item.subtotal = item.cantidad * item.precio_unitario;
        }

        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }

      // Nuevo lote en el carrito
      const newItem: CartItem = {
        loteId: lote.id_lote,
        productoId: producto.id_producto,
        codigo_lote: lote.codigo_lote,
        nombre_producto: producto.nombre,
        precio_unitario: producto.precio_actual,
        cantidad: 1,
        stock_disponible: lote.cantidad_actual,
        subtotal: producto.precio_actual * 1,
      };

      const newItems = [...state.items, newItem];
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }),

  incrementQuantity: (loteId) =>
    set((state) => {
      const newItems = state.items.map((item) => {
        if (item.loteId === loteId && item.cantidad < item.stock_disponible) {
          const newQuantity = item.cantidad + 1;
          return {
            ...item,
            cantidad: newQuantity,
            subtotal: newQuantity * item.precio_unitario,
          };
        }
        return item;
      });
      return { items: newItems, total: calculateTotal(newItems) };
    }),

  decrementQuantity: (loteId) =>
    set((state) => {
      const newItems = state.items.map((item) => {
        if (item.loteId === loteId && item.cantidad > 1) {
          const newQuantity = item.cantidad - 1;
          return {
            ...item,
            cantidad: newQuantity,
            subtotal: newQuantity * item.precio_unitario,
          };
        }
        return item;
      });
      return { items: newItems, total: calculateTotal(newItems) };
    }),

  updateQuantity: (loteId, cantidad) =>
    set((state) => {
      const newItems = state.items.map((item) => {
        if (item.loteId === loteId) {
          // Asegurar que la cantidad esté entre 1 y el stock disponible
          let validQuantity = Math.max(1, cantidad);
          validQuantity = Math.min(validQuantity, item.stock_disponible);

          return {
            ...item,
            cantidad: validQuantity,
            subtotal: validQuantity * item.precio_unitario,
          };
        }
        return item;
      });
      return { items: newItems, total: calculateTotal(newItems) };
    }),

  removeLote: (loteId) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.loteId !== loteId);
      return { items: newItems, total: calculateTotal(newItems) };
    }),

  clearCart: () => set({ items: [], total: 0 }),
}));
