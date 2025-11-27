"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";

type Estudiante = {
  idEstudiante: number;
  nombreCompleto: string;
  cedula: string;
};

type CupoData = {
  idHorario: number;
  idProfesor: number;
  nombreProfesor: string;
  dia: string;
  horario: string;
  estudiantesAsignados: Estudiante[];
  cuposDisponibles: number;
};

export default function ProfesorCupos() {
  const [cuposData, setCuposData] = useState<CupoData[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroProfesor, setFiltroProfesor] = useState("");
  const [filtroDia, setFiltroDia] = useState("");
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<CupoData | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<number | "">("");

  const CUPOS_MAXIMOS = 15;

  const fetchData = async () => {
  try {
    setLoading(true);
    setError("");

    // Cargar datos de cupos
    const response = await fetch("/api/profesorCupos");
    if (!response.ok) throw new Error("Error al cargar datos");
    const data = await response.json();
    setCuposData(data);

    // Cargar estudiantes para el dropdown
    const estudiantesResponse = await fetch("/api/estudiantes"); // ← Esta API debe existir
    if (estudiantesResponse.ok) {
      const estudiantesBD = await estudiantesResponse.json();
      setEstudiantes(estudiantesBD);
    } else {
      setEstudiantes([]);
    }
  } catch (err) {
    console.error(err);
    setError("No se pudo cargar los datos de cupos");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const datosFiltrados = cuposData.filter(item =>
    item.nombreProfesor.toLowerCase().includes(filtroProfesor.toLowerCase()) &&
    (filtroDia === "" || item.dia.toLowerCase().includes(filtroDia.toLowerCase()))
  );

  const handleAsignarEstudiante = (horario: CupoData) => {
    if (horario.cuposDisponibles <= 0) {
      alert("No hay cupos disponibles en este horario");
      return;
    }
    setHorarioSeleccionado(horario);
    setEstudianteSeleccionado("");
    setShowAsignarModal(true);
  };

  const confirmarAsignacion = async () => {
    if (!horarioSeleccionado || !estudianteSeleccionado) {
      alert("Por favor selecciona un estudiante");
      return;
    }

    try {
      const response = await fetch("/api/profesorCupos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProfesor: horarioSeleccionado.idProfesor,
          idHorario: horarioSeleccionado.idHorario,
          idEstudiante: estudianteSeleccionado
        })
      });

      if (!response.ok) throw new Error("Error asignando estudiante");

      alert("Estudiante asignado correctamente");
      setShowAsignarModal(false);
      fetchData();
    } catch (error) {
      alert("No se pudo asignar el estudiante");
      console.error(error);
    }
  };

  const handleQuitarEstudiante = async (horario: CupoData, idEstudiante: number) => {
    if (!confirm("¿Seguro que deseas quitar al estudiante del horario?")) return;

    try {
      const response = await fetch("/api/profesorCupos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProfesor: horario.idProfesor,
          idHorario: horario.idHorario,
          idEstudiante
        })
      });

      if (!response.ok) throw new Error("Error eliminando estudiante");

      alert("Estudiante eliminado correctamente");
      fetchData();
    } catch (error) {
      alert("No se pudo eliminar al estudiante");
      console.error(error);
    }
  };

  const estudiantesNoAsignados = estudiantes.filter(est =>
    !horarioSeleccionado?.estudiantesAsignados.some(asg => asg.idEstudiante === est.idEstudiante)
  );

  if (loading) {
    return (
      <DashboardShell role="ADMIN">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
            <p className="text-neutral-400">Cargando datos...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell role="ADMIN">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded"
            >
              Reintentar
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="ADMIN">
      <div className="w-full max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Cupos - Profesores</h1>
            <p className="text-neutral-400">
              Administra estudiantes por horario (Máximo {CUPOS_MAXIMOS})
            </p>
          </div>
          <button
            onClick={fetchData}
            className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold px-4 py-2 rounded"
          >
            Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-neutral-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Buscar profesor..."
              className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2"
              value={filtroProfesor}
              onChange={(e) => setFiltroProfesor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por día"
              className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2"
              value={filtroDia}
              onChange={(e) => setFiltroDia(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-neutral-900 rounded-xl p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-800 border-b border-neutral-700">
                <th className="px-4 py-3">Profesor</th>
                <th className="px-4 py-3">Día</th>
                <th className="px-4 py-3">Horario</th>
                <th className="px-4 py-3 text-center">Cupos</th>
                <th className="px-4 py-3">Estudiantes</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-neutral-400">
                    No hay horarios que coincidan
                  </td>
                </tr>
              ) : (
                datosFiltrados.map(item => (
                  <tr key={item.idHorario} className="border-b border-neutral-700 hover:bg-neutral-800">
                    <td className="px-4 py-3 font-medium">{item.nombreProfesor}</td>
                    <td className="px-4 py-3">{item.dia}</td>
                    <td className="px-4 py-3">{item.horario}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 rounded-full bg-neutral-700 text-sky-400">
                        {item.estudiantesAsignados.length}/{CUPOS_MAXIMOS}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.estudiantesAsignados.length === 0 ? (
                        <span className="text-neutral-400">Sin estudiantes</span>
                      ) : (
                        item.estudiantesAsignados.map(est => (
                          <div key={est.idEstudiante} className="flex justify-between items-center">
                            <span>{est.nombreCompleto}</span>
                            <button
                              onClick={() => handleQuitarEstudiante(item, est.idEstudiante)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleAsignarEstudiante(item)}
                        disabled={item.cuposDisponibles <= 0}
                        className={`px-4 py-2 rounded ${
                          item.cuposDisponibles > 0
                            ? "bg-sky-600 hover:bg-sky-500 text-white"
                            : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                        }`}
                      >
                        Asignar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showAsignarModal && horarioSeleccionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Asignar Estudiante</h3>

              <p className="text-neutral-400 mb-4">
                <strong>{horarioSeleccionado.dia} {horarioSeleccionado.horario}</strong><br />
                Profesor: <strong>{horarioSeleccionado.nombreProfesor}</strong><br />
              </p>

              <select
                className="w-full rounded bg-neutral-700 border border-neutral-600 px-4 py-2 mb-4"
                value={estudianteSeleccionado}
                onChange={(e) => setEstudianteSeleccionado(Number(e.target.value))}
              >
                <option value="">Selecciona un estudiante</option>
                {estudiantesNoAsignados.map(est => (
                  <option key={est.idEstudiante} value={est.idEstudiante}>
                    {est.nombreCompleto} - {est.cedula}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAsignarModal(false)}
                  className="bg-neutral-600 hover:bg-neutral-500 px-4 py-2 rounded text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAsignacion}
                  className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded text-white"
                  disabled={!estudianteSeleccionado}
                >
                  Asignar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
