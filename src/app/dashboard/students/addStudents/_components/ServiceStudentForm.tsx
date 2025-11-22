"use client";

import { useState } from "react";

const API_URL = "/api/students-service";

export default function ServiceStudentForm() {

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [genero, setGenero] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefonoEstudiante, setTelefonoEstudiante] = useState("");
  const [direccion, setDireccion] = useState("");
  const [poliza, setPoliza] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [lugarTrabajo, setLugarTrabajo] = useState("");
  const [necesidadesEspeciales, setNecesidadesEspeciales] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function resetForm() {
    setEmail("");
    setNombre("");
    setCedula("");
    setGenero("");
    setNacionalidad("");
    setFechaNacimiento("");
    setTelefonoEstudiante("");
    setDireccion("");
    setPoliza("");
    setOcupacion("");
    setLugarTrabajo("");
    setNecesidadesEspeciales("");
    setMsg(null);
  }

  function handleModalClose() {
    setShowModal(false);
    // Si fue un éxito, limpiamos el formulario
    if (isSuccess) {
      resetForm();
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setIsLoading(true);
    // Validación mínima
    if (!nombre.trim()) return setMsg("El nombre es requerido");
    if (!cedula.trim()) return setMsg("La Cédula es requerida");
    if (!email.trim()) return setMsg("El Email es requerido");
    if (!genero.trim()) return setMsg("El Género es requerido");
    if (!nacionalidad.trim()) return setMsg("La Nacionalidad es requerida");
    if (!fechaNacimiento.trim()) return setMsg("La Fecha de Nacimiento es requerida");
    if (!direccion.trim()) return setMsg("La Dirección es requerida");

    const ID_PROGRAMA_SERVICIO = 4; // ID fijo para estudiantes de servicio 
    const studentData = {
      cedula: cedula.trim(),
      nombreCompleto: nombre.trim(),
      correo: email.trim(),
      genero: genero.trim(),
      nacionalidad: nacionalidad.trim(),
      fechaNacimiento: fechaNacimiento.trim(),
      telefono: telefonoEstudiante.trim(),
      direccion: direccion.trim(),
      numeroPoliza: poliza.trim(),
      ocupacion: ocupacion.trim(),
      lugarTrabajo: lugarTrabajo.trim(),
      detalles: necesidadesEspeciales.trim(), // Lo mapeamos a 'detalles' en la API
      idPrograma: ID_PROGRAMA_SERVICIO,
    };

    try {
      setMsg("Enviando datos...");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        const result = await response.json();
        // ÉXITO
        setMsg(`¡Registro de estudiante de servicio exitoso! ID`);
        setIsSuccess(true);
      } else {
        // ERROR DE API
        const errorData = await response.json();
        const errorMessage = errorData.error || `Error ${response.status}: No se pudo completar el registro.`;
        setMsg(errorMessage);
        setIsSuccess(false);
      }
    } catch (e) {
      // ERROR DE RED
      console.error("Error de conexión o de red:", e);
      setMsg("Error de conexión: Asegúrate que la API esté corriendo en la URL correcta.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  }

  function cancel() {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      {/* Alerta de Respuesta */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className={`rounded-lg p-6 shadow-xl w-full max-w-sm ${isSuccess ? 'bg-emerald-800 border-emerald-600' : 'bg-rose-800 border-rose-600'}`}>
            <h3 className="text-xl font-bold text-white mb-3">
              {isSuccess ? 'Registro Exitoso' : 'Error'}
            </h3>
            <p className="text-neutral-200 mb-5">{msg}</p>
            <button
              onClick={handleModalClose}
              className={`w-full rounded px-4 py-2 text-sm font-medium text-white ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      <form onSubmit={save} className="rounded border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Estudiante */}
          <div className="flex-1 min-w-0">
            <h3 className="mb-4 text-xl font-bold text-sky-400">Datos del Estudiante</h3>

            <div className="space-y-2">
              {/* Nombre Completo */}
              <label className="block text-base font-semibold text-white">Nombre Completo</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Número de Cédula */}
              <label className="block text-base font-semibold text-white">Número de Cédula</label>
              <input value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Formato: x-xxxx-xxxx" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Género (Usando select para mejor control) */}
              <label className="block text-base font-semibold text-white">Género</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white">
                <option value="">Seleccione...</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro/No especificado</option>
              </select>

              {/* Nacionalidad */}
              <label className="block text-base font-semibold text-white">Nacionalidad</label>
              <input value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Fecha de Nacimiento */}
              <label className="block text-base font-semibold text-white">Fecha de Nacimiento</label>
              <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Teléfono del Estudiante (Si lo tiene) */}
              <label className="block text-base font-semibold text-white">Número de Teléfono </label>
              <input type="tel" placeholder="Opcional" value={telefonoEstudiante} onChange={(e) => setTelefonoEstudiante(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Correo */}
              <label className="block text-base font-semibold text-white">Correo </label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Dirección del Domicilio (Usando textarea para más espacio) */}
              <label className="block text-base font-semibold text-white">Dirección del Domicilio (Provincia, Cantón, etc.)</label>
              <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} rows={3} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Póliza Estudiantil (si la tiene) */}
              <label className="block text-base font-semibold text-white">Póliza (si la tiene)</label>
              <input value={poliza} onChange={(e) => setPoliza(e.target.value)} placeholder="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Ocupación */}
              <label className="block text-base font-semibold text-white">Ocupación</label>
              <input
                value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} placeholder="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Lugar de Trabajo (Número y Dirección Exacta) */}
              <label className="block text-base font-semibold text-white">Lugar de Trabajo (Número de Teléfono y Dirección Exacta)</label>
              <textarea
                value={lugarTrabajo} onChange={(e) => setLugarTrabajo(e.target.value)} rows={2} placeholder="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Cuidados especiales de salud */}
              <label className="block text-base font-semibold text-white">Cuidados de Salud</label>
              <textarea value={necesidadesEspeciales} onChange={(e) => setNecesidadesEspeciales(e.target.value)} rows={3} placeholder="Especifique si aplica" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            </div>
          </div>
        </div>

        {/* Botones Guardar / Cancelar */}
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={isLoading} className="rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-3 py-2 text-sm font-medium">{isLoading ? "Guardando. . ." : "Guardar"}</button>
          <button type="button" onClick={cancel} className="rounded bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-3 py-2 text-sm font-medium">Cancelar</button>
        </div>

        {msg && <p className="mt-3 text-sm text-neutral-200">{msg}</p>}
      </form >

      {/* Mensaje de validación debajo del formulario (se oculta cuando el modal está activo) */}
      {msg && !showModal && <p className="mt-3 text-sm text-neutral-200">{msg}</p>}
    </div >
  );
}