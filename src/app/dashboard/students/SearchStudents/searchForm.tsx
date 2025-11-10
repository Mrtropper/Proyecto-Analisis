"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialStudents = [
    { id: 1, nombre: "Sofía Gómez", cedula: "1-1234-5678" },
    { id: 2, nombre: "Elena Rodríguez", cedula: "2-2345-6789" },
    { id: 3, nombre: "Andrea Castro", cedula: "1-1001-2002" },
    { id: 4, nombre: "Valeria Mora", cedula: "3-3456-7890" },
    { id: 5, nombre: "Juan Pérez", cedula: "1-1111-2222" },
    { id: 6, nombre: "María Soto", cedula: "3-9999-8888" },
];

export default function SearchForm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState(initialStudents);
    const router = useRouter();

    // Función para manejar la búsqueda/filtrado
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            // Si el campo de búsqueda está vacío, mostramos la lista completa
            setFilteredStudents(initialStudents);
            return;
        }

        // Convertimos el término de búsqueda a minúsculas para una búsqueda sin distinción
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

        const results = initialStudents.filter(student =>
            // Filtramos por nombre o cédula (ambos en minúsculas)
            student.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
            student.cedula.includes(lowerCaseSearchTerm)
        );

        setFilteredStudents(results);
    };

    const handleView = (studentId: number) => {
        router.push(`/students/${studentId}`);
    };

    // Funciones de manejo de boton ESTADO (por ahora solo muestran una alerta)
    const handleStatus = (studentId: number) => {
        alert(`Cambiar estado/matrícula del estudiante con ID: ${studentId}`);
    };

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-white">
                Prueba de Búsqueda de Estudiantes
            </h2>

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

                {/* Botón de busqueda */}
                <button
                    onClick={handleSearch}
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors duration-200 shadow-md"
                >
                    Buscar 
                </button>
            </div>

            {/* Contenedor de la Tabla */}
            <div className="overflow-x-auto rounded-lg border border-neutral-800">
                <table className="min-w-full divide-y divide-neutral-700">
                    <thead className="bg-neutral-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                #ID
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
                            <tr key={student.id} className="hover:bg-neutral-800/50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-500">
                                    {student.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-neutral-200">
                                    {student.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                    {student.cedula}
                                </td>

                                {/* COLUMNA DE BOTONES */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(student.id)}
                                            className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => handleStatus(student.id)}
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

                {/* Mensaje cuando no hay resultados */}
                {filteredStudents.length === 0 && (
                    <p className="p-4 text-center text-red-400">
                        No se encontraron estudiantes que coincidan con la búsqueda.
                    </p>
                )}
            </div>
        </div>
    );
}