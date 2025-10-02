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
          remember, // por si luego quieres controlar expiración de cookie
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Credenciales inválidas");
      }

      // éxito → redirige a donde quieras
      router.push("/dashboard");
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
        placeholder="tu@email.com"
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

        <a href="/forgot" className="text-sm text-sky-400 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
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
