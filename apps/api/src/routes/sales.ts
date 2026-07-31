import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  createVentaController,
  getVentasHistorialController,
  getVentasMetricasController,
} from "../controllers/ventaController";
import { validateDataBody } from "../middlewares/verifyData";
import { createVentaSchema } from "../schemas/ventaSchema";

const routerSales: Router = Router();

routerSales.get("/metricas", requireAuth, getVentasMetricasController);
routerSales.get("/historial", requireAuth, getVentasHistorialController);
routerSales.post("/", requireAuth, validateDataBody(createVentaSchema), createVentaController);

export default routerSales;
