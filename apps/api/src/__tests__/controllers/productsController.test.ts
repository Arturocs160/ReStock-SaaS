import { Request, Response } from "express";
import {
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getProductByBarCodeController,
} from "../../controllers/productsController";
import * as productsServices from "../../services/productsServices";

jest.mock("../../services/productsServices");
jest.mock("../../utils/logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}));

describe("productsController", () => {
  let req: any;
  let res: any;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
    });

    res = {
      status: statusMock,
      json: jsonMock,
    };

    req = {
      params: {},
      body: {},
      user: {
        id_negocio: "negocio-1",
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProductByIdController", () => {
    it("should return 200 and the product", async () => {
      req.params = { id_producto: "prod-1" };

      const mockProduct = {
        id_producto: "prod-1",
        nombre: "Producto prueba",
      };

      (productsServices.getProductsByIdService as jest.Mock).mockResolvedValue(mockProduct);

      await getProductByIdController(req as Request, res as Response);

      expect(productsServices.getProductsByIdService).toHaveBeenCalledWith(
        "negocio-1",
        "prod-1"
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
    });

    it("should return 400 if id_producto is invalid", async () => {
      req.params = {
        id_producto: undefined,
      };

      await getProductByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "ID de producto inválido.",
      });
    });

    it("should return 500 on service error", async () => {
      req.params = {
        id_producto: "prod-1",
      };

      (productsServices.getProductsByIdService as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await getProductByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Error interno del servidor",
      });
    });
  });

  describe("updateProductController", () => {
    it("should return 200 and updated product", async () => {
      req.params = {
        id_producto: "prod-1",
      };

      req.body = {
        codigo_barras: "123456",
        nombre: "Producto actualizado",
        precio_actual: 120,
        stock_minimo_sugerido: 5,
        id_categoria: "cat-1",
      };

      const mockProduct = {
        id_producto: "prod-1",
        ...req.body,
      };

      (productsServices.updateProductService as jest.Mock).mockResolvedValue(mockProduct);

      await updateProductController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
    });

    it("should return 400 if id_producto is invalid", async () => {
      req.params = {
        id_producto: undefined,
      };

      await updateProductController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "ID de producto inválido.",
      });
    });

    it("should return 500 on service error", async () => {
      req.params = {
        id_producto: "prod-1",
      };

      (productsServices.updateProductService as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await updateProductController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Error interno del servidor",
      });
    });
  });

  describe("deleteProductController", () => {
    it("should return 204 on success", async () => {
      req.params = {
        id_producto: "prod-1",
      };

      (productsServices.deleteProductService as jest.Mock).mockResolvedValue({});

      await deleteProductController(req as Request, res as Response);

      expect(productsServices.deleteProductService).toHaveBeenCalledWith(
        "prod-1",
        "negocio-1"
      );

      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it("should return 400 if id_producto is invalid", async () => {
      req.params = {
        id_producto: undefined,
      };

      await deleteProductController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "ID de producto inválido.",
      });
    });

    it("should return 500 on service error", async () => {
      req.params = {
        id_producto: "prod-1",
      };

      (productsServices.deleteProductService as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await deleteProductController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Error interno del servidor",
      });
    });
  });

  describe("getProductByBarCodeController", () => {
    it("should return 200 and product", async () => {
      req.params = {
        codigo_barras: "123456",
      };

      const mockProduct = {
        id_producto: "prod-1",
        codigo_barras: "123456",
      };

      (productsServices.getProductByBarCodeService as jest.Mock).mockResolvedValue(mockProduct);

      await getProductByBarCodeController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
    });

    it("should return 400 if codigo_barras is invalid", async () => {
      req.params = {
        codigo_barras: undefined,
      };

      await getProductByBarCodeController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Código de barras inválido.",
      });
    });

    it("should return 500 on service error", async () => {
      req.params = {
        codigo_barras: "123456",
      };

      (productsServices.getProductByBarCodeService as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await getProductByBarCodeController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Error interno del servidor",
      });
    });
  });
});