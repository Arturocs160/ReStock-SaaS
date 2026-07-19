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

export async function updateNegocioModel(
  id_negocio: string,
  nombre: string,
  subdominio: string,
  telefono?: string | null,
  email_comercial?: string | null
) {
  const query = `
    UPDATE public.negocio
    SET nombre = $2, subdominio = $3, telefono = $4, email_comercial = $5
    WHERE id_negocio = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [
    id_negocio,
    nombre,
    subdominio,
    telefono || null,
    email_comercial || null,
  ]);
  return result.rows[0] || null;
}


export async function getFirstNegocioModel() {
  const query = "SELECT id_negocio FROM public.negocio LIMIT 1";
  const result = await pool.query(query); 
  return result.rows[0] || null;
}