import request from "supertest";
import { app } from "../../index";
import * as loteServices from "../../services/loteServices";

jest.mock("../../services/loteServices");

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

describe("POST /lotes/:id_lote/merma Route", () => {
  const validUUID = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";

  beforeEach(() => {
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "collaborator" };
    jest.clearAllMocks();
  });

  it("should return 200 and the registered merma on success", async () => {
    const payload = { cantidad: 5, motivo: "merma_caducidad" };
    const mockMermaResponse = {
      id_merma: "merma-uuid",
      id_lote: validUUID,
      id_producto: "producto-uuid",
      cantidad: 5,
      motivo: "merma_caducidad",
      id_usuario: "user-123",
      fecha_creacion: new Date().toISOString(),
    };

    (loteServices.createMermaService as jest.Mock).mockResolvedValue(mockMermaResponse);

    const response = await request(app).post(`/lotes/${validUUID}/merma`).send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockMermaResponse);
    expect(loteServices.createMermaService).toHaveBeenCalledWith(
      validUUID,
      "negocio-A",
      5,
      "merma_caducidad",
      "user-123"
    );
  });

  it("should return 403 if user belongs to another business (tenant isolation)", async () => {
    const payload = { cantidad: 5, motivo: "merma_caducidad" };
    const error = new Error("No tienes permisos para acceder a este lote.");
    (error as any).statusCode = 403;

    (loteServices.createMermaService as jest.Mock).mockRejectedValue(error);

    const response = await request(app).post(`/lotes/${validUUID}/merma`).send(payload);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("No tienes permisos para acceder a este lote.");
  });

  it("should return 400 if validation fails due to negative quantity", async () => {
    const payload = { cantidad: -3, motivo: "merma_caducidad" };

    const response = await request(app).post(`/lotes/${validUUID}/merma`).send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 if validation fails due to quantity exceeding stock (handled by model/service)", async () => {
    const payload = { cantidad: 20, motivo: "merma_caducidad" };
    const error = new Error("Cantidad de merma inválida o supera el stock disponible.");
    (error as any).statusCode = 400;

    (loteServices.createMermaService as jest.Mock).mockRejectedValue(error);

    const response = await request(app).post(`/lotes/${validUUID}/merma`).send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Cantidad de merma inválida o supera el stock disponible.");
  });

  it("should return 401 if unauthenticated", async () => {
    mockUser = null;
    const payload = { cantidad: 5, motivo: "merma_caducidad" };

    const response = await request(app).post(`/lotes/${validUUID}/merma`).send(payload);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Sesión inválida o expirada");
  });
});
