//src/app/api/students/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


interface Segments {
    params: {
        id: string;
    };
}

//DELETE: Eliminar un estudiante por id
export async function DELETE(_request: Request, { params }: Segments) {
    try {
        const idEstudianteStr = params?.id;

        if (!idEstudianteStr || isNaN(Number(idEstudianteStr))) {
            return NextResponse.json(
                { error: "ID de estudiante no válido o faltante." },
                { status: 400 } // Bad Request
            );
        }

        const idEstudianteNum = Number(idEstudianteStr);

        await prisma.estudiante.delete({ where: { idEstudiante: Number(idEstudianteNum) } });

        return NextResponse.json({ message: "Estudiante eliminado" });
    } catch (e) {
        return NextResponse.json({ error: "Error al eliminar estudiante" }, { status: 500 });
    }
}

// GET: Consultar un instrumento por ID
export async function GET(_request: Request, { params }: Segments) {
    try {
        const idEstudianteStr = params?.id;
        if (!idEstudianteStr || isNaN(Number(idEstudianteStr))) {
            return NextResponse.json(
                { error: "ID de estudiante no válido o faltante." },
                { status: 400 }
            );
        }

        const idEstudianteNum = Number(idEstudianteStr);

        const estudiante = await prisma.estudiante.findUnique({
            where: { idEstudiante: idEstudianteNum },
        });

        if (!estudiante) {
            return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
        }

        return NextResponse.json(estudiante);
    } catch (e) {
        return NextResponse.json({ error: "Error al consultar estudiante" }, { status: 500 });
    }
}

//PUT: Editar un estudiante por id
export async function PUT(request: Request, { params }: Segments) {
    try {
        const idEstudianteStr = params?.id;

        // 1. Validar y convertir el ID
        if (!idEstudianteStr || isNaN(Number(idEstudianteStr))) {
            return NextResponse.json(
                { error: "ID de estudiante no válido o faltante." },
                { status: 400 } // Bad Request
            );
        }

        const idEstudianteNum = Number(idEstudianteStr);

        // 2. Obtener los datos del cuerpo de la solicitud
        const dataToUpdate = await request.json();

        // 3. Verificar si el estudiante existe antes de intentar actualizar
        const estudianteExistente = await prisma.estudiante.findUnique({
            where: { idEstudiante: idEstudianteNum },
        });

        if (!estudianteExistente) {
            return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
        }

        // 4. Actualizar el estudiante en la base de datos
        const estudianteActualizado = await prisma.estudiante.update({
            where: { idEstudiante: idEstudianteNum },
            data: dataToUpdate,
        });

        return NextResponse.json(estudianteActualizado, { status: 200 });

    } catch (e) {
        console.error(e);
        // Podrías añadir más manejo de errores para datos incorrectos (ej. 400 Bad Request)
        // si se usan validaciones más estrictas en el `dataToUpdate`.
        return NextResponse.json({ error: "Error al actualizar estudiante" }, { status: 500 });
    }
}

// PATCH: Actualizar solo el campo status por id
export async function PATCH(request: Request, { params }: Segments) {
    try {
        const idEstudianteStr = params?.id;

        // 1. Validar y convertir el ID
        if (!idEstudianteStr || isNaN(Number(idEstudianteStr))) {
            return NextResponse.json(
                { error: "ID de estudiante no válido o faltante." },
                { status: 400 } 
            );
        }

        const idEstudianteNum = Number(idEstudianteStr);

        // 2. Obtener solo el campo 'status' del cuerpo de la solicitud
        const body = await request.json();
        const { status } = body; 

        // 3. Validar que el campo 'status' esté presente para una actualización de estado
        if (typeof status === 'undefined') {
             return NextResponse.json(
                { error: "El campo 'status' es requerido para esta operación PATCH." },
                { status: 400 }
            );
        }

        // 4. Actualizar solo el campo 'status'
        const estudianteActualizado = await prisma.estudiante.update({
            where: { idEstudiante: idEstudianteNum },
            data: { 
                status: status, 
            },
        });

        return NextResponse.json(estudianteActualizado, { status: 200 });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error al actualizar el estado del estudiante" }, { status: 500 });
    }
}
