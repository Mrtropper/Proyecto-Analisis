"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisteredBannerOnce() {
  const sp = useSearchParams();
  const isRegistered = sp.get("registered") === "1";

  // Al montarse: si viene ?registered=1, mostramos el banner
  // y limpiamos el query de la URL sin recargar la página.
  useEffect(() => {
    if (isRegistered) {
      const url = new URL(window.location.href);
      url.searchParams.delete("registered");
      // No disparamos navegación de Next; solo limpiamos el query en el history.
      window.history.replaceState(null, "", url.toString());
    }
  }, [isRegistered]);

  if (!isRegistered) return null;

  return (
    <div
      className="mb-4 rounded-lg border border-emerald-700/60 bg-emerald-900/30 p-3 text-sm text-emerald-200"
      role="status"
    >
      ✅ Registro exitoso. Ahora puedes iniciar sesión.
    </div>
  );
}
