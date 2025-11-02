
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import InstrumentList from "@/app/dashboard/instruments/list/InstrumentList";


export default function InstrumentPage() {
    return (
        <DashboardShell role="ADMIN">
            <InstrumentList />
        </DashboardShell>
    );
}
