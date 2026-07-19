import pool from "../config/db";

export interface UserDTO {
  id: string;
  id_negocio: string | null;
  role: string;
  id_usuario_creador: string | null;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const userRepository = {
  async findUsersByTenantId(tenantId: string): Promise<UserDTO[]> {
    const query = `
      SELECT id, id_negocio, role, id_usuario_creador, name, email, "emailVerified", image, "createdAt", "updatedAt"
      FROM public."user"
      WHERE id_negocio = $1;
    `;
    const result = await pool.query(query, [tenantId]);
    return result.rows;
  },

  async findUserById(userId: string): Promise<UserDTO | null> {
    const query = `
      SELECT id, id_negocio, role, id_usuario_creador, name, email, "emailVerified", image, "createdAt", "updatedAt"
      FROM public."user"
      WHERE id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] ?? null;
  },

  async updateUserRole(userId: string, role: string): Promise<void> {
    const query = `
      UPDATE public."user"
      SET role = $1, "updatedAt" = NOW()
      WHERE id = $2;
    `;
    await pool.query(query, [role, userId]);
  },

  async removeUserFromNegocio(userId: string): Promise<void> {
    const query = `
      UPDATE public."user"
      SET id_negocio = NULL, role = 'user', "updatedAt" = NOW()
      WHERE id = $1;
    `;
    await pool.query(query, [userId]);
  }
};
