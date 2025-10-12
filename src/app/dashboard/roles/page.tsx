"use client";

import { useState } from "react";
import AssignRolesForm from "@/app/dashboard/roles/AssignRolesForm";
import UsersTable from "@/app/dashboard/roles/UsersTable";

export default function RolesPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold">Asignación de Roles</h1>
      <p className="mt-2 text-sm text-neutral-300">Selecciona un usuario y gestiona sus roles.</p>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <AssignRolesForm userIdFromTable={selectedUserId} onAction={() => setRefreshCounter(c => c + 1)} />
        </div>

        <div className="col-span-2">
          <UsersTable onSelect={(id) => setSelectedUserId(id)} refreshCounter={refreshCounter} />
        </div>
      </div>
    </main>
  );
}
