
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Instrumento } from "@/types/Instrumento";


// GET: Listar todos los instrumentos
export async function GET() {
  try {
    const instrumentos = await prisma.instrumento.findMany({
      select: {
        idInstrumento: true,
        nombre: true,
        familia: true
      },
    });

    return NextResponse.json(instrumentos);
  } catch (error) {
    console.error("Error al listar instrumentos:", error);
    return NextResponse.json(
      { error: "Error al listar instrumentos" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo instrumento
export async function POST(request: Request) {
  try {
    const data: Instrumento = await request.json();

    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : null;
    const familia = typeof data.familia === "string" ? data.familia.trim() : null;

    // Validación básica
    if (!nombre || !familia) {
      return NextResponse.json(
        { error: "Debe complentar todos los espacios del formulario" },
        { status: 400 }
      );
    }

    const nuevoInstrumento = await prisma.instrumento.create({
      data: { nombre, familia },
    });

    return NextResponse.json(nuevoInstrumento, { status: 201 });
  } catch (e) {
    console.error("Error al crear instrumento:", e);
    return NextResponse.json({ error: "Error al crear instrumento" }, { status: 500 });
  }
}
