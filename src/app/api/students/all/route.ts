import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener todos los estudiantes para la carga inicial de la tabla
export async function GET() {
    try {
        const estudiantes = await prisma.estudiante.findMany({});

        // Devuelve un array vacío si no hay estudiantes, con Status 200 OK.
        return NextResponse.json(estudiantes, { status: 200 });
    } catch (e) {
        console.error("Error al obtener todos los estudiantes:", e);
        return NextResponse.json({ error: "Error interno del servidor al cargar la lista de estudiantes." }, { status: 500 });
    }
}