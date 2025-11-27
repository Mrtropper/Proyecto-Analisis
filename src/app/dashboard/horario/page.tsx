"use client";
import React, { useState, useEffect } from "react";
import DashboardShell from "../_components/DashBoardShell";

type Horario = {
  idHorario: number;
  dia: string;
  horario: string;
};

export default function HorarioPage() {
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    dia: "",
    horario: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [search, setSearch] = useState("");

  // Obtener lista de horarios al cargar y tras agregar
  const fetchHorarios = async () => {
    try {
      const res = await fetch("/api/horario");
      const data = await res.json();
      // Asegurar que data sea un array
      setHorarios(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudo obtener la lista de horarios");
      setHorarios([]); // En caso de error, establecer array vacío
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  // Asegurar que horarios sea siempre un array antes de usar filter
  const filteredHorarios = Array.isArray(horarios) ? horarios.filter(h =>
    h.idHorario?.toString().includes(search) ||
    h.dia?.toLowerCase().includes(search.toLowerCase()) ||
    h.horario?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSuccess("");
  setError("");
  try {
    if (editId === null) {
      // Crear nuevo horario - SIN idProfesor
      const res = await fetch("/api/horario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dia: form.dia,
          horario: form.horario,
          // idProfesor eliminado
        }),
      });
      if (!res.ok) throw new Error("No se pudo registrar el horario");
      setSuccess("Horario registrado correctamente");
    } else {
      // Editar horario existente - SIN idProfesor
      const res = await fetch(`/api/horario/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dia: form.dia,
          horario: form.horario,
          // idProfesor eliminado
        }),
      });
      if (!res.ok) throw new Error("No se pudo editar el horario");
      setSuccess("Horario editado correctamente");
      setEditId(null);
    }
    setForm({ dia: "", horario: "" });
    fetchHorarios();
  } catch {
    setError(editId === null ? "No se pudo registrar el horario" : "No se pudo editar el horario");
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (h: Horario) => {
    setForm({
      dia: h.dia,
      horario: h.horario,
    });
    setEditId(h.idHorario);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch(`/api/horario/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar el horario");
      setSuccess("Horario eliminado correctamente");
      fetchHorarios();
    } catch {
      setError("No se pudo eliminar el horario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell role="ADMIN">
      <div className="flex flex-row gap-8 w-full max-w-5xl mx-auto">
        {/* Formulario */}
        <section className="flex-1 bg-neutral-900 rounded-xl shadow-lg p-8 min-w-[320px]">
          <h2 className="text-2xl font-bold mb-4">{editId === null ? "Agregar Horario" : "Editar Horario"}</h2>
          <p className="mb-4 text-neutral-400">Ingrese los datos del horario</p>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="dia" className="block mb-1 font-medium">Día</label>
              <input
                id="dia"
                name="dia"
                type="text"
                placeholder="Ej: Lunes"
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
                value={form.dia}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="horario" className="block mb-1 font-medium">Horario</label>
              <input
                id="horario"
                name="horario"
                type="text"
                placeholder="Ej: 08:00 - 10:00"
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
                value={form.horario}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className={`mt-2 w-full ${editId === null ? "bg-sky-600 hover:bg-sky-500" : "bg-yellow-600 hover:bg-yellow-500"} text-white font-semibold py-2 rounded transition-colors`}
              disabled={loading}
            >
              {loading ? (editId === null ? "Registrando..." : "Editando...") : (editId === null ? "Guardar Horario" : "Editar Horario")}
            </button>
            {editId !== null && (
              <button
                type="button"
                className="mt-2 w-full bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 rounded transition-colors"
                onClick={() => { setEditId(null); setForm({ dia: "", horario: "" }); setSuccess(""); setError(""); }}
              >
                Cancelar edición
              </button>
            )}
            {success && <p className="text-green-400 mt-2 text-center">{success}</p>}
            {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
          </form>
          <a href="/dashboard" className="mt-6 inline-block text-sky-400 hover:underline">&larr; Volver a la página anterior</a>
        </section>
        {/* Tabla */}
        <section className="flex-1 bg-neutral-900 rounded-xl shadow-lg p-8 min-w-[400px]">
          <h2 className="text-2xl font-bold mb-4">Lista de Horarios</h2>
          <input
            type="text"
            placeholder="🔍 Buscar por ID, día u horario..."
            className="mb-4 w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-neutral-800">
                  <th className="px-3 py-2 rounded-tl-lg">ID</th>
                  <th className="px-3 py-2">Día</th>
                  <th className="px-3 py-2">Horario</th>
                  <th className="px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredHorarios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-neutral-400">
                      {Array.isArray(horarios) && horarios.length === 0 ? "No hay horarios registrados." : "Cargando..."}
                    </td>
                  </tr>
                ) : (
                  filteredHorarios.map(h => (
                    <tr key={h.idHorario} className="bg-neutral-800 hover:bg-neutral-700">
                      <td className="px-3 py-2 rounded-l-lg">{h.idHorario}</td>
                      <td className="px-3 py-2">{h.dia}</td>
                      <td className="px-3 py-2">{h.horario}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-1 rounded"
                          onClick={() => handleEdit(h)}
                          disabled={loading}
                        >Editar</button>
                        <button
                          className="bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded"
                          onClick={() => handleDelete(h.idHorario)}
                          disabled={loading}
                        >Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}