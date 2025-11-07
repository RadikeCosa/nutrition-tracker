import { z } from "zod";

// Enums
export const UnitEnum = z.enum([
  "gr",
  "ml",
  "unit",
  "portion",
  "small-portion",
  "large-portion",
]);

export const MealTypeEnum = z.enum([
  "breakfast",
  "lunch",
  "snack",
  "dinner",
  "collation",
]);

export const SweetenerEnum = z.enum(["sugar", "sweetener"]);

// Schema principal
export const RegisterSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().min(1),
  userName: z.string().min(1),
  food: z.string().min(1),
  amount: z.number().positive(),
  unit: UnitEnum,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  mealType: MealTypeEnum,
  sweetener: SweetenerEnum.nullable(),
  notes: z.string().optional(),
  createdAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/,
      "Invalid ISO timestamp"
    ),
});

// Tipo inferido
export type Register = z.infer<typeof RegisterSchema>;
