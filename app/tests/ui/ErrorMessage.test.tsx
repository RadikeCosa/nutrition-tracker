import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

describe("ErrorMessage", () => {
  it("no renderiza nada si message es undefined", () => {
    const { container } = render(<ErrorMessage message={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza el mensaje con role=alert y aria-live=polite", () => {
    render(<ErrorMessage message="Campo requerido" id="field-error" />);
    const el = screen.getByText(/campo requerido/i);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("role", "alert");
    expect(el).toHaveAttribute("aria-live", "polite");
    expect(el).toHaveAttribute("id", "field-error");
  });
});
