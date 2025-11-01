"use client";

import { useState } from "react";

export default function InstrumentForm() {
    return (
    <div className="mt-6 p-4 border border-blue-600 rounded">
      {/* Aquí puede comenzar a construir el formulario */}
      <h2 className="text-xl font-semibold text-blue-400">
        Formulario de Gestión de Instrumentos 🎸
      </h2>
      <p className="mt-2 text-neutral-300">
        Añade aquí los campos y la lógica para crear/editar instrumentos.
      </p>
    </div>
  );
}