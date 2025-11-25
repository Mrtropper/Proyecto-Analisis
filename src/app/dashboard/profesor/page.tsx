"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "../_components/DashBoardShell";

export default function ProfesoresPage() {
  type Profesor = {
    idProfesor: number;
    nombreCompleto: string;
    correo: string;
    telefono: string;
    jornada: string;
    activo?: string;
  };

  const [form, setForm] = useState({
    nombreCompleto: "",
    correo: "",
    telefono: "",
    jornada: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchProfesores = async () => {
    try {
      const res = await fetch("/api/profesores");
      const data = await res.json();
      setProfesores(data);
    } catch {
      setError("No se pudo obtener la lista de profesores");
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      if (editId === null) {
        // Crear nuevo profesor
        const res = await fetch("/api/profesores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al registrar profesor");
        setSuccess("Profesor registrado correctamente");
      } else {
        // Editar profesor existente - USAR PUT en lugar de PATCH
        const res = await fetch("/api/profesores", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idProfesor: editId,
            ...form
          }),
        });
        if (!res.ok) throw new Error("Error al editar profesor");
        setSuccess("Profesor editado correctamente");
        setEditId(null);
      }
      setForm({ nombreCompleto: "", correo: "", telefono: "", jornada: "" });
      fetchProfesores();
    } catch {
      setError(editId === null ? "No se pudo registrar el profesor" : "No se pudo editar el profesor");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Profesor) => {
    setForm({
      nombreCompleto: p.nombreCompleto,
      correo: p.correo ?? "",
      telefono: p.telefono ?? "",
      jornada: p.jornada ?? "",
    });
    setEditId(p.idProfesor);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este profesor?")) {
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // USAR DELETE con el ID en el body
      const res = await fetch("/api/profesores", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idProfesor: id }),
      });
      if (!res.ok) throw new Error("No se pudo eliminar el profesor");
      setSuccess("Profesor eliminado correctamente");
      fetchProfesores();
    } catch {
      setError("No se pudo eliminar el profesor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell role="ADMIN">
      {/* Contenedor principal con flex para lado a lado */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
        
        {/* Formulario - Lado izquierdo */}
        <section className="w-full lg:w-1/2 bg-neutral-900 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">{editId === null ? "Registrar Profesor" : "Editar Profesor"}</h1>
          <a href="/dashboard" className="mb-6 inline-block text-sky-400 hover:underline">&larr; Volver al panel principal</a>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombreCompleto" className="block mb-1 font-medium">Nombre completo</label>
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                placeholder="Ej: Juan Pérez"
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
                value={form.nombreCompleto}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="correo" className="block mb-1 font-medium">Correo</label>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="profesor@dominio.com"
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
                value={form.correo}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block mb-1 font-medium">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                placeholder="Ej: 123456789"
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
                value={form.telefono}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="jornada" className="block mb-1 font-medium">Jornada</label>
              <input
                id="jornada"
                name="jornada"
                type="text"
                placeholder="Ej: Mañana"
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
                value={form.jornada}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className={`mt-2 w-full ${editId === null ? "bg-sky-600 hover:bg-sky-500" : "bg-yellow-600 hover:bg-yellow-500"} text-white font-semibold py-2 rounded transition-colors`}
              disabled={loading}
            >
              {loading ? (editId === null ? "Registrando..." : "Editando...") : (editId === null ? "Registrar" : "Editar Profesor")}
            </button>
            {editId !== null && (
              <button
                type="button"
                className="mt-2 w-full bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 rounded transition-colors"
                onClick={() => { setEditId(null); setForm({ nombreCompleto: "", correo: "", telefono: "", jornada: "" }); setSuccess(""); setError(""); }}
              >
                Cancelar edición
              </button>
            )}
            {success && <p className="text-green-400 mt-2 text-center">{success}</p>}
            {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
          </form>
          <a href="/dashboard" className="mt-6 inline-block text-sky-400 hover:underline">&larr; Volver al panel principal</a>
        </section>

        {/* Lista de profesores - Lado derecho */}
        <section className="w-full lg:w-1/2 bg-neutral-900 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Lista de Profesores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-neutral-800">
                  <th className="px-3 py-2 rounded-tl-lg">ID</th>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Correo</th>
                  <th className="px-3 py-2">Teléfono</th>
                  <th className="px-3 py-2">Jornada</th>
                  <th className="px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-neutral-400">No hay profesores registrados.</td>
                  </tr>
                ) : (
                  profesores.map(p => (
                    <tr key={p.idProfesor} className="bg-neutral-800 hover:bg-neutral-700">
                      <td className="px-3 py-2 rounded-l-lg">{p.idProfesor}</td>
                      <td className="px-3 py-2">{p.nombreCompleto}</td>
                      <td className="px-3 py-2">{p.correo}</td>
                      <td className="px-3 py-2">{p.telefono}</td>
                      <td className="px-3 py-2">{p.jornada}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-1 rounded"
                          onClick={() => handleEdit(p)}
                          disabled={loading}
                        >Editar</button>
                        <button
                          className="bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded"
                          onClick={() => handleDelete(p.idProfesor)}
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