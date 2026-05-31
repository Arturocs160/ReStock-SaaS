import z from 'zod';

export const interestSchema = z.object({
    nombre: z.string().min(2).max(100).regex(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    negocio: z.string().min(2).max(100).regex(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/, 'El negocio solo puede contener letras y espacios'),
    telefono: z.string().min(10).max(20).regex(/^\+52\s?\d{10}$/, 'El teléfono debe tener prefijo +52 seguido de 10 dígitos, con o sin espacio'),
});