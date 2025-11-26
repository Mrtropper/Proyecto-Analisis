"use client";

import { useState } from "react";
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import AssignRolesForm from "@/app/dashboard/roles/AssignRolesForm";
import UsersTable from "@/app/dashboard/roles/UsersTable";

export default function RolesPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  return (
    <DashboardShell role="ADMIN">
     <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 mb-6 shadow-lg">
     <h1 className="text-2xl font-bold text-white">Asignación de Roles</h1>
     <p className="mt-2 text-sm text-neutral-300">
       Selecciona un usuario y gestiona sus roles.
      </p>
    </div>


      {/* ⬇⬇⬇ CONTENEDOR ARREGLADO */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-1 items-start">
        <div className="md:col-span-1">
          <AssignRolesForm
            userIdFromTable={selectedUserId}
            onAction={() => setRefreshCounter((c) => c + 1)}
          />
        </div>

        <div className="md:col-span-2">
          <UsersTable
            onSelect={(id) => setSelectedUserId(id)}
            refreshCounter={refreshCounter}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
