
"use client";

import Link from "next/link";
import { useState } from "react";

export default function InstrumentList() {
  
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  return (
    <div>
      {/* Botones arriba */}
      <div className="flex gap-2 mb-3">
        <Link href="/dashboard/instruments">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Agregar Instrumento
          </button>
        </Link>

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

      {/* Contenido original */}
      <div className="mt-6 p-4 border border-gray-900 rounded">
        <h2 className="text-xl font-semibold text-blue-400">
          Lista de Instrumentos 🎵
        </h2>
        <p className="mt-2 text-neutral-300">
          Aquí puedes visualizar los instrumentos registrados.
        </p>

        {/* Tabla estilo oscuro */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border border-blue-600 rounded">
            <thead>
              <tr className="bg-blue-950 text-blue-300">
                <th className="border border-blue-600 px-4 py-2 text-left">ID</th>
                <th className="border border-blue-600 px-4 py-2 text-left">Nombre</th>
                <th className="border border-blue-600 px-4 py-2 text-left">Estado</th>
                <th className="border border-blue-600 px-4 py-2 text-left">ID Estudiante</th>
                <th className="border border-blue-600 px-4 py-2 text-left"></th>
              </tr>
            </thead>

            <tbody className="text-neutral-200">
              <tr className="bg-neutral-900 hover:bg-neutral-800 transition">
                <td className="border border-blue-600 px-4 py-2">1</td>
                <td className="border border-blue-600 px-4 py-2">Guitarra</td>
                <td className="border border-blue-600 px-4 py-2">Disponible</td>
                <td className="border border-blue-600 px-4 py-2"></td>
                <td className="border border-blue-600 px-2 py-2 text-center w-16">
                  <button
                    onClick={() => {
                      setSelectedId(1); 
                      setShowModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    🗑️
                  </button>
                </td>

              </tr>
              <tr className="bg-neutral-900 hover:bg-neutral-800 transition">
                <td className="border border-blue-600 px-4 py-2">2</td>
                <td className="border border-blue-600 px-4 py-2">Piano</td>
                <td className="border border-blue-600 px-4 py-2">En mantenimiento</td>
                <td className="border border-blue-600 px-4 py-2"></td>
                <td className="border border-blue-600 px-2 py-2 text-center w-16">
                  <button
                    onClick={() => {
                      setSelectedId(1); 
                      setShowModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
              
              <tr className="bg-neutral-900 hover:bg-neutral-800 transition">
                <td className="border border-blue-600 px-4 py-2">2</td>
                <td className="border border-blue-600 px-4 py-2">Flauta</td>
                <td className="border border-blue-600 px-4 py-2">Ocupado</td>
                <td className="border border-blue-600 px-4 py-2">203330444</td>
                <td className="border border-blue-600 px-2 py-2 text-center w-16">
                  <button
                    onClick={() => {
                      setSelectedId(1); 
                      setShowModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-neutral-900 border border-blue-600 p-6 rounded shadow-lg w-80">
          <h3 className="text-lg font-semibold text-white mb-4">
            Advertencia
          </h3>
          <p className="text-neutral-300 mb-6">
            ¿Quieres eliminar este instrumento?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>

            <button
              onClick={() => {
                console.log("Eliminar ID:", selectedId);
                setShowModal(false);
              }}
              className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Aceptar
            </button>
          </div>
        </div>
  </div>
)}







    </div>

  );
}
