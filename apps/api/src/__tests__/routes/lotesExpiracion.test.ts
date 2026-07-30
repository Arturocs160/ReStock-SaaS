import request from "supertest";
import { app } from "../../index";
import * as loteModel from "../../models/loteModel";

jest.mock("../../models/loteModel", () => ({
  getLotesExpiracionModel: jest.fn(),
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

describe("GET /api/lotes/expiracion Route", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-07-26T12:00:00.000Z"));
    mockUser = { id: "user-123", id_negocio: "negocio-A", role: "admin" };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return active lots with the correct expiration classification", async () => {
    (loteModel.getLotesExpiracionModel as jest.Mock).mockResolvedValue([
      createRow({ id_lote: "lote-vencido", fecha_caducidad: "2026-07-25" }),
      createRow({ id_lote: "lote-critico", fecha_caducidad: "2026-08-02" }),
      createRow({ id_lote: "lote-proximo", fecha_caducidad: "2026-08-20" }),
      createRow({ id_lote: "lote-vigente", fecha_caducidad: "2026-09-15" }),
      createRow({ id_lote: "lote-sin-fecha", fecha_caducidad: null }),
    ]);

    const response = await request(app).get("/api/lotes/expiracion");

    expect(response.status).toBe(200);
    expect(response.body.lotes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id_lote: "lote-vencido",
          dias_para_caducar: -1,
          clasificacion_vencimiento: "vencido",
        }),
        expect.objectContaining({
          id_lote: "lote-critico",
          dias_para_caducar: 7,
          clasificacion_vencimiento: "critico",
        }),
        expect.objectContaining({
          id_lote: "lote-proximo",
          dias_para_caducar: 25,
          clasificacion_vencimiento: "proximo",
        }),
        expect.objectContaining({
          id_lote: "lote-vigente",
          dias_para_caducar: 51,
          clasificacion_vencimiento: "vigente",
        }),
        expect.objectContaining({
          id_lote: "lote-sin-fecha",
          dias_para_caducar: null,
          clasificacion_vencimiento: "sin_fecha",
        }),
      ])
    );
    expect(response.body.lotes[0].producto).toEqual(
      expect.objectContaining({ id_negocio: "negocio-A", nombre: "Leche" })
    );
  });

  it("should isolate lots by the authenticated business", async () => {
    (loteModel.getLotesExpiracionModel as jest.Mock).mockResolvedValue([
      createRow({ id_lote: "lote-negocio-A", id_negocio: "negocio-A" }),
    ]);

    const response = await request(app).get("/api/lotes/expiracion");

    expect(response.status).toBe(200);
    expect(loteModel.getLotesExpiracionModel).toHaveBeenCalledWith("negocio-A");
    expect(response.body.lotes).toHaveLength(1);
    expect(response.body.lotes[0].producto.id_negocio).toBe("negocio-A");
  });

  it("should preserve expiration ordering with null dates at the end", async () => {
    (loteModel.getLotesExpiracionModel as jest.Mock).mockResolvedValue([
      createRow({ id_lote: "lote-primero", fecha_caducidad: "2026-07-28" }),
      createRow({ id_lote: "lote-segundo", fecha_caducidad: "2026-08-10" }),
      createRow({ id_lote: "lote-sin-fecha", fecha_caducidad: null }),
    ]);

    const response = await request(app).get("/api/lotes/expiracion");

    expect(response.status).toBe(200);
    expect(response.body.lotes.map((lote: any) => lote.id_lote)).toEqual([
      "lote-primero",
      "lote-segundo",
      "lote-sin-fecha",
    ]);
  });

  it("should return 401 when there is no valid token", async () => {
    mockUser = null;

    const response = await request(app).get("/api/lotes/expiracion");

    expect(response.status).toBe(401);
    expect(loteModel.getLotesExpiracionModel).not.toHaveBeenCalled();
  });
});

function createRow(overrides: Record<string, any> = {}) {
  return {
    id_lote: "lote-1",
    id_producto: "producto-1",
    codigo_lote: "L-001",
    fecha_ingreso: "2026-07-01",
    fecha_caducidad: "2026-08-01",
    cantidad_inicial: 20,
    cantidad_actual: 10,
    id_negocio: "negocio-A",
    codigo_barras: "750000000001",
    producto_nombre: "Leche",
    precio_actual: 25.5,
    stock_minimo_sugerido: 5,
    id_categoria: "categoria-1",
    ...overrides,
  };
}
