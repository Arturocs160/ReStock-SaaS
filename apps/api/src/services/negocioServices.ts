import { getNegocioBySubdominioModel, updateNegocioModel } from "../models/negocioModels";

export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}

export async function updateNegocioService(
    id_negocio: string,
    data: { nombre?: string, subdominio?: string }
) {
    if (data.subdominio) {
        // Verificar unicidad global del subdominio
        const existingNegocio = await getNegocioBySubdominioModel(data.subdominio);
        
        if (existingNegocio && existingNegocio.id_negocio !== id_negocio) {
            throw new ConflictError("El subdominio ya está en uso por otro negocio");
        }
    }

    const updated = await updateNegocioModel(id_negocio, data.nombre, data.subdominio);
    return updated;
}
