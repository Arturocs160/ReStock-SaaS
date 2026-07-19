import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { createVentaController } from "../controllers/ventaController";
import { validateDataBody } from "../middlewares/verifyData";
import { createVentaSchema } from "../schemas/ventaSchema";

const routerSales: Router = Router();

routerSales.post("/", requireAuth, validateDataBody(createVentaSchema), createVentaController);

export default routerSales;
