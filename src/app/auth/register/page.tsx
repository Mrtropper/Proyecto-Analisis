// src/app/auth/register/page.tsx
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Regex de email (simple y efectiva)
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// --- Server Action ---
async function register(formData: FormData) {
  "use server";

  const emailRaw = String(formData.get("email") || "").trim();
  const usernameRaw = String(formData.get("username") || "").trim();
  const passwordRaw = String(formData.get("password") || "").trim();

  // Validaciones mínimas
  if (!emailRaw || !usernameRaw || !passwordRaw) {
    redirect("/auth/register?error=Todos%20los%20campos%20son%20obligatorios");
  }

  // Validación estricta de formato de correo
  if (!EMAIL_RE.test(emailRaw)) {
    redirect(
      "/auth/register?error=Formato%20de%20correo%20inv%C3%A1lido%3A%20usa%20algo%20como%20usuario%40dominio.com"
    );
  }

  if (passwordRaw.length < 6) {
    redirect("/auth/register?error=La%20contrase%C3%B1a%20debe%20tener%20al%20menos%206%20caracteres");
  }

  const email = emailRaw.toLowerCase();
  const username = usernameRaw.toLowerCase();

  // Evitar duplicados
  const already = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true },
  });
  if (already) {
    redirect("/auth/register?error=Email%20o%20usuario%20ya%20existen");
  }

  // Hash seguro
  const hashed = await bcrypt.hash(passwordRaw, 10);

  await prisma.user.create({
    data: { email, username, password: hashed }, // status lo setea la BD por default
  });

  redirect("/auth/login?registered=1");
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="mb-6 text-2xl font-semibold text-sky-50">Crear cuenta</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-900/30 p-3 text-sm text-red-300">
          {decodeURIComponent(error)}
        </p>
      )}

      <form action={register} className="space-y-4" noValidate>
        <div className="space-y-1">
          <label className="block text-sm text-neutral-300" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 text-gray-500"
            placeholder="usuario@dominio.com"
            // Validación en cliente (igual que server)
            pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
            title="Ingresa un correo válido, por ejemplo: usuario@dominio.com"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-neutral-300" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 text-gray-500"
            placeholder="username"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-neutral-300" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 text-gray-500"
            placeholder="••••••••"
          />
          <p className="text-xs text-neutral-400">
            Mínimo 6 caracteres. Se guardará encriptada (bcrypt).
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 focus:outline-none"
        >
          Registrarme
        </button>
      </form>

    </div>
  );
}
