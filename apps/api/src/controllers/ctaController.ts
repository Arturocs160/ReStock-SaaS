import { Request, Response } from "express";
import { createInterest } from "../services/ctaServices";
import logger from "../utils/logger";

export async function createInterestController(req: Request, res: Response) {
  try {
    const result = await createInterest(req.body);

    res.status(201).json(result);
  } catch (error: any) {

    logger.error("Error creando interesado:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
