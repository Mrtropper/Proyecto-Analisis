import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Consultar un rol por ID
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const rol = await prisma.rol.findUnique({ where: { id: Number(params.id) } });
    if (!rol) return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 });
    return NextResponse.json(rol);
  } catch (e) {
    return NextResponse.json({ error: "Error al consultar rol" }, { status: 500 });
  }
}

// PUT: Editar un rol
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : null;
    const descripcion = typeof data.descripcion === "string" ? data.descripcion.trim() : null;
    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }
    const rol = await prisma.rol.update({
      where: { id: Number(params.id) },
      data: { nombre, descripcion },
    });
    return NextResponse.json(rol);
  } catch (e) {
    return NextResponse.json({ error: "Error al editar rol" }, { status: 500 });
  }
}

// DELETE: Eliminar un rol
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.rol.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Rol eliminado" });
  } catch (e) {
    return NextResponse.json({ error: "Error al eliminar rol" }, { status: 500 });
  }
}

