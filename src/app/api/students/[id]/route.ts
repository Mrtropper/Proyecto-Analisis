import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Segments {
    params: {
        id: string;
    };
}

//DELETE: Eliminar un estudiante
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