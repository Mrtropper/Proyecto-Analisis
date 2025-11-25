import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


function normalizeEstado(estado: unknown): string {
  if (typeof estado === "string") {
    const e = estado.trim().toLowerCase();

    if (e === "prestado") return "Prestado";
    if (e === "disponible") return "Disponible";
    if (e === "atrasado") return "Atrasado";
    if (e === "mantenimiento") return "Mantenimiento";

    return estado;
  }

  return String(estado);
}


// PUT: Actualizar inventario
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const estado = data.estado || data.Estado || data.Estatus;

    // 🔒 1. Prohibir modificar inventario prestado
    const inventarioActual = await prisma.inventario.findUnique({
      where: { idInventario: id },
    });

    if (inventarioActual?.Estado === "Prestado") {
      return NextResponse.json(
        { error: "No se puede modificar este inventario porque está prestado." },
        { status: 403 }
      );
    }

    // 🔧 2. Proceder con actualización normal
    const inventarioActualizado = await prisma.inventario.update({
      where: { idInventario: id },
      data: { Estado: normalizeEstado(estado) },
    });

    return NextResponse.json(inventarioActualizado);
  } catch (e) {
    console.error("Error al actualizar inventario:", e);
    return NextResponse.json(
      { error: "Error al actualizar inventario" },
      { status: 500 }
    );
  }
}

// DELETE: eliminar inventario
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Prohibir eliminar inventario prestado
    const inventarioActual = await prisma.inventario.findUnique({
      where: { idInventario: id },
    });

    if (inventarioActual?.Estado === "Prestado") {
      return NextResponse.json(
        { error: "No se puede eliminar este inventario porque está prestado." },
        { status: 403 }
      );
    }

    // Proceder con eliminación normal
    await prisma.inventario.delete({
      where: { idInventario: id },
    });

    return NextResponse.json({ message: "Inventario eliminado correctamente" });
  } catch (e) {
    console.error("Error al eliminar inventario:", e);
    return NextResponse.json(
      { error: "Error al eliminar inventario" },
      { status: 500 }
    );
  }
}


// GET: buscar inventario por ID de instrumento
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const inventario = await prisma.inventario.findFirst({
      where: { idInstrumento: Number(id) },
      select: { idInventario: true },
    });

    if (!inventario) {
      return NextResponse.json(
        { error: "No se encontró inventario para este instrumento" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventario);
  } catch (e) {
    console.error("Error al consultar inventario:", e);
    return NextResponse.json(
      { error: "Error al consultar inventario" },
      { status: 500 }
    );
  }
}
