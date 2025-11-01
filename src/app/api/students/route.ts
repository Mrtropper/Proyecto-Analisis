import { NextResponse } from "next/server";

/**
 * API stub para estudiantes.
 * Almacenamiento en memoria (provisional) porque la DB aún no está lista.
 * Soporta GET (listar), POST (crear), DELETE (eliminar por id en body).
 */

type Student = { id: number; nombre: string; edad: number; instrumento: string; profesor: string };

// Datos en memoria: iniciamos con algunos ejemplos
let students: Student[] = [
  { id: 1, nombre: 'Ana Pérez', edad: 12, instrumento: 'Piano', profesor: 'Mario' },
  { id: 2, nombre: 'Luis Gómez', edad: 15, instrumento: 'Guitarra', profesor: 'Laura' },
];

let nextId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;

export async function GET() {
  try {
    return NextResponse.json(students);
  } catch (e) {
    console.error('GET /api/students error', e);
    return NextResponse.json({ error: 'Error al obtener estudiantes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : '';
    const edad = typeof data.edad === 'number' ? data.edad : Number(data.edad);
    const instrumento = typeof data.instrumento === 'string' ? data.instrumento.trim() : '';
    const profesor = typeof data.profesor === 'string' ? data.profesor.trim() : '';

    if (!nombre) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    if (!Number.isFinite(Number(edad))) return NextResponse.json({ error: 'La edad es requerida' }, { status: 400 });
    if (!instrumento) return NextResponse.json({ error: 'El instrumento es requerido' }, { status: 400 });
    if (!profesor) return NextResponse.json({ error: 'El profesor es requerido' }, { status: 400 });

    // Verificación provisional de rol ADMIN via header 'x-user-roles'
    const rolesHeader = request.headers.get('x-user-roles') || '';
    const allowed = rolesHeader.split(',').map(r => r.trim().toUpperCase()).includes('ADMIN');
    if (!allowed) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

    const nuevo: Student = { id: nextId++, nombre, edad: Number(edad), instrumento, profesor };
    students.push(nuevo);
    return NextResponse.json(nuevo);
  } catch (e) {
    console.error('POST /api/students error', e);
    return NextResponse.json({ error: 'Error al crear estudiante' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const id = Number(data?.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    // Verificación provisional de rol ADMIN via header 'x-user-roles'
    const rolesHeader = request.headers.get('x-user-roles') || '';
    const allowed = rolesHeader.split(',').map(r => r.trim().toUpperCase()).includes('ADMIN');
    if (!allowed) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

    const before = students.length;
    students = students.filter(s => s.id !== id);
    if (students.length === before) return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('DELETE /api/students error', e);
    return NextResponse.json({ error: 'Error al eliminar estudiante' }, { status: 500 });
  }
}
