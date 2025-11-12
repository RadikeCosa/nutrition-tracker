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

// Schema base (sin id ni createdAt) - el que necesita el formulario
export const RegisterInputSchema = z.object({
  userId: z.string().min(1, "Selecciona un usuario"),
  userName: z.string().min(1, "El nombre de usuario es requerido"),
  food: z.string().min(1, "El alimento es requerido"),
  amount: z.number().positive("La cantidad debe ser positiva"),
  unit: UnitEnum,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
  mealType: MealTypeEnum,
  sweetener: SweetenerEnum.nullable(),
  notes: z.string().optional(),
});

// Schema completo (con id y createdAt) - el que se guarda en storage
export const RegisterSchema = RegisterInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/,
      "Invalid ISO timestamp"
    ),
});

// Tipos inferidos
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type Register = z.infer<typeof RegisterSchema>;
