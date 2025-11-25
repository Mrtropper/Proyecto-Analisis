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

//GET: Obtener todos los estudiante o un estudiante por cédula o nombre o id
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const cedula = url.searchParams.get("cedula");
        const nombreCompleto = url.searchParams.get("nombreCompleto");
        const idEstudiante = url.searchParams.get("idEstudiante");

        const where: any = {};
        let hasSearchCriteria = false;

        if (idEstudiante) {
            const studentId = parseInt(idEstudiante, 10);
            
            // Validar que el ID sea un número válido
            if (isNaN(studentId)) {
                 return NextResponse.json({ error: "El ID de estudiante proporcionado no es válido." }, { status: 400 });
            }
            
            // Asignar el ID (que es un número) al objeto where
            where.idEstudiante = studentId; 
            hasSearchCriteria = true;
        } 
        
        // 2. Si NO hay ID, buscar por Cédula (Búsqueda exacta)
        else if (cedula) {
            const cleanCedula = cedula.trim().replace(/-/g,'');
            where.cedula = cleanCedula;
            hasSearchCriteria = true;
        }
        
        // 3. Si NO hay ID ni Cédula, buscar por Nombre (Búsqueda por coincidencia)
        else if (nombreCompleto) {
            where.nombreCompleto = {
                contains: nombreCompleto.trim()
                // Opcional: Agregar mode: 'insensitive' si tu base de datos lo soporta
            };
            hasSearchCriteria = true;
        }

        const estudiantes = await prisma.estudiante.findMany({ where });

        if (estudiantes.length === 0 && (cedula || nombreCompleto)) {
            return NextResponse.json({ message: "No se encontraron estudiantes con los criterios de búsqueda proporcionados." }, { status: 404 });
        }

        return NextResponse.json(estudiantes);
    } catch (e) {
        console.error("Error al buscar estudiantes:", e);
        return NextResponse.json({ error: "Error al buscar estudiantes" }, { status: 500 });
    }
}

//PUT: Editar un estudiante
export async function PUT(request: Request) {
    let data: any;
    try {
        data = await request.json();

        //Validacion Cedula
        if (!data.cedula || typeof data.cedula !== "string" || data.cedula.trim() === "") {
            return NextResponse.json({ error: "El campo 'cedula' es requerido" }, { status: 400 });
        }
        const cedulaAActualizar = data.cedula.trim();

        // Preparar los datos para la actualización
        const { cedula, ...datosRestantes } = data;
        const datosParaActualizar: any = {};

        const stringFields = ['genero', 'nacionalidad',
            'telefono', 'correo', 'direccion', 'gradoEscolar', 'institucion','numeroPoliza', 'discapacidad', 'detalles'
        ];

        stringFields.forEach((field, index) => {
            if (datosRestantes[field] !== undefined) {
                datosParaActualizar[field] = typeof datosRestantes[field] === null ? null : String(datosRestantes[field]).trim();
            }
        });

        if (datosRestantes.fechaNacimiento !== undefined) {
            datosParaActualizar.fechaNacimiento = datosRestantes.fechaNacimiento === null ? null : new Date(datosRestantes.fechaNacimiento);
        }

        // Actualizar el estudiante en la base de datos
        const estudianteActualizado = await prisma.estudiante.update({
            where: { cedula: cedulaAActualizar },
            data: datosParaActualizar,
        });
        return NextResponse.json(estudianteActualizado);

    } catch (e) {
        // Estudiante no encontrado
        if (e && typeof e === 'object' && 'code' in e && e.code === 'P2025') {
            return NextResponse.json(
                { error: `Estudiante con cédula ${data.cedula} no encontrado.` },
                { status: 404 } // Not Found
            );
        }

        // Error interno
        return NextResponse.json(
            { error: "Error interno del servidor al actualizar el estudiante." },
            { status: 500 }
        );
    }
}

//PATCH: Actualizar solo el campo 'status' de un estudiante por cédula
export async function PATCH(request: Request) {
    let data: any;
    try {
        data = await request.json();

        // 1. Validación de campos requeridos
        if (!data.cedula || typeof data.cedula !== "string" || data.cedula.trim() === "") {
            return NextResponse.json({ error: "El campo 'cedula' es requerido para identificar al estudiante." }, { status: 400 });
        }
        // Validamos la nueva variable 'status'
        if (!data.status || typeof data.status !== "string" || data.status.trim() === "") {
            return NextResponse.json({ error: "El campo 'status' es requerido para la actualización." }, { status: 400 });
        }

        const cedulaAActualizar = data.cedula.trim();
        const nuevoEstado = data.status.trim(); // Usamos 'status'

        // 2. Actualizar solo el campo 'status'
        const estudianteActualizado = await prisma.estudiante.update({
            where: { cedula: cedulaAActualizar },
            data: {
                status: nuevoEstado, // Campo actualizado a 'status'
            },
            // Seleccionar campos clave para la respuesta
            select: {
                idEstudiante: true,
                nombreCompleto: true,
                cedula: true,
                // Asegúrate de que este campo exista en tu modelo
                status: true, 
            }
        });

        return NextResponse.json(estudianteActualizado);

    } catch (e) {
        // Manejo de error de estudiante no encontrado (P2025 de Prisma)
        if (e && typeof e === 'object' && 'code' in e && e.code === 'P2025') {
            return NextResponse.json(
                { error: `Estudiante con cédula ${data?.cedula || 'desconocida'} no encontrado.` },
                { status: 404 } // Not Found
            );
        }

        console.error("Error en PATCH de Estado de Matrícula:", e);
        // Error general
        return NextResponse.json(
            { error: "Error interno del servidor al actualizar el estado de matrícula." },
            { status: 500 }
        );
    }
}
