"use client";

import { useState } from "react";
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import RegularStudentForm from "@/app/dashboard/students/addStudents/_components/RegularStudentForm";
import KidsStudentForm from "@/app/dashboard/students/addStudents/_components/KidsStudentForm";
import SpecialStudentForm from "@/app/dashboard/students/addStudents/_components/SpecialStudentForm";
import ServiceStudentForm from "@/app/dashboard/students/addStudents/_components/ServiceStudentForm";

type StudentType = "REGULAR" | "KIDS" | "SPECIAL" | "SERVICE";

export default function StudentsPage() {
  const [studentType, setStudentType] = useState<StudentType>("REGULAR");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const studentOptions: { id: StudentType; label: string }[] = [
    { id: "REGULAR", label: "Estudiante Regular" },
    { id: "KIDS", label: "Estudiante Infantil" },
    { id: "SPECIAL", label: "Estudiante Especial" },
    { id: "SERVICE", label: "Estudiante Servicio" },
  ];

  const renderForm = () => {
    switch (studentType) {
      case "REGULAR":
        return <RegularStudentForm key={refreshCounter} />;
      case "KIDS":
        return <KidsStudentForm key={refreshCounter} />;
      case "SPECIAL":
        return <SpecialStudentForm key={refreshCounter} />;
      case "SERVICE":
        return <ServiceStudentForm key={refreshCounter} />;
      default:
        return <p className="text-neutral-500">Seleccione un tipo de estudiante.</p>;
    }
  };

  return (
    <DashboardShell role="ADMIN">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-xl backdrop-blur-sm mb-6">
        <h1 className="text-2xl font-bold text-white text-center">
          Selección de Formulario de Estudiantes
        </h1>
      </div>


      {/* Botones de Selección */}
      <div className="flex flex-wrap gap-4 mb-10 p-4 border-b border-neutral-800">
        {studentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setStudentType(option.id)}
            className={`
              px-5 py-2 rounded-xl font-semibold transition-all duration-200
              ${studentType === option.id
                ? "bg-sky-600 text-white shadow-lg shadow-sky-600/40"
                : "bg-neutral-800 text-neutral-300 hover:bg-sky-700 hover:text-white"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Área de Visualización del Formulario */}
      <div className="p-6 rounded-xl bg-zinc-800 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">
          Formulario: {studentOptions.find(o => o.id === studentType)?.label}
        </h2>

        {renderForm()}
      </div>
    </DashboardShell>
  );
}

