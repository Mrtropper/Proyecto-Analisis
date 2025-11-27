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

  type Horario = {
    idHorario: number;
    dia: string;
    horario: string;
  };

  type HorarioAsignado = {
    idProfesor: number;
    idHorario: number;
    horario: Horario;
  };

  // ----------------------------
  // ESTADOS
  // ----------------------------
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
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [horariosAsignados, setHorariosAsignados] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // ----------------------------
  // FETCH PROFESORES
  // ----------------------------
  const fetchProfesores = async () => {
    try {
      const res = await fetch("/api/profesores");

      if (!res.ok) throw new Error("Error " + res.status);

      const data = await res.json();

      if (Array.isArray(data)) {
        setProfesores(data);
      } else {
        setProfesores([]);
        setError("Formato incorrecto de profesores");
      }
    } catch {
      setError("No se pudo obtener la lista de profesores");
      setProfesores([]);
    }
  };

  // ----------------------------
  // FETCH HORARIOS
  // ----------------------------
  const fetchHorarios = async () => {
    try {
      const res = await fetch("/api/horario");

      if (!res.ok) throw new Error("Error al cargar horarios");

      const data = await res.json();
      setHorarios(data);
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------
  // FETCH HORARIOS ASIGNADOS
  // ----------------------------
  const fetchHorariosAsignados = async (id: number) => {
    try {
      const res = await fetch(`/api/profesorHorario?idProfesor=${id}`);
      const data = await res.json();

      const ids = data.map((a: HorarioAsignado) => a.idHorario);

      setHorariosAsignados(ids);
    } catch (e) {
      console.error("Error horarios asignados:", e);
    }
  };

  useEffect(() => {
    fetchProfesores();
    fetchHorarios();
  }, []);

  // ----------------------------
  // FORM CHANGES
  // ----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------------------
  // SELECCIÓN DE HORARIOS
  // ----------------------------
  const toggleHorario = (idHorario: number) => {
    setHorariosAsignados((prev) =>
      prev.includes(idHorario)
        ? prev.filter((h) => h !== idHorario)
        : [...prev, idHorario]
    );
  };

  // ----------------------------
  // SUBMIT DEL FORM
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let idProfesorCreado = editId;

      // 1. CREAR PROFESOR
      if (editId === null) {
        const res = await fetch("/api/profesores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Error al registrar profesor");

        const nuevo = await res.json();
        idProfesorCreado = nuevo.idProfesor;

        setSuccess("Profesor registrado correctamente");
      }

      // 2. EDITAR PROFESOR
      else {
        const res = await fetch("/api/profesores", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idProfesor: editId,
            ...form,
          }),
        });

        if (!res.ok) throw new Error("Error al editar profesor");

        setSuccess("Profesor editado correctamente");
      }

      // 3. ACTUALIZAR ASIGNACIÓN DE HORARIOS
      if (idProfesorCreado !== null) {
        // Obtener horarios actuales
        const actualesRes = await fetch(
          `/api/profesorHorario?idProfesor=${idProfesorCreado}`
        );
        const actuales = await actualesRes.json();
        const actualesIds = actuales.map((a: any) => a.idHorario);

        // Agregar nuevos
        for (const idHorario of horariosAsignados) {
          if (!actualesIds.includes(idHorario)) {
            await fetch("/api/profesorHorario", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idProfesor: idProfesorCreado,
                idHorario,
              }),
            });
          }
        }

        // Eliminar desmarcados
        for (const idHorario of actualesIds) {
          if (!horariosAsignados.includes(idHorario)) {
            await fetch("/api/profesorHorario", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idProfesor: idProfesorCreado,
                idHorario,
              }),
            });
          }
        }
      }

      // Reset
      setForm({ nombreCompleto: "", correo: "", telefono: "", jornada: "" });
      setHorariosAsignados([]);
      setEditId(null);
      fetchProfesores();
    } catch (e) {
      console.error(e);
      setError("Error al guardar el profesor");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // EDITAR PROFESOR
  // ----------------------------
  const handleEdit = async (p: Profesor) => {
    setForm({
      nombreCompleto: p.nombreCompleto,
      correo: p.correo ?? "",
      telefono: p.telefono ?? "",
      jornada: p.jornada ?? "",
    });

    setEditId(p.idProfesor);
    setSuccess("");
    setError("");

    await fetchHorariosAsignados(p.idProfesor);
  };

  // ----------------------------
  // ELIMINAR PROFESOR
  // ----------------------------
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este profesor?")) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/profesores", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idProfesor: id }),
      });

      if (!res.ok) throw new Error();

      setSuccess("Profesor eliminado correctamente");
      fetchProfesores();
    } catch {
      setError("No se pudo eliminar el profesor");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <DashboardShell role="ADMIN">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
        
        {/* FORMULARIO */}
        <section className="w-full lg:w-1/2 bg-neutral-900 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">
            {editId === null ? "Registrar Profesor" : "Editar Profesor"}
          </h1>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* CAMPOS */}
            <div>
              <label className="block mb-1 font-medium">Nombre completo</label>
              <input name="nombreCompleto" required value={form.nombreCompleto} onChange={handleChange}
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Correo</label>
              <input name="correo" type="email" required value={form.correo} onChange={handleChange}
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Teléfono</label>
              <input name="telefono" required value={form.telefono} onChange={handleChange}
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Jornada</label>
              <input name="jornada" required value={form.jornada} onChange={handleChange}
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-4 py-2" />
            </div>

            {/* ----------------------------- */}
            {/* ASIGNAR HORARIOS */}
            {/* ----------------------------- */}
            <div>
              <label className="block mb-2 font-semibold">Asignar horarios</label>

              <div className="grid grid-cols-2 gap-2">
                {horarios.map((h) => (
                  <label key={h.idHorario} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={horariosAsignados.includes(h.idHorario)}
                      onChange={() => toggleHorario(h.idHorario)}
                    />
                    {h.dia} — {h.horario}
                  </label>
                ))}
              </div>
            </div>

            {/* BOTONES */}
            <button type="submit" disabled={loading}
              className={`mt-2 w-full ${editId === null ? "bg-sky-600" : "bg-yellow-600"} text-white py-2 rounded`}>
              {loading ? "Guardando..." : editId === null ? "Registrar" : "Guardar Cambios"}
            </button>

            {editId !== null && (
              <button type="button"
                className="mt-2 w-full bg-neutral-700 text-white py-2 rounded"
                onClick={() => {
                  setEditId(null);
                  setForm({ nombreCompleto: "", correo: "", telefono: "", jornada: "" });
                  setHorariosAsignados([]);
                }}>
                Cancelar edición
              </button>
            )}

            {success && <p className="text-green-400 text-center">{success}</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}
          </form>
        </section>

        {/* LISTA DE PROFESORES */}
        <section className="w-full lg:w-1/2 bg-neutral-900 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Lista de Profesores</h2>

          <table className="w-full">
            <thead>
              <tr className="bg-neutral-800">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Correo</th>
                <th className="px-3 py-2">Teléfono</th>
                <th className="px-3 py-2">Jornada</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {profesores.map((p) => (
                <tr key={p.idProfesor} className="bg-neutral-800">
                  <td className="px-3 py-2">{p.idProfesor}</td>
                  <td className="px-3 py-2">{p.nombreCompleto}</td>
                  <td className="px-3 py-2">{p.correo}</td>
                  <td className="px-3 py-2">{p.telefono}</td>
                  <td className="px-3 py-2">{p.jornada}</td>

                  <td className="px-3 py-2 flex gap-2">
                    <button onClick={() => handleEdit(p)}
                      className="bg-yellow-500 px-3 py-1 rounded">Editar</button>
                    <button onClick={() => handleDelete(p.idProfesor)}
                      className="bg-red-600 px-3 py-1 rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardShell>
  );
}
