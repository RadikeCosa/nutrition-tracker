import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import axe from "axe-core";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { RadioGroup } from "../../components/ui/RadioGroup";

async function runAxe(container: HTMLElement) {
  return await axe.run(container);
}

describe("A11y - Dynamic UI States", () => {
  it("RegistrationForm after submit errors remains accessible", async () => {
    const { container } = render(<RegistrationForm />);
    // Forzar errores: limpiar usuario si tuviera valor y alimento vacio
    const submit = screen.getByRole("button", { name: /guardar registro/i });
    fireEvent.click(submit);
    // Ahora el formulario muestra mensajes de ErrorMessage
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("Loading Button state has no violations", async () => {
    const { container } = render(<Button isLoading>Guardar registro</Button>);
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("Input with aria-invalid + linked ErrorMessage has no violations", async () => {
    const { container } = render(
      <div>
        <label
          htmlFor="food"
          className="block text-sm font-medium text-gray-700"
        >
          Alimento
        </label>
        <Input id="food" aria-invalid="true" aria-describedby="food-error" />
        <ErrorMessage id="food-error" message="Alimento requerido" />
      </div>
    );
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("RadioGroup in error state (hasError) has no violations", async () => {
    const { container } = render(
      <RadioGroup
        name="unit"
        hasError
        options={[
          { label: "Gramos", value: "gr" },
          { label: "Unidad", value: "unit" },
        ]}
      />
    );
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("Feedback success message accessible", async () => {
    const { container } = render(<ErrorMessage message="Registro guardado" />);
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });
});
