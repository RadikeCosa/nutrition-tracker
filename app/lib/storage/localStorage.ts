import { ZodType } from "zod";
import {
  RegisterSchema,
  Register,
  RegisterInput,
} from "../schemas/register.schema";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "nutrition-tracker-registers";

/**
 * Best-effort parse of nutrition registers from localStorage.
 *
 * Comportamiento:
 * - Si `raw` es null, JSON inválido o no es un array, retorna [] y hace console.warn.
 * - No hace validación completa en cada lectura: filtra solo los items que validan contra RegisterSchema.
 * - Por cada item inválido emite console.warn con las `issues` devueltas por Zod.
 * - Diseñado para ser tolerante a corrupción parcial de datos en storage.
 */
export function parseRegisters(
  raw: string | null,
  schema?: ZodType<Register>
): Register[] {
  const usedSchema = schema ?? RegisterSchema;
  if (!raw) return [];
  let arr: unknown;
  try {
    arr = JSON.parse(raw);
  } catch {
    console.warn("[parseRegisters] Invalid JSON in storage");
    return [];
  }
  if (!Array.isArray(arr)) {
    console.warn("[parseRegisters] Storage data is not an array");
    return [];
  }
  const valid: Register[] = [];
  arr.forEach((item, idx) => {
    const result = usedSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      console.warn(
        `[parseRegisters] Invalid register at index ${idx}:`,
        result.error.issues
          .map((issue: { message: string }) => issue.message)
          .join("; ")
      );
    }
  });
  return valid;
}

/**
 * Obtiene todos los registros válidos desde localStorage.
 */
export function getAllRegisters(): Register[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return parseRegisters(raw, RegisterSchema);
}

/**
 * Devuelve todos los registros válidos de un usuario específico.
 */
export function getRegistersByUserId(userId: string): Register[] {
  return getAllRegisters().filter((reg) => reg.userId === userId);
}

export type NewRegisterInput = RegisterInput;

export type Result<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string } };

/**
 * Genera un id único usando crypto.randomUUID si está disponible.
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback usando uuidv4
  return uuidv4();
}

/**
 * Guarda un nuevo registro en localStorage, validando con Zod.
 */
export function saveRegister(input: NewRegisterInput): Result<Register> {
  const newRegister: Register = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  const validation = RegisterSchema.safeParse(newRegister);
  if (!validation.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: validation.error.issues.map((i) => i.message).join("; "),
      },
    };
  }

  try {
    const all = getAllRegisters();
    all.push(validation.data);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return {
      success: true,
      data: validation.data,
      message: "Registro guardado correctamente.",
    };
  } catch {
    return {
      success: false,
      error: {
        code: "STORAGE_ERROR",
        message: "No se pudo guardar el registro.",
      },
    };
  }
}

/**
 * Elimina un registro por su id. Retorna Result<null>.
 */
export function deleteRegister(registerId: string): Result<null> {
  try {
    const all = getAllRegisters();
    const idx = all.findIndex((reg) => reg.id === registerId);
    if (idx === -1) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Registro no encontrado.",
        },
      };
    }
    all.splice(idx, 1);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return {
      success: true,
      data: null,
      message: "Registro eliminado correctamente.",
    };
  } catch {
    return {
      success: false,
      error: {
        code: "STORAGE_ERROR",
        message: "No se pudo eliminar el registro.",
      },
    };
  }
}

/**
 * Borra todos los registros del localStorage. Útil para testing.
 */
export function clearAllRegisters(): Result<null> {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return {
      success: true,
      data: null,
      message: "Todos los registros han sido eliminados.",
    };
  } catch {
    return {
      success: false,
      error: {
        code: "STORAGE_ERROR",
        message: "No se pudo limpiar el almacenamiento.",
      },
    };
  }
}

/**
 * Devuelve una lista única y ordenada de los nombres de alimentos registrados.
 */
export function getRegisteredFoods(): string[] {
  const all = getAllRegisters();
  const foods = Array.from(new Set(all.map((reg) => reg.food).filter(Boolean)));
  return foods.sort((a, b) => a.localeCompare(b));
}
