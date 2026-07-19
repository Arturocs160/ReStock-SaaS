export interface UsuarioTeam {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export interface InvitacionTeam {
  id_invitacion: string;
  email_invitado: string;
  role_asignado: string;
  token_seguridad: string;
  expiresAt: string;
}
