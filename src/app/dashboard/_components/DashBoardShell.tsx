"use client";
import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";

export function KPICard({
  title,
  value,
  hint,
}: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-300 bg-neutral-100 p-4 shadow">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
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
    // ⬇⬇⬇ Fondo con la imagen ocupando toda la pantalla
    <div
      className="min-h-dvh text-neutral-100 flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/image-bg.png')" }} // o "/image.png"
    >
      {/* ---------------- HEADER BLANCO ---------------- */}
      <header className="sticky top-0 z-10 border-b border-neutral-300 bg-white text-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Branding + rol */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SINEM Logo"
              width={50}
              height={50}
              className="object-contain"
            />

            <span className="rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
              Rol: {roleLabel}
            </span>
          </div>

          {/* NAV */}
          <nav className="flex items-center gap-4 text-sm text-neutral-700">
            {isAdmin && (
              <>
                <Link href="/auth/register" className="hover:text-black">
                  Crear Usuario
                </Link>

                <Link href="/dashboard/roles" className="hover:text-black">
                  Modificar Roles
                </Link>

                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsGestionOpen(!isGestionOpen)}
                    className="hover:text-black flex items-center gap-1"
                  >
                    Gestión Estudiantes
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isGestionOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {isGestionOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-neutral-200 z-20">
                      <div className="py-1">
                        <Link
                          href="/dashboard/students/SearchStudents"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setIsGestionOpen(false)}
                        >
                          Buscar Estudiante
                        </Link>

                        <Link
                          href="/dashboard/students/addStudents"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setIsGestionOpen(false)}
                        >
                          Añadir Estudiante
                        </Link>

                        <Link
                          href="/dashboard/students/reports"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setIsGestionOpen(false)}
                        >
                          Reportes (no funca hasta el final)
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/dashboard/profesor" className="hover:text-black">
                  Profesores
                </Link>

                <Link href="/dashboard/instruments" className="hover:text-black">
                  Instrumentos
                </Link>

                <Link href="/dashboard" className="hover:text-black">
                  ????
                </Link>
              </>
            )}

            {isUser && (
              <Link href="/dashboard/profile" className="hover:text-black">
                Editar perfil
              </Link>
            )}

            <Link href="/auth/login" className="hover:text-black">
              Log Out
            </Link>
          </nav>
        </div>
      </header>

      {/* ---------------- CONTENIDO ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-8 pb-24 flex-1">
        {children}
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="fixed bottom-0 inset-x-0 z-50 bg-white/95 border-t border-neutral-300 flex justify-center items-center py-2">
        <Image
          src="/footer.png"
          alt="SINEM"
          width={500}
          height={150}
          className="object-contain"
          priority
        />
      </footer>
    </div>
  );
}
