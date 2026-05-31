import { saveInterest } from "../models/ctaModels";

export async function createInterestService(nombre: string, negocio: string, telefono: string) {
    const interest = await saveInterest(nombre, negocio, telefono);
    return interest;
}