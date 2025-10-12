"use client";

import { useEffect, useState } from "react";

type UserRow = { id: number; username?: string | null; email?: string | null; roles: Array<{ id: number; nombre: string }> };

export default function UsersTable({ onSelect, refreshCounter }: { onSelect: (id: number) => void; refreshCounter?: number }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Si se recibe refreshCounter, recargar lista
    if (typeof refreshCounter === 'number') fetchUsers();
  }, [refreshCounter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
      <h3 className="text-sm font-medium mb-3">Usuarios</h3>
      {loading ? (
        <p className="text-sm text-neutral-400">Cargando usuarios...</p>
      ) : (
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-neutral-400">
                <th className="pb-2">ID</th>
                <th className="pb-2">Usuario</th>
                <th className="pb-2">Roles</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-neutral-800 hover:bg-neutral-950/30 cursor-pointer" onClick={() => onSelect(u.id)}>
                  <td className="py-2">{u.id}</td>
                  <td className="py-2">{u.username ?? u.email ?? '-'}</td>
                  <td className="py-2">{u.roles.map(r => r.nombre).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
