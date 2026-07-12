import { z } from 'zod';

export const updateBusinessSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  
  
  subdomain: z.string()
    .min(3, "El subdominio debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "El subdominio solo puede contener letras minúsculas, números y guiones, sin espacios"),
  
  status: z.boolean()
});