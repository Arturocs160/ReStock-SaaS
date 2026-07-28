import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  getSugerenciasReabastecimientoService,
  generarListaReabastecimientoPdfService,
} from "../services/comprasServices";

export async function getSugerenciasController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res.status(401).json({
        error: "Sesión inválida o expirada",
        message: "ID de negocio ausente en la sesión.",
      });
    }

    const sugerencias = await getSugerenciasReabastecimientoService(id_negocio);
    res.status(200).json(sugerencias);
  } catch (error: any) {
    logger.error("Error al obtener sugerencias de reabastecimiento: " + error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function generarListaReabastecimientoController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res.status(401).json({
        error: "Sesión inválida o expirada",
        message: "ID de negocio ausente en la sesión.",
      });
    }

    const pdfBuffer = await generarListaReabastecimientoPdfService(id_negocio, req.body);
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="lista-reabastecimiento-${fecha}.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    });
    res.status(200).send(pdfBuffer);
  } catch (error: any) {
    logger.error("Error al generar la lista de reabastecimiento: " + error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || "Error interno del servidor",
      message: error.message,
    });
  }
}
