import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RadioGroup } from "../../components/ui/RadioGroup";

describe("RadioGroup", () => {
  const options = [
    { value: "a", label: "Opción A" },
    { value: "b", label: "Opción B" },
    { value: "c", label: "Opción C" },
  ];

  it("renderiza opciones en layout vertical (default)", () => {
    render(<RadioGroup name="test" value="a" options={options} />);
    expect(screen.getByRole("radio", { name: /opción a/i })).toBeChecked();
    const container = screen.getByRole("radiogroup");
    expect(container.className).toMatch(/flex/);
  });

  it('usa layout grid cuando se pasa layout="grid"', () => {
    render(
      <RadioGroup name="grid" value="b" options={options} layout="grid" />
    );
    const container = screen.getByRole("radiogroup");
    expect(container.className).toMatch(/grid-cols-2/);
  });

  it("llama onChange al seleccionar otra opción", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        name="change"
        value="a"
        options={options}
        onChange={onChange}
      />
    );
    const optionB = screen.getByRole("radio", { name: /opción b/i });
    fireEvent.click(optionB);
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("agrega borde rojo cuando hasError y no hay value", () => {
    render(
      <RadioGroup name="error" value={undefined} hasError options={options} />
    );
    const container = screen.getByRole("radiogroup");
    expect(container.querySelector("label")?.className).toMatch(
      /border-red-600/
    );
  });
});
