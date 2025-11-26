
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: {
    id: string;
  };
}

// GET: Buscar instrumentos por id o nombre
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const nombre = searchParams.get("nombre");

    //Buscar por ID
    if (id) {
      const instrumento = await prisma.instrumento.findUnique({
        where: { idInstrumento: Number(id) },
        select: {
          idInstrumento: true,
          nombre: true,
        },
      });

      if (!instrumento) {
        return NextResponse.json(
          { error: "Instrumento no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(instrumento);
    }

    // Buscar por nombre
    if (nombre) {
      const instrumentos = await prisma.instrumento.findMany({
        where: {
          OR: [
            { nombre: { contains: nombre } },
            { nombre: { contains: nombre.toLowerCase() } },
            { nombre: { contains: nombre.toUpperCase() } },
          ],
        },
        select: {
          idInstrumento: true,
          nombre: true,
        },
      });

      return NextResponse.json(instrumentos);
    }

    return NextResponse.json([]);

  } catch (error) {
    console.error("Error en búsqueda de instrumento:", error);
    return NextResponse.json(
      { error: "Error al buscar instrumento" },
      { status: 500 }
    );
  }
}



// PUT: Editar un instrumento
export async function PUT(request: Request, context: Context) {
  try {
    const id = Number(context?.params?.id);
    const data = await request.json();

    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : null;
    const familia = typeof data.familia === "string" ? data.familia.trim() : null;

    if (!nombre || !familia) {
      return NextResponse.json(
        { error: "Nombre y familia son requeridos" },
        { status: 400 }
      );
    }

    const instrumentoActualizado = await prisma.instrumento.update({
      where: { idInstrumento: id },
      data: { nombre, familia },
    });

    return NextResponse.json(instrumentoActualizado);
  } catch (e) {
    return NextResponse.json(
      { error: "Error al editar instrumento", details: e },
      { status: 500 }
    );
  }
}

// DELETE instrumento
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    //Buscar inventarios asociados
    const inventarios = await prisma.inventario.findMany({
      where: { idInstrumento: Number(id) },
    });

    //Si existe inventario asociado
    if (inventarios.length > 0) {
      // 3. Verificar si alguno está prestado o atrasado
      const tienePrestados = inventarios.some(
        (inv) => inv.estado === "Prestado" || inv.estado === "Atrasado"
      );

      if (tienePrestados) {
        return NextResponse.json(
          {
            error:
              "No se puede eliminar el instrumento porque esta prestado.",
          },
          { status: 403 }
        );
      }
    }

    // Eliminación normal
    await prisma.instrumento.delete({
      where: { idInstrumento: Number(id) },
    });

    return NextResponse.json({
      message: "Instrumento eliminado correctamente",
    });
  } catch (e) {
    console.error("Error al eliminar instrumento:", e);
    return NextResponse.json(
      { error: "Error al eliminar instrumento" },
      { status: 500 }
    );
  }
}
