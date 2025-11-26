"use client";
import DashboardShell, { KPICard } from "@/app/dashboard/_components/DashBoardShell";



import React, { useState } from "react";

export default function ProfesorRegisterPage() {
  const [form, setForm] = useState({
    nombreCompleto: "",
    correo: "",
    telefono: "",
    jornada: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/profesores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al registrar profesor");
      setSuccess("Profesor registrado correctamente");
      setForm({ nombreCompleto: "", correo: "", telefono: "", jornada: "" });
    } catch (err) {
      setError("No se pudo registrar el profesor");
    } finally {
      setLoading(false);
    }
  };

  return (
     <DashboardShell role="ADMIN">
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-white">
      <section className="w-full max-w-md bg-neutral-900 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Registrar Profesor</h1>
        <a href="/dashboard/roles/admin" className="mb-6 inline-block text-sky-400 hover:underline">&larr; Volver al panel principal</a>
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
            className="mt-2 w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 rounded transition-colors"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
          {success && <p className="text-green-400 mt-2 text-center">{success}</p>}
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
        </form>
      </section>
    </main>
    </DashboardShell>
  );
}
