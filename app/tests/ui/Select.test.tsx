import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "../../components/ui/Select";

describe("Select", () => {
  it("renderiza opciones via props", () => {
    render(
      <Select
        aria-label="usuarios"
        options={[
          { value: "1", label: "Juan" },
          { value: "2", label: "Ana" },
        ]}
      />
    );
    expect(screen.getByRole("option", { name: /juan/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /ana/i })).toBeInTheDocument();
  });

  it("prefiere children sobre options", () => {
    render(
      <Select aria-label="override" options={[{ value: "x", label: "X" }]}>
        <option value="a">A</option>
      </Select>
    );
    expect(screen.getByRole("option", { name: "A" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "X" })).toBeNull();
  });

  it("agrega clases de error cuando hasError=true", () => {
    const { getByLabelText } = render(
      <Select
        aria-label="errores"
        hasError
        options={[{ value: "1", label: "Uno" }]}
      />
    );
    const select = getByLabelText(/errores/i);
    expect(select.className).toMatch(/border-red-600/);
  });
});
