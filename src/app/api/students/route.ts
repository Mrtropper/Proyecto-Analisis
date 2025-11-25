import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//POST: Crear un nuevo estudiante, encargado legal y autorizado a recoger
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { estudiante, encargadoLegal, autorizadoRetiro } = data;
        if (!estudiante || !encargadoLegal || !autorizadoRetiro) {
            return NextResponse.json({ error: "Faltan datos requeridos (estudiante, encargado legal o autorizado a recoger)" }, { status: 400 });
        }

        if (estudiante.idPrograma) estudiante.idPrograma = Number(estudiante.idPrograma);
        if (estudiante.fechaNacimiento) estudiante.fechaNacimiento = new Date(estudiante.fechaNacimiento);

        // Estudiante (Cédula y Nombre Completo)
        if (!estudiante.cedula || !estudiante.nombreCompleto) {
            return NextResponse.json({ error: "Estudiante: Cédula y Nombre Completo son requeridos." }, { status: 400 });
        }

        // Encargado Legal (Cédula y Nombre)
        if (!encargadoLegal.cedula || !encargadoLegal.nombre) {
            return NextResponse.json({ error: "Encargado Legal: Cédula y Nombre son requeridos." }, { status: 400 });
        }

        // Autorizado a Recoger (Nombre)
        if (!autorizadoRetiro.nombre) {
            return NextResponse.json({ error: "Autorizado a Retiro: Nombre es requerido." }, { status: 400 });
        }

        //Escritura anidada en la base de datos
        const nuevoRegistroCompleto = await prisma.estudiante.create({
            data: {
                ...estudiante,
                encargadoLegal: {
                    create: { ...encargadoLegal }
                },
                autorizadoRetiro: {
                    create: { ...autorizadoRetiro }
                }
            }
        });
        return NextResponse.json(nuevoRegistroCompleto, { status: 201 });
    } catch (e) {
        console.error("Error en Transacción de Creación Completa:", e);

        // Manejo de error de unicidad (ej: cédula duplicada P2002)
        if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
            return NextResponse.json(
                { error: "Conflicto de datos: Una cédula (Estudiante/Encargado/Autorizado) ya existe." },
                { status: 409 } // Conflict
            );
        }

        // Error general
        return NextResponse.json(
            { error: "Error interno del servidor al crear el registro completo." },
            { status: 500 }
        );
    }
}


// GET: Listar todos los estudiantes
export async function GET() {
  try {
    const estudiante = await prisma.estudiante.findMany({
      select: {
        idEstudiante: true,
        nombreCompleto: true,
        cedula: true,
      },
    });

    return NextResponse.json(estudiante);
  } catch (error) {
    console.error("Error al listar estudiante:", error);
    return NextResponse.json(
      { error: "Error al listar estudiante" },
      { status: 500 }
    );
  }
}





