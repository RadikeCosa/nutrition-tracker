# Nutrition Tracker 🥗

Un tracker nutricional simple construido con React, TypeScript y Vite para registro y análisis de datos alimenticios.

## 📋 Descripción

Este proyecto es un side-project personal para explorar tecnologías modernas de desarrollo frontend mientras se construye una herramienta útil para el seguimiento nutricional. El objetivo es crear una aplicación que permita registrar alimentos consumidos y visualizar información nutricional básica.

## ✨ Características Principales

- 📝 **Registro de alimentos**: Interfaz simple para agregar alimentos consumidos
- 🔍 **Búsqueda de alimentos**: Sistema de búsqueda con autocompletado
- 📊 **Visualización de datos**: Gráficos simples de calorías y macronutrientes
- 💾 **Persistencia local**: Almacenamiento en localStorage del navegador
- ✅ **Validación robusta**: Validaciones con Zod para datos seguros
- 🧪 **Testing completo**: Cobertura de tests con Vitest y Testing Library

## 🛠️ Stack Tecnológico

### Core

- **React 19** - UI Library
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

### Formularios y Validación

- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Testing

- **Vitest** - Test runner
- **React Testing Library** - Testing de componentes
- **jsdom** - Simulación del DOM

### Herramientas de Desarrollo

- **ESLint** - Linting
- **Git** - Control de versiones

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/RadikeCosa/nutrition-tracker.git

# Navegar al directorio
cd nutrition-tracker

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Testing
npm run test         # Ejecuta tests en modo watch
npm run test:ui      # Abre la interfaz visual de Vitest
npm run test:coverage # Genera reporte de cobertura

# Calidad de Código
npm run lint         # Ejecuta ESLint
```

## 📁 Estructura del Proyecto

```
nutrition-tracker/
├── src/
│   ├── components/          # Componentes React
│   ├── lib/
│   │   ├── schemas/         # Schemas de validación Zod
│   │   └── storage/         # Funciones de localStorage
│   ├── constants/           # Constantes del proyecto
│   ├── types/              # Definiciones de tipos TypeScript
│   └── assets/             # Assets estáticos
├── tests/
│   ├── setup.ts            # Configuración global de tests
│   └── *.test.ts           # Archivos de prueba
├── public/                 # Archivos públicos
└── documents/              # Documentación del proyecto
```

## 🧪 Testing

El proyecto utiliza Vitest con React Testing Library para un entorno de testing moderno y eficiente:

```bash
# Ejecutar todos los tests
npm run test

# Ver cobertura de código
npm run test:coverage

# Interfaz visual de tests
npm run test:ui
```

### Características del entorno de testing:

- ✅ jsdom para simulación del DOM
- ✅ localStorage mockeado automáticamente
- ✅ Cleanup automático entre tests
- ✅ Matchers extendidos de jest-dom
- ✅ Configuración TypeScript completa

## 🏗️ Estado del Desarrollo

### ✅ Completado

- [x] Setup inicial del proyecto con Vite
- [x] Configuración completa del entorno de testing
- [x] Configuración de TypeScript
- [x] Setup de ESLint y herramientas de desarrollo

### 🔄 En Progreso

- [ ] Modelo de datos y validaciones con Zod
- [ ] Componente de registro de alimentos
- [ ] Sistema de persistencia con localStorage

### 📅 Próximos Pasos

- [ ] Interfaz de visualización de datos
- [ ] Sistema de búsqueda de alimentos
- [ ] Gráficos y estadísticas
- [ ] Mejoras de UX/UI

## 📖 Documentación

- [Detalle de Setup - Fase 0](./documents/detalle-fase-0-setup.md) - Documentación completa del setup inicial
- [Decisiones de Arquitectura](./documents/decisiones-arquitectura.md) - Decisiones técnicas tomadas
- [Plan de Desarrollo](./documents/plan-desarrollo-paso-a-paso.md) - Roadmap detallado del proyecto

## 🤝 Contribuciones

Este es un proyecto personal de aprendizaje, pero las sugerencias y feedback son siempre bienvenidos. Si encuentras algún bug o tienes ideas para mejorarlo, no dudes en abrir un issue.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**RadikeCosa** - [GitHub](https://github.com/RadikeCosa)

---

### 🎯 Filosofía del Proyecto

Este proyecto sigue un enfoque de **desarrollo incremental** con **TDD (Test-Driven Development)**, priorizando:

- **Calidad sobre velocidad** - Cada feature está bien testada
- **Simplicidad sobre complejidad** - Soluciones simples y mantenibles
- **Documentación clara** - Cada decisión está documentada
- **Aprendizaje continuo** - Experimentación con nuevas tecnologías

---
