# Decisiones de Arquitectura - App Registro Alimenticio

## Documento de Decisiones Técnicas (ADR - Architecture Decision Records)

**Proyecto:** App de Registro de Consumos Alimenticios  
**Versión:** MVP v1.0  
**Fecha:** Noviembre 2025  
**Stack Base:** Next.js (App Router), React, TypeScript

---

## Índice

1. [Modelo de Datos](#1-modelo-de-datos)
2. [Tipo de Componente](#2-tipo-de-componente)
3. [Manejo de Estado del Formulario](#3-manejo-de-estado-del-formulario)
4. [Sistema de Validaciones](#4-sistema-de-validaciones)
5. [Inputs para Fecha y Hora](#5-inputs-para-fecha-y-hora)
6. [Tipos de Inputs por Campo](#6-tipos-de-inputs-por-campo)
7. [Estructura de LocalStorage](#7-estructura-de-localstorage)
8. [Manejo de Usuarios](#8-manejo-de-usuarios)
9. [Estrategia de Testing](#9-estrategia-de-testing)
10. [Orden y UX del Formulario](#10-orden-y-ux-del-formulario)

---

## 1. Modelo de Datos

### Contexto: Modelo de Datos

Necesitamos un modelo que permita registrar consumos alimenticios con suficiente detalle para análisis posterior, pero simple para un MVP.

### Decisión Tomada: Modelo Unificado

```javascript
const registroConsumo = {
  id: "uuid-generado",
  userId: "user123",
  userName: "NombreUsuario",
  alimento: "Manzana roja", // Texto libre
  cantidad: 2,
  unidad: "unidad",
  fecha: "2025-11-05",
  hora: "09:30",
  tipoComida: "desayuno",
  endulzante: null,
  notas: "",
  fechaCreacion: "2025-11-05T09:35:00Z",
};
```

### Alternativas Evaluadas: Modelo de Datos

#### A) Modelo Separado (Alimentos vs Bebidas)

```javascript
const alimento = { tipo: 'alimento', unidad: 'gr', ... };
const bebida = { tipo: 'bebida', unidad: 'ml', ... };
```

**PROS:**

- Separación conceptual clara.
- Validaciones específicas por tipo.

**CONTRAS:**

- Duplicación de campos comunes (fecha, hora, usuario, etc.).
- Consultas más complejas (JOIN de dos colecciones).
- Sobre-ingeniería para un MVP.
- Dificulta reportes unificados.

#### B) Campo Alimento Estructurado

```javascript
alimento: {
  nombre: "Manzana",
  categoria: "Fruta",
  subcategoria: "Fruta fresca"
};
```

**PROS:**

- Reportes por categoría desde el inicio.
- Datos más estructurados.

**CONTRAS:**

- Requiere mantener catálogo de alimentos.
- Limita flexibilidad del usuario.
- Complejidad prematura.
- No sabemos qué categorías necesitamos sin datos reales.

### Justificación: Modelo de Datos

- **Simplicidad:** Un solo objeto cubre todos los casos.
- **Flexibilidad:** Texto libre permite descubrir patrones de uso reales.
- **Escalabilidad:** Fácil agregar categorización después basándose en datos.
- **Performance:** Modelo plano, sin JOINs ni lookups.
- **Iteración rápida:** Permite MVP funcional en menos tiempo.

### Impacto: Modelo de Datos

- ✅ Desarrollo rápido del MVP.
- ✅ Usuario no limitado por catálogos predefinidos.
- ⚠️ Necesitaremos normalización/categorización en futuras iteraciones.
- ⚠️ Análisis iniciales requerirán procesamiento de texto.

---

## 2. Tipo de Componente

### Contexto: Tipo de Componente

Next.js App Router ofrece Server Components (por defecto) y Client Components.

### Decisión Tomada: Client Component

```typescript
"use client";

import { useState } from "react";
```

### Alternativas Evaluadas: Tipo de Componente

#### A) Server Component

**PROS:**

- Bundle de JavaScript más pequeño.
- Renderizado en servidor (mejor initial load).
- Acceso directo a APIs de backend.

**CONTRAS:**

- ❌ No tiene acceso a localStorage (browser API).
- ❌ No puede manejar estado (useState, useReducer).
- ❌ No puede tener event handlers (onClick, onChange).
- ❌ No puede usar hooks de React.

#### B) Hybrid (Server + Client separated)

```typescript
// layout.tsx (Server)
export default function Layout() {
  return <FormWrapper />;
}

// FormWrapper.tsx (Client)
'use client';
export default function FormWrapper() { ... }
```

**PROS:**

- Optimización granular de qué es cliente/servidor.
- Layout puede ser server component.

**CONTRAS:**

- Complejidad innecesaria para un formulario simple.
- Todo el formulario necesita ser cliente de todos modos.

### Justificación: Tipo de Componente

- **Requisitos técnicos:** localStorage, estado, eventos.
- **Pragmatismo:** No hay beneficio real en hybrid para este caso.
- **Mantenibilidad:** Código más simple y directo.

### Impacto: Tipo de Componente

- ✅ Acceso completo a APIs del navegador.
- ✅ Interactividad total.
- ✅ Código más simple de razonar.
- ⚠️ Bundle de JS ligeramente mayor (irrelevante para formulario).

---

## 3. Manejo de Estado del Formulario

### Contexto: Manejo de Estado del Formulario

Necesitamos manejar ~10 campos con validaciones, estados de error, y submit.

### Decisión Tomada: react-hook-form + Zod

```bash
npm install react-hook-form @hookform/resolvers zod
```

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(registroSchema),
});
```

### Alternativas Evaluadas: Manejo de Estado del Formulario

#### A) useState Manual

```typescript
const [formData, setFormData] = useState(initialState);
const [errors, setErrors] = useState({});

const handleChange = (field) => (e) => {
  setFormData({ ...formData, [field]: e.target.value });
};
```

**PROS:**

- Cero dependencias.
- Control total sobre el comportamiento.
- Fácil de entender para juniors.
- No hay "magia".

**CONTRAS:**

- ~100+ líneas de boilerplate.
- Re-render del componente completo en cada cambio.
- Validaciones manuales propensas a errores.
- Manejo de errores inline manual.
- Más código = más bugs potenciales.

#### B) Formik

```typescript
import { Formik, Form, Field } from "formik";
```

**PROS:**

- Librería madura y popular.
- Integración con Yup (validaciones).
- Manejo de errores built-in.

**CONTRAS:**

- Bundle más grande que RHF (~15kb vs ~9kb).
- Performance inferior (re-renders en cada keystroke).
- Menos momentum en comunidad (RHF más activo).
- Sintaxis más verbosa.

#### C) Remix/Next.js Actions (Server-side)

```typescript
async function submitAction(formData: FormData) {
  "use server";
  // ...
}
```

**PROS:**

- Validación en servidor (más seguro).
- No necesita JS en cliente para funcionar.
- Progressive enhancement.

**CONTRAS:**

- No funciona con localStorage (necesitamos cliente).
- UX menos fluida (full page refresh sin JS).
- Validación asíncrona (latencia).
- Overkill para MVP con datos locales.

### Justificación: Manejo de Estado del Formulario

- **Validaciones:** Integración perfecta con Zod (que ya vamos a usar).
- **Performance:** Re-renders optimizados (solo campos que cambian).
- **Developer Experience:** Menos boilerplate, más declarativo.
- **Errores inline:** Built-in, exactamente lo que necesitamos.
- **Testing:** Fácil de testear (schema validation independiente).
- **Comunidad:** 38k+ estrellas en GitHub, muy mantenido.

### Impacto: Manejo de Estado del Formulario

- ✅ ~50% menos código vs manual.
- ✅ Performance óptima out-of-the-box.
- ✅ Type-safety con TypeScript.
- ⚠️ Dependencia externa (+40kb al bundle).
- ⚠️ Curva de aprendizaje leve (documentación excelente).

---

## 4. Sistema de Validaciones

### Contexto: Sistema de Validaciones

Necesitamos validar tipos de datos, rangos, formatos y campos requeridos.

### Decisión Tomada: Zod

```bash
npm install zod
```

```typescript
import { z } from "zod";

const registroSchema = z.object({
  alimento: z.string().min(1, "Requerido").max(200),
  cantidad: z.number().positive("Debe ser mayor a 0"),
  // ...
});
```

### Alternativas Evaluadas: Sistema de Validaciones

#### A) Validaciones Manuales

```typescript
function validateForm(data) {
  const errors = {};
  if (!data.alimento) errors.alimento = "Requerido";
  if (data.cantidad <= 0) errors.cantidad = "Debe ser mayor a 0";
  return errors;
}
```

**PROS:**

- No requiere dependencias.
- Control absoluto.
- Lógica explícita.

**CONTRAS:**

- Propenso a errores (olvidar validaciones).
- Sin type-safety.
- Código repetitivo.
- Difícil de testear.
- No reutilizable fácilmente.

#### B) Yup

```typescript
import * as yup from "yup";

const schema = yup.object({
  alimento: yup.string().required().max(200),
});
```

**PROS:**

- Sintaxis similar a Zod.
- Maduro y estable.
- Buena integración con Formik.

**CONTRAS:**

- Bundle más grande (~13kb vs ~8kb de Zod).
- Sin inferencia de tipos TypeScript tan robusta.
- Menos features modernos.
- Comunidad migrando a Zod.

#### C) Joi

```typescript
import Joi from "joi";

const schema = Joi.object({
  alimento: Joi.string().required().max(200),
});
```

**PROS:**

- Muy maduro (originalmente para Node.js).
- Validaciones muy expresivas.

**CONTRAS:**

- Bundle MUY grande (~145kb).
- Diseñado para backend.
- No está optimizado para TypeScript.
- Overkill para frontend.

#### D) Validaciones HTML5 nativas

```html
<input type="text" required maxlength="200" />
<input type="number" min="0" step="0.1" />
```

**PROS:**

- Cero dependencias.
- Funciona sin JavaScript.
- UX nativa del navegador.

**CONTRAS:**

- Limitado (no validaciones complejas).
- Mensajes de error no customizables fácilmente.
- No funciona bien con controlled components.
- Inconsistente entre navegadores.
- No se integra con submit programático.

### Justificación: Sistema de Validaciones

- **Type-safety:** Inferencia automática de tipos TypeScript.
- **DX:** API declarativa y legible.
- **Reutilización:** Schema sirve para validar en cualquier parte.
- **Documentación:** El schema ES la documentación del modelo.
- **Testing:** Fácil de testear en isolation.
- **Integración:** react-hook-form tiene resolver oficial.
- **Tamaño:** Pequeño (~8kb) y tree-shakeable.
- **Futuro:** Si migramos a tRPC o similar, Zod es estándar.

### Impacto: Sistema de Validaciones

- ✅ Validaciones type-safe.
- ✅ Código autodocumentado.
- ✅ Fácil agregar/modificar reglas.
- ✅ Mensajes de error customizables.
- ⚠️ Otra dependencia más.
- ⚠️ Curva de aprendizaje (API extensa).

---

## 5. Inputs para Fecha y Hora

### Contexto: Inputs para Fecha y Hora

Necesitamos capturar fecha y hora del consumo. Debe funcionar bien en mobile y desktop.

### Decisión Tomada: Inputs Nativos HTML5 Separados

```html
<input type="date" /> <input type="time" />
```

### Alternativas Evaluadas: Inputs para Fecha y Hora

#### A) Input datetime-local (combinado)

```html
<input type="datetime-local" />
```

**PROS:**

- Un solo campo (menos espacio en UI).
- Captura ambos valores juntos.

**CONTRAS:**

- Formato confuso para usuarios (2025-11-05T09:30).
- Más difícil de pre-cargar con valores por defecto.
- Soporte inconsistente en navegadores viejos.
- Menos control granular (ej: validar solo fecha).

**Veredicto:** ❌ Menos intuitivo, sin ventajas reales.

---

#### B) Campos de texto con pattern

```html
<input type="text" pattern="\d{4}-\d{2}-\d{2}" placeholder="YYYY-MM-DD" />
<input type="text" pattern="\d{2}:\d{2}" placeholder="HH:MM" />
```

**PROS:**

- Control total sobre estilos.
- Formato visible para usuario.

**CONTRAS:**

- Requiere validación manual robusta.
- Sin date/time picker nativo.
- Mala UX en móvil (teclado alfanumérico).
- Usuario puede ingresar fechas inválidas.
- Más trabajo de implementación.

**Veredicto:** ❌ Mucho trabajo, peor UX, sin beneficios.

---

#### C) Librería de Date Picker (react-datepicker, date-fns)

```typescript
import DatePicker from "react-datepicker";

<DatePicker selected={fecha} onChange={setFecha} />;
```

**PROS:**

- UX consistente cross-browser.
- Estilos totalmente personalizables.
- Features avanzadas (rangos, disable dates, locales).
- Animaciones y transiciones.

**CONTRAS:**

- Dependencia externa (~50-100kb).
- Aumenta complejidad del bundle.
- Más configuración inicial.
- Overkill para un MVP.
- Más superficie de bugs.

**Veredicto:** ⚠️ Bueno para apps complejas, excesivo para MVP.

---

#### D) Input text con máscara (react-input-mask)

```typescript
<InputMask mask="99/99/9999" />
```

**PROS:**

- Guía al usuario visualmente.
- Previene errores de formato.

**CONTRAS:**

- Dependencia adicional.
- Sin picker visual (mobile UX pobre).
- Igual necesita validación de fechas válidas.
- Más código para menos features.

**Veredicto:** ❌ Complejidad sin ventajas reales.

---

### Comparativa: Inputs Nativos HTML5

#### Opción Seleccionada

```html
<input type="date" value="2025-11-05" max="2025-11-05" />
<input type="time" value="09:30" step="60" />
```

**PROS:**

- ✅ Cero dependencias (0 bytes).
- ✅ UX nativa del OS (familiar para usuarios).
- ✅ Mobile-optimized automático (teclado de calendario/reloj).
- ✅ Validación HTML5 automática.
- ✅ Accesibilidad built-in (screen readers).
- ✅ Funciona sin JavaScript.
- ✅ Fácil de testear.
- ✅ Valores por defecto simples.

**CONTRAS:**

- ⚠️ Estilos limitados (difícil personalizar completamente).
- ⚠️ Apariencia diferente entre navegadores.
- ⚠️ Sin animaciones fancy.

**Mitigaciones:**

- Para MVP, consistencia funcional > estética perfecta.
- Si después necesitamos personalización extrema, swapeamos a librería.
- Los estilos nativos son familiares (no confunden al usuario).

### Justificación

1. **Principio KISS:** Solución más simple que funciona.
2. **Mobile-first:** Teclados nativos optimizados.
3. **Accesibilidad:** Gratis sin configuración.
4. **Performance:** Cero overhead.
5. **Mantenimiento:** Menos código = menos bugs.
6. **Escalabilidad:** Si necesitamos más, refactorizamos fácil.

### Impacto

- ✅ Implementación en minutos vs horas.
- ✅ Bundle size mínimo.
- ✅ UX móvil óptima.
- ⚠️ Estética del input no totalmente customizable (aceptable para MVP).

---

## 6. Tipos de Inputs por Campo

### Decisiones por Campo

#### Usuario: `<select>`

```html
<select name="userId" required>
  <option value="">Seleccionar usuario</option>
  <option value="uuid-1">Juan</option>
  ...
</select>
```

**Alternativa evaluada:** Radio buttons

- **PRO radio:** Más visual, menos clicks.
- **CONTRA radio:** Ocupa más espacio (4 opciones).
- **Decisión:** SELECT es más compacto, suficientemente usable.

---

#### Alimento: `<input type="text">` con `<datalist>`

```html
<input list="alimentos-sugeridos" />
<datalist id="alimentos-sugeridos">
  <option value="Manzana" />
  <option value="Banana" />
</datalist>
```

**Alternativa evaluada:** Select con opciones fijas

- **PRO select:** Datos consistentes desde día 1.
- **CONTRA select:** Limita al usuario, no escalable.
- **Decisión:** Datalist permite TEXTO LIBRE + sugerencias (mejor de ambos mundos).

**Implementación:**

- Cargar opciones dinámicamente desde registros previos.
- `obtenerAlimentosRegistrados()` retorna array único de alimentos.

---

#### Cantidad: `<input type="number">`

```html
<input type="number" step="0.1" min="0" required />
```

**Por qué:**

- `step="0.1"`: Permite decimales (1.5 porciones).
- `min="0"`: Previene negativos.
- Teclado numérico en móvil automático.

**Alternativa evaluada:** Input text con validación manual

- **Decisión:** Number input da validación gratis.

---

#### Unidad: `<select>`

```html
<select name="unidad" required>
  <option value="gr">Gramos</option>
  <option value="ml">Mililitros</option>
  <option value="unidad">Unidad</option>
  <option value="porcion">Porción</option>
  <option value="porcion-chica">Porción chica</option>
  <option value="porcion-grande">Porción grande</option>
</select>
```

**Por qué:** Lista cerrada de opciones, necesitamos datos consistentes.

---

#### Tipo de Comida: `<input type="radio">`

```html
<input type="radio" name="tipoComida" value="desayuno" />
<input type="radio" name="tipoComida" value="almuerzo" />
...
```

**Alternativa evaluada:** Select dropdown

- **PRO radio:** Más visual, selección rápida (1 click).
- **PRO radio:** 5 opciones no ocupan mucho espacio.
- **PRO radio:** Más obvio cuáles son las opciones.
- **Decisión:** RADIO BUTTONS ganan por frecuencia de uso.

---

#### Endulzante: `<input type="radio">`

```html
<input type="radio" name="endulzante" value="" checked />
<input type="radio" name="endulzante" value="azucar" />
<input type="radio" name="endulzante" value="edulcorante" />
```

**Por qué:**

- 3 estados mutuamente excluyentes.
- Visual (usuario ve todas las opciones).
- Default: "Sin endulzar" (más común).

---

#### Notas: `<textarea>`

```html
<textarea
  name="notas"
  rows="3"
  maxlength="500"
  placeholder="Opcional: contexto adicional..."
></textarea>
```

**Por qué:**

- Texto potencialmente largo.
- `rows="3"`: Balance entre espacio y no abrumar.
- `maxLength`: Previene texto excesivo.

---

## 7. Estructura de LocalStorage

### Contexto: Estructura de LocalStorage

Necesitamos persistir registros en el navegador del usuario.

### Decisión Tomada: Array Único

```javascript
// Key: "registros_alimenticios"
// Value: JSON.stringify([registro1, registro2, ...])

localStorage.setItem("registros_alimenticios", JSON.stringify(registros));
```

### Alternativas Evaluadas: Estructura de LocalStorage

#### A) Key Individual por Registro

```javascript
// Key: "registro_{uuid}"
// Value: JSON.stringify(registroIndividual)
// Key adicional: "registros_index" → ["uuid1", "uuid2", ...]
```

**PROS:**

- CRUD más eficiente (leer/actualizar 1 solo registro).
- Escala mejor con miles de registros.
- No necesita parsear todo el array para 1 operación.

**CONTRAS:**

- Implementación más compleja.
- Necesita mantener índice sincronizado.
- Dos operaciones para listar todos (leer index + iterar).
- Más keys en localStorage (puede ser confuso en DevTools).
- Overhead de múltiples `JSON.parse/stringify`.

**Cuándo usarla:** +1000 registros, operaciones frecuentes sobre registros individuales.

---

#### B) Partición por Usuario

```javascript
// Key: "registros_user_{userId}"
// Value: [registros de ese usuario]
```

**PROS:**

- Consultas por usuario más rápidas.
- Escalabilidad si hay muchos usuarios.

**CONTRAS:**

- En este caso solo 4 usuarios en mismo dispositivo (raro).
- Reportes cross-user más complejos.
- Overkill para MVP.

---

#### C) IndexedDB

```javascript
const db = await openDB("registros-db");
await db.add("registros", registro);
```

**PROS:**

- Diseñado para grandes volúmenes de datos.
- Mejor performance con miles de registros.
- Soporta índices y queries complejas.
- Límite más alto (~50MB+ vs 5-10MB localStorage).

**CONTRAS:**

- API asíncrona más compleja.
- Requiere librería (idb) para DX decente.
- Overkill total para MVP.
- Más difícil de debuggear.

**Cuándo usarla:** +10,000 registros, queries complejas, sincronización offline.

---

### Justificación: Array Único

**Para este caso específico:**

- Uso personal típico: 50-500 registros.
- Operación más frecuente: listar todos (para reportes).
- Operación de escritura: append al final (rápida).

**Performance estimada:**

- 100 registros ≈ 15KB → parse en <1ms.
- 500 registros ≈ 75KB → parse en <5ms.
- 1000 registros ≈ 150KB → parse en <10ms.

**Conclusión:** Para volúmenes de MVP, diferencia imperceptible.

### Implementación de Funciones

```typescript
// utils/storage.ts

const STORAGE_KEY = "registros_alimenticios";

export function guardarRegistro(registro: Registro): Result {
  try {
    const registros = obtenerRegistros();
    registros.push(registro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
    return { success: true };
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      return {
        success: false,
        error: "Almacenamiento lleno. Elimina registros antiguos.",
      };
    }
    return {
      success: false,
      error: "Error al guardar. Intenta nuevamente.",
    };
  }
}

export function obtenerRegistros(): Registro[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer localStorage:", error);
    return [];
  }
}

export function obtenerAlimentosRegistrados(): string[] {
  const registros = obtenerRegistros();
  const alimentos = registros.map((r) => r.alimento);
  return [...new Set(alimentos)].sort();
}
```

### Impacto: Estructura de LocalStorage

- ✅ Código simple y mantenible.
- ✅ Suficientemente performante para caso de uso.
- ✅ Fácil de debuggear (ver todo en DevTools).
- ✅ Migración a backend simple (ya está estructurado como array).
- ⚠️ Si crece mucho (>1000 registros), refactorizar a IndexedDB.

---

## 8. Manejo de Usuarios

### Contexto: Manejo de Usuarios

Para MVP, necesitamos identificar quién registra cada consumo sin sistema de autenticación.

### Decisión Tomada: 4 Usuarios Hardcoded con UUID

```typescript
// constants/users.ts
export const USERS = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    name: "Juan",
  },
  {
    id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    name: "María",
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    name: "Pedro",
  },
  {
    id: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g",
    name: "Ana",
  },
] as const;
```

### Alternativas Evaluadas: Manejo de Usuarios

#### A) IDs Autoincrementales

```typescript
const USERS = [
  { id: 1, name: "Juan" },
  { id: 2, name: "María" },
];
```

**PROS:**

- Más simple (números).
- Menos bytes en storage.

**CONTRAS:**

- Colisiones al migrar a backend con DB autoincrement.
- No es práctica estándar.
- Dificulta merge de datos de múltiples dispositivos.

**Veredicto:** ❌ Ahorra 30 bytes, pierde escalabilidad.

---

#### B) Nombres como ID

```typescript
const USERS = [{ id: "juan", name: "Juan" }];
```

**PROS:**

- Legible en localStorage.
- Simple.

**CONTRAS:**

- ¿Qué pasa con nombres duplicados?
- ¿Nombres con espacios, tildes?
- No es práctica profesional.

**Veredicto:** ❌ Muy frágil.

---

#### C) UUIDs Generados Dinámicamente

```typescript
import { v4 as uuidv4 } from "uuid";

const USERS = [{ id: uuidv4(), name: "Juan" }];
```

**PROS:**

- IDs únicos garantizados.
- Generación automática.

**CONTRAS:**

- ¿Cuándo se generan? (cada refresh cambiaría IDs).
- No persistentes entre sesiones.
- Inconsistente.

**Veredicto:** ❌ Para usuarios fijos, hardcoded es mejor.

---

#### D) Sistema de Login Simple

```typescript
function login(username: string) {
  const user = findOrCreateUser(username);
  localStorage.setItem("currentUser", JSON.stringify(user));
}
```

**PROS:**

- Más realista.
- Preparado para backend.

**CONTRAS:**

- Complejidad innecesaria para 4 usuarios conocidos.
- Necesita UI de login.
- Gestión de sesión.

**Veredicto:** ⚠️ Bueno para siguientes iteraciones.

---

### Justificación: UUIDs Hardcoded

1. **Escalabilidad:** UUIDs son estándar en DBs distribuidas (Postgres UUID, MongoDB ObjectId).
2. **Migración simple:** Al pasar a backend, solo cambias cómo se obtiene el usuario.
3. **Sin colisiones:** Podes mergear datos de múltiples dispositivos sin conflictos.
4. **Profesional:** Es la práctica correcta.

**Generación de UUIDs:**

```bash
# En terminal Mac/Linux
uuidgen

# O en Node.js
node -e "console.log(require('crypto').randomUUID())"

# O online
https://www.uuidgenerator.net/
```

### Impacto: Manejo de Usuarios

- ✅ IDs únicos globalmente.
- ✅ Compatible con cualquier backend futuro.
- ✅ No requiere dependencias (solo constantes).
- ✅ Fácil agregar/quitar usuarios (editar archivo).
- ⚠️ UUIDs no son human-readable (irrelevante, usuario ve nombre).

---

## 9. Estrategia de Testing

### Contexto: Estrategia de Testing

Queremos desarrollo TDD sin que sea un obstáculo, priorizando tests útiles.

### Decisión Tomada: Vitest + React Testing Library + TDD Pragmático

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Alternativas Evaluadas: Estrategia de Testing

#### A) Jest

**PROS:**

- Estándar de facto en React.
- Ecosystem maduro.
- Mucha documentación.

**CONTRAS:**

- Más lento que Vitest (no usa Vite).
- Configuración más compleja en proyectos Vite/Next.
- Setup de ES modules complicado.

**Veredicto:** Vitest es sucesor natural (misma API, más rápido).

---

#### B) Playwright Component Testing

**PROS:**

- Testing end-to-end de componentes.
- Navegador real.

**CONTRAS:**

- Overkill para unit tests.
- Más lento.
- Más complejo de configurar.

**Veredicto:** Usar Playwright solo para E2E después.

---

#### C) No testing (YOLO mode)

**PROS:**

- Desarrollo más rápido inicialmente.
- Menos setup.

**CONTRAS:**

- ❌ Bugs en producción.
- ❌ Refactoring aterrador.
- ❌ Regresiones constantes.
- ❌ No es profesional.

**Veredicto:** ❌ Inaceptable para desarrollo serio.

---

### Estrategia TDD Pragmática

**Nivel 1: Schema Validation (SIEMPRE)**

```typescript
// registroSchema.test.ts
describe("registroSchema", () => {
  it("valida registro completo válido", () => {
    const validData = {
      /* ... */
    };
    expect(() => registroSchema.parse(validData)).not.toThrow();
  });

  it("rechaza cantidad negativa", () => {
    const invalidData = { cantidad: -1 /* ... */ };
    expect(() => registroSchema.parse(invalidData)).toThrow();
  });
});
```

**Nivel 2: Funciones Puras (SIEMPRE)**

```typescript
// storage.test.ts
describe("guardarRegistro", () => {
  beforeEach(() => localStorage.clear());

  it("guarda registro en localStorage", () => {
    const registro = createMockRegistro();
    const result = guardarRegistro(registro);
    expect(result.success).toBe(true);
    expect(obtenerRegistros()).toHaveLength(1);
  });

  it("maneja QuotaExceededError", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });
    const result = guardarRegistro(createMockRegistro());
    expect(result.success).toBe(false);
    expect(result.error).toContain("lleno");
  });
});
```

**Nivel 3: Componentes (SELECTIVO)**

```typescript
// RegistroForm.test.tsx
describe("RegistroForm", () => {
  it("muestra error cuando alimento está vacío", async () => {
    render(<RegistroForm />);
    const submitBtn = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/alimento.*requerido/i)).toBeInTheDocument();
  });

  it("guarda registro exitosamente", async () => {
    render(<RegistroForm />);

    // Llenar formulario
    fireEvent.change(screen.getByLabelText(/alimento/i), {
      target: { value: "Manzana" },
    });
    // ... más campos

    fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(screen.getByText(/guardado exitosamente/i)).toBeInTheDocument();
    });
  });
});
```

### Qué NO testear (al menos en MVP)

- ❌ Estilos CSS (visual regression para después).
- ❌ Implementación interna de librerías (react-hook-form ya está testeado).
- ❌ Comportamiento de inputs nativos (navegador ya lo testea).
- ❌ Every single edge case (principio 80/20).

### Justificación

1. **TDD en capas:** Primero lógica pura, luego componentes.
2. **ROI:** Tests de schema y storage son baratos y altísimo valor.
3. **Velocidad:** Vitest corre tests en <100ms.
4. **Confianza:** Refactoring sin miedo.
5. **Documentación:** Tests como ejemplos de uso.

### Impacto: Estrategia de Testing

- ✅ Desarrollo inicial ligeramente más lento.
- ✅ Refactoring 10x más rápido después.
- ✅ Bugs detectados antes de UI.
- ✅ Código más modular (testeable = bien diseñado).
- ⚠️ Overhead de mantener tests (mínimo si están bien hechos).

---

## 10. Orden y UX del Formulario

### Contexto: Orden y UX del Formulario

El orden de los campos impacta directamente en la velocidad y satisfacción del usuario.

### Decisión Tomada: Agrupación por Concepto

```
┌─────────────────────────────────────┐
│  Registrar Consumo                  │
├─────────────────────────────────────┤
│                                     │
│  👤 ¿Quién?                         │
│  [Select Usuario]                   │
│                                     │
│  🍎 ¿Qué consumiste?                │
│  [Input con datalist]               │
│                                     │
│  📊 ¿Cuánto?                        │
│  [Number] [Select unidad]           │
│                                     │
│  📅 ¿Cuándo?                        │
│  [Date] [Time]                      │
│  ○ Desayuno ○ Almuerzo ○ Merienda  │
│  ○ Cena ○ Colación                 │
│                                     │
│  🍬 Endulzante                      │
│  ○ Sin endulzar ○ Azúcar           │
│  ○ Edulcorante                     │
│                                     │
│  📝 Notas (opcional)                │
│  [Textarea]                         │
│                                     │
│  [Guardar Registro]                 │
│                                     │
└─────────────────────────────────────┘
```

### Alternativas Evaluadas: Orden y UX del Formulario

#### A) Orden cronológico del evento

```
1. Fecha/Hora
2. Tipo de comida
3. Usuario
4. Alimento
5. Cantidad
...
```

**Razón:** "Cuando pasó, qué pasó, quién fue"

**CONTRA:** Usuario no piensa así al registrar. Piensa "comí una manzana hace 10 min".

---

#### B) Orden por importancia

```
1. Alimento (más importante)
2. Cantidad
3. Fecha/hora
4. Usuario
...
```

**CONTRAS:** ¿Quién define importancia? Usuario necesita contexto (quién) primero.

---

#### C) Wizard multi-paso

```
Paso 1: ¿Quién y qué?
Paso 2: ¿Cuánto y cuándo?
Paso 3: Detalles adicionales
```

**PROS:**

- Menos abrumador visualmente.
- Foco en pocos campos por pantalla.

**CONTRAS:**

- Más clicks.
- No ves resumen completo.
- Más lento para usuarios avanzados.
- Overkill para ~8 campos.

**Veredicto:** Bueno para formularios +15 campos.

---

### Justificación del Orden Elegido

**Lógica cognitiva:**

1. **Usuario (contexto):** "¿Para quién es este registro?"

   - Establece el contexto mental.
   - Decisión simple (4 opciones).
   - Warm-up suave.

2. **Alimento (core):** "¿QUÉ comiste?"

   - La información principal.
   - Campo que el usuario tiene más claro.
   - Con sugerencias (datalist) acelera entry.

3. **Cantidad (especificación):** "¿CUÁNTO?"

   - Complementa al alimento.
   - Agrupado visualmente con unidad.
   - Flujo natural: "manzana" → "2 unidades".

4. **Cuándo (temporal):** "¿CUÁNDO lo consumiste?"

   - Fecha + hora + tipo de comida juntos (mismo concepto).
   - Pre-cargado con "ahora" (mayoría de casos).
   - Radio buttons de tipo de comida cerca de la hora (relación visual).

5. **Endulzante (detalle):** "¿Le agregaste algo?"

   - Opcional conceptualmente.
   - No siempre aplica.
   - Pero importante para tracking de azúcar.

6. **Notas (opcional):** "¿Algo más que agregar?"
   - Claramente opcional.
   - Al final para no interrumpir flujo principal.
   - Espacio para contexto adicional.

**Principios aplicados:**

- ✅ **Progresión natural:** General → Específico → Opcional.
- ✅ **Agrupar relacionados:** Cantidad + unidad juntos, fecha + hora + tipo juntos.
- ✅ **Campos opcionales al final:** No interrumpen flujo principal.
- ✅ **Call-to-action claro:** Botón grande al final.

### Impacto: Orden y UX del Formulario

- ✅ Flujo cognitivo natural.
- ✅ Campos relacionados agrupados visualmente.
- ✅ Usuario puede completarlo en <30 segundos.
- ✅ Scan visual claro (secciones con encabezados).

---

## Resumen Ejecutivo de Decisiones

| Aspecto        | Decisión                    | Alternativa Principal | Razón de Elección                                         |
| -------------- | --------------------------- | --------------------- | --------------------------------------------------------- |
| **Componente** | Client Component            | Server Component      | Necesita estado, localStorage, eventos                    |
| **Form State** | react-hook-form             | useState manual       | Menos boilerplate, mejor performance, integración con Zod |
| **Validación** | Zod                         | Validaciones manuales | Type-safety, reutilizable, declarativo                    |
| **Fecha/Hora** | Inputs nativos separados    | Librería date picker  | Cero dependencias, UX móvil nativa, suficiente para MVP   |
| **Storage**    | Array único en localStorage | Key por registro      | Simple, performance suficiente para volúmenes de MVP      |
| **Usuarios**   | 4 hardcoded con UUID        | IDs autoincrementales | Escalable, estándar, sin colisiones                       |
| **Testing**    | Vitest + RTL + TDD          | Jest / Sin tests      | Rápido, moderna, TDD da confianza para refactorear        |
| **Orden Form** | Agrupado por concepto       | Orden cronológico     | Flujo cognitivo natural, campos relacionados juntos       |

---

## Métricas de Éxito para MVP

1. **Performance:**

   - Time to Interactive < 2s
   - Form submission < 100ms
   - Test suite < 5s

2. **Usabilidad:**

   - Registro completo en < 45 segundos
   - < 5% tasa de error de validación
   - Usuarios completan registro sin ayuda

3. **Técnicas:**
   - Cobertura de tests > 80% en lógica core
   - Bundle size < 200kb (gzipped)
   - Cero errores en consola

---

## Plan de Evolución Post-MVP

### Fase 2: Mejoras Rápidas

- Gráficos básicos (consumo por día)
- Exportar datos a CSV
- Búsqueda/filtrado de registros

### Fase 3: Inteligencia

- Sugerencias basadas en historial
- Categorización automática de alimentos
- Alertas de patrones (ej: mucho azúcar)

### Fase 4: Backend

- Migración a API REST
- Sync multi-dispositivo
- Autenticación real

### Fase 5: Advanced

- Machine learning para predicciones
- Integración con apps de salud
- Modo offline-first con sync

---

## Conclusiones

Este documento captura las decisiones arquitectónicas tomadas para el MVP de la app de registro alimenticio. Cada decisión prioriza:

1. ✅ **Simplicidad:** Solución más simple que funciona.
2. ✅ **Velocidad de desarrollo:** Entregar valor rápido.
3. ✅ **Escalabilidad:** Sin comprometer futuro.
4. ✅ **Profesionalismo:** Buenas prácticas desde día 1.
5. ✅ **Pragmatismo:** No sobre-ingeniería.

**Filosofía general:** "Make it work, make it right, make it fast" - en ese orden.

---

**Fecha última actualización:** Noviembre 2025  
**Versión:** 1.0  
**Próxima revisión:** Post-MVP user testing
