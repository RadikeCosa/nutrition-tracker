"use client";
import { Register } from "@/app/lib/schemas/register.schema";
import { getAllRegisters } from "@/app/lib/storage/localStorage";
import React, { useMemo } from "react";

const Dashboard: React.FC = () => {
  // ✅ No necesitás useState + useEffect para datos síncronos
  const registros = getAllRegisters();

  // ✅ Cálculos memoizados (solo recalcula si registros cambia)
  const stats = useMemo(() => {
    if (registros.length === 0) {
      return {
        total: 0,
        diasRastreados: 0,
        promedioPorDia: 0,
        ultimaEntrada: null,
      };
    }

    // Días únicos
    const fechasUnicas = new Set(registros.map((r) => r.date));
    const diasRastreados = fechasUnicas.size;

    // Promedio
    const promedioPorDia = Number(
      (registros.length / diasRastreados).toFixed(1)
    );

    // Última entrada (por createdAt)
    const ultimoRegistro = registros.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest;
    });

    return {
      total: registros.length,
      diasRastreados,
      promedioPorDia,
      ultimaEntrada: ultimoRegistro,
    };
  }, [registros]);

  // Helper para formatear tiempo relativo
  const formatearTiempoRelativo = (fecha: string) => {
    const ahora = new Date();
    const entonces = new Date(fecha);
    const diferenciaMs = ahora.getTime() - entonces.getTime();
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));

    if (horas < 1) return "Hace menos de 1 hora";
    if (horas === 1) return "Hace 1 hora";
    if (horas < 24) return `Hace ${horas} horas`;

    const dias = Math.floor(horas / 24);
    if (dias === 1) return "Ayer";
    return `Hace ${dias} días`;
  };

  return (
    <div
      style={{
        background: "var(--color-background)",
        color: "var(--color-primary)",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          color: "var(--color-accent)",
          marginBottom: "2rem",
          fontSize: "2rem",
        }}
      >
        Dashboard Nutricional
      </h1>

      {/* Grid de estadísticas */}
      {registros.length === 0 ? (
        <div
          style={{
            background: "var(--color-surface)",
            padding: "2rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.2rem" }}>
            No hay registros guardados. ¡Empieza a trackear tu alimentación!
          </p>
        </div>
      ) : (
        <>
          {/* Cards de métricas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {/* Card 1: Total */}
            <div
              style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "var(--color-accent)",
                }}
              >
                {stats.total}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                registros totales
              </div>
            </div>

            {/* Card 2: Días */}
            <div
              style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "var(--color-accent)",
                }}
              >
                {stats.diasRastreados}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                días rastreados
              </div>
            </div>

            {/* Card 3: Promedio */}
            <div
              style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "var(--color-accent)",
                }}
              >
                {stats.promedioPorDia}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                registros/día
              </div>
            </div>

            {/* Card 4: Última entrada */}
            <div
              style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "var(--color-accent)",
                  marginBottom: "0.5rem",
                }}
              >
                {stats.ultimaEntrada
                  ? formatearTiempoRelativo(stats.ultimaEntrada.createdAt)
                  : "N/A"}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                última entrada
              </div>
              {stats.ultimaEntrada && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.6,
                    marginTop: "0.5rem",
                  }}
                >
                  {stats.ultimaEntrada.food}
                </div>
              )}
            </div>
          </div>

          {/* Lista de registros (opcional, puede ir después) */}
          <details style={{ marginTop: "2rem" }}>
            <summary
              style={{
                cursor: "pointer",
                fontSize: "1.2rem",
                marginBottom: "1rem",
                color: "var(--color-accent)",
              }}
            >
              Ver todos los registros ({registros.length})
            </summary>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {registros.map((registro: Register) => (
                <li
                  key={registro.id}
                  style={{
                    background: "var(--color-surface)",
                    padding: "1rem",
                    marginBottom: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  {registro.date} {registro.time} - {registro.food} (
                  {registro.amount} {registro.unit})
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
    </div>
  );
};

export default Dashboard;
