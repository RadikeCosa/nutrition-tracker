import { z } from "zod";

// Helpers estrictos
function isValidISODateYYYYMMDD(v: string): boolean {
  // Formato correcto y fecha real (incluye meses/días válidos y bisiestos)
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

// Regex que SOLO acepta HH:MM (estricta)
const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

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
  userId: z.string().min(1, "Usuario es requerido"),
  userName: z.string().min(1, "El nombre de usuario es requerido"),
  food: z.string().trim().min(1, "Alimento es requerido"),
  amount: z.coerce.number().gt(0, "Cantidad debe ser mayor a 0"),
  unit: UnitEnum,
  date: z
    .string()
    .min(1, "Fecha es requerida")
    .refine(isValidISODateYYYYMMDD, "Invalid date format"),
  time: z
    .string()
    .min(1, "Hora es requerida")
    .regex(TIME_24H_REGEX, "Invalid time format"),
  mealType: MealTypeEnum,
  sweetener: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return null;
      return v;
    })
    .pipe(SweetenerEnum.nullable()),
  notes: z.string().optional(),
});

// Schema completo (con id y createdAt) - el que se guarda en storage
export const RegisterSchema = RegisterInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/,
      "Invalid ISO timestamp"
    ),
});

// Tipos inferidos
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type Register = z.infer<typeof RegisterSchema>;
