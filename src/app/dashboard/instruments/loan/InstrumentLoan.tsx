"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Prestamo {
  idPrestamo: number;
  idEstudiante: number;
  idInstrumento: number;
  idInventario: string;
  fechaEntrega: string;
  Estatus: string | null;
}

export default function InstrumentForm() {
  const [idEstudiante, setIdEstudiante] = useState("");
  const [idInstrumento, setIdInstrumento] = useState("");
  const [idInventario, setIdInventario] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  const [estatus, setEstatus] = useState("Prestado");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idPrestamoEditando, setIdPrestamoEditando] = useState<number | null>(
    null
  );

  const [guardando, setGuardando] = useState(false);

  const [showEstudianteModal, setShowEstudianteModal] = useState(false);
  const [showInstrumentoModal, setShowInstrumentoModal] = useState(false);

  const [searchEstudiante, setSearchEstudiante] = useState("");
  const [searchInstrumento, setSearchInstrumento] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const listaEstudiantes = [
    { id: 2, nombre: "Juan Pérez" },
    { id: 3, nombre: "María López" },
    { id: 4, nombre: "Carlos Rodríguez" },
    { id: 5, nombre: "Ana Gómez" },
  ];

  const [instrumentosDisponibles, setInstrumentosDisponibles] = useState<
    { idInstrumento: string; nombre: string }[]
  >([]);

  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  // Obtener inventario x instrumento
  const obtenerInventarioPorInstrumento = async (idInstrumento: number) => {
    try {
      const response = await fetch(`/api/inventario/${idInstrumento}`);

      if (!response.ok) {
        setIdInventario("No se encontró inventario para este instrumento");
        return;
      }

      const data = await response.json();
      setIdInventario(data.idInventario || "");
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      setIdInventario("");
    }
  };

  // Cargar instrumentos
  useEffect(() => {
    const fetchInstrumentos = async () => {
      try {
        const response = await fetch("/api/instrumento");
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        const data = await response.json();
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

    const cargarPrestamos = async () => {
      try {
        const res = await fetch("/api/prestamoInstrumento?simple=true", {
          cache: "no-store",
        });
        const data = await res.json();
        setPrestamos(data);
      } catch (e) {
        console.error("Error al cargar préstamos:", e);
      }
    };

    fetchInstrumentos();
    cargarPrestamos();
  }, []);

  const recargarPrestamos = async () => {
    try {
      const res = await fetch("/api/prestamoInstrumento?simple=true", {
        cache: "no-store",
      });
      const data = await res.json();
      setPrestamos(data);
    } catch (e) {
      console.error("Error al recargar préstamos:", e);
    }
  };

  // Buscar idInventario al cambiar instrumento
  useEffect(() => {
    if (!idInstrumento) return;
    obtenerInventarioPorInstrumento(Number(idInstrumento));
  }, [idInstrumento]);

  // Filtros de búsqueda
  const filteredEstudiantes = listaEstudiantes.filter(
    (est) =>
      est.id.toString().includes(searchEstudiante.toLowerCase()) ||
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

  const prestamosFiltrados = prestamos.filter((p) => {
    const q = busqueda.toLowerCase();
    return (
      p.idPrestamo.toString().includes(q) ||
      p.idEstudiante.toString().includes(q) ||
      p.idInstrumento.toString().includes(q) ||
      p.idInventario.toLowerCase().includes(q) ||
      p.fechaEntrega.toString().toLowerCase().includes(q) ||
      (p.Estatus || "").toLowerCase().includes(q)
    );
  });

  // Guardar / Modificar préstamo
  const handleGuardar = async () => {
    if (!idEstudiante || !idInstrumento || !idInventario || !fechaEntrega) {
      alert("Por favor complete todos los campos antes de guardar.");
      return;
    }

    try {
      setGuardando(true);

      const fechaFormateada = new Date(fechaEntrega)
        .toISOString()
        .split("T")[0];

      // EDITAR
      if (modoEdicion && idPrestamoEditando !== null) {
        const response = await fetch(
          `/api/prestamoInstrumento/${idPrestamoEditando}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fechaEntrega: fechaFormateada,
              Estatus: estatus,
            }),
          }
        );

        if (!response.ok) {
          const errorData: { error?: string } = await response.json();
          alert(errorData.error || "No se pudo modificar el préstamo.");
          return;
        }

        alert("Préstamo modificado correctamente.");
        setModoEdicion(false);
        setIdPrestamoEditando(null);
        setIdEstudiante("");
        setIdInstrumento("");
        setIdInventario("");
        setFechaEntrega("");
        setEstatus("Prestado");
        await recargarPrestamos();
        return;
      }

      // GUARDAR
      const nuevoPrestamo = {
        idEstudiante,
        idInstrumento,
        idInventario,
        fechaEntrega: fechaFormateada,
        // Estatus no se envía, backend usa default "Prestado"
      };

      const response = await fetch("/api/prestamoInstrumento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPrestamo),
      });

      if (response.ok) {
        alert("Préstamo guardado correctamente.");

        // Actualizar inventario a Prestado
        await fetch(`/api/inventario/${idInventario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Estado: "Prestado" }),
        });

        setIdEstudiante("");
        setIdInstrumento("");
        setIdInventario("");
        setFechaEntrega("");
        setEstatus("Prestado");
        await recargarPrestamos();
      } else {
        // 👉 Aquí está el cambio importante
        const errorData: { error?: string } = await response.json();
        alert(errorData.error || "No se pudo guardar el préstamo.");
      }
    } catch (error) {
      console.error("Error al guardar el préstamo:", error);
      alert("Ocurrió un error al intentar guardar el préstamo.");
    } finally {
      setGuardando(false);
    }
  };


  // Eliminar préstamo
  const handleEliminar = async (idPrestamo: number) => {
    if (!confirm("¿Seguro que desea eliminar este préstamo?")) return;

    try {
      const response = await fetch(`/api/prestamoInstrumento/${idPrestamo}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al eliminar préstamo:", errorText);
        alert("No se pudo eliminar el préstamo.");
        return;
      }

      alert("Préstamo eliminado correctamente.");
      await recargarPrestamos();
    } catch (e) {
      console.error("Error al eliminar préstamo:", e);
    }
  };

  // Activar modo edición
  const activarEdicion = (prestamo: Prestamo) => {
    setModoEdicion(true);
    setIdPrestamoEditando(prestamo.idPrestamo);
    setIdEstudiante(prestamo.idEstudiante.toString());
    setIdInstrumento(prestamo.idInstrumento.toString());
    setIdInventario(prestamo.idInventario);
    setFechaEntrega(prestamo.fechaEntrega.split("T")[0] || "");
    setEstatus(prestamo.Estatus || "Prestado");
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

      </div>

      {/* FORMULARIO + TABLA */}
      <div className="flex gap-6 items-start mt-6">
        {/* Cuadro principal (FORMULARIO) */}
        <div className="w-[420px]">
          <div className="p-4 border border-gray-900 rounded relative">
            <h2 className="text-xl font-semibold text-blue-400">
              {modoEdicion ? "Modificar Préstamo" : "Registro de Préstamo"}
            </h2>
            <p className="mt-2 text-neutral-100">
              {modoEdicion
                ? "Edite la fecha y el estado del préstamo"
                : "Ingrese los datos correspondientes al préstamo del instrumento"}
            </p>

            {/* Campo Estudiante con modal */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                ID del estudiante
              </label>
              {modoEdicion ? (
                <input
                  type="text"
                  value={idEstudiante}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded opacity-60 cursor-not-allowed"
                />
              ) : (
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
              )}
            </div>

            {/* Campo Instrumento con modal */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                ID del instrumento
              </label>
              {modoEdicion ? (
                <input
                  type="text"
                  value={idInstrumento}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded opacity-60 cursor-not-allowed"
                />
              ) : (
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
              )}
            </div>

            {/* Campo ID Inventario */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                ID de inventario
              </label>
              <input
                type="text"
                value={idInventario}
                readOnly
                className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400 opacity-90"
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
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            {/* Campo Estado (solo en edición) */}
            {modoEdicion && (
              <div className="mt-4">
                <label className="block text-sm text-neutral-200 mb-1">
                  Estado del préstamo
                </label>
                <select
                  value={estatus}
                  onChange={(e) => setEstatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
                >
                  <option value="Prestado">Prestado</option>
                  <option value="Devuelto">Devuelto</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </div>
            )}

            {/* Botón Guardar */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className={`bg-blue-950 hover:bg-gray-700 text-white px-6 py-2 rounded ${
                  guardando ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {guardando
                  ? "Guardando..."
                  : modoEdicion
                  ? "Guardar cambios"
                  : "Guardar préstamo"}
              </button>
            </div>

            {/* MODALES*/}
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
                            setIdEstudiante(String(est.id));
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

        {/* TABLA DE PRÉSTAMOS */}
        <div className="w-[750px] border border-gray-900 rounded p-4">
          <h2 className="text-xl font-semibold text-blue-400 mb-3">
            Lista de Préstamos
          </h2>

          {/* BUSQUEDA */}
          <div className="mb-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔎 Buscar por ID préstamo, estudiante, instrumento, inventario, fecha o estado..."
              className="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="overflow-y-auto max-h-[400px] rounded">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900 text-neutral-300">
                <tr>
                  <th className="px-3 py-2 border border-gray-700">
                    ID Préstamo
                  </th>
                  <th className="px-3 py-2 border border-gray-700">
                    ID Estudiante
                  </th>
                  <th className="px-3 py-2 border border-gray-700">
                    ID Instrumento
                  </th>
                  <th className="px-3 py-2 border border-gray-700">
                    ID Inventario
                  </th>
                  <th className="px-3 py-2 border border-gray-700">Fecha</th>
                  <th className="px-3 py-2 border border-gray-700">Estado</th>
                  <th className="px-3 py-2 border border-gray-700"></th>
                </tr>
              </thead>

              <tbody className="text-neutral-100">
                {prestamosFiltrados.map((p) => (
                  <tr key={p.idPrestamo} className="hover:bg-gray-800 transition">
                    <td className="px-3 py-2 border border-gray-800">
                      {p.idPrestamo}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.idEstudiante}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.idInstrumento}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.idInventario}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.fechaEntrega
                        ? p.fechaEntrega.toString().split("T")[0]
                        : ""}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.Estatus || "Prestado"}
                    </td>

                    <td className="border border-gray-800 px-2 py-2 text-center w-32">
                      <div className="flex justify-center gap-6">
                        {/* EDITAR */}
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => activarEdicion(p)}
                        >
                          ✏️
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() => handleEliminar(p.idPrestamo)}
                          className="text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
