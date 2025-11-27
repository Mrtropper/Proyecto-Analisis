import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener todos los estudiantes para el dropdown
export async function GET() {
  try {
    const estudiantes = await prisma.estudiante.findMany({
      select: {
        idEstudiante: true,
        nombreCompleto: true,
        cedula: true,
      },
      where: {
        status: 'A' // Solo estudiantes activos
      },
      orderBy: {
        nombreCompleto: 'asc'
      }
    });

    return NextResponse.json(estudiantes);
  } catch (error) {
    console.error('Error en GET /api/estudiantes:', error);
    return NextResponse.json({ error: 'Error al obtener estudiantes' }, { status: 500 });
  }
}