

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function InstrumentForm() {
  const [idPrestamo, setIdPrestamo] = useState("");
  const [idEstudiante, setIdEstudiante] = useState("");
  const [idInstrumento, setIdInstrumento] = useState("");
  const [idInventario, setIdInventario] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [estatus, setEstatus] = useState("");

  const [showEstudianteModal, setShowEstudianteModal] = useState(false);
  const [showInstrumentoModal, setShowInstrumentoModal] = useState(false);

  const [searchEstudiante, setSearchEstudiante] = useState("");
  const [searchInstrumento, setSearchInstrumento] = useState("");

  // Lista simulada de estudiantes
  const listaEstudiantes = [
    { id: "EST001", nombre: "Juan Pérez" },
    { id: "EST002", nombre: "María López" },
    { id: "EST003", nombre: "Carlos Rodríguez" },
    { id: "EST004", nombre: "Ana Gómez" },
  ];

  // Estado para los instrumentos del backend
  const [instrumentosDisponibles, setInstrumentosDisponibles] = useState<
    { idInstrumento: string; nombre: string }[]
  >([]);

  // 🔹 Obtener instrumentos desde la API
  useEffect(() => {
    const fetchInstrumentos = async () => {
      try {
        const response = await fetch("/api/prestamoInstrumento");
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

        const data = await response.json();
        console.log("Datos recibidos desde la API:", data);

        const formato = data.map(
          (inst: { idInstrumento: string; nombre: string }) => ({
            idInstrumento: inst.idInstrumento,
            nombre: inst.nombre,
          })
        );
        setInstrumentosDisponibles(formato);
      } catch (error) {
        console.error("Error al cargar instrumentos:", error);
      }
    };

    fetchInstrumentos();
  }, []);

  // 🔹 Filtros de búsqueda
  const filteredEstudiantes = listaEstudiantes.filter(
    (est) =>
      est.id.toLowerCase().includes(searchEstudiante.toLowerCase()) ||
      est.nombre.toLowerCase().includes(searchEstudiante.toLowerCase())
  );

  const filteredInstrumentos = instrumentosDisponibles.filter(
    (inst) =>
      inst.idInstrumento
        ?.toString()
        .toLowerCase()
        .includes(searchInstrumento.toLowerCase()) ||
      inst.nombre?.toLowerCase().includes(searchInstrumento.toLowerCase())
  );

  // 🔹 Guardar préstamo en la API
  const handleGuardar = async () => {
    if (
      !idPrestamo ||
      !idEstudiante ||
      !idInstrumento ||
      !idInventario ||
      !fechaEntrega ||
      !estatus
    ) {
      alert("⚠️ Por favor completa todos los campos antes de guardar.");
      return;
    }

    const nuevoPrestamo = {
      idPrestamo,
      idEstudiante,
      idInstrumento,
      idInventario,
      fechaEntrega,
      estatus,
    };

    try {
      const response = await fetch("http://localhost:3000/api/prestamo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPrestamo),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Préstamo guardado correctamente:", data);
      alert("✅ Préstamo guardado con éxito.");

      // Limpia el formulario
      setIdPrestamo("");
      setIdEstudiante("");
      setIdInstrumento("");
      setIdInventario("");
      setFechaEntrega("");
      setEstatus("");
    } catch (error) {
      console.error("❌ Error al guardar el préstamo:", error);
      alert("❌ No se pudo guardar el préstamo. Revisa la consola para más detalles.");
    }
  };

  return (
    <div>
      {/* Botones principales */}
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

      {/* Cuadro principal */}
      <div className="mt-6 p-4 border border-gray-900 rounded relative">
        <h2 className="text-xl font-semibold text-blue-400">
          Registro de Préstamo 🎸
        </h2>
        <p className="mt-2 text-neutral-100">
          Ingrese los datos correspondientes al préstamo del instrumento
        </p>

        {/* Campo ID Préstamo */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            ID del préstamo
          </label>
          <input
            type="text"
            value={idPrestamo}
            onChange={(e) => setIdPrestamo(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Campo Estudiante */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            ID del estudiante
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={idEstudiante}
              readOnly
              className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none"
              placeholder="Seleccione estudiante..."
            />
            <button
              onClick={() => setShowEstudianteModal(true)}
              className="bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Seleccionar
            </button>
          </div>
        </div>

        {/* Campo Instrumento */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            ID del instrumento
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={idInstrumento}
              readOnly
              className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none"
              placeholder="Seleccione instrumento..."
            />
            <button
              onClick={() => setShowInstrumentoModal(true)}
              className="bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Seleccionar
            </button>
          </div>
        </div>

        {/* Campo ID Inventario */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            ID de inventario
          </label>
          <input
            type="text"
            value={idInventario}
            onChange={(e) => setIdInventario(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Campo Fecha de entrega */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            Fecha de entrega
          </label>
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // 🔒 Evita fechas pasadas
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Campo Estatus */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            Estatus
          </label>
          <select
            value={estatus}
            onChange={(e) => setEstatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Seleccionar opción</option>
            <option value="prestado">Prestado</option>
            <option value="en mantenimiento">En mantenimiento</option>
            <option value="disponible">Disponible</option>
          </select>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleGuardar}
            className="bg-blue-950 hover:bg-gray-700 text-white px-6 py-2 rounded"
          >
            Guardar cambios
          </button>
        </div>

        {/* MODAL ESTUDIANTE */}
        {showEstudianteModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 w-96">
              <h3 className="text-lg text-blue-400 font-semibold mb-4">
                Seleccionar Estudiante
              </h3>

              <input
                type="text"
                placeholder="Buscar o ingresar ID de estudiante..."
                className="w-full px-3 py-2 bg-gray-800 text-white rounded mb-4 focus:outline-none focus:ring focus:ring-blue-400"
                value={searchEstudiante}
                onChange={(e) => setSearchEstudiante(e.target.value)}
              />

              <ul className="bg-gray-800 rounded max-h-40 overflow-y-auto text-white mb-4">
                {filteredEstudiantes.length > 0 ? (
                  filteredEstudiantes.map((est) => (
                    <li
                      key={est.id}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setIdEstudiante(est.id);
                        setShowEstudianteModal(false);
                        setSearchEstudiante("");
                      }}
                    >
                      {est.id} - {est.nombre}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-neutral-400">
                    No se encontraron resultados
                  </li>
                )}
              </ul>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowEstudianteModal(false);
                    setSearchEstudiante("");
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL INSTRUMENTO */}
        {showInstrumentoModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 w-96">
              <h3 className="text-lg text-blue-400 font-semibold mb-4">
                Seleccionar Instrumento
              </h3>

              <input
                type="text"
                placeholder="Buscar o ingresar ID del instrumento..."
                className="w-full px-3 py-2 bg-gray-800 text-white rounded mb-4 focus:outline-none focus:ring focus:ring-blue-400"
                value={searchInstrumento}
                onChange={(e) => setSearchInstrumento(e.target.value)}
              />

              <ul className="bg-gray-800 rounded max-h-40 overflow-y-auto text-white mb-4">
                {filteredInstrumentos.length > 0 ? (
                  filteredInstrumentos.map((inst) => (
                    <li
                      key={inst.idInstrumento}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setIdInstrumento(inst.idInstrumento);
                        setShowInstrumentoModal(false);
                        setSearchInstrumento("");
                      }}
                    >
                      {inst.idInstrumento} - {inst.nombre}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-neutral-400">
                    No se encontraron resultados
                  </li>
                )}
              </ul>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowInstrumentoModal(false);
                    setSearchInstrumento("");
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
