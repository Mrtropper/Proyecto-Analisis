// src/app/dashboard/students/searchStudents/_components/StudentDetailView.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Para el botón de "Volver"

// --- INTERFAZ DE DATOS ---
interface StudentData {
    idEstudiante: number;
    nombreCompleto: string;
    cedula: string;
    genero: string | null;
    nacionalidad: string | null;
    fechaNacimiento: string | null;
    telefono: string | null;
    correo: string | null;
    direccion: string | null;
    gradoEscolar: string | null;
    institucion: string | null;
    numeroPoliza: string | null;
    discapacidad: string | null;
    detalles: string | null;
    idPrograma: number;
}

interface EncargadoData {
    nombre: string | null;
    cedula: string | null;
    telefono: string | null;
    correo: string | null;
    ocupacion: string | null;
    lugarTrabajo: string | null;
}

interface AutorizadoData {
    nombre: string | null;
    parentesco: string | null;
    telefono: string | null;
}

const API_STUDENTS = "/api/students";
const API_LEGAL_GUARDIAN = "/api/legal-guardian";
const API_AUTHORIZED_PICKPUPS = "/api/authorized-pickups";

export default function StudentDetailView({ studentId }: { studentId: string }) {

    const router = useRouter();
    const idToSearch = parseInt(studentId, 10);

    const [isLoading, setIsLoading] = useState(true);
    const [studentDetail, setStudentDetail] = useState<StudentData | null>(null);
    const [encargadoDetail, setEncargadoDetail] = useState<EncargadoData | null>(null);
    const [autorizadoDetail, setAutorizadoDetail] = useState<AutorizadoData | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // --- EFECTO PRINCIPAL DE CARGA ---
    useEffect(() => {
        const fetchAllData = async () => {
            if (isNaN(idToSearch)) {
                setErrorMsg("ID de estudiante inválido.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setErrorMsg(null);

            try {
                // 1. FETCH DE DATOS PRINCIPALES (Estudiante)
                let studentUrl = new URL(API_STUDENTS, window.location.origin);
                studentUrl.searchParams.append("idEstudiante", studentId);

                const studentResponse = await fetch(studentUrl.toString());
                if (!studentResponse.ok) {
                    setErrorMsg("Error al obtener los datos principales del estudiante");
                    return;
                }

                const studentDataList = await studentResponse.json();
                const foundStudent = studentDataList.find(
                    (s: StudentData) => s.idEstudiante === idToSearch
                );

                if (!foundStudent) {
                    setErrorMsg(`Error: No se encontró un estudiante con ID: ${idToSearch}`);
                    return;
                }
                setStudentDetail(foundStudent);

                // 2. FETCH DE DATOS ADICIONALES EN PARALELO (Encargado y Autorizado)
                if (foundStudent.idPrograma !== 4) {
                    // 2. FETCH DE DATOS ADICIONALES EN PARALELO (Encargado y Autorizado)
                    const [encargadoResult, autorizadoResult] = await Promise.allSettled([
                        fetch(`${API_LEGAL_GUARDIAN}?idEstudiante=${studentId}`),
                        fetch(`${API_AUTHORIZED_PICKPUPS}?idEstudiante=${studentId}`),
                    ]);

                    // --- Procesar resultado del Encargado ---
                    if (encargadoResult.status === 'fulfilled' && encargadoResult.value.ok) {
                        const data = await encargadoResult.value.json();
                        setEncargadoDetail(data);
                    } else {
                        console.warn("Advertencia: No se pudo cargar el Encargado Legal o no existe.");
                    }

                    // --- Procesar resultado del Autorizado ---
                    if (autorizadoResult.status === 'fulfilled' && autorizadoResult.value.ok) {
                        const data = await autorizadoResult.value.json();
                        setAutorizadoDetail(data);
                    } else {
                        console.warn("Advertencia: No se pudo cargar la Persona Autorizada o no existe.");
                    }
                }

            } catch (error) {
                console.error("Error en la cadena de conexión:", error);
                setErrorMsg("Error de conexión al cargar todos los datos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [idToSearch, studentId]);

    // Función auxiliar para renderizar cada campo
    const DetailItem = useCallback(({ label, value }: { label: string, value: string | number | null | undefined }) => {
        const displayValue = value === null || value === '' || value === undefined ? 'N/A' : String(value);
        return (
            <p className="text-base text-neutral-300">
                <span className="font-semibold text-neutral-500 w-40 inline-block">{label}:</span>
                {displayValue}
            </p>
        );
    }, []);


    // --- Renderizado de Estados de Carga/Error ---
    if (isLoading) {
        return <p className="p-8 text-center text-xl text-neutral-400">Cargando detalles del estudiante y sus contactos... 🔄</p>;
    }

    if (errorMsg) {
        return <p className="p-8 text-center text-xl text-red-500">Error: {errorMsg} </p>;
    }

    if (!studentDetail) {
        return <p className="p-8 text-center text-xl text-neutral-400">Datos principales del estudiante no disponibles.</p>;
    }


    const isPrograma3 = studentDetail.idPrograma === 3;
    const isPrograma4 = studentDetail.idPrograma === 4;
    const isPrograma2 = studentDetail.idPrograma === 2;

    // --- Renderizado de los Datos ---
    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 bg-neutral-900/60 min-h-screen text-white">
            <h1 className="text-3xl font-bold text-sky-400 mb-6 border-b border-neutral-700 pb-2">
                Detalles del Estudiante: {studentDetail.nombreCompleto} 
            </h1>

            <div className="grid grid-cols-1 gap-8">

                {/* Bloque 1: Datos del Estudiante */}
                <div className="space-y-4 p-6 bg-neutral-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2">Información Personal del Estudiante</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                        <DetailItem label="ID Estudiante" value={studentDetail.idEstudiante} />
                        <DetailItem label="Cédula" value={studentDetail.cedula} />
                        <DetailItem label="Género" value={studentDetail.genero} />
                        <DetailItem label="Nacionalidad" value={studentDetail.nacionalidad} />
                        <DetailItem label="Fecha Nacimiento" value={studentDetail.fechaNacimiento} />

                        {/*Ocultar Teléfono y Correo para idPrograma=3 */}
                        {!isPrograma2 && (
                            <>
                                <DetailItem label="Teléfono" value={studentDetail.telefono} />
                                <DetailItem label="Correo" value={studentDetail.correo} />
                            </>
                        )}
                        
                        <DetailItem label="Dirección" value={studentDetail.direccion} />
                        <DetailItem label="Grado Escolar" value={studentDetail.gradoEscolar} />
                        <DetailItem label="Institución" value={studentDetail.institucion} />
                        <DetailItem label="Póliza Estudiantil" value={studentDetail.numeroPoliza} />

                        {/*Mostrar Discapacidad para idPrograma=2 */}
                        {(isPrograma3 || studentDetail.discapacidad) && (
                            <DetailItem label="Discapacidad" value={studentDetail.discapacidad} />
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-neutral-300 pt-4 border-t border-neutral-700 mt-4">Detalles y Necesidades Especiales</h3>
                    <p className="p-2 bg-neutral-700 rounded text-sm text-neutral-300">
                        {studentDetail.detalles || 'No hay detalles o necesidades especiales registradas.'}
                    </p>
                </div>

                {/* Bloque 2: Datos del Encargado Legal (Ocultar si idPrograma=4) */}
                {!isPrograma4 && (
                    <div className="space-y-4 p-6 bg-neutral-800 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2">Información del Encargado Legal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                            <DetailItem label="Nombre Completo" value={encargadoDetail?.nombre} />
                            <DetailItem label="Cédula" value={encargadoDetail?.cedula} />
                            <DetailItem label="Teléfono" value={encargadoDetail?.telefono} />
                            <DetailItem label="Correo" value={encargadoDetail?.correo} />
                            <DetailItem label="Ocupación" value={encargadoDetail?.ocupacion} />
                            <DetailItem label="Lugar de Trabajo" value={encargadoDetail?.lugarTrabajo} />
                        </div>
                        {!encargadoDetail && <p className="text-sm text-red-400 pt-2 border-t border-neutral-700">No se encontró información de Encargado Legal para este estudiante.</p>}
                    </div>
                )}

                {/* Bloque 3: Persona Autorizada a Retirar (Ocultar si idPrograma=4) */}
                {!isPrograma4 && (
                    <div className="space-y-4 p-6 bg-neutral-800 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2">Persona Autorizada a Retirar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                            <DetailItem label="Nombre" value={autorizadoDetail?.nombre} />
                            <DetailItem label="Relación" value={autorizadoDetail?.parentesco} />
                            <DetailItem label="Teléfono" value={autorizadoDetail?.telefono} />
                        </div>
                        {!autorizadoDetail && <p className="text-sm text-red-400 pt-2 border-t border-neutral-700">No se encontró información de Persona Autorizada para este estudiante.</p>}
                    </div>
                )}

            </div>

            <button
                onClick={() => router.back()}
                className="mt-8 px-6 py-2 bg-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
            >
                ← Volver a la Búsqueda
            </button>

        </div>
    );
}
