"use client";


import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import SearchForm from "./_components/searchForm";

export default function SearchPage() {
    return (
    <DashboardShell role="ADMIN">
      <h1 className="text-3xl font-bold mb-6 text-white">Buscar Estudiantes</h1>
      <SearchForm/>
    </DashboardShell>
  );
}