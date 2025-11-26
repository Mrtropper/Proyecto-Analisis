"use client";

import { useEffect, useState, useCallback } from "react";

const API_URLS = {
  estudiantes: "/api/students",
  instrumentos: "/api/instrumento",
  prestamos: "/api/prestamoInstrumento",
};

interface ReporteItem {
  cedula: string | null;
  nombreCompleto: string | null;
  instrumento: string | null;
  fechaDevolucion: string | null;
}

export default function ReporteEstuInstru() {
  const [data, setData] = useState<ReporteItem[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar todos los datos (Reporte completo)
  const cargarReporteCompleto = useCallback(async () => {
    try {
      const resE = await fetch(API_URLS.estudiantes);
      const resI = await fetch(API_URLS.instrumentos);
      const resP = await fetch(`${API_URLS.prestamos}?simple=true`);

      const estudiantes = await resE.json();
      const instrumentos = await resI.json();
      const prestamos = await resP.json();

      combinarDatos(estudiantes, instrumentos, prestamos);
    } catch (error) {
      console.error("Error cargando reporte:", error);
    }
  }, []);

  // Función para unir Estudiantes + Instrumentos + Préstamos
  const combinarDatos = (
    estudiantes: any[],
    instrumentos: any[],
    prestamos: any[]
  ) => {
    const combinado: ReporteItem[] = prestamos.map((p: any) => {
      const est = estudiantes.find((e) => e.idEstudiante === p.idEstudiante);
      const inst = instrumentos.find((i) => i.idInstrumento === p.idInstrumento);

      return {
        cedula: est?.cedula ?? "—",
        nombreCompleto: est?.nombreCompleto ?? "—",
        instrumento: inst?.nombre ?? "—",
        fechaDevolucion: p.fechaEntrega?.split("T")[0] ?? "—",
      };
    });

    setData(combinado);
  };

  // Cargar reporte al iniciar
  useEffect(() => {
    cargarReporteCompleto();
  }, [cargarReporteCompleto]);

  // 🔎 Búsqueda desde API
  useEffect(() => {
    const buscar = async () => {
      const term = busqueda.trim().toLowerCase();

      // Si está vacío → cargar todos
      if (term === "") {
        cargarReporteCompleto();
        return;
      }

      try {
        let estudiantesFiltrados: any[] = [];
        let instrumentosFiltrados: any[] = [];
        let prestamosFiltrados: any[] = [];

        // Detectar si es numérico → cédula
        const isNumeric = /^\d+$/.test(term);

        // 1. Buscar estudiantes -----------------------
        if (isNumeric) {
          // Buscar por CÉDULA
          const res = await fetch(`${API_URLS.estudiantes}?cedula=${term}`);
          const data = await res.json();
          estudiantesFiltrados = Array.isArray(data) ? data : data ? [data] : [];
        } else {
          // Buscar por NOMBRE
          const res = await fetch(
            `${API_URLS.estudiantes}?nombreCompleto=${term}`
          );
          const data = await res.json();
          estudiantesFiltrados = Array.isArray(data) ? data : [];
        }

        // 2. Buscar instrumentos ----------------------
        const resInst = await fetch(`${API_URLS.instrumentos}?nombre=${term}`);
        const instrumentosData = await resInst.json();

        instrumentosFiltrados = Array.isArray(instrumentosData)
          ? instrumentosData
          : instrumentosData
          ? [instrumentosData]
          : [];

        // 3. Cargar todos los préstamos ----------------
        const resP = await fetch(`${API_URLS.prestamos}?simple=true`);
        const prestamos = await resP.json();

        // 4. Filtrar préstamos por estudiantes --------
        if (estudiantesFiltrados.length > 0) {
          const idsEstudiantes = estudiantesFiltrados.map(
            (e) => e.idEstudiante
          );

          prestamosFiltrados = prestamos.filter((p: any) =>
            idsEstudiantes.includes(p.idEstudiante)
          );
        }

        // 5. Filtrar préstamos por instrumentos -------
        if (instrumentosFiltrados.length > 0) {
          const idsInst = instrumentosFiltrados.map((i) => i.idInstrumento);

          const porInstrumento = prestamos.filter((p: any) =>
            idsInst.includes(p.idInstrumento)
          );

          prestamosFiltrados = [...prestamosFiltrados, ...porInstrumento];
        }

        // Evitar duplicados
        prestamosFiltrados = prestamosFiltrados.filter(
          (v, i, a) => a.findIndex((t) => t.idPrestamo === v.idPrestamo) === i
        );

        if (prestamosFiltrados.length === 0) {
          setData([]);
          return;
        }

        // Cargar datos completos
        const resE = await fetch(API_URLS.estudiantes);
        const estudiantesFull = await resE.json();

        const resI = await fetch(API_URLS.instrumentos);
        const instrumentosFull = await resI.json();

        // Unir todo
        combinarDatos(estudiantesFull, instrumentosFull, prestamosFiltrados);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setData([]);
      }
    };

    const t = setTimeout(buscar, 250);
    return () => clearTimeout(t);
  }, [busqueda, cargarReporteCompleto]);


  return (
    <div className="border border-gray-900 rounded p-6 w-full">
      <h2 className="text-xl font-semibold text-blue-400 mb-4">
        Reporte Estudiantes – Instrumentos
      </h2>

      {/* BARRA DE BÚSQUEDA */}
      <div className="mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por cédula, nombre o instrumento..."
          className="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700"
        />
      </div>

      {/* TABLA */}
      <div className="overflow-y-auto max-h-[450px] rounded">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-900 text-neutral-300">
            <tr>
              <th className="px-3 py-2 border border-gray-700">Cédula</th>
              <th className="px-3 py-2 border border-gray-700">
                Nombre Completo
              </th>
              <th className="px-3 py-2 border border-gray-700">Instrumento</th>
              <th className="px-3 py-2 border border-gray-700">
                Fecha Devolución
              </th>
            </tr>
          </thead>

          <tbody className="text-neutral-100">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800">
                  <td className="px-3 py-2 border border-gray-800">
                    {row.cedula}
                  </td>
                  <td className="px-3 py-2 border border-gray-800">
                    {row.nombreCompleto}
                  </td>
                  <td className="px-3 py-2 border border-gray-800">
                    {row.instrumento}
                  </td>
                  <td className="px-3 py-2 border border-gray-800">
                    {row.fechaDevolucion}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-3 border border-gray-800 text-neutral-400"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
