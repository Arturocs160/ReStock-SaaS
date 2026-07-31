import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "../../app/dashboard/page";

describe("DashboardPage Component", () => {
  it("debe renderizar el título de la página y el perfil de la tienda", () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole("heading", { name: "Inventario por Lotes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Administra tus productos y desglosa sus lotes para gestionar vencimientos e ingresos.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("MI Tienda S.A.")).toBeInTheDocument();
    expect(screen.getByText(/Modo Demo Activo/i)).toBeInTheDocument();
  });

  it("debe listar los productos iniciales y mostrar los lotes del producto expandido por defecto", () => {
    render(<DashboardPage />);
    // Deberían estar los productos en la tabla
    expect(screen.getByText("Coca-Cola Original 600ml")).toBeInTheDocument();
    expect(screen.getByText("Leche Entera Lala 1L")).toBeInTheDocument();

    // Por defecto, p1 (Coca-Cola) está expandido, por lo que L-COKE-01 debe estar visible
    expect(screen.getByText("L-COKE-01")).toBeInTheDocument();
    expect(screen.getByText("L-COKE-02")).toBeInTheDocument();
  });

  it("debe buscar un producto por nombre o código de barras", () => {
    render(<DashboardPage />);
    const searchInput = screen.getByPlaceholderText(
      /Buscador por nombre o código/i,
    );

    // Buscar 'Leche'
    fireEvent.change(searchInput, { target: { value: "Leche" } });

    expect(screen.getByText("Leche Entera Lala 1L")).toBeInTheDocument();
    expect(
      screen.queryByText("Coca-Cola Original 600ml"),
    ).not.toBeInTheDocument();

    // Limpiar búsqueda
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Coca-Cola Original 600ml")).toBeInTheDocument();
  });

  it("debe filtrar los productos por categoría", () => {
    render(<DashboardPage />);
    const selectCategory = screen.getByRole("combobox", {
      name: "Filtrar por Categoría",
    });

    // Filtrar por 'Lácteos'
    fireEvent.change(selectCategory, { target: { value: "Lácteos" } });

    expect(screen.getByText("Leche Entera Lala 1L")).toBeInTheDocument();
    expect(
      screen.queryByText("Coca-Cola Original 600ml"),
    ).not.toBeInTheDocument();
  });

  it("debe abrir el modal para registrar un producto y guardarlo", () => {
    render(<DashboardPage />);

    // Click en "Registrar Producto"
    const addBtn = screen.getByRole("button", { name: /Registrar Producto/i });
    fireEvent.click(addBtn);

    // Verificar que el modal está abierto
    expect(screen.getByText("Registrar Nuevo Producto")).toBeInTheDocument();

    // Completar el formulario
    const nameInput = screen.getByPlaceholderText("Ej: Sabritas Limón 110g");
    fireEvent.change(nameInput, { target: { value: "Pan Dulce Concha" } });

    const barcodeInput = screen.getByPlaceholderText("Ej: 7501011115637");
    fireEvent.change(barcodeInput, { target: { value: "7509999999999" } });

    const priceInput = screen.getByPlaceholderText("19.50");
    fireEvent.change(priceInput, { target: { value: "15.50" } });

    const stockInput = screen.getByPlaceholderText("20");
    fireEvent.change(stockInput, { target: { value: "20" } });

    // Click en Registrar Producto en el modal
    const saveBtn = screen.getByRole("button", { name: /Guardar Producto/i });
    fireEvent.click(saveBtn);

    // Verificar que se agregó a la tabla
    expect(screen.getByText("Pan Dulce Concha")).toBeInTheDocument();
  });
});
