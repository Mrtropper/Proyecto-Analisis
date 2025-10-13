import Link from "next/link";
import { ReactNode } from "react";

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
    role === "ADMIN" ? "Administrador" :
    role === "PROVIDER" ? "Proveedor" :
    role === "USER" ? "Usuario" : "Sin rol";

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
            <Link href="/dashboard/roles/admin" className="hover:text-white">Admin</Link>
            <Link href="/dashboard/roles/provider" className="hover:text-white">Provider</Link>
            <Link href="/dashboard/roles/users" className="hover:text-white">Users</Link>
            <Link href="/dashboard/roles/no-rol" className="hover:text-white">Sin rol</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">{children}</section>
    </main>
  );
}
