import pool from '../config/db';

export async function saveInterest(nombre: string, negocio: string, telefono: string) {
    const query = 'INSERT INTO interests (nombre, negocio, telefono) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [nombre, negocio, telefono]);
    return result.rows[0];
}