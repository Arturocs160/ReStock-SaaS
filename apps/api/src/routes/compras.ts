import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import { validateDataBody } from "../middlewares/verifyData";
import {
  getSugerenciasController,
  generarListaReabastecimientoController,
} from "../controllers/comprasController";
import { createOrdenCompraSchema } from "../schemas/comprasSchema";

const routerCompras: Router = Router();

routerCompras.get("/sugerencias", requireAuth, getSugerenciasController);
routerCompras.post(
  "/orden",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataBody(createOrdenCompraSchema),
  generarListaReabastecimientoController
);

export default routerCompras;
