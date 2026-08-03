import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import logger from "../utils/logger";

export function validateDataBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: issue.message,
        }));
        res
          .status(400)
          .json({ error: "Datos invalidos", message: "Datos invalidos", details: errorMessages });
      } else {
        logger.error(error, "Error in validateDataBody");
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  };
}

export function validateDataParams(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      for (const key of Object.keys(req.params)) {
        delete req.params[key];
      }
      Object.assign(req.params, parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: issue.message,
        }));
        res
          .status(400)
          .json({ error: "Datos invalidos", message: "Datos invalidos", details: errorMessages });
      } else {
        logger.error(error, "Error in validateDataParams");
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  };
}

export function validateDataQuery(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      for (const key of Object.keys(req.query)) {
        delete req.query[key];
      }
      Object.assign(req.query, parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: issue.message,
        }));
        res
          .status(400)
          .json({ error: "Datos invalidos", message: "Datos invalidos", details: errorMessages });
      } else {
        logger.error(error, "Error in validateDataQuery");
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  };
}
