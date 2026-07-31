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

export const mapFrontendRoleToBackend = (role: string): string => {
  switch (role) {
    case "Admin":
      return "admin";
    case "Empleado":
      return "collaborator";
    case "Cajero":
      return "cashier";
    default:
      return "collaborator";
  }
};

export const mapBackendRoleToFrontend = (role: string): string => {
  switch (role) {
    case "admin":
      return "Admin";
    case "collaborator":
      return "Empleado";
    case "cashier":
      return "Cajero";
    default:
      return role;
  }
};

