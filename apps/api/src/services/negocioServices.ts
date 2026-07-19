import { getNegocioBySubdomainModel, updateNegocioModel, getNegocioByIdModel } from "../models/negocioModel";

export async function updateNegocioService(
  id_negocio: string,
  nombre: string,
  subdominio: string,
  telefono?: string | null,
  email_comercial?: string | null
) {
  // Verificar la disponibilidad del subdominio
  const existingNegocio = await getNegocioBySubdomainModel(subdominio);

  if (existingNegocio && existingNegocio.id_negocio !== id_negocio) {
    const error = new Error("El subdominio ya está asignado a otro negocio");
    (error as any).statusCode = 409;
    throw error;
  }

  const updatedNegocio = await updateNegocioModel(id_negocio, nombre, subdominio, telefono, email_comercial);
  return updatedNegocio;
}

export async function getNegocioByIdService(id_negocio: string) {
  return await getNegocioByIdModel(id_negocio);
}

