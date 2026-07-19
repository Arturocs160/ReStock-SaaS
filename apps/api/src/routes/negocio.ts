import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { validateDataBody } from "../middlewares/verifyData";
import { updateNegocioSchema } from "../schemas/negocioSchema";
import { updateNegocioController } from "../controllers/negocioController";

const routerNegocio: Router = Router();

routerNegocio.put("/", requireAuth, validateDataBody(updateNegocioSchema), updateNegocioController);

export default routerNegocio;
