# Plan de Desarrollo Paso a Paso

## App de Registro de Consumos Alimenticios - MVP

**Objetivo:** Desarrollar formulario funcional con persistencia en localStorage siguiendo TDD pragmático.

**Tiempo estimado total:** 8-12 horas de desarrollo

---

## Fase 0: Setup del Proyecto (30-45 min)

### 0.1: Configurar Testing Básico (15-20 min)

1. **Instalar Dependencias de Testing:**

   Ejecuta el siguiente comando en la raíz del proyecto:

   ```bash
   npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```

   **¿Qué se instala y por qué?**

   | Paquete                       | Propósito                              |
   | ----------------------------- | -------------------------------------- |
   | `vitest`                      | Test runner rápido y ligero            |
   | `@vitejs/plugin-react`        | Soporte para JSX/TSX en Vitest         |
   | `@testing-library/react`      | Testing de componentes React           |
   | `@testing-library/jest-dom`   | Matchers adicionales para pruebas DOM  |
   | `@testing-library/user-event` | Simulación de interacciones de usuario |
   | `jsdom`                       | Simulación del DOM en Node.js          |

2. **Crear Archivo de Configuración de Vitest:**

   Crea un archivo `vitest.config.ts` con la siguiente configuración:

   ```typescript
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: "jsdom",
       setupFiles: "./tests/setup.ts",
       coverage: {
         reporter: ["text", "json", "html"],
       },
     },
   });
   ```

3. **Crear Archivo de Setup para Tests:**

   Crea la carpeta `tests/` y dentro un archivo `setup.ts`:

   ```typescript
   import { expect, afterEach } from "vitest";
   import { cleanup } from "@testing-library/react";
   import * as matchers from "@testing-library/jest-dom/matchers";

   expect.extend(matchers);

   afterEach(() => {
     cleanup();
   });
   ```

4. **Agregar Scripts de Testing en `package.json`:**

   Añade los siguientes scripts:

   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:watch": "vitest --watch"
     }
   }
   ```

5. **Verificar Configuración:**

   Crea un archivo de prueba `tests/example.test.ts` y ejecuta los tests:

   ```typescript
   import { describe, it, expect } from "vitest";

   describe("Setup de testing", () => {
     it("debe pasar este test básico", () => {
       expect(true).toBe(true);
     });
   });
   ```

   Ejecuta:

   ```bash
   npm run test
   ```

   **Resultado esperado:** Todos los tests deben pasar sin errores.

---

### 0.2: Instalar Dependencias del Formulario (5 min)

1. **Instalar React Hook Form y Zod:**

   ```bash
   npm install react-hook-form @hookform/resolvers zod
   ```

   **¿Qué se instala?**

   | Paquete               | Propósito                              |
   | --------------------- | -------------------------------------- |
   | `react-hook-form`     | Manejo de formularios con validaciones |
   | `@hookform/resolvers` | Integración de validaciones con Zod    |
   | `zod`                 | Validaciones type-safe                 |

2. **Verificar Instalación:**

   Crea un archivo temporal `src/test-imports.ts` para verificar que las dependencias funcionan:

   ```typescript
   import { z } from "zod";
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";

   console.log("✅ Zod:", typeof z);
   console.log("✅ useForm:", typeof useForm);
   console.log("✅ zodResolver:", typeof zodResolver);
   ```

   Luego elimina este archivo.

---

### 0.3: Crear Estructura de Carpetas (5 min)

1. **Estructura Propuesta:**

   ```bash
   mkdir -p src/components/RegistroForm
   mkdir -p src/lib/schemas
   mkdir -p src/lib/storage
   mkdir -p src/constants
   mkdir -p src/types
   ```

2. **Archivos Placeholder:**

   Crea archivos vacíos para mantener la estructura:

   - `src/types/registro.ts`
   - `src/constants/users.ts`
   - `src/lib/schemas/registroSchema.ts`
   - `src/lib/storage/localStorage.ts`
   - `src/components/RegistroForm/RegistroForm.tsx`

---

**Entregable:** Proyecto configurado, tests corriendo, dependencias instaladas, y estructura lista para desarrollo.

---

## Fase 1: Modelo de Datos y Validaciones (1-1.5 hrs)

1. Definir tipos TypeScript y enums necesarios.

2. Crear `RegistroSchema` con validaciones completas usando Zod.

3. Escribir tests para validar el schema (e.g., campos obligatorios, valores inválidos).

**Entregable:** Schema Zod con 100% cobertura de validaciones.

---

## Fase 2: Capa de Persistencia (1.5-2 hrs)

1. Implementar funciones para leer, guardar y agregar registros en `localStorage`.

2. Escribir tests para asegurar la persistencia de datos.

3. Manejar errores comunes como `QuotaExceededError`.

**Entregable:** Funciones de persistencia testeadas y fiables.

---

## Fase 3: Componente de Formulario (2-3 hrs)

1. Crear el componente `RegistroForm` con estructura HTML semántica.

2. Integrar `react-hook-form` y conectar inputs con validaciones.

3. Mostrar errores de validación debajo de cada input.

4. Implementar feedback visual para éxito y errores (e.g., `react-toastify`).

**Test:**

- Formulario renderiza sin errores.

- Validaciones funcionan correctamente.

- Mensajes de éxito/error se muestran adecuadamente.

**Entregable:** Formulario funcional y validado.

---

## Fase 4: Feedback al Usuario (1 hr)

1. Implementar mensajes de éxito y error después de enviar el formulario.

2. Asegurar que los mensajes desaparecen automáticamente después de unos segundos.

3. Probar diferentes escenarios de error (e.g., validaciones fallidas, problemas de almacenamiento).

**Entregable:** Feedback visual claro y funcional.

---

## Fase 5: Estilos y Accesibilidad (2-3 hrs)

1. Aplicar estilos básicos con Tailwind CSS para mejorar la usabilidad.

2. Asegurar que todos los inputs tienen etiquetas (`label` o `aria-label`).

3. Verificar navegación por teclado y contraste de colores.

4. Probar con lectores de pantalla (e.g., VoiceOver, NVDA).

**Entregable:** Formulario visualmente pulido y accesible.

---

## Fase 6: Testing de Integración (1-2 hrs)

1. Escribir tests de integración para el formulario completo usando React Testing Library.

2. Probar flujos principales (e.g., envío exitoso, validaciones fallidas).

3. Asegurar que los datos persisten correctamente en `localStorage`.

**Entregable:** Tests de integración con cobertura >80%.

---

## Fase 7: Refinamiento y Optimización (1-2 hrs)

1. Revisar y optimizar performance (e.g., evitar re-renders innecesarios).

2. Manejar casos extremos (e.g., `localStorage` deshabilitado, fechas futuras).

3. Documentar el componente `RegistroForm` y sus dependencias.

**Entregable:** Código optimizado y documentado.

---

## Checklist Final de QA

### Funcionalidad

- Todos los campos se pueden llenar.

- Validaciones funcionan correctamente.

- Datos se guardan en `localStorage` y persisten después de un refresh.

- Formulario se resetea después de guardar.

### UX

- Formulario es intuitivo de usar.

- Errores son claros y útiles.

- Feedback inmediato al interactuar.

### Técnico

- No hay errores en consola.

- Todos los tests pasan.

- Cobertura de tests >80%.

- Código está formateado correctamente.

### Accesibilidad

- Funciona con teclado solamente.

- Funciona con lector de pantalla.

- Contraste de colores es adecuado.

- Focus visible en todos los elementos.

---

## Siguientes Pasos (Post-MVP)

1. **Vista de Lista de Registros:** Mostrar registros guardados con opciones de filtrado y orden.

2. **Reportes y Gráficos:** Agregar visualizaciones básicas de consumo.

3. **Exportar Datos:** Permitir descarga en formatos CSV/JSON.

4. **Migración a Backend:** Implementar API REST y autenticación.

5. **Categorización de Alimentos:** Analizar y estructurar datos de alimentos registrados.

---

**Última actualización:** Noviembre 2025

**Versión del plan:** 1.1
