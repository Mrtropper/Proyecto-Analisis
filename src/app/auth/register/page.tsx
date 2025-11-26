// src/app/auth/register/page.tsx
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// --- Server Action ---
async function register(formData: FormData) {
  "use server";

  const emailRaw = String(formData.get("email") || "").trim();
  const usernameRaw = String(formData.get("username") || "").trim();
  const passwordRaw = String(formData.get("password") || "").trim();

  if (!emailRaw || !usernameRaw || !passwordRaw) {
    redirect("/auth/register?error=Todos%20los%20campos%20son%20obligatorios");
  }

  if (!EMAIL_RE.test(emailRaw)) {
    redirect("/auth/register?error=Formato%20de%20correo%20inv%C3%A1lido");
  }

  if (passwordRaw.length < 6) {
    redirect("/auth/register?error=La%20contrase%C3%B1a%20debe%20tener%20al%20menos%206%20caracteres");
  }

  const email = emailRaw.toLowerCase();
  const username = usernameRaw.toLowerCase();

  const already = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true },
  });

  if (already) {
    redirect("/auth/register?error=Email%20o%20usuario%20ya%20existen");
  }

  const hashed = await bcrypt.hash(passwordRaw, 10);

  await prisma.user.create({
    data: { email, username, password: hashed },
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
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">

      {/* TARJETA */}
      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-2xl p-8">

        <h1 className="mb-6 text-2xl font-semibold text-sky-50 text-center">
          Crear cuenta
        </h1>

        {error && (
          <p className="mb-4 rounded-md bg-red-900/40 border border-red-800 p-3 text-sm text-red-300">
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
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="usuario@dominio.com"
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
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-sky-500"
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
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-neutral-400">
              Mínimo 6 caracteres. Se guardará encriptada.
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
    </main>
  );
}
