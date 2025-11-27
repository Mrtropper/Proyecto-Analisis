import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todas las asignaciones profesor-horario
export async function GET() {
  try {
    const data = await prisma.profesorHorario.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error GET profesorHorario:", error);
    return NextResponse.json(
      { error: "Error al obtener asignaciones" },
      { status: 500 }
    );
  }
}

// POST - Crear asignación
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nuevaAsignacion = await prisma.profesorHorario.create({
      data: {
        idProfesor: body.idProfesor,
        idHorario: body.idHorario,
      },
    });

    return NextResponse.json(nuevaAsignacion);
  } catch (error) {
    console.error("Error POST profesorHorario:", error);
    return NextResponse.json(
      { error: "Error al crear asignación" },
      { status: 500 }
    );
  }
}
