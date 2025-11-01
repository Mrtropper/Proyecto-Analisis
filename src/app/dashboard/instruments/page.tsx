import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import InstrumentForm from "@/app/dashboard/instruments/InstrumentForm";


export default function InstrumentPage() {
    return (
        <DashboardShell role="ADMIN">
            <InstrumentForm />
        </DashboardShell>
    );
}
