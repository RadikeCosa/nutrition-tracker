import { USERS } from "../constants/users";
import { getUserById, getAllUsers, userIdExists } from "../lib/user-helpers";
import { describe, it, expect } from "vitest";

describe("USERS array", () => {
  it("no tiene IDs duplicados", () => {
    const ids = USERS.map((u) => u.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("todos los IDs tienen formato UUID", () => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    USERS.forEach((user) => {
      expect(uuidRegex.test(user.id)).toBe(true);
    });
  });
});

describe("user helpers", () => {
  it("getUserById devuelve el usuario correcto", () => {
    const user = USERS[0];
    if (!user) throw new Error("No users available for testing");
    const found = getUserById(user.id);
    expect(found).toBeDefined();
    expect(found).toEqual(user);
  });

  it("getAllUsers devuelve todos los usuarios", () => {
    expect(getAllUsers()).toEqual(USERS);
  });

  it("userIdExists verifica existencia correctamente", () => {
    const user = USERS[1];
    if (!user) throw new Error("No users available for testing");
    expect(userIdExists(user.id)).toBe(true);
    expect(userIdExists("no-existe")).toBe(false);
  });
});
