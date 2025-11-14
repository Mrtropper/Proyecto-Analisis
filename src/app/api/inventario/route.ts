
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lista completa de instrumentos con sus datos de inventario y préstamo (si existen)
export async function GET() {
  try {
    // 1. Traer todos los instrumentos
    const instrumentos = await prisma.instrumento.findMany();

    // 2. Traer inventarios
    const inventarios = await prisma.inventario.findMany();

    const lista = await Promise.all(
      instrumentos.map(async (inst) => {
        // Buscar inventario asociado
        const inventario = inventarios.find(
          (inv) => inv.idInstrumento === inst.idInstrumento
        );

        // Si existe inventario, buscar préstamo
        let prestamo = null;
        if (inventario) {
          prestamo = await prisma.prestamoInstrumento.findFirst({
            where: { idInventario: inventario.idInventario },
            orderBy: { idPrestamo: "desc" },
          });
        }

        return {
          idInstrumento: inst.idInstrumento,
          nombreInstrumento: inst.nombre,

          // Inventario si existe
          idInventario: inventario?.idInventario || "",
          Estado: inventario?.Estado || "",

          // Préstamo si existe
          idEstudiante: prestamo?.idEstudiante || "",
          fechaEntrega: prestamo?.fechaEntrega || "",
        };
      })
    );

    return NextResponse.json(lista);
  } catch (e) {
    console.error("Error al listar inventario:", e);
    return NextResponse.json(
      { error: "Error al listar inventario" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { idInventario, idInstrumento, Estado } = data;

    // Validación mínima: el ID es el único obligatorio
    if (!idInventario ) {
      return NextResponse.json(
        { error: "El campo 'idInventario' es obligatorio." },
        { status: 400 }
      );
    }

    const nuevoInventario = await prisma.inventario.create({
      data: {
        idInventario: String(idInventario),
        idInstrumento: idInstrumento ? Number(idInstrumento) : null,
        Estado: Estado || "Disponible", //valor predeterminado
      },
    });

    return NextResponse.json(nuevoInventario, { status: 201 });
  } catch (e) {
    console.error("Error al crear inventario:", e);
    return NextResponse.json(
      { error: "Error al crear inventario"},
      { status: 500 }
    );
  }
}

