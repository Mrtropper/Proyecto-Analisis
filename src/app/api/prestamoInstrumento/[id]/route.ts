import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalize(value: unknown) {
  if (typeof value === "string") return value.trim().toLowerCase();
  return value;
}

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


// PUT: actualizar préstamo
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();

    const prestamoActualizado = await prisma.prestamoInstrumento.update({
      where: { idPrestamo: Number(id) },
      data: {
        idEstudiante: data.idEstudiante
          ? Number(data.idEstudiante)
          : undefined,
        idInstrumento: data.idInstrumento
          ? Number(data.idInstrumento)
          : undefined,
        idInventario: data.idInventario
          ? String(data.idInventario)
          : undefined,
        fechaEntrega: data.fechaEntrega
          ? new Date(data.fechaEntrega)
          : undefined,
        Estatus: data.Estatus ? normalizeEstado(data.Estatus) : undefined,
      },
    });

    if (data.Estatus) {
      let nuevoEstado = "Prestado";

      const est = normalize(data.Estatus);
      if (est === "devuelto") nuevoEstado = "Disponible";
      if (est === "prestado") nuevoEstado = "Prestado";
      if (est === "atrasado") nuevoEstado = "Prestado";

      await prisma.inventario.update({
        where: { idInventario: prestamoActualizado.idInventario },
        data: { Estado: nuevoEstado },
      });
    }

    return NextResponse.json(prestamoActualizado);
  } catch (e) {
    console.error("Error al actualizar préstamo:", e);
    return NextResponse.json(
      { error: "Error al actualizar préstamo" },
      { status: 500 }
    );
  }
}

// DELETE: eliminar préstamo
// DELETE: eliminar préstamo
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    //Obtener préstamo actual
    const prestamo = await prisma.prestamoInstrumento.findUnique({
      where: { idPrestamo: Number(id) },
    });

    if (!prestamo) {
      return NextResponse.json(
        { error: "Préstamo no encontrado" },
        { status: 404 }
      );
    }

    //Bloquear eliminación si está prestado o atrasado
    const estado = prestamo.Estatus;

    if (estado === "Prestado" || estado === "Atrasado") {
      return NextResponse.json(
        { error: "No se puede eliminar un préstamo que no ha sido devuelto." },
        { status: 403 }
      );
    }

    // Eliminar préstamo
    const prestamoEliminado = await prisma.prestamoInstrumento.delete({
      where: { idPrestamo: Number(id) },
    });

    //Devolver instrumento al inventario
    await prisma.inventario.update({
      where: { idInventario: prestamoEliminado.idInventario },
      data: { Estado: "Disponible" },
    });

    return NextResponse.json({
      message: "Préstamo eliminado correctamente",
    });
  } catch (e) {
    console.error("Error al eliminar préstamo:", e);
    return NextResponse.json(
      { error: "Error al eliminar préstamo" },
      { status: 500 }
    );
  }
}
