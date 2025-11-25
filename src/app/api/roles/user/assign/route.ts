import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Consultar los roles de un usuario
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");

  if (!userIdParam) {
    return NextResponse.json(
      { error: "Falta el parámetro userId" },
      { status: 400 }
    );
  }

  const userIdNum = Number(userIdParam);
  if (Number.isNaN(userIdNum)) {
    return NextResponse.json(
      { error: "userId debe ser numérico" },
      { status: 400 }
    );
  }

  const rolesUsuario = await prisma.rolUsuario.findMany({
    where: { id_usuario: userIdNum },
    include: { rol: true },
  });

  // Devuelve solo los roles (como ya hacías)
  return NextResponse.json(rolesUsuario.map((r) => r.rol));
}

