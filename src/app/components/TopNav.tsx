import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="w-full flex justify-end gap-8 px-8 py-4 bg-neutral-900 text-white text-sm font-medium">
      <Link href="/dashboard/users" className="hover:underline">Crear Usuario</Link>
      <Link href="/dashboard/roles" className="hover:underline">Modificar Roles</Link>
      <Link href="/dashboard/profesor" className="hover:underline">Profesores</Link>
      <button className="hover:underline">Log Out</button>
    </nav>
  );
}
