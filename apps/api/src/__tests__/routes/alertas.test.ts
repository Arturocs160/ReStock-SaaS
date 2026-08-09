import request from "supertest";
import { app } from "../../index";
import * as alertaServices from "../../services/alertaServices";

jest.mock("../../services/alertaServices");

let mockUser: any = { id: "user-123", id_negocio: "negocio-A", role: "admin" };

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

const VALID_UUID = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";

describe("GET /alertas Route", () => {
  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "admin" };
    jest.clearAllMocks();
  });

  it("should return 200 and the alerts of the authenticated business", async () => {
    const mockAlertas = [
      {
        id_alerta: VALID_UUID,
        id_producto: VALID_UUID,
        fecha_emision: "2026-08-09",
        resuelta: false,
        tipo_alerta: "stock_bajo",
        producto: {
          nombre: "Leche",
          stock_actual: 2,
          stock_minimo_sugerido: 10,
        },
      },
    ];

    (alertaServices.getAlertasService as jest.Mock).mockResolvedValue(mockAlertas);

    const response = await request(app).get("/alertas");

    expect(response.status).toBe(200);
    expect(response.body.alertas).toEqual(mockAlertas);
    expect(alertaServices.getAlertasService).toHaveBeenCalledWith("negocio-A");
  });

  it("should return 401 if unauthenticated", async () => {
    mockUser = null;

    const response = await request(app).get("/alertas");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Sesión inválida o expirada");
    expect(alertaServices.getAlertasService).not.toHaveBeenCalled();
  });

  it("should return 500 if the service fails unexpectedly", async () => {
    (alertaServices.getAlertasService as jest.Mock).mockRejectedValue(
      new Error("Error de base de datos")
    );

    const response = await request(app).get("/alertas");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

describe("GET /alertas/pendientes Route", () => {
  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "admin" };
    jest.clearAllMocks();
  });

  it("should return 200 and only pending alerts", async () => {
    (alertaServices.getAlertasPendientesService as jest.Mock).mockResolvedValue([
      { id_alerta: VALID_UUID, resuelta: false },
    ]);

    const response = await request(app).get("/alertas/pendientes");

    expect(response.status).toBe(200);
    expect(response.body.alertas).toHaveLength(1);
    expect(alertaServices.getAlertasPendientesService).toHaveBeenCalledWith("negocio-A");
  });

  it("should return 401 if unauthenticated", async () => {
    mockUser = null;

    const response = await request(app).get("/alertas/pendientes");

    expect(response.status).toBe(401);
    expect(alertaServices.getAlertasPendientesService).not.toHaveBeenCalled();
  });
});

describe("PATCH /alertas/:id_alerta/resolver Route", () => {
  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "admin" };
    jest.clearAllMocks();
  });

  it("should return 200 and the resolved alert on a successful request", async () => {
    const mockAlerta = {
      id_alerta: VALID_UUID,
      resuelta: true,
    };

    (alertaServices.resolveAlertaService as jest.Mock).mockResolvedValue(mockAlerta);

    const response = await request(app).patch(`/alertas/${VALID_UUID}/resolver`);

    expect(response.status).toBe(200);
    expect(response.body.alerta).toEqual(mockAlerta);
    expect(alertaServices.resolveAlertaService).toHaveBeenCalledWith(VALID_UUID, "negocio-A");
  });

  it("should return 400 if the alert id is not a valid UUID", async () => {
    const response = await request(app).patch("/alertas/no-es-uuid/resolver");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(alertaServices.resolveAlertaService).not.toHaveBeenCalled();
  });

  it("should return 404 if the alert belongs to another business or does not exist", async () => {
    const error = new Error("Alerta no encontrada o no pertenece a tu negocio.");
    (error as any).statusCode = 404;

    (alertaServices.resolveAlertaService as jest.Mock).mockRejectedValue(error);

    const response = await request(app).patch(`/alertas/${VALID_UUID}/resolver`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No encontrado");
  });

  it("should return 401 if unauthenticated", async () => {
    mockUser = null;

    const response = await request(app).patch(`/alertas/${VALID_UUID}/resolver`);

    expect(response.status).toBe(401);
    expect(alertaServices.resolveAlertaService).not.toHaveBeenCalled();
  });

  it("should return 500 if the service fails unexpectedly", async () => {
    (alertaServices.resolveAlertaService as jest.Mock).mockRejectedValue(
      new Error("Error inesperado")
    );

    const response = await request(app).patch(`/alertas/${VALID_UUID}/resolver`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
