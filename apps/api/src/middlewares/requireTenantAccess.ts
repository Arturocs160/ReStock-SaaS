import { Request, Response, NextFunction } from "express";

export const requireTenantAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado. Inicia sesión primero." });
  }

  const userTenantId = req.user.id_negocio;

  // Extract target tenant ID from parameters, query, body, or headers
  const targetTenantId =
    req.params.id_negocio ||
    req.params.tenantId ||
    req.params.idNegocio ||
    req.query.id_negocio ||
    req.query.tenantId ||
    req.query.idNegocio ||
    req.body.id_negocio ||
    req.body.tenantId ||
    req.body.idNegocio ||
    req.headers["x-tenant-id"] ||
    req.headers["x-id-negocio"];

  // If a target tenant ID is provided, check if it matches the user's tenant ID
  if (targetTenantId && String(targetTenantId) !== String(userTenantId)) {
    return res.status(403).json({
      error: "FORBIDDEN_TENANT_ACCESS",
      message: "No tienes acceso a los recursos de este negocio."
    });
  }

  next();
};
