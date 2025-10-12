import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Listar todos los roles
export async function GET() {
  try {
    const roles = await prisma.rol.findMany();
    return NextResponse.json(roles);
  } catch (e) {
    return NextResponse.json({ error: "Error al obtener roles" }, { status: 500 });
  }
}

// POST: Crear un nuevo rol
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : null;
    const descripcion = typeof data.descripcion === "string" ? data.descripcion.trim() : null;
    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }
    const nuevoRol = await prisma.rol.create({
      data: { nombre, descripcion },
    });
    return NextResponse.json(nuevoRol);
  } catch (e) {
    return NextResponse.json({ error: "Error al crear rol" }, { status: 500 });
  }
}
