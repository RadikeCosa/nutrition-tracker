import {
  UnitEnum,
  MealTypeEnum,
  SweetenerEnum,
} from "@/app/lib/schemas/register.schema";

const unitOptions = UnitEnum.options;
const mealTypeOptions = MealTypeEnum.options;
const sweetenerOptions = SweetenerEnum.options;

export const UNIT_LABELS: Record<(typeof unitOptions)[number], string> = {
  unit: "Unidad",
  gr: "Gramos",
  ml: "Mililitros",
  portion: "Porción",
  "small-portion": "Porción Pequeña",
  "large-portion": "Porción Grande",
};

export const MEAL_TYPE_LABELS: Record<
  (typeof mealTypeOptions)[number],
  string
> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  snack: "Merienda",
  dinner: "Cena",
  collation: "Colación",
};

export const SWEETENER_LABELS: Record<
  (typeof sweetenerOptions)[number],
  string
> = {
  sugar: "Azúcar",
  sweetener: "Edulcorante",
};

// Re-exportar las opciones para facilitar su uso
export { unitOptions, mealTypeOptions, sweetenerOptions };
