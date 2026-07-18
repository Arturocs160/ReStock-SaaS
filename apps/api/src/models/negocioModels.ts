import pool from "../config/db";

export async function getNegocioBySubdominioModel(subdominio: string) {
    const res = await pool.query(`
        SELECT * FROM public.negocio 
        WHERE subdominio = $1 AND activo = true;
    `, [subdominio]);

    return res.rows[0] || null;
}

export async function updateNegocioModel(
    id_negocio: string,
    nombre?: string,
    subdominio?: string
) {
    const fields = [];
    const values = [];
    let count = 1;

    if (nombre !== undefined) {
        fields.push(`nombre = $${count}`);
        values.push(nombre);
        count++;
    }

    if (subdominio !== undefined) {
        fields.push(`subdominio = $${count}`);
        values.push(subdominio);
        count++;
    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id_negocio);
    const query = `
        UPDATE public.negocio 
        SET ${fields.join(", ")}
        WHERE id_negocio = $${count} AND activo = true
        RETURNING *;
    `;

    const res = await pool.query(query, values);
    return res.rows[0] || null;
}
