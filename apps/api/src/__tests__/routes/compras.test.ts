import request from "supertest";
import { app } from "../../index";
import * as comprasServices from "../../services/comprasServices";

jest.mock("../../services/comprasServices");

let mockUser: any = { id: "user-123", id_negocio: "negocio-A", role: "collaborator" };

jest.mock("../../middlewares/requireAuth", () => ({
  requireAuth: (req: any, res: any, next: any) => {
    if (mockUser) {
      req.user = mockUser;
      next();
    } else {
      res.status(401).json({
        error: "Sesión inválida o expirada",
        message: "No autorizado. Inicia sesión primero.",
      });
    }
  },
}));

describe("GET /api/compras/sugerencias Route", () => {
  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "collaborator" };
    jest.clearAllMocks();
  });

  it("should return 200 and only the products in deficit with their calculated suggestion", async () => {
    const mockSugerencias = [
      {
        id_producto: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        nombre: "Producto en déficit",
        stock_actual: 3,
        stock_minimo_sugerido: 10,
        ventas_ultimos_7_dias: 4,
        deficit: 7,
        cantidad_sugerida: 10,
      },
    ];

    (comprasServices.getSugerenciasReabastecimientoService as jest.Mock).mockResolvedValue(
      mockSugerencias
    );

    const response = await request(app).get("/api/compras/sugerencias");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSugerencias);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].deficit).toBe(
      response.body[0].stock_minimo_sugerido - response.body[0].stock_actual
    );
    expect(comprasServices.getSugerenciasReabastecimientoService).toHaveBeenCalledWith("negocio-A");
  });

  it("should return 200 and an empty array when no product is in deficit", async () => {
    (comprasServices.getSugerenciasReabastecimientoService as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get("/api/compras/sugerencias");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should calculate suggestions only for the authenticated user's business (multi-tenant isolation)", async () => {
    // El servicio solo recibe el id_negocio del usuario autenticado ("negocio-A"),
    // por lo que los productos del "negocio-B" nunca entran al cálculo.
    const mockSugerencias = [
      {
        id_producto: "b2c3d4e5-f6a7-8b9c-8d1e-2f3a4b5c6d7e",
        nombre: "Producto negocio A",
        stock_actual: 0,
        stock_minimo_sugerido: 5,
        ventas_ultimos_7_dias: 0,
        deficit: 5,
        cantidad_sugerida: 5,
      },
    ];

    (comprasServices.getSugerenciasReabastecimientoService as jest.Mock).mockResolvedValue(
      mockSugerencias
    );

    const response = await request(app).get("/api/compras/sugerencias");

    expect(response.status).toBe(200);
    expect(comprasServices.getSugerenciasReabastecimientoService).toHaveBeenCalledWith("negocio-A");
    expect(comprasServices.getSugerenciasReabastecimientoService).not.toHaveBeenCalledWith(
      "negocio-B"
    );
    expect(response.body).toHaveLength(1);
    expect(response.body[0].nombre).toBe("Producto negocio A");
  });

  it("should return 401 if unauthenticated", async () => {
    mockUser = null;

    const response = await request(app).get("/api/compras/sugerencias");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Sesión inválida o expirada");
    expect(comprasServices.getSugerenciasReabastecimientoService).not.toHaveBeenCalled();
  });

  it("should return 500 if the service fails unexpectedly", async () => {
    (comprasServices.getSugerenciasReabastecimientoService as jest.Mock).mockRejectedValue(
      new Error("Error de base de datos")
    );

    const response = await request(app).get("/api/compras/sugerencias");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

describe("POST /api/compras/orden Route", () => {
  const validUUID = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";
  const validUUID2 = "b2c3d4e5-f6a7-8b9c-8d1e-2f3a4b5c6d7e";

  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "collaborator" };
    jest.clearAllMocks();
  });

  it("should return 201 and the created lotes on a successful order", async () => {
    const payload = [
      { id_producto: validUUID, cantidad: 15 },
      { id_producto: validUUID2, cantidad: 10 },
    ];

    const mockLotes = [
      {
        id_lote: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
        id_producto: validUUID,
        codigo_lote: "LOTE-20260128-A1B2",
        fecha_ingreso: "2026-01-28",
        fecha_caducidad: null,
        cantidad_inicial: 15,
        activo: true,
      },
      {
        id_lote: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
        id_producto: validUUID2,
        codigo_lote: "LOTE-20260128-C3D4",
        fecha_ingreso: "2026-01-28",
        fecha_caducidad: null,
        cantidad_inicial: 10,
        activo: true,
      },
    ];

    (comprasServices.createOrdenCompraService as jest.Mock).mockResolvedValue(mockLotes);

    const response = await request(app).post("/api/compras/orden").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ lotes: mockLotes });
    expect(comprasServices.createOrdenCompraService).toHaveBeenCalledWith("negocio-A", payload);
  });

  it("should return 400 if the array is empty", async () => {
    const response = await request(app).post("/api/compras/orden").send([]);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(comprasServices.createOrdenCompraService).not.toHaveBeenCalled();
  });

  it("should return 400 if a quantity is less than or equal to 0", async () => {
    const payload = [{ id_producto: validUUID, cantidad: 0 }];

    const response = await request(app).post("/api/compras/orden").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(comprasServices.createOrdenCompraService).not.toHaveBeenCalled();
  });

  it("should return 400 if a required field is missing", async () => {
    const payload = [{ cantidad: 15 }];

    const response = await request(app).post("/api/compras/orden").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(comprasServices.createOrdenCompraService).not.toHaveBeenCalled();
  });

  it("should return 400 if id_producto is not a valid UUID", async () => {
    const payload = [{ id_producto: "no-es-un-uuid", cantidad: 15 }];

    const response = await request(app).post("/api/compras/orden").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(comprasServices.createOrdenCompraService).not.toHaveBeenCalled();
  });

  it("should return 404 if a product belongs to another business (multi-tenant insertion control)", async () => {
    const payload = [{ id_producto: validUUID, cantidad: 15 }];
    const error = new Error(
      `El producto con ID ${validUUID} no existe, está inactivo o no pertenece a tu negocio.`
    );
    (error as any).statusCode = 404;

    (comprasServices.createOrdenCompraService as jest.Mock).mockRejectedValue(error);

    const response = await request(app).post("/api/compras/orden").send(payload);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      `El producto con ID ${validUUID} no existe, está inactivo o no pertenece a tu negocio.`
    );
  });

  it("should return an error and create no lote when one item fails (transactional all-or-nothing)", async () => {
    const invalidUUID = "e5f6a7b8-c9d0-1e2f-8a4b-5c6d7e8f9a0b";
    const payload = [
      { id_producto: validUUID, cantidad: 15 },
      { id_producto: validUUID2, cantidad: 10 },
      { id_producto: invalidUUID, cantidad: 5 },
    ];

    // El servicio ejecuta la transacción completa; al fallar el tercer producto
    // se hace ROLLBACK y no se inserta ningún lote.
    const error = new Error(
      `El producto con ID ${invalidUUID} no existe, está inactivo o no pertenece a tu negocio.`
    );
    (error as any).statusCode = 404;

    (comprasServices.createOrdenCompraService as jest.Mock).mockRejectedValue(error);

    const response = await request(app).post("/api/compras/orden").send(payload);

    expect(response.status).toBe(404);
    expect(response.body).not.toHaveProperty("lotes");
    expect(comprasServices.createOrdenCompraService).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if unauthenticated", async () => {
    mockUser = null;
    const payload = [{ id_producto: validUUID, cantidad: 15 }];

    const response = await request(app).post("/api/compras/orden").send(payload);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Sesión inválida o expirada");
    expect(comprasServices.createOrdenCompraService).not.toHaveBeenCalled();
  });
});
