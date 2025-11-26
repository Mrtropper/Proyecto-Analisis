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


// GET: Lista del inventario
export async function GET() {
  try {
    const inventarios = await prisma.inventario.findMany({
      select: {
        idInventario: true,
        idInstrumento: true,
        estado: true,
      },
      orderBy: {
        idInventario: "asc",
      },
    });

    const inventariosFormateados = inventarios.map(item => ({
      idInventario: item.idInventario,
      idInstrumento: item.idInstrumento,
      Estado: item.estado, // Se renombra a Estado
    }));

    return NextResponse.json(inventariosFormateados);
  } catch (e) {
    console.error("Error al listar inventario:", e);
    return NextResponse.json(
      { error: "Error al listar inventario" },
      { status: 500 }
    );
  }
}

// POST: Crear inventario
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { idInventario, idInstrumento, estado } = data;

    if (!idInventario) {
      return NextResponse.json(
        { error: "El campo 'idInventario' es obligatorio." },
        { status: 400 }
      );
    }

    const nuevoInventario = await prisma.inventario.create({
      data: {
        idInventario: String(idInventario),
        idInstrumento: Number(idInstrumento),
        estado: normalizeEstado(estado || "Disponible"),
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
