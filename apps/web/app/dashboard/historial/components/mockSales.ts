import { Sale } from "./types";

export const mockSales: Sale[] = [
  {
    id: "1",
    folio: "#F3A2B5C1",
    fecha: "30 de julio de 2026, 14:35:12",
    cajero: "Katherine Gómez",
    articulos: 6,
    total: 317.5,
    detalles: [
      {
        id: "1",
        producto: "Leche Entera",
        cantidad: 2,
        precioUnitario: 35,
        subtotal: 70,
      },
      {
        id: "2",
        producto: "Pan Integral",
        cantidad: 1,
        precioUnitario: 42.5,
        subtotal: 42.5,
      },
      {
        id: "3",
        producto: "Huevos",
        cantidad: 5,
        precioUnitario: 41,
        subtotal: 205,
      },
    ],
  },
  {
    id: "2",
    folio: "#A1D8K9P4",
    fecha: "29 de julio de 2026, 10:12:44",
    cajero: "Juan Pérez",
    articulos: 3,
    total: 185,
    detalles: [
      {
        id: "1",
        producto: "Refresco",
        cantidad: 2,
        precioUnitario: 30,
        subtotal: 60,
      },
      {
        id: "2",
        producto: "Papas",
        cantidad: 1,
        precioUnitario: 45,
        subtotal: 45,
      },
      {
        id: "3",
        producto: "Galletas",
        cantidad: 2,
        precioUnitario: 40,
        subtotal: 80,
      },
    ],
  },
];