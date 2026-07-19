import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductGrid } from "@/app/components/pos/ProductGrid";
import { SearchBar } from "@/app/components/pos/SearchBar";
import type { Product } from "@/app/types/product";
import { useProductsStore } from "@/app/stores/useProductsStore";

const mockProducts: Product[] = [
  { id: "1", nombre: "Café Molido", codigo: "CAF001", precio: 45.5 },
  { id: "2", nombre: "Leche Entera", codigo: "LEC002", precio: 22 },
  { id: "3", nombre: "Pan Dulce", codigo: "PAN003", precio: 15 },
];

function PosSearchFixture() {
  return (
    <>
      <SearchBar />
      <ProductGrid />
    </>
  );
}

function getVisibleProductNames() {
  const grid = screen.getByTestId("product-grid");
  return within(grid)
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent);
}

async function typeAndDebounce(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.type(screen.getByLabelText("Buscar productos"), value);

  await act(async () => {
    jest.advanceTimersByTime(300);
  });
}

describe("SearchBar + ProductGrid", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    useProductsStore.setState({
      products: mockProducts,
      searchQuery: "",
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("filtra productos por nombre despues del debounce", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<PosSearchFixture />);

    expect(getVisibleProductNames()).toEqual([
      "Café Molido",
      "Leche Entera",
      "Pan Dulce",
    ]);

    await typeAndDebounce(user, "leche");

    await waitFor(() => {
      expect(getVisibleProductNames()).toEqual(["Leche Entera"]);
    });
  });

  it("filtra productos por codigo despues del debounce", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<PosSearchFixture />);

    await typeAndDebounce(user, "PAN003");

    await waitFor(() => {
      expect(getVisibleProductNames()).toEqual(["Pan Dulce"]);
    });
  });

  it("ignora mayusculas y acentos al buscar", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<PosSearchFixture />);

    await typeAndDebounce(user, "CAFE");

    await waitFor(() => {
      expect(getVisibleProductNames()).toEqual(["Café Molido"]);
    });
  });

  it("muestra el empty state cuando no hay coincidencias", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<PosSearchFixture />);

    await typeAndDebounce(user, "inexistente");

    await waitFor(() => {
      expect(
        screen.getByText("No se encontraron productos coincidentes."),
      ).toBeInTheDocument();
    });
    expect(screen.queryByTestId("product-grid")).not.toBeInTheDocument();
  });

  it("restaura el catalogo completo al limpiar la busqueda", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<PosSearchFixture />);

    await typeAndDebounce(user, "leche");

    await waitFor(() => {
      expect(getVisibleProductNames()).toEqual(["Leche Entera"]);
    });

    await user.click(screen.getByRole("button", { name: "Limpiar busqueda" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Buscar productos")).toHaveValue("");
      expect(getVisibleProductNames()).toEqual([
        "Café Molido",
        "Leche Entera",
        "Pan Dulce",
      ]);
    });
  });
});
