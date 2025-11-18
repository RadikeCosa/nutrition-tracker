import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Los matchers se extienden automáticamente al importar @testing-library/jest-dom

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

globalThis.localStorage = localStorageMock as Storage;

// Limpia localStorage antes de cada test
beforeEach(() => {
  localStorage.clear();
});
