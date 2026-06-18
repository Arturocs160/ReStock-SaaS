import { ctaRepository, InterestInput } from "../repositories/ctaRepository";

export async function createInterest(data: InterestInput) {
  // Check if email already exists
  const existingInterest = await ctaRepository.findUnique(data.email);
  if (existingInterest) {
    throw new Error("Email already registered");
  }

  // Create the new interest
  const interest = await ctaRepository.create(data);
  return interest;
}

// Backward compatibility function
export async function createInterestService(nombre: string, negocio: string, telefono: string) {
  // Map old parameters to new interface
  const data = {
    email: "", // Email is required, but this function doesn't provide it
    name: nombre,
    negocio,
    telefono,
  };
  return createInterest(data);
}
