import { Router, Request, Response } from "express";
import { auth } from "../utils/auth";
import { invitationRepository } from "../repositories/invitation.repository";
import { invitationService } from "../services/invitation.service";
import { validateDataBody } from "../middlewares/verifyData";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import { createInvitationSchema, registerInvitationSchema } from "../schemas/invitation.schema";
import logger from "../utils/logger";

const router = Router();

// --- Crear invitación ---
router.post("/", requireAuth, checkRole(["admin", "Owner"]), validateDataBody(createInvitationSchema), async (req: Request, res: Response) => {
    try {
        const { email_invitado, role_asignado } = req.body;
        const tenantId = req.user?.id_negocio;
        const userId = req.user?.id;

        if (!tenantId || !userId) return res.status(401).json({ message: "Usuario no autenticado o sin negocio." });

        const invitation = await invitationService.createInvitation(
    email_invitado,
    tenantId,
    userId,
    role_asignado
);

const invitationLink =
    `${process.env.FRONTEND_URL}/register/invitation?token=${invitation.token_seguridad}`;

logger.info(
    {
        email: email_invitado,
        invitationLink,
    },
    "Simulación de envío de correo de invitación."
);

return res.status(201).json({
    message: "Invitación creada con éxito",
    invitation,
    invitationLink,
});
    } catch (error: any) {
        logger.error({ error }, "Error creando invitación.");
        return res.status(error.message === "Ya existe una invitación pendiente para este correo." ? 409 : 500).json({ message: error.message });
    }
});

// --- Registro de invitado ---
router.post("/register", validateDataBody(registerInvitationSchema), async (req: Request, res: Response) => {
    try {
        const { token, email, password, name } = req.body;

        
        const invitation = await invitationService.validateInvitationToken(token);

        
        const session = await auth.api.signUpEmail({
            body: { email, password, name }
        });

        
        await invitationRepository.updateUser(session.user.id, invitation.id_negocio, invitation.role_asignado);

        
        await invitationRepository.deleteInvitation(invitation.id_invitacion);

        return res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error: any) {
        logger.error({ error }, "Error en el registro del invitado.");
        const statusMap: Record<string, number> = { "INVALID_TOKEN": 400, "TOKEN_EXPIRED": 410, "TOKEN_ALREADY_USED": 409 };
        return res.status(statusMap[error.message] || 500).json({ message: error.message || "Error interno." });
    }
});

export default router;