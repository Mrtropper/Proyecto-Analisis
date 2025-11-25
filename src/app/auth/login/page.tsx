import Image from "next/image";
import Link from "next/link";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 border-b">
        <div className="mx-auto max-w-7xl h-16 flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="h-12 w-auto">
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
            href="/"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-white text-sm font-medium hover:bg-neutral-800 transition"
          >
            Salir
          </Link>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <section className="relative flex-grow flex items-center justify-center pt-20 pb-28 overflow-hidden">
        {/* Fondo difuminado */}
        <Image
          src="/image-bg.png"
          alt="Fondo musical"
          fill
          priority
          sizes="100vw"
          className="object-cover blur-[6px] scale-110 opacity-50 z-0"
          quality={100}
          aria-hidden
        />

        {/* Contenedor del formulario */}
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 p-6 shadow-xl">
          <LoginForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fixed bottom-0 inset-x-0 z-50 bg-white/95 border-t flex justify-center items-center py-2">
        <Image
          src="/footer.png"
          alt="SINEM"
          width={500}
          height={150}
          className="object-contain"
          priority
        />
      </footer>
    </div>
  );
}
