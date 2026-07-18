import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { updateNegocioController } from "../controllers/negocioController";
import { validateDataBody } from "../middlewares/verifyData";
import { updateNegocioSchema } from "../schemas/negocioSchema";

const routerNegocio: Router = Router();

// PUT /api/negocio
routerNegocio.put("/", requireAuth, validateDataBody(updateNegocioSchema), updateNegocioController);

export default routerNegocio;
