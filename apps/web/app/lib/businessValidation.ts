import { z } from 'zod';

export const businessFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  subdomain: z.string()
    .min(3, "El subdominio debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo se permiten letras minúsculas, números y guiones (sin espacios)")
    .optional()
    .or(z.literal('')),
  status: z.boolean(),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal('')),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;