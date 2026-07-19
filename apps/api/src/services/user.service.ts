import { userRepository, UserDTO } from "../repositories/user.repository";

export const userService = {
  async getUsersByTenantId(tenantId: string): Promise<UserDTO[]> {
    if (!tenantId) {
      throw new Error("El ID de negocio es requerido.");
    }
    return await userRepository.findUsersByTenantId(tenantId);
  }
};
