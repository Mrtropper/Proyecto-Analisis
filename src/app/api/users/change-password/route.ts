import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type Body = { userId?: number; oldPassword?: string; newPassword?: string };

export async function POST(request: Request) {
  try {
    const data: Body = await request.json().catch(() => ({} as Body));
    const userId = Number(data.userId);
    const oldPassword = typeof data.oldPassword === 'string' ? data.oldPassword : '';
    const newPassword = typeof data.newPassword === 'string' ? data.newPassword : '';

    if (!Number.isFinite(userId) || !oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, password: true } });
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    const stored = user.password ?? '';
    const isBcrypt = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');
    const ok = isBcrypt ? await bcrypt.compare(oldPassword, stored) : oldPassword === stored;
    if (!ok) return NextResponse.json({ error: 'Contraseña anterior incorrecta' }, { status: 403 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/users/change-password error', e);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
