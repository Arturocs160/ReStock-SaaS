import { updateNegocioSchema } from "../../schemas/negocioSchema";

describe("Negocio Schema Validation", () => {
  it("should validate a correct update payload", () => {
    const payload = {
      nombre: "Mi Negocio",
      subdominio: "mi-negocio-123",
    };
    const result = updateNegocioSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should fail validation if nombre is empty", () => {
    const payload = {
      nombre: "",
      subdominio: "mi-negocio-123",
    };
    const result = updateNegocioSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El nombre es obligatorio");
    }
  });

  it("should fail validation if subdominio is empty", () => {
    const payload = {
      nombre: "Mi Negocio",
      subdominio: "",
    };
    const result = updateNegocioSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El subdominio es obligatorio");
    }
  });

  it("should fail validation if subdominio contains invalid characters", () => {
    const payload = {
      nombre: "Mi Negocio",
      subdominio: "mi_negocio!123",
    };
    const result = updateNegocioSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "El subdominio solo puede contener letras minúsculas, números y guiones"
      );
    }
  });
});
