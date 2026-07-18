import { Request, Response } from "express";
import { updateNegocioService, ConflictError } from "../services/negocioServices";
import logger from "../utils/logger";

export async function updateNegocioController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res.status(401).json({ message: "Negocio no identificado en la sesión" });
    }

    const data = req.body; // ya validado por zod

    const updated = await updateNegocioService(id_negocio, data);

    if (!updated) {
      return res.status(404).json({ message: "Negocio no encontrado o sin cambios" });
    }

    return res.status(200).json(updated);
  } catch (error: any) {
    if (error instanceof ConflictError) {
      return res.status(409).json({ message: error.message });
    }

    logger.error("Error al actualizar el negocio:" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
