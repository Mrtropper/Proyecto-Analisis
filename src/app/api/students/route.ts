import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function POST(request: Request) {
    try {
        const data = await request.json();
        const cedula = typeof data.cedula === "string" ? data.cedula.trim() : null;
        const nombreCompleto = typeof data.nombreCompleto === "string" ? data.nombreCompleto.trim() : null;
        const genero = typeof data.genero === "string" ? data.genero.trim() : null;
        const nacionalidad = typeof data.nacionalidad === "string" ? data.nacionalidad.trim() : null;
        const fechaNacimiento = typeof data.fechaNacimiento === "string" ? new Date(data.fechaNacimiento) : null;
        const telefono = typeof data.telefono === "string" ? data.telefono.trim() : null;
        const correo = typeof data.correo === "string" ? data.correo.trim() : null;
        const direccion = typeof data.direccion === "string" ? data.direccion.trim() : null;
        const gradoEscolar = typeof data.gradoEscolar === "string" ? data.gradoEscolar.trim() : null;
        const institucion = typeof data.institucion === "string" ? data.institucion.trim() : null;
        const lugarTrabajo = typeof data.lugarTrabajo === "string" ? data.lugarTrabajo.trim() : null;
        const ocupacion = typeof data.ocupacion === "string" ? data.ocupacion.trim() : null;
        const numeroPoliza = typeof data.numeroPoliza === "string" ? data.numeroPoliza.trim() : null;
        const discapacidad = typeof data.discapacidad === "string" ? data.discapacidad.trim() : null;
        const detalles = typeof data.detalles === "string" ? data.detalles.trim() : null;
        const idPrograma = typeof data.idPrograma === "number" ? data.idPrograma : null;

        if (!cedula || !nombreCompleto || !idPrograma) {
            return NextResponse.json({ error: "Faltan campos requeridos (cedula, nombre completo o idPrograma)" }, { status: 400 });
        }

        const nuevoEstudiante = await prisma.estudiante.create({
            data: {
                cedula,
                nombreCompleto,
                genero,
                nacionalidad,
                fechaNacimiento,
                telefono,
                correo,
                direccion,
                gradoEscolar,
                institucion,
                lugarTrabajo,
                ocupacion,
                numeroPoliza,
                discapacidad,
                detalles,
                idPrograma,
            },
        });
        return NextResponse.json(nuevoEstudiante, { status: 201 });

    } catch (e) {
        return NextResponse.json({ error: "Error al crear estudiante" }, { status: 500 });
    }
}

//PUT: Editar un estudiante
export async function PUT(request: Request) {
    let data: any;
    try {
        data = await request.json();
        
        //Validacion Cedula
        if (!data.cedula || typeof data.cedula !== "string" || data.cedula.trim() === "") {
            return NextResponse.json({ error: "El campo 'cedula' es requerido y debe ser una cadena no vacía." }, { status: 400 });
        }
        const cedulaAActualizar = data.cedula.trim();

        // Preparar los datos para la actualización
        const { cedula, ...datosRestantes } = data;
        const datosParaActualizar: any = {};

        const stringFields = ['genero', 'nacionalidad',
            'telefono', 'correo', 'direccion', 'gradoEscolar', 'institucion',
            'lugarTrabajo', 'ocupacion', 'numeroPoliza', 'discapacidad', 'detalles'
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
