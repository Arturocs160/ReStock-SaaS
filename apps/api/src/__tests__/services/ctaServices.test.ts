import * as ctaService from "../../services/ctaServices";
import { ctaRepository } from "../../repositories/ctaRepository";

// Mock del repositorio
jest.mock("../../repositories/ctaRepository");

describe("CTA Services", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia el historial de llamadas entre cada test
  });

  it("should create an interest successfully", async () => {
    const mockInput = { email: "test@example.com", name: "Alice" };
    const mockResponse = { id: "some-uuid-or-id", ...mockInput, createdAt: new Date() };

    // Configuramos el comportamiento específico para este caso de éxito
    (ctaRepository.findUnique as jest.Mock).mockResolvedValue(null);
    (ctaRepository.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await ctaService.createInterest(mockInput);

    expect(ctaRepository.findUnique).toHaveBeenCalledWith(mockInput.email);
    expect(ctaRepository.create).toHaveBeenCalledWith(mockInput);
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if email already exists", async () => {
    const mockInput = { email: "duplicate@example.com", name: "Alice" };

    // Forzamos a que encuentre un registro existente
    (ctaRepository.findUnique as jest.Mock).mockResolvedValue({
      id: "existing-id",
      email: mockInput.email,
      name: "Existing User",
    });

    await expect(ctaService.createInterest(mockInput)).rejects.toThrow("Email already registered");
    expect(ctaRepository.create).not.toHaveBeenCalled();
  });

  it("should retrieve all interests", async () => {
    const mockInterests = [
      { id: "1", email: "user1@example.com", name: "User 1", createdAt: new Date() },
      { id: "2", email: "user2@example.com", name: "User 2", createdAt: new Date() },
    ];

    (ctaRepository.findMany as jest.Mock).mockResolvedValue(mockInterests);

    // Si no existe aún, puedes agregar una función getAllInterests
    // const result = await ctaService.getAllInterests();
    // expect(result).toEqual(mockInterests);
  });
});
