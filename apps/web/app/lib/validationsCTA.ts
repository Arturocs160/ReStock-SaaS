import { z } from 'zod';

export const interestSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    ),
  negocio: z
    .string()
    .min(2, 'El negocio debe tener al menos 2 caracteres')
    .max(100, 'El negocio no puede exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/,
      'El negocio solo puede contener letras y espacios'
    ),
  telefono: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(
      /^\+52\s?\d{10}$/,
      'El teléfono debe tener prefijo +52 seguido de 10 dígitos, con o sin espacio (ej: +52 5551234567)'
    ),
});

export type InterestForm = z.infer<typeof interestSchema>;
