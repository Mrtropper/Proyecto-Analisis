

import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import InstrumentUpdate from "@/app/dashboard/instruments/update/InstrumentUpdate";


export default function InstrumentPage() {
    return (
        <DashboardShell role="ADMIN">
            <InstrumentUpdate />
        </DashboardShell>
    );
}
