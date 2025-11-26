"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";

type Profesor = {
  idProfesor: number;
  nombreCompleto: string;
};

type Horario = {
  idHorario: number;
  idProfesor: number;
  dia: string;
  horario: string;
};

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

      // Obtener profesores
      const profesoresResponse = await fetch("/api/profesores");
      if (!profesoresResponse.ok) throw new Error("Error al cargar profesores");
      const profesores: Profesor[] = await profesoresResponse.json();

      // Obtener horarios
      const horariosResponse = await fetch("/api/horario");
      if (!horariosResponse.ok) throw new Error("Error al cargar horarios");
      const horarios: Horario[] = await horariosResponse.json();

      // Obtener estudiantes (simulado por ahora)
      const estudiantesMock: Estudiante[] = [
        { idEstudiante: 1, nombreCompleto: "Ana García", cedula: "001-1234567-8" },
        { idEstudiante: 2, nombreCompleto: "Luis Martínez", cedula: "001-7654321-9" },
        { idEstudiante: 3, nombreCompleto: "María Rodríguez", cedula: "001-1112233-4" },
        { idEstudiante: 4, nombreCompleto: "Carlos López", cedula: "001-4445566-7" },
        { idEstudiante: 5, nombreCompleto: "Sofía Hernández", cedula: "001-8889990-1" },
        { idEstudiante: 6, nombreCompleto: "Diego Pérez", cedula: "001-2223344-5" },
        { idEstudiante: 7, nombreCompleto: "Elena Castro", cedula: "001-6677889-0" },
        { idEstudiante: 8, nombreCompleto: "Javier Ruiz", cedula: "001-3334455-6" },
      ];
      setEstudiantes(estudiantesMock);

      // Combinar datos para cupos
      const datosCupos: CupoData[] = horarios.map(horario => {
        const profesor = profesores.find(p => p.idProfesor === horario.idProfesor);
        // Simular estudiantes asignados (en una app real esto vendría de la BD)
        const estudiantesAsignados = estudiantesMock.slice(0, Math.floor(Math.random() * 8));
        
        return {
          idHorario: horario.idHorario,
          idProfesor: horario.idProfesor,
          nombreProfesor: profesor?.nombreCompleto || "Profesor no encontrado",
          dia: horario.dia,
          horario: horario.horario,
          estudiantesAsignados,
          cuposDisponibles: CUPOS_MAXIMOS - estudiantesAsignados.length
        };
      });

      setCuposData(datosCupos);
    } catch (err) {
      setError("No se pudo cargar los datos de cupos");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar datos
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

  const handleQuitarEstudiante = (horario: CupoData, idEstudiante: number) => {
    if (confirm(`¿Estás seguro de quitar a este estudiante del horario?`)) {
      // En una app real, aquí harías la llamada a la API para quitar el estudiante
      const estudiante = estudiantes.find(e => e.idEstudiante === idEstudiante);
      alert(`Estudiante ${estudiante?.nombreCompleto} quitado del horario`);
      fetchData(); // Recargar datos
    }
  };

  const confirmarAsignacion = () => {
    if (!horarioSeleccionado || !estudianteSeleccionado) {
      alert("Por favor selecciona un estudiante");
      return;
    }

    // En una app real, aquí harías la llamada a la API para asignar el estudiante
    const estudiante = estudiantes.find(e => e.idEstudiante === estudianteSeleccionado);
    alert(`Estudiante ${estudiante?.nombreCompleto} asignado al horario de ${horarioSeleccionado.nombreProfesor}`);
    
    setShowAsignarModal(false);
    fetchData(); // Recargar datos
  };

  const estudiantesNoAsignados = estudiantes.filter(estudiante =>
    !horarioSeleccionado?.estudiantesAsignados.some(e => e.idEstudiante === estudiante.idEstudiante)
  );

  if (loading) {
    return (
      <DashboardShell role="ADMIN">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
            <p className="text-neutral-400">Cargando datos de cupos...</p>
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
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded transition-colors"
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
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestión de Cupos - Profesores</h1>
              <p className="text-neutral-400">
                Asigna y gestiona estudiantes en los horarios de profesores (Máximo {CUPOS_MAXIMOS} cupos por horario)
              </p>
            </div>
            <button
              onClick={fetchData}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold px-4 py-2 rounded transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-neutral-900 rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Filtrar por Profesor</label>
              <input
                type="text"
                placeholder="Buscar profesor..."
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                value={filtroProfesor}
                onChange={(e) => setFiltroProfesor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filtrar por Día</label>
              <input
                type="text"
                placeholder="Ej: Lunes, Martes..."
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                value={filtroDia}
                onChange={(e) => setFiltroDia(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabla de cupos */}
        <div className="bg-neutral-900 rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-4 py-3 font-semibold">Profesor</th>
                  <th className="px-4 py-3 font-semibold">Día</th>
                  <th className="px-4 py-3 font-semibold">Horario</th>
                  <th className="px-4 py-3 font-semibold text-center">Cupos</th>
                  <th className="px-4 py-3 font-semibold">Estudiantes Asignados</th>
                  <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-neutral-400">
                      No hay horarios que coincidan con los filtros
                    </td>
                  </tr>
                ) : (
                  datosFiltrados.map((item) => (
                    <tr 
                      key={item.idHorario}
                      className="border-b border-neutral-700 hover:bg-neutral-800 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{item.nombreProfesor}</p>
                        <p className="text-xs text-neutral-400">ID: {item.idProfesor}</p>
                      </td>
                      <td className="px-4 py-3">{item.dia}</td>
                      <td className="px-4 py-3">{item.horario}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.cuposDisponibles > 5 
                            ? "bg-green-500/20 text-green-400"
                            : item.cuposDisponibles > 0
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {item.estudiantesAsignados.length}/{CUPOS_MAXIMOS}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          {item.estudiantesAsignados.length === 0 ? (
                            <span className="text-neutral-400 text-sm">Sin estudiantes asignados</span>
                          ) : (
                            <div className="space-y-1">
                              {item.estudiantesAsignados.map(estudiante => (
                                <div key={estudiante.idEstudiante} className="flex justify-between items-center text-sm">
                                  <span>{estudiante.nombreCompleto}</span>
                                  <button
                                    onClick={() => handleQuitarEstudiante(item, estudiante.idEstudiante)}
                                    className="text-red-400 hover:text-red-300 ml-2"
                                    title="Quitar estudiante"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleAsignarEstudiante(item)}
                          disabled={item.cuposDisponibles <= 0}
                          className={`px-4 py-2 rounded transition-colors ${
                            item.cuposDisponibles > 0
                              ? "bg-sky-600 hover:bg-sky-500 text-white"
                              : "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                          }`}
                        >
                          Asignar Estudiante
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal para asignar estudiante */}
        {showAsignarModal && horarioSeleccionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Asignar Estudiante</h3>
              <p className="text-neutral-400 mb-4">
                Horario: <strong>{horarioSeleccionado.dia} {horarioSeleccionado.horario}</strong><br />
                Profesor: <strong>{horarioSeleccionado.nombreProfesor}</strong><br />
                Cupos disponibles: <strong>{horarioSeleccionado.cuposDisponibles}/{CUPOS_MAXIMOS}</strong>
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Seleccionar Estudiante</label>
                <select
                  className="w-full rounded bg-neutral-700 border border-neutral-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={estudianteSeleccionado}
                  onChange={(e) => setEstudianteSeleccionado(Number(e.target.value))}
                >
                  <option value="">Selecciona un estudiante</option>
                  {estudiantesNoAsignados.map(estudiante => (
                    <option key={estudiante.idEstudiante} value={estudiante.idEstudiante}>
                      {estudiante.nombreCompleto} - {estudiante.cedula}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAsignarModal(false)}
                  className="bg-neutral-600 hover:bg-neutral-500 text-white font-semibold px-4 py-2 rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAsignacion}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded transition-colors"
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