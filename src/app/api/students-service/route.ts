import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//POST: Crear un nuevo estudiante servicio
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