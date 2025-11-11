import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT: Actualizar un registro del inventario
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const idInventario = params.id;
    const data = await request.json();
    const { idInstrumento, estado } = data; // 👈 en minúscula

    if (!idInventario) {
      return NextResponse.json(
        { error: "Debe proporcionar un idInventario válido" },
        { status: 400 }
      );
    }

    const inventarioActualizado = await prisma.inventario.update({
      where: { idInventario },
      data: {
        idInstrumento: idInstrumento ? Number(idInstrumento) : undefined,
        estado: estado ? String(estado) : undefined, // 👈 corregido
      },
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

// DELETE: Eliminar un registro de inventario
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const idInventario = params.id;

    if (!idInventario) {
      return NextResponse.json(
        { error: "Debe proporcionar un idInventario válido" },
        { status: 400 }
      );
    }

    await prisma.inventario.delete({
      where: { idInventario },
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
