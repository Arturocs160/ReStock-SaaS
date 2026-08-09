import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  getAlertasController,
  getAlertasPendientesController,
  resolveAlertaController,
} from "../controllers/alertaController";
import { validateDataParams } from "../middlewares/verifyData";
import { alertaIdParamSchema } from "../schemas/alertaSchema";

const routerAlertas: Router = Router();

routerAlertas.get("/", requireAuth, getAlertasController);
routerAlertas.get("/pendientes", requireAuth, getAlertasPendientesController);
routerAlertas.patch(
  "/:id_alerta/resolver",
  requireAuth,
  validateDataParams(alertaIdParamSchema),
  resolveAlertaController
);

export default routerAlertas;
