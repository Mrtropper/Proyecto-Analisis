import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalize(value: unknown) {
  if (typeof value === "string") return value.trim().toLowerCase();
  return value;
}

function normalizeEstado(estado: unknown): string {
  if (typeof estado === "string") {
    const e = estado.trim().toLowerCase();

    if (e === "prestado") return "Prestado";
    if (e === "disponible") return "Disponible";
    if (e === "atrasado") return "Atrasado";
    if (e === "mantenimiento") return "Mantenimiento";

    return estado;
  }

  return String(estado);
}


// GET: Lista de préstamos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const simple = searchParams.get("simple") === "true";

    if (simple) {
      const prestamos = await prisma.prestamoInstrumento.findMany();
      return NextResponse.json(prestamos);
    }

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
          ...p,
          nombreInstrumento: instrumento?.nombre || "",
          EstadoInventario: inventario?.Estado || "",
        };
      })
    );

    return NextResponse.json(prestamosConDatos);
  } catch (e) {
    console.error("Error al listar préstamos:", e);
    return NextResponse.json(
      { error: "Error al listar préstamos" },
      { status: 500 }
    );
  }
}

// POST: Crear préstamo
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { idEstudiante, idInstrumento, idInventario, fechaEntrega, estatus } =
      data;

    if (!idEstudiante || !idInstrumento || !idInventario || !fechaEntrega) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const fecha = new Date(fechaEntrega);
    if (isNaN(fecha.getTime())) {
      return NextResponse.json(
        { error: "Fecha inválida" },
        { status: 400 }
      );
    }

    const inventario = await prisma.inventario.findUnique({
      where: { idInventario: String(idInventario) },
    });

    if (normalize(inventario?.Estado) === "prestado") {
      return NextResponse.json(
        { error: "El instrumento ya está prestado" },
        { status: 400 }
      );
    }

    const nuevoPrestamo = await prisma.prestamoInstrumento.create({
      data: {
        idEstudiante: Number(idEstudiante),
        idInstrumento: Number(idInstrumento),
        idInventario: String(idInventario),
        fechaEntrega: fecha,
        Estatus: normalizeEstado(estatus || "Prestado"),
      },
    });

    // Actualizar estado del inventario
    await prisma.inventario.update({
      where: { idInventario: String(idInventario) },
      data: { Estado: "Prestado" },
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
