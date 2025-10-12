import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Asignar un rol a un usuario
export async function POST(request: Request) {
  const { userId, rolId } = await request.json();
  if (!userId || !rolId) {
    return NextResponse.json({ error: 'userId y rolId son requeridos' }, { status: 400 });
  }
  // Crea la relación si no existe
  const asignacion = await prisma.rolUsuario.upsert({
    where: {
      id_usuario_id_rol: {
        id_usuario: userId,
        id_rol: rolId,
      },
    },
    update: {},
    create: {
      id_usuario: userId,
      id_rol: rolId,
    },
  });
  return NextResponse.json(asignacion);
}

