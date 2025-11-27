import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener todos los horarios con sus profesores y estudiantes asignados
export async function GET() {
  try {
    // Obtener todos los horarios con profesores usando raw query
    const horariosConProfesores: any[] = await prisma.$queryRaw`
      SELECT 
        ph.idProfesor,
        ph.idHorario,
        p.nombreCompleto as nombreProfesor,
        h.dia,
        h.horario
      FROM ProfesorHorario ph
      INNER JOIN Profesor p ON ph.idProfesor = p.idProfesor
      INNER JOIN Horario h ON ph.idHorario = h.idHorario
    `;

    // Obtener estudiantes asignados por profesor usando raw query
    const estudiantesPorProfesor: any[] = await prisma.$queryRaw`
      SELECT 
        ep.idProfesor,
        e.idEstudiante,
        e.nombreCompleto,
        e.cedula
      FROM EstudianteProfesor ep
      INNER JOIN Estudiante e ON ep.idEstudiante = e.IdEstudiante
      WHERE e.Status = 'A'
    `;

    // Transformar los datos para el frontend
    const cuposData = horariosConProfesores.map(item => {
      const estudiantesAsignados = estudiantesPorProfesor
        .filter(est => est.idProfesor === item.idProfesor)
        .map(est => ({
          idEstudiante: est.idEstudiante,
          nombreCompleto: est.nombreCompleto || '',
          cedula: est.cedula
        }));

      const CUPOS_MAXIMOS = 15;
      const cuposDisponibles = Math.max(0, CUPOS_MAXIMOS - estudiantesAsignados.length);

      return {
        idHorario: item.idHorario,
        idProfesor: item.idProfesor,
        nombreProfesor: item.nombreProfesor || '',
        dia: item.dia,
        horario: item.horario,
        estudiantesAsignados,
        cuposDisponibles
      };
    });

    return NextResponse.json(cuposData);
  } catch (error) {
    console.error('Error en GET /api/profesorCupos:', error);
    return NextResponse.json({ error: 'Error al obtener datos de cupos' }, { status: 500 });
  }
}

// POST: Asignar estudiante a profesor
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { idProfesor, idEstudiante } = data;

    // Verificar si ya existe la relación usando raw query
    const [existeRelacion]: any[] = await prisma.$queryRaw`
      SELECT 1 FROM EstudianteProfesor 
      WHERE idEstudiante = ${idEstudiante} AND idProfesor = ${idProfesor}
    `;

    if (existeRelacion) {
      return NextResponse.json(
        { error: 'El estudiante ya está asignado a este profesor' },
        { status: 400 }
      );
    }

    // Verificar límite de cupos
    const [conteo]: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM EstudianteProfesor 
      WHERE idProfesor = ${idProfesor}
    `;

    if (conteo.total >= 15) {
      return NextResponse.json(
        { error: 'No hay cupos disponibles para este profesor (máximo 15 estudiantes)' },
        { status: 400 }
      );
    }

    // Crear la relación
    await prisma.$executeRaw`
      INSERT INTO EstudianteProfesor (idEstudiante, idProfesor)
      VALUES (${idEstudiante}, ${idProfesor})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/profesorCupos:', error);
    return NextResponse.json({ error: 'Error al asignar estudiante' }, { status: 500 });
  }
}

// DELETE: Quitar estudiante de profesor
export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const { idProfesor, idEstudiante } = data;

    const result: any = await prisma.$executeRaw`
      DELETE FROM EstudianteProfesor 
      WHERE idEstudiante = ${idEstudiante} AND idProfesor = ${idProfesor}
    `;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'La relación estudiante-profesor no existe' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Estudiante eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en DELETE /api/profesorCupos:', error);
    return NextResponse.json({ error: 'Error al eliminar estudiante' }, { status: 500 });
  }
}