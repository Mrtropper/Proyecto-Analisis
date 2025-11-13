"use client";

import { useState } from "react";
import Link from "next/link";

export default function InstrumentForm() {
  const [nombreInstrumento, setNombreInstrumento] = useState("");
  const [familiaInstrumento, setFamiliaInstrumento] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!nombreInstrumento || !familiaInstrumento) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const nuevoInstrumento = {
      nombre: nombreInstrumento,
      familia: familiaInstrumento,
    };

    try {
      setGuardando(true);

      const response = await fetch("/api/instrumento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoInstrumento),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(`Error al guardar: ${error.error || "Error desconocido"}`);
        setGuardando(false);
        return;
      }

      alert("Instrumento guardado correctamente en la base de datos");

      // Limpiar formulario después del éxito
      setNombreInstrumento("");
      setFamiliaInstrumento("");
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar con la API. Verifique la conexión.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      {/* Botones principales */}
      <div className="flex gap-2 mb-3">
        <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Agregar Instrumento
        </button>

        <Link href="/dashboard/instruments/inventario">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Inventario
          </button>
        </Link>

        <Link href="/dashboard/instruments/loan">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Préstamo Instrumento
          </button>
        </Link>

        <Link href="/dashboard/instruments/list">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Lista
          </button>
        </Link>
      </div>

      {/* Cuadro principal */}
      <div className="mt-6 p-4 border border-gray-900 rounded">
        <h2 className="text-xl font-semibold text-blue-400">
          Agregar Instrumento
        </h2>
        <p className="mt-2 text-neutral-100">
          Ingrese los datos del instrumento
        </p>

        {/* Campo Nombre Instrumento */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            Nombre del instrumento
          </label>
          <input
            type="text"
            value={nombreInstrumento}
            onChange={(e) => setNombreInstrumento(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Campo Familia Instrumento */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            Familia
          </label>
          <input
            type="text"
            value={familiaInstrumento}
            onChange={(e) => setFamiliaInstrumento(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className={`w-50 px-4 py-2 rounded text-white ${
              guardando
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {guardando ? "Guardando..." : "Guardar Instrumento"}
          </button>
        </div>
      </div>
    </div>
  );
}
