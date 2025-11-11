"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Instrumento {
  idInstrumento: string;
  nombreInstrumento: string;
  estadoInstrumento: string;
  idEstudiante?: string; // opcional, por si no se usa todavía
}

export default function InstrumentList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar los datos desde localStorage
  useEffect(() => {
    const almacenados = JSON.parse(localStorage.getItem("instrumentos") || "[]");
    setInstrumentos(almacenados);
  }, []);

  // Filtrar según búsqueda
  const instrumentosFiltrados = instrumentos.filter((inst) => {
    const id = inst.idInstrumento?.toLowerCase() || "";
    const nombre = inst.nombreInstrumento?.toLowerCase() || "";
    const estado = inst.estadoInstrumento?.toLowerCase() || "";
    const estudiante = inst.idEstudiante?.toLowerCase?.() || "";

    return (
      id.includes(busqueda.toLowerCase()) ||
      nombre.includes(busqueda.toLowerCase()) ||
      estado.includes(busqueda.toLowerCase()) ||
      estudiante.includes(busqueda.toLowerCase())
    );
  });



  // Eliminar instrumento
  const eliminarInstrumento = (id: string) => {
    const nuevos = instrumentos.filter((i) => i.idInstrumento !== id);
    localStorage.setItem("instrumentos", JSON.stringify(nuevos));
    setInstrumentos(nuevos);
    setShowModal(false);
  };

  return (
    <div>
      {/* Botones arriba */}
      <div className="flex gap-2 mb-3">
        <Link href="/dashboard/instruments">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Agregar Instrumento
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
          Lista de Instrumentos 🎵
        </h2>
        <p className="mt-2 text-neutral-300">
          Aquí puedes visualizar los instrumentos registrados.
        </p>

        {/* Barra de búsqueda */}
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
                <th className="border border-blue-600 px-4 py-2 text-left">ID</th>
                <th className="border border-blue-600 px-4 py-2 text-left">Nombre</th>
                <th className="border border-blue-600 px-4 py-2 text-left">Estado</th>
                <th className="border border-blue-600 px-4 py-2 text-left">ID Estudiante</th>
                <th className="border border-blue-600 px-4 py-2 text-left w-16"></th>
              </tr>
            </thead>

                <tbody className="text-neutral-200">
                {instrumentosFiltrados.length > 0 ? (
                  instrumentosFiltrados.map((inst) => (
                    <tr key={inst.idInstrumento} className="bg-neutral-900 hover:bg-neutral-800 transition">
                      <td className="border border-blue-600 px-4 py-2">{inst.idInstrumento}</td>
                      <td className="border border-blue-600 px-4 py-2">{inst.nombreInstrumento}</td>
                      <td className="border border-blue-600 px-4 py-2">{inst.estadoInstrumento}</td>
                      <td className="border border-blue-600 px-4 py-2">{inst.idEstudiante ?? ""}</td>

                      {/* Celda de acciones: Editar y Eliminar */}
                      <td className="border border-blue-600 px-2 py-2 text-center w-28">
                        {/* Editar */}
                        <button
                          onClick={() => {
                            localStorage.setItem("instrumentoEditar", JSON.stringify(inst));
                            window.location.href = "/dashboard/instruments/update";
                          }}
                          className="text-blue-400 hover:text-blue-600 text-xl mr-2"
                          title="Editar"
                        >
                          ✏️
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => {
                            setSelectedId(inst.idInstrumento);
                            setShowModal(true);
                          }}
                          className="text-red-500 hover:text-red-700 text-xl"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-neutral-900">
                    <td colSpan={5} className="text-center text-neutral-400 py-4">
                      No hay instrumentos registrados.
                    </td>
                  </tr>
                )}
              </tbody>

          </table>
        </div>
      </div>

      {/* Modal para confirmar si desea eliminar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-neutral-900 border border-blue-600 p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold text-white mb-4">Advertencia</h3>
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
                onClick={() => eliminarInstrumento(selectedId!)}
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
