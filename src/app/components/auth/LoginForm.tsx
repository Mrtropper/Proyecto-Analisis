"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, PasswordInput, Button } from "../ui"; // ruta relativa a /components/auth

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function onPwd(e: ChangeEvent<HTMLInputElement>) {
    setPwd(e.target.value);
  }

  function onRemember(e: ChangeEvent<HTMLInputElement>) {
    setRemember(e.target.checked);
  }

  /** Normaliza cualquier forma de roles a un string[] */
  function extractRoleNames(anyRoles: any): string[] {
    if (!anyRoles) return [];
    if (Array.isArray(anyRoles)) {
      // Soporta: ["Admin"] | [{nombre:"Admin"}] | [{rol:{nombre:"Admin"}}]
      return anyRoles
        .map((r) =>
          typeof r === "string" ? r : r?.nombre ?? r?.rol?.nombre ?? ""
        )
        .filter(Boolean);
    }
    const maybe = anyRoles.roles ?? anyRoles.user?.roles ?? [];
    return extractRoleNames(maybe);
  }

  /** Decide la ruta del dashboard según prioridad: ADMIN → PROVIDER/PROVEEDOR → USER/USUARIO → no-rol */
  function pickDestination(roles: string[]): string {
    const set = new Set(roles.map((r) => r.toUpperCase()));
    if (set.has("ADMIN")) return "/dashboard/roles/admin";
    if (set.has("PROVIDER") || set.has("PROVEEDOR"))
      return "/dashboard/roles/provider";
    if (set.has("USER") || set.has("USUARIO") || set.has("USERS"))
      return "/dashboard/roles/users";
    return "/dashboard/roles/no-rol";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: pwd,
          remember, // por si luego controlas expiración de cookie
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Credenciales inválidas");
      }

      // 1) Intentar roles devueltos por /api/login
      let roles = extractRoleNames(data?.roles);

      // 2) Fallback: si no vinieron, consulta tu endpoint de asignaciones
      if (!roles.length && data?.id) {
        try {
          const r = await fetch(`/api/roles/user/assign/${data.id}`);
          const rd = await r.json();
          roles = extractRoleNames(rd);
        } catch {
          // ignore
        }
      }

      // Guarda info mínima para uso posterior (opcional)
      try {
        const user = {
          id: data.id,
          username: data.username,
          email: data.email,
          roles,
        };
        sessionStorage.setItem("user", JSON.stringify(user));
      } catch {
        // ignore
      }

      // 3) Redirigir al dashboard correspondiente
      const dest = pickDestination(roles);
      router.push(dest);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Correo"
        type="email"
        placeholder="example@example.com"
        value={email}
        onChange={onEmail}
        autoComplete="email"
        required
      />

      <PasswordInput
        label="Contraseña"
        placeholder="••••••••"
        value={pwd}
        onChange={onPwd}
        autoComplete="current-password"
        required
        minLength={6}
      />

      <div className="flex items-center justify-between pt-1">
        <label className="inline-flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={onRemember}
            className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0"
          />
          Recordarme
        </label>

      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Ingresando..." : "Entrar"}
      </Button>
    </form>
  );
}
