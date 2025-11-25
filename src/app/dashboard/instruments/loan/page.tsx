
import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import InstrumentLoan from "@/app/dashboard/instruments/loan/InstrumentLoan";


export default function InstrumentPage() {
    return (
        <DashboardShell role="ADMIN">
            <InstrumentLoan />
        </DashboardShell>
    );
}
