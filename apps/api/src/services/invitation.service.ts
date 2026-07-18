import crypto from "crypto";
import { invitationRepository } from "../repositories/invitation.repository";

export const invitationService = {
  async createInvitation(
    email: string,
    tenantId: string,
    invitedBy: string,
    role: string
  ) {
    const existingInvitation = await invitationRepository.findPendingByEmail(email, tenantId);

    if (existingInvitation) {
      throw new Error("Ya existe una invitación pendiente para este correo.");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await invitationRepository.create({
      tenant_id: tenantId,
      invited_by: invitedBy,
      email,
      role,
      token,
      expires_at: expiresAt,
    });

    return invitation;
  },

  async validateInvitationToken(token: string) {
    const invitation = await invitationRepository.findByToken(token);

    if (!invitation) {
      throw new Error("INVALID_TOKEN");
    }

    if (invitation.aceptada) {
      throw new Error("TOKEN_ALREADY_USED");
    }

    if (new Date(invitation.expiresat) < new Date()) {
      throw new Error("TOKEN_EXPIRED");
    }

    return invitation;
  },

  async finishInvitation(userId: string, invitation: any) {
    await invitationRepository.assignInvitationData(
      userId,
      invitation.id_negocio,
      invitation.role_asignado,
      invitation.inviter_user_id
    );

    
    await invitationRepository.deleteInvitation(invitation.id_invitacion);
  }
};