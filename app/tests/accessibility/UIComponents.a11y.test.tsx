import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { RadioGroup } from "../../components/ui/RadioGroup";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

async function runAxe(container: HTMLElement) {
  return await axe.run(container);
}

describe("A11y - Core UI Components", () => {
  it("Button (default) has no violations including contrast", async () => {
    const { container } = render(<Button>Acción</Button>);
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("Input + Label association has no violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </div>
    );
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("Textarea + Label has no violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" />
      </div>
    );
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("Select + Label has no violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="user">Usuario</Label>
        <Select id="user" options={[{ label: "Uno", value: "1" }]} />
      </div>
    );
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("RadioGroup has no violations", async () => {
    const { container } = render(
      <RadioGroup
        name="mealType"
        options={[
          { label: "Desayuno", value: "breakfast" },
          { label: "Almuerzo", value: "lunch" },
        ]}
      />
    );
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("ErrorMessage (visible) has no violations", async () => {
    const { container } = render(<ErrorMessage message="Campo requerido" />);
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });
});
