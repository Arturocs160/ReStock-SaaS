import { Request, Response } from "express";
import { createVentaService } from "../services/ventaService";
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
