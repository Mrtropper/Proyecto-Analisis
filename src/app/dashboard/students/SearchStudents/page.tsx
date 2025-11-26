"use client";


import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import SearchForm from "./_components/searchForm";

export default function SearchPage() {
    return (
    <DashboardShell role="ADMIN">
      <SearchForm/>
    </DashboardShell>
  );
}