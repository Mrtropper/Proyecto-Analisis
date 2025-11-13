
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Listar todos los registros de inventario
export async function GET() {
  try {
    const inventario = await prisma.inventario.findMany();
    return NextResponse.json(inventario);
  } catch (e) {
    console.error("Error al listar inventario:", e);
    return NextResponse.json(
      { error: "Error al listar inventario" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { idInventario, idInstrumento, Estado } = data;

    // Validación mínima: el ID es el único obligatorio
    if (!idInventario ) {
      return NextResponse.json(
        { error: "El campo 'idInventario' es obligatorio." },
        { status: 400 }
      );
    }

    const nuevoInventario = await prisma.inventario.create({
      data: {
        idInventario: String(idInventario),
        idInstrumento: idInstrumento ? Number(idInstrumento) : null,
        Estado: Estado || "Disponible", //valor predeterminado
      },
    });

    return NextResponse.json(nuevoInventario, { status: 201 });
  } catch (e) {
    console.error("Error al crear inventario:", e);
    return NextResponse.json(
      { error: "Error al crear inventario"},
      { status: 500 }
    );
  }
}

