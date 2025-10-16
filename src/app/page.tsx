export default function Home() {
  return (
    <main className="p-8 text-white flex flex-col items-center">
      {/* GIF en lugar del título */}
      <img src="/img/emoji-1-1.gif" alt="Animación de bienvenida"className="w-64 h-64 object-contain" />

      <p className="mt-4">Ir al login:</p>
      <a
        href="/auth/login"
        className="mt-3 inline-block rounded-lg bg-white px-4 py-2 font-semibold text-black"
      >
        Iniciar Sex sion
      </a>
    </main>
  );
}