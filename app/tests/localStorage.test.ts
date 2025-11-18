import "../tests/setup";
// Importar el tipo como tipo (resuelto por TS) desde el módulo TS (añadir .js por NodeNext)
import type { NewRegisterInput } from "../lib/storage/localStorage";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import {
  getAllRegisters,
  saveRegister,
  getRegistersByUserId,
  deleteRegister,
  clearAllRegisters,
  getRegisteredFoods,
} from "../lib/storage/localStorage";

const STORAGE_KEY = "nutrition-tracker-registers";

function setRawStorage(value: unknown) {
  window.localStorage.setItem(
    STORAGE_KEY,
    typeof value === "string" ? value : JSON.stringify(value)
  );
}

describe("getAllRegisters & parseRegisters", () => {
  beforeEach(() => {
    clearAllRegisters();
  });

  it("retorna [] si no hay datos", () => {
    window.localStorage.removeItem(STORAGE_KEY);
    expect(getAllRegisters()).toEqual([]);
  });

  it("retorna [] si hay datos corruptos", () => {
    setRawStorage("no es un array");
    expect(getAllRegisters()).toEqual([]);
  });

  it("retorna solo los válidos si hay mezcla", () => {
    // Crear un registro válido usando la función real (asegura cumplimiento del schema)
    const input: NewRegisterInput = {
      userId: "u1",
      userName: "Ana",
      food: "Manzana",
      amount: 1,
      unit: "unit",
      date: "2025-11-10",
      time: "08:00",
      mealType: "breakfast",
      sweetener: null,
    };
    const saved = saveRegister(input);
    if (!saved.success) throw new Error("saveRegister falló en test");
    // Inyectar un item inválido directamente en storage
    const arr = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    arr.push({ foo: "bar" });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    // Ahora getAllRegisters debe devolver solo el guardado válido
    expect(getAllRegisters()).toEqual([saved.data]);
  });
});

describe("saveRegister", () => {
  beforeEach(() => {
    clearAllRegisters();
  });
  afterEach(() => vi.restoreAllMocks());

  it("guarda un registro válido y lo retorna con success", () => {
    const input: NewRegisterInput = {
      userId: "u2",
      userName: "Luis",
      food: "Banana",
      amount: 2,
      unit: "unit", // literal
      date: "2025-11-11",
      time: "09:00",
      mealType: "breakfast",
      sweetener: null,
    };
    const result = saveRegister(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject(input);
      expect(result.data.id).toBeDefined();
      expect(result.data.createdAt).toBeDefined();
      expect(getAllRegisters()[0]).toMatchObject(input);
    }
  });

  it("retorna error si el registro es inválido", () => {
    // Usar Partial<NewRegisterInput> para simular objeto incompleto
    const input: Partial<NewRegisterInput> = {
      userId: "u2",
      // Falta userName y otros campos requeridos
    };
    // TypeScript requiere NewRegisterInput, pero el test simula error de validación
    // @ts-expect-error: purposely incomplete input for validation test
    const result = saveRegister(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
    }
    expect(getAllRegisters()).toEqual([]);
  });

  it("retorna STORAGE_ERROR en saveRegister si setItem falla", () => {
    const input: NewRegisterInput = {
      userId: "se",
      userName: "SE",
      food: "ErrorFood",
      amount: 1,
      unit: "unit",
      date: "2025-11-07",
      time: "12:00",
      mealType: "lunch",
      sweetener: null,
    };
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const r = saveRegister(input);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.code).toBe("STORAGE_ERROR");
  });
});

describe("getRegistersByUserId", () => {
  beforeEach(() => {
    clearAllRegisters();
  });

  it("filtra registros por userId", () => {
    const a: NewRegisterInput = {
      userId: "uA",
      userName: "A",
      food: "Pan",
      amount: 1,
      unit: "unit",
      date: "2025-11-01",
      time: "08:00",
      mealType: "breakfast",
      sweetener: null,
    };
    const b: NewRegisterInput = {
      userId: "uB",
      userName: "B",
      food: "Leche",
      amount: 200,
      unit: "ml",
      date: "2025-11-01",
      time: "09:00",
      mealType: "breakfast",
      sweetener: null,
    };
    saveRegister(a);
    saveRegister(b);
    expect(getRegistersByUserId("uA").every((r) => r.userId === "uA")).toBe(
      true
    );
    expect(getRegistersByUserId("uB").length).toBe(1);
  });
});

describe("deleteRegister", () => {
  beforeEach(() => {
    clearAllRegisters();
  });
  afterEach(() => vi.restoreAllMocks());

  it("elimina un registro existente y retorna success", () => {
    const input: NewRegisterInput = {
      userId: "du",
      userName: "D",
      food: "Huevo",
      amount: 2,
      unit: "unit",
      date: "2025-11-02",
      time: "10:00",
      mealType: "lunch",
      sweetener: null,
    };
    const saved = saveRegister(input);
    if (!saved.success) throw new Error("saveRegister falló en test");
    const id = saved.data.id;
    const res = deleteRegister(id);
    expect(res.success).toBe(true);
    if (res.success) expect(getAllRegisters()).toEqual([]);
  });

  it("retorna NOT_FOUND si no existe el id", () => {
    const res = deleteRegister("non-existent-id");
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.code).toBe("NOT_FOUND");
  });

  it("retorna STORAGE_ERROR si setItem lanza", () => {
    const input: NewRegisterInput = {
      userId: "du2",
      userName: "D2",
      food: "Yogurt",
      amount: 1,
      unit: "unit",
      date: "2025-11-03",
      time: "11:00",
      mealType: "breakfast",
      sweetener: null,
    };
    const saved = saveRegister(input);
    if (!saved.success) throw new Error("saveRegister falló en test");
    const id = saved.data.id;
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("mocked storage failure");
    });
    const res = deleteRegister(id);
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.code).toBe("STORAGE_ERROR");
  });
});

describe("clearAllRegisters", () => {
  beforeEach(() => {
    clearAllRegisters();
  });

  it("limpia todos los registros y retorna success", () => {
    const a: NewRegisterInput = {
      userId: "c1",
      userName: "C1",
      food: "A",
      amount: 1,
      unit: "unit",
      date: "2025-11-04",
      time: "07:00",
      mealType: "breakfast",
      sweetener: null,
    };
    saveRegister(a);
    const res = clearAllRegisters();
    expect(res.success).toBe(true);
    expect(getAllRegisters()).toEqual([]);
  });
});

describe("getRegisteredFoods", () => {
  beforeEach(() => {
    clearAllRegisters();
  });

  it("retorna lista única y ordenada de alimentos", () => {
    const a: NewRegisterInput = {
      userId: "f1",
      userName: "F1",
      food: "Zanahoria",
      amount: 1,
      unit: "unit",
      date: "2025-11-05",
      time: "08:00",
      mealType: "breakfast",
      sweetener: null,
    };
    const b: NewRegisterInput = {
      userId: "f2",
      userName: "F2",
      food: "Manzana",
      amount: 1,
      unit: "unit",
      date: "2025-11-05",
      time: "09:00",
      mealType: "breakfast",
      sweetener: null,
    };
    const c: NewRegisterInput = { ...a, userId: "f3", userName: "F3" };
    saveRegister(a);
    saveRegister(b);
    saveRegister(c);
    const foods = getRegisteredFoods();
    expect(foods).toEqual(["Manzana", "Zanahoria"]);
  });
});

describe("parseRegisters warnings (assert) & storage error simulations", () => {
  beforeEach(() => {
    clearAllRegisters();
  });
  afterEach(() => vi.restoreAllMocks());

  it("hace console.warn cuando hay items inválidos", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const input: NewRegisterInput = {
      userId: "v",
      userName: "V",
      food: "OK",
      amount: 1,
      unit: "unit",
      date: "2025-11-06",
      time: "08:00",
      mealType: "breakfast",
      sweetener: null,
    };
    const saved = saveRegister(input);
    if (!saved.success) throw new Error("saveRegister falló en test");
    const arr = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    arr.push({ bad: "item" });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    const res = getAllRegisters();
    expect(res).toEqual([saved.data]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
