import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../../components/ui/Label";

describe("Label", () => {
  it("renderiza el texto básico", () => {
    render(<Label htmlFor="test">Nombre</Label>);
    expect(screen.getByText(/nombre/i)).toBeInTheDocument();
  });

  it("muestra asterisco y texto sr-only cuando required=true", () => {
    render(
      <Label htmlFor="email" required>
        Email
      </Label>
    );
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    const srOnly = screen.getByText(/requerido/i);
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveClass("sr-only");
  });
});
