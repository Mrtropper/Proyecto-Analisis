
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import ReporteEstuInstru from "@/app/dashboard/reporteestuinstru/ReporteEstuInstru";


export default function InstrumentPage() {
    return (
        <DashboardShell role="ADMIN">
            <ReporteEstuInstru />
        </DashboardShell>
    );
}
