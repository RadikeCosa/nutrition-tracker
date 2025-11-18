import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "../../../components/RegistrationForm/RegistrationForm";

// Mock del helper de storage
vi.mock("../../lib/storage/localStorage", () => ({
  saveRegister: vi.fn(),
}));

// Importar después del mock para obtener la función mockeada
import { saveRegister } from "../../../lib/storage/localStorage";

function selectFirstRealUser() {
  const userSelect = screen.getByLabelText(/usuario/i) as HTMLSelectElement;
  const firstOption = Array.from(userSelect.options).find((o) => o.value);
  if (!firstOption) throw new Error("No hay opciones de usuario en el select");
  fireEvent.change(userSelect, { target: { value: firstOption.value } });
}

async function fillMinimalValidForm() {
  selectFirstRealUser();
  fireEvent.change(screen.getByLabelText(/alimento/i), {
    target: { value: "Manzana" },
  });
  // amount tiene 1 por defecto; si tu schema exige > 0 ya es válido
}

describe("RegistrationForm - Feedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra mensaje de éxito al guardar correctamente", async () => {
    vi.mocked(saveRegister).mockImplementation(() => ({
      success: true,
      data: {
        userId: "mock",
        userName: "mock",
        food: "mock",
        amount: 1,
        unit: "unit",
        date: "2025-01-01",
        time: "12:00",
        mealType: "breakfast",
        sweetener: null,
        id: "mock-id",
        createdAt: "2025-01-01T12:00:00Z",
        notes: "",
      },
      message: "Registro guardado correctamente",
    }));

    render(<RegistrationForm />);
    await fillMinimalValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(/guardado correctamente/i);
      expect(alert).toHaveClass("bg-green-100", "text-green-800");
    });
  });

  it("muestra mensaje de error si saveRegister falla", async () => {
    vi.mocked(saveRegister).mockImplementation(() => ({
      success: false,
      error: { code: "STORAGE_ERROR", message: "Error al guardar el registro" },
    }));

    render(<RegistrationForm />);
    await fillMinimalValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(/error al guardar/i);
      expect(alert).toHaveClass("bg-red-100", "text-red-800");
    });
  });

  it("oculta el feedback anterior al volver a enviar", async () => {
    vi.mocked(saveRegister)
      .mockImplementationOnce(() => ({
        success: true,
        data: {
          userId: "mock",
          userName: "mock",
          food: "mock",
          amount: 1,
          unit: "unit",
          date: "2025-01-01",
          time: "12:00",
          mealType: "breakfast",
          sweetener: null,
          id: "mock-id",
          createdAt: "2025-01-01T12:00:00Z",
          notes: "",
        },
        message: "Registro guardado",
      }))
      .mockImplementationOnce(() => ({
        success: false,
        error: { code: "STORAGE_ERROR", message: "Error de almacenamiento" },
      }));

    render(<RegistrationForm />);
    await fillMinimalValidForm();

    // Envío 1 (éxito)
    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/guardado/i);
    });

    // Cambiar un valor y enviar 2 (error)
    fireEvent.change(screen.getByLabelText(/alimento/i), {
      target: { value: "Banana" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      expect(screen.queryByText(/guardado/i)).not.toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(
        /error de almacenamiento/i
      );
    });
  });
});
