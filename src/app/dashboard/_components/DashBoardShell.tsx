"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";

export function KPICard({
  title,
  value,
  hint,
}: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 shadow">
      <p className="text-sm text-neutral-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-400">{hint}</p> : null}
    </div>
  );
}

export default function DashboardShell({
  role,
  children,
}: {
  role: "ADMIN" | "PROVIDER" | "USER" | "SIN_ROL";
  children: ReactNode;
}) {
  const roleLabel =
    role === "ADMIN"
      ? "Administrador"
      : role === "PROVIDER"
        ? "Proveedor"
        : role === "USER"
          ? "Usuario"
          : "Sin rol";

  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";

  const [isGestionOpen, setIsGestionOpen] = useState(false);

  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">GirlsBulk</span>
            <span className="rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
              Rol: {roleLabel}
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-neutral-300">
            {isAdmin && (
              <>
                <Link href="/auth/register" className="hover:text-white">
                  Crear Usuario
                </Link>

                <Link href="/dashboard/roles" className="hover:text-white">
                  Modificar Roles
                </Link>

<<<<<<< HEAD
                <div className="relative">
                  <button onClick={() => setIsGestionOpen(!isGestionOpen)} className="hover:text-white flex items-center gap-1">
                    Gestión Estudiantes
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isGestionOpen ? "rotate-180" : "rotate-0"
                      }`} fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {isGestionOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-neutral-800 ring-1 ring-black ring-opacity-5 z-20">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <Link
                          href="/dashboard/students/searchStudents"
                          className="block px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-700"
                          role="menuitem"
                          onClick={() => setIsGestionOpen(false)}
                        >
                          Buscar Estudiante
                        </Link>

                        <Link
                          href="/dashboard/students/addStudents"
                          className="block px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-700"
                          role="menuitem"
                          onClick={() => setIsGestionOpen(false)}
                        >
                          Añadir Estudiante
                        </Link>

                        <Link
                          href="/dashboard/students/reports"
                          className="block px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-700"
                          role="menuitem"
                          onClick={() => setIsGestionOpen(false)}
                        >
                          Reportes (no funca hasta el final)
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/" className="hover:text-white">
                  Cosa (salir)
=======
                <Link href="/dashboard/profesor" className="hover:text-white">
                  Profesores
>>>>>>> origin/ramaFabri
                </Link>
              </>
            )}

            {isUser && (
              <Link href="/dashboard/profile" className="hover:text-white">
                Editar perfil
              </Link>
            )}

            <Link href="/auth/login" className="hover:text-white">
              Log Out
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">{children}</section>
    </main>
  );
}
