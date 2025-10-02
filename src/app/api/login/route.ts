import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const isDev = process.env.NODE_ENV !== "production";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email: string | undefined = body?.email;
    const password: string | undefined = body?.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    // email es nullable en DB → usa findFirst
    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true, email: true, password: true, status: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const stored = user.password ?? null;
    const isBcrypt = stored?.startsWith("$2a$") || stored?.startsWith("$2b$");
    const ok = stored
      ? isBcrypt
        ? await bcrypt.compare(password, stored)
        : password === stored
      : false;

    if (!ok) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    if (user.status && user.status.toLowerCase() === "inactive") {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 });
    }

    // éxito (sin sesión por ahora)
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("LOGIN_ERROR:", e); // ← mira la terminal
    return NextResponse.json(
      { error: isDev ? `Server: ${e?.message ?? String(e)}` : "Error del servidor" },
      { status: 500 },
    );
  }
}
