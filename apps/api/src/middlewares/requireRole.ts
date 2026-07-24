import { Request, Response, NextFunction } from "express";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado. Inicia sesión primero." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "FORBIDDEN_ROLE",
        message: "No tienes permisos para realizar esta acción.",
      });
    }

    next();
  };
};
