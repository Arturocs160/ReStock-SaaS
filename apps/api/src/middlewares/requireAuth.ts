import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../utils/auth";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "No autorizado. Inicia sesión primero." });
    }

    req.user = session.user;
    next();
  } catch (error: any) {
    logger.error("Error validando sesión: ", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
