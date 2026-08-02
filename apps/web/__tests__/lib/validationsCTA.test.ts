import { interestSchema } from "../../app/lib/validationsCTA";

describe("interestSchema Validation", () => {
  describe("Nombre field validations", () => {
    it("should accept valid nombre", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject nombre with less than 2 characters", () => {
      const data = {
        nombre: "J",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "El nombre debe tener al menos 2 caracteres",
        );
      }
    });

    it("should reject nombre exceeding 100 characters", () => {
      const data = {
        nombre: "a".repeat(101),
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "El nombre no puede exceder 100 caracteres",
        );
      }
    });

    it("should reject nombre with invalid characters", () => {
      const data = {
        nombre: "Juan123",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "El nombre solo puede contener letras y espacios",
        );
      }
    });

    it("should accept nombre with special Spanish characters", () => {
      const data = {
        nombre: "José María Martínez Ñandú",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Negocio field validations", () => {
    it("should accept valid negocio", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject negocio with less than 2 characters", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "A",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "El negocio debe tener al menos 2 caracteres",
        );
      }
    });

    it("should reject negocio exceeding 100 characters", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "a".repeat(101),
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "El negocio no puede exceder 100 caracteres",
        );
      }
    });

    it("should reject negocio with invalid characters", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes 123",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "El negocio solo puede contener letras y espacios",
        );
      }
    });

    it("should accept negocio with special Spanish characters", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Panificadora La Ñoña",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Telefono field validations", () => {
    it("should accept valid telefono with space after +52", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept valid telefono without space after +52", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+525551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject telefono without +52 prefix", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("+52");
      }
    });

    it("should reject telefono with less than 10 digits", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 555123456",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("+52");
      }
    });

    it("should reject telefono with more than 10 digits", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 55512345678",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("+52");
      }
    });

    it("should reject telefono with non-numeric digits after +52", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 555ABCD567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject telefono with invalid prefix", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+51 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Complete form validation", () => {
    it("should accept complete valid form", () => {
      const data = {
        nombre: "Carlos López García",
        negocio: "Farmacia San Antonio",
        telefono: "+52 2225551234",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nombre).toBe("Carlos López García");
        expect(result.data.negocio).toBe("Farmacia San Antonio");
        expect(result.data.telefono).toBe("+52 2225551234");
      }
    });

    it("should reject form with missing nombre", () => {
      const data = {
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject form with missing negocio", () => {
      const data = {
        nombre: "Juan Pérez",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject form with missing telefono", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should return proper InterestForm type", () => {
      const data = {
        nombre: "Juan Pérez",
        negocio: "Abarrotes Don Pepe",
        telefono: "+52 5551234567",
      };
      const result = interestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
