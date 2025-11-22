"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Inventario {
  idInventario: string;
  idInstrumento: number;
  Estado: string;
}

interface Instrumento {
  idInstrumento: number;
  nombre: string;
}

export default function InventarioForm() {
  const [idInventario, setIdInventario] = useState("");
  const [idInstrumento, setIdInstrumento] = useState("");
  const [estado, setEstado] = useState("Disponible");

  const [modoEdicion, setModoEdicion] = useState(false);

  const [guardando, setGuardando] = useState(false);

  const [showInstrumentoModal, setShowInstrumentoModal] = useState(false);
  const [searchInstrumento, setSearchInstrumento] = useState("");

  const [instrumentosDisponibles, setInstrumentosDisponibles] = useState<
    Instrumento[]
  >([]);

  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar inventario desde API
  const cargarInventario = async () => {
    try {
      const res = await fetch("/api/inventario", { cache: "no-store" });
      const data = await res.json();
      setInventario(data);
    } catch (err) {
      console.error("Error al cargar inventario:", err);
    }
  };

  // Cargar instrumentos
  useEffect(() => {
    const fetchInstrumentos = async () => {
      try {
        const response = await fetch("/api/instrumento");
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

        const data = await response.json();
        const formato = data.map((inst: Instrumento) => ({
          idInstrumento: inst.idInstrumento,
          nombre: inst.nombre,
        }));

        setInstrumentosDisponibles(formato);
      } catch (error) {
        console.error("Error al cargar instrumentos:", error);
      }
    };

    fetchInstrumentos();
    cargarInventario();
  }, []);

  // FILTRO EN TABLA
  const inventarioFiltrado = inventario.filter(
    (item) =>
      item.idInventario.toString().includes(busqueda.toLowerCase()) ||
      item.idInstrumento.toString().includes(busqueda.toLowerCase()) ||
      item.Estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  // GUARDAR O EDITAR
  const handleGuardar = async () => {
    if (!idInventario || !idInstrumento) {
      alert("Por favor complete todos los campos.");
      return;
    }

    try {
      setGuardando(true);

      // EDITAR
      if (modoEdicion) {
        const response = await fetch(`/api/inventario/${idInventario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Estado: estado }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          alert(`Error al modificar: ${error.error || "Error desconocido"}`);
          return;
        }

        alert("Inventario actualizado correctamente");

        setModoEdicion(false);
        setEstado("Disponible");
        setIdInventario("");
        setIdInstrumento("");
        cargarInventario();
        return;
      }

      //AGREGAR
      const nuevoInventario = {
        idInventario,
        idInstrumento,
      };

      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoInventario),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(`Error al guardar: ${error.error || "Error desconocido"}`);
        return;
      }

      alert("Inventario guardado correctamente");
      setIdInstrumento("");
      setIdInventario("");
      setEstado("Disponible");
      cargarInventario();
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar con la API.");
    } finally {
      setGuardando(false);
    }
  };

  // ELIMINAR
  const handleEliminar = async (id: string) => {
    if (!confirm("¿Seguro que desea eliminar este registro?")) return;

    try {
      const response = await fetch(`/api/inventario/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Error al eliminar el registro.");
        return;
      }

      alert("Inventario eliminado correctamente.");
      cargarInventario();
    } catch (e) {
      console.error(e);
    }
  };

  // FILTRO INSTRUMENTOS EN MODAL
  const filteredInstrumentos = instrumentosDisponibles.filter(
    (inst) =>
      inst.idInstrumento.toString().includes(searchInstrumento.toLowerCase()) ||
      inst.nombre.toLowerCase().includes(searchInstrumento.toLowerCase())
  );

  return (
    <div>
      {/* BOTONES */}
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
        {/* FORMULARIO */}
        <div className="w-[350px]">
          <div className="p-4 border border-gray-900 rounded">
            <h2 className="text-xl font-semibold text-blue-400">
              {modoEdicion ? "Modificar Inventario" : "Inventario"}
            </h2>

            <p className="mt-2 text-neutral-100">
              {modoEdicion
                ? "Edite el estado del inventario"
                : "Ingrese los datos para el inventario"}
            </p>

            {/* ID INVENTARIO */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                ID Inventario
              </label>
              <input
                type="text"
                readOnly={modoEdicion}
                value={idInventario}
                onChange={(e) => setIdInventario(e.target.value)}
                className={`w-full px-3 py-2 bg-gray-900 text-white rounded ${
                  modoEdicion
                    ? "opacity-60 cursor-not-allowed"
                    : "focus:ring focus:ring-blue-400"
                }`}
              />
            </div>

            {/* INSTRUMENTO */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                ID del instrumento
              </label>

              {modoEdicion ? (
                <input
                  type="text"
                  readOnly
                  value={idInstrumento}
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded opacity-60 cursor-not-allowed"
                />
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={idInstrumento}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-900 text-white rounded"
                    placeholder="Seleccione el instrumento..."
                  />
                  <button
                    onClick={() => setShowInstrumentoModal(true)}
                    className="bg-blue-950 hover:bg-gray-900 text-white px-4 py-2 rounded"
                  >
                    Seleccionar
                  </button>
                </div>
              )}
            </div>

            {/* ESTADO (solo en edición) */}
            {modoEdicion && (
              <div className="mt-4">
                <label className="block text-sm text-neutral-200 mb-1">
                  Estado
                </label>

                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:ring focus:ring-blue-400"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Prestado">Prestado</option>
                </select>
              </div>
            )}

            {/* BOTÓN */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className={`w-full px-4 py-2 rounded text-white ${
                  guardando
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {guardando
                  ? "Guardando..."
                  : modoEdicion
                  ? "Modificar Inventario"
                  : "Guardar Inventario"}
              </button>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="w-[750px] border border-gray-900 rounded p-4">
          <h2 className="text-xl font-semibold text-blue-400 mb-3">
            Lista de Inventario
          </h2>

          {/* BUSQUEDA */}
          <div className="mb-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔎 Buscar por ID inventario, ID instrumento o estado..."
              className="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="overflow-y-auto max-h-[400px] rounded">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900 text-neutral-300">
                <tr>
                  <th className="px-3 py-2 border border-gray-700">
                    ID Inventario
                  </th>
                  <th className="px-3 py-2 border border-gray-700">
                    ID Instrumento
                  </th>
                  <th className="px-3 py-2 border border-gray-700">Estado</th>
                  <th className="px-3 py-2 border border-gray-700"></th>
                </tr>
              </thead>

              <tbody className="text-neutral-100">
                {inventarioFiltrado.map((item) => (
                  <tr
                    key={item.idInventario}
                    className="hover:bg-gray-800 transition"
                  >
                    <td className="px-3 py-2 border border-gray-800">
                      {item.idInventario}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {item.idInstrumento}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {item.Estado}
                    </td>

                    <td className="border border-gray-800 px-2 py-2 text-center w-32">
                      <div className="flex justify-center gap-6">
                        {/* EDITAR */}
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            setModoEdicion(true);
                            setIdInventario(item.idInventario);
                            setIdInstrumento(
                              item.idInstrumento?.toString() ?? ""
                            );
                            setEstado(item.Estado || "Disponible");
                          }}
                        >
                          ✏️
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() => handleEliminar(item.idInventario)}
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

      {/* MODAL DE INSTRUMENTO */}
      {showInstrumentoModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 w-96">
            <h3 className="text-lg text-blue-400 font-semibold mb-4">
              Seleccionar Instrumento
            </h3>

            <input
              type="text"
              placeholder="Buscar..."
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
                      setIdInstrumento(inst.idInstrumento.toString());
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
  );
}
