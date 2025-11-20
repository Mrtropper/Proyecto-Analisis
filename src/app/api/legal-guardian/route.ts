import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//GET: Obtener una encargado legal por el ID del estudiante
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        //Obtener el idEstudiante de los parámetros de consulta
        const idEstudiante = url.searchParams.get("idEstudiante"); 
        
        if (!idEstudiante) {
            return NextResponse.json({ error: "El ID de estudiante es requerido para consultar el encargado legal." }, { status: 400 });
        }
        
        const studentIdNumber = parseInt(idEstudiante, 10);
        
        if (isNaN(studentIdNumber)) {
             return NextResponse.json({ error: "ID de estudiante inválido." }, { status: 400 });
        }
        
        //Consulta a Prisma: busca el EncargadoLegal que tiene el idEstudiante
        const encargado = await prisma.encargadoLegal.findFirst({
            where: { 
                idEstudiante: studentIdNumber 
            },
        });
        
        if (!encargado) {
            // Devuelve 404 si no hay un encargado asociado a ese estudiante
            return NextResponse.json(
                { message: `No se encontró Encargado Legal para el estudiante ID: ${idEstudiante}` }, 
                { status: 404 }
            );
        }
        
        // Éxito: devuelve el objeto del encargado
        return NextResponse.json(encargado);
    } catch (e) {
        console.error("Error al buscar encargado legal:", e);
        return NextResponse.json({ error: "Error interno del servidor al buscar el encargado legal." }, { status: 500 });
    }
}

//PUT: Actualizar un encargado legal
export async function PUT(request: Request) {
    let data : any; 
    try{
        data = await request.json();

        //Validacion cedula
        if (!data.cedula || typeof data.cedula !== 'string' || data.cedula.trim() === '') {
            return NextResponse.json({ error: "El campo 'cedula' es requerido" }, { status: 400 });
        }
        const cedulaAActualizar = data.cedula.trim();

        // Preparar los datos para la actualización
        const { cedula, ...datosRestantes } = data;
        const datosParaActualizar: any = {};
        const stringFields = ['telefono', 'correo', 'lugarTrabajo', 'ocupacion'];

        stringFields.forEach((field, index) => {
            if (datosRestantes[field] !== undefined) {
                datosParaActualizar[field] = typeof datosRestantes[field] === null ? null : String(datosRestantes[field]).trim();
            }
        });

        // Actualizar el encargado legal en la base de datos
        const encargadoLegalActualizado = await prisma.encargadoLegal.updateMany({
            where: { cedula: cedulaAActualizar },
            data: datosParaActualizar,
        });
        return NextResponse.json(encargadoLegalActualizado);
    }catch (e) {
        // Encargado legal no encontrado
        if (e && typeof e === 'object' && 'code' in e && e.code === 'P2025') {
            return NextResponse.json(
                { error: `Encargado legal con cédula ${data.cedula} no encontrado.` },
                { status: 404 } // Not Found
            );
        }
        // Error interno
        return NextResponse.json(
            { error: "Error interno del servidor al actualizar el encargado legal." },
            { status: 500}
        );
    }
}