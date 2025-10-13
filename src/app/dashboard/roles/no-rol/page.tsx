import DashboardShell, { KPICard } from "@/app/dashboard/_components/DashBoardShell";
import Link from "next/link";

export const metadata = { title: "Dashboard | Sin rol" };

export default function NoRolDashboard() {
  return (
    <DashboardShell role="SIN_ROL">
      <h1 className="mb-6 text-2xl font-semibold">Bienvenido</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Estado" value="Acceso limitado" hint="Asigna un rol para continuar" />
        <KPICard title="Módulos habilitados" value="0" hint="Pendiente de permisos" />
        <KPICard title="Notificaciones" value="0" />
        <KPICard title="Soporte" value="—" hint="Contacta al admin" />
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-2 text-lg font-semibold">¿Necesitas acceso?</h2>
        <p className="text-sm text-neutral-300">
          Solicita un rol al administrador o ve a{" "}
          <Link href="/dashboard/roles/admin" className="text-sky-400 underline">
            asignación de roles
          </Link>{" "}
          si tienes permisos.
        </p>
      </div>
    </DashboardShell>
  );
}
