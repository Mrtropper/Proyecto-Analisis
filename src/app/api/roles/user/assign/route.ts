import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Consultar los roles de un usuario
export async function GET(_request: Request, { params }: { params: { userId: string } }) {
  const roles = await prisma.rolUsuario.findMany({
    where: { id_usuario: Number(params.userId) },
    include: { rol: true },
  });
  return NextResponse.json(roles.map(r => r.rol));
}

