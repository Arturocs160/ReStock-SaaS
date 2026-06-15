import pool from "../config/db";

export interface InterestInput {
  email: string;
  name: string;
  negocio?: string;
  telefono?: string;
}

export interface Interest extends InterestInput {
  id: string;
  createdAt: Date;
}

export const ctaRepository = {
  // Find an interest by email
  findUnique: async (email: string): Promise<Interest | null> => {
    const query = "SELECT * FROM interests WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  },

  // Create a new interest
  create: async (data: InterestInput): Promise<Interest> => {
    const { email, name, negocio, telefono } = data;
    const query =
      "INSERT INTO interests (email, name, negocio, telefono) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(query, [email, name, negocio, telefono]);
    return result.rows[0];
  },

  // Find all interests
  findMany: async (): Promise<Interest[]> => {
    const query = "SELECT * FROM interests";
    const result = await pool.query(query);
    return result.rows;
  },

  // Update an interest
  update: async (email: string, data: Partial<InterestInput>): Promise<Interest> => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    values.push(email);

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const query = `UPDATE interests SET ${setClause} WHERE email = $${fields.length + 1} RETURNING *`;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete an interest
  delete: async (email: string): Promise<void> => {
    const query = "DELETE FROM interests WHERE email = $1";
    await pool.query(query, [email]);
  },
};
