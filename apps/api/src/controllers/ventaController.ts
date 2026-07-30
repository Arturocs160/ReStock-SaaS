import { Request, Response } from "express";
import {
  createVentaService,
  getVentasHistorialService,
  getVentasMetricasService,
} from "../services/ventaService";
import logger from "../utils/logger";

export async function createVentaController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const userid = req.user?.id;

    if (!id_negocio) {
      return res
        .status(401)
        .json({ error: "No autorizado", message: "ID de negocio ausente en la sesión." });
    }

    if (!userid) {
      return res
        .status(401)
        .json({ error: "No autorizado", message: "ID de usuario ausente en la sesión." });
    }

    const venta = await createVentaService(id_negocio, userid, req.body);
    res.status(201).json(venta);
  } catch (error: any) {
    logger.error("Error al registrar venta: " + error);

    // Si es un error de negocio o de stock insuficiente
    if (
      error.message &&
      (error.message.includes("insuficiente") ||
        error.message.includes("no existe") ||
        error.message.includes("inactivo") ||
        error.message.includes("pertenece"))
    ) {
      return res.status(400).json({ error: "Venta rechazada", message: error.message });
    }

    res
      .status(500)
      .json({ error: "Error interno del servidor", message: "No fue posible procesar la venta." });
  }
}

export async function getVentasMetricasController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res
        .status(401)
        .json({ error: "No autorizado", message: "ID de negocio ausente en la sesiÃ³n." });
    }

    const metricas = await getVentasMetricasService(id_negocio);
    return res.status(200).json({ metricas });
  } catch (error: any) {
    logger.error({ err: error }, "Error al obtener metricas de ventas");
    return res.status(500).json({
      error: "Error interno del servidor",
      message: "No fue posible obtener las metricas de ventas.",
    });
  }
}

export async function getVentasHistorialController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res
        .status(401)
        .json({ error: "No autorizado", message: "ID de negocio ausente en la sesiÃ³n." });
    }

    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const ventas = await getVentasHistorialService(id_negocio, q);

    return res.status(200).json({ ventas });
  } catch (error: any) {
    logger.error({ err: error }, "Error al obtener historial de ventas");
    return res.status(500).json({
      error: "Error interno del servidor",
      message: "No fue posible obtener el historial de ventas.",
    });
  }
}
