import { Router } from "express";
import { createInterestController } from "../controllers/ctaController";
import { validateDataBody } from "../middlewares/verifyData";
import { ctaSchema } from "../schemas/ctaSchema";

const routerCTA: Router = Router();

routerCTA.post("/", validateDataBody(ctaSchema), createInterestController);

export default routerCTA;
