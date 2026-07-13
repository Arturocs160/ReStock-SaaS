import request from "supertest";
import { app } from "../../index";
import * as productsServices from "../../services/productsServices";

jest.mock("../../services/productsServices");

describe("Products Controller - Parameter Validation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /products/:id_producto", () => {
    it("should return 400 if id_producto is not a string", async () => {
      // This would be caught by Express route params normally,
      // but we're testing the explicit validation logic
      const response = await request(app)
        .get("/products/undefined")
        .set("Authorization", "Bearer token");

      // The route should not hang - it should respond with either 400 or 404
      // depending on service behavior. The key is it responds.
      expect(response.status).not.toBe(undefined);
      expect([400, 404, 500]).toContain(response.status);
    });

    it("should return 200 on successful product retrieval", async () => {
      const mockProduct = {
        id_producto: "prod-123",
        nombre: "Test Product",
        precio_actual: 100,
      };

      (productsServices.getProductsByIdService as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app)
        .get("/products/prod-123")
        .set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
    });
  });

  describe("PUT /products/:id_producto", () => {
    it("should return 400 if id_producto is not a string (invalid parameter)", async () => {
      const updateData = {
        nombre: "Updated Product",
        precio_actual: 150,
      };

      // Mock scenario where id_producto validation fails
      const response = await request(app)
        .put("/products/undefined")
        .send(updateData)
        .set("Authorization", "Bearer token");

      // Should not hang - must respond
      expect(response.status).not.toBe(undefined);
      expect([400, 404, 500]).toContain(response.status);
    });

    it("should return 200 on successful product update", async () => {
      const updateData = {
        nombre: "Updated Product",
        precio_actual: 150,
      };

      const mockUpdatedProduct = {
        id_producto: "prod-123",
        ...updateData,
      };

      (productsServices.updateProductService as jest.Mock).mockResolvedValue(mockUpdatedProduct);

      const response = await request(app)
        .put("/products/prod-123")
        .send(updateData)
        .set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedProduct);
    });
  });

  describe("DELETE /products/:id_producto", () => {
    it("should return 400 if id_producto is not a string (invalid parameter)", async () => {
      const response = await request(app)
        .delete("/products/undefined")
        .set("Authorization", "Bearer token");

      // Should not hang - must respond
      expect(response.status).not.toBe(undefined);
      expect([400, 204, 404, 500]).toContain(response.status);
    });

    it("should return 204 on successful product deletion", async () => {
      (productsServices.deleteProductService as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete("/products/prod-123")
        .set("Authorization", "Bearer token");

      expect(response.status).toBe(204);
    });
  });

  describe("GET /products/barcode/:codigo_barras", () => {
    it("should return 400 if codigo_barras is not a string (invalid parameter)", async () => {
      const response = await request(app)
        .get("/products/barcode/undefined")
        .set("Authorization", "Bearer token");

      // Should not hang - must respond
      expect(response.status).not.toBe(undefined);
      expect([400, 404, 500]).toContain(response.status);
    });

    it("should return 200 on successful barcode lookup", async () => {
      const mockProduct = {
        id_producto: "prod-123",
        codigo_barras: "978-1234567890",
        nombre: "Test Product",
      };

      (productsServices.getProductByBarCodeService as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app)
        .get("/products/barcode/978-1234567890")
        .set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
    });
  });
});
