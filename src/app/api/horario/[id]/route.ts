import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const horario = await prisma.horario.update({
      where: { idHorario: Number(params.id) },
      data: {
        dia: data.dia,
        horario: data.horario,
        // idProfesor eliminado - se maneja en ProfesorHorario
      },
    });
    return NextResponse.json(horario);
  } catch (error) {
    return NextResponse.json({ error: "Error al editar horario" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Primero eliminar las relaciones en ProfesorHorario
    await prisma.profesorHorario.deleteMany({
      where: { idHorario: Number(params.id) },
    });

    // Luego eliminar el horario
    await prisma.horario.delete({
      where: { idHorario: Number(params.id) },
    });

    return NextResponse.json({ message: "Horario eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar horario" }, { status: 500 });
  }
}
