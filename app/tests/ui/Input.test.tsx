import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Input } from "../../components/ui/Input";
import React from "react";

describe("Input", () => {
  it("aplica clases base", () => {
    const { getByRole } = render(<Input aria-label="food" />);
    const input = getByRole("textbox");
    expect(input.className).toMatch(/px-4/);
  });

  it("agrega clases de error cuando hasError=true", () => {
    const { getByRole } = render(<Input aria-label="cantidad" hasError />);
    const input = getByRole("textbox");
    expect(input.className).toMatch(/border-red-600/);
  });

  it("forwardRef monta el elemento", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="ref-test" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
