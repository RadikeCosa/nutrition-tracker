import { describe, expect, it } from "vitest";

describe("Setup de testing", () => {
  it("debe pasar este test básico", () => {
    expect(1 + 1).toBe(2);
  });

  it("debe tener acceso a los matchers de jest-dom", () => {
    const element = document.createElement("div");
    element.textContent = "Hola";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
  });

  it("debe tener localStorage mockeado", () => {
    localStorage.setItem("test", "value");
    expect(localStorage.getItem("test")).toBe("value");
  });
});
