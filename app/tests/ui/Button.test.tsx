import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../../components/ui/Button";

describe("Button", () => {
  it("renderiza variante primaria por defecto", () => {
    render(<Button>Guardar</Button>);
    const btn = screen.getByRole("button", { name: /guardar/i });
    expect(btn.className).toMatch(/bg-blue-600/);
  });

  it("renderiza variante secundaria", () => {
    render(<Button variant="secondary">Cancelar</Button>);
    const btn = screen.getByRole("button", { name: /cancelar/i });
    expect(btn.className).toMatch(/bg-gray-100/);
  });

  it("muestra spinner y deshabilita cuando isLoading=true", () => {
    render(<Button isLoading>Procesando</Button>);
    const btn = screen.getByRole("button", { name: /procesando/i });
    expect(btn).toBeDisabled();
    const spinner = btn.querySelector("span span");
    expect(spinner).toBeInTheDocument();
  });
});
