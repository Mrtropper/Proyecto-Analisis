import DashboardShell, { KPICard } from "@/app/dashboard/_components/DashBoardShell";

export const metadata = { title: "Dashboard | Provider" };

export default function ProviderDashboard() {
  return (
    <DashboardShell role="PROVIDER">
      <h1 className="mb-6 text-2xl font-semibold">Panel de Proveedor</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Mis productos" value="24" hint="2 en revisión" />
        <KPICard title="Visitas hoy" value="318" hint="+12% vs. ayer" />
        <KPICard title="Consultas" value="9" hint="3 sin responder" />
        <KPICard title="Calificación" value="4.7" hint="112 reseñas" />
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-2 text-lg font-semibold">Siguiente paso</h2>
        <p className="text-sm text-neutral-300">
          Completa tu perfil fiscal y sube imágenes en alta resolución para mejorar la conversión.
        </p>
      </div>
    </DashboardShell>
  );
}
