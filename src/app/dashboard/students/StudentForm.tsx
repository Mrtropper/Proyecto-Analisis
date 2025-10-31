"use client";

import { useState } from "react";

export default function StudentForm({ onCreated }: { onCreated?: () => void }) {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState<number | "">("");
  const [instrumento, setInstrumento] = useState("");
  const [profesor, setProfesor] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  // determinar si el usuario actual es ADMIN (cliente, provisional)
  const userRaw = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const parsedUser = (() => {
    try {
      return userRaw ? JSON.parse(userRaw) : null;
    } catch {
      return null;
    }
  })();

  // Normaliza distintas formas de representar roles a string[]
  function extractRoleNames(anyRoles: any): string[] {
    if (!anyRoles) return [];
    if (Array.isArray(anyRoles)) {
      return anyRoles
        .map((r) => (typeof r === 'string' ? r : r?.nombre ?? r?.rol?.nombre ?? ''))
        .filter(Boolean)
        .map((s) => String(s));
    }
    // si vino un objeto { roles: [...] } u otra forma
    const maybe = anyRoles.roles ?? anyRoles.user?.roles ?? [];
    if (maybe) return extractRoleNames(maybe);
    return [];
  }

  const isAdmin = (() => {
    try {
      const roles = extractRoleNames(parsedUser);
      return roles.map(r => String(r).toUpperCase()).includes('ADMIN');
    } catch {
      return false;
    }
  })();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    // Validaciones simples
    if (!nombre.trim()) return setMsg("El nombre es requerido");
    if (edad === "" || Number.isNaN(Number(edad))) return setMsg("La edad es requerida");
    const edadNum = Number(edad);
    if (!Number.isInteger(edadNum) || edadNum < 4 || edadNum > 17)
      return setMsg("La edad debe ser un número entero entre 4 y 17");
    if (!instrumento.trim()) return setMsg("El instrumento es requerido");
    if (!profesor.trim()) return setMsg("El profesor es requerido");

    try {
      // enviar roles actuales en header (provisional hasta tener auth en servidor)
      const userRaw = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
      const rolesHeader = userRaw ? (JSON.parse(userRaw)?.roles || []).join(',') : '';

      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-roles': rolesHeader },
        body: JSON.stringify({ nombre: nombre.trim(), edad: Number(edad), instrumento: instrumento.trim(), profesor: profesor.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Error al crear estudiante');
      }
      setNombre(''); setEdad(''); setInstrumento(''); setProfesor('');
      setMsg('Estudiante creado');
      onCreated?.();
    } catch (e: any) {
      console.error(e);
      setMsg(e?.message || 'Error');
    }
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900/60 p-6">
      <h3 className="text-sm font-medium">Crear Estudiante</h3>
      {isAdmin ? (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-neutral-300">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
          </div>

          <div>
            <label className="block text-sm text-neutral-300">Edad</label>
            <input
              type="number"
              min={4}
              max={17}
              value={edad as any}
              onChange={(e) => setEdad(e.target.value ? Number(e.target.value) : "")}
              className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white"
            />
            <p className="text-xs text-neutral-500 mt-1">Edad permitida: 4 a 17 años.</p>
          </div>

          <div>
            <label className="block text-sm text-neutral-300">Instrumento</label>
            <input value={instrumento} onChange={(e) => setInstrumento(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
          </div>

          <div>
            <label className="block text-sm text-neutral-300">Profesor</label>
            <input value={profesor} onChange={(e) => setProfesor(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium">Crear</button>
          </div>

          {msg && <p className="mt-2 text-sm text-neutral-200">{msg}</p>}
        </form>
      ) : (
        <p className="mt-4 text-sm text-neutral-400">Solo administradores pueden crear estudiantes.</p>
      )}
    </div>
  );
}
