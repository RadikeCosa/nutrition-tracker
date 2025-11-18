import { RegisterSchema } from "@/app/lib/schemas/register.schema";

import { describe, it, expect } from "vitest";

describe("RegisterSchema", () => {
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

  it("valida un registro válido", () => {
    const result = RegisterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe("Campos obligatorios", () => {
    it("falla si falta id", () => {
      const { id, ...dataWithoutId } = validData;
      const result = RegisterSchema.safeParse(dataWithoutId);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("id");
    });

    it("falla si falta userId", () => {
      const { userId, ...dataWithoutUserId } = validData;
      const result = RegisterSchema.safeParse(dataWithoutUserId);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("userId");
    });

    it("falla si falta userName", () => {
      const { userName, ...dataWithoutUserName } = validData;
      const result = RegisterSchema.safeParse(dataWithoutUserName);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("userName");
    });

    it("falla si falta food", () => {
      const { food, ...dataWithoutFood } = validData;
      const result = RegisterSchema.safeParse(dataWithoutFood);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("food");
    });

    it("falla si falta amount", () => {
      const { amount, ...dataWithoutAmount } = validData;
      const result = RegisterSchema.safeParse(dataWithoutAmount);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("amount");
    });

    it("falla si falta unit", () => {
      const { unit, ...dataWithoutUnit } = validData;
      const result = RegisterSchema.safeParse(dataWithoutUnit);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("unit");
    });

    it("falla si falta date", () => {
      const { date, ...dataWithoutDate } = validData;
      const result = RegisterSchema.safeParse(dataWithoutDate);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("date");
    });

    it("falla si falta time", () => {
      const { time, ...dataWithoutTime } = validData;
      const result = RegisterSchema.safeParse(dataWithoutTime);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("time");
    });

    it("falla si falta mealType", () => {
      const { mealType, ...dataWithoutMealType } = validData;
      const result = RegisterSchema.safeParse(dataWithoutMealType);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("mealType");
    });

    it("falla si falta createdAt", () => {
      const { createdAt, ...dataWithoutCreatedAt } = validData;
      const result = RegisterSchema.safeParse(dataWithoutCreatedAt);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("createdAt");
    });
  });

  describe("Validaciones de formato", () => {
    it("falla con formato de fecha inválido", () => {
      const invalidData = { ...validData, date: "15-06-2024" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toContain("Invalid date format");
    });

    it("falla con formato de hora inválido", () => {
      const invalidData = { ...validData, time: "12:30:00" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toContain("Invalid time format");
    });

    it("falla con formato de createdAt inválido", () => {
      const invalidData = { ...validData, createdAt: "2024-06-15 12:30:00" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toContain(
        "Invalid ISO timestamp"
      );
    });

    it("falla con UUID inválido", () => {
      const invalidData = { ...validData, id: "not-a-uuid" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("id");
    });
  });

  describe("Validaciones de valores", () => {
    it("falla con cantidad cero", () => {
      const invalidData = { ...validData, amount: 0 };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("amount");
    });

    it("falla con cantidad negativa", () => {
      const invalidData = { ...validData, amount: -150 };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("amount");
    });

    it("falla con unit inválido", () => {
      const invalidData = { ...validData, unit: "invalid-unit" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("unit");
    });

    it("falla con mealType inválido", () => {
      const invalidData = { ...validData, mealType: "invalid-meal" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("mealType");
    });

    it("falla con sweetener inválido", () => {
      const invalidData = { ...validData, sweetener: "invalid-sweetener" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("sweetener");
    });
  });

  describe("Validaciones de strings", () => {
    it("falla con userId vacío", () => {
      const invalidData = { ...validData, userId: "" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("userId");
    });

    it("falla con userName vacío", () => {
      const invalidData = { ...validData, userName: "" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("userName");
    });

    it("falla con food vacío", () => {
      const invalidData = { ...validData, food: "" };
      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toContain("food");
    });
  });

  describe("Campos opcionales", () => {
    it("acepta sweetener null", () => {
      const dataWithNullSweetener = { ...validData, sweetener: null };
      const result = RegisterSchema.safeParse(dataWithNullSweetener);
      expect(result.success).toBe(true);
    });

    it("acepta sweetener válido", () => {
      const dataWithSugar = { ...validData, sweetener: "sugar" };
      const result = RegisterSchema.safeParse(dataWithSugar);
      expect(result.success).toBe(true);
    });

    it("acepta sweetener válido (sweetener)", () => {
      const dataWithSweetener = { ...validData, sweetener: "sweetener" };
      const result = RegisterSchema.safeParse(dataWithSweetener);
      expect(result.success).toBe(true);
    });

    it("acepta notes opcional", () => {
      const { notes, ...dataWithoutNotes } = validData;
      const result = RegisterSchema.safeParse(dataWithoutNotes);
      expect(result.success).toBe(true);
    });

    it("acepta notes definido", () => {
      const dataWithNotes = { ...validData, notes: "Some notes" };
      const result = RegisterSchema.safeParse(dataWithNotes);
      expect(result.success).toBe(true);
    });
  });

  describe("Enums válidos", () => {
    const validUnits = [
      "gr",
      "ml",
      "unit",
      "portion",
      "small-portion",
      "large-portion",
    ];
    const validMealTypes = [
      "breakfast",
      "lunch",
      "snack",
      "dinner",
      "collation",
    ];

    it.each(validUnits)("acepta unit válido: %s", (unit) => {
      const data = { ...validData, unit };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it.each(validMealTypes)("acepta mealType válido: %s", (mealType) => {
      const data = { ...validData, mealType };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
