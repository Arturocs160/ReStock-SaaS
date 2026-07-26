import pool from "../config/db";

interface CreateInvitationDTO {
  tenant_id: string;
  invited_by: string;
  email: string;
  role: string;
  token: string;
  expires_at: Date;
}

export const invitationRepository = {
  async findPendingByEmail(email: string, tenantId: string) {
    const query = `
      SELECT *
      FROM public.invitacion
      WHERE email_invitado = $1
        AND id_negocio = $2
        AND aceptada = false
        AND expiresat > NOW();
    `;
    const result = await pool.query(query, [email, tenantId]);
    return result.rows[0] ?? null;
  },

  async findPendingByTenant(tenantId: string) {
    const query = `
      SELECT id_invitacion, id_negocio, inviter_user_id, email_invitado,
             role_asignado, token_seguridad, expiresat, aceptada
      FROM public.invitacion
      WHERE id_negocio = $1
        AND aceptada = false;
    `;
    const result = await pool.query(query, [tenantId]);
    return result.rows;
  },

  async create(data: CreateInvitationDTO) {
    const query = `
      INSERT INTO public.invitacion (
        id_invitacion, id_negocio, inviter_user_id, email_invitado, 
        role_asignado, token_seguridad, expiresat, aceptada
      )
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, false)
      RETURNING *;
    `;
    const values = [
      data.tenant_id,
      data.invited_by,
      data.email,
      data.role,
      data.token,
      data.expires_at,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByToken(token: string) {
    const query = `
      SELECT *
      FROM public.invitacion
      WHERE token_seguridad = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0] ?? null;
  },

  async findById(idInvitacion: string) {
    const query = `
      SELECT *
      FROM public.invitacion
      WHERE id_invitacion = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [idInvitacion]);
    return result.rows[0] ?? null;
  },

  async markAsAccepted(idInvitacion: string) {
    const query = `
      UPDATE public.invitacion
      SET aceptada = true
      WHERE id_invitacion = $1
    `;
    await pool.query(query, [idInvitacion]);
  },

  async deleteInvitation(idInvitacion: string) {
    const query = `
      DELETE FROM public.invitacion
      WHERE id_invitacion = $1
    `;
    await pool.query(query, [idInvitacion]);
  },

  async updateUser(userId: string, tenantId: string, role: string) {
    const query = `
      UPDATE public."user"
      SET id_negocio = $1, role = $2
      WHERE id = $3
    `;
    await pool.query(query, [tenantId, role, userId]);
  },

  async assignInvitationData(userId: string, tenantId: string, role: string, creatorId: string) {
    const query = `
      UPDATE public."user"
      SET id_negocio = $1, role = $2, id_usuario_creador = $3
      WHERE id = $4;
    `;
    await pool.query(query, [tenantId, role, creatorId, userId]);
  },
};
