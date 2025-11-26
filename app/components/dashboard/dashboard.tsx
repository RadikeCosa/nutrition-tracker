"use client";
import { Register } from "@/app/lib/schemas/register.schema";
import { getAllRegisters } from "@/app/lib/storage/localStorage";

import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const [registros, setRegistros] = useState<Register[]>([]);

  useEffect(() => {
    setRegistros(getAllRegisters());
  }, []);

  return (
    <div>
      <h1>bienvenido a dash</h1>
      <ul>
        {registros.length === 0 ? (
          <li>No hay registros guardados.</li>
        ) : (
          registros.map((registro: Register) => (
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
