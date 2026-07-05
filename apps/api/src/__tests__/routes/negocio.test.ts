import request from "supertest";
import { app } from "../../index";
import * as negocioServices from "../../services/negocioServices";

// Mock del servicio
jest.mock("../../services/negocioServices");

// Mock de requireAuth para simular sesión iniciada y inyectar req.user
jest.mock("../../middlewares/requireAuth", () => ({
  requireAuth: (req: any, res: any, next: any) => {
    req.user = { id_negocio: "uuid-negocio-123", role: "admin" };
    next();
  },
}));

describe("PUT /negocio Route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the updated business on success", async () => {
    const validData = { nombre: "Nuevo Nombre", subdominio: "nuevo-subdominio" };
    const mockResponse = {
      id_negocio: "uuid-negocio-123",
      nombre: "Nuevo Nombre",
      subdominio: "nuevo-subdominio",
      activo: true,
    };

    (negocioServices.updateNegocioService as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app).put("/negocio").send(validData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
    expect(negocioServices.updateNegocioService).toHaveBeenCalledWith(
      "uuid-negocio-123",
      "Nuevo Nombre",
      "nuevo-subdominio"
    );
  });

  it("should return 400 if validation fails (empty fields)", async () => {
    const invalidData = { nombre: "", subdominio: "nuevo-subdominio" };

    const response = await request(app).put("/negocio").send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 409 if subdomain conflict occurs", async () => {
    const validData = { nombre: "Nuevo Nombre", subdominio: "conflictivo" };

    const error = new Error("El subdominio ya está asignado a otro negocio");
    (error as any).statusCode = 409;

    (negocioServices.updateNegocioService as jest.Mock).mockRejectedValue(error);

    const response = await request(app).put("/negocio").send(validData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("El subdominio ya está asignado a otro negocio");
  });

  it("should return 500 if an unhandled service error occurs", async () => {
    const validData = { nombre: "Nuevo Nombre", subdominio: "nuevo-subdominio" };

    (negocioServices.updateNegocioService as jest.Mock).mockRejectedValue(
      new Error("Database breakdown")
    );

    const response = await request(app).put("/negocio").send(validData);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error interno del servidor");
  });
});
