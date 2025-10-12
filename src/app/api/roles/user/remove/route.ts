import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE: Remover un rol de un usuario
export async function DELETE(request: Request) {
  const { userId, rolId } = await request.json();
  if (!userId || !rolId) {
    return NextResponse.json({ error: 'userId y rolId son requeridos' }, { status: 400 });
  }
  await prisma.rolUsuario.delete({
    where: {
      id_usuario_id_rol: {
        id_usuario: userId,
        id_rol: rolId,
      },
    },
  });
  return NextResponse.json({ message: 'Rol removido del usuario' });
}

