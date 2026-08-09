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

    const timezone = (req.headers["x-timezone"] as string) || "UTC";
    const pdfBuffer = await generarListaReabastecimientoPdfService(id_negocio, req.body, timezone);

    const now = new Date();
    const fecha = now
      .toLocaleDateString("es-MX", {
        timeZone: timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    const timeString = now.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const [timeVal, ampm] = timeString.split(" ");
    const [horasVal, minutosVal] = timeVal.split(":");
    const horasStr = horasVal.padStart(2, "0");
    const minutos = minutosVal;

    const filename = `lista-reabastecimiento_${fecha}_${horasStr}-${minutos}_${ampm}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
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
