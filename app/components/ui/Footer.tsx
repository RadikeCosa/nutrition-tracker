import React from "react";

const Footer: React.FC = () => (
  <footer
    style={{
      background: "var(--color-surface)",
      color: "var(--color-primary)",
      padding: "1.5rem 0",
      marginTop: "2rem",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
    }}
    className="w-full flex flex-col items-center gap-2"
  >
    <div className="flex gap-4">
      <a
        href="https://github.com/RadikeCosa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </a>
      <a
        href="https://linkedin.com/in/ramirocosa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z" />
        </svg>
      </a>
      <a
        href="https://ramirocosa.dev"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Blog"
      >
        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.371 0 0 5.371 0 12c0 6.629 5.371 12 12 12s12-5.371 12-12c0-6.629-5.371-12-12-12zm0 22.153c-5.607 0-10.153-4.546-10.153-10.153S6.393 1.847 12 1.847 22.153 6.393 22.153 12 17.607 22.153 12 22.153zm-1.846-7.307c-.254 0-.461-.207-.461-.461v-5.77c0-.254.207-.461.461-.461h3.692c.254 0 .461.207.461.461v5.77c0 .254-.207.461-.461.461h-3.692z" />
        </svg>
      </a>
    </div>
    <div style={{ fontSize: "0.95rem" }}>
      © {new Date().getFullYear()} Ramiro Cosa. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;
