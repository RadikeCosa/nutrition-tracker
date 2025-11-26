/**
 * Tailwind CSS v4 Configuration for Nutrition Tracker
 * En v4, los colores personalizados se definen en @theme dentro de globals.css
 */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Convenciones oficiales
        primary: {
          light: "#111111",
          dark: "#f5f5f5",
        },
        background: {
          light: "#ffffff",
          dark: "#181818",
        },
        surface: {
          light: "#f5f5f5",
          dark: "#222222",
        },
        error: {
          light: "#e53e3e",
          dark: "#f87171",
        },
        // Neutros y acentos
        accent: {
          light: "#ff6f91",
          dark: "#ffb7b2",
        },
        // Legacy (de globals.css)
        melon: "#ff9aa2",
        peach: "#ffb7b2",
        mint: "#b5ead7",
        lemon: "#ffffb3",
        lavender: "#e0bbe4",
        sky: "#c7ceea",
        vanilla: "#fff1e6",
        coral: "#ff6f91",
      },
    },
  },
};
