import { Router, Request, Response } from "express";
import { auth } from "../utils/auth";
import { invitationRepository } from "../repositories/invitation.repository";
import { invitationService } from "../services/invitation.service";
import { validateDataBody } from "../middlewares/verifyData";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import { createInvitationSchema, registerInvitationSchema } from "../schemas/invitation.schema";
import logger from "../utils/logger";
import { sendInvitationEmail } from "../services/mailService";
import pool from "../config/db";
import { verifyPassword } from "../utils/password";

const router = Router();

// --- Crear invitación ---
router.post(
  "/",
  requireAuth,
  checkRole(["admin"]),
  validateDataBody(createInvitationSchema),
  async (req: Request, res: Response) => {
    try {
      const { email_invitado, role_asignado } = req.body;
      const tenantId = req.user?.id_negocio;
      const userId = req.user?.id;

      if (!tenantId || !userId)
        return res.status(401).json({ message: "Usuario no autenticado o sin negocio." });

      const invitation = await invitationService.createInvitation(
        email_invitado,
        tenantId,
        userId,
        role_asignado
      );

      const invitationLink = `${process.env.FRONTEND_URL}/register/invitation?token=${invitation.token_seguridad}`;

      await sendInvitationEmail({ email: email_invitado, invitationLink });

      logger.info(
        {
          email: email_invitado,
          invitationLink,
        },
        "Correo de invitación enviado con éxito."
      );

      return res.status(201).json({
        message: "Invitación creada con éxito",
        invitation,
        invitationLink,
      });
    } catch (error: any) {
      logger.error({ error }, "Error creando invitación.");
      return res
        .status(
          error.message === "Ya existe una invitación pendiente para este correo." ? 409 : 500
        )
        .json({ message: error.message });
    }
  }
);

// --- Registro de invitado ---
router.post(
  "/register",
  validateDataBody(registerInvitationSchema),
  async (req: Request, res: Response) => {
    try {
      const { token, email, password, name } = req.body;

      const invitation = await invitationService.validateInvitationToken(token);

      // Check if the user already exists
      const userResult = await pool.query(
        `SELECT u.id, u.id_negocio, a.password AS password_hash
             FROM public."user" u
             LEFT JOIN public.account a ON a."userId" = u.id
             WHERE LOWER(u.email) = LOWER($1)
             LIMIT 1`,
        [email]
      );

      if (userResult.rows.length > 0) {
        const existingUser = userResult.rows[0];

        // If the user already has a business, they cannot join another
        if (existingUser.id_negocio) {
          return res.status(400).json({ message: "El usuario ya pertenece a un negocio." });
        }

        if (!existingUser.password_hash) {
          return res
            .status(400)
            .json({ message: "El usuario existe pero no tiene contraseña registrada." });
        }

        const isPasswordValid = await verifyPassword({
          password,
          hash: existingUser.password_hash,
        });

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        // Re-associate user with business
        await invitationRepository.updateUser(
          existingUser.id,
          invitation.id_negocio,
          invitation.role_asignado
        );
        // Delete invitation
        await invitationRepository.deleteInvitation(invitation.id_invitacion);

        return res.status(200).json({ message: "Usuario asociado correctamente al negocio" });
      } else {
        // New user signup
        const session = await auth.api.signUpEmail({
          body: { email, password, name },
        });

        await invitationRepository.updateUser(
          session.user.id,
          invitation.id_negocio,
          invitation.role_asignado
        );
        await invitationRepository.deleteInvitation(invitation.id_invitacion);

        return res.status(201).json({ message: "Usuario registrado correctamente" });
      }
    } catch (error: any) {
      logger.error({ error }, "Error en el registro del invitado.");
      const statusMap: Record<string, number> = {
        INVALID_TOKEN: 400,
        TOKEN_EXPIRED: 410,
        TOKEN_ALREADY_USED: 409,
      };
      return res
        .status(statusMap[error.message] || 500)
        .json({ message: error.message || "Error interno." });
    }
  }
);

// --- Consultar invitaciones pendientes ---
router.get("/", requireAuth, checkRole(["admin"]), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.id_negocio;
    if (!tenantId) {
      return res.status(401).json({ message: "Usuario no autenticado o sin negocio." });
    }

    const invitations = await invitationService.getPendingInvitations(tenantId);
    return res.status(200).json(invitations);
  } catch (error: any) {
    logger.error({ error }, "Error al obtener las invitaciones pendientes.");
    return res.status(500).json({ message: error.message || "Error interno del servidor." });
  }
});

// --- Eliminar invitación físicamente ---
router.delete("/:id", requireAuth, checkRole(["admin"]), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const tenantId = req.user?.id_negocio;
    if (!tenantId) {
      return res.status(401).json({ message: "Usuario no autenticado o sin negocio." });
    }

    await invitationService.deleteInvitation(id, tenantId);
    return res.status(200).json({ message: "Invitación eliminada con éxito." });
  } catch (error: any) {
    logger.error({ error }, "Error al eliminar invitación.");
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || "Error interno del servidor." });
  }
});

export default router;
