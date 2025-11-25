"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Instrumento {
  idInstrumento: number;
  nombre: string;
  familia: string;
}

export default function InstrumentForm() {
  const [nombreInstrumento, setNombreInstrumento] = useState("");
  const [familiaInstrumento, setFamiliaInstrumento] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);

  // Estados para editar
  const [modoEditar, setModoEditar] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  // Estado para búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Filtrado dinámico (ID, nombre, familia)
  const instrumentosFiltrados = instrumentos.filter((inst) =>
    inst.idInstrumento.toString().includes(busqueda.toLowerCase()) ||
    inst.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    inst.familia.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cargar instrumentos

  const cargarInstrumentos = async () => {
    try {
      const response = await fetch("/api/instrumento", { cache: "no-store" });
      const data = await response.json();
      setInstrumentos(data);
    } catch (err) {
      console.error("Error al cargar instrumentos:", err);
    }
  };

  useEffect(() => {
    cargarInstrumentos();
  }, []);

  // Cargar datos para editar

  const cargarInstrumentoEnFormulario = (inst: Instrumento) => {
    setNombreInstrumento(inst.nombre);
    setFamiliaInstrumento(inst.familia);
    setIdEditando(inst.idInstrumento);
    setModoEditar(true);
  };

  // Guardar o editar
  const handleGuardar = async () => {
    if (!nombreInstrumento || !familiaInstrumento) {
      alert("Por favor complete todos los campos.");
      return;
    }

    try {
      setGuardando(true);

      // EDITAR
      if (modoEditar && idEditando !== null) {
        const response = await fetch(`/api/instrumento/${idEditando}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombreInstrumento,
            familia: familiaInstrumento,
          }),
        });

        if (!response.ok) {
          alert("Error al modificar instrumento.");
          return;
        }

        alert("Instrumento modificado correctamente.");
        setModoEditar(false);
        setIdEditando(null);

      } else {
        // CREAR
        const response = await fetch("/api/instrumento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombreInstrumento,
            familia: familiaInstrumento,
          }),
        });

        if (!response.ok) {
          alert("Error al guardar instrumento.");
          return;
        }

        alert("Instrumento guardado correctamente.");
      }

      // limpiar formulario
      setNombreInstrumento("");
      setFamiliaInstrumento("");

      // recargar tabla
      await cargarInstrumentos();

    } catch (e) {
      console.error(e);
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar
  const handleEliminar = async (id: number) =>
  {
    const confirmar = confirm("¿Seguro que desea eliminar este instrumento?");
    if (!confirmar) return;

    try 
    {
      const response = await fetch(`/api/instrumento/${id}`, 
      {
        method: "DELETE",
      });

      if (!response.ok) 
      {
        const error = await response.json().catch(() => ({}));
        alert(error.error || "No se pudo eliminar el instrumento.");
        return;
      }


      alert("Instrumento eliminado correctamente.");
      await cargarInstrumentos();

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>

      {/* BOTONES */}
      <div className="flex gap-2 mb-3">
        <Link href="/dashboard/instruments">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Agregar Instrumento
          </button>
        </Link>

        <Link href="/dashboard/instruments/inventario">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Inventario
          </button>
        </Link>

        <Link href="/dashboard/instruments/loan">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Préstamo Instrumento
          </button>
        </Link>

      </div>

      {/* FORMULARIO + TABLA */}
      <div className="flex gap-6 items-start mt-6">

        {/* FORMULARIO */}
        <div className="w-[350px]">
          <div className="p-4 border border-gray-900 rounded">

            <h2 className="text-xl font-semibold text-blue-400">
              {modoEditar ? "Modificar Instrumento" : "Agregar Instrumento"}
            </h2>

            <p className="mt-2 text-neutral-100">
              {modoEditar
                ? "Edite los datos del instrumento"
                : "Ingrese los datos del instrumento"}
            </p>

            {/* NOMBRE */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                Nombre del instrumento
              </label>
              <input
                type="text"
                value={nombreInstrumento}
                onChange={(e) => setNombreInstrumento(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            {/* FAMILIA */}
            <div className="mt-4">
              <label className="block text-sm text-neutral-200 mb-1">
                Familia
              </label>
              <input
                type="text"
                value={familiaInstrumento}
                onChange={(e) => setFamiliaInstrumento(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            {/* BOTÓN GUARDAR/MODIFICAR*/}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className={`w-full px-4 py-2 rounded text-white ${
                  guardando ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {guardando
                  ? "Guardando..."
                  : modoEditar
                  ? "Modificar Instrumento"
                  : "Guardar Instrumento"}
              </button>
            </div>

          </div>
        </div>

        {/* TABLA */}
        <div className="w-[750px] border border-gray-900 rounded p-4">

          <h2 className="text-xl font-semibold text-blue-400 mb-3">
            Lista de Instrumentos
          </h2>

          {/* Búsqueda */}
          <div className="mb-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔎 Buscar por ID, nombre o familia..."
              className="w-full px-3 py-2 bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="overflow-y-auto max-h-[400px] rounded">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900 text-neutral-300">
                <tr>
                  <th className="px-3 py-2 border border-gray-700">ID</th>
                  <th className="px-3 py-2 border border-gray-700">Nombre</th>
                  <th className="px-3 py-2 border border-gray-700">Familia</th>
                  <th className="px-3 py-2 border border-gray-700"></th>
                </tr>
              </thead>

              <tbody className="text-neutral-100">

                {instrumentosFiltrados.map((inst) => (
                  <tr key={inst.idInstrumento} className="hover:bg-gray-800 transition">
                    <td className="px-3 py-2 border border-gray-800">
                      {inst.idInstrumento}
                    </td>

                    <td className="px-3 py-2 border border-gray-800">
                      {inst.nombre}
                    </td>

                    <td className="px-3 py-2 border border-gray-800">
                      {inst.familia}
                    </td>

                    <td className="border border-gray-800 px-2 py-2 text-center w-32">
                      <div className="flex justify-center gap-6">

                        {/* EDITAR */}
                        <button
                          onClick={() => cargarInstrumentoEnFormulario(inst)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          ✏️
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() => handleEliminar(inst.idInstrumento)}
                          className="text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
