import { Request, Response } from "express";
import {
  createLoteController,
  getLotesByProductIdController,
  getLoteByIdController,
  updateLoteController,
  deleteLoteController,
} from "../../controllers/loteController";
import * as loteServices from "../../services/loteServices";

jest.mock("../../services/loteServices");
jest.mock("../../utils/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe("loteController", () => {
  let req: any;
  let res: any;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
      json: jsonMock,
    };
    req = {
      body: {},
      params: {},
      user: { id_negocio: "negocio-1" },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createLoteController", () => {
    it("should return 201 and the created lote", async () => {
      req.body = {
        id_producto: "prod-1",
        codigo_lote: "LOTE-001",
        fecha_ingreso: new Date("2023-01-01"),
        fecha_caducidad: new Date("2024-01-01"),
        cantidad_inicial: 100,
      };

      const mockLote = { id_lote: "lote-1", ...req.body };
      (loteServices.createLoteService as jest.Mock).mockResolvedValue(mockLote);

      await createLoteController(req as Request, res as Response);

      expect(loteServices.createLoteService).toHaveBeenCalledWith(
        "prod-1",
        "LOTE-001",
        req.body.fecha_ingreso,
        req.body.fecha_caducidad,
        100
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockLote);
    });

    it("should return 500 if an error occurs", async () => {
      (loteServices.createLoteService as jest.Mock).mockRejectedValue(new Error("Service error"));

      await createLoteController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Service error" });
    });
  });

  describe("getLotesByProductIdController", () => {
    it("should return 200 and lotes array", async () => {
      req.params = { id_producto: "prod-1" };

      const mockLotes = [{ id_lote: "lote-1" }];
      (loteServices.getLotesByProductIdService as jest.Mock).mockResolvedValue(mockLotes);

      await getLotesByProductIdController(req as Request, res as Response);

      expect(loteServices.getLotesByProductIdService).toHaveBeenCalledWith("prod-1", "negocio-1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockLotes);
    });

    it("should return 500 on service error", async () => {
      req.params = { id_producto: "prod-1" };
      (loteServices.getLotesByProductIdService as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await getLotesByProductIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Service error" });
    });
  });

  describe("getLoteByIdController", () => {
    it("should return 200 and the lote", async () => {
      req.params = { id_lote: "lote-1" };

      const mockLote = { id_lote: "lote-1", id_producto: "prod-1" };
      (loteServices.getLoteByIdService as jest.Mock).mockResolvedValue(mockLote);

      await getLoteByIdController(req as Request, res as Response);

      expect(loteServices.getLoteByIdService).toHaveBeenCalledWith("lote-1", "negocio-1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockLote);
    });

    it("should return 400 if id_lote is not a string", async () => {
      req.params = { id_lote: 123 };

      await getLoteByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "ID de lote inválido." });
    });

    it("should return 500 on service error", async () => {
      req.params = { id_lote: "lote-1" };
      (loteServices.getLoteByIdService as jest.Mock).mockRejectedValue(new Error("Service error"));

      await getLoteByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Service error" });
    });
  });

  describe("updateLoteController", () => {
    it("should return 200 and updated lote", async () => {
      req.params = { id_lote: "lote-1" };
      req.body = {
        codigo_lote: "LOTE-NEW",
        fecha_ingreso: "2023-01-01",
        fecha_caducidad: "2024-01-01",
        cantidad_inicial: 200,
      };

      const mockLote = { id_lote: "lote-1", ...req.body };
      (loteServices.updateLoteService as jest.Mock).mockResolvedValue(mockLote);

      await updateLoteController(req as Request, res as Response);

      expect(loteServices.updateLoteService).toHaveBeenCalledWith(
        "lote-1",
        "negocio-1",
        "LOTE-NEW",
        "2023-01-01",
        "2024-01-01",
        200
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockLote);
    });

    it("should return 400 if id_lote is invalid", async () => {
      req.params = { id_lote: undefined };

      await updateLoteController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "ID de lote inválido." });
    });

    it("should return 500 on service error", async () => {
      req.params = { id_lote: "lote-1" };
      (loteServices.updateLoteService as jest.Mock).mockRejectedValue(new Error("Service error"));

      await updateLoteController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Service error" });
    });
  });

  describe("deleteLoteController", () => {
    it("should return 204 on success", async () => {
      req.params = { id_lote: "lote-1" };

      (loteServices.deleteLoteService as jest.Mock).mockResolvedValue({ success: true });

      await deleteLoteController(req as Request, res as Response);

      expect(loteServices.deleteLoteService).toHaveBeenCalledWith("lote-1", "negocio-1");
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(jsonMock).toHaveBeenCalledWith({ success: true });
    });

    it("should return 400 if id_lote is invalid", async () => {
      req.params = { id_lote: 123 };

      await deleteLoteController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "ID de lote inválido." });
    });

    it("should return 500 on service error", async () => {
      req.params = { id_lote: "lote-1" };
      (loteServices.deleteLoteService as jest.Mock).mockRejectedValue(new Error("Service error"));

      await deleteLoteController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Service error" });
    });
  });
});
