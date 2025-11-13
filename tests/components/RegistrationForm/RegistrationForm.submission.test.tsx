import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm.js";

// Mock del storage por defecto
vi.mock("@/lib/storage/localStorage.js", () => ({
  saveRegister: vi.fn(),
}));

import { saveRegister } from "@/lib/storage/localStorage.js";

function selectFirstUser() {
  const userSelect = screen.getByLabelText(/usuario/i) as HTMLSelectElement;
  const first = Array.from(userSelect.options).find((o) => o.value);
  if (!first) throw new Error("No hay usuarios en el select");
  fireEvent.change(userSelect, { target: { value: first.value } });
  return first.value;
}

async function fillValidForm() {
  const selectedUserId = selectFirstUser();
  fireEvent.change(screen.getByLabelText(/alimento/i), {
    target: { value: "Manzana" },
  });
  fireEvent.change(screen.getByLabelText(/cantidad/i), {
    target: { value: "150" },
  });
  fireEvent.change(screen.getByLabelText(/unidad/i), {
    target: { value: "gr" },
  });
  return selectedUserId;
}

describe("RegistrationForm - Submission & Persistencia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("llama a saveRegister con los datos correctos", async () => {
    vi.mocked(saveRegister).mockReturnValue({
      success: true,
      data: {} as any,
      message: "OK",
    });

    render(<RegistrationForm />);
    const selectedUserId = await fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      expect(saveRegister).toHaveBeenCalledTimes(1);
      expect(saveRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: selectedUserId,
          food: "Manzana",
          amount: 150,
          unit: "gr",
          // Formato controlado por inputs
          date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
          time: expect.stringMatching(/^\d{2}:\d{2}$/),
          mealType: expect.any(String),
        })
      );
    });
  });

  it("deshabilita el botón durante el submit y vuelve a habilitarlo", async () => {
    vi.mocked(saveRegister).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ success: true, data: {}, message: "OK" } as any),
            120
          )
        ) as any
    );

    render(<RegistrationForm />);
    await fillValidForm();

    const btn = screen.getByRole("button", { name: /guardar registro/i });
    fireEvent.click(btn);

    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/guardando/i);

    await waitFor(() => {
      expect(btn).not.toBeDisabled();
      expect(btn).toHaveTextContent(/guardar registro/i);
    });
  });

  it("resetea campos tras submit exitoso pero mantiene el usuario seleccionado", async () => {
    vi.mocked(saveRegister).mockReturnValue({
      success: true,
      data: {} as any,
      message: "OK",
    });

    render(<RegistrationForm />);
    const selectedUserId = await fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const food = screen.getByLabelText(/alimento/i) as HTMLInputElement;
      const amount = screen.getByLabelText(/cantidad/i) as HTMLInputElement;
      const userSelect = screen.getByLabelText(/usuario/i) as HTMLSelectElement;

      expect(food.value).toBe("");
      expect(amount.value).toBe("1");
      expect(userSelect.value).toBe(selectedUserId);
    });
  });

  it("persiste en localStorage cuando se usa la implementación real", async () => {
    // Usar la implementación real del módulo, pero manteniendo el mock de import
    const actual = await vi.importActual<
      typeof import("@/lib/storage/localStorage.js")
    >("@/lib/storage/localStorage.js");
    vi.mocked(saveRegister).mockImplementation(actual.saveRegister as any);

    render(<RegistrationForm />);
    await fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const raw = localStorage.getItem("nutrition-tracker-registers");
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw as string);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
    });
  });

  it("no envía si hay errores de validación", async () => {
    render(<RegistrationForm />);

    // Forzar errores: usuario vacío y alimento vacío
    const userSelect = screen.getByLabelText(/usuario/i);
    fireEvent.change(userSelect, { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/alimento/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      expect(saveRegister).not.toHaveBeenCalled();
      expect(screen.getByText(/usuario.*requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/alimento.*requerido/i)).toBeInTheDocument();
    });
  });
});
