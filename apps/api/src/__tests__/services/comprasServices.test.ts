import {
  getSugerenciasReabastecimientoService,
  createOrdenCompraService,
} from "../../services/comprasServices";
import * as comprasModel from "../../models/comprasModel";

jest.mock("../../models/comprasModel");

describe("Compras Services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSugerenciasReabastecimientoService", () => {
    it("should return only products where stock_actual is below stock_minimo_sugerido", async () => {
      (comprasModel.getStockConsolidadoPorProductoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "En déficit",
          stock_actual: 3,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 0,
        },
        {
          id_producto: "prod-2",
          nombre: "Stock suficiente",
          stock_actual: 20,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 15,
        },
        {
          id_producto: "prod-3",
          nombre: "En el límite exacto",
          stock_actual: 10,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 8,
        },
      ]);

      const result = await getSugerenciasReabastecimientoService("negocio-A");

      expect(comprasModel.getStockConsolidadoPorProductoModel).toHaveBeenCalledWith("negocio-A");
      expect(result).toHaveLength(1);
      expect(result[0].id_producto).toBe("prod-1");
    });

    it("should calculate deficit as stock_minimo_sugerido minus stock_actual", async () => {
      (comprasModel.getStockConsolidadoPorProductoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "En déficit",
          stock_actual: 3,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 0,
        },
      ]);

      const result = await getSugerenciasReabastecimientoService("negocio-A");

      expect(result[0].deficit).toBe(7);
      expect(result[0].stock_actual).toBe(3);
      expect(result[0].stock_minimo_sugerido).toBe(10);
      expect(result[0].ventas_ultimos_7_dias).toBe(0);
    });

    it("should round the suggested quantity up to multiples of 5", async () => {
      (comprasModel.getStockConsolidadoPorProductoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Déficit 1",
          stock_actual: 9,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 0,
        }, // déficit 1 -> 5
        {
          id_producto: "prod-2",
          nombre: "Déficit 7",
          stock_actual: 3,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 0,
        }, // déficit 7 -> 10
        {
          id_producto: "prod-3",
          nombre: "Déficit 10",
          stock_actual: 0,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 0,
        }, // déficit 10 -> 10
        {
          id_producto: "prod-4",
          nombre: "Déficit 12",
          stock_actual: 0,
          stock_minimo_sugerido: 12,
          ventas_ultimos_7_dias: 0,
        }, // déficit 12 -> 15
      ]);

      const result = await getSugerenciasReabastecimientoService("negocio-A");

      expect(result.map((r: any) => r.cantidad_sugerida)).toEqual([5, 10, 10, 15]);
    });

    it("should use the last 7 days sales as base when they exceed the deficit", async () => {
      (comprasModel.getStockConsolidadoPorProductoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Alta rotación",
          stock_actual: 15,
          stock_minimo_sugerido: 20,
          ventas_ultimos_7_dias: 12,
        }, // max(5, 12) = 12 -> 15
        {
          id_producto: "prod-2",
          nombre: "Baja rotación",
          stock_actual: 0,
          stock_minimo_sugerido: 20,
          ventas_ultimos_7_dias: 3,
        }, // max(20, 3) = 20 -> 20
      ]);

      const result = await getSugerenciasReabastecimientoService("negocio-A");

      expect(result[0].cantidad_sugerida).toBe(15);
      expect(result[1].cantidad_sugerida).toBe(20);
    });

    it("should include products without lotes as zero stock when their minimum is above 0", async () => {
      (comprasModel.getStockConsolidadoPorProductoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Sin lotes",
          stock_actual: 0,
          stock_minimo_sugerido: 8,
          ventas_ultimos_7_dias: 0,
        },
      ]);

      const result = await getSugerenciasReabastecimientoService("negocio-A");

      expect(result).toHaveLength(1);
      expect(result[0].deficit).toBe(8);
      expect(result[0].cantidad_sugerida).toBe(10);
    });

    it("should include products in deficit even with no sales in the last 7 days", async () => {
      (comprasModel.getStockConsolidadoPorProductoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Sin rotación reciente",
          stock_actual: 2,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 0,
        },
      ]);

      const result = await getSugerenciasReabastecimientoService("negocio-A");

      expect(result).toHaveLength(1);
      expect(result[0].ventas_ultimos_7_dias).toBe(0);
      expect(result[0].cantidad_sugerida).toBe(10); // max(8, 0) = 8 -> 10
    });

    it("should return an empty array when no product is in deficit", async () => {
      (comprasModel.getStockConsolidadoPorProductoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Stock suficiente",
          stock_actual: 50,
          stock_minimo_sugerido: 10,
          ventas_ultimos_7_dias: 30,
        },
      ]);

      const result = await getSugerenciasReabastecimientoService("negocio-A");

      expect(result).toEqual([]);
    });
  });

  describe("createOrdenCompraService", () => {
    it("should delegate the order creation to the transactional model with the user's business", async () => {
      const items = [
        { id_producto: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", cantidad: 15 },
        { id_producto: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e", cantidad: 10 },
      ];
      const mockLotes = [
        { id_lote: "lote-1", id_producto: items[0].id_producto, cantidad_inicial: 15 },
        { id_lote: "lote-2", id_producto: items[1].id_producto, cantidad_inicial: 10 },
      ];

      (comprasModel.createOrdenCompraTransactionModel as jest.Mock).mockResolvedValue(mockLotes);

      const result = await createOrdenCompraService("negocio-A", items);

      expect(comprasModel.createOrdenCompraTransactionModel).toHaveBeenCalledWith(
        "negocio-A",
        items
      );
      expect(result).toEqual(mockLotes);
    });

    it("should propagate the model error when the transaction is rolled back", async () => {
      const items = [{ id_producto: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", cantidad: 15 }];
      const error = new Error(
        "El producto con ID a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d no existe, está inactivo o no pertenece a tu negocio."
      );
      (error as any).statusCode = 404;

      (comprasModel.createOrdenCompraTransactionModel as jest.Mock).mockRejectedValue(error);

      await expect(createOrdenCompraService("negocio-A", items)).rejects.toThrow(
        "no existe, está inactivo o no pertenece a tu negocio."
      );
    });
  });
});
