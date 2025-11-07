import { RegisterSchema } from "../src/lib/schemas/register.schema.js";

import { describe, it, expect } from "vitest";

// Esqueleto de tests para RegisterSchema
describe("RegisterSchema", () => {
  it("valida un registro válido", () => {
    const validData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user123",
      userName: "John Doe",
      food: "Apple",
      amount: 150,
      unit: "gr",
      date: "2024-06-15",
      time: "12:30",
      mealType: "lunch",
      sweetener: null,
      notes: "Fresh apple",
      createdAt: "2024-06-15T12:30:00Z",
    };

    const result = RegisterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("falla si falta un campo obligatorio", () => {
    const invalidData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user123",
      food: "Apple",
      amount: 150,
      unit: "gr",
      date: "2024-06-15",
      time: "12:30",
      mealType: "lunch",
      sweetener: null,
      notes: "Fresh apple",
      createdAt: "2024-06-15T12:30:00Z",
    };

    const result = RegisterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("falla con valores inválidos", () => {
    const invalidData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user123",
      userName: "John Doe",
      food: "Apple",
      amount: -150,
      unit: "gr",
      date: "2024-06-15",
      time: "12:30",
      mealType: "lunch",
      sweetener: null,
      notes: "Fresh apple",
      createdAt: "2024-06-15T12:30:00Z",
    };

    const result = RegisterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("acepta valores opcionales correctamente", () => {
    const validData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user123",
      userName: "John Doe",
      food: "Apple",
      amount: 150,
      unit: "gr",
      date: "2024-06-15",
      time: "12:30",
      mealType: "lunch",
      sweetener: null,
      notes: "Fresh apple",
      createdAt: "2024-06-15T12:30:00Z",
    };

    const result = RegisterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
