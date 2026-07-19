import type { Product } from "@/app/types/product";
import {
  filterProducts,
  normalizeSearchText,
} from "@/app/lib/normalizeSearchText";

const mockProducts: Product[] = [
  { id: "1", nombre: "Café Molido", codigo: "CAF001", precio: 45.5 },
  { id: "2", nombre: "Leche Entera", codigo: "LEC002", precio: 22 },
  { id: "3", nombre: "Pan Dulce", codigo: "PAN003", precio: 15 },
];

describe("normalizeSearchText", () => {
  it("ignora mayusculas", () => {
    expect(normalizeSearchText("CAFE")).toBe("cafe");
  });

  it("ignora acentos", () => {
    expect(normalizeSearchText("Café")).toBe("cafe");
  });

  it("recorta espacios en blanco", () => {
    expect(normalizeSearchText("  leche  ")).toBe("leche");
  });
});

describe("filterProducts", () => {
  it("filtra productos por nombre", () => {
    const results = filterProducts(mockProducts, "leche");

    expect(results).toHaveLength(1);
    expect(results[0]?.nombre).toBe("Leche Entera");
  });

  it("filtra productos por codigo", () => {
    const results = filterProducts(mockProducts, "caf001");

    expect(results).toHaveLength(1);
    expect(results[0]?.codigo).toBe("CAF001");
  });

  it("ignora mayusculas y acentos al filtrar", () => {
    const results = filterProducts(mockProducts, "CAFE");

    expect(results).toHaveLength(1);
    expect(results[0]?.nombre).toBe("Café Molido");
  });

  it("devuelve el catalogo completo cuando la busqueda esta vacia", () => {
    expect(filterProducts(mockProducts, "")).toEqual(mockProducts);
    expect(filterProducts(mockProducts, "   ")).toEqual(mockProducts);
  });

  it("devuelve un arreglo vacio cuando no hay coincidencias", () => {
    expect(filterProducts(mockProducts, "inexistente")).toEqual([]);
  });
});
