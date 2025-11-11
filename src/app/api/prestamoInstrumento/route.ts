
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Listar todos los préstamos
export async function GET() {
  try {
    const prestamos = await prisma.prestamoInstrumento.findMany();

    return NextResponse.json(prestamos);
  } catch (e) {
    console.error("Error al listar préstamos:", e);
    return NextResponse.json(
      { error: "Error al listar préstamos" },
      { status: 500 }
    );
  }
}


// POST: Crear un nuevo préstamo
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { idPrestamo, idEstudiante, idInstrumento, idInventario, fechaEntrega, Estatus } = data;

    if (!idPrestamo || !idEstudiante || !idInstrumento || !idInventario) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevoPrestamo = await prisma.prestamoInstrumento.create({
      data: {
        idPrestamo: Number(idPrestamo),
        idEstudiante: Number(idEstudiante),
        idInstrumento: Number(idInstrumento),
        idInventario: String (idInventario),
        fechaEntrega: fechaEntrega ? new Date(fechaEntrega) : null,
        Estatus: Estatus || "Pendiente",
      },
    });

    return NextResponse.json(nuevoPrestamo, { status: 201 });
  } catch (e) {
    console.error("Error al crear préstamo:", e);
    return NextResponse.json({ error: "Error al crear préstamo"}, { status: 500 });
  }
}


