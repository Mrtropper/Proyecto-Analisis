"use client";

import { useState } from "react";
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import RegularStudentForm from "@/app/dashboard/students/addStudents/RegularStudentForm";
import KidsStudentForm from "@/app/dashboard/students/addStudents/KidsStudentForm";
import SpecialStudentForm from "@/app/dashboard/students/addStudents/SpecialStudentForm";
import ServiceStudentForm from "@/app/dashboard/students/addStudents/ServiceStudentForm"; 

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
      <h1 className="text-3xl font-bold mb-6 text-white">Seleccion de Formulario de estudiantes</h1>

      {/* Botones de Selección */}
      <div className="flex flex-wrap gap-4 mb-10 p-4 border-b border-neutral-800">
        {studentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setStudentType(option.id)}
            className={`
              px-5 py-2 rounded-xl font-semibold transition-all duration-200
              ${studentType === option.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Área de Visualización del Formulario */}
      <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">
          Formulario: {studentOptions.find(o => o.id === studentType)?.label}
        </h2>

        {renderForm()}
      </div>
    </DashboardShell>
  );
}

