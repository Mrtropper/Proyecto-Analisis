"use client";

import { useState } from "react";
import Link from "next/link";

export default function InstrumentForm() {

  const [idInstrumento, setIDInstrumento] = useState("");
  const [nombreInstrumento, setNombreInstrumento] = useState("");
  const [estadoInstrumento, setEstadoInstrumento] = useState("");


  return (
    <div>{/*div principal*/}
      {/*Botones principales*/}
      <div className="flex gap-2 mb-3">
        <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Agregar Instrumento
        </button>

        <Link href="/dashboard/instruments/list">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Lista
          </button>
        </Link>

        <Link href="/dashboard/instruments/update">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Modificar
          </button>
        </Link>

      </div>

      {/* Cuadro original */}
      <div className="mt-6 p-4 border border-gray-900 rounded">
        <h2 className="text-xl font-semibold text-blue-400">
          Agregar Instrumento 🎸
        </h2>
        <p className="mt-2 text-neutral-100">
          Ingrese los datos del instrumento
        </p>

        {/* Campo ID Instrumento */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            ID del instrumento
          </label>
          <input
            type="text"
            value={idInstrumento}
            onChange={(e) => setIDInstrumento(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

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

        {/* Campo Estado */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            Estado
          </label>
          <select
            value={estadoInstrumento}
            onChange={(e) => setEstadoInstrumento(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Seleccione una opción</option>
            <option value="Disponible">Disponible</option>
            <option value="En mantenimiento">En mantenimiento</option>
            <option value="Ocupado">Ocupado</option>
          </select>
        </div>


        {/* Botón final alineado a la derecha */}
        <div className="flex justify-end mt-4">
          <button className="w-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Guardar Instrumento
          </button>
        </div>

      </div>
    </div>
  );
}
