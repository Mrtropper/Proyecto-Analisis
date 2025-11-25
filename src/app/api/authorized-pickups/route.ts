import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//GET: Obtener una persona autorizada a recoger por el ID del estudiante
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        //Obtener el idEstudiante de los parámetros de consulta
        const idEstudiante = url.searchParams.get("idEstudiante"); 
        
        if (!idEstudiante) {
            return NextResponse.json({ error: "El ID de estudiante es requerido para consultar el autorizado a retirar." }, { status: 400 });
        }
        
        const studentIdNumber = parseInt(idEstudiante, 10);
        
        if (isNaN(studentIdNumber)) {
             return NextResponse.json({ error: "ID de estudiante inválido." }, { status: 400 });
        }
        
        //Consulta a Prisma: busca el AutorizadoRetiro que tiene el idEstudiante
        const autorizado = await prisma.autorizadoRetiro.findFirst({
            where: { 
                idEstudiante: studentIdNumber 
            },
        });
        
        if (!autorizado) {
            // Devuelve 404 si no hay un autorizado asociado a ese estudiante
            return NextResponse.json(
                { message: `No se encontró Persona Autorizada para el estudiante ID: ${idEstudiante}` }, 
                { status: 404 }
            );
        }
        
        // Éxito: devuelve el objeto del autorizado
        return NextResponse.json(autorizado);
    } catch (e) {
        console.error("Error al buscar autorizado a retirar:", e);
        return NextResponse.json({ error: "Error interno del servidor al buscar el autorizado a retirar." }, { status: 500 });
    }
}

//PUT: Actualizar un autorizado a recoger
export async function PUT(request: Request) {
    let data : any;
    try{
        data = await request.json();

        //Validacion cedula
        if (!data.nombre || typeof data.nombre !== "string" || data.nombre.trim() === "") {
            return NextResponse.json({ 
                error: "El campo 'nombre' del autorizado a retirar el estudiar es requerido para la actualización." 
            }, { status: 400 });
        }
        const nombreAActualizar = data.nombre.trim();

        // Validacion telefono
        if (data.telefono === undefined || data.telefono === null) {
            return NextResponse.json({ 
                error: "El campo 'telefono' es requerido para actualizar." 
            }, { status: 400 });
        }
        const telefonoActualizar = String(data.telefono).trim();

        const autorizadoActualizado = await prisma.autorizadoRetiro.updateMany({
            where: { nombre: nombreAActualizar },
            data: {
                telefono: telefonoActualizar,
            },
        });

        return NextResponse.json(autorizadoActualizado);

    } catch (e) {
        // Autorizado no encontrado
        if (e && typeof e === 'object' && 'code' in e && e.code === 'P2025') {
            return NextResponse.json(
                { error: `Autorizado a retirar el estudiante con el nombre ${data.nombre} no encontrado.` },
                { status: 404 } // Not Found
            );
        }
        // Error interno
        return NextResponse.json(
            { error: "Error interno del servidor al actualizar el autorizado a recoger." },
            { status: 500 }
        );
    }
}