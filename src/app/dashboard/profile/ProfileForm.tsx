"use client";

import { useState } from "react";

export default function ProfileForm() {
  const raw = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const parsed = (() => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [username, setUsername] = useState(parsed?.username ?? parsed?.email ?? "");
  const [email, setEmail] = useState(parsed?.email ?? ""); //Correo (si lo tiene)
  const [nombre, setNombre] = useState(parsed?.nombre ?? "");
  const [cedula, setCedula] = useState(parsed?.cedula ?? "");
  const [genero, setGenero] = useState(parsed?.genero ?? "");
  const [nacionalidad, setNacionalidad] = useState(parsed?.nacionalidad ?? "");
  const [fechaNacimiento, setFechaNacimiento] = useState(parsed?.fechaNacimiento ?? "");
  const [telefonoEstudiante, setTelefonoEstudiante] = useState(parsed?.telefonoEstudiante ?? ""); // Teléfono (si lo tiene)
  const [direccion, setDireccion] = useState(parsed?.direccion ?? "");
  const [nivelEscolar, setNivelEscolar] = useState(parsed?.nivelEscolar ?? "");
  const [institucionEducativa, setInstitucionEducativa] = useState(parsed?.institucionEducativa ?? "");
  const [polizaEstudiantil, setPolizaEstudiantil] = useState(parsed?.polizaEstudiantil ?? ""); // Poliza (si la tiene)
  const [necesidadesEspeciales, setNecesidadesEspeciales] = useState(parsed?.necesidadesEspeciales ?? "");

  const [encargadoNombre, setEncargadoNombre] = useState(parsed?.encargadoNombre ?? "");
  const [encargadoCedula, setEncargadoCedula] = useState(parsed?.encargadoCedula ?? "");
  const [encargadoTelefono, setEncargadoTelefono] = useState(parsed?.encargadoTelefono ?? "");
  const [encargadoEmail, setEncargadoEmail] = useState(parsed?.encargadoEmail ?? "");
  const [encargadoOcupacion, setEncargadoOcupacion] = useState(parsed?.encargadoOcupacion ?? "");
  const [lugarTrabajo, setLugarTrabajo] = useState(parsed?.lugarTrabajo ?? "");

  const [personasAutorizadas, setPersonasAutorizadas] = useState<any[]>(parsed?.personasAutorizadas ?? [{ nombre: "", relacion: "", cedula: "" }]);

  const [msg, setMsg] = useState<string | null>(null);

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // modal-local inputs
  const [modalUsername, setModalUsername] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalConfirmPwd, setModalConfirmPwd] = useState("");
  const [modalOldPwd, setModalOldPwd] = useState("");
  const [modalPasswordError, setModalPasswordError] = useState<string | null>(null);

  function save(e: React.FormEvent) {
    e.preventDefault();
    // Validación mínima
    if (!username.trim()) return setMsg("El nombre de usuario es requerido");
    if (!email.trim()) return setMsg("El correo es requerido");
    if (!nombre.trim()) return setMsg("El nombre es requerido");
    if (!cedula.trim()) return setMsg("La Cédula es requerida");
    if (!genero.trim()) return setMsg("El Género es requerido");
    if (!nacionalidad.trim()) return setMsg("La Nacionalidad es requerida");
    if (!fechaNacimiento.trim()) return setMsg("La Fecha de Nacimiento es requerida");
    if (!direccion.trim()) return setMsg("La Dirección es requerida");
    if (!nivelEscolar.trim()) return setMsg("El Nivel Escolar es requerido");
    if (!institucionEducativa.trim()) return setMsg("La Institución Educativa es requerida");
    // VALIDACIÓN DEL ENCARGADO
    if (!encargadoNombre.trim()) return setMsg("El nombre del encargado legal es requerido");
    if (!encargadoCedula.trim()) return setMsg("La cédula del encargado legal es requerida");
    if (!encargadoTelefono.trim()) return setMsg("El teléfono del encargado legal es requerido");
    if (!encargadoEmail.trim()) return setMsg("El correo del encargado legal es requerido");
    if (!encargadoOcupacion.trim()) return setMsg("La ocupación del encargado legal es requerida");
    if (!lugarTrabajo.trim()) return setMsg("El lugar de trabajo del encargado legal es requerido");

    const validAuthorized = personasAutorizadas.filter(pa => pa.nombre.trim() && pa.relacion.trim() && pa.cedula.trim());
    if (validAuthorized.length === 0) return setMsg("Debe agregar al menos una persona autorizada con todos los campos completos");

    try {
      const newUser: any = {
        ...(parsed ?? {}),
        username: username.trim(),
        email: email.trim(),
        nombre: nombre.trim(),
        cedula: cedula.trim(),
        genero: genero.trim(),
        nacionalidad: nacionalidad.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        telefonoEstudiante: telefonoEstudiante.trim(),
        direccion: direccion.trim(),
        nivelEscolar: nivelEscolar.trim(),
        institucionEducativa: institucionEducativa.trim(),
        polizaEstudiantil: polizaEstudiantil.trim(),
        necesidadesEspeciales: necesidadesEspeciales.trim(),

        //encargado legal
        encargadoNombre: encargadoNombre.trim(),
        encargadoCedula: encargadoCedula.trim(),
        encargadoTelefono: encargadoTelefono.trim(),
        encargadoEmail: encargadoEmail.trim(),
        encargadoOcupacion: encargadoOcupacion.trim(),
        lugarTrabajo: lugarTrabajo.trim(),

        personasAutorizadas: validAuthorized,
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

  // modal handlers
  function openUsernameModal() {
    setModalUsername(username);
    setShowUsernameModal(true);
  }
  function saveUsernameModal() {
    if (!modalUsername.trim()) return setMsg("El nombre de usuario es requerido");
    setUsername(modalUsername.trim());
    setShowUsernameModal(false);
    setMsg("Usuario actualizado");
  }

  function openEmailModal() {
    setModalEmail(email);
    setShowEmailModal(true);
  }
  function saveEmailModal() {
    if (!modalEmail.trim()) return setMsg("El correo es requerido");
    setEmail(modalEmail.trim());
    setShowEmailModal(false);
    setMsg("Correo actualizado");
  }

  function openPasswordModal() {
    setModalPassword("");
    setModalConfirmPwd("");
    setModalOldPwd("");
    setModalPasswordError(null);
    setShowPasswordModal(true);
  }
  async function savePasswordModal() {
    // validar cliente
    setModalPasswordError(null);
    if (!modalOldPwd) return setModalPasswordError("La contraseña anterior es requerida");
    if (!modalPassword) return setModalPasswordError("La nueva contraseña es requerida");
    if (modalPassword.length < 6) return setModalPasswordError("La contraseña debe tener al menos 6 caracteres");
    if (modalPassword !== modalConfirmPwd) return setModalPasswordError("Las contraseñas no coinciden");

    try {
      const cur = JSON.parse(sessionStorage.getItem("user") || "null");
      const userId = cur?.id;
      if (!userId) return setMsg("No se encontró el usuario en sesión");

      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, oldPassword: modalOldPwd, newPassword: modalPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // show error specifically under the old password field when it's related
        const err = data?.error || 'Error al cambiar la contraseña';
        setModalPasswordError(err);
        return;
      }

      // Success
      setModalPasswordError(null);
      setShowPasswordModal(false);
      setModalPassword('');
      setModalConfirmPwd('');
      setModalOldPwd('');
      setMsg('Contraseña actualizada correctamente');
    } catch (e) {
      console.error(e);
      setMsg('Error al cambiar la contraseña');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Username modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="w-full max-w-md rounded border border-neutral-800 bg-neutral-900/90 p-6">
            <h3 className="mb-3 text-lg font-semibold">Cambiar usuario</h3>
            <input value={modalUsername} onChange={(e) => setModalUsername(e.target.value)} className="w-full rounded border px-3 py-2 bg-neutral-800 text-white" />
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowUsernameModal(false)} className="rounded bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-3 py-2 text-sm">Cancelar</button>
              <button onClick={saveUsernameModal} className="rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-3 py-2 text-sm">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="w-full max-w-md rounded border border-neutral-800 bg-neutral-900/90 p-6">
            <h3 className="mb-3 text-lg font-semibold">Cambiar correo</h3>
            <input type="email" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} className="w-full rounded border px-3 py-2 bg-neutral-800 text-white" />
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowEmailModal(false)} className="rounded bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-3 py-2 text-sm">Cancelar</button>
              <button onClick={saveEmailModal} className="rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-3 py-2 text-sm">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="w-full max-w-md rounded border border-neutral-800 bg-neutral-900/90 p-6">
            <h3 className="mb-3 text-lg font-semibold">Cambiar contraseña</h3>
            <label htmlFor="old-pwd" className="block text-sm text-neutral-300">Contraseña actual</label>
            <input type="password" placeholder="Contraseña actual" value={modalOldPwd} onChange={(e) => setModalOldPwd(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            <label htmlFor="new-pwd" className="block text-sm text-neutral-300 mt-4">Nueva contraseña</label>
            <input type="password" placeholder="Nueva contraseña" value={modalPassword} onChange={(e) => setModalPassword(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            <label htmlFor="confirm-pwd" className="block text-sm text-neutral-300 mt-4">Confirmar contraseña</label>
            <input type="password" placeholder="Confirmar contraseña" value={modalConfirmPwd} onChange={(e) => setModalConfirmPwd(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            {modalPasswordError && <p className="mt-2 text-sm text-rose-500">{modalPasswordError}</p>}
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowPasswordModal(false)} className="rounded bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-3 py-2 text-sm">Cancelar</button>
              <button onClick={savePasswordModal} className="rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-3 py-2 text-sm">Guardar</button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={save} className="rounded border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-4 text-lg font-semibold">Editar perfil</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Estudiante */}
          <div className="flex-1 min-w-0">
            <h3 className="mb-4 text-xl font-bold text-sky-400">Datos del Estudiante</h3>

            <div className="space-y-2">

              <div>
                <label className="block text-base font-semibold text-white">Usuario</label>
                <div className="mt-1 flex gap-2 items-center">
                  <span className="text-neutral-200 rounded bg-neutral-800 px-3 py-1 flex-grow">{username || "—"}</span>
                  <button type="button" onClick={openUsernameModal} className="ml-auto rounded bg-sky-600 hover:bg-sky-700 active:bg-sky-800 px-3 py-1 text-sm">Cambiar usuario</button>
                </div>
              </div>


              <div>
                <label className="block text-base font-semibold text-white">Correo</label>
                <div className="mt-1 flex gap-2 items-center">
                  <span className="text-neutral-200 rounded bg-neutral-800 px-3 py-1 flex-grow">{email || "—"}</span>
                  <button type="button" onClick={openEmailModal} className="ml-auto rounded bg-sky-600 hover:bg-sky-700 active:bg-sky-800 px-3 py-1 text-sm">Cambiar correo</button>
                </div>
              </div>

              <div className="pt-2"> 
                <button type="button" onClick={openPasswordModal} className="rounded bg-sky-600 hover:bg-sky-700 active:bg-sky-800 px-3 py-2 text-sm">Cambiar contraseña</button>
              </div>

              <div className="border-t border-neutral-700 pt-2"></div>

              {/* 1. Nombre Completo */}
              <label className="block text-base font-semibold text-white">Nombre Completo</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 2. Número de Cédula */}
              <label className="block text-base font-semibold text-white">Número de Cédula</label>
              <input value={cedula} onChange={(e) => setCedula(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 3. Género (Usando select para mejor control) */}
              <label className="block text-base font-semibold text-white">Género</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white">
                <option value="">Seleccione...</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro/No especificado</option>
              </select>

              {/* 4. Nacionalidad */}
              <label className="block text-base font-semibold text-white">Nacionalidad</label>
              <input value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 5. Fecha de Nacimiento */}
              <label className="block text-base font-semibold text-white">Fecha de Nacimiento</label>
              <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 6. Teléfono del Estudiante (Si lo tiene) */}
              <label className="block text-base font-semibold text-white">Número de Teléfono (si lo tiene)</label>
              <input type="tel" placeholder="Opcional" value={telefonoEstudiante} onChange={(e) => setTelefonoEstudiante(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 7. Dirección del Domicilio (Usando textarea para más espacio) */}
              <label className="block text-base font-semibold text-white">Dirección del Domicilio (Provincia, Cantón, etc.)</label>
              <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} rows={3} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 8. Nivel Escolar MEP */}
              <label className="block text-base font-semibold text-white">Nivel Escolar (MEP)</label>
              <input value={nivelEscolar} onChange={(e) => setNivelEscolar(e.target.value)} placeholder="Ej: Tercer Grado" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 9. Nombre de la Institución Educativa del MEP */}
              <label className="block text-base font-semibold text-white">Nombre de la Institución Educativa (MEP)</label>
              <input value={institucionEducativa} onChange={(e) => setInstitucionEducativa(e.target.value)} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 10. Póliza Estudiantil (si la tiene) */}
              <label className="block text-base font-semibold text-white">Póliza Estudiantil (si la tiene)</label>
              <input value={polizaEstudiantil} onChange={(e) => setPolizaEstudiantil(e.target.value)} placeholder="Opcional" className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />

              {/* 11. Necesidades especiales de aprendizaje o cuidados especiales de salud */}
              <label className="block text-base font-semibold text-white">Necesidades Especiales o Cuidados de Salud</label>
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
              <label className="block text-base font-semibold text-white">Lugar de Trabajo (Número y Dirección Exacta)</label>
              <textarea
                value={lugarTrabajo} onChange={(e) => setLugarTrabajo(e.target.value)} rows={2} className="w-full mt-1 rounded border px-3 py-2 bg-neutral-800 text-white" />
            </div>

            <h4 className="mb-3 mt-6 text-lg font-semibold text-neutral-200">Personas Autorizadas a Recoger al Estudiante</h4>

            {personasAutorizadas.map((person, index) => (
              <div key={index} className="rounded border border-neutral-700 p-4 mb-2 space-y-2">
                <p className="text-sm font-medium text-neutral-400">Persona #{index + 1}</p>

                {/* Nombre */}
                <label className="block text-sm font-semibold text-white">Nombre Completo</label>
                <input
                  value={person.nombre}
                  onChange={(e) => {
                    const newAuth = [...personasAutorizadas];
                    newAuth[index].nombre = e.target.value;
                    setPersonasAutorizadas(newAuth);
                  }}
                  className="w-full rounded border px-3 py-2 bg-neutral-800 text-white text-sm"
                />

                {/* Relación */}
                <label className="block text-sm font-semibold text-white">Relación con el Estudiante</label>
                <input
                  value={person.relacion}
                  onChange={(e) => {
                    const newAuth = [...personasAutorizadas];
                    newAuth[index].relacion = e.target.value;
                    setPersonasAutorizadas(newAuth);
                  }}
                  className="w-full rounded border px-3 py-2 bg-neutral-800 text-white text-sm"
                />

                {/* Cédula */}
                <label className="block text-sm font-semibold text-white">Número de Cédula</label>
                <input
                  value={person.cedula}
                  onChange={(e) => {
                    const newAuth = [...personasAutorizadas];
                    newAuth[index].cedula = e.target.value;
                    setPersonasAutorizadas(newAuth);
                  }}
                  className="w-full rounded border px-3 py-2 bg-neutral-800 text-white text-sm"
                />

                <div className="flex justify-end pt-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => setPersonasAutorizadas(personasAutorizadas.filter((_, i) => i !== index))}
                      className="rounded bg-rose-600 hover:bg-rose-700 px-3 py-1 text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPersonasAutorizadas([...personasAutorizadas, { nombre: "", relacion: "", cedula: "" }])}
                className="rounded bg-sky-600 hover:bg-sky-700 active:bg-sky-800 px-3 py-1 text-sm font-medium mt-2"
              >
                + Añadir Persona Autorizada
              </button>
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
