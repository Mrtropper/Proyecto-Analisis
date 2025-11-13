import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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