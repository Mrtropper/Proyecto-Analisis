"use client";

import { useEffect, useState } from "react";

type Rol = { id: number; nombre: string; descripcion?: string };

export default function AssignRolesForm({ userIdFromTable, onAction }: { userIdFromTable?: number | null; onAction?: () => void }) {
  const [userId, setUserId] = useState("");
  const [allRoles, setAllRoles] = useState<Rol[]>([]);
  const [userRoles, setUserRoles] = useState<Rol[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  // sincronizar prop userIdFromTable con el input
  useEffect(() => {
    if (typeof userIdFromTable === "number") setUserId(String(userIdFromTable));
  }, [userIdFromTable]);

  async function fetchRoles() {
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      setAllRoles(data || []);
    } catch (e) {
      console.error(e);
    }
  }

  // fetchUserRoles y lógica de carga removidos por petición

  // hasRole logic removed (we no longer check userRoles in the form)
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");

  async function assignRole() {
    if (!userId) return setMsg("Ingresa primero el ID del usuario");
    if (!selectedRoleId) return setMsg("Selecciona un rol");
    setMsg(null);
    try {
      const res = await fetch("/api/roles/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), rolId: selectedRoleId }),
      });
      if (!res.ok) throw new Error("Error al asignar rol");
  setMsg("Rol asignado");
  try { onAction?.(); } catch {}
    } catch (e: any) {
      console.error(e);
      setMsg(e?.message || "Error al asignar rol");
    }
  }

  async function removeRole() {
    if (!userId) return setMsg("Ingresa primero el ID del usuario");
    if (!selectedRoleId) return setMsg("Selecciona un rol");
    setMsg(null);
    try {
      const res = await fetch("/api/roles/user/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), rolId: selectedRoleId }),
      });
      if (!res.ok) throw new Error("Error al remover rol");
  setMsg("Rol removido");
  try { onAction?.(); } catch {}
    } catch (e: any) {
      console.error(e);
      setMsg(e?.message || "Error al remover rol");
    }
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-6">
      <label className="block text-sm text-neutral-300">ID de usuario</label>
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 rounded border px-3 py-2 bg-neutral-800 text-white"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Ej: 1"
        />
        {/* Botón Cargar removido por petición */}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium">Roles</h3>
  {/* Estado de carga removido */}

        <div className="mt-2 flex gap-2 items-center">
          <select
            className="flex-1 rounded border px-3 py-2 bg-neutral-800 text-white"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value=""> Seleccione un rol </option>
            {allRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>

          <button onClick={assignRole} className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium">
            Asignar
          </button>

          <button onClick={removeRole} className="rounded bg-rose-600 px-3 py-2 text-sm font-medium">
            Remover
          </button>
        </div>

        {/* Sección 'Roles actuales' removida según petición del usuario */}
      </div>

      {msg && <p className="mt-4 text-sm text-neutral-200">{msg}</p>}
    </div>
  );
}
