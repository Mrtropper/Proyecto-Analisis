import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Asignar profesor a horario
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const profesorHorario = await prisma.profesorHorario.create({
      data: {
        idProfesor: data.idProfesor,
        idHorario: data.idHorario,
      },
    });
    return NextResponse.json(profesorHorario, { status: 201 });
  } catch (error) {
    console.error("Error al asignar profesor a horario:", error);
    return NextResponse.json({ error: "Error al asignar profesor a horario" }, { status: 500 });
  }
}

// Obtener todas las relaciones
export async function GET() {
  try {
    const relaciones = await prisma.profesorHorario.findMany({
      include: {
        profesor: true,
        horario: true
      }
    });
    return NextResponse.json(relaciones);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener relaciones" }, { status: 500 });
  }
}