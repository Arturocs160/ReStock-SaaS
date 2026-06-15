import z from "zod";

// New schema for updated interest format with email and name
export const ctaSchema = z.object({
  email: z.string().email("El email debe ser válido"),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/, "El nombre solo puede contener letras y espacios"),
  source: z.string().optional(),
});

// Backward compatible schema for old format
export const interestSchema = z.object({
  nombre: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/, "El nombre solo puede contener letras y espacios"),
  negocio: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/, "El negocio solo puede contener letras y espacios"),
  telefono: z
    .string()
    .min(10)
    .max(20)
    .regex(
      /^\+52\s?\d{10}$/,
      "El teléfono debe tener prefijo +52 seguido de 10 dígitos, con o sin espacio"
    ),
});
