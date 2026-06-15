import { Router } from "express";
import { createInterestController } from "../controllers/ctaController";

const routerCTA: Router = Router();

routerCTA.post("/", createInterestController);

export default routerCTA;
