
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
export async function POST(request: Request) 
{
  try 
  {
    const data = await request.json();
    const { idEstudiante, idInstrumento, idInventario, fechaEntrega, estatus } = data;

    // Validación: estatus NO es obligatorio porque el esquema tiene default
    if (!idEstudiante || !idInstrumento || !idInventario || !fechaEntrega) 
    {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevoPrestamo = await prisma.prestamoInstrumento.create({
      data: 
      {
        idEstudiante: Number(idEstudiante),
        idInstrumento: Number(idInstrumento),
        idInventario: String(idInventario),
        fechaEntrega: new Date(fechaEntrega),

        // Prisma usa el nombre EXACTO del campo: Estatus
        Estatus: estatus || "Prestado"
      },
    });

    return NextResponse.json(nuevoPrestamo, { status: 201 });
  } catch (e) {
    console.error("Error al crear préstamo:", e);
    return NextResponse.json({ error: "Error al crear préstamo"}, { status: 500 });
  }
}
