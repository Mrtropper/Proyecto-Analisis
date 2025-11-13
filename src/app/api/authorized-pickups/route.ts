import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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