import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm.js";

// Mock del helper de storage
vi.mock("@/lib/storage/localStorage.js", () => ({
  saveRegister: vi.fn(),
}));

// Importar después del mock para obtener la función mockeada
import { saveRegister } from "@/lib/storage/localStorage.js";

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
    vi.mocked(saveRegister).mockReturnValue({
      success: true,
      data: {} as any,
      message: "Registro guardado correctamente",
    });

    render(<RegistrationForm />);
    await fillMinimalValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(/guardado correctamente/i);
      expect(alert).toHaveStyle({
        backgroundColor: "#d4edda",
        color: "#155724",
      });
    });
  });

  it("muestra mensaje de error si saveRegister falla", async () => {
    vi.mocked(saveRegister).mockReturnValue({
      success: false,
      error: { code: "STORAGE_ERROR", message: "Error al guardar el registro" },
    } as any);

    render(<RegistrationForm />);
    await fillMinimalValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(/error al guardar/i);
      expect(alert).toHaveStyle({
        backgroundColor: "#f8d7da",
        color: "#721c24",
      });
    });
  });

  it("oculta el feedback anterior al volver a enviar", async () => {
    vi.mocked(saveRegister)
      .mockReturnValueOnce({
        success: true,
        data: {} as any,
        message: "Registro guardado",
      })
      .mockReturnValueOnce({
        success: false,
        error: { code: "STORAGE_ERROR", message: "Error de almacenamiento" },
      } as any);

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
