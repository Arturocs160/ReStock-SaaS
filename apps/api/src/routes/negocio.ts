import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import { validateDataBody } from "../middlewares/verifyData";
import { updateNegocioSchema } from "../schemas/negocioSchema";
import { updateNegocioController } from "../controllers/negocioController";
import { userService } from "../services/user.service";
import logger from "../utils/logger";

const routerNegocio: Router = Router();

routerNegocio.put("/", requireAuth, validateDataBody(updateNegocioSchema), updateNegocioController);

// GET /negocio/:id_negocio/usuarios
routerNegocio.get(
  "/:id_negocio/usuarios",
  requireAuth,
  checkRole(["owner", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const id_negocio = req.params.id_negocio as string;
      const sessionTenantId = req.user?.id_negocio;

      // Impedir fuga de datos / validar multi-tenant
      if (sessionTenantId !== id_negocio) {
        return res.status(403).json({
          message: "Acceso denegado. No tienes permisos para consultar la información de este negocio."
        });
      }

      const users = await userService.getUsersByTenantId(id_negocio);
      return res.status(200).json(users);
    } catch (error: any) {
      logger.error("Error al obtener los usuarios del negocio: ", error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  }
);

export default routerNegocio;

