"use client";

import { useEffect, useState } from "react";

type Student = { id: number; nombre: string; edad: number; instrumento: string; profesor: string };

export default function StudentsTable({ refreshCounter }: { refreshCounter?: number }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  // cliente: determinar si usuario actual es ADMIN para mostrar acciones
  // Normaliza distintas formas de representar roles a string[] (reusa lógica parecida a LoginForm)
  function extractRoleNames(anyRoles: any): string[] {
    if (!anyRoles) return [];
    if (Array.isArray(anyRoles)) {
      return anyRoles
        .map((r) => (typeof r === 'string' ? r : r?.nombre ?? r?.rol?.nombre ?? ''))
        .filter(Boolean)
        .map((s) => String(s));
    }
    const maybe = anyRoles.roles ?? anyRoles.user?.roles ?? [];
    if (maybe) return extractRoleNames(maybe);
    return [];
  }

  const isAdmin = (() => {
    try {
      if (typeof window === 'undefined') return false;
      const raw = sessionStorage.getItem('user');
      if (!raw) return false;
      const u = JSON.parse(raw);
      const roles = extractRoleNames(u);
      return roles.map(r => r.toUpperCase()).includes('ADMIN');
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (typeof refreshCounter === 'number') fetchStudents();
  }, [refreshCounter]);

  async function fetchStudents() {
    try {
      setLoading(true);
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  async function removeStudent(id: number) {
    try {
      const userRaw = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
      const rolesHeader = userRaw ? (JSON.parse(userRaw)?.roles || []).join(',') : '';

      const res = await fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-user-roles': rolesHeader },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al eliminar estudiante');
      fetchStudents();
    } catch (e) {
      console.error(e);
      alert('No se pudo eliminar el estudiante');
    }
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
      <h3 className="text-sm font-medium mb-3">Estudiantes</h3>
      {loading ? (
        <p className="text-sm text-neutral-400">Cargando estudiantes...</p>
      ) : (
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-neutral-400">
                <th className="pb-2">ID</th>
                <th className="pb-2">Nombre</th>
                <th className="pb-2">Edad</th>
                <th className="pb-2">Instrumento</th>
                <th className="pb-2">Profesor</th>
                <th className="pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-t border-neutral-800 hover:bg-neutral-950/30">
                  <td className="py-2">{s.id}</td>
                  <td className="py-2">{s.nombre}</td>
                  <td className="py-2">{s.edad}</td>
                  <td className="py-2">{s.instrumento}</td>
                  <td className="py-2">{s.profesor}</td>
                  <td className="py-2">
                    {isAdmin ? (
                      <button onClick={() => removeStudent(s.id)} className="rounded bg-rose-600 px-3 py-1 text-sm font-medium">
                        Eliminar
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-500">Solo admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
