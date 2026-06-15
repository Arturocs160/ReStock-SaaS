import { ctaSchema } from "../../schemas/ctaSchema";

describe("CTA Schema Validation", () => {
  // Test: validación exitosa
  it("should validate successfully with correct data", () => {
    const validData = {
      email: "usuario@example.com",
      name: "John Doe",
      source: "landing_page",
    };

    const result = ctaSchema.safeParse(validData); // Si usas Zod
    expect(result.success).toBe(true);
  });

  // Test: email inválido
  it("should fail validation when email is invalid", () => {
    const invalidData = {
      email: "correo-invalido",
      name: "John Doe",
      source: "landing_page",
    };

    const result = ctaSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((issue) => issue.path.includes("email"));
      expect(emailError).toBeDefined();
    }
  });

  // Test: campos faltantes
  it("should fail validation when required fields are missing", () => {
    const missingData = {
      name: "John Doe",
      // falta email y source
    };

    const result = ctaSchema.safeParse(missingData);
    expect(result.success).toBe(false);
  });
});
