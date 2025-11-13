import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: { id: string };
}

// PUT: Actualizar un registro del inventario
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idInventario = params.id;
    const data = await request.json();
    const { idInstrumento, Estado } = data;

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
        Estado: Estado ? String(Estado) : undefined,
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

export async function GET(_req: Request, { params }: Context) {
  try {
    const idInstrumento = Number(params.id);

    const inventario = await prisma.inventario.findFirst({
      where: { idInstrumento },
      select: {
        idInventario: true,
      },
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


