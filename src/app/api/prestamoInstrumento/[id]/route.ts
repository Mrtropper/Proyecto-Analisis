
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT: Actualizar un préstamo existente
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const idPrestamo = Number(params.id);
    const data = await request.json();

    if (!idPrestamo) {
      return NextResponse.json(
        { error: "Debe proporcionar un idPrestamo válido" },
        { status: 400 }
      );
    }

    const prestamoActualizado = await prisma.prestamoInstrumento.update({
      where: { idPrestamo },
      data: {
        idEstudiante: data.idEstudiante ? Number(data.idEstudiante) : undefined,
        idInstrumento: data.idInstrumento ? Number(data.idInstrumento) : undefined,
        idInventario: data.idInventario ? String(data.idInventario) : undefined,
        fechaEntrega: data.fechaEntrega ? new Date(data.fechaEntrega) : undefined,
        Estatus: data.Estatus || undefined,
      },
    });

    return NextResponse.json(prestamoActualizado);
  } catch (e) {
    console.error("Error al actualizar préstamo:", e);
    return NextResponse.json({ error: "Error al actualizar préstamo" }, { status: 500 });
  }
}

// DELETE: Eliminar un préstamo por ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const idPrestamo = Number(params.id);

    if (!idPrestamo) {
      return NextResponse.json(
        { error: "Debe proporcionar un idPrestamo válido" },
        { status: 400 }
      );
    }

    await prisma.prestamoInstrumento.delete({
      where: { idPrestamo },
    });

    return NextResponse.json({ message: "Préstamo eliminado correctamente" });
  } catch (e) {
    console.error("Error al eliminar préstamo:", e);
    return NextResponse.json({ error: "Error al eliminar préstamo" }, { status: 500 });
  }
}
