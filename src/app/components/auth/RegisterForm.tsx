"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, PasswordInput, Button } from "../ui";

export default function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onEmail(e: ChangeEvent<HTMLInputElement>) { setEmail(e.target.value); }
  function onPwd(e: ChangeEvent<HTMLInputElement>) { setPwd(e.target.value); }
  function onConfirmPwd(e: ChangeEvent<HTMLInputElement>) { setConfirmPwd(e.target.value); }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);

    if (pwd !== confirmPwd) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd }),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : {};
      if (!res.ok) throw new Error(data?.error || "No se pudo registrar");

      // data: { id: number }
      setOkMsg(`Tu usuario fue creado. ID: ${data.id}`);
      // Redirige si quieres directamente al login o al dashboard:
      setTimeout(() => router.push("/auth/login"), 800);
    } catch (err: any) {
      setError(err?.message ?? "Error del servidor");
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
        autoComplete="new-password"
        required
        minLength={6}
      />

      <PasswordInput
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={confirmPwd}
        onChange={onConfirmPwd}
        autoComplete="new-password"
        required
        minLength={6}
      />

      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
      {okMsg && <p className="text-sm text-emerald-400">{okMsg}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creando..." : "Registrarme"}
      </Button>
    </form>
  );
}
