import { Request, Response } from "express";
import {
  getAlertasPendientesService,
  getAlertasService,
  resolveAlertaService,
} from "../services/alertaServices";
import logger from "../utils/logger";

export async function getAlertasController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res
        .status(401)
        .json({ error: "No autorizado", message: "ID de negocio ausente en la sesión." });
    }

    const alertas = await getAlertasService(id_negocio);
    return res.status(200).json({ alertas });
  } catch (error: any) {
    logger.error({ err: error }, "Error al obtener alertas");
    return res.status(500).json({
      error: "Error interno del servidor",
      message: "No fue posible obtener las alertas.",
    });
  }
}

export async function getAlertasPendientesController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res
        .status(401)
        .json({ error: "No autorizado", message: "ID de negocio ausente en la sesión." });
    }

    const alertas = await getAlertasPendientesService(id_negocio);
    return res.status(200).json({ alertas });
  } catch (error: any) {
    logger.error({ err: error }, "Error al obtener alertas pendientes");
    return res.status(500).json({
      error: "Error interno del servidor",
      message: "No fue posible obtener las alertas pendientes.",
    });
  }
}

export async function resolveAlertaController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const id_alerta = req.params.id_alerta;

    if (!id_negocio) {
      return res
        .status(401)
        .json({ error: "No autorizado", message: "ID de negocio ausente en la sesión." });
    }

    if (typeof id_alerta !== "string") {
      return res.status(400).json({ error: "ID de alerta inválido" });
    }

    const alerta = await resolveAlertaService(id_alerta, id_negocio);
    return res.status(200).json({ alerta });
  } catch (error: any) {
    if (error.statusCode === 404) {
      return res.status(404).json({ error: "No encontrado", message: error.message });
    }

    logger.error({ err: error }, "Error al resolver alerta");
    return res.status(500).json({
      error: "Error interno del servidor",
      message: "No fue posible resolver la alerta.",
    });
  }
}
