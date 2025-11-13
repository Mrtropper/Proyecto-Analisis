
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function InstrumentForm() {
  const [idInstrumento, setIdInstrumento] = useState("");
  const [idInventario, setIdInventario] = useState("");

  const [guardando, setGuardando] = useState(false);

  const [showInstrumentoModal, setShowInstrumentoModal] = useState(false);

  const [searchInstrumento, setSearchInstrumento] = useState("");

  const [instrumentosDisponibles, setInstrumentosDisponibles] = useState<
    { idInstrumento: string; nombre: string }[]
  >([]);

  // Obtener instrumentos desde la API
    useEffect(() => {
      const fetchInstrumentos = async () => {
        try {
          const response = await fetch("/api/instrumento");
          if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
          const data = await response.json();
          const formato = data.map(
            (inst: { idInstrumento: string; nombre: string }) => ({
              idInstrumento: inst.idInstrumento,
              nombre: inst.nombre,
            })
          );
          setInstrumentosDisponibles(formato);
        } catch (error) {
          console.error("Error al cargar instrumentos:", error);
        }
      };
      fetchInstrumentos();
    }, []);

  const filteredInstrumentos = instrumentosDisponibles.filter(
    (inst) =>
      inst.idInstrumento
        ?.toString()
        .toLowerCase()
        .includes(searchInstrumento.toLowerCase()) ||
      inst.nombre?.toLowerCase().includes(searchInstrumento.toLowerCase())
  );

  const handleGuardar = async () => {
    // Validación simple
    if (!idInstrumento || !idInventario) {
      alert("Por favor complete todos los campos.");
      return;
    }

    // Crear objeto que se enviará a la API
    const nuevoInventario = {
      idInventario : idInventario,
      idInstrumento : idInstrumento,
    };

    try {
      setGuardando(true);

      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoInventario),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(`Error al guardar: ${error.error || "Error desconocido"}`);
        setGuardando(false);
        return;
      }

      const data = await response.json();
      console.log("Instrumento guardado:", data);

      
      alert("Inventario guardado correctamente en la base de datos");

      // Limpiar formulario después del éxito
      setIdInventario("");
      setIdInstrumento("");
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar con la API. Verifique la conexión.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      {/* Botones principales */}
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

        <Link href="/dashboard/instruments/list">
          <button className="w-50 bg-blue-950 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Lista
          </button>
        </Link>
      </div>

      {/* Cuadro principal */}
      <div className="mt-6 p-4 border border-gray-900 rounded">
        <h2 className="text-xl font-semibold text-blue-400">
          Inventario
        </h2>
        <p className="mt-2 text-neutral-100">
          Ingrese los datos para el inventario
        </p>

        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            ID Inventario
          </label>
          <input
            type="text"
            value={idInventario}
            onChange={(e) => setIdInventario(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Campo Instrumento con modal */}
        <div className="mt-4">
          <label className="block text-sm text-neutral-200 mb-1">
            ID del instrumento
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={idInstrumento}
              readOnly
              className="w-full px-3 py-2 bg-gray-900 text-white rounded focus:outline-none"
              placeholder="Seleccione el instrumento..."
            />
            <button
              onClick={() => setShowInstrumentoModal(true)}
              className="bg-blue-950 hover:bg-gray-900 text-white px-4 py-2 rounded"
            >
              Seleccionar
            </button>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className={`w-50 px-4 py-2 rounded text-white ${
              guardando
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {guardando ? "Guardando..." : "Guardar Inventario"}
          </button>
        </div>

        {showInstrumentoModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 w-96">
              <h3 className="text-lg text-blue-400 font-semibold mb-4">
                Seleccionar Instrumento
              </h3>

              <input
                type="text"
                placeholder="Buscar o ingresar ID del instrumento..."
                className="w-full px-3 py-2 bg-gray-800 text-white rounded mb-4 focus:outline-none focus:ring focus:ring-blue-400"
                value={searchInstrumento}
                onChange={(e) => setSearchInstrumento(e.target.value)}
              />

              <ul className="bg-gray-800 rounded max-h-40 overflow-y-auto text-white mb-4">
                {filteredInstrumentos.length > 0 ? (
                  filteredInstrumentos.map((inst) => (
                    <li
                      key={inst.idInstrumento}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setIdInstrumento(inst.idInstrumento);
                        setShowInstrumentoModal(false);
                        setSearchInstrumento("");
                      }}
                    >
                      {inst.idInstrumento} - {inst.nombre}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-neutral-400">
                    No se encontraron resultados
                  </li>
                )}
              </ul>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowInstrumentoModal(false);
                    setSearchInstrumento("");
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
