import request from "supertest";
import { app } from "../../index";
import * as ventaModel from "../../models/ventaModel";

jest.mock("../../models/ventaModel", () => ({
  getVentasMetricasModel: jest.fn(),
  getVentasHistorialModel: jest.fn(),
  createVentaTransactionModel: jest.fn(),
}));

let mockUser: any = { id: "user-123", id_negocio: "negocio-A", role: "admin" };

jest.mock("../../middlewares/requireAuth", () => ({
  requireAuth: (req: any, res: any, next: any) => {
    if (mockUser) {
      req.user = mockUser;
      next();
      return;
    }

    res.status(401).json({
      error: "SesiÃ³n invÃ¡lida o expirada",
      message: "No autorizado. Inicia sesiÃ³n primero.",
    });
  },
}));

describe("GET /api/ventas/metricas Route", () => {
  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "admin" };
    jest.clearAllMocks();
  });

  it("should return calculated sales KPIs for the authenticated business", async () => {
    (ventaModel.getVentasMetricasModel as jest.Mock).mockResolvedValue({
      ingresos: "300.5",
      transacciones: "3",
      ticket_promedio: "100.1666666667",
    });

    const response = await request(app).get("/api/ventas/metricas");

    expect(response.status).toBe(200);
    expect(response.body.metricas).toEqual({
      ingresos: 300.5,
      transacciones: 3,
      ticket_promedio: 100.1666666667,
    });
    expect(ventaModel.getVentasMetricasModel).toHaveBeenCalledWith("negocio-A");
  });

  it("should return 401 when metrics request has no valid token", async () => {
    mockUser = null;

    const response = await request(app).get("/api/ventas/metricas");

    expect(response.status).toBe(401);
    expect(ventaModel.getVentasMetricasModel).not.toHaveBeenCalled();
  });
});

describe("GET /api/ventas/historial Route", () => {
  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "admin" };
    jest.clearAllMocks();
  });

  it("should return sales history grouped with details", async () => {
    (ventaModel.getVentasHistorialModel as jest.Mock).mockResolvedValue([
      createHistoryRow({
        id_venta: "venta-1",
        id_detalle: "detalle-1",
        producto_nombre: "Leche",
        subtotal: 50,
      }),
      createHistoryRow({
        id_venta: "venta-1",
        id_detalle: "detalle-2",
        producto_nombre: "Pan",
        subtotal: 30,
      }),
    ]);

    const response = await request(app).get("/api/ventas/historial");

    expect(response.status).toBe(200);
    expect(response.body.ventas).toHaveLength(1);
    expect(response.body.ventas[0]).toEqual(
      expect.objectContaining({
        id_venta: "venta-1",
        id_negocio: "negocio-A",
        total: 80,
      })
    );
    expect(response.body.ventas[0].detalles).toHaveLength(2);
    expect(ventaModel.getVentasHistorialModel).toHaveBeenCalledWith("negocio-A", undefined);
  });

  it("should apply search query after tenant isolation", async () => {
    (ventaModel.getVentasHistorialModel as jest.Mock).mockResolvedValue([
      createHistoryRow({ id_venta: "venta-filtrada", producto_nombre: "Arroz" }),
    ]);

    const response = await request(app).get("/api/ventas/historial?q=arroz");

    expect(response.status).toBe(200);
    expect(response.body.ventas[0].id_venta).toBe("venta-filtrada");
    expect(ventaModel.getVentasHistorialModel).toHaveBeenCalledWith("negocio-A", "arroz");
  });

  it("should isolate sales by the authenticated business", async () => {
    (ventaModel.getVentasHistorialModel as jest.Mock).mockResolvedValue([
      createHistoryRow({ id_negocio: "negocio-A" }),
    ]);

    const response = await request(app).get("/api/ventas/historial");

    expect(response.status).toBe(200);
    expect(response.body.ventas).toHaveLength(1);
    expect(response.body.ventas[0].id_negocio).toBe("negocio-A");
    expect(ventaModel.getVentasHistorialModel).toHaveBeenCalledWith("negocio-A", undefined);
  });

  it("should return 401 when history request has no valid token", async () => {
    mockUser = null;

    const response = await request(app).get("/api/ventas/historial");

    expect(response.status).toBe(401);
    expect(ventaModel.getVentasHistorialModel).not.toHaveBeenCalled();
  });
});

function createHistoryRow(overrides: Record<string, any> = {}) {
  return {
    id_venta: "venta-1",
    id_negocio: "negocio-A",
    userid: "user-123",
    fecha_transaccion: "2026-07-30T10:00:00.000Z",
    cajero_nombre: "Cajero Uno",
    cajero_email: "cajero@restock.test",
    id_detalle: "detalle-1",
    id_lote: "lote-1",
    cantidad_sold: 2,
    precio_unitario: 25,
    subtotal: 50,
    codigo_lote: "L-001",
    id_producto: "producto-1",
    producto_nombre: "Leche",
    codigo_barras: "750000000001",
    ...overrides,
  };
}
