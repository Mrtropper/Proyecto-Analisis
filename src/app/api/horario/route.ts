import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Ajusta los campos según tu modelo Horario en schema.prisma
    const horario = await prisma.horario.create({
      data: {
        dia: data.dia,
        horario: data.horario,
        idProfesor: data.idProfesor
      },
    });
    return NextResponse.json(horario, { status: 201 });
  } catch (error) {
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
