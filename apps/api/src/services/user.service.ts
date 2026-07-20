import { userRepository, UserDTO } from "../repositories/user.repository";

export const userService = {
  async getUsersByTenantId(tenantId: string): Promise<UserDTO[]> {
    if (!tenantId) {
      throw new Error("El ID de negocio es requerido.");
    }
    return await userRepository.findUsersByTenantId(tenantId);
  },

  async updateMemberRole(id_negocio: string, requestorId: string, memberId: string, newRole: string): Promise<void> {
    const allowedRoles = ["admin", "collaborator", "cashier"];
    if (!allowedRoles.includes(newRole)) {
      throw new Error("Rol inválido.");
    }

    const requestor = await userRepository.findUserById(requestorId);
    const member = await userRepository.findUserById(memberId);

    if (!requestor || requestor.id_negocio !== id_negocio) {
      throw new Error("No tienes permisos en este negocio.");
    }

    if (!member || member.id_negocio !== id_negocio) {
      throw new Error("El colaborador no pertenece a este negocio.");
    }

    if (requestorId === memberId) {
      throw new Error("No puedes modificar tu propio rol.");
    }

    if (requestor.role !== "admin") {
      throw new Error("No tienes permisos para modificar roles.");
    }

    await userRepository.updateUserRole(memberId, newRole);
  },

  async removeMemberFromNegocio(id_negocio: string, requestorId: string, memberId: string): Promise<void> {
    const requestor = await userRepository.findUserById(requestorId);
    const member = await userRepository.findUserById(memberId);

    if (!requestor || requestor.id_negocio !== id_negocio) {
      throw new Error("No tienes permisos en este negocio.");
    }

    if (!member || member.id_negocio !== id_negocio) {
      throw new Error("El colaborador no pertenece a este negocio.");
    }

    if (requestorId === memberId) {
      throw new Error("No puedes removerte a ti mismo del negocio.");
    }

    if (requestor.role !== "admin") {
      throw new Error("No tienes permisos para remover miembros.");
    }

    await userRepository.removeUserFromNegocio(memberId);
  }
};
