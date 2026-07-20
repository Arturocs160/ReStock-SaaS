import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import {
  createLoteController,
  deleteLoteController,
  getLoteByIdController,
  getLotesByProductIdController,
  updateLoteController,
} from "../controllers/loteController";
import { validateDataBody, validateDataParams } from "../middlewares/verifyData";
import { createLoteSchema, updateLoteSchema, loteIdParamSchema } from "../schemas/lotesSchema";
import { productoIdParamSchema } from "../schemas/productsSchema";

const routerLote: Router = Router();

routerLote.post(
  "/",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataBody(createLoteSchema),
  createLoteController
);
routerLote.get(
  "/product/:id_producto",
  requireAuth,
  validateDataParams(productoIdParamSchema),
  getLotesByProductIdController
);
routerLote.get(
  "/:id_lote",
  requireAuth,
  validateDataParams(loteIdParamSchema),
  getLoteByIdController
);
routerLote.put(
  "/:id_lote",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataParams(loteIdParamSchema),
  validateDataBody(updateLoteSchema),
  updateLoteController
);
routerLote.delete(
  "/:id_lote",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataParams(loteIdParamSchema),
  deleteLoteController
);

export default routerLote;
