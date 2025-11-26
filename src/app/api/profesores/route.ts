import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET
export async function GET() {
  try {
    const profesores = await prisma.profesor.findMany({
      orderBy: { idProfesor: "asc" },
    });

    // Convertimos cualquier cosa rara a string SIEMPRE
    const normalizados = profesores.map((p) => ({
      ...p,
      activo: p.activo ?? "SI",
    }));

    return NextResponse.json(normalizados);
  } catch (e) {
    console.error("GET /api/profesores error:", e);
    return NextResponse.json(
      { error: "Error al obtener profesores" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const nuevo = await prisma.profesor.create({
      data: {
        nombreCompleto: data.nombreCompleto,
        correo: data.correo,
        telefono: data.telefono,
        jornada: data.jornada,
        activo: data.activo ?? 'SI',
      },
    });

    return NextResponse.json(nuevo);
  } catch (e) {
    console.error("POST /api/profesores error:", e);
    return NextResponse.json(
      { error: "Error al crear profesor" },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const actualizado = await prisma.profesor.update({
      where: { idProfesor: data.idProfesor },
      data: {
        nombreCompleto: data.nombreCompleto,
        correo: data.correo,
        telefono: data.telefono,
        jornada: data.jornada,
        activo: data.activo ?? 'SI',
      },
    });

    return NextResponse.json(actualizado);
  } catch (e) {
    console.error("PUT /api/profesores error:", e);
    return NextResponse.json(
      { error: "Error al actualizar profesor" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { idProfesor } = await req.json();

    await prisma.profesor.delete({
      where: { idProfesor },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/profesores error:", e);
    return NextResponse.json(
      { error: "Error al eliminar profesor" },
      { status: 500 }
    );
  }
}

