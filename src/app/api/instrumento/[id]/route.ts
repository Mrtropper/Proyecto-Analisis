
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Instrumento } from "@/types/Instrumento";

interface Context {
  params: {
    id: string;
  };
}

// GET: Consultar un instrumento por ID
export async function GET(_request: Request, context: Context) {
  try {
    const id = Number(context?.params?.id);
    const instrumento: Instrumento | null = await prisma.instrumento.findUnique({
      where: { idInstrumento: id },
    });

    if (!instrumento) {
      return NextResponse.json({ error: "Instrumento no encontrado" }, { status: 404 });
    }

    return NextResponse.json(instrumento);
  } catch (e) {
    return NextResponse.json({ error: "Error al consultar instrumento", e}, { status: 500 });
  }
}

// PUT: Editar un instrumento
export async function PUT(request: Request, context: Context) {
  try {
    const id = Number(context?.params?.id);
    const data = await request.json();

    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : null;
    const familia = typeof data.familia === "string" ? data.familia.trim() : null;

    if (!nombre || !familia) {
      return NextResponse.json(
        { error: "Nombre y familia son requeridos" },
        { status: 400 }
      );
    }

    const instrumentoActualizado = await prisma.instrumento.update({
      where: { idInstrumento: id },
      data: { nombre, familia },
    });

    return NextResponse.json(instrumentoActualizado);
  } catch (e) {
    return NextResponse.json(
      { error: "Error al editar instrumento", details: e },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un instrumento
export async function DELETE(_request: Request, context: Context) {
  try {
    const id = Number(context?.params?.id);
    await prisma.instrumento.delete({ where: { idInstrumento: id } });

    return NextResponse.json({ message: "Instrumento eliminado correctamente" });
  } catch (e) {
    return NextResponse.json({ error: "Error al eliminar instrumento", e }, { status: 500 });
  }
}
