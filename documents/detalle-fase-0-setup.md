# Fase 0: Setup del Proyecto

## Configuración Inicial del Entorno de Desarrollo

**Objetivo:** Preparar el proyecto con todas las herramientas necesarias para desarrollo con TDD.

**Tiempo estimado:** 30-45 minutos

**Pre-requisitos:**

- Proyecto Next.js existente (tu playground)
- Node.js 18+ instalado
- npm o pnpm configurado

---

## Paso 0.1: Instalar y Configurar Testing (15-20 min)

### 0.1.1 Instalar Dependencias de Testing

Abre tu terminal en la raíz del proyecto y ejecuta:

```bash
npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jsdom
```

**¿Qué instalamos y por qué?**

| Paquete                       | Propósito                                      |
| ----------------------------- | ---------------------------------------------- |
| `vitest`                      | Test runner (alternativa rápida a Jest)        |
| `@vitejs/plugin-react`        | Permite a Vitest entender JSX/TSX              |
| `@testing-library/react`      | Testing de componentes React                   |
| `@testing-library/jest-dom`   | Matchers adicionales (toBeInTheDocument, etc.) |
| `@testing-library/user-event` | Simular interacciones de usuario               |
| `jsdom`                       | Simula el DOM del navegador en Node.js         |

---

### 0.1.2 Crear Archivo de Configuración de Vitest

Crea `vitest.config.ts` en la raíz del proyecto:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Usa jsdom para simular el navegador
    environment: "jsdom",

    // Permite usar expect, describe, it sin importarlos
    globals: true,

    // Archivo de setup que se ejecuta antes de cada test
    setupFiles: "./tests/setup.ts",

    // Cobertura de código
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "*.config.ts", "*.config.js"],
    },
  },
  resolve: {
    // Alias para imports absolutos (opcional pero recomendado)
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**¿Por qué esta configuración?**

- `globals: true` → No necesitas importar `describe`, `it`, `expect` en cada test
- `setupFiles` → Configuración común que se ejecuta antes de todos los tests
- `coverage` → Reportes de cobertura de código
- `alias` → Permite `import X from '@/components/X'` en lugar de rutas relativas

---

### 0.1.3 Crear Archivo de Setup

Crea la carpeta `tests/` en la raíz y dentro crea `setup.ts`:

```typescript
// tests/setup.ts
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extiende los matchers de Vitest con los de jest-dom
expect.extend(matchers);

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});

// Mock de localStorage (necesario para nuestros tests)
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

global.localStorage = localStorageMock as Storage;

// Limpiar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear();
});
```

**¿Qué hace este archivo?**

- Extiende `expect` con matchers como `toBeInTheDocument()`, `toHaveValue()`, etc.
- Limpia el DOM después de cada test (evita interferencias)
- Mockea `localStorage` para que funcione en tests
- Limpia `localStorage` antes de cada test (estado limpio)

---

### 0.1.4 Actualizar package.json con Scripts

Agrega estos scripts en tu `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

**Scripts explicados:**

- `test` → Corre tests en modo watch (auto-rerun al guardar)
- `test:ui` → Abre UI visual de Vitest en el navegador
- `test:coverage` → Genera reporte de cobertura
- `test:watch` → Alias explícito de watch mode

---

### 0.1.5 Verificar que Tests Funcionan

Crea un test de ejemplo en `tests/example.test.ts`:

```typescript
// tests/example.test.ts
import { describe, it, expect } from "vitest";

describe("Setup de testing", () => {
  it("debe pasar este test básico", () => {
    expect(1 + 1).toBe(2);
  });

  it("debe tener acceso a matchers de jest-dom", () => {
    const element = document.createElement("div");
    element.textContent = "Hola";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
  });

  it("debe tener localStorage mockeado", () => {
    localStorage.setItem("test", "value");
    expect(localStorage.getItem("test")).toBe("value");
  });
});
```

Ejecuta los tests:

```bash
npm run test
```

**Resultado esperado:**

```
✓ tests/example.test.ts (3)
  ✓ Setup de testing (3)
    ✓ debe pasar este test básico
    ✓ debe tener acceso a matchers de jest-dom
    ✓ debe tener localStorage mockeado

Test Files  1 passed (1)
Tests  3 passed (3)
```

✅ **Si ves esto, el setup de testing está completo.**

---

## Paso 0.2: Instalar Dependencias del Formulario (5 min)

### 0.2.1 Instalar React Hook Form y Zod

```bash
npm install react-hook-form @hookform/resolvers zod
```

**¿Qué instalamos?**

| Paquete               | Versión | Tamaño | Propósito                       |
| --------------------- | ------- | ------ | ------------------------------- |
| `react-hook-form`     | ^7.x    | ~9kb   | Manejo de estado del formulario |
| `@hookform/resolvers` | ^3.x    | ~2kb   | Integración RHF con Zod         |
| `zod`                 | ^3.x    | ~8kb   | Validaciones type-safe          |

**Total:** ~19kb (gzipped)

---

### 0.2.2 Verificar Instalación

Crea un archivo de prueba temporal `src/test-imports.ts`:

```typescript
// src/test-imports.ts
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

console.log("✅ Zod:", typeof z);
console.log("✅ useForm:", typeof useForm);
console.log("✅ zodResolver:", typeof zodResolver);
```

Impórtalo temporalmente en algún componente para verificar que no hay errores de TypeScript.

**Luego elimina este archivo** (solo era para verificar).

---

## Paso 0.3: Crear Estructura de Carpetas (5 min)

### 0.3.1 Estructura Propuesta

```bash
mkdir -p src/components/RegistroForm
mkdir -p src/lib/schemas
mkdir -p src/lib/storage
mkdir -p src/constants
mkdir -p src/types
```

**Resultado:**

```
src/
├── components/
│   └── RegistroForm/         # Componente principal del formulario
│       ├── RegistroForm.tsx
│       └── RegistroForm.test.tsx
├── lib/
│   ├── schemas/              # Schemas de validación
│   │   ├── registroSchema.ts
│   │   └── registroSchema.test.ts
│   └── storage/              # Funciones de localStorage
│       ├── localStorage.ts
│       └── localStorage.test.ts
├── constants/
│   └── users.ts              # Usuarios hardcoded
└── types/
    └── registro.ts           # Tipos TypeScript
```

---

### 0.3.2 Crear Archivos Placeholder

Crea archivos vacíos para tener estructura lista:

**src/types/registro.ts**

```typescript
// Tipos del dominio - TODO: implementar
```

**src/constants/users.ts**

```typescript
// Usuarios del sistema - TODO: implementar
```

**src/lib/schemas/registroSchema.ts**

```typescript
// Schema de validación Zod - TODO: implementar
```

**src/lib/storage/localStorage.ts**

```typescript
// Funciones de persistencia - TODO: implementar
```

**src/components/RegistroForm/RegistroForm.tsx**

```typescript
// Componente del formulario - TODO: implementar
```

---

## Paso 0.4: Configurar TypeScript (Opcional pero Recomendado) (5 min)

### 0.4.1 Verificar tsconfig.json

Asegúrate de que tu `tsconfig.json` tenga estas opciones:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**¿Por qué estas opciones?**

- `strict: true` → Máxima seguridad de tipos
- `noUncheckedIndexedAccess` → Previene acceso a arrays sin verificar
- `paths` → Permite imports con `@/`

---

### 0.4.2 Crear tipos.d.ts para Vitest Globals (si usas TypeScript)

Crea `vitest.d.ts` en la raíz:

```typescript
// vitest.d.ts
import "vitest";

declare global {
  namespace Vi {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveValue(value: string | number): R;
      // Agrega otros matchers que uses
    }
  }
}
```

Esto da autocompletado a los matchers de jest-dom.

---

## Paso 0.5: Configurar Git y .gitignore (5 min)

### 0.5.1 Actualizar .gitignore

Asegúrate de ignorar archivos de testing:

```gitignore
# Testing
coverage/
*.lcov
.nyc_output/

# Vitest
.vitest/
```

---

### 0.5.2 Commit Inicial del Setup

```bash
git add .
git commit -m "feat: setup testing environment with Vitest and React Testing Library"
```

**Mensaje de commit sigue Conventional Commits:**

- `feat:` → Nueva funcionalidad (setup es nueva capacidad)
- Descripción clara de qué se agregó

---

## Verificación Final: Checklist del Setup

Antes de pasar a la Fase 1, verifica:

### Testing

- [ ] `npm run test` corre sin errores
- [ ] Test de ejemplo pasa
- [ ] localStorage está mockeado
- [ ] Matchers de jest-dom funcionan

### Dependencias

- [ ] `zod` instalado y funcional
- [ ] `react-hook-form` instalado
- [ ] `@hookform/resolvers` instalado
- [ ] No hay errores de TypeScript al importar

### Estructura

- [ ] Carpeta `src/components/RegistroForm/` existe
- [ ] Carpeta `src/lib/schemas/` existe
- [ ] Carpeta `src/lib/storage/` existe
- [ ] Carpeta `src/constants/` existe
- [ ] Carpeta `src/types/` existe

### Configuración

- [ ] `vitest.config.ts` creado
- [ ] `tests/setup.ts` creado
- [ ] Scripts de test en `package.json`
- [ ] TypeScript configurado correctamente
- [ ] `.gitignore` actualizado

---

## Troubleshooting Común

### Error: "Cannot find module 'vitest'"

**Solución:** Reinstalar dependencias

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "expect is not defined"

**Solución:** Agregar `globals: true` en `vitest.config.ts`

### Error: "localStorage is not defined"

**Solución:** Verificar que `tests/setup.ts` tiene el mock de localStorage

### TypeScript no reconoce tipos de Testing Library

**Solución:** Agregar en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

### Tests muy lentos

**Solución:** Verificar que no estás corriendo en modo UI sin querer:

```bash
npm run test  # ✅ Correcto (watch mode)
npm run test:ui  # ❌ Más lento (abre navegador)
```

---

## Comandos de Referencia Rápida

```bash
# Instalar dependencias de testing
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Instalar dependencias del formulario
npm install react-hook-form @hookform/resolvers zod

# Crear estructura de carpetas
mkdir -p src/{components/RegistroForm,lib/{schemas,storage},constants,types}

# Correr tests
npm run test

# Ver cobertura
npm run test:coverage

# Abrir UI de tests
npm run test:ui
```

---

## Próximo Paso

Una vez completado el setup, continuar con **Fase 1: Modelo de Datos y Validaciones**.

En la Fase 1 crearemos:

1. Tipos TypeScript del dominio
2. Schema de validación con Zod (TDD)
3. Constante de usuarios

**Tiempo estimado Fase 1:** 1-1.5 horas

---

## Recursos Adicionales

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)

---

**Última actualización:** Noviembre 2025  
**Autor:** Documentación generada para proyecto de registro alimenticio
