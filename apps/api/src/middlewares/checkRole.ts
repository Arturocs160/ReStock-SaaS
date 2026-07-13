import { Request, Response, NextFunction } from "express";


export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }
    next();
  };
};