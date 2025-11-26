"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
    idEstudiante: number;
    nombreCompleto: string;
    cedula: string;
    status: status;
}


type status = "A" | "I";

const API_URL = "/api/students";

// --- Componente ModalStatus ---
interface ModalStatusProps {
    idEstudiante: number;
    nombreCompleto: string;
    cedula: string;
    currentStatus: status; // Estado actual, podrías cargarlo si lo tuvieras
    onClose: () => void;
    onSave: (idEstudiante: number, newStatus: status) => void;
}

const ModalStatus = ({ idEstudiante, nombreCompleto, cedula, currentStatus, onClose, onSave }: ModalStatusProps) => {
    // Usamos el estado actual como valor inicial
    const [selectedStatus, setSelectedStatus] = useState<status>(currentStatus);

    const handleSave = () => {
        onSave(idEstudiante, selectedStatus);
        onClose(); // Cierra el modal después de guardar
    };

    return (
        // Overlay (fondo oscuro que cubre la pantalla)
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            {/* Contenedor del Modal */}
            <div className="bg-neutral-900 rounded-lg p-6 shadow-2xl w-full max-w-sm border border-neutral-700">
                <h3 className="text-xl font-bold text-white mb-4">
                    Cambiar Estado de Matrícula
                </h3>
                <p className="text-neutral-300 mb-6">
                    Estudiante: **{nombreCompleto}**
                </p>
                <p className="text-neutral-300 mb-6 text-sm">
                    Cédula: {cedula}
                </p>

                {/* Radio Buttons */}
                <div className="space-y-4 mb-8">
                    {/* Opción Activo */}
                    <label className="flex items-center text-white cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="Activo"
                            checked={selectedStatus === "A"}
                            onChange={() => setSelectedStatus("A")}
                            className="form-radio h-4 w-4 text-emerald-500 border-neutral-600 bg-neutral-700"
                        />
                        <span className="ml-3 text-sm">Activo (Matriculado)</span>
                    </label>

                    {/* Opción Inactivo */}
                    <label className="flex items-center text-white cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="Inactivo"
                            checked={selectedStatus === "I"}
                            onChange={() => setSelectedStatus("I")}
                            className="form-radio h-4 w-4 text-red-500 border-neutral-600 bg-neutral-700"
                        />
                        <span className="ml-3 text-sm">Inactivo (Retirado/No matriculado)</span>
                    </label>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold rounded-lg text-neutral-300 bg-neutral-700 hover:bg-neutral-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function SearchForm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
                    const studentsWithStatus: Student[] = responseData.map(
                        (s: any) => ({
                            ...s,
                            status: s.status || "A", // Asumiendo 'status' viene de la API o se defaultea
                        })
                    );
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
        router.push(`/dashboard/students/SearchStudents/${studentId}`);
    };

    //Recibe el objeto Student completo
    const handleStatus = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    //Implementación de la llamada PATCH
    const handleSaveStatus = async (idEstudiante: number, newStatus: status) => {
        setIsLoading(true);
        setErrorMsg(null);

        const url = `${API_URL}/${idEstudiante}`;

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: newStatus,
                }),
            });

            if (response.ok) {
                // Mostrar mensaje y recargar la lista para reflejar el cambio
                alert(`Estado actualizado a: ${newStatus}.`);
                setIsModalOpen(false); // Cerrar el modal
                await handleSearch(); // Recargar la lista de estudiantes
            } else {
                // Error al actualizar
                const errorData = await response.json();
                const errorMessage = errorData.error || `Error ${response.status} al actualizar el estado.`;
                setErrorMsg(errorMessage);
                alert(`Error al actualizar el estado: ${errorMessage}`);
                setIsModalOpen(false); // Cerrar el modal en caso de error
            }
        } catch (e) {
            console.error("Error al conectar con la API para actualizar el estado:", e);
            setErrorMsg("Error de conexión al intentar actualizar el estado.");
            alert("Error de conexión al intentar actualizar el estado.");
            setIsModalOpen(false); // Cerrar el modal
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            {/* TARJETA NEGRA PARA BUSCADOR */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 shadow-xl mb-8 backdrop-blur-sm">

                <h1 className="text-3xl font-bold mb-4 text-white">
                    Buscar Estudiantes
                </h1>

                {/* Barra de búsqueda */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o cédula (0-0000-0000)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        className="flex-grow p-3 rounded-xl border border-neutral-700 
                   bg-neutral-800 text-white placeholder-neutral-400
                   focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>

            </div>


            {isLoading && (
                <div className="flex justify-center items-center py-6">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 border-4 border-neutral-600 border-t-sky-500 rounded-full animate-spin"></div>
                        <span className="text-neutral-900">Cargando estudiantes...</span>
                    </div>
                </div>
            )}

            {/* Contenedor de la Tabla */}
            <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900">
                <table className="min-w-full divide-y divide-neutral-800 bg-neutral-900">
                    <thead className="bg-neutral-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                Nombre Completo
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                Número Identidad
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800 bg-neutral-900">
                        {filteredStudents.map((student) => (
                            <tr key={student.idEstudiante} className="hover:bg-neutral-800 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-neutral-200">
                                    {student.nombreCompleto}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                    {student.cedula}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'A'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-red-600 text-white'
                                            }`}
                                    >
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => seeStudent(student.idEstudiante)}
                                            className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => handleStatus(student)}
                                            className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700"
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
            {isModalOpen && selectedStudent && (
                <ModalStatus
                    idEstudiante={selectedStudent.idEstudiante}
                    nombreCompleto={selectedStudent.nombreCompleto}
                    cedula={selectedStudent.cedula}
                    currentStatus={selectedStudent.status}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveStatus}
                />
            )}

        </div>
    );
}