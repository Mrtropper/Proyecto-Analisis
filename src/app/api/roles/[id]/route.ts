import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Consultar un rol por ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // 👈 Next 15: params es Promise
    const rol = await prisma.rol.findUnique({ where: { id: Number(id) } });

    if (!rol) {
      return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 });
    }
    return NextResponse.json(rol);
  } catch (e) {
    return NextResponse.json({ error: "Error al consultar rol" }, { status: 500 });
  }
}

// PUT: Editar un rol
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const nombre =
      typeof data.nombre === "string" ? data.nombre.trim() : null;
    const descripcion =
      typeof data.descripcion === "string" ? data.descripcion.trim() : null;

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const rol = await prisma.rol.update({
      where: { id: Number(id) },
      data: { nombre, descripcion },
    });

    return NextResponse.json(rol);
  } catch (e) {
    return NextResponse.json({ error: "Error al editar rol" }, { status: 500 });
  }
}

// DELETE: Eliminar un rol
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.rol.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Rol eliminado" });
  } catch (e) {
    return NextResponse.json({ error: "Error al eliminar rol" }, { status: 500 });
  }
}
