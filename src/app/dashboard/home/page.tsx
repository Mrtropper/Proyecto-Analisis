import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen flex flex-col ">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 border-b">
        <div className="mx-auto max-w-7xl h-16 flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="h-12 w-auto">
              {/* contenedor controlado */}
              <Image
                src="/logo.png"
                alt="SINEM"
                width={300}
                height={100}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>

          <Link
            href="/auth/login"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-white text-sm font-medium hover:bg-neutral-800 transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <section className="relative flex-grow flex items-center justify-center pt-20 pb-28 overflow-hidden">
        {/* Capa 1: relleno (cover) */}
        <Image
          src="/image-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover blur-[6px] scale-110 opacity-40 z-0"
          quality={100}
          aria-hidden
        />

        {/* Capa 2: imagen completa (contain) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <Image
            src="/bg-image-2.png"
            alt="Fondo musical"
            width={2560} // ajusta a la resolución real de tu imagen
            height={1440}
            priority
            quality={100}
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        </div>

        {/* Contenido central */}
        {/* <div className="relative z-20 mx-auto max-w-7xl w-full px-6 pointer-events-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white/90 p-6 shadow">
              <h3 className="font-semibold text-neutral-800">Módulo 1</h3>
              <p className="text-sm text-neutral-600">
                Coloca aquí el resumen/atajos del módulo.
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-6 shadow">
              <h3 className="font-semibold text-neutral-800">Módulo 2</h3>
              <p className="text-sm text-neutral-600">
                KPIs, accesos rápidos, etc.
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-6 shadow">
              <h3 className="font-semibold text-neutral-800">Módulo 3</h3>
              <p className="text-sm text-neutral-600">
                Más contenido del dashboard.
              </p>
            </div>
          </div>
        </div> */}
      </section>

      {/* FOOTER */}
      <footer className="fixed bottom-0 inset-x-0 z-50 bg-white/95 border-t flex justify-center items-center py-2">
        <Image
          src="/footer.png"
          alt="SINEM"
          width={500} // ancho deseado (ajústalo a lo que se vea mejor)
          height={150} // alto proporcional
          className="object-contain"
          priority
        />
      </footer>
    </div>
  );
}
