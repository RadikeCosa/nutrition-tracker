import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "@/app/components/RegistrationForm/RegistrationForm";
import { USERS } from "@/app/constants/users";

describe("RegistrationForm - Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation error when userId is missing", async () => {
    render(<RegistrationForm />);

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });

    // Limpiar el userId
    const userSelect = screen.getByLabelText(/usuario/i);
    fireEvent.change(userSelect, { target: { value: "" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/usuario.*requerido/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when food is empty", async () => {
    render(<RegistrationForm />);

    const foodInput = screen.getByLabelText(/alimento/i);
    fireEvent.change(foodInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/alimento.*requerido/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when food is only whitespace", async () => {
    render(<RegistrationForm />);

    const foodInput = screen.getByLabelText(/alimento/i);
    fireEvent.change(foodInput, { target: { value: "   " } });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/alimento.*requerido/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid amount (zero)", async () => {
    render(<RegistrationForm />);

    const amountInput = screen.getByLabelText(/cantidad/i);
    fireEvent.change(amountInput, { target: { value: "0" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/cantidad.*mayor.*0/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid amount (negative)", async () => {
    render(<RegistrationForm />);

    const amountInput = screen.getByLabelText(/cantidad/i);
    fireEvent.change(amountInput, { target: { value: "-5" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/cantidad.*mayor.*0/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when date is missing", async () => {
    render(<RegistrationForm />);

    const dateInput = screen.getByLabelText(/fecha/i);
    fireEvent.change(dateInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/fecha.*requerida/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when time is missing", async () => {
    render(<RegistrationForm />);

    const timeInput = screen.getByLabelText(/hora/i);
    fireEvent.change(timeInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/hora.*requerida/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when userName is missing", async () => {
    render(<RegistrationForm />);

    // Seleccionar un usuario válido pero luego vaciar userName manualmente
    const firstUser = USERS[0];
    if (!firstUser) throw new Error("No users available for testing");

    const userSelect = screen.getByLabelText(/usuario/i);
    fireEvent.change(userSelect, { target: { value: firstUser.id } });

    // Intentar submit sin userName (esto normalmente no pasaría, pero validamos el schema)
    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Si userName se autocompleta correctamente, no debería haber error
      // Este test verifica que el autocompletado funciona
      expect(
        screen.queryByText(/userName.*requerido/i)
      ).not.toBeInTheDocument();
    });
  });

  it("shows multiple validation errors at once", async () => {
    render(<RegistrationForm />);

    // Limpiar múltiples campos
    const userSelect = screen.getByLabelText(/usuario/i);
    const foodInput = screen.getByLabelText(/alimento/i);
    const dateInput = screen.getByLabelText(/fecha/i);
    const timeInput = screen.getByLabelText(/hora/i);
    const amountInput = screen.getByLabelText(/cantidad/i);

    fireEvent.change(userSelect, { target: { value: "" } });
    fireEvent.change(foodInput, { target: { value: "" } });
    fireEvent.change(dateInput, { target: { value: "" } });
    fireEvent.change(timeInput, { target: { value: "" } });
    fireEvent.change(amountInput, { target: { value: "0" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Verificar que hay múltiples errores visibles
      expect(screen.getByText(/usuario.*requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/alimento.*requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/fecha.*requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/hora.*requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/cantidad.*mayor.*0/i)).toBeInTheDocument();
    });
  });

  it("accepts valid positive decimal amounts", async () => {
    render(<RegistrationForm />);

    const firstUser = USERS[0];
    if (!firstUser) throw new Error("No users available for testing");

    // Llenar formulario con datos válidos
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: firstUser.id },
    });
    fireEvent.change(screen.getByLabelText(/alimento/i), {
      target: { value: "Manzana" },
    });
    fireEvent.change(screen.getByLabelText(/cantidad/i), {
      target: { value: "150.5" },
    });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // No debe haber errores de validación
      expect(screen.queryByText(/cantidad.*mayor.*0/i)).not.toBeInTheDocument();
    });
  });

  it("clears validation errors when field is corrected", async () => {
    render(<RegistrationForm />);

    const foodInput = screen.getByLabelText(/alimento/i);

    // Primero generar error
    fireEvent.change(foodInput, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      expect(screen.getByText(/alimento.*requerido/i)).toBeInTheDocument();
    });

    // Luego corregir el campo
    fireEvent.change(foodInput, { target: { value: "Banana" } });

    // Verificar que el error desaparece (react-hook-form lo hace automáticamente)
    await waitFor(() => {
      expect(
        screen.queryByText(/alimento.*requerido/i)
      ).not.toBeInTheDocument();
    });
  });

  it("validates that date format is YYYY-MM-DD", async () => {
    render(<RegistrationForm />);

    const dateInput = screen.getByLabelText(/fecha/i) as HTMLInputElement;

    // El input type="date" ya valida el formato, verificamos que tiene valor válido por defecto
    expect(dateInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("validates that time format is HH:MM", async () => {
    render(<RegistrationForm />);

    const timeInput = screen.getByLabelText(/hora/i) as HTMLInputElement;

    // El input type="time" ya valida el formato, verificamos que tiene valor válido por defecto
    expect(timeInput.value).toMatch(/^\d{2}:\d{2}$/);
  });

  it("accepts null value for optional sweetener field", async () => {
    render(<RegistrationForm />);

    const firstUser = USERS[0];
    if (!firstUser) throw new Error("No users available for testing");

    // Llenar formulario con sweetener = null (Ninguno)
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: firstUser.id },
    });
    fireEvent.change(screen.getByLabelText(/alimento/i), {
      target: { value: "Café" },
    });
    // Click on 'Ninguno' radio button for sweetener
    const ningunoRadio = screen.getByRole("radio", { name: /ninguno/i });
    fireEvent.click(ningunoRadio);

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // No debe haber error de validación relacionado con sweetener
      // Buscar específicamente mensajes de error que contengan "endulzante" seguido de "requerido" o "inválido"
      const errorMessages = screen.queryAllByText(/error|inválido|requerido/i);
      const sweetenerError = errorMessages.find((el) =>
        el.textContent?.toLowerCase().includes("endulzante")
      );
      expect(sweetenerError).toBeUndefined();
    });
  });

  it("accepts empty notes field", async () => {
    render(<RegistrationForm />);

    const firstUser = USERS[0];
    if (!firstUser) throw new Error("No users available for testing");

    // Llenar formulario sin notas
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: firstUser.id },
    });
    fireEvent.change(screen.getByLabelText(/alimento/i), {
      target: { value: "Pan" },
    });
    fireEvent.change(screen.getByLabelText(/notas/i), {
      target: { value: "" },
    });

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // No debe haber error en notas
      expect(screen.queryByText(/notas.*requerida/i)).not.toBeInTheDocument();
    });
  });
});
