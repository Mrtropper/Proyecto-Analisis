
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista de préstamos (simple o con detalles)
export async function GET(request: Request) 
{
  try 
  {
    const { searchParams } = new URL(request.url);
    const simple = searchParams.get("simple") === "true";

    // Si simple = true → devolver solo la tabla base
    if (simple) 
    {
      const prestamos = await prisma.prestamoInstrumento.findMany();
      return NextResponse.json(prestamos);
    }

    // Si simple = false → devolver lista enriquecida
    const prestamos = await prisma.prestamoInstrumento.findMany();

    const prestamosConDatos = await Promise.all(
      prestamos.map(async (p) => {
        const instrumento = await prisma.instrumento.findUnique({
          where: { idInstrumento: p.idInstrumento },
        });

        const inventario = await prisma.inventario.findUnique({
          where: { idInventario: p.idInventario },
        });

        return {
          idPrestamo: p.idPrestamo,
          idEstudiante: p.idEstudiante,
          fechaEntrega: p.fechaEntrega,
          Estatus: p.Estatus,
          idInstrumento: p.idInstrumento,

          // Datos adicionales
          nombreInstrumento: instrumento?.nombre || "",
          EstadoInventario: inventario?.Estado || "",
        };
      })
    );

    return NextResponse.json(prestamosConDatos);
  } catch (e) 
  {
    console.error("Error al listar préstamos:", e);
    return NextResponse.json
    (
      { error: "Error al listar préstamos" },
      { status: 500 }
    );
  }
}


// POST: Crear un nuevo préstamo
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { idEstudiante, idInstrumento, idInventario, fechaEntrega, estatus } = data;

    // Validación de campos obligatorios
    if (!idEstudiante || !idInstrumento || !idInventario || !fechaEntrega) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Validación de fecha
    const fecha = new Date(fechaEntrega);
    if (isNaN(fecha.getTime())) {
      return NextResponse.json(
        { error: "La fecha proporcionada no es válida." },
        { status: 400 }
      );
    }

    // Verificar si el inventario ya está Prestado
    const inventario = await prisma.inventario.findUnique({
      where: { idInventario: String(idInventario) }
    });

    if (inventario?.Estado?.toLowerCase() === "prestado") {
      return NextResponse.json(
        { error: "El instrumento ya está prestado y no se puede asignar nuevamente." },
        { status: 400 }
      );
    }

    // Crear el préstamo
    const nuevoPrestamo = await prisma.prestamoInstrumento.create({
      data: {
        idEstudiante: Number(idEstudiante),
        idInstrumento: Number(idInstrumento),
        idInventario: String(idInventario),
        fechaEntrega: fecha,
        Estatus: estatus || "Prestado",
      },
    });

    return NextResponse.json(nuevoPrestamo, { status: 201 });

  } catch (e) {
    console.error("Error al crear préstamo:", e);
    return NextResponse.json(
      { error: "Error al crear préstamo" },
      { status: 500 }
    );
  }
}
