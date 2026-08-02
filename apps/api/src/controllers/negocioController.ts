import { Request, Response } from "express";
import { updateNegocioService, getNegocioByIdService } from "../services/negocioServices";
import logger from "../utils/logger";

export async function getNegocioController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    if (!id_negocio) {
      return res.status(401).json({ message: "No autorizado. Inicia sesión primero." });
    }

    const negocio = await getNegocioByIdService(id_negocio);
    if (!negocio) {
      return res.status(404).json({ message: "Negocio no encontrado." });
    }

    res.status(200).json(negocio);
  } catch (error: any) {
    logger.error("Error al obtener el perfil del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function updateNegocioController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    if (!id_negocio) {
      return res.status(401).json({ message: "No autorizado. Inicia sesión primero." });
    }

    const { nombre, subdominio, telefono, email_comercial } = req.body;
    const result = await updateNegocioService(
      id_negocio,
      nombre,
      subdominio,
      telefono,
      email_comercial
    );

    res.status(200).json(result);
  } catch (error: any) {
    if (error.statusCode === 409) {
      return res.status(409).json({ message: error.message });
    }
    logger.error("Error al actualizar el perfil del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
