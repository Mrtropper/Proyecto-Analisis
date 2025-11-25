"use client";

import Link from "next/link";

export default function Dashboard() {

  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Bienvenido.</p>

      <div className="mt-6">
        <div className="flex gap-4">
          <Link href="/dashboard/roles" className="inline-block rounded bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500">
            Gestión de Roles
          </Link>
          <Link href="/dashboard/profesor" className="inline-block rounded bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500">
            Gestión de Profesores
          </Link>
        </div>
      </div>
    </main>
  );
}
