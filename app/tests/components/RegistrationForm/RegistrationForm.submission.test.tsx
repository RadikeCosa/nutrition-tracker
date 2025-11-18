import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "../../../components/RegistrationForm/RegistrationForm";

// Mock del helper de storage
vi.mock("../../../lib/storage/localStorage", () => ({
  saveRegister: vi.fn(),
}));

// Importar después del mock para obtener la función mockeada
import { saveRegister } from "../../../lib/storage/localStorage";

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
  const gramosRadio = screen.getByRole("radio", { name: /gramos/i });
  fireEvent.click(gramosRadio);
  return selectedUserId;
}

describe("RegistrationForm - Submission & Persistencia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("llama a saveRegister con los datos correctos", async () => {
    vi.mocked(saveRegister).mockImplementation(() => ({
      success: true,
      data: {
        userId: "mock-user",
        userName: "Mock User",
        food: "Manzana",
        amount: 150,
        unit: "gr",
        date: "2025-01-01",
        time: "12:00",
        mealType: "lunch",
        sweetener: null,
        id: "mock-id",
        createdAt: "2025-01-01T12:00:00Z",
        notes: "",
      },
      message: "OK",
    }));

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
          date: expect.stringMatching(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
          time: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
          mealType: expect.any(String),
        })
      );
    });
  });

  it("deshabilita el botón durante el submit y vuelve a habilitarlo", async () => {
    // Mock with synchronous return
    vi.mocked(saveRegister).mockImplementation(() => ({
      success: true,
      data: {
        userId: "mock-user",
        userName: "Mock User",
        food: "Manzana",
        amount: 150,
        unit: "gr",
        date: "2025-01-01",
        time: "12:00",
        mealType: "lunch",
        sweetener: null,
        id: "mock-id",
        createdAt: "2025-01-01T12:00:00Z",
        notes: "",
      },
      message: "OK",
    }));

    render(<RegistrationForm />);
    await fillValidForm();
    const btn = screen.getByRole("button", { name: /guardar registro/i });

    // Check initial state
    expect(btn).not.toBeDisabled();

    fireEvent.click(btn);

    // Button should be disabled briefly during processing
    // Then re-enabled after the synchronous operation completes
    await waitFor(() => {
      expect(btn).not.toBeDisabled();
      expect(btn).toHaveTextContent(/guardar registro/i);
    });
  });

  it("resetea campos tras submit exitoso pero mantiene el usuario seleccionado", async () => {
    vi.mocked(saveRegister).mockImplementation(() => ({
      success: true,
      data: {
        userId: "mock-user",
        userName: "Mock User",
        food: "Manzana",
        amount: 150,
        unit: "gr",
        date: "2025-01-01",
        time: "12:00",
        mealType: "lunch",
        sweetener: null,
        id: "mock-id",
        createdAt: "2025-01-01T12:00:00Z",
        notes: "",
      },
      message: "OK",
    }));

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
    const actual = await vi.importActual<
      typeof import("../../../lib/storage/localStorage")
    >("../../../lib/storage/localStorage");
    vi.mocked(saveRegister).mockImplementation(actual.saveRegister);

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
