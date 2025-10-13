// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type Creds = { identifier: string | null; password: string | null };

function pickFirst(...vals: Array<unknown>): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const j = await req.clone().json();
    return typeof j === "object" && j ? (j as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function readForm(req: Request): Promise<FormData | null> {
  try {
    return await req.clone().formData();
  } catch {
    return null;
  }
}

async function getCredentials(req: Request): Promise<Creds> {
  // 1) JSON
  const json = await readJson(req);
  if (json) {
    const identifier = pickFirst(
      json["identifier"],
      json["email"],
      json["username"],
      json["emailOrUsername"],
      json["correo"],
      json["usuario"]
    );
    const password = pickFirst(
      json["password"],
      json["pass"],
      json["pwd"],
      json["contrasena"],
      json["contraseña"]
    );
    if (identifier && password) return { identifier, password };
  }

  // 2) FormData (multipart / x-www-form-urlencoded)
  const form = await readForm(req);
  if (form) {
    const identifier = pickFirst(
      form.get("identifier"),
      form.get("email"),
      form.get("username"),
      form.get("emailOrUsername"),
      form.get("correo"),
      form.get("usuario")
    );
    const password = pickFirst(
      form.get("password"),
      form.get("pass"),
      form.get("pwd"),
      form.get("contrasena"),
      form.get("contraseña")
    );
    if (identifier && password) return { identifier, password };
  }

  return { identifier: null, password: null };
}

export async function POST(req: Request) {
  try {
    const { identifier: rawId, password: pwd } = await getCredentials(req);

    if (!rawId || !pwd) {
      return NextResponse.json(
        {
          error: "Faltan campos",
          hint:
            "Envía 'identifier' (o 'email' / 'username' / 'correo' / 'usuario') y 'password' (o 'pass' / 'pwd' / 'contrasena').",
        },
        { status: 400 }
      );
    }

    const identifier = rawId.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier } },
          { username: { equals: identifier } },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        status: true,
        roles: {
          select:{rol:{select:{nombre:true}}}
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const stored = user.password ?? "";
    const isBcrypt =
      stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");

    const ok = isBcrypt ? await bcrypt.compare(pwd, stored) : pwd === stored;
    if (!ok) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    // Ajusta según tu dominio (A = activo)
    if (user.status && user.status !== "A") {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 });
    }

    const roles = (user.roles?? [])
    .map(r => r.rol?.nombre ?? "")
    .filter(Boolean);

    return NextResponse.json({
    ok: true,
    id: user.id,
    username: user.username,
    email: user.email,
    roles, // ["Admin","usuario",...]
    });

    //return NextResponse.json({ ok: true, id: user.id, username: user.username, email: user.email });
  } catch (e) {
    console.error("LOGIN_ERROR:", e);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
