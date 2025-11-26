import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Usar el método unchecked para evitar el problema de relaciones
    const horario = await prisma.horario.create({
      data: {
        dia: data.dia,
        horario: data.horario,
        // No incluir relaciones aquí
      } as any, // Usar 'as any' para evitar el error de TypeScript
    });
    
    return NextResponse.json(horario, { status: 201 });
  } catch (error) {
    console.error("Error al crear horario:", error);
    return NextResponse.json({ error: "Error al crear horario" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const horarios = await prisma.horario.findMany();
    return NextResponse.json(horarios);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 });
  }
}