import { detectarYCrearAlertasService, resolveAlertaService } from "../../services/alertaServices";
import * as alertaModel from "../../models/alertaModel";
import * as userRepository from "../../repositories/user.repository";
import * as negocioModel from "../../models/negocioModel";
import * as mailService from "../../services/mailService";

jest.mock("../../models/alertaModel");
jest.mock("../../repositories/user.repository");
jest.mock("../../models/negocioModel");
jest.mock("../../services/mailService");

describe("Alerta Services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("detectarYCrearAlertasService", () => {
    it("should not create alerts when no product is below its minimum stock", async () => {
      (alertaModel.getProductosBajoMinimoModel as jest.Mock).mockResolvedValue([]);

      const result = await detectarYCrearAlertasService("negocio-A");

      expect(alertaModel.getProductosBajoMinimoModel).toHaveBeenCalledWith("negocio-A");
      expect(alertaModel.ensureTipoAlertaStockBajoModel).not.toHaveBeenCalled();
      expect(alertaModel.createAlertaIfNotOpenModel).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should create one alert per low-stock product", async () => {
      const lowStockProducts = [
        {
          id_producto: "prod-1",
          nombre: "Leche",
          stock_actual: 2,
          stock_minimo_sugerido: 10,
        },
        {
          id_producto: "prod-2",
          nombre: "Pan",
          stock_actual: 0,
          stock_minimo_sugerido: 5,
        },
      ];

      (alertaModel.getProductosBajoMinimoModel as jest.Mock).mockResolvedValue(lowStockProducts);
      (alertaModel.ensureTipoAlertaStockBajoModel as jest.Mock).mockResolvedValue(
        "tipo-stock-bajo"
      );
      (alertaModel.createAlertaIfNotOpenModel as jest.Mock).mockResolvedValueOnce({
        id_alerta: "alerta-1",
        id_producto: "prod-1",
      });
      (alertaModel.createAlertaIfNotOpenModel as jest.Mock).mockResolvedValueOnce({
        id_alerta: "alerta-2",
        id_producto: "prod-2",
      });

      const result = await detectarYCrearAlertasService("negocio-A");

      expect(alertaModel.createAlertaIfNotOpenModel).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0].id_alerta).toBe("alerta-1");
      expect(result[1].id_alerta).toBe("alerta-2");
    });

    it("should not duplicate an open alert for the same product", async () => {
      (alertaModel.getProductosBajoMinimoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Leche",
          stock_actual: 2,
          stock_minimo_sugerido: 10,
        },
      ]);
      (alertaModel.ensureTipoAlertaStockBajoModel as jest.Mock).mockResolvedValue(
        "tipo-stock-bajo"
      );
      (alertaModel.createAlertaIfNotOpenModel as jest.Mock).mockResolvedValue(null);

      const result = await detectarYCrearAlertasService("negocio-A");

      expect(result).toEqual([]);
      expect(mailService.sendLowStockAlertsEmail).not.toHaveBeenCalled();
    });

    it("should send an email summary to admins when new alerts are created", async () => {
      (alertaModel.getProductosBajoMinimoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Leche",
          stock_actual: 2,
          stock_minimo_sugerido: 10,
        },
      ]);
      (alertaModel.ensureTipoAlertaStockBajoModel as jest.Mock).mockResolvedValue(
        "tipo-stock-bajo"
      );
      (alertaModel.createAlertaIfNotOpenModel as jest.Mock).mockResolvedValue({
        id_alerta: "alerta-1",
        id_producto: "prod-1",
      });
      (negocioModel.getNegocioByIdModel as jest.Mock).mockResolvedValue({
        id_negocio: "negocio-A",
        nombre: "Tienda Demo",
        email_comercial: "comercial@demo.com",
      });
      (userRepository.userRepository.findUsersByTenantId as jest.Mock).mockResolvedValue([
        { id: "admin-1", email: "admin@demo.com", role: "admin" },
        { id: "cashier-1", email: "cajero@demo.com", role: "cashier" },
      ]);

      const result = await detectarYCrearAlertasService("negocio-A");

      expect(result).toHaveLength(1);
      expect(mailService.sendLowStockAlertsEmail).toHaveBeenCalledWith({
        to: ["admin@demo.com", "comercial@demo.com"],
        negocioNombre: "Tienda Demo",
        productos: [
          {
            nombre: "Leche",
            stock_actual: 2,
            stock_minimo_sugerido: 10,
          },
        ],
      });
    });

    it("should not fail if the email service throws", async () => {
      (alertaModel.getProductosBajoMinimoModel as jest.Mock).mockResolvedValue([
        {
          id_producto: "prod-1",
          nombre: "Leche",
          stock_actual: 2,
          stock_minimo_sugerido: 10,
        },
      ]);
      (alertaModel.ensureTipoAlertaStockBajoModel as jest.Mock).mockResolvedValue(
        "tipo-stock-bajo"
      );
      (alertaModel.createAlertaIfNotOpenModel as jest.Mock).mockResolvedValue({
        id_alerta: "alerta-1",
        id_producto: "prod-1",
      });
      (negocioModel.getNegocioByIdModel as jest.Mock).mockResolvedValue({
        id_negocio: "negocio-A",
        nombre: "Tienda Demo",
      });
      (userRepository.userRepository.findUsersByTenantId as jest.Mock).mockResolvedValue([
        { id: "admin-1", email: "admin@demo.com", role: "admin" },
      ]);
      (mailService.sendLowStockAlertsEmail as jest.Mock).mockRejectedValue(
        new Error("Resend caído")
      );

      const result = await detectarYCrearAlertasService("negocio-A");

      expect(result).toHaveLength(1);
    });
  });

  describe("resolveAlertaService", () => {
    it("should resolve an alert that belongs to the business", async () => {
      (alertaModel.resolveAlertaModel as jest.Mock).mockResolvedValue({
        id_alerta: "alerta-1",
        resuelta: true,
      });

      const result = await resolveAlertaService("alerta-1", "negocio-A");

      expect(alertaModel.resolveAlertaModel).toHaveBeenCalledWith("alerta-1", "negocio-A");
      expect(result.resuelta).toBe(true);
    });

    it("should throw 404 when the alert is not found or belongs to another business", async () => {
      (alertaModel.resolveAlertaModel as jest.Mock).mockResolvedValue(null);

      await expect(resolveAlertaService("alerta-x", "negocio-A")).rejects.toThrow(
        "Alerta no encontrada o no pertenece a tu negocio."
      );
    });
  });
});
