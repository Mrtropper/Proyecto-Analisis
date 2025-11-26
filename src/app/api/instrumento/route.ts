
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Instrumento } from "@/types/Instrumento";


// GET: Buscar instrumentos por id o nombre
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const nombre = searchParams.get("nombre");

    // Buscar por ID
    if (id) {
      const inst = await prisma.instrumento.findUnique({
        where: { idInstrumento: Number(id) },
      });
      return NextResponse.json(inst ? [inst] : []);
    }

    // Buscar por nombre
    if (nombre) {
      const inst = await prisma.instrumento.findMany({
        where: {
          nombre: {
            contains: nombre
          }
        },
      });
      return NextResponse.json(inst);
    }

    // Sin filtros → devolver todo
    const all = await prisma.instrumento.findMany();
    return NextResponse.json(all);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error en GET instrumento" }, { status: 500 });
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
