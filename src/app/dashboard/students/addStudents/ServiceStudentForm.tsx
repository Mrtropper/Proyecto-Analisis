"use client";

import { useState } from "react";

export default function ServiceStudentForm() {
  const raw = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const parsed = (() => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();


  const [email, setEmail] = useState(parsed?.email ?? ""); 
  const [nombre, setNombre] = useState(parsed?.nombre ?? "");
  const [cedula, setCedula] = useState(parsed?.cedula ?? "");
  const [genero, setGenero] = useState(parsed?.genero ?? "");
  const [nacionalidad, setNacionalidad] = useState(parsed?.nacionalidad ?? "");
  const [fechaNacimiento, setFechaNacimiento] = useState(parsed?.fechaNacimiento ?? "");
  const [telefonoEstudiante, setTelefonoEstudiante] = useState(parsed?.telefonoEstudiante ?? ""); 
  const [direccion, setDireccion] = useState(parsed?.direccion ?? "");
  const [poliza, setPoliza] = useState(parsed?.poliza ?? ""); // Poliza (si la tiene)
  const [necesidadesEspeciales, setNecesidadesEspeciales] = useState(parsed?.necesidadesEspeciales ?? "");

  const [msg, setMsg] = useState<string | null>(null);

  function save(e: React.FormEvent) {
    e.preventDefault();
    // Validación mínima
    if (!nombre.trim()) return setMsg("El nombre es requerido");
    if (!cedula.trim()) return setMsg("La Cédula es requerida");
    if (!email.trim()) return setMsg("El Email es requerido");
    if (!genero.trim()) return setMsg("El Género es requerido");
    if (!nacionalidad.trim()) return setMsg("La Nacionalidad es requerida");
    if (!fechaNacimiento.trim()) return setMsg("La Fecha de Nacimiento es requerida");
    if (!direccion.trim()) return setMsg("La Dirección es requerida");

    try {
      const newUser: any = {
        ...(parsed ?? {}),
        nombre: nombre.trim(),
        cedula: cedula.trim(),
        email: email.trim(),
        genero: genero.trim(),
        nacionalidad: nacionalidad.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        telefonoEstudiante: telefonoEstudiante.trim(),
        direccion: direccion.trim(),
        poliza: poliza.trim(),
        necesidadesEspeciales: necesidadesEspeciales.trim(),
      };
      // Nota: almacenamiento local provisional. No es seguro para contraseñas reales.
      sessionStorage.setItem("user", JSON.stringify(newUser));
      setMsg("Perfil guardado (solo local, provisional)");
    } catch (e) {
      console.error(e);
      setMsg("Error al guardar");
    }
  }

  function cancel() {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }
  
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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

              {/* Instrumento*/}
              <label className="block text-base font-semibold text-white">Instrumento</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

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
              <label className="block text-base font-semibold text-white">Número de Teléfono (si lo tiene)</label>
              <input type="tel" placeholder="Opcional" value={telefonoEstudiante} onChange={(e) => setTelefonoEstudiante(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Nombre Completo */}
              <label className="block text-base font-semibold text-white">Correo </label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)}  placeholder ="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Dirección del Domicilio (Usando textarea para más espacio) */}
              <label className="block text-base font-semibold text-white">Dirección del Domicilio (Provincia, Cantón, etc.)</label>
              <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} rows={3} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Póliza Estudiantil (si la tiene) */}
              <label className="block text-base font-semibold text-white">Póliza (si la tiene)</label>
              <input value={poliza} onChange={(e) => setPoliza(e.target.value)} placeholder="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* Cuidados especiales de salud */}
              <label className="block text-base font-semibold text-white">Cuidados de Salud</label>
              <textarea value={necesidadesEspeciales} onChange={(e) => setNecesidadesEspeciales(e.target.value)} rows={3} placeholder="Especifique si aplica" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            </div>
          </div>
            
        </div>

        <div className="mt-4 flex gap-2">
          <button type="submit" className="rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-3 py-2 text-sm font-medium">Guardar</button>
          <button type="button" onClick={cancel} className="rounded bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-3 py-2 text-sm font-medium">Cancelar</button>
        </div>

        {msg && <p className="mt-3 text-sm text-neutral-200">{msg}</p>}
      </form>
    </div>
  );
}