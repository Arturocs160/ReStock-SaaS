import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import { validateDataBody } from "../middlewares/verifyData";
import {
  getSugerenciasController,
  createOrdenCompraController,
} from "../controllers/comprasController";
import { createOrdenCompraSchema } from "../schemas/comprasSchema";

const routerCompras: Router = Router();

routerCompras.get("/sugerencias", requireAuth, getSugerenciasController);
routerCompras.post(
  "/orden",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataBody(createOrdenCompraSchema),
  createOrdenCompraController
);

export default routerCompras;
