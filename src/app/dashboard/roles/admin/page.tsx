import DashboardShell, { KPICard } from "@/app/dashboard/_components/DashBoardShell";

export const metadata = { title: "Dashboard | Admin" };

export default function AdminDashboard() {
  return (
    <DashboardShell role="ADMIN">
      <h1 className="mb-6 text-2xl font-semibold">Panel de Administración</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Usuarios totales" value="1,248" hint="+32 vs. semana pasada" />
        <KPICard title="Proveedores activos" value="87" hint="81% verificados" />
        <KPICard title="Publicaciones" value="432" hint="+12 hoy" />
        <KPICard title="Tickets abiertos" value="14" hint="SLA &lt; 24h" />
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-2 text-lg font-semibold">Acciones rápidas</h2>
        <ul className="list-inside list-disc text-sm text-neutral-300">
          <li>Gestionar roles y permisos</li>
          <li>Aprobar nuevos proveedores</li>
          <li>Revisar reportes de contenido</li>
        </ul>
      </div>
    </DashboardShell>
  );
}
