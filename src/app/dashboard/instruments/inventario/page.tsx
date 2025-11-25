
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import InstrumentInventario from "@/app/dashboard/instruments/inventario/InstrumentInventario";


export default function InstrumentPage() {
    return (
        <DashboardShell role="ADMIN">
            <InstrumentInventario />
        </DashboardShell>
    );
}