"use client";
import React from "react";
import { Register } from "@/app/lib/schemas/register.schema";

const getRegistros = (): Register[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("nutrition-tracker-registers");
  return data ? (JSON.parse(data) as Register[]) : [];
};

const Dashboard: React.FC = () => {
  const registros = getRegistros();

  return (
    <div>
      <h1>bienvenido a dash</h1>
      <ul>
        {registros.length === 0 ? (
          <li>No hay registros guardados.</li>
        ) : (
          registros.map((registro) => (
            <li key={registro.id}>
              {registro.date} {registro.time} - {registro.food} (
              {registro.amount} {registro.unit})
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
