import { z } from "zod";

export const alertaIdParamSchema = z.object({
  id_alerta: z.uuid({ message: "ID de alerta inválido en los parámetros" }),
});

export type AlertaIdParam = z.infer<typeof alertaIdParamSchema>;
