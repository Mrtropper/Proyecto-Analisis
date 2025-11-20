"use client";

import { useState } from "react";

const API_URL = "/api/students";

export default function KidsStudentForm() {

  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [genero, setGenero] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nivelEscolar, setNivelEscolar] = useState("");
  const [institucionEducativa, setInstitucionEducativa] = useState("");
  const [polizaEstudiantil, setPolizaEstudiantil] = useState("");
  const [necesidadesEspeciales, setNecesidadesEspeciales] = useState("");

  const [encargadoNombre, setEncargadoNombre] = useState("");
  const [encargadoCedula, setEncargadoCedula] = useState("");
  const [encargadoTelefono, setEncargadoTelefono] = useState("");
  const [encargadoEmail, setEncargadoEmail] = useState("");
  const [encargadoOcupacion, setEncargadoOcupacion] = useState("");
  const [lugarTrabajo, setLugarTrabajo] = useState("");

  const [personasAutorizadasNombre, setPersonasAutorizadasNombre] = useState("");
  const [personasAutorizadasRelacion, setPersonasAutorizadasRelacion] = useState("");
  const [personasAutorizadasTelefono, setPersonasAutorizadasTelefono] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function resetForm() {
    setNombre("");
    setCedula("");
    setGenero("");
    setNacionalidad("");
    setFechaNacimiento("");
    setDireccion("");
    setNivelEscolar("");
    setInstitucionEducativa("");
    setPolizaEstudiantil("");
    setNecesidadesEspeciales("");

    setEncargadoNombre("");
    setEncargadoCedula("");
    setEncargadoTelefono("");
    setEncargadoEmail("");
    setEncargadoOcupacion("");
    setLugarTrabajo("");

    setPersonasAutorizadasNombre("");
    setPersonasAutorizadasRelacion("");
    setPersonasAutorizadasTelefono("");

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
    setMsg(null); // Limpiar mensaje anterior
    setIsLoading(true); // Activar loading

    // Validación mínima
    if (!nombre.trim()) return setMsg("El nombre es requerido");
    if (!cedula.trim()) return setMsg("La Cédula es requerida");
    if (!genero.trim()) return setMsg("El Género es requerido");
    if (!nacionalidad.trim()) return setMsg("La Nacionalidad es requerida");
    if (!fechaNacimiento.trim()) return setMsg("La Fecha de Nacimiento es requerida");
    if (!direccion.trim()) return setMsg("La Dirección es requerida");
    if (!nivelEscolar.trim()) return setMsg("El Nivel Escolar es requerido");
    if (!institucionEducativa.trim()) return setMsg("La Institución Educativa es requerida");
    // Validacion encargado legal
    if (!encargadoNombre.trim()) return setMsg("El nombre del encargado legal es requerido");
    if (!encargadoCedula.trim()) return setMsg("La cédula del encargado legal es requerida");
    if (!encargadoTelefono.trim()) return setMsg("El teléfono del encargado legal es requerido");
    if (!encargadoEmail.trim()) return setMsg("El correo del encargado legal es requerido");
    if (!encargadoOcupacion.trim()) return setMsg("La ocupación del encargado legal es requerida");
    if (!lugarTrabajo.trim()) return setMsg("El lugar de trabajo del encargado legal es requerido");
    // Validacion personas autorizadas
    if (!personasAutorizadasNombre.trim()) { setIsLoading(false); return setMsg("El nombre de la persona autorizada es requerido"); }
    if (!personasAutorizadasRelacion.trim()) { setIsLoading(false); return setMsg("La relación de la persona autorizada es requerida"); }
    if (!personasAutorizadasTelefono.trim()) { setIsLoading(false); return setMsg("El teléfono de la persona autorizada es requerido"); }

    const idPrograma = 2; // ID fijo para estudiantes regulares
    const studentData = {
      estudiante: {
        cedula: cedula.trim(),
        idPrograma: idPrograma,
        nombreCompleto: nombre.trim(),
        genero: genero.trim(),
        nacionalidad: nacionalidad.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        direccion: direccion.trim(),
        gradoEscolar: nivelEscolar.trim(),
        institucion: institucionEducativa.trim(),
        numeroPoliza: polizaEstudiantil.trim(),
        detalles: necesidadesEspeciales.trim(),
      },

      encargadoLegal: {
        nombre: encargadoNombre.trim(),
        cedula: encargadoCedula.trim(),
        telefono: encargadoTelefono.trim(),
        correo: encargadoEmail.trim(),
        ocupacion: encargadoOcupacion.trim(),
        lugarTrabajo: lugarTrabajo.trim(),
      },

      autorizadoRetiro: {
        nombre: personasAutorizadasNombre.trim(),
        parentesco: personasAutorizadasRelacion.trim(),
        telefono: personasAutorizadasTelefono.trim(),
      }

    };

    try {
      setMsg("Enviando datos...");

      // Llamada a la API
      const response = await fetch(API_URL, {
        method: "POST", // Usamos POST para crear un nuevo recurso
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      // Manejo de la respuesta HTTP
      if (response.ok) {
        const result = await response.json();
        setMsg(`¡Registro de estudiante exitoso!`);
        setIsSuccess(true);
      } else {
        // Leer el mensaje de error de la API 
        const errorData = await response.json();
        const errorMessage = errorData.error || `Error ${response.status}: No se pudo completar el registro.`;
        setMsg(errorMessage);
        setIsSuccess(false);
      }
    } catch (e) {
      console.error("Error de conexión o de red:", e);
      setMsg("Error de conexión: Asegúrate que el servidor esté corriendo.");
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
              {isSuccess ? 'Registro Exitoso' : 'Error de Registro'}
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
              <input value={cedula} onChange={(e) => setCedula(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

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

              {/* Dirección del Domicilio (Usando textarea para más espacio) */}
              <label className="block text-base font-semibold text-white">Dirección del Domicilio (Provincia, Cantón, etc.)</label>
              <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} rows={3} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
              {/* Nivel de educacion */}
              <label className="block text-base font-semibold text-white">Nivel de Educacion (MEP)</label>
              <input value={nivelEscolar} onChange={(e) => setNivelEscolar(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Nombre de la Institución Educativa del MEP */}
              <label className="block text-base font-semibold text-white">Nombre de la Institución Educativa (MEP)</label>
              <input value={institucionEducativa} onChange={(e) => setInstitucionEducativa(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Póliza Estudiantil (si la tiene) */}
              <label className="block text-base font-semibold text-white">Póliza Estudiantil (si la tiene)</label>
              <input value={polizaEstudiantil} onChange={(e) => setPolizaEstudiantil(e.target.value)} placeholder="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Cuidados especiales de salud */}
              <label className="block text-base font-semibold text-white">Cuidados de Salud</label>
              <textarea value={necesidadesEspeciales} onChange={(e) => setNecesidadesEspeciales(e.target.value)} rows={3} placeholder="Especifique si aplica" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l border-neutral-700 md:pl-6 pt-2 md:pt-0">

            {/* Encargado Legal */}
            <h3 className="mb-4 text-xl font-bold text-sky-400">Datos del Encargado Legal</h3>
            <div className="space-y-2">
              {/* 1. Nombre Completo del Encargado Legal */}
              <label className="block text-base font-semibold text-white">Nombre Completo</label>
              <input
                value={encargadoNombre} onChange={(e) => setEncargadoNombre(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Número de Cédula */}
              <label className="block text-base font-semibold text-white">Número de Cédula</label>
              <input
                value={encargadoCedula} onChange={(e) => setEncargadoCedula(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Número de Teléfono */}
              <label className="block text-base font-semibold text-white">Número de Teléfono</label>
              <input
                type="tel" value={encargadoTelefono} onChange={(e) => setEncargadoTelefono(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Correo Electrónico */}
              <label className="block text-base font-semibold text-white">Correo Electrónico</label>
              <input
                type="email" value={encargadoEmail} onChange={(e) => setEncargadoEmail(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Ocupación */}
              <label className="block text-base font-semibold text-white">Ocupación</label>
              <input
                value={encargadoOcupacion} onChange={(e) => setEncargadoOcupacion(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Lugar de Trabajo (Número y Dirección Exacta) */}
              <label className="block text-base font-semibold text-white">Lugar de Trabajo (Número de Teléfono y Dirección Exacta)</label>
              <textarea
                value={lugarTrabajo} onChange={(e) => setLugarTrabajo(e.target.value)} rows={2} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            </div>

            <h4 className="mb-3 mt-6 text-lg font-semibold text-neutral-200">Personas Autorizadas a Recoger al Estudiante</h4>

            {/* BLOQUE DE UNA SOLA PERSONA AUTORIZADA */}
            <div className="rounded border border-neutral-700 p-4 space-y-2">
              <p className="text-sm font-semibold text-sky-400">Persona Autorizada</p>

              {/* Nombre */}
              <label className="block text-sm font-semibold text-white">Nombre Completo</label>
              <input
                value={personasAutorizadasNombre}
                onChange={(e) => setPersonasAutorizadasNombre(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-neutral-800 text-white text-sm"
              />

              {/* Relación */}
              <label className="block text-sm font-semibold text-white">Relación con el Estudiante</label>
              <input
                value={personasAutorizadasRelacion}
                onChange={(e) => setPersonasAutorizadasRelacion(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-neutral-800 text-white text-sm"
              />

              {/* Teléfono */}
              <label className="block text-sm font-semibold text-white">Número de Telefono</label>
              <input
                type="tel"
                value={personasAutorizadasTelefono}
                onChange={(e) => setPersonasAutorizadasTelefono(e.target.value)}
                className="w-full rounded border px-3 py-2 bg-neutral-800 text-white text-sm"
              />
            </div>

          </div>

        </div>

        {/* Botones Guardar / Cancelar */}
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={isLoading} className="rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-3 py-2 text-sm font-medium">{isLoading ? "Guardando. . ." : "Guardar"}</button>
          <button type="button" onClick={cancel} className="rounded bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-3 py-2 text-sm font-medium">Cancelar</button>
        </div>

        {msg && <p className="mt-3 text-sm text-neutral-200">{msg}</p>}
      </form>

      {/* Mensaje de validación debajo del formulario (se oculta cuando el modal está activo) */}
      {msg && !showModal && <p className="mt-3 text-sm text-neutral-200">{msg}</p>}
    </div>
  );
}