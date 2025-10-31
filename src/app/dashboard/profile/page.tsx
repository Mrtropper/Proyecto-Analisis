import DashboardShell from "@/app/dashboard/_components/DashBoardShell";
import ProfileForm from "@/app/dashboard/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <DashboardShell role="USER">
      <ProfileForm />
    </DashboardShell>
  );
}
