
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

// POST: Crear un nuevo registro de inventario
export async function POST(request: Request) {
  try {
    const data = await request.json();
   const { idInventario, idInstrumento, estado } = data;

    if (!idInventario || !idInstrumento || !estado) {
    return NextResponse.json(
        { error: "Faltan campos obligatorios (idInventario, idInstrumento, estado)" },
        { status: 400 }
    );
    }

    const nuevoInventario = await prisma.inventario.create({
    data: {
        idInventario: String(idInventario),
        idInstrumento: Number(idInstrumento),
        estado: String(estado), // 👈 corregido
    },
    });


    return NextResponse.json(nuevoInventario, { status: 201 });
  } catch (e) {
    console.error("Error al crear inventario:", e);
    return NextResponse.json(
      { error: "Error al crear inventario" },
      { status: 500 }
    );
  }
}
