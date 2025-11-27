"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";

type Profesor = {
  idProfesor: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  jornada: string;
  activo: string;
};

type Horario = {
  idHorario: number;
  dia: string;
  horario: string;
};

type ProfesorHorario = {
  idProfesor: number;
  idHorario: number;
};

type ProfesorHorarioData = {
  idProfesor: number;
  nombreCompleto: string;
  dia: string;
  horario: string;
  cupos: number;
};

export default function HorarioProfesorReport() {
  const [data, setData] = useState<ProfesorHorarioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Obtener profesores
      const profesoresResponse = await fetch("/api/profesores");
      if (!profesoresResponse.ok) throw new Error("Error al cargar profesores");
      const profesores: Profesor[] = await profesoresResponse.json();

      // 2. Obtener horarios
      const horariosResponse = await fetch("/api/horario");
      if (!horariosResponse.ok) throw new Error("Error al cargar horarios");
      const horarios: Horario[] = await horariosResponse.json();

      // 3. Obtener tabla intermedia ProfesorHorario
      const profesorHorarioResponse = await fetch("/api/profesorHorario");
      if (!profesorHorarioResponse.ok)
        throw new Error("Error al cargar asignaciones");
      const profesorHorario: ProfesorHorario[] =
        await profesorHorarioResponse.json();

      // 4. Construir el reporte combinando tablas
      const reportData: ProfesorHorarioData[] = [];

      profesores.forEach((profesor) => {
        const asignaciones = profesorHorario.filter(
          (ph) => ph.idProfesor === profesor.idProfesor
        );

        if (asignaciones.length > 0) {
          asignaciones.forEach((asig) => {
            const horario = horarios.find(
              (h) => h.idHorario === asig.idHorario
            );

            if (horario) {
              reportData.push({
                idProfesor: profesor.idProfesor,
                nombreCompleto: profesor.nombreCompleto,
                dia: horario.dia,
                horario: horario.horario,
                cupos: 15,
              });
            }
          });
        } else {
          // Si no tiene horarios asignados
          reportData.push({
            idProfesor: profesor.idProfesor,
            nombreCompleto: profesor.nombreCompleto,
            dia: "No asignado",
            horario: "No asignado",
            cupos: 0,
          });
        }
      });

      setData(reportData);
    } catch (err) {
      setError("No se pudo cargar el reporte de horarios y profesores");
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleCuposClick = (item: ProfesorHorarioData) => {
    alert(
      `Cupos para:\n${item.nombreCompleto}\n${item.dia} - ${item.horario}\nCupos disponibles: ${item.cupos}/15`
    );
  };

  const handleRefresh = () => {
    fetchReportData();
  };

  if (loading) {
    return (
      <DashboardShell role="ADMIN">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
            <p className="text-neutral-400">Cargando reporte...</p>
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
              onClick={handleRefresh}
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
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Reporte Horario - Profesor</h1>
              <p className="text-neutral-400">
                Visualización de profesores y sus horarios asignados - Cupos máximos: 15 por horario
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold px-4 py-2 rounded transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-neutral-900 rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Profesor</th>
                  <th className="px-4 py-3 font-semibold">Día</th>
                  <th className="px-4 py-3 font-semibold">Horario</th>
                  <th className="px-4 py-3 font-semibold text-center">Cupos</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-neutral-400">
                      No hay registros disponibles
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={`${item.idProfesor}-${item.dia}-${index}`}
                      className="border-b border-neutral-700 hover:bg-neutral-800 transition-colors"
                    >
                      <td className="px-4 py-3 text-neutral-400">{item.idProfesor}</td>
                      <td className="px-4 py-3 font-medium">{item.nombreCompleto}</td>
                      <td className="px-4 py-3">{item.dia}</td>
                      <td className="px-4 py-3">{item.horario}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleCuposClick(item)}
                          className={`font-semibold px-4 py-2 rounded min-w-[80px] transition-colors ${
                            item.cupos > 0
                              ? "bg-sky-600 hover:bg-sky-500 text-white"
                              : "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                          }`}
                          disabled={item.cupos === 0}
                        >
                          {item.cupos}/15
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          <div className="mt-6 pt-6 border-t border-neutral-700 text-neutral-400 text-sm flex gap-8 flex-wrap">
            <div><strong>Total de registros:</strong> {data.length}</div>
            <div><strong>Profesores únicos:</strong> {new Set(data.map(item => item.idProfesor)).size}</div>
            <div><strong>Horarios con cupos:</strong> {data.filter(item => item.cupos > 0).length}</div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
