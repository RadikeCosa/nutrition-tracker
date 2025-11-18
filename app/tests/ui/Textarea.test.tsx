import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Textarea } from "../../components/ui/Textarea";
import React from "react";

describe("Textarea", () => {
  it("renderiza con clases base", () => {
    const { getByLabelText } = render(<Textarea aria-label="notes" />);
    const el = getByLabelText(/notes/i);
    expect(el.className).toMatch(/rounded-md/);
  });

  it("agrega clases de error cuando hasError=true", () => {
    const { getByLabelText } = render(
      <Textarea aria-label="observaciones" hasError />
    );
    const el = getByLabelText(/observaciones/i);
    expect(el.className).toMatch(/border-red-600/);
  });

  it("forwardRef entrega el elemento", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="ref-textarea" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });
});
