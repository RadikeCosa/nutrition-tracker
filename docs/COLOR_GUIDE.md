# Arquitectura de Colores y Guía de Tailwind CSS

## Paleta personalizada

| Nombre   | HEX     | Uso recomendado                                    |
| -------- | ------- | -------------------------------------------------- |
| melon    | #FF9AA2 | Primary / botones principales / acentos fuertes    |
| peach    | #FFB7B2 | Secondary / fondos de tarjetas / hover states      |
| mint     | #B5EAD7 | Éxito / vegetales / fondo healthy                  |
| lemon    | #FFFFB3 | Energía / carbohidratos / notificaciones positivas |
| lavender | #E0BBE4 | Proteínas / tarjetas de recetas / calma            |
| sky      | #C7CEEA | Fondos secundarios / modo oscuro suave             |
| vanilla  | #FFF1E6 | Fondo principal (light mode)                       |
| coral    | #FF6F91 | Alertas / déficit calórico / toque divertido       |

## Uso en Tailwind

- Utiliza las clases `bg-melon`, `text-peach`, etc. para aplicar los colores.
- Prefiere nombres semánticos en componentes (ej: `bg-primary` → `bg-melon`).
- Mantén la paleta en `tailwind.config.mjs` para fácil mantenimiento.

## Recomendaciones de implementación (según documentación oficial)

1. **Instalación**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```
2. **Inicializa configuración**
   ```bash
   npx tailwindcss init -p
   ```
   Esto crea `tailwind.config.js` y `postcss.config.js`.
3. **Configura los paths**
   En `tailwind.config.js`:
   ```js
   content: [
     './app/**/*.{js,ts,jsx,tsx}',
     './components/**/*.{js,ts,jsx,tsx}',
     './pages/**/*.{js,ts,jsx,tsx}',
   ],
   ```
4. **Agrega la paleta personalizada**
   ```js
   theme: {
     extend: {
       colors: { ... }
     }
   }
   ```
5. **Importa Tailwind en tu CSS global**
   En `app/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
6. **Build y dev**
   Solo ejecuta:
   ```bash
   npm run dev
   ```
   Next.js compila Tailwind automáticamente.

## Buenas prácticas

- Usa la extensión oficial de Tailwind para VS Code para autocompletado.
- Documenta los roles de cada color en este archivo.
- Revisa la [documentación oficial](https://tailwindcss.com/docs/installation/framework-guides) para detalles y troubleshooting.

---

Este archivo debe mantenerse actualizado si la paleta o la arquitectura de estilos cambia.
