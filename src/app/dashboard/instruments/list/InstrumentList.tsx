
import Link from "next/link";

export default function instrumentList() {
  return (
    <div>
      {/* Botones arriba */}
      <div className="flex gap-2 mb-3">
        <Link href="/dashboard/instruments">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Agregar Instrumento
          </button>
        </Link>

        <Link href="/dashboard/instruments/list">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Lista
          </button>
        </Link>

        <Link href="/dashboard/instruments/update">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Modificar
          </button>
        </Link>
      </div>

      {/* Contenido original */}
      <div className="mt-6 p-4 border border-gray-900 rounded">
        <h2 className="text-xl font-semibold text-blue-400">
          Lista de Instrumentos 🎵
        </h2>
        <p className="mt-2 text-neutral-300">
          Aquí puedes visualizar los instrumentos registrados.
        </p>

        {/* Tabla estilo oscuro */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border border-blue-600 rounded">
            <thead>
              <tr className="bg-blue-950 text-blue-300">
                <th className="border border-blue-600 px-4 py-2 text-left">ID</th>
                <th className="border border-blue-600 px-4 py-2 text-left">Nombre</th>
                <th className="border border-blue-600 px-4 py-2 text-left">Estado</th>
                <th className="border border-blue-600 px-4 py-2 text-left">ID Estudiante</th>
              </tr>
            </thead>

            <tbody className="text-neutral-200">
              <tr className="bg-neutral-900 hover:bg-neutral-800 transition">
                <td className="border border-blue-600 px-4 py-2">1</td>
                <td className="border border-blue-600 px-4 py-2">Guitarra</td>
                <td className="border border-blue-600 px-4 py-2">Disponible</td>
                <td className="border border-blue-600 px-4 py-2"></td>
              </tr>
              <tr className="bg-neutral-900 hover:bg-neutral-800 transition">
                <td className="border border-blue-600 px-4 py-2">2</td>
                <td className="border border-blue-600 px-4 py-2">Piano</td>
                <td className="border border-blue-600 px-4 py-2">En mantenimiento</td>
                <td className="border border-blue-600 px-4 py-2"></td>
              </tr>
              <tr className="bg-neutral-900 hover:bg-neutral-800 transition">
                <td className="border border-blue-600 px-4 py-2">2</td>
                <td className="border border-blue-600 px-4 py-2">Flauta</td>
                <td className="border border-blue-600 px-4 py-2">Ocupado</td>
                <td className="border border-blue-600 px-4 py-2">203330444</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
