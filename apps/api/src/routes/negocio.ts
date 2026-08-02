import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import { validateDataBody } from "../middlewares/verifyData";
import { updateNegocioSchema } from "../schemas/negocioSchema";
import { updateNegocioController, getNegocioController } from "../controllers/negocioController";
import { userService } from "../services/user.service";
import logger from "../utils/logger";

const routerNegocio: Router = Router();

routerNegocio.get("/", requireAuth, getNegocioController);
routerNegocio.put("/", requireAuth, validateDataBody(updateNegocioSchema), updateNegocioController);

// GET /negocio/:id_negocio/usuarios
routerNegocio.get(
  "/:id_negocio/usuarios",
  requireAuth,
  checkRole(["admin"]),
  async (req: Request, res: Response) => {
    try {
      const id_negocio = req.params.id_negocio as string;
      const sessionTenantId = req.user?.id_negocio;

      // Impedir fuga de datos / validar multi-tenant
      if (sessionTenantId !== id_negocio) {
        return res.status(403).json({
          message:
            "Acceso denegado. No tienes permisos para consultar la información de este negocio.",
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

// PUT /negocio/:id_negocio/usuarios/:id_usuario/role
routerNegocio.put(
  "/:id_negocio/usuarios/:id_usuario/role",
  requireAuth,
  checkRole(["admin"]),
  async (req: Request, res: Response) => {
    try {
      const id_negocio = req.params.id_negocio as string;
      const id_usuario = req.params.id_usuario as string;
      const { role } = req.body;
      const sessionTenantId = req.user?.id_negocio;
      const requestorId = req.user?.id;

      if (sessionTenantId !== id_negocio || !requestorId) {
        return res.status(403).json({
          message: "Acceso denegado. No tienes permisos para este negocio.",
        });
      }

      if (!role) {
        return res.status(400).json({ message: "El rol es requerido." });
      }

      await userService.updateMemberRole(id_negocio, requestorId, id_usuario, role);
      return res.status(200).json({ message: "Rol actualizado con éxito." });
    } catch (error: any) {
      logger.error("Error al actualizar rol de colaborador:", error);
      return res.status(400).json({ message: error.message || "Error al actualizar el rol." });
    }
  }
);

// DELETE /negocio/:id_negocio/usuarios/:id_usuario
routerNegocio.delete(
  "/:id_negocio/usuarios/:id_usuario",
  requireAuth,
  checkRole(["admin"]),
  async (req: Request, res: Response) => {
    try {
      const id_negocio = req.params.id_negocio as string;
      const id_usuario = req.params.id_usuario as string;
      const sessionTenantId = req.user?.id_negocio;
      const requestorId = req.user?.id;

      if (sessionTenantId !== id_negocio || !requestorId) {
        return res.status(403).json({
          message: "Acceso denegado. No tienes permisos para este negocio.",
        });
      }

      await userService.removeMemberFromNegocio(id_negocio, requestorId, id_usuario);
      return res.status(200).json({ message: "Miembro removido con éxito." });
    } catch (error: any) {
      logger.error("Error al remover colaborador del negocio:", error);
      return res.status(400).json({ message: error.message || "Error al remover al miembro." });
    }
  }
);

export default routerNegocio;
