"use client";
import Link from "next/link";
import "./globals.css";

import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Por defecto: light
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <html lang="en" data-theme={theme}>
      <body
        style={{
          background: "var(--color-background)",
          color: "var(--color-primary)",
          minHeight: "100vh",
        }}
      >
        {/* Header de navegación */}
        <header className="w-full bg-(--color-background) border-b border-(--color-accent) mb-8 shadow">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
            {/* Logo o título */}
            <Link
              href="/"
              className="font-bold text-lg text-[var(--color-accent)]"
            >
              NutriTracker
            </Link>
            {/* Botón hamburguesa solo en mobile */}
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="block w-6 h-0.5 bg-(--color-accent) mb-1"></span>
              <span className="block w-6 h-0.5 bg-(--color-accent) mb-1"></span>
              <span className="block w-6 h-0.5 bg-(--color-accent)"></span>
            </button>
            {/* Links: horizontal en desktop, vertical en mobile */}
            <nav
              className={`
                flex-col md:flex-row md:flex md:items-center md:gap-8 font-bold text-base
                fixed md:static top-16 left-0 w-full md:w-auto bg-(--color-background) z-50
                transition-all duration-200
                ${menuOpen ? "flex" : "hidden md:flex"}
              `}
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="block px-6 py-3 md:p-0 text-(--color-accent)"
              >
                Home
              </Link>
              <Link
                href="/form"
                className="block px-6 py-3 md:p-0 text-(--color-accent)"
              >
                Formulario
              </Link>
              <Link
                href="/dashboard"
                className="block px-6 py-3 md:p-0 text-(--color-accent)"
              >
                Dashboard
              </Link>
              <button
                className="block md:ml-8 md:inline md:px-4 md:py-2 mt-2 md:mt-0 bg-(--color-surface) text-(--color-primary) border border-(--color-accent) rounded-lg px-6 py-3 font-normal text-base cursor-pointer"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
              </button>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
