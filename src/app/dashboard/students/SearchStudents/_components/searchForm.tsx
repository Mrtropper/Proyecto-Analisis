"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
    idEstudiante: number;
    nombreCompleto: string;
    cedula: string;
}

interface StudentDetail extends Student {
    genero: string | null;
    nacionalidad: string | null;
    fechaNacimiento: string | null;
    telefono: string | null;
    correo: string | null;
    direccion: string | null;
    gradoEscolar: string | null;
    institucion: string | null;
    lugarTrabajo: string | null;
    ocupacion: string | null;
    numeroPoliza: string | null;
    discapacidad: string | null;
    detalles: string | null;
}

const API_URL = "/api/students";



export default function SearchForm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();

    // Función para manejar la búsqueda/filtrado
    const handleSearch = useCallback(async (initialLoad = false) => {
        setErrorMsg(null);
        setIsLoading(true);

        const term = searchTerm.trim();
        let url = new URL(API_URL, window.location.origin);

        if (term) {
            const isCedulaFormat = /\d{1}-\d{4}-\d{4}/.test(term) || !isNaN(Number(term.replace(/-/g, '')));
            const searchParamValue = term.replace(/-/g, '');

            if (isCedulaFormat) {
                url.searchParams.append("cedula", searchParamValue);
            } else {
                url.searchParams.append("nombreCompleto", term);
            }
        } else if (initialLoad) {
            // Si no hay término de búsqueda, cargar todos los estudiantes
            url = new URL(API_URL, window.location.origin);
        }

        try {
            const response = await fetch(url.toString());
            const responseData = await response.json();

            if (response.ok) {
                if (Array.isArray(responseData)) {
                    setFilteredStudents(responseData);
                    setErrorMsg(null);
                } else {
                    setErrorMsg("Error interno: La API devolvió datos en un formato inesperado.");
                    setFilteredStudents([]);
                }
            } else {
                const errorMessage = responseData.error || responseData.message || `Error ${response.status}: No se pudo completar la solicitud.`;
                setErrorMsg(errorMessage);
                setFilteredStudents([]);
            }

        } catch (e) {
            console.error("Error al conectar con la API:", e);
            setErrorMsg("Error de conexion. No se pudo contactar el servidor.");
            setFilteredStudents([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm]);
    useEffect(() => {
        handleSearch(true);
    }, [handleSearch]);

    const seeStudent = (studentId: number) => {
        router.push(`/dashboard/students/searchStudents/${studentId}`);
    };

    const handleStatus = (studentId: number) => {
        alert(`Cambiar estado/matrícula del estudiante con ID: ${studentId}`);
    };



    return (
        <div className="p-4">
            {/* Barra de busqueda y boton */}
            <div className="flex gap-4 mb-8">
                {/* Input de busqueda */}
                <input
                    type="text"
                    placeholder="Buscar por nombre o cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // Permite buscar con 'Enter'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    className="flex-grow p-3 rounded-xl border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
            </div>

            {isLoading && <p className="text-center text-neutral-400 mb-4">Cargando estudiantes...</p>}
            {errorMsg && <p className="text-center text-red-500 mb-4">{errorMsg}</p>}

            {/* Contenedor de la Tabla */}
            <div className="overflow-x-auto rounded-lg border border-neutral-800">
                <table className="min-w-full divide-y divide-neutral-700">
                    <thead className="bg-neutral-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">

                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                Nombre Completo
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                Número Identidad
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {filteredStudents.map((student) => (
                            <tr key={student.idEstudiante} className="hover:bg-neutral-800/50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-500">
                                    {student.idEstudiante}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-neutral-200">
                                    {student.nombreCompleto}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                    {student.cedula}
                                </td>

                                {/* COLUMNA DE BOTONES */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => seeStudent(student.idEstudiante)}
                                            className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => handleStatus(student.idEstudiante)}
                                            className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        >
                                            Estado
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mensaje cuando no hay resultados solo si no hay error y la lista está vacía después de la carga*/}
                {!isLoading && filteredStudents.length === 0 && searchTerm.trim() && (
                    <p className="p-4 text-center text-red-400 bg-neutral-900">
                        No se encontraron estudiantes que coincidan con la búsqueda.
                    </p>
                )}

                {/* Mostrar un mensaje si la lista está vacía al inicio y no hay búsqueda */}
                {!isLoading && !errorMsg && filteredStudents.length === 0 && !searchTerm.trim() && (
                    <p className="p-4 text-center text-neutral-400 bg-neutral-900">
                        No hay estudiantes registrados.
                    </p>
                )}

            </div>
        </div>
    );
}