import { updateNegocioService } from "../../services/negocioServices";
import * as negocioModel from "../../models/negocioModel";

jest.mock("../../models/negocioModel");

describe("Negocio Services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update business profile successfully when subdomain is not registered", async () => {
    const mockNegocio = {
      id_negocio: "uuid-negocio-123",
      nombre: "Nuevo Nombre",
      subdominio: "nuevo-subdominio",
      activo: true,
    };

    (negocioModel.getNegocioBySubdomainModel as jest.Mock).mockResolvedValue(null);
    (negocioModel.updateNegocioModel as jest.Mock).mockResolvedValue(mockNegocio);

    const result = await updateNegocioService(
      "uuid-negocio-123",
      "Nuevo Nombre",
      "nuevo-subdominio"
    );

    expect(negocioModel.getNegocioBySubdomainModel).toHaveBeenCalledWith("nuevo-subdominio");
    expect(negocioModel.updateNegocioModel).toHaveBeenCalledWith(
      "uuid-negocio-123",
      "Nuevo Nombre",
      "nuevo-subdominio"
    );
    expect(result).toEqual(mockNegocio);
  });

  it("should update successfully when subdomain already belongs to the same business", async () => {
    const mockNegocio = {
      id_negocio: "uuid-negocio-123",
      nombre: "Nuevo Nombre",
      subdominio: "mi-subdominio",
      activo: true,
    };

    (negocioModel.getNegocioBySubdomainModel as jest.Mock).mockResolvedValue({
      id_negocio: "uuid-negocio-123",
      nombre: "Nombre Viejo",
      subdominio: "mi-subdominio",
      activo: true,
    });
    (negocioModel.updateNegocioModel as jest.Mock).mockResolvedValue(mockNegocio);

    const result = await updateNegocioService("uuid-negocio-123", "Nuevo Nombre", "mi-subdominio");

    expect(negocioModel.getNegocioBySubdomainModel).toHaveBeenCalledWith("mi-subdominio");
    expect(negocioModel.updateNegocioModel).toHaveBeenCalledWith(
      "uuid-negocio-123",
      "Nuevo Nombre",
      "mi-subdominio"
    );
    expect(result).toEqual(mockNegocio);
  });

  it("should throw a conflict error (409) if subdomain is already registered to a different business", async () => {
    (negocioModel.getNegocioBySubdomainModel as jest.Mock).mockResolvedValue({
      id_negocio: "uuid-negocio-456", // Different business ID!
      nombre: "Otro Negocio",
      subdominio: "nuevo-subdominio",
      activo: true,
    });

    await expect(
      updateNegocioService("uuid-negocio-123", "Nuevo Nombre", "nuevo-subdominio")
    ).rejects.toThrow("El subdominio ya está asignado a otro negocio");

    expect(negocioModel.getNegocioBySubdomainModel).toHaveBeenCalledWith("nuevo-subdominio");
    expect(negocioModel.updateNegocioModel).not.toHaveBeenCalled();
  });
});
