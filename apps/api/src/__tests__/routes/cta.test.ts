import request from "supertest";
import { app } from "../../index";
import * as ctaServices from "../../services/ctaServices";

jest.mock("../../services/ctaServices");

describe("POST /cta Route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: POST /cta éxito
  it("should return 201 and the created object on success", async () => {
    const validData = { email: "user@example.com", name: "Bob" };
    const mockResponse = { id: "uuid-123", ...validData, createdAt: new Date() };

    (ctaServices.createInterest as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app).post("/cta").send(validData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(validData.email);
  });

  // Test: POST /cta validación email inválido
  it("should return 400 if email validation fails", async () => {
    const invalidData = { email: "not-an-email", name: "Bob" };

    const response = await request(app).post("/cta").send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  // Test: POST /cta campos faltantes
  it("should return 400 if required fields are missing", async () => {
    const missingData = { name: "Bob" };

    const response = await request(app).post("/cta").send(missingData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  // Test: POST /cta email duplicado
  it("should return 409 if email already exists", async () => {
    const validData = { email: "existing@example.com", name: "Bob" };

    (ctaServices.createInterest as jest.Mock).mockRejectedValue(
      new Error("Email already registered")
    );

    const response = await request(app).post("/cta").send(validData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already registered");
  });

  // Test: POST /cta error servidor
  it("should return 500 if the service encounters an unhandled error", async () => {
    const validData = { email: "user@example.com", name: "Bob" };

    (ctaServices.createInterest as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    const response = await request(app).post("/cta").send(validData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
  });
});
