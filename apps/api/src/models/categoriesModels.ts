import pool from "../config/db";

export async function getAllCategoriesModel(id_negocio: string, includeInactive: boolean = false) {
  const query = includeInactive
    ? `
        SELECT * FROM public.categoria 
        WHERE id_negocio = $1
        ORDER BY nombre ASC;
      `
    : `
        SELECT * FROM public.categoria 
        WHERE id_negocio = $1 AND activo = true
        ORDER BY nombre ASC;
      `;
  const res = await pool.query(query, [id_negocio]);
  return res.rows;
}

export async function getCategoryByIdModel(id_categoria: string, id_negocio: string) {
  const res = await pool.query(
    `
        SELECT * FROM public.categoria
        WHERE id_categoria = $1 AND id_negocio = $2;
    `,
    [id_categoria, id_negocio]
  );
  return res.rows[0];
}

export async function createCategoryModel(
  id_categoria: string,
  id_negocio: string,
  nombre: string,
  descripcion: string | null
) {
  const res = await pool.query(
    `
        INSERT INTO public.categoria (id_categoria, id_negocio, nombre, descripcion, activo)
        VALUES ($1, $2, $3, $4, true)
        RETURNING *;
    `,
    [id_categoria, id_negocio, nombre, descripcion]
  );
  return res.rows[0];
}

export async function updateCategoryModel(
  id_categoria: string,
  id_negocio: string,
  nombre: string,
  descripcion: string | null
) {
  const res = await pool.query(
    `
        UPDATE public.categoria
        SET nombre = $1, descripcion = $2
        WHERE id_categoria = $3 AND id_negocio = $4
        RETURNING *;
    `,
    [nombre, descripcion, id_categoria, id_negocio]
  );
  return res.rows[0];
}

export async function toggleCategoryActiveModel(id_categoria: string, id_negocio: string) {
  const res = await pool.query(
    `
        UPDATE public.categoria
        SET activo = NOT activo
        WHERE id_categoria = $1 AND id_negocio = $2
        RETURNING *;
    `,
    [id_categoria, id_negocio]
  );
  return res.rows[0];
}

export async function countActiveProductsByCategoryIdModel(
  id_categoria: string,
  id_negocio: string
) {
  const res = await pool.query(
    `
        SELECT COUNT(*)::integer as count FROM public.producto
        WHERE id_categoria = $1 AND id_negocio = $2 AND activo = true;
    `,
    [id_categoria, id_negocio]
  );
  return res.rows[0].count;
}
