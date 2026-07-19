import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateDataBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
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
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  };
}

export function validateDataParams(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
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
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  };
}

export function validateDataQuery(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
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
        res.status(500).json({ error: "Error interno del servidor" });
      }
    }
  };
}
