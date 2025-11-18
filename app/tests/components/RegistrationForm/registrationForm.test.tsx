import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RegistrationForm from "../../../components/RegistrationForm/RegistrationForm";
import { USERS } from "../../../constants/users";

describe("RegistrationForm - Rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form without errors", () => {
    render(<RegistrationForm />);

    const fieldset = screen.getByRole("group", {
      name: /registro de consumo de alimentos/i,
    });
    expect(fieldset).toBeInTheDocument();
  });

  it("renders all required form fields", () => {
    render(<RegistrationForm />);

    // Campos obligatorios
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora/i)).toBeInTheDocument();
    expect(screen.getByText(/tipo de comida/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/alimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cantidad/i)).toBeInTheDocument();
    // For RadioGroup fields, verify the radiogroup role exists
    expect(screen.getAllByRole("radiogroup")).toHaveLength(3); // mealType, unit, sweetener
  });

  it("renders optional fields", () => {
    render(<RegistrationForm />);

    expect(screen.getByText(/endulzante/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notas/i)).toBeInTheDocument();
  });

  it("renders submit button in enabled state", () => {
    render(<RegistrationForm />);

    const submitButton = screen.getByRole("button", {
      name: /guardar registro/i,
    });

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it("populates user select with all users", () => {
    render(<RegistrationForm />);

    const userSelect = screen.getByLabelText(/usuario/i) as HTMLSelectElement;
    const options = Array.from(userSelect.options);

    // Primera opción debe ser el placeholder
    expect(options[0]?.value).toBe("");

    // Debe tener todos los usuarios de la constante USERS
    expect(options.length).toBe(USERS.length + 1);

    // Verificar que los usuarios están presentes
    USERS.forEach((user) => {
      const option = options.find((opt) => opt.value === user.id);
      expect(option).toBeDefined();
      expect(option?.textContent).toBe(user.name);
    });
  });

  it("sets current date and time as default values", () => {
    render(<RegistrationForm />);

    const dateInput = screen.getByLabelText(/fecha/i) as HTMLInputElement;
    const timeInput = screen.getByLabelText(/hora/i) as HTMLInputElement;

    // Verificar formato de fecha (YYYY-MM-DD)
    expect(dateInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // Verificar formato de hora (HH:MM)
    expect(timeInput.value).toMatch(/^\d{2}:\d{2}$/);
  });

  it("renders amount input with default value of 1", () => {
    render(<RegistrationForm />);

    const amountInput = screen.getByLabelText(/cantidad/i) as HTMLInputElement;
    expect(amountInput.value).toBe("1");
  });

  it("renders unit radiogroup with default value 'unit'", () => {
    render(<RegistrationForm />);

    // Buscamos el radio "Unidad" que debe estar checked por defecto
    const unitRadio = screen.getByRole("radio", {
      name: /^unidad$/i,
    }) as HTMLInputElement;
    expect(unitRadio.checked).toBe(true);
  });

  it("renders mealType select with default value 'breakfast'", () => {
    render(<RegistrationForm />);

    // Ahora es un radiogroup, buscamos el radio checked
    const breakfastRadio = screen.getByRole("radio", {
      name: /desayuno/i,
    }) as HTMLInputElement;
    expect(breakfastRadio.checked).toBe(true);
  });

  it("renders sweetener radiogroup with 'Ninguno' option", () => {
    render(<RegistrationForm />);

    // Buscar el radio "Ninguno" que debe existir
    const noSweetenerRadio = screen.queryByRole("radio", {
      name: /ninguno/i,
    });
    expect(noSweetenerRadio).toBeInTheDocument();
  });

  it("does not show feedback message on initial render", () => {
    render(<RegistrationForm />);

    // Buscar específicamente el contenedor de FeedbackMessage
    // que tiene el texto "guardado" o "error"
    const feedbackRegex = /guardado correctamente|error al guardar/i;

    const feedbackMessage = screen.queryByText(feedbackRegex);
    expect(feedbackMessage).not.toBeInTheDocument();
  });
});
