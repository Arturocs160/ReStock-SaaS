import { Request, Response } from "express";
import { updateNegocioService } from "../services/negocioServices";
import logger from "../utils/logger";

export async function updateNegocioController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    if (!id_negocio) {
      return res.status(401).json({ message: "No autorizado. Inicia sesión primero." });
    }

    const { nombre, subdominio } = req.body;
    const result = await updateNegocioService(id_negocio, nombre, subdominio);

    res.status(200).json(result);
  } catch (error: any) {
    if (error.statusCode === 409) {
      return res.status(409).json({ message: error.message });
    }
    logger.error("Error al actualizar el perfil del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
