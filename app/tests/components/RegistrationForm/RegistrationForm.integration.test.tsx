import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "../../../components/RegistrationForm/RegistrationForm";
import { USERS } from "../../../constants/users";

const STORAGE_KEY = "nutrition-tracker-registers";

function pickFirstUser() {
  const select = screen.getByLabelText(/usuario/i) as HTMLSelectElement;
  const first = Array.from(select.options).find((o) => o.value);
  if (!first) throw new Error("No hay usuarios disponibles");
  fireEvent.change(select, { target: { value: first.value } });
  return {
    id: first.value,
    name: USERS.find((u) => u.id === first.value)?.name,
  };
}

async function fillMinimumValidForm() {
  const user = pickFirstUser();
  fireEvent.change(screen.getByLabelText(/alimento/i), {
    target: { value: "Manzana" },
  });
  // amount ya parte en 1; lo dejamos así para flujo mínimo
  return user;
}

beforeEach(() => {
  localStorage.clear();
});

describe("RegistrationForm - Integración", () => {
  it("flujo feliz: envía, muestra éxito, persiste y resetea manteniendo usuario", async () => {
    render(<RegistrationForm />);
    const { id: selectedUserId, name } = await fillMinimumValidForm();

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      // feedback de éxito
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(/guardado/i);

      // persistencia
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBeTruthy();
      const list = JSON.parse(raw as string);
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
      const last = list[list.length - 1];

      // datos clave guardados
      expect(last.userId).toBe(selectedUserId);
      expect(last.userName).toBe(name);
      expect(last.food).toBe("Manzana");
      expect(typeof last.amount).toBe("number");
      expect(last.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(last.time).toMatch(/^\d{2}:\d{2}$/);
    });

    // formulario reseteado pero mantiene usuario seleccionado
    const food = screen.getByLabelText(/alimento/i) as HTMLInputElement;
    const amount = screen.getByLabelText(/cantidad/i) as HTMLInputElement;
    const userSelect = screen.getByLabelText(/usuario/i) as HTMLSelectElement;
    expect(food.value).toBe("");
    expect(amount.value).toBe("1");
    expect(userSelect.value).toBe(selectedUserId);
  });

  it("muestra errores, luego corrige y permite enviar", async () => {
    render(<RegistrationForm />);

    // Forzar submit con errores
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/alimento/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      expect(screen.getByText(/usuario.*requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/alimento.*requerido/i)).toBeInTheDocument();
    });

    // Corregir y enviar
    await fillMinimumValidForm();
    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBeTruthy();
      expect(screen.getByRole("alert")).toHaveTextContent(/guardado/i);
    });
  });

  it("mapea 'Ninguno' de sweetener a null en el registro guardado", async () => {
    render(<RegistrationForm />);
    await fillMinimumValidForm();

    // Click on 'Ninguno' radio button
    const ningunoRadio = screen.getByRole("radio", { name: /ninguno/i });
    fireEvent.click(ningunoRadio);

    fireEvent.click(screen.getByRole("button", { name: /guardar registro/i }));

    await waitFor(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = JSON.parse(raw as string);
      const last = list[list.length - 1];
      expect(last.sweetener).toBeNull();
    });
  });
});
