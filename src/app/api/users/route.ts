import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: listar usuarios con sus roles
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        roles: { include: { rol: true } },
      },
      orderBy: { id: 'asc' },
    });

    // Mapear a forma más simple
    const out = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      roles: (u.roles || []).map(r => ({ id: r.rol.id, nombre: r.rol.nombre })),
    }));

    return NextResponse.json(out);
  } catch (e) {
    console.error('GET /api/users error', e);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}
