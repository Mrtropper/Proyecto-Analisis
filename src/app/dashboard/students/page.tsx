"use client";

import { useState } from "react";
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import StudentsTable from "@/app/dashboard/students/StudentsTable";
import StudentForm from "@/app/dashboard/students/StudentForm";

export default function StudentsPage() {
  const [refreshCounter, setRefreshCounter] = useState(0);

  return (
    <DashboardShell role="ADMIN">
      <h1 className="text-2xl font-bold">Gestión de Estudiantes</h1>
      <p className="mt-2 text-sm text-neutral-300">Crea y administra estudiantes (nombre, edad, instrumento, profesor).</p>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <StudentForm onCreated={() => setRefreshCounter(c => c + 1)} />
        </div>

        <div className="col-span-2">
          <StudentsTable refreshCounter={refreshCounter} />
        </div>
      </div>
    </DashboardShell>
  );
}
