import pool from "../config/db";

export async function getNegocioByIdModel(id_negocio: string) {
  const query = "SELECT * FROM public.negocio WHERE id_negocio = $1";
  const result = await pool.query(query, [id_negocio]);
  return result.rows[0] || null;
}

export async function getNegocioBySubdomainModel(subdominio: string) {
  const query = "SELECT * FROM public.negocio WHERE subdominio = $1";
  const result = await pool.query(query, [subdominio]);
  return result.rows[0] || null;
}

export async function updateNegocioModel(id_negocio: string, nombre: string, subdominio: string) {
  const query = `
    UPDATE public.negocio
    SET nombre = $2, subdominio = $3
    WHERE id_negocio = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id_negocio, nombre, subdominio]);
  return result.rows[0] || null;
}
