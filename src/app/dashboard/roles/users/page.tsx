
import DashboardShell, { KPICard } from "@/app/dashboard/_components/DashBoardShell";

export const metadata = { title: "Dashboard | Users" };

export default function UsersDashboard() {
  return (
    <DashboardShell role="USER">
      <h1 className="mb-6 text-2xl font-semibold">Mi Panel</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Favoritos" value="8" hint="3 con descuento" />
        <KPICard title="Consultas enviadas" value="5" hint="Última hace 2h" />
        <KPICard title="Reservas" value="2" hint="Una para mañana" />
        <KPICard title="Notificaciones" value="4" hint="Revisa tu bandeja" />
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-2 text-lg font-semibold">Recomendado para ti</h2>
        <p className="text-sm text-neutral-300">
          Basado en tus categorías favoritas: Gastronomía, Artesanías y Belleza.
        </p>
      </div>
    </DashboardShell>
  );
}
