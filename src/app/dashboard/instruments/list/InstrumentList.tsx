"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface RegistroInstrumento {
  idInventario: string;
  idInstrumento: number;
  nombreInstrumento: string;
  Estado: string;
  idEstudiante: string | number | "";
  fechaEntrega: string | "";
}

export default function InstrumentList() {
  const [registros, setRegistros] = useState<RegistroInstrumento[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("/api/inventario");
        const data = await res.json();
        setRegistros(data);
      } catch (e) {
        console.error("Error cargando inventario:", e);
      }
    };

    cargar();
  }, []);

  // Filtro
  const filtrados = registros.filter((r) => {
    const texto = busqueda.toLowerCase();

    return (
      r.idInventario.toLowerCase().includes(texto) ||
      r.idInstrumento.toString().includes(texto) ||
      r.nombreInstrumento.toLowerCase().includes(texto) ||
      r.Estado.toLowerCase().includes(texto) ||
      r.idEstudiante.toString().toLowerCase().includes(texto) ||
      r.fechaEntrega.toString().toLowerCase().includes(texto)
    );
  });

  return (
    <div>
      {/* Botones arriba */}
      <div className="flex gap-2 mb-3">
        <Link href="/dashboard/instruments">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Agregar Instrumento
          </button>
        </Link>

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

      {/* Contenido principal */}
      <div className="mt-6 p-4 border border-gray-900 rounded">
        <h2 className="text-xl font-semibold text-blue-400">
          Lista de Instrumentos
        </h2>

        <div className="mt-4 mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Tabla */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border border-blue-600 rounded">
            <thead>
              <tr className="bg-blue-950 text-blue-300">
                <th className="border border-blue-600 px-4 py-2">ID Inventario</th>
                <th className="border border-blue-600 px-4 py-2">ID Instrumento</th>
                <th className="border border-blue-600 px-4 py-2">Nombre</th>
                <th className="border border-blue-600 px-4 py-2">Estado</th>
                <th className="border border-blue-600 px-4 py-2">ID Estudiante</th>
                <th className="border border-blue-600 px-4 py-2">Fecha Entrega</th>
                <th className="border border-blue-600 px-4 py-2 w-16"></th>
              </tr>
            </thead>

            <tbody className="text-neutral-200">
              {filtrados.length > 0 ? (
                filtrados.map((r) => (
                  <tr key={r.idInventario || `invless-${r.idInstrumento}`} className="bg-neutral-900 hover:bg-neutral-800">
                    <td className="border border-blue-600 px-4 py-2">{r.idInventario}</td>
                    <td className="border border-blue-600 px-4 py-2">{r.idInstrumento}</td>
                    <td className="border border-blue-600 px-4 py-2">{r.nombreInstrumento}</td>
                    <td className="border border-blue-600 px-4 py-2">{r.Estado}</td>
                    <td className="border border-blue-600 px-4 py-2">{r.idEstudiante}</td>
                    <td className="border border-blue-600 px-4 py-2">
                      {r.fechaEntrega ? r.fechaEntrega.toString().split("T")[0] : ""}
                    </td>
                    <td className="border border-blue-600 px-2 py-2 w-28 text-center">
                        <div className="flex justify-center gap-6">
                          <span>✏️</span>
                          <span>🗑️</span>
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-neutral-400 py-4">
                    No hay instrumentos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
