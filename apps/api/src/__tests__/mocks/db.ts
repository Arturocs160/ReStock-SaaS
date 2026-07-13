import { jest } from "@jest/globals";

// Definimos la estructura mockeada de ctaRepository con funciones espía (jest.fn())
export const dbMock: {
  ctaInterest: {
    findUnique: any;
    create: any;
    findMany: any;
    update: any;
    delete: any;
  };
} = {
  ctaInterest: {
    findUnique: jest.fn<any>(),
    create: jest.fn<any>(),
    findMany: jest.fn<any>(),
    update: jest.fn<any>(),
    delete: jest.fn<any>(),
  },
};

// Mock del repositorio que será utilizado en los servicios
jest.mock("../../repositories/ctaRepository", () => ({
  ctaRepository: {
    findUnique: jest.fn<any>(),
    create: jest.fn<any>(),
    findMany: jest.fn<any>(),
    update: jest.fn<any>(),
    delete: jest.fn<any>(),
  },
}));

// Exportamos también referencias directas para facilitar el uso en tests
export const ctaRepositoryMock: {
  findUnique: any;
  create: any;
  findMany: any;
  update: any;
  delete: any;
} = {
  findUnique: jest.fn<any>(),
  create: jest.fn<any>(),
  findMany: jest.fn<any>(),
  update: jest.fn<any>(),
  delete: jest.fn<any>(),
};
