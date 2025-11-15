
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista del inventario
export async function GET() {
  try {
    const inventarios = await prisma.inventario.findMany({
      select: {
        idInventario: true,
        idInstrumento: true,
        Estado: true,   
      },
      orderBy: {
        idInventario: "asc",
      },
    });

    return NextResponse.json(inventarios);
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

