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

// GET: Consultar asignaciones
// Soporta query params: userId, rolId (si no hay params devuelve todas las asignaciones)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');
    const rolIdParam = url.searchParams.get('rolId');

    const where: any = {};
    if (userIdParam) where.id_usuario = Number(userIdParam);
    if (rolIdParam) where.id_rol = Number(rolIdParam);

    const asignaciones = await prisma.rolUsuario.findMany({
      where: where,
      include: {
        user: true,
        rol: true,
      },
    });

    return NextResponse.json(asignaciones);
  } catch (error) {
    console.error('GET /api/roles/assign error', error);
    return NextResponse.json({ error: 'Error al consultar asignaciones' }, { status: 500 });
  }
}

// PUT: Modificar una asignación (cambiar rol de un usuario)
// Body esperado: { userId, rolId, newRolId }
export async function PUT(request: Request) {
  try {
    const { userId, rolId, newRolId } = await request.json();
    if (!userId || !rolId || !newRolId) {
      return NextResponse.json({ error: 'userId, rolId y newRolId son requeridos' }, { status: 400 });
    }

    // Encontrar la asignación actual
    const actual = await prisma.rolUsuario.findUnique({
      where: {
        id_usuario_id_rol: {
          id_usuario: userId,
          id_rol: rolId,
        },
      },
    });
    if (!actual) {
      return NextResponse.json({ error: 'Asignación no encontrada' }, { status: 404 });
    }

    if (Number(newRolId) === Number(rolId)) {
      return NextResponse.json({ message: 'No hay cambios' });
    }

    // Verificar que no exista ya la asignación objetivo
    const existeDestino = await prisma.rolUsuario.findUnique({
      where: {
        id_usuario_id_rol: {
          id_usuario: userId,
          id_rol: newRolId,
        },
      },
    });
    if (existeDestino) {
      return NextResponse.json({ error: 'El usuario ya tiene ese rol' }, { status: 409 });
    }

    // Realizar transacción: borrar la actual y crear la nueva
    const [deleted, created] = await prisma.$transaction([
      prisma.rolUsuario.delete({
        where: {
          id_usuario_id_rol: {
            id_usuario: userId,
            id_rol: rolId,
          },
        },
      }),
      prisma.rolUsuario.create({
        data: {
          id_usuario: userId,
          id_rol: newRolId,
        },
      }),
    ]);

    return NextResponse.json({ deleted, created });
  } catch (error: any) {
    console.error('PUT /api/roles/assign error', error);
    // Prisma puede lanzar errores que no sean mensajes serializables
    return NextResponse.json({ error: error?.message ?? 'Error al modificar asignación' }, { status: 500 });
  }
}

// DELETE: Eliminar una asignación
// Body esperado: { userId, rolId }
export async function DELETE(request: Request) {
  try {
    const { userId, rolId } = await request.json();
    if (!userId || !rolId) {
      return NextResponse.json({ error: 'userId y rolId son requeridos' }, { status: 400 });
    }

    const deleted = await prisma.rolUsuario.delete({
      where: {
        id_usuario_id_rol: {
          id_usuario: userId,
          id_rol: rolId,
        },
      },
    });

    return NextResponse.json(deleted);
  } catch (error: any) {
    console.error('DELETE /api/roles/assign error', error);
    // Si no existe la asignación, prisma lanza un error; devolver 404
    if (error?.code === 'P2025' || /Record to delete does not exist/.test(String(error?.message))) {
      return NextResponse.json({ error: 'Asignación no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ error: error?.message ?? 'Error al eliminar asignación' }, { status: 500 });
  }
}

