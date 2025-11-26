
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URLS = {
  estudiantes: "/api/students",
  instrumentos: "/api/instrumento",
  inventario: "/api/inventario",
  prestamos: "/api/prestamoInstrumento",
};

interface Prestamo {
  idPrestamo: number;
  idEstudiante: number;
  idInstrumento: number;
  idInventario: string;
  fechaEntrega: string;
  Estatus: string | null;
}

interface EstudianteAPI {
  idEstudiante: number;
  nombreCompleto: string | null;
  cedula: string | null;
  status?: string | null;
}

interface InstrumentoAPI {
  idInstrumento: number;
  nombre: string;
}

export default function InstrumentLoan() {
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

  const [estudiantes, setEstudiantes] = useState<EstudianteAPI[]>([]);
  const [originalEstudiantes, setOriginalEstudiantes] = useState<
    EstudianteAPI[]
  >([]);

  const [instrumentos, setInstrumentos] = useState<InstrumentoAPI[]>([]);
  const [originalInstrumentos, setOriginalInstrumentos] = useState<
    InstrumentoAPI[]
  >([]);

  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);


  // INVENTARIO POR INSTRUMENTO

  const obtenerInventarioPorInstrumento = async (id: number) => {
    try {
      const res = await fetch(`${API_URLS.inventario}/${id}`);

      if (!res.ok) {
        setIdInventario("Sin inventario");
        return;
      }

      const data = await res.json();
      setIdInventario(data.idInventario || "");
    } catch {
      setIdInventario("");
    }
  };

  // CARGAR DATOS INICIALES
  useEffect(() => {
    const load = async () => {
      try {
        // estudiantes
        const resE = await fetch(API_URLS.estudiantes);
        if (resE.ok) {
          const dataE: EstudianteAPI[] = await resE.json();
          setEstudiantes(dataE);
          setOriginalEstudiantes(dataE);
        }

        // instrumentos
        const resI = await fetch(API_URLS.instrumentos);
        if (resI.ok) {
          const dataI = await resI.json();
          setInstrumentos(dataI);
          setOriginalInstrumentos(dataI);
        }

        // préstamos
        const resP = await fetch(`${API_URLS.prestamos}?simple=true`);
        if (resP.ok) {
          setPrestamos(await resP.json());
        }
      } catch {}
    };

    load();
  }, []);

  const recargarPrestamos = async () => {
    try {
      const res = await fetch(`${API_URLS.prestamos}?simple=true`);
      if (res.ok) {
        setPrestamos(await res.json());
      }
    } catch {}
  };

  // INVENTARIO AUTOMÁTICO AL CAMBIAR INSTRUMENTO
  useEffect(() => {
    if (!idInstrumento) return;
    obtenerInventarioPorInstrumento(Number(idInstrumento));
  }, [idInstrumento]);

  // BUSCAR ESTUDIANTE
  useEffect(() => {
    const buscar = async () => {
      const term = searchEstudiante.trim();

      let url = API_URLS.estudiantes;

      if (term !== "") {
        const isCedula = /^\d+$/.test(term);
        const key = isCedula ? "cedula" : "nombreCompleto";
        url = `${API_URLS.estudiantes}?${key}=${term}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          const activos = data.filter(
            (s: EstudianteAPI) =>
              s.status?.toString().trim().toLowerCase() === "a"
          );
          setEstudiantes(activos);
        } else {
          setEstudiantes([]);
        }
      } catch (error) {
        console.error("Error buscando estudiantes:", error);
        setEstudiantes([]);
      }
    };

    const t = setTimeout(buscar, 300);
    return () => clearTimeout(t);
  }, [searchEstudiante]);

 
  // BUSCAR INSTRUMENTO
  useEffect(() => {
    const buscar = async () => {
      const q = searchInstrumento.trim();

      if (q === "") {
        setInstrumentos(originalInstrumentos);
        return;
      }

      const isNum = !isNaN(Number(q));
      const query = isNum ? `id=${q}` : `nombre=${q}`;

      try {
        const res = await fetch(`${API_URLS.instrumentos}?${query}`);
        if (!res.ok) return;

        const data = await res.json();
        const lista = Array.isArray(data) ? data : [data];
        setInstrumentos(lista);
      } catch {}
    };

    const t = setTimeout(buscar, 300);
    return () => clearTimeout(t);
  }, [searchInstrumento, originalInstrumentos]);

  // GUARDAR / EDITAR
  const handleGuardar = async () => {
    if (!idEstudiante || !idInstrumento || !idInventario || !fechaEntrega) {
      alert("Complete todos los campos");
      return;
    }

    try {
      setGuardando(true);

      const fecha = new Date(fechaEntrega).toISOString().split("T")[0];

      if (modoEdicion && idPrestamoEditando) {
        const res = await fetch(`${API_URLS.prestamos}/${idPrestamoEditando}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fechaEntrega: fecha, Estatus: estatus }),
        });

        if (!res.ok) {
          alert("No se pudo modificar.");
          return;
        }

        alert("Modificado correctamente.");
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

      const body = {
        idEstudiante,
        idInstrumento,
        idInventario,
        fechaEntrega: fecha,
      };

      const res = await fetch(API_URLS.prestamos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Error al guardar");
        return;
      }

      alert("Guardado correctamente.");

      await fetch(`${API_URLS.inventario}/${idInventario}`, {
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
    } finally {
      setGuardando(false);
    }
  };

  // ELIMINAR
  const handleEliminar = async (idPrestamo: number) => {
    if (!confirm("¿Eliminar?")) return;

    try {
      const res = await fetch(`${API_URLS.prestamos}/${idPrestamo}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("No se pudo eliminar");
        return;
      }

      alert("Eliminado");
      await recargarPrestamos();
    } catch {}
  };


  // ACTIVAR EDICIÓN
  const activarEdicion = (p: Prestamo) => {
    setModoEdicion(true);

    setIdPrestamoEditando(p.idPrestamo);
    setIdEstudiante(String(p.idEstudiante));
    setIdInstrumento(String(p.idInstrumento));
    setIdInventario(p.idInventario);
    setFechaEntrega(p.fechaEntrega.split("T")[0]);
    setEstatus(p.Estatus || "Prestado");
  };

  const prestamosFiltrados = prestamos.filter((p) => {
    const q = busqueda.toLowerCase();
    return (
      p.idPrestamo.toString().includes(q) ||
      p.idEstudiante.toString().includes(q) ||
      p.idInstrumento.toString().includes(q) ||
      p.idInventario.toLowerCase().includes(q) ||
      p.fechaEntrega.toString().includes(q) ||
      (p.Estatus || "").toLowerCase().includes(q)
    );
  });

  // RENDER
  return (
    <div>
      {/* BOTONES */}
      <div className="flex gap-2 mb-3">
        <Link href="/dashboard/instruments">
          <button className="bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Agregar Instrumento
          </button>
        </Link>

        <Link href="/dashboard/instruments/inventario">
          <button className="bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Inventario
          </button>
        </Link>

        <Link href="/dashboard/instruments/loan">
          <button className="bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Préstamo Instrumento
          </button>
        </Link>
      </div>

      <div className="flex gap-6 items-start mt-6">
        {/* FORMULARIO */}
        <div className="w-[420px] ml-[-10px]">
          <div className="p-4 border border-gray-900 rounded relative">
            <h2 className="text-xl font-semibold text-blue-400">
              {modoEdicion ? "Modificar Préstamo" : "Registro de Préstamo"}
            </h2>

            {/* Estudiante */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                Estudiante
              </label>

              {modoEdicion ? (
                <input
                  value={idEstudiante}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded opacity-60"
                />
              ) : (
                <div className="flex gap-2">
                  <input
                    value={idEstudiante}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-900 text-white rounded"
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

            {/* Instrumento */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                Instrumento
              </label>

              {modoEdicion ? (
                <input
                  value={idInstrumento}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded opacity-60"
                />
              ) : (
                <div className="flex gap-2">
                  <input
                    value={idInstrumento}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-900 text-white rounded"
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

            {/* Inventario */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                Inventario
              </label>
              <input
                value={idInventario}
                readOnly
                className="w-full px-3 py-2 bg-gray-900 text-white rounded"
              />
            </div>

            {/* Fecha */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                Fecha de entrega
              </label>
              <input
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded"
              />
            </div>

            {/* Estado */}
            {modoEdicion && (
              <div className="mt-4">
                <label className="block text-sm text-neutral-200 mb-1">
                  Estado
                </label>
                <select
                  value={estatus}
                  onChange={(e) => setEstatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 text-white rounded"
                >
                  <option value="Prestado">Prestado</option>
                  <option value="Devuelto">Devuelto</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </div>
            )}

            {/* Guardar */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="bg-blue-950 hover:bg-gray-700 text-white px-6 py-2 rounded"
              >
                {guardando
                  ? "Guardando..."
                  : modoEdicion
                  ? "Guardar cambios"
                  : "Guardar préstamo"}
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
                    placeholder="Buscar estudiante..."
                    value={searchEstudiante}
                    onChange={(e) => setSearchEstudiante(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded mb-4"
                  />

                  <ul className="bg-gray-800 rounded max-h-40 overflow-y-auto text-white">
                    {estudiantes.length > 0 ? (
                      estudiantes.map((est) => (
                        <li
                          key={est.idEstudiante}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setIdEstudiante(String(est.idEstudiante));
                            setShowEstudianteModal(false);
                            setSearchEstudiante("");
                            setEstudiantes(originalEstudiantes);
                          }}
                        >
                          {est.cedula} - {est.nombreCompleto}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-neutral-400">
                        No se encontraron resultados
                      </li>
                    )}
                  </ul>

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        setShowEstudianteModal(false);
                        setSearchEstudiante("");
                        setEstudiantes(originalEstudiantes);
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
                    placeholder="Buscar por ID o nombre..."
                    value={searchInstrumento}
                    onChange={(e) => setSearchInstrumento(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded mb-4"
                  />

                  <ul className="bg-gray-800 rounded max-h-40 overflow-y-auto text-white">
                    {instrumentos.length > 0 ? (
                      instrumentos.map((inst) => (
                        <li
                          key={inst.idInstrumento}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setIdInstrumento(String(inst.idInstrumento));
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

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        setShowInstrumentoModal(false);
                        setSearchInstrumento("");
                        setInstrumentos(originalInstrumentos);
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

        {/* TABLA */}
        <div className="w-[950px] border border-gray-900 rounded p-4">
          <h2 className="text-xl font-semibold text-blue-400 mb-3">
            Lista de Préstamos
          </h2>

          <div className="mb-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔎 Buscar..."
              className="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700"
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
                    Inventario
                  </th>
                  <th className="px-3 py-2 border border-gray-700">Fecha</th>
                  <th className="px-3 py-2 border border-gray-700">Estado</th>
                  <th className="px-3 py-2 border border-gray-700"></th>
                </tr>
              </thead>

              <tbody className="text-neutral-100">
                {prestamosFiltrados.map((p) => (
                  <tr key={p.idPrestamo} className="hover:bg-gray-800">
                    <td className="px-3 py-2 border border-gray-800">
                      {p.idPrestamo}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {estudiantes.find(e => e.idEstudiante === p.idEstudiante)?.nombreCompleto || "Cargando"}

                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {instrumentos.find(i => i.idInstrumento === p.idInstrumento)?.nombre || "Cargando"} 
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.idInventario}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.fechaEntrega.split("T")[0]}
                    </td>
                    <td className="px-3 py-2 border border-gray-800">
                      {p.Estatus}
                    </td>

                    <td className="px-3 py-2 border border-gray-800 text-center">
                      <div className="flex justify-center items-center gap-4">

                        <button
                          className="text-blue-400 "
                          onClick={() => activarEdicion(p)}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-400 "
                          onClick={() => handleEliminar(p.idPrestamo)}
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
