import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";

async function runAxe(container: HTMLElement) {
  // Contrast rule ACTIVATED: palette preliminarily cumple ratio suficiente.
  return await axe.run(container);
}

describe("A11y - RegistrationForm", () => {
  it("no violations on initial render (including contrast)", async () => {
    const { container } = render(<RegistrationForm />);
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  }, 10000);
});
